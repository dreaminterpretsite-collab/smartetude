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
  id: 'physique-chimie-seconde-c',
  name: 'Physique-Chimie Seconde C',
  url: '/courses/physique-chimie-seconde-c',
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

const chimieLessons = [
    { num: 1, title: 'L’ÉLÉMENT CHIMIQUE', pdfHref: 'https://drive.google.com/file/d/1SQ9Pyk_ofHHka9xsyEQy063IjVn1Ad2_/preview' },
    { num: 2, title: 'STRUCTURE DE L’ATOME', pdfHref: 'https://drive.google.com/file/d/1CS2exKD36-NDd_WiPGgIrHqYbM2SzqZy/preview' },
    { num: 3, title: 'CLASSIFICATION PÉRIODIQUE DES ÉLÉMENTS CHIMIQUES', pdfHref: 'https://drive.google.com/file/d/1fNdVRxjO0d1IUIeqRXcChEAm4f5NgAKA/preview' },
    { num: 4, title: 'IONS ET MOLÉCULES', pdfHref: 'https://drive.google.com/file/d/1d1cJG7dbudTLek94zifc_5Fxa-NVfNA4/preview' },
    { num: 5, title: 'MOLE ET GRANDEURS MOLAIRES', pdfHref: 'https://drive.google.com/file/d/11Dxvv9_10J5OKnKPTQg5BW8_7BjUjXhm/preview' },
    { num: 6, title: 'EQUATION-BILAN D’UNE REACTION CHIMIQUE', pdfHref: 'https://drive.google.com/file/d/1LxXgz45pMQIVBk_OfTJmbdubxi4TiQ-R/preview' },
    { num: 7, title: 'LE CHLORURE DE SODIUM SOLIDE', pdfHref: 'https://drive.google.com/file/d/1UaeLMfwr_LXq5RFwJkqVqD-fEzUKuNGY/preview' },
    { num: 8, title: 'SOLUTIONS AQUEUSES IONIQUES', pdfHref: 'https://drive.google.com/file/d/1vSeOW_2d_AETwIjCMg7RneCraiVa-s_t/preview' },
    { num: 9, title: 'TESTS D’IDENTIFICATION DE QUELQUES IONS', pdfHref: 'https://drive.google.com/file/d/1cZEFiSAOrPmw_SHr9lneZrtFJimZkJ2L/preview' },
    { num: 10, title: 'SOLUTIONS ACIDES ET BASIQUES. MESURES DE pH', pdfHref: 'https://drive.google.com/file/d/1aXUjEU5Fpz0KX4qgT56KPipVjx6TVGgk/preview' },
    { num: 11, title: 'REACTION ACIDO-BASIQUE DOSAGE', pdfHref: 'https://drive.google.com/file/d/1JgMP4NXgZNDh68CYIl8YI_Wj3fqZ17Ox/preview' },
];

const physiqueLessons = [
    { num: 1, title: 'LE MOUVEMENT', pdfHref: 'https://drive.google.com/file/d/1OtTjrTrXlaHO9xb_7HMSwpzbvXc_JzNm/preview' },
    { num: 2, title: 'ACTIONS MÉCANIQUES OU FORCES', pdfHref: 'https://drive.google.com/file/d/1p_FAscLYeFjZM0VYLI0MSNtOrNoqJL1S/preview' },
    { num: 3, title: 'ÉQUILIBRE D’UN SOLIDE SOUMIS A DEUX FORCES PUIS A TROIS FORCES', pdfHref: 'https://drive.google.com/file/d/1HC49fjTA_AQ-mbkJLtwAw0kz-4GfkeaW/preview' },
    { num: 4, title: 'ÉQUILIBRE D\'UN SOLIDE MOBILE AUTOUR D\'UN AXE FIXE', pdfHref: 'https://drive.google.com/file/d/1uK6wVP9O7zWQ3eI5-foBysjrtPKQQUTN/preview' },
    { num: 5, title: 'PRINCIPE DE L’INERTIE', pdfHref: 'https://drive.google.com/file/d/1TJgPY9HcBuPh8Z2THUu19dDhgFAIh3c1/preview' },
    { num: 6, title: 'QUANTITÉ DE MOUVEMENT', pdfHref: 'https://drive.google.com/file/d/1mzMD5XzMPDl8EFHqGpJ3N0JSvee1EtR1/preview' },
    { num: 8, title: 'INTENSITE D’UN COURANT CONTINU', pdfHref: 'https://drive.google.com/file/d/1NW2SWgOrl4WGob8_zDundtjZUFaD2r8L/preview' },
    { num: 9, title: 'TENSION ELECTRIQUE', pdfHref: 'https://drive.google.com/file/d/1ztaFQ0YBmiZ62oAJa3lvlFjv1ZEatc6V/preview' },
    { num: 10, title: 'ETUDE EXPERIMENTALE DE QUELQUES DIPÔLES PASSIFS', pdfHref: 'https://drive.google.com/file/d/1OdbY0VZfr7SJRZabbxDGito7o04Jv74C/preview' },
    { num: 11, title: 'ÉTUDE EXPÉRIMENTALE D’UN DIPÔLE ACTIF. POINT DE FONCTIONNEMENT', pdfHref: 'https://drive.google.com/file/d/1bsXp44701ytBlsqhn4RG_E7M4gBPQ9RH/preview' },
];


export default function PhysiqueChimieSecondeCPage() {
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
          Physique - Chimie
        </h1>
        <p className="text-muted-foreground">
          Liste des leçons disponibles pour cette matière.
        </p>
      </div>

      <div className="space-y-8">
        <div>
            <h2 className="font-headline text-2xl font-bold mb-4">Chimie</h2>
            <div className="grid gap-6 md:grid-cols-2">
                {chimieLessons.map((lesson) => (
                <Card key={`chimie-${lesson.num}`}>
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
            <h2 className="font-headline text-2xl font-bold mb-4">Physique</h2>
            <div className="grid gap-6 md:grid-cols-2">
                {physiqueLessons.map((lesson) => (
                <Card key={`physique-${lesson.num}`}>
                    <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                       {hasAccess ? (
                          <Unlock className="h-5 w-5 text-green-500" />
                        ) : (
                          <Lock className="h-5 w-5 text-red-500" />
                        )}
                        <span>
                            <span className="font-bold text-foreground">
                            LEÇON {lesson.num}:
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
      </div>
    </div>
  );
}
