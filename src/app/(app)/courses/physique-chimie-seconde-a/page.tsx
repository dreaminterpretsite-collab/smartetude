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
  id: 'physique-chimie-seconde-a',
  name: 'Physique-Chimie Seconde A',
  url: '/courses/physique-chimie-seconde-a',
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
    { num: 1, title: 'L’ÉLÉMENT CHIMIQUE', pdfHref: 'https://drive.google.com/file/d/1tbHoHp1vNnCn_FJmNqSWhWPT7Cy0f2pF/preview', videoHref: '#' },
    { num: 2, title: 'STRUCTURE DE L’ATOME', pdfHref: 'https://drive.google.com/file/d/1n9FkSLaYLvmPt4oMcyLChid0x4FEGHc5/preview', videoHref: '#' },
    { num: 3, title: 'CLASSIFICATION PÉRIODIQUE DES ÉLÉMENTS CHIMIQUES', pdfHref: 'https://drive.google.com/file/d/1U9ibhRzX85hOtaxIYuwC7vPEqy5VkRVH/preview', videoHref: '#' },
    { num: 4, title: 'IONS ET MOLÉCULES', pdfHref: 'https://drive.google.com/file/d/1r55zrJ__8m17gkftRab30JCmcPq6f-xz/preview', videoHref: '#' },
    { num: 5, title: 'MOLE ET GRANDEURS MOLAIRES', pdfHref: 'https://drive.google.com/file/d/1pB7kuw-kMpVyK2dJvnNGknoK-KOg0DU8/preview', videoHref: '#' },
    { num: 6, title: 'EQUATION-BILAN D’UNE REACTION CHIMIQUE', pdfHref: 'https://drive.google.com/file/d/1Zb_9DdPK8uTFJzp3LQrsbcHDi-eMeqir/preview', videoHref: '#' },
    { num: 7, title: 'SOLUTIONS AQUEUSES IONIQUES', pdfHref: 'https://drive.google.com/file/d/1-IYCYkEUsOzLX64MGk3nHfjljgbn6hPD/preview', videoHref: '#' },
    { num: 8, title: 'TESTS D\'IDENTIFICATION DE QUELQUES IONS', pdfHref: 'https://drive.google.com/file/d/1QQrS3RkUa-Le4cnJFl2yrXdMyIEgCcjp/preview', videoHref: '#' },
];

const physiqueLessons = [
    { num: 1, title: 'LE MOUVEMENT', pdfHref: 'https://drive.google.com/file/d/1thd1MgD6WI_aeJdmJL0_TQjx5JeXKb8f/preview', videoHref: '#' },
    { num: 2, title: 'ÉQUILIBRE D’UN SOLIDE SOUMIS A DEUX FORCES', pdfHref: 'https://drive.google.com/file/d/1gYdegegra9w9YsYQRAWfUnMVSywS5ZQc/preview', videoHref: '#' },
];


export default function PhysiqueChimieSecondeAPage() {
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
        <p className="text-sm font-medium text-primary">Seconde A</p>
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
