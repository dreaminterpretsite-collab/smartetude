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
  id: 'maths-premiere-c',
  name: 'Maths Première C',
  url: '/courses/math-premiere-c',
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
    { num: 1, title: 'ÉQUATIONS ET INÉQUATIONS DU SECOND DEGRÉ DANS IR', pdfHref: 'https://drive.google.com/file/d/1V6hJ-2fH0sukjOmxhVaGe1nrcV_yhSVO/preview' },
    { num: 2, title: 'BARYCENTRE', pdfHref: 'https://drive.google.com/file/d/1GNv72OlgjePVfbuVgwjrA9JwMI1WhtGy/preview' },
    { num: 3, title: 'GÉNÉRALITÉS SUR LES FONCTIONS', pdfHref: 'https://drive.google.com/file/d/1Fr-7XhffIgOgFhyZD2IE4KCYK3t8G_-M/preview' },
    { num: 4, title: 'DENOMBREMENT', pdfHref: 'https://drive.google.com/file/d/1zIvKBs6p0iqkgOegiJ0iwzoQiF-eTtMI/preview' },
    { num: 5, title: 'LIMITES ET CONTINUITÉ', pdfHref: 'https://drive.google.com/file/d/1zh4Px-g-zP7Mnj6iaQvXxZd9EA37hLtT/preview' },
    { num: 6, title: 'ANGLES ORIENTES ET TRIGONOMETRIE', pdfHref: 'https://drive.google.com/file/d/1d6AkHhVjl3mkzD7ZkBYIwyyMRfTP7QbS/preview' },
    { num: 7, title: 'EXTENSION DE LA NOTION DE LA LIMITE', pdfHref: 'https://drive.google.com/file/d/1KPptmVORFLUXvYLruJb4MWJ2ZDmPnOxU/preview' },
    { num: 8, title: 'COMPOSEES DE TRANSFORMATIONS', pdfHref: 'https://drive.google.com/file/d/152dtR-1v_BmFRSjQszqmZo5-4UekdufQ/preview' },
    { num: 9, title: 'DERIVATION', pdfHref: 'https://drive.google.com/file/d/1EjwqV9GushnZ8XfyoVUOuw-ROEeT8FoC/preview' },
    { num: 10, title: 'PROBABILITE', pdfHref: 'https://drive.google.com/file/d/1RuU0wwHYZEVbkRMq7zU7mTYJcGf0xRb3/preview' },
    { num: 11, title: 'ETUDE ET REPRESENTATION GRAPHIQUE D’UNE FONCTION', pdfHref: 'https://drive.google.com/file/d/1E5PS_8j_6ujxxUgbNBj7a9K4IjFGv5ct/preview' },
    { num: 12, title: 'ORTHOGONALITÉ DANS L’ESPACE', pdfHref: 'https://drive.google.com/file/d/1MudSV_YRXaG2pv3URN57417jWDIW_lHi/preview' },
    { num: 13, title: 'SYSTÈMES D’ÉQUATIONS LINÉAIRES DANS R2 ET R3', pdfHref: 'https://drive.google.com/file/d/1eU8kMxRun4OFCQ1tf7zyKLHoIdcg93Qr/preview' },
    { num: 14, title: 'GÉOMÉTRIE ANALYTIQUE DU PLAN', pdfHref: 'https://drive.google.com/file/d/1dJ0UIsFXNJ5lwU2nYywekiFa2lZW3iZD/preview' },
    { num: 15, title: 'SUITES NUMERIQUES', pdfHref: 'https://drive.google.com/file/d/1qku6YdoLihvQrhIguZXetdF7pT_y9O8l/preview' },
    { num: 16, title: 'VECTEURS DE L’ESPACE', pdfHref: 'https://drive.google.com/file/d/16w9jiuDf2hgTI_9NAmYZMNXRu9FNStg-/preview' },
    { num: 17, title: 'STATISTIQUES', pdfHref: '#' },
];

export default function MathPremiereCPage() {
  const { userProfile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' | 'video' } | null>(null);
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
        <p className="text-sm font-medium text-primary">Première C</p>
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
