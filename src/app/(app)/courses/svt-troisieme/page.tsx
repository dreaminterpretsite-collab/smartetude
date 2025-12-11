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
  id: 'svt-troisieme',
  name: 'SVT Troisième',
  url: '/courses/svt-troisieme',
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
    { num: 1, title: 'LES ALIMENTS ET L\'HOMME', videoHref: 'https://drive.google.com/file/d/1QuHK1jZE99hpQyeKEnZKhEqEdruduC2a/preview', pdfHref: 'https://drive.google.com/file/d/1YF9iW2Cov4f8wNHJuTVd0ioYviiP7UDu/preview' },
    { num: 2, title: 'La digestion des aliments', videoHref: 'https://drive.google.com/file/d/1XW_OHmBekzxUOuVz7L0Rys5SqRxCVyPJ/preview', pdfHref: 'https://drive.google.com/file/d/12APIGyCdRnTIP7A6bDzojKfIdJxTtWpT/preview' },
    { num: 3, title: 'LE SANG', videoHref: 'https://drive.google.com/file/d/1K2EwMsQ-6o88Lnasrj54ZgdOOSmkha_w/preview', pdfHref: 'https://drive.google.com/file/d/1ll6eywoNMLlxLuxNRUICS-HtG7cOLXC9/preview' },
    { num: 4, title: 'LA TRANSFUSION SANGUINE', videoHref: 'https://drive.google.com/file/d/1kVyTmI6W_ltIDZ3DMhi_Q0LPUQEbTXn-/preview', pdfHref: 'https://drive.google.com/file/d/17_705mjt3sgiDbr12zlwVyAFC0Jmb6_u/preview' },
    { num: 5, title: 'La circulation sanguine', videoHref: 'https://drive.google.com/file/d/1A7HCtRKNEMb5IkJFaK97FI9Gvl_IWd8h/preview', pdfHref: 'https://drive.google.com/file/d/17Cuo9q3KqoA5LE82SnmO_9jSFSEaoJpa/preview' },
    { num: 7, title: 'L’INFECTION AU VIH', videoHref: 'https://drive.google.com/file/d/1OO-jpKQLQrsRsn12H_FLdEsd8WpdVli5/preview', pdfHref: 'https://drive.google.com/file/d/1LT4IMID7tumwvDNSPfinhZc1RjmIzuSn/preview' },
    { num: 8, title: 'Les caractéristiques des sols', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1zX0qNZF60cuubG3jLSRaUs14A4RgUMAh/preview' },
    { num: 9, title: 'Les Relations sols plantes', videoHref: 'https://drive.google.com/file/d/1HhYqk8JBoPDxfgU73OTSUhH0pI-XAEpL/preview', pdfHref: 'https://drive.google.com/file/d/1QaDR6QExO4JMDaXi2kCKvP0pT4oFEp90/preview' },
    { num: 10, title: 'La dégradation du sol', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1-b19ggD0Fq-hPs6Y7rce6UGvkAqAPlt-/preview' },
    { num: 11, title: 'La protection et l\'amélioration des sols', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1FncYHUbSwTgqb-T4SmcaRZCp-x5-mO37/preview' },
];

export default function SvtTroisiemePage() {
  const { userProfile, hasCourseAccess } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' | 'video' } | null>(null);
  
  const hasAccess = hasCourseAccess && userProfile?.className === 'troisieme';

  const handleLockedContent = () => {
    if (!userProfile) return;
    let message = "Vous n'avez pas accès à ce contenu.";
    if (!hasCourseAccess) {
        message = "Veuillez débloquer l'accès aux cours depuis votre tableau de bord.";
    } else if (userProfile.className !== 'troisieme') {
        message = "Ce contenu est réservé aux élèves de Troisième.";
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
        <p className="text-sm font-medium text-primary">Troisième</p>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Sciences de la Vie et de la Terre (SVT)
        </h1>
        <p className="text-muted-foreground">
          Liste des leçons disponibles pour cette matière.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
