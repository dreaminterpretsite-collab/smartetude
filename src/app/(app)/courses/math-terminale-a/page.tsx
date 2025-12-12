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
  id: 'maths-terminale-a',
  name: 'Maths Terminale A',
  url: '/courses/math-terminale-a',
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
  { num: 1, title: 'Fonctions polynômes et fonctions rationnelles', pdfHref: 'https://drive.google.com/file/d/1ai7FTjAyJEHOYhhAHtCecbqd64KG7dNn/preview', videoHref: '#' },
  { num: 2, title: 'Probabilités', pdfHref: '#', videoHref: 'https://drive.google.com/file/d/1ElCvxjyvsviELMhxPu1zg2277KNyb0qH/preview' },
  { num: 3, title: 'Fonction logarithme népérien', pdfHref: 'https://drive.google.com/file/d/11SXy_mTzezczN0G0c1BZY8bBuph0Tkee/preview', videoHref: '#' },
  { num: 4, title: 'Fonction exponentielle', pdfHref: 'https://drive.google.com/file/d/1iOZq0Gpy1pT-zGGCLFxYOOi44vBkgp_a/preview', videoHref: '#' },
  { num: 5, title: 'Suites numériques', pdfHref: 'https://drive.google.com/file/d/11p_0gHwyWmIgGyR3dBAtxslnSNU6m0_n/preview', videoHref: '#' },
  { num: 6, title: 'Statistiques', pdfHref: 'https://drive.google.com/file/d/1uyEIIp9f239BEsETS5ZkpC2e3XE0hwfj/preview', videoHref: '#' },
  { num: 7, title: 'Systèmes linéaires', pdfHref: 'https://drive.google.com/file/d/1I4XWtRRkMfOp02hkfnXof5iWR0OqtaIP/preview', videoHref: 'https://drive.google.com/file/d/15_6ZRPGu61ZennljbDAVUMrRvMykBvXf/preview' },
  { num: 8, title: 'Primitives et Calcul intégral', pdfHref: 'https://drive.google.com/file/d/1ZxjU_nATbCaO-RWs1n9yLc_sffK5QmTz/preview', videoHref: '#' },
];

export default function MathTerminaleAPage() {
  const { userProfile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' | 'video' } | null>(null);
  const hasAccess = isAdmin || (userProfile && userProfile?.solde > 0 && userProfile?.className === 'terminale');

  const handleLockedContent = () => {
    if (!userProfile) return;
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
        <p className="text-sm font-medium text-primary">Terminale A</p>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Mathématiques
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
