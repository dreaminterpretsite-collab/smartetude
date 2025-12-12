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
  id: 'francais-terminale-a',
  name: 'Français Terminale A',
  url: '/courses/francais-terminale-a',
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
    { num: 15, title: 'Rédiger résumé de texte', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1WLj7mONgHU2Y6BIeL6UT9oSmIjWKM3vu/preview' },
    { num: 14, title: 'Résumé_Texte_Argumt_Reformuler idées essentls', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1uIWEcGwbDBXm750eO5IcAq_XvaM2DxAi/preview' },
    { num: 13, title: 'Résumé_Texte_Argumt_Sit_argu_IE_Ench logique', videoHref: 'https://drive.google.com/file/d/1FbOfZyqqjDv6VEoFP_DfxHUpuEAn5UKE/preview', pdfHref: 'https://drive.google.com/file/d/11gr9D8R7ub7DM_WwEMkr4RUozIcgdwUl/preview' },
    { num: 12, title: 'Résumé_Texte_Argum_Répondre aux questions', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1DaIUB3Tm5JP_b4qPAw45EbCdVA0X5E70/preview' },
    { num: 11, title: 'Prdtion-écrite_Organiser, argumentation', videoHref: 'https://drive.google.com/file/d/1fVGhYjhiI-ypdrm2uzivan4h7MTCz4oE/preview', pdfHref: 'https://drive.google.com/file/d/1_-WnfnpLatOFoam9NgYRPTZ-b-vVXjC4/preview' },
    { num: 10, title: 'Prdtion-écrite_Analyser sujet-Recherche des idées', videoHref: 'https://drive.google.com/file/d/1KIWudGDuFikjUDfpHr_r8CUiBaSqAQCB/preview', pdfHref: 'https://drive.google.com/file/d/1cjEqMQe3obSFIXbE2V7UkXr3Dn8Nl5YC/preview' },
    { num: 9, title: 'Dissert litt_Rédiger une partie developmt', videoHref: 'https://drive.google.com/file/d/1MUGFnIL3A-cnU9159N3KpeC9UiWmHRKt/preview', pdfHref: 'https://drive.google.com/file/d/1tpnJFfj9WVCE3aiCqtAgQrl4QvLlMBM7/preview' },
    { num: 8, title: 'Dissert litt_Rédiger Introduction et conclusion', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1F35yFq6zDIHrmOMunWYXvqAtVFNRKdc5/preview' },
    { num: 7, title: 'Dissert litt_Elaborer un plan', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1kd_8UuJSce9l4WMPRTeuFiiOOcAJ6vJ5/preview' },
    { num: 6, title: 'Dissert litt_Rechercher les idées', videoHref: 'https://drive.google.com/file/d/1O97RErK2GYkjO4zJJ8c_WelY2PLYcx7W/preview', pdfHref: 'https://drive.google.com/file/d/16r2rhpZK-U3N5bSHbYoZRoegWpgdBVqu/preview' },
    { num: 5, title: 'Dissert_litt_Analyser_sujet', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1qs6RkJRFDXM9fxS4-ZzvlNEIZ1uhk3TG/preview' },
    { num: 4, title: 'Rédiger_Comtaire Compsé', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1A3dgXpTQwZwQRKXoIKRH7aO6YN4T_F0F/preview' },
    { num: 3, title: 'Cmtaire Compsé_rédiger_introduction_conclusion', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1A3dgXpTQwZwQRKXoIKRH7aO6YN4T_F0F/preview' },
    { num: 2, title: 'Cmtaire Compsé_rédiger_Centres_intérêt', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1y8E0orvLu1xVHm3D_4zmnSpTguv1EjJ1/preview' },
    { num: 1, title: 'Cmtaire Composé_Analyser_const_ organ_CI', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1kxS-mxoFb4O2O1ZBo9pLTu7dwUEnW2Vq/preview' },
];

const productionLitteraireLessons = [
    { num: 1, title: 'Figure de style amplifi_atténuation', videoHref: 'https://drive.google.com/file/d/1kvNc23vnRnHjhBxCFxNDpdoYHgnGJxmm/preview', pdfHref: 'https://drive.google.com/file/d/13ZX-W-jbJ2ZXb2VBhKusRSubNrL3wCAh/preview' },
    { num: 2, title: 'Figure de style_analogie substitution', videoHref: 'https://drive.google.com/file/d/1jeF3o4FSNfZ-kKrTxzOPWuyooOexFRzo/preview', pdfHref: 'https://drive.google.com/file/d/1gQ7Kc6am3gNg2LYfwc2VyRoErAZ5A2V7/preview' },
    { num: 3, title: 'Figure de style_oppsition, construction', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/12YXJpW-SiRbk3Gc0-FfmgGf0T43Jz2AB/preview' },
    { num: 4, title: 'Focalisation', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/12VqABGg2QI3bor94-MICrV2wt-NBMXLn/preview' },
    { num: 5, title: 'Les valeurs des temps verbaux', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1RHZur0SrrpzktdoF8QG7YQ-kVhD1Qey3/preview' },
    { num: 6, title: 'Tonalité littéraire_tragique, lyrique, comique', videoHref: 'https://drive.google.com/file/d/1vOMFx_VFM3e_W7JDQmE06oRm84ZOGpyE/preview', pdfHref: 'https://drive.google.com/file/d/1s5PvcaSz4HO2mZJtw_sWEK87pbgBrIu2/preview' },
    { num: null, title: 'Savoir faire: Préparation à l\'oral du Bac', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/18_CXWyG1_fckgzGesJCASUABOuYCDDcJ/preview' },
];


export default function FrancaisTerminaleAPage() {
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
        
        <Separator />

        <div>
            <h2 className="font-headline text-2xl font-bold mb-4">Production Littéraire & Savoir-Faire</h2>
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
                            {lesson.num && <span className="font-bold text-foreground">
                            Leçon {lesson.num}:
                            </span>}
                            {' '}
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
      </div>
    </div>
  );
}
