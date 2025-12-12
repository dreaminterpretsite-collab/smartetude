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
  id: 'svt-seconde-c',
  name: 'SVT Seconde C',
  url: '/courses/svt-seconde-c',
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
    { num: 2, title: 'L\'altération chimique des roches magmatiques', pdfHref: 'https://drive.google.com/file/d/1Uv8jtCw1Ovrbu2T6Qq0giIh5bNWcjzta/preview' },
    { num: 3, title: 'La formation des roches sédimentaires', pdfHref: 'https://drive.google.com/file/d/1txKEhWot09gOzkZfZcRPWIior3mya25t/preview' },
    { num: 4, title: 'La formation des roches métamorphiques', pdfHref: 'https://drive.google.com/file/d/1zF3LsjDF56Oc5likPBSchtUYyQGEEC6j/preview' },
    { num: 5, title: 'Le devenir des roches métamorphiques', pdfHref: 'https://drive.google.com/file/d/1E_lqVPT0O1CIz20y9KwF3Eg-a-CEhA7W/preview' },
    { num: 6, title: 'Les relations entre les êtres vivants dans un écosystème', pdfHref: 'https://drive.google.com/file/d/1vdZtY3Umv94VuYyFC5-XKl5L72sjFvY_/preview' },
    { num: 7, title: 'Le changement climatique', pdfHref: 'https://drive.google.com/file/d/1GLX1qsPqUpZQSaP6A9ft5OeDQbI-cDPy/preview' },
    { num: 8, title: 'L\'organisation d\'une cellule', pdfHref: 'https://drive.google.com/file/d/14XYS60AXqAhxshO91NPvG1kekLYHSbHT/preview' },
    { num: 9, title: 'La division cellulaire', pdfHref: 'https://drive.google.com/file/d/1zuLCkiV8ju9QxkJIlKvSyIwLjmd4iUGL/preview' },
    { num: 10, title: 'L\'évolution de l\'équipement chromosomique d\'une cellule', pdfHref: 'https://drive.google.com/file/d/1vchjQjlS7yw24QR95yYzZ7jGu9FdtD_F/preview' },
    { num: 11, title: 'L\'absorption de l\'eau par la plante', pdfHref: 'https://drive.google.com/file/d/1JCEiTPegah0LWvci9e9GgA8JKGpTzP67/preview' },
    { num: 12, title: 'L\'influence des sels minéraux sur la croissance de la plante verte', pdfHref: 'https://drive.google.com/file/d/1KquxnvW_EnZajPd2sFdS11PMbOY-Dtp2/preview' },
    { num: 13, title: 'L\'absorption des sels minéraux par la plante verte', pdfHref: 'https://drive.google.com/file/d/1vI09xEWMmj14UwAGO-OlXlNCgX2UDMLn/preview' },
    { num: 14, title: 'Le devenir des substances absorbées par la plante verte', pdfHref: 'https://drive.google.com/file/d/1ltZxmBG9GG3SlWKECNyggBqKsF6noulh/preview' },
];


export default function SvtSecondeCPage() {
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
        <p className="text-sm font-medium text-primary">Seconde C</p>
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
