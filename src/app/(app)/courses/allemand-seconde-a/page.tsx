'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, FileText, Lock, Unlock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { trackCourseVisit, type CourseInfo } from '@/lib/course-visits';
import { useToast } from '@/hooks/use-toast';
import { ContentViewer } from '@/components/content-viewer';
import { Separator } from '@/components/ui/separator';
import { useFirebase } from '@/firebase/client-provider';

const courseInfo: CourseInfo = {
  id: 'allemand-seconde-a',
  name: 'Allemand Seconde A',
  url: '/courses/allemand-seconde-a',
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
    { 
        lecon: 1,
        title: 'KONTAKTE ÜBER GRENZEN',
        fiches: [
            { fiche: 1, pdfHref: 'https://drive.google.com/file/d/1EMSQBrk8Kx6TCS1HVuokhJgFgXAq0ORd/preview', videoHref: '#' },
            { fiche: 2, pdfHref: 'https://drive.google.com/file/d/1DsK0f0cjk5wxgdVVrfQahpbUWKSKBDRE/preview', videoHref: '#' },
        ]
    },
    {
        lecon: 2,
        title: 'DU UND ICH',
        fiches: [
            { fiche: 1, pdfHref: 'https://drive.google.com/file/d/1T2J6TZMxECVshFGL96rXBZtWc3Q2kjNy/preview', videoHref: '#' },
            { fiche: 2, pdfHref: 'https://drive.google.com/file/d/1_iftBbRHtgFINk28RvsrooODY3lZZlkD/preview', videoHref: '#' },
        ]
    },
    {
        lecon: 3,
        title: 'FIT BLEIBEN',
        fiches: [
            { fiche: 1, pdfHref: 'https://drive.google.com/file/d/1KehMMHLSzZI3phH1laNObZHte4rd4Ft1/preview', videoHref: '#' }
        ]
    },
    {
        lecon: 4,
        title: 'UNTER EINEM DACH',
        fiches: [
            { fiche: 1, pdfHref: 'https://drive.google.com/file/d/1Jx3Fs5O2-bpWRLp_svnq4bWT9FBDX2B1/preview', videoHref: '#' },
            { fiche: 2, pdfHref: 'https://drive.google.com/file/d/1bD7t9IxXn1h6IHmLFplqSRYOuMva5W8T/preview', videoHref: '#' },
        ]
    }
];

export default function AllemandSecondeAPage() {
  const { userProfile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' | 'video' } | null>(null);
  
  // A user has access if they are an admin, or if their account is active and they are in the 'seconde' class.
  const hasAccess = isAdmin || (userProfile && userProfile?.solde > 0 && userProfile?.className === 'seconde');

  const handleLockedContent = () => {
    if (!userProfile || hasAccess) return;
    if (userProfile.solde <= 0) {
        toast({
            title: 'Contenu Verrouillé',
            description: "Votre solde est épuisé. Veuillez recharger votre compte pour accéder à ce cours.",
            variant: 'destructive',
        });
    } else if (userProfile.className !== 'seconde') {
        toast({
            title: 'Accès non autorisé',
            description: "Ce contenu est réservé aux élèves de Seconde. Veuillez vous connecter avec un compte correspondant.",
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
        onOpenChange={(isOpen) => !isOpen && setViewerContent(null)}
      />
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Seconde A</p>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Allemand
        </h1>
        <p className="text-muted-foreground">
          Liste des leçons disponibles pour cette matière.
        </p>
      </div>

      <div className="space-y-8">
        {lessons.map((lesson, lessonIndex) => (
          <div key={lesson.lecon}>
            <h2 className="font-headline text-2xl font-bold mb-4">Leçon {lesson.lecon}: {lesson.title}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {lesson.fiches.map((fiche) => (
                <Card key={fiche.fiche}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {hasAccess ? (
                        <Unlock className="h-5 w-5 text-green-500" />
                      ) : (
                        <Lock className="h-5 w-5 text-red-500" />
                      )}
                      <span>
                        <span className="font-bold text-accent">Fiche {fiche.fiche}</span>
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col space-y-2">
                    <Button variant="outline" disabled={!hasAccess} onClick={() => hasAccess ? openViewer(fiche.videoHref, 'video') : handleLockedContent()}>
                      <Video className="mr-2 h-4 w-4" />
                      Cours Vidéo
                    </Button>
                    <Button variant="outline" disabled={!hasAccess} onClick={() => hasAccess ? openViewer(fiche.pdfHref, 'pdf') : handleLockedContent()}>
                      <FileText className="mr-2 h-4 w-4" />
                      Cours PDF
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            {lessonIndex < lessons.length - 1 && <Separator className="my-8" />}
          </div>
        ))}
      </div>
    </div>
  );
}
