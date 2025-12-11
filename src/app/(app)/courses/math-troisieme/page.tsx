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
  id: 'maths-troisieme',
  name: 'Maths Troisième',
  url: '/courses/math-troisieme',
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
    { title: 'Calcul littéral 1', videoHref: 'https://drive.google.com/file/d/1Wy4Bs2USlU5PWhfS2fRFx6ogc8q2qSvH/preview', pdfHref: 'https://drive.google.com/file/d/1M-MjeNrJk4XXFNRzMF5H9Wzs4y9PW2gb/preview' },
    { title: 'Propriétés de THALES', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1jyVLu6S2xEoI4be1wRGwFFCUV8m_VUm0/preview' },
    { title: 'RACINES CARREES', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1L4rB_viNBKeXOzEisybtxyG9IX9U-43J/preview' },
    { title: 'TRIANGLE RECTANGLE', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1noZwGCy38c-hz49_2pLlaU3tdQjl5367/preview' },
    { title: 'CALCUL NUMERIQUE', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1vzi51nxSh4YTZdzalfYacrRWlGlrcRLP/preview' },
    { title: 'ANGLES INSCRITS', videoHref: 'https://drive.google.com/file/d/1KutAiekMRFnZltfP9mQIaJFzEm-fik25/preview', pdfHref: 'https://drive.google.com/file/d/1wJVprNl9E2BvaNfHRh99pQpEz0BUFldg/preview' },
    { title: 'Vecteurs', videoHref: 'https://drive.google.com/file/d/1a7eA7LUAkzsvNy6x6r3QBxtGSsuVRAPv/preview', pdfHref: 'https://drive.google.com/file/d/1ir4temAeTCxg0gKsjAS0KZx6KeUUrxwZ/preview' },
    { title: 'Equation et inéquation dans IR', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1IReFrQBQUhvjK6O9MfXeIRL5euP6MIwK/preview' },
    { title: 'Coordonnées d\'un vecteur', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1htFEBikZ4V6YnARAST3RfZLS3XY2rbE5/preview' },
    { title: 'Equations de droites', videoHref: 'https://drive.google.com/file/d/1QIohyZEeDcJfRcrfOum_K7NteXE_17jR/preview', pdfHref: 'https://drive.google.com/file/d/1qCZz7iupZvF_Pl03E_KxLCl7PdiD9NTv/preview' },
    { title: 'Statistique', videoHref: 'https://drive.google.com/file/d/1QOTFcZZQrWtiohhnBkyOm__M639RKBMB/preview', pdfHref: 'https://drive.google.com/file/d/1hrpAfFNhw-uVOkWqaj6BoqHyC9qNzXQs/preview' },
    { title: 'Equations et inéquations dans RxR', videoHref: 'https://drive.google.com/file/d/1g_jWq3UZApA3Cy8DQniiSKjZK58pBae3/preview', pdfHref: 'https://drive.google.com/file/d/1vVlxJmj2LE_F8fTr9Jfg_vseSXXt55w4/preview' },
    { title: 'Applications affines', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1r2mQ4hDzy9Zb1Y281vxGYGxjCZZm23RK/preview' },
    { title: 'Pyramide et cône', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/11dI53awSYN9cQ6QaB2s2JJUR_DM6RZJ3/preview' },
];

export default function MathTroisiemePage() {
  const { userProfile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' | 'video' } | null>(null);
  const hasAccess = isAdmin || (userProfile && userProfile?.solde > 0 && userProfile?.className === 'troisieme');

  const handleLockedContent = () => {
    if (!userProfile || hasAccess) return;
    if (userProfile.solde <= 0) {
      toast({
        title: 'Contenu Verrouillé',
        description:
          "Votre solde est épuisé. Veuillez recharger votre compte pour accéder à ce cours.",
        variant: 'destructive',
      });
    } else if (userProfile.className !== 'troisieme') {
        toast({
            title: 'Accès non autorisé',
            description: "Ce contenu est réservé aux élèves de Troisième. Veuillez vous connecter avec un compte correspondant.",
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
        <p className="text-sm font-medium text-primary">Troisième</p>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Mathématiques
        </h1>
        <p className="text-muted-foreground">
          Liste des leçons disponibles pour cette matière.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    Leçon {index + 1}:
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
