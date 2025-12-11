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
  id: 'allemand-premiere-a',
  name: 'Allemand Première A',
  url: '/courses/allemand-premiere-a',
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
  { unit: 1, fiche: 1, pdfHref: 'https://drive.google.com/file/d/1ekT5Sveq1MByHIXADnIgsHV2Zafrs_bz/preview' },
  { unit: 1, fiche: 2, pdfHref: 'https://drive.google.com/file/d/1GL6GPq-NRwJ57cjchJSvf2fWLOf2uGuK/preview' },
  { unit: 2, fiche: 1, pdfHref: 'https://drive.google.com/file/d/1krzibWGNvSQKMZHLzOZ8xe1EYgy_sNwN/preview' },
  { unit: 2, fiche: 2, pdfHref: 'https://drive.google.com/file/d/1pMfhZDGiV9vgyYNMS9Wa0tw9p-2J7DKS/preview' },
  { unit: 3, fiche: 1, pdfHref: 'https://drive.google.com/file/d/1QaXAMY3uxmsfULyz1gx88oKZ-dFBbqZ4/preview' },
];

export default function AllemandPremiereAPage() {
  const { userProfile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' | 'video' } | null>(null);
  
  // A user has access if they are an admin, or if their account is active and they are in the 'premiere' class.
  const hasAccess = isAdmin || (userProfile && userProfile?.solde > 0 && userProfile?.className === 'premiere');

  const handleLockedContent = () => {
    if (!userProfile || hasAccess) return;
    if (userProfile.solde <= 0) {
        toast({
            title: 'Contenu Verrouillé',
            description: "Votre solde est épuisé. Veuillez recharger votre compte pour accéder à ce cours.",
            variant: 'destructive',
        });
    } else if (userProfile.className !== 'premiere') {
        toast({
            title: 'Accès non autorisé',
            description: "Ce contenu est réservé aux élèves de Première. Veuillez vous connecter avec un compte correspondant.",
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
        <p className="text-sm font-medium text-primary">Première A</p>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Allemand
        </h1>
        <p className="text-muted-foreground">
          Liste des leçons disponibles pour cette matière.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {lessons.map((lesson, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                 {hasAccess ? (
                  <Unlock className="h-5 w-5 text-green-500" />
                ) : (
                  <Lock className="h-5 w-5 text-red-500" />
                )}
                <span>
                    <span className="font-bold text-foreground">
                    LEÇON {lesson.unit}:
                    </span>{' '}
                    <span className="font-bold text-accent">FICHE {lesson.fiche}</span>
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