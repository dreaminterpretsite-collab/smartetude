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
import { useFirebase } from '@/firebase';

const courseInfo: CourseInfo = {
  id: 'physique-chimie-premiere-c',
  name: 'Physique-Chimie Première C',
  url: '/courses/physique-chimie-premiere-c',
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
    { num: 2, title: 'HYDROCARBURES SATURÉS : LES ALCANES', pdfHref: 'https://drive.google.com/file/d/1j1jQq5u-Rn3dlqf2iDFw7A-aCuvlNFaN/preview' },
    { num: 3, title: 'HYDROCARBURES INSATURÉS : ALCÈNES ET ALCYNES', pdfHref: 'https://drive.google.com/file/d/1VlJsmmntwEXrm8gwVDI7K8rE7qHuJjcK/preview' },
    { num: 4, title: 'LE BENZÈNE', pdfHref: '#' },
    { num: 5, title: 'PETROLE ET GAZ NATURELS', pdfHref: 'https://drive.google.com/file/d/1D-wbzxlZsIHpFqR_lxysghE7noSX7COz/preview' },
    { num: 6, title: 'QUELQUES COMPOSES OXYGÈNES', pdfHref: 'https://drive.google.com/file/d/1T7BFL_YISAAFkAGGXcJ5Xd6YYJ7QnZHY/preview' },
    { num: 7, title: 'L’ÉTHANOL', pdfHref: 'https://drive.google.com/file/d/10djKWmqfkYIjpynKRPsttnbKkQIqDBwZ/preview' },
    { num: 8, title: 'ESTÉRIFICATION ET HYDROLYSE D’UN ESTER', pdfHref: 'https://drive.google.com/file/d/1WWCCIHWGF0fTJgD0y3I-CkRilz8zPfrF/preview' },
    { num: 11, title: 'CLASSIFICATION QUANTITATIVE DES COUPLES OXYDANTS/REDUCTEURS', pdfHref: 'https://drive.google.com/file/d/1E_UQ3v73lo36jBSRnR5GYM0_uD7Qac7d/preview' },
    { num: 12, title: 'COUPLES OXYDANTS/RÉDUCTEURS EN SOLUTION AQUEUSE. DOSAGE.', pdfHref: 'https://drive.google.com/file/d/1LjnGoNkhZF0wo62M5Qyt_W_1js-pZ948/preview' },
    { num: 13, title: 'OXYDORÉDUCTION PAR VOIE SÈCHE', pdfHref: 'https://drive.google.com/file/d/1F1MIIEFtKa_0TFgcmDGkS1sV736IGVF6/preview' },
    { num: 14, title: 'ELECTROLYSE', pdfHref: 'https://drive.google.com/file/d/1-868FbPHaW6gqfDegHtEpgAElet8xOlB/preview' },
    { num: 15, title: 'CORROSION ET PROTECTION DES METAUX', pdfHref: 'https://drive.google.com/file/d/1_DXD9963dzgDJY72czl3ev9MsC4VO34a/preview' },
];

const physiqueLessons = [
    { num: 1, title: 'TRAVAIL ET PUISSANCE D’UNE FORCE DANS LE CAS D’UN MOUVEMENT DE TRANSLATION', pdfHref: 'https://drive.google.com/file/d/19iwN4opm_td4NqnqboFsWBleG6w0kSEI/preview' },
    { num: 2, title: 'TRAVAIL ET PUISSANCE D’UNE FORCE DANS LE CAS D’UN MOUVEMENT DE ROTATION AUTOUR D’UN AXE FIXE', pdfHref: '#' },
    { num: 3, title: 'ENERGIE CINÉTIQUE', pdfHref: 'https://drive.google.com/file/d/10ddm-wVwSbID1xLs3X09Novlv2N9PBdb/preview' },
    { num: 4, title: 'ENERGIE POTENTIELLE', pdfHref: 'https://drive.google.com/file/d/155IL_PcsCS6FzyNBi5_XBM01mq9sRbv-/preview' },
    { num: 5, title: 'ENERGIE MECANIQUE', pdfHref: 'https://drive.google.com/file/d/1br6s9PAv7QyoUitJ_t3HH29zAuusFHr1/preview' },
    { num: 6, title: 'CHAMP ÉLECTROSTATIQUE', pdfHref: 'https://drive.google.com/file/d/1AHFfNfWe23QlrOSM27iAAyggsanyEuTm/preview' },
    { num: null, title: 'ENERGIE POTENTIELLE ÉLECTROSTATIQUE', pdfHref: '#' },
    { num: 8, title: 'PUISSANCE ET ENERGIE ELECTRIQUE', pdfHref: 'https://drive.google.com/file/d/1zq9hM3doUXXYMO4Ti5kBDqDjogDsCG6K/preview' },
    { num: 9, title: 'LE CONDENSATEUR', pdfHref: '#' },
    { num: 10, title: 'L’AMPLIFICATEUR OPERATIONNEL', pdfHref: 'https://drive.google.com/file/d/1m-29flVrjgBap5f2u-QG0GSqKEzoEZ-_/preview' },
    { num: 11, title: 'INTRODUCTION À L’OPTIQUE GÉOMÉTRIQUE', pdfHref: 'https://drive.google.com/file/d/1y-bhLYLevEVDAyReRK-chgLO4XXmdsmf/preview' },
    { num: 12, title: 'REFLEXION ET REFRACTION DE LA LUMIERE BLANCHE', pdfHref: 'https://drive.google.com/file/d/1B4MRou554txI9_VWzNGHK-h4fQuIEDCX/preview' },
    { num: 13, title: 'LES LENTILLES MINCES', pdfHref: 'https://drive.google.com/file/d/1uKKzfXKKYSaMHK9ssvmvnBx9RUPuOoah/preview' },
];


export default function PhysiqueChimiePremiereCPage() {
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
                {chimieLessons.map((lesson, index) => (
                <Card key={`chimie-${lesson.num}-${index}`}>
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
                {physiqueLessons.map((lesson, index) => (
                <Card key={`physique-${lesson.num}-${index}`}>
                    <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        {hasAccess ? (
                          <Unlock className="h-5 w-5 text-green-500" />
                        ) : (
                          <Lock className="h-5 w-5 text-red-500" />
                        )}
                        <span>
                            {lesson.num && <span className="font-bold text-foreground">
                            LEÇON {lesson.num}:
                            </span>}
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
