'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, FileText, Lock, Unlock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { trackCourseVisit, type CourseInfo } from '@/lib/course-visits';
import { useToast } from '@/hooks/use-toast';
import { ContentViewer } from '@/components/content-viewer';
import { useFirebase } from '@/firebase/client-provider';

const courseInfo: CourseInfo = {
  id: 'francais-premiere-c',
  name: 'Français Première C',
  url: '/courses/francais-premiere-c',
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

const expressionEcriteLessons = [
    { num: 1, title: "Commentaire composé : Analyser, construire, organiser les CI", pdfHref: 'https://drive.google.com/file/d/1jcXky4Sc72TWbl_Iebi8tiewpr6BDMrd/preview' },
    { num: 2, title: "Commentaire composé : Rédiger un centre d'intérêt", pdfHref: 'https://drive.google.com/file/d/1bcSHSw410V512_rqZFsDoGo9VlKg3z7C/preview' },
    { num: 3, title: "Commentaire composé : Rédiger l'introduction et la conclusion", pdfHref: 'https://drive.google.com/file/d/1YE8S4C3ENEzTfiBHKQ2aty8KR_zYFyRT/preview' },
    { num: 4, title: "Dissertation littéraire : Analyser le sujet", pdfHref: 'https://drive.google.com/file/d/1JTxjG3dL7t0ISwo30To2fdooK9-vO9I3/preview' },
    { num: 5, title: "Dissertation littéraire : Rechercher les idées", pdfHref: 'https://drive.google.com/file/d/1R205NHyfJnWm8Qlx4kD8QCJp7-grEsAa/preview' },
    { num: 6, title: "Dissertation littéraire : Élaborer un plan", pdfHref: 'https://drive.google.com/file/d/1cp2m6vp2PMx3DOygNACzv1mhsIAr87sU/preview' },
    { num: 7, title: "Dissertation littéraire : Rédiger une partie du développement", pdfHref: 'https://drive.google.com/file/d/1t_HaduTceq32Aq-FAI9yOdsOHI7Xkux0/preview' },
    { num: 8, title: "Dissertation littéraire : Rédiger l'introduction et la conclusion", pdfHref: 'https://drive.google.com/file/d/1fWO-Rd-V7_xRsEGO3J7psG8d11FQaD_x/preview' },
    { num: 9, title: "Production écrite : Analyser le sujet et rechercher les idées", pdfHref: 'https://drive.google.com/file/d/13vPD4hUW3yMxAWp4_gu0D0k3b4alj8Og/preview' },
    { num: 10, title: "Production écrite : Rédiger un paragraphe argumentatif", pdfHref: 'https://drive.google.com/file/d/1lRGOzoa-iIVWMSkhOeYvp2r7BavT8LxF/preview' },
    { num: 11, title: "Production écrite : Rédiger l'introduction et la conclusion", pdfHref: 'https://drive.google.com/file/d/1IqmVwYq9PM24LBt5obJoX70VyC2U_Vam/preview' },
    { num: 12, title: "Résumé de texte argumentatif : Répondre aux questions", pdfHref: 'https://drive.google.com/file/d/1k3j9m9HIw9IU3aChjlvWoeqJFwxwxi3L/preview' },
    { num: 13, title: "Résumé de texte argumentatif : Identifier la situation d'argumentation", pdfHref: 'https://drive.google.com/file/d/1NHI1fuc2df1V7c3nkzcau6skXS9xhZZu/preview' },
    { num: 14, title: "Résumé de texte argumentatif : Sélection et enchaînement logique", pdfHref: 'https://drive.google.com/file/d/1Gp1ozJrYhhqnyTAEVlZiS3B79e3LoK7U/preview' },
    { num: 15, title: "Résumé de texte argumentatif : Reformuler les idées essentielles", pdfHref: 'https://drive.google.com/file/d/1oe_j5huog65kJVUcHnd2j_gwlB2G4c1Z/preview' },
    { num: 16, title: "Résumé de texte argumentatif : Rédiger le résumé", pdfHref: 'https://drive.google.com/file/d/1p-zqNwsgUKmODv0KRVaesRunUvt_FOgC/preview' }
];

const productionLitteraireLessons = [
    { num: 3, title: "Les tonalités littéraires (1)", pdfHref: 'https://drive.google.com/file/d/1g--WZWSY0Fdn8vWvI0cSI3QbOl5c_1XY/preview' },
    { num: 4, title: "Les tonalités littéraires (2)", pdfHref: 'https://drive.google.com/file/d/107PUtuaErDNd-P3VT9hh1Byj7n9Q-x9q/preview' },
];

export default function FrancaisPremiereCPage() {
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
          Français
        </h1>
        <p className="text-muted-foreground">
          Liste des leçons disponibles pour cette matière.
        </p>
      </div>

      <div className="space-y-8">
        <div>
            <h2 className="font-headline text-2xl font-bold mb-4">Expression Écrite</h2>
            <div className="grid gap-6 md:grid-cols-2">
                {expressionEcriteLessons.map((lesson) => (
                <Card key={`ee-${lesson.num}`}>
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
        
        <Separator />

        <div>
            <h2 className="font-headline text-2xl font-bold mb-4">Perfectionnement de la langue</h2>
            <div className="grid gap-6 md:grid-cols-2">
                {productionLitteraireLessons.map((lesson, index) => (
                <Card key={`pl-${index}`}>
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
                            </span>
                            {' '}
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
      </div>
    </div>
  );
}
