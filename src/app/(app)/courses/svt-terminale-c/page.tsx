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
  id: 'svt-terminale-c',
  name: 'SVT Terminale C',
  url: '/courses/svt-terminale-c',
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
    { num: 1, title: 'La communication nerveuse', pdfHref: 'https://drive.google.com/file/d/1A4b_yMyFR3ZuxdjzQd9pry6EMRQzmTRF/preview', videoHref: 'https://drive.google.com/file/d/1xBTvnBfeAZ1oEGJp44xT2_XDO-gxzuh1/preview' },
    { num: 2, title: 'Les drogues et le système nerveux', pdfHref: 'https://drive.google.com/file/d/1-w1E-hh3KUCV-u6tWOOqF6n1Tek04B_8/preview', videoHref: '#' },
    { num: 3, title: 'La production d\'énergie par la cellule', pdfHref: 'https://drive.google.com/file/d/1sCnK05ws5OQSYkzQwR1F7PyGEixlK72q/preview', videoHref: 'https://drive.google.com/file/d/1lyc91HOzhn0lr0KtAkgj_rYzTsExX75q/preview' },
    { num: 4, title: 'L\'utilisation de l\'énergie par la cellule musculaire', pdfHref: 'https://drive.google.com/file/d/1GTZT6r_44DuQY3vHc_kDup_-tBI_DCsG/preview', videoHref: 'https://drive.google.com/file/d/1ZeRCo7uu6HWke89M43wP-34AKXXZcpvU/preview' },
    { num: 5, title: 'Le système de défense de l\'organisme', pdfHref: 'https://drive.google.com/file/d/11fKNnhNUUFKhQdH2vimsSY5zkIHi4uoG/preview', videoHref: 'https://drive.google.com/file/d/1vsB8ykUP9pNnG9ivrIz77qKj7BmGJDj0/preview' },
    { num: 6, title: 'L\'infection de l\'organisme par le VIH', pdfHref: 'https://drive.google.com/file/d/1PFzjaTbzmc-exfxsueZFN3hRlQaf2GzU/preview', videoHref: '#' },
    { num: 7, title: 'Les cycles sexuels chez la femme', pdfHref: 'https://drive.google.com/file/d/1OeoabIHkfEkwOc4l8b0L1gi6Zx70DyoL/preview', videoHref: '#' },
    { num: 8, title: 'La transmission d\'un caractère héréditaire chez l\'Homme', pdfHref: 'https://drive.google.com/file/d/14hIRXw9bKA-9PURxKfFArM-cUQTG0yw_/preview', videoHref: '#' },
    { num: 9, title: 'La mise en place des gisements pétrolifères', pdfHref: 'https://drive.google.com/file/d/1gIFxcZCLm820zeP3fKmibwduoDiBHq8i/preview', videoHref: '#' },
    { num: 10, title: 'L\'exploitation des gisements pétrolifères', pdfHref: 'https://drive.google.com/file/d/1In2aLp0R39LmdLWDda6rkK3jzjoZ5xSH/preview', videoHref: 'https://drive.google.com/file/d/1gn31W5p5DLUJLCPm3Nq9aYt7ee_KTMfC/preview' },
    { num: 11, title: 'L\'amélioration de la fertilité des sols', pdfHref: 'https://drive.google.com/file/d/1bIzpDG8yhdbQrzveTL51JhY7nkXsfsm9/preview', videoHref: '#' },
];

export default function SvtTerminaleCPage() {
  const { userProfile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' | 'video' } | null>(null);
  
  const hasAccess = isAdmin || (userProfile && userProfile?.solde > 0 && userProfile?.className === 'terminale');

  const handleLockedContent = () => {
    if (!userProfile || hasAccess) return;
    if (userProfile.solde <= 0) {
      toast({
        title: 'Contenu Verrouillé',
        description: "Votre solde est épuisé. Veuillez recharger votre compte pour accéder à ce cours.",
        variant: 'destructive',
      });
    } else if (userProfile.className !== 'terminale') {
        toast({
            title: 'Accès non autorisé',
            description: "Ce contenu est réservé aux élèves de Terminale. Veuillez vous connecter avec un compte correspondant.",
            variant: 'destructive',
        });
    }
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
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setViewerContent(null);
          }
        }} 
      />
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Terminale C</p>
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
