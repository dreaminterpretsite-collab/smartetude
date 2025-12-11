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
  id: 'maths-seconde-c',
  name: 'Maths Seconde C',
  url: '/courses/math-seconde-c',
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
  { num: 1, title: 'VECTEURS ET POINTS DU PLAN', pdfHref: 'https://drive.google.com/file/d/1EHFOblEOQiLW9XyYy50zVRq-IbwAqsWS/preview' },
  { num: 2, title: 'ENSEMBLE DES NOMBRES REELS', pdfHref: 'https://drive.google.com/file/d/1EkyOZkd-C3YOv_hftf6w3qZD1OdF2Knm/preview' },
  { num: 3, title: 'UTILISATION DES SYMETRIES ET TRANSLATIONS', pdfHref: 'https://drive.google.com/file/d/1nyj8EgkhdhzHgB3EmCAH_18wo3jddusz/preview' },
  { num: 4, title: 'GENERALITES SUR LES FONCTIONS', pdfHref: 'https://drive.google.com/file/d/1k5tCWONR76uEewqNn1k4WMd3K7hujmjC/preview' },
  { num: 5, title: 'DROITES ET PLANS DE L’ESPACE', pdfHref: 'https://drive.google.com/file/d/1szlTCKFNDt7UfWspCN0PMh4pMI577bCk/preview' },
  { num: 6, title: 'FONCTIONS POLYNÔMES ET FONCTIONS RATIONNELLES', pdfHref: 'https://drive.google.com/file/d/1MztQE1zRoEGac8TjekV5CnAQgjpsLSrR/preview' },
  { num: 7, title: 'ANGLES INSCRITS', pdfHref: 'https://drive.google.com/file/d/1ICOibQ_bDE1RiQ73cV0IY2_3_8FtcnHC/preview' },
  { num: 8, title: 'ANGLES ORIENTÉS ET TRIGONOMÉTRIE', pdfHref: 'https://drive.google.com/file/d/11jYWrqSLS8mY_JMNBpFlGQU6HP0CHZ-C/preview' },
  { num: 9, title: 'STATISTIQUE', pdfHref: 'https://drive.google.com/file/d/182spgq5ODPJpPH0Zwi9bpUr-S7AAL9f9/preview' },
  { num: 10, title: 'PRODUIT SCALAIRE', pdfHref: 'https://drive.google.com/file/d/1_YCRAYydQ8tbustrvPzFVYUYDlAm-K6Q/preview' },
  { num: 11, title: 'ÉQUATIONS ET INÉQUATIONS DANS ℝ', pdfHref: 'https://drive.google.com/file/d/1gbwPqWGoRW4URoRvUpldmdDMCzQGkS6j/preview' },
  { num: 12, title: 'HOMOTHETIE', pdfHref: 'https://drive.google.com/file/d/11WwoMmQ5Qknb-fW8-7VQpukiKqtnq3XJ/preview' },
  { num: 13, title: 'ETUDE DE FONCTIONS ELEMENTAIRES', pdfHref: 'https://drive.google.com/file/d/1xYHuz1brglpMI4T5EamBTmaKKYGFmpqr/preview' },
  { num: 14, title: 'ROTATION', pdfHref: 'https://drive.google.com/file/d/10QGU4hshSECqhAfEpouwzDPeYFvWgeBD/preview' },
  { num: 15, title: 'INEQUATIONS DANS ℝ×ℝ', pdfHref: '#' },
];

export default function MathSecondeCPage() {
  const { userProfile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' | 'video' } | null>(null);
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
        <p className="text-sm font-medium text-primary">Seconde C</p>
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
