'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, FileText, Lock, Unlock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { trackCourseVisit, type CourseInfo } from '@/lib/course-visits';
import { useToast } from '@/hooks/use-toast';
import { ContentViewer } from '@/components/content-viewer';
import { useFirebase } from '@/firebase';

const courseInfo: CourseInfo = {
  id: 'svt-premiere-d',
  name: 'SVT Première D',
  url: '/courses/svt-premiere-d',
};

// A small component to handle the tracking logic
function CourseTracker() {
  const { firestore } = useFirebase();
  useEffect(() => {
    if (firestore) {
      trackCourseVisit(firestore, courseInfo);
    }
  }, [firestore]);
  return null;
}

const lessons = [
    { num: 1, title: 'Les réflexes innés', pdfHref: 'https://drive.google.com/file/d/1p7Mp7dt9sOwkA90ey2nxc0QCAc82hzYC/preview' },
    { num: 2, title: 'Les fonctions des gonades', pdfHref: 'https://drive.google.com/file/d/1IMY2MwSRZzh9Mk8xap36kqIV6GnLAEfh/preview' },
    { num: 3, title: 'LA GAMETOGENESE', pdfHref: 'https://drive.google.com/file/d/12zoYaNCqFMI5ezLh5tfY94PQdEjtrsY-/preview' },
    { num: 4, title: 'LA TRANSMISSION D\'UN CARACTERE HEREDITAIRE', pdfHref: 'https://drive.google.com/file/d/1DDnaTRUC2uSYBw2mP2Kls06fxBHCpr0N/preview' },
    { num: 5, title: 'La synthèse des protéines', pdfHref: 'https://drive.google.com/file/d/11hz0-6IWdAWSFJ6w0qKn9AOe9J7kEFbn/preview' },
    { num: 6, title: 'Les activités internes du globe terrestre', pdfHref: 'https://drive.google.com/file/d/1z5-novYZid9896zmkKMvJp12seswhLAA/preview' },
    { num: 7, title: 'Les mouvements des plaques lithosphériques', pdfHref: '#' },
    { num: 8, title: 'Les échanges d\'ions au niveau du sol', pdfHref: 'https://drive.google.com/file/d/1uMIYhjee5Aw3vAOkA7ws0Q97-dzkErKp/preview' },
    { num: 9, title: 'L\'évolution des sols tropicaux', pdfHref: 'https://drive.google.com/file/d/1COitbq_ddwJAA4bc3vwz99YICEXoM_WA/preview' },
    { num: 10, title: 'La production de matière organique', pdfHref: 'https://drive.google.com/file/d/1BL4YvAGReEHSjeEsll7kchP5P_HF8vYe/preview' },
    { num: 11, title: 'LA DIGESTION DES ALIMENTS', pdfHref: 'https://drive.google.com/file/d/1RKPAveNaVxBuaYq2HAhwNT0Pz_psSn26/preview' },
    { num: 12, title: 'L\'absorption des nutriments', pdfHref: 'https://drive.google.com/file/d/1nWt6PaK0Y9fcxWQDM7kGySKAtcRmbPsp/preview' },
];

export default function SvtPremiereDPage() {
  const { userProfile, hasCourseAccess } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' | 'video' } | null>(null);
  
  const hasAccess = hasCourseAccess && userProfile?.className === 'premiere';

  const handleLockedContent = () => {
    if (!userProfile) return;
    let message = "Vous n'avez pas accès à ce contenu.";
    if (!hasCourseAccess) {
        message = "Veuillez débloquer l'accès aux cours depuis votre tableau de bord.";
    } else if (userProfile.className !== 'premiere') {
        message = "Ce contenu est réservé aux élèves de Première.";
    }
    
    toast({
        title: 'Accès non autorisé',
        description: message,
        variant: 'destructive',
    });
  };

  const openViewer = (url: string, type: 'pdf' | 'video') => {
    if (url === '#') {
      toast({
        title: 'Contenu Indisponible',
        description: 'Cette ressource n\'est pas encore disponible.',
      });
      return;
    }
    setViewerContent({ url, type });
  };

  return (
    <div className="space-y-6">
      <CourseTracker />
      <ContentViewer 
        content={viewerContent} 
        onOpenChange={(isOpen) => !isOpen && setViewerContent(null)}
      />
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Première D</p>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Sciences de la Vie et de la Terre (SVT)
        </h1>
        <p className="text-muted-foreground">
          Liste des leçons disponibles pour cette matière.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {lessons.map((lesson) => (
          <Card key={lesson.num}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {hasAccess ? (
                  <Unlock className="h-5 w-5 text-green-500" />
                ) : (
                  <Lock className="h-5 w-5 text-red-500" />
                )}
                <span>
                  <span className="font-bold text-foreground">
                    Leçon {lesson.num}:
                  </span>{' '}
                  <span className="font-bold text-accent">{lesson.title}</span>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <Button variant="outline" disabled={!hasAccess} onClick={() => hasAccess ? openViewer('#', 'video') : handleLockedContent()}>
                <Video className="mr-2 h-4 w-4" />
                Cours Vidéo
              </Button>
              <Button variant="outline" disabled={!hasAccess} onClick={() => hasAccess ? openViewer(lesson.pdfHref, 'pdf') : handleLockedContent()}>
                <FileText className="mr-2 h-4 w-4" />
                Cours PDF
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
