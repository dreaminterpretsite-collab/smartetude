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
  id: 'maths-tle-d',
  name: 'Maths Tle D',
  url: '/courses/math-terminale-d',
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
    { num: 1, title: 'LIMITES ET CONTINUITE', pdfHref: 'https://drive.google.com/file/d/1oy76xrRBFTZ3O-2OsATmeAEWO6cTjslc/preview', videoHref: 'https://drive.google.com/file/d/1g54fP_DXVMkMViVE9beuoWBhcHQjZdsG/preview' },
    { num: 2, title: 'Probabilité_1', pdfHref: 'https://drive.google.com/file/d/17i68BIe7bo3e_ja4UgOCdrvdsGqHs8kh/preview', videoHref: '#' },
    { num: 3, title: 'DERIVABILITE ET ETUDE DE FONCTIONS', pdfHref: 'https://drive.google.com/file/d/1WPqZFqy7vpLspu6No99oTRy6hhISYrEW/preview', videoHref: '#' },
    { num: 4, title: 'PRIMITIVES', pdfHref: 'https://drive.google.com/file/d/1QRGY3DrUL47lMtvMsSYn4IyIT_7NRGMm/preview', videoHref: '#' },
    { num: 5, title: 'FONCTIONS LOGARITHMES', pdfHref: 'https://drive.google.com/file/d/1QRGY3DrUL47lMtvMsSYn4IyIT_7NRGMm/preview', videoHref: '#' },
    { num: 6, title: 'Nombres complexes', pdfHref: 'https://drive.google.com/file/d/1BwDsmUY_abJImm_RHccCusneh__juAfx/preview', videoHref: '#' },
    { num: 7, title: 'Fonction exponentielle et fonction puissance', pdfHref: 'https://drive.google.com/file/d/1c4GuDHxWa5rYKZ62YhA727KDGVvvd6qK/preview', videoHref: '#' },
    { num: 8, title: 'Nombres complexes et géométrie du plan', pdfHref: 'https://drive.google.com/file/d/1qR76mZCeXUoUopVSRnr08Kb9yAQwyxSy/preview', videoHref: '#' },
    { num: 9, title: 'suites numériques', pdfHref: 'https://drive.google.com/file/d/1jJuPEE_8o-gejICR-6oSSazNdH6fgpxm/preview', videoHref: '#' },
    { num: 10, title: 'Calcul intégral', pdfHref: 'https://drive.google.com/file/d/1WIhEZwkWNVVHVkZQ3C_rxuyM86GH-a5j/preview', videoHref: 'https://drive.google.com/file/d/1_tycJwD1QUoW9ChhX860Ly90hwoKRHQL/preview' },
    { num: 11, title: 'Statistiques', pdfHref: 'https://drive.google.com/file/d/1gb6spVZYfhEbBcKVYOTsO-dJz5lmv1XO/preview', videoHref: '#' },
    { num: 12, title: 'Equations différentielles', pdfHref: 'https://drive.google.com/file/d/160yhc6JRn04yH97zJ9uMvJQrD7O3wh8t/preview', videoHref: '#' },
];

export default function MathTerminaleDPage() {
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
        <p className="text-sm font-medium text-primary">Terminale D</p>
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
