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
  id: 'histoire-geographie-troisieme',
  name: 'Histoire-Géographie Troisième',
  url: '/courses/histoire-geographie-troisieme',
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
  { num: 'T1 L1', title: 'LES ATOUTS NATURELS ET HUMAINS DU DEVELOPPEMENT ECONOMIQUE DE LA CÔTE D\'IVOIRE', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1dadI3u6OOaAOzccgLkytSSOfBGXoF4iP/preview' },
  { num: 'T1 L2', title: 'LES SECTEURS D\'ACTIVITES ECONOMIQUES DE LA CÔTE D\'IVOIRE', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1S0N6Zxx3HIhj81UnJkuKgXIKRFNgltT8/preview' },
  { num: 'T1 L3', title: 'LES PROBLEMES DU DEVELOPPEMENT ECONOMIQUE DE LA CÔTE D\'IVOIRE', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1MrGtvuu-AU_RMfe1UHmSVtwcoUH6pwI6/preview' },
  { num: 'T2 L1', title: 'ETUDE ECONOMIQUE DE L\'AFRIQUE', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1Y31w11LfbCC9WzyXmNmjGksxT2B2nVYd/preview' },
  { num: 'T2 L2', title: 'LA PLACE DE L’AFRIQUE DANS LA MONDIALISATION', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1ZsEctjpkKZ9am5OrMf9mTLyZF03mcMKZ/preview' },
];

const historyLessons = [
  { num: 'T1 L1', title: 'LE MOUVEMENT IMPERIALISTE ET LA COLONISATION EN CÔTE D\'IVOIRE', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1nNrdM-2QAN1WltoX9BhU6RWE2V4v4nXB/preview' },
  { num: 'T1 L2', title: 'L\'ACCESSION DE LA CÔTE D\'IVOIRE A L\'INDEPENDANCE', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1SpnkB5VylyvN9VLF-r56GNyCsmNm2cc0/preview' },
  { num: 'T1 L3', title: 'CAUSES ET CARACTERES DES CRISES SOCIOPOLITIQUES DE L\'AFRIQUE INDEPENDANTEE', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1xA-9I5G5rmkduI42v7YoEY4E67IzZi6c/preview' },
  { num: 'T2 L1', title: 'LES CAUSES, CARACTERES ET CONSEQUENCES DE LA DEUXIEME GUERRE MONDIALE', videoHref: 'https://drive.google.com/file/d/1DmgFla2wzxKClcX8Lu33jg5R1WFGJwIF/preview', pdfHref: 'https://drive.google.com/file/d/1iVDSY9_w_-KRrCPwCMf2uRFCiLXwflCe/preview' },
  { num: 'T2 L2', title: 'L’ORGANISATION DES NATIONS UNIES (ONU)', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/138sUStKWP1Nw_lvrqV439Eq2dQDZZOxi/preview' },
  { num: 'T2 L3', title: 'L’UNION AFRICAINE (UA)', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1GLb1NwRZAuwhy-Uuet_ncb4dtsuPVQ22/preview' },
];


export default function HistoireGeographieTroisiemePage() {
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
                {geographyLessons.map((lesson) => (
                <Card key={lesson.title}>
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
                {historyLessons.map((lesson) => (
                <Card key={lesson.title}>
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
