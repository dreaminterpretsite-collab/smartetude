'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, FileText, Lock, Unlock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { trackCourseVisit, type CourseInfo } from '@/lib/course-visits';
import { useToast } from '@/hooks/use-toast';
import { ContentViewer } from '@/components/content-viewer';
import { useFirebase } from '@/firebase/client-provider';

const courseInfo: CourseInfo = {
  id: 'svt-seconde-a',
  name: 'SVT Seconde A',
  url: '/courses/svt-seconde-a',
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
    { num: 1, title: "La diversité des comportements alimentaires de l'homme", pdfHref: 'https://drive.google.com/file/d/1iZF4FEBtk3UDDIMXvi8mBz6v8teXPYY1/preview', videoHref: '#' },
    { num: 2, title: "Les habitudes alimentaires et la santé de l'homme", pdfHref: 'https://drive.google.com/file/d/1qKuhBq9f4wtiOKg_wk1RpVn1AaVSj17B/preview', videoHref: '#' },
    { num: 3, title: "La transmission du message nerveux", pdfHref: 'https://drive.google.com/file/d/1ScvvOkFGlAuRqzpziR0wkn5gUIWz4rWf/preview', videoHref: '#' },
    { num: 4, title: "La transmission d'un message hormonal", pdfHref: 'https://drive.google.com/file/d/1Ci4zZT9TTGQcz3L9GJaQWA-TpwLFqelW/preview', videoHref: '#' },
    { num: 5, title: "Les grands ensembles environnementaux", pdfHref: 'https://drive.google.com/file/d/1_bSNkpImBtppCMOLCGmGgIyh1vra03CF/preview', videoHref: '#' },
    { num: 6, title: "La production de la matière organique", pdfHref: 'https://drive.google.com/file/d/1dED5M8GHQujFjk477e-dpIScoNtiyWX7/preview', videoHref: '#' },
    { num: 7, title: "Le changement climatique", pdfHref: 'https://drive.google.com/file/d/1JSvFDt3OygOEiIbz_9rKmwbXr5eIkkNW/preview', videoHref: '#' },
    { num: 8, title: "La structure d'une cellule animale", pdfHref: 'https://drive.google.com/file/d/1gwlxwUl_pEGr3m_NSCIg37qIcOF-Qm5m/preview', videoHref: '#' },
    { num: 9, title: "La reproduction conforme de la cellule", pdfHref: 'https://drive.google.com/file/d/1FU_Kg1a-YxSlW4y5miWakhcc4X9K8ddt/preview', videoHref: '#' },
].sort((a, b) => a.num - b.num);

export default function SvtSecondeAPage() {
  const { userProfile, hasCourseAccess } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' | 'video' } | null>(null);
  const hasAccess = hasCourseAccess && userProfile?.className === 'seconde';

  const handleLockedContent = () => {
    if (!userProfile) return;
    let message = "Vous n'avez pas accès à ce contenu.";
    if (!hasCourseAccess) {
        message = "Veuillez débloquer l'accès aux cours depuis votre tableau de bord.";
    } else if (userProfile.className !== 'seconde') {
        message = "Ce contenu est réservé aux élèves de Seconde.";
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
        <p className="text-sm font-medium text-primary">Seconde A</p>
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
