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
  id: 'histoire-geographie-seconde-c',
  name: 'Histoire-Géographie Seconde C',
  url: '/courses/histoire-geographie-seconde-c',
};

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
  { num: 1, title: 'OBJET, INTERET ET DEMARCHE', pdfHref: 'https://drive.google.com/file/d/12A5yJK3HHgMCdHYQ4rK9iv3j19qGIR2T/preview', videoHref: '#' },
  { num: 2, title: 'La Planète terre', pdfHref: 'https://drive.google.com/file/d/1s8j93sRQ1rTLRfQdS5KV-m7OiVvwokhL/preview', videoHref: '#' },
  { num: 3, title: 'LES TECHNIQUES DE REPRESENTATION DE LA TERRE', pdfHref: 'https://drive.google.com/file/d/1BwratHpmIZGW0uzlEcyatrIW5bqpqgGl/preview', videoHref: '#' },
  { num: 4, title: 'LE MILIEU SUBEQUATORIAL IVOIRIEN', pdfHref: 'https://drive.google.com/file/d/1jbKcYWzM7UPkRuqnzv3z-s7hG3KHhMEY/preview', videoHref: '#' },
  { num: 5, title: 'LE MILIEU TROPICAL IVOIRIEN', pdfHref: 'https://drive.google.com/file/d/15OMTTE18Qr5sFdIGIEPQwme9UvL2HyqQ/preview', videoHref: '#' },
  { num: 6, title: "L'ESPACE IVOIRIEN: Un environnement menacé", pdfHref: 'https://drive.google.com/file/d/1lcykKMulY6trd6T6DUaRCJVPrY_H1IPp/preview', videoHref: '#' },
  { num: 7, title: 'LES GRANDS MILIEUX BIOGEOGRAPHIQUES DANS LE MONDE', pdfHref: 'https://drive.google.com/file/d/1SIhDRuZ1nEDd2V4mNT6OORRjXrBAVx4X/preview', videoHref: '#' },
  { num: 8, title: 'LES PROBLEMES ENVIRONNEMENTAUX ACTUELS', pdfHref: 'https://drive.google.com/file/d/1Zeh04PWugpqI6mWqt3RdbgtzFfS8nvCS/preview', videoHref: '#' },
];

const historyLessons = [
  { num: 1, title: "L'HISTOIRE ET LA FORMATION DU CITOYEN", pdfHref: 'https://drive.google.com/file/d/1FKP2vV38ZJg_YiFcdf9HM-ThughyWGaG/preview', videoHref: '#' },
  { num: 2, title: "LES METHODES D'ETUDE DE L'HISTOIRE", pdfHref: 'https://drive.google.com/file/d/1QUzjD_syEmplPLoc5WX-oUfBtjG4UFrl/preview', videoHref: '#' },
  { num: 3, title: 'LA METHODOLOGIE DE LA DISSERTATION ET DU COMMENTAIRE DE DOCUMENT', pdfHref: 'https://drive.google.com/file/d/1DWwBES76Imi0me1R0M0-wJON9CtR1qtA/preview', videoHref: '#' },
  { num: 4, title: "LA CIVILISATION DE L'EGYPTE ANCIENNE", pdfHref: 'https://drive.google.com/file/d/1-HolleigjJXG5NgeQaTRB-Y-ysXohthW/preview', videoHref: '#' },
  { num: 5, title: 'LA DEMOCRATIE ATHENIENNE', pdfHref: 'https://drive.google.com/file/d/1PCBRv5yn5puGLJIKcngAOZq6IHTCx3oS/preview', videoHref: '#' },
  { num: 6, title: 'LA CIVILISATION DU SOUDAN OCCIDENTAL AU MOYEN-ÂGE', pdfHref: 'https://drive.google.com/file/d/1mliduGlgbQ7XYnCds_AgLCvKYpCcuFAM/preview', videoHref: '#' },
  { num: 7, title: 'LES TRAITES DES NOIRS', pdfHref: 'https://drive.google.com/file/d/1iljLD7ZSkt36x0nVFJkKbXC3QfbwyZHD/preview', videoHref: '#' },
  { num: 8, title: "LA REVOLUTION DU NEOLITHIQUE EN CÔTE D'IVOIRE", pdfHref: 'https://drive.google.com/file/d/16Sqq1Pq3OEHyWP8AnkwW7_tq6rkTY7T3/preview', videoHref: '#' },
  { num: 9, title: "LES PEUPLES DE CÔTE D'IVOIRE, DIVERSITE ET UNITE", pdfHref: 'https://drive.google.com/file/d/1wjkxsA07mhx69KJ9fOhqsk91CKrTFuWr/preview', videoHref: '#' },
];

export default function HistoireGeographieSecondeCPage() {
  const { userProfile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' | 'video' } | null>(null);
  const hasAccess = isAdmin || (userProfile && userProfile?.solde > 0 && userProfile?.className === 'seconde');

  const handleLockedContent = () => {
    if (!userProfile || hasAccess) return;
    if (userProfile.solde <= 0) {
      toast({
        title: 'Contenu Verrouillé',
        description:
          "Votre solde est épuisé. Veuillez recharger votre compte pour accéder à ce cours.",
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
      </div>
    </div>
  );
}
