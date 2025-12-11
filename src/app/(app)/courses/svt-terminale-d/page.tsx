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
  id: 'svt-terminale-d',
  name: 'SVT Terminale D',
  url: '/courses/svt-terminale-d',
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
    { num: 1, title: 'Le reflexe conditionnel', pdfHref: 'https://drive.google.com/file/d/1nWFK4wayqbgvxGa7S1R_VxSIEsKdryik/preview', videoHref: '#' },
    { num: 2, title: 'Le fonctionnement du tissu nerveux', pdfHref: 'https://drive.google.com/file/d/1Bv5t_P42Zj64zYb2_7zud-OMU73AqpOa/preview', videoHref: 'https://drive.google.com/file/d/1cEzT4YGAODezTaRijL7VpL9yI5ksn8H7/preview' },
    { num: 3, title: 'Le fonctionnement du muscle strié squelettique', pdfHref: 'https://drive.google.com/file/d/148V56RsZ7pp9bGe7AHmEyI2LHrekxcJp/preview', videoHref: 'https://drive.google.com/file/d/1qpI6N-v35AfSkkWsoNrp6zxIHQZEk4_C/preview' },
    { num: 4, title: 'Le fonctionnement du coeur', pdfHref: 'https://drive.google.com/file/d/16YtGucJmzZipUVWV-2XoiBuAe83yJ-D6/preview', videoHref: '#' },
    { num: 5, title: 'Le maintien de la constance du milieu intérieur', pdfHref: 'https://drive.google.com/file/d/1pSpf-WXIoKCyAwsoqltqoVBfRy-zbqsz/preview', videoHref: '#' },
    { num: 6, title: 'Le système de défense de l\'organisme', pdfHref: 'https://drive.google.com/file/d/11yZ90M88gDtm9CmXg1GSeIl_d28tzcL5/preview', videoHref: 'https://drive.google.com/file/d/1XpjEvDxgEcNYosLRpfk08ggvWZFZGVJh/preview' },
    { num: 7, title: 'L\'INFECTION DE L\'ORGANISME PAR LE VIH', pdfHref: 'https://drive.google.com/file/d/1pPJqrDL-abV0MclTqEh824gpWVzEwRG-/preview', videoHref: 'https://drive.google.com/file/d/191RxPuWGJkKs9Jy4OZKSJUN-kaSJD8GB/preview' },
    { num: 8, title: 'Le devenir des cellules sexuelles chez les mammifères', pdfHref: 'https://drive.google.com/file/d/13VXyFt1dm1yaWJUeFJYC9--NFAMrV7P8/preview', videoHref: 'https://drive.google.com/file/d/1dxLmRqT8kDhYqLi1aF8jrO70ahHjuXFi/preview' },
    { num: 9, title: 'Le fonctionnement des organes sexuels chez l\'Homme', pdfHref: 'https://drive.google.com/file/d/1mTZnspqcpqUicCVyAIGjV182sVj-LbSB/preview', videoHref: '#' },
    { num: 10, title: 'La reproduction chez les spermaphytes', pdfHref: 'https://drive.google.com/file/d/1PMFAjBxXBKP1Em913pQay2FK2ffyZ2YG/preview', videoHref: 'https://drive.google.com/file/d/1kRp08_ZG5YLp1dcw0w98RssyHPsHBySQ/preview' },
    { num: 11, title: 'La transmission d\'un caractère héréditaire chez l\'Homme', pdfHref: 'https://drive.google.com/file/d/1TvY4YVWL4QFUwnWpwc96X16qYAG4tdF4/preview', videoHref: '#' },
    { num: 12, title: 'La transmission de deux caractères héréditaires chez les êtres vivants', pdfHref: 'https://drive.google.com/file/d/1-7W-JFxiZMTwuNOT7MMHaa9WjifSQ82O/preview', videoHref: '#' },
    { num: 13, title: 'La mise en place des gisements miniers en Côte d\'Ivoire', pdfHref: '#', videoHref: 'https://drive.google.com/file/d/15Vzw_JfUrW4nbdetPpUQuXZcEoDqDnpb/preview' },
    { num: 14, title: 'L\'exploitation des gisements miniers', pdfHref: 'https://drive.google.com/file/d/1gmE1rVBCw8IvgbK1plqezxgbR0MykY7B/preview', videoHref: '#' },
    { num: 15, title: 'L\'amélioration et la protection des sols', pdfHref: 'https://drive.google.com/file/d/13X9klYGVxelbrh9NWsStxeKiNrbsa0Ev/preview', videoHref: 'https://drive.google.com/file/d/1GdctvpPytiwjgzw2ZhWlT1eqJVQ6vhWE/preview' },
];

export default function SvtTerminaleDPage() {
  const { userProfile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' | 'video' } | null>(null);
  
  // A user has access if they are an admin, or if their account is active and they are in the 'terminale' class.
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
        <p className="text-sm font-medium text-primary">Terminale D</p>
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
