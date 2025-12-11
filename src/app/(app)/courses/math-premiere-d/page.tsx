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
  id: 'maths-premiere-d',
  name: 'Maths Première D',
  url: '/courses/math-premiere-d',
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
    { num: 1, title: 'ÉQUATIONS ET INÉQUATIONS DU SECOND DEGRÉ DANS IR', pdfHref: 'https://drive.google.com/file/d/1S3eLzO-xltmEdomrnpGYJduUA6Gokw2N/preview' },
    { num: 2, title: 'DENOMBREMENT', pdfHref: 'https://drive.google.com/file/d/1votuJRK2WnqeArziim2IbyvE9ew_e6RM/preview' },
    { num: 3, title: 'GÉNÉRALITÉS SUR LES FONCTIONS', pdfHref: 'https://drive.google.com/file/d/1dcccSnsusiT_EgcJMeJWCwuPKNmuZtkK/preview' },
    { num: 4, title: 'LIMITES ET CONTINUITE', pdfHref: 'https://drive.google.com/file/d/17PpPoYmKrz7Bs2SuJ_hnIWVV212wVoP0/preview' },
    { num: 5, title: 'PROBABILITE', pdfHref: 'https://drive.google.com/file/d/1FCc2Qs7U89iO9rOGiQYRPlDhGzSxjjnc/preview' },
    { num: 6, title: 'DERIVATION', pdfHref: 'https://drive.google.com/file/d/1Q_oWVWQ2BO7tNLWpmflyyWHRK2XLp0EO/preview' },
    { num: 7, title: 'BARYCENTRE', pdfHref: '#' },
    { num: 8, title: 'EXTENSION DE LA NOTION DE LA LIMITE', pdfHref: 'https://drive.google.com/file/d/19nX6ukNulRbnJKyDd3gtRHbnIw8P7sK-/preview' },
    { num: 9, title: 'ETUDE ET REPRESENTATION GRAPHIQUE D’UNE FONCTION', pdfHref: '#' },
    { num: 10, title: 'ANGLES ORIENTES ET TRIGONOMETRIE', pdfHref: 'https://drive.google.com/file/d/1Gm60aDudfYTvuUpwA2dm6AFUBkuzE2Xr/preview' },
    { num: 11, title: 'SYSTÈMES D’ÉQUATIONS LINÉAIRES DANS R2 ET DANS R3', pdfHref: 'https://drive.google.com/file/d/19VotXcYluANjDrrL0nh-BN_9y8BU1I7t/preview' },
    { num: 12, title: 'SUITES NUMERIQUES', pdfHref: 'https://drive.google.com/file/d/1ySNe668m5cseDCVGtqjbq5DZWUIhCDWW/preview' },
    { num: 13, title: 'ORTHOGONALITÉ DANS L’ESPACE', pdfHref: 'https://drive.google.com/file/d/1Kh9OvgR3oe3vGZW3xLSRTp9_MiIDe0Sf/preview' },
    { num: 15, title: 'STATISTIQUES', pdfHref: '#' },
];

export default function MathPremiereDPage() {
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
        <p className="text-sm font-medium text-primary">Première D</p>
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
