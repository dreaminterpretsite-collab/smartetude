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
  id: 'philo-terminale-c',
  name: 'Philosophie Terminale C',
  url: '/courses/philo-terminale-c',
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
    { num: 1, title: 'La dissertation philosophique', pdfHref: 'https://drive.google.com/file/d/1_ZcTHDVPJ3BPFk39cQmRQHhZ9uuQQ0XO/preview', videoHref: '#' },
    { num: 2, title: 'Le commentaire de texte philosophique', pdfHref: 'https://drive.google.com/file/d/1YC7AP3ugxv02dQWkqqy0eubD6U1Sb2MA/preview', videoHref: '#' },
    { num: 3, title: 'La connaissance de l\'homme', pdfHref: 'https://drive.google.com/file/d/1ZwVdH31PWBvMpqnjlJZZ9UOU65DLqUQR/preview', videoHref: '#' },
    { num: 4, title: 'La vie en société', pdfHref: 'https://drive.google.com/file/d/1o83cm1inT5F6nZWPIkiWSQhMgwJgRFRg/preview', videoHref: '#' },
    { num: 5, title: 'Dieu et la religion', pdfHref: 'https://drive.google.com/file/d/15PjiUxVpuuJ-9kGqI0WDgOga5E7ldJOc/preview', videoHref: 'https://drive.google.com/file/d/1b776cSBCvMF13Jud97qfSIpd6g_mSX5D/preview' },
    { num: 6, title: 'L\'histoire et l\'humanité', pdfHref: 'https://drive.google.com/file/d/1m8jhTttBj_kBQyl-rByztvs66EU-CAYq/preview', videoHref: '#' },
    { num: 7, title: 'La valeur de la philosophie', pdfHref: 'https://drive.google.com/file/d/11baTUhFE-_S-c03UsPovAi4amXTh9rCR/preview', videoHref: 'https://drive.google.com/file/d/1GnK_uyDsTVj3n14zZhUOHQvcGPgnxSOY/preview' },
    { num: 8, title: 'Progrès et Bonheur', pdfHref: 'https://drive.google.com/file/d/1eC1CyI5UEAkMQ8ddp4KLtPC4OPG12-TE/preview', videoHref: 'https://drive.google.com/file/d/1FVc3jeWTksDnCtFsFllWNHNlzSvM6bTF/preview' },
    { num: 9, title: 'Langage et Vérité', pdfHref: 'https://drive.google.com/file/d/18USFbHlu1T4IjV60X8ensyXVkxiOR6Rg/preview', videoHref: 'https://drive.google.com/file/d/1BtHnnf07nBdnovgfsSXf6DkddrTsqYgk/preview' },
    { num: 10, title: 'La Connaissance scientifique', pdfHref: 'https://drive.google.com/file/d/1v2SeApA3Xdbv9DkUHNUfdVVI4X8fQ03x/preview', videoHref: 'https://drive.google.com/file/d/1ZIZ-BlojaEPq2XTxUGIxUL39q5YaTs8v/preview' },
];

export default function PhiloTerminaleCPage() {
  const { userProfile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' | 'video' } | null>(null);
  
  const hasAccess = isAdmin || (userProfile && userProfile?.solde > 0 && userProfile?.className === 'terminale');

  const handleLockedContent = () => {
    if (!userProfile || hasAccess) return;
    if (userProfile.solde <= 0) {
      toast({
        title: 'Contenu Verrouillé',
        description:
          "Votre solde est épuisé. Veuillez recharger votre compte pour accéder à ce cours.",
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
          Philosophie
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
