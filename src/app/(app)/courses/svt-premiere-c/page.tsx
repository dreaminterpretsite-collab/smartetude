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
  id: 'svt-premiere-c',
  name: 'SVT Première C',
  url: '/courses/svt-premiere-c',
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
    { num: 1, title: 'La structure interne du globe terrestre', pdfHref: 'https://drive.google.com/file/d/1XG-3Dw3yNWW7xCZ3Qi6BZoHMrHJcRMC7/preview', videoHref: '#' },
    { num: 3, title: 'Les échanges d\'ions au niveau du sol', pdfHref: 'https://drive.google.com/file/d/1m1LDHo4nWOejkBuc872yPay6bVIJIQkf/preview', videoHref: '#' },
    { num: 4, title: 'La gamétogénèse chez les mammifères', pdfHref: 'https://drive.google.com/file/d/1lErmiWBSZtMyeEdGLP-3Ng4IHenmHQgC/preview', videoHref: '#' },
    { num: 5, title: 'La fécondation chez les mammifères', pdfHref: 'https://drive.google.com/file/d/18JhbuJ7OoUUOTyEVG7LrKWdmrNPfbfgS/preview', videoHref: '#' },
    { num: 6, title: 'La synthèse des protéines', pdfHref: 'https://drive.google.com/file/d/1-U7h94ba68W5t3fX2o5feUmHVDLvvTDU/preview', videoHref: '#' },
    { num: 7, title: 'La transmission d\'un caractère héréditaire', pdfHref: 'https://drive.google.com/file/d/1COrEV54O4Cswf3fouF-8uBy2iKI9BrZa/preview', videoHref: '#' },
    { num: 8, title: 'La photosynthèse', pdfHref: 'https://drive.google.com/file/d/1sCG4Pf6FT2pkB-W1EWIzB5A1X_eTWwdV/preview', videoHref: '#' },
    { num: 9, title: 'Ecosystème naturel et agrosystème', pdfHref: 'https://drive.google.com/file/d/1vOWvqdIgam3Wd388swKu1p3owL95DRTg/preview', videoHref: '#' },
];

export default function SvtPremiereCPage() {
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
        <p className="text-sm font-medium text-primary">Première C</p>
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
              <Button variant="outline" disabled={!hasAccess} onClick={() => hasAccess ? openViewer(lesson.videoHref, 'video') : handleLockedContent()}>
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
