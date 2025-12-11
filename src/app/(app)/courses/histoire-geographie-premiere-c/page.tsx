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
  id: 'histoire-geographie-premiere-c',
  name: 'Histoire-Géographie Première C',
  url: '/courses/histoire-geographie-premiere-c',
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

const geographyLessons = [
  { num: 'G1', title: 'DYNAMISME DEMOGRAPHIQUE ET QUALITE DE LA VIE EN CÔTE D\'IVOIRE', pdfHref: '#', videoHref: '#' },
  { num: 'G2', title: 'LA CROISSANCE DEMOGRAPHIQUE MONDIALE ET SES PROBLEMES', pdfHref: '#', videoHref: '#' },
  { num: 'T2 L1', title: 'L\'URBANISATION DANS LES PAYS EN DEVELOPPEMENT: exemple de la Côte d\'Ivoire', pdfHref: '#', videoHref: '#' },
  { num: 'T2 L2', title: 'L\'URBANISATION DANS LES PAYS DEVELOPPES: exemple de la France', pdfHref: '#', videoHref: '#' },
  { num: 'T3 L1', title: 'L\'ORGANISATION ADMINISTRATIVE DE LA CÔTE D\'IVOIRE', pdfHref: '#', videoHref: '#' },
  { num: 'T3 L2', title: 'L\'AMENAGEMENT DU TERRITOIRE IVOIRIEN', pdfHref: '#', videoHref: '#' },
  { num: 'T4 L1', title: 'LES FACTEURS DE LA MONDIALISATION', pdfHref: '#', videoHref: '#' },
  { num: 'T4 L2', title: 'LES CONSEQUENCES DE LA MONDIALISATION', pdfHref: '#', videoHref: '#' },
];

const historyLessons = [
  { num: 'T1 L1', title: 'L\'ESSOR DU CAPITALISME ET SES CONSEQUENCES', pdfHref: '#', videoHref: '#' },
  { num: 'T1 L2', title: 'LES REVOLUTIONS INDUSTRIELLES', pdfHref: '#', videoHref: '#' },
  { num: 'T2 L1', title: 'LE MOUVEMENT IMPERIALISTE ET LE CONGRES DE BERLIN', pdfHref: '#', videoHref: '#' },
  { num: 'T2 L2', title: 'LES RESISTANCES AUX CONQUETES TERRITORIALES EN AFRIQUE: exemple de la CÔTE D\'IVOIRE', pdfHref: '#', videoHref: '#' },
  { num: 'T2 L3', title: 'LA COLONISATION ET LES RESISTANCES EN CÔTE D\'IVOIRE', pdfHref: '#', videoHref: '#' },
  { num: 'T3 L1', title: 'LA PREMIERE GUERRE MONDIALE: Causes et Conséquences', pdfHref: '#', videoHref: '#' },
  { num: 'T3 L2', title: 'LA DEUXIEME GUERRE MONDIALE: Causes et Conséquences', pdfHref: '#', videoHref: '#' },
  { num: 'T3 L3', title: 'LES VIOLENCES DE MASSE: les Génocides du XXè siècle à nos jours', pdfHref: '#', videoHref: '#' },
];

export default function HistoireGeographiePremiereCPage() {
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
          Histoire - Géographie
        </h1>
        <p className="text-muted-foreground">
          Liste des leçons disponibles pour cette matière.
        </p>
      </div>

      <div className="space-y-8">
        <div>
            <h2 className="font-headline text-2xl font-bold mb-4">Géographie</h2>
            <div className="grid gap-6 md:grid-cols-2">
                {geographyLessons.map((lesson, index) => (
                <Card key={`geo-${index}`}>
                    <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        {hasAccess ? (
                          <Unlock className="h-5 w-5 text-green-500" />
                        ) : (
                          <Lock className="h-5 w-5 text-red-500" />
                        )}
                        <span>
                            <span className="font-bold text-foreground">
                            {lesson.num}:
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
            <h2 className="font-headline text-2xl font-bold mb-4">Histoire</h2>
            <div className="grid gap-6 md:grid-cols-2">
                {historyLessons.map((lesson, index) => (
                <Card key={`hist-${index}`}>
                    <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        {hasAccess ? (
                          <Unlock className="h-5 w-5 text-green-500" />
                        ) : (
                          <Lock className="h-5 w-5 text-red-500" />
                        )}
                        <span>
                            <span className="font-bold text-foreground">
                            {lesson.num}:
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
      </div>
    </div>
  );
}
