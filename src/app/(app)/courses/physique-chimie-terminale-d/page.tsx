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
  id: 'physique-chimie-terminale-d',
  name: 'Physique-Chimie Terminale D',
  url: '/courses/physique-chimie-terminale-d',
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
    { num: 1, title: 'LES ESTERS', pdfHref: 'https://drive.google.com/file/d/1X05k8oP6J4g5P4_sXmE3CgV3jJ4K5L6b/preview', videoHref: '#' },
    { num: 2, title: 'Classification des réactions organiques', pdfHref: 'https://drive.google.com/file/d/1C4sQ6N5kX8f9R1b2Z3D4F5g6H7J8K9L0/preview', videoHref: 'https://drive.google.com/file/d/1G2hJ8K9L0f1C4sQ6N5kX8f9R1b2Z3D4/preview' },
    { num: 3, title: 'Effets électroniques', pdfHref: 'https://drive.google.com/file/d/1L0f1C4sQ6N5kX8f9R1b2Z3D4F5g6H7J8/preview', videoHref: '#' },
    { num: 4, title: 'VITESSE DE FORMATION ET DE DISPARITION D’UNE ESPECE CHIMIQUE', pdfHref: 'https://drive.google.com/file/d/1R1b2Z3D4F5g6H7J8K9L0f1C4sQ6N5kX/preview', videoHref: '#' },
    { num: 5, title: 'FACTEURS CINETIQUES', pdfHref: 'https://drive.google.com/file/d/1kX8f9R1b2Z3D4F5g6H7J8K9L0f1C4sQ6/preview', videoHref: '#' },
    { num: 6, title: 'Les acides et les bases de Brönsted', pdfHref: 'https://drive.google.com/file/d/1N5kX8f9R1b2Z3D4F5g6H7J8K9L0f1C4s/preview', videoHref: 'https://drive.google.com/file/d/1Q6N5kX8f9R1b2Z3D4F5g6H7J8K9L0f1C/preview' },
    { num: 7, title: 'Le produit ionique de l’eau', pdfHref: 'https://drive.google.com/file/d/1sQ6N5kX8f9R1b2Z3D4F5g6H7J8K9L0f1/preview', videoHref: 'https://drive.google.com/file/d/1C4sQ6N5kX8f9R1b2Z3D4F5g6H7J8K9L0/preview' },
    { num: 8, title: 'Solutions aqueuses d’acides forts et de bases fortes', pdfHref: 'https://drive.google.com/file/d/1Z3D4F5g6H7J8K9L0f1C4sQ6N5kX8f9R/preview', videoHref: '#' },
    { num: 9, title: 'Solutions aqueuses d’acides faibles et de bases faibles', pdfHref: 'https://drive.google.com/file/d/1f9R1b2Z3D4F5g6H7J8K9L0f1C4sQ6N5k/preview', videoHref: 'https://drive.google.com/file/d/1X8f9R1b2Z3D4F5g6H7J8K9L0f1C4sQ6N/preview' },
    { num: 10, title: 'Les couples acide/base et classification', pdfHref: 'https://drive.google.com/file/d/1g6H7J8K9L0f1C4sQ6N5kX8f9R1b2Z3D4/preview', videoHref: 'https://drive.google.com/file/d/1K9L0f1C4sQ6N5kX8f9R1b2Z3D4F5g6H7/preview' },
    { num: 11, title: 'Réaction acido-basique', pdfHref: 'https://drive.google.com/file/d/1b2Z3D4F5g6H7J8K9L0f1C4sQ6N5kX8f9/preview', videoHref: '#' },
    { num: 12, title: 'Titrage acido-basique', pdfHref: 'https://drive.google.com/file/d/1sQ6N5kX8f9R1b2Z3D4F5g6H7J8K9L0f1/preview', videoHref: '#' }
];

const physiqueLessons = [
    { num: 1, title: 'LE MOUVEMENT DE CHUTE LIBRE', pdfHref: 'https://drive.google.com/file/d/1fJ8K9L0f1C4sQ6N5kX8f9R1b2Z3D4F5g/preview', videoHref: 'https://drive.google.com/file/d/1J8K9L0f1C4sQ6N5kX8f9R1b2Z3D4F5g/preview' },
    { num: 2, title: 'MOUVEMENT D’UN PROJECTILE DANS UN CHAMP DE PESANTEUR UNIFORME', pdfHref: 'https://drive.google.com/file/d/1sQ6N5kX8f9R1b2Z3D4F5g6H7J8K9L0f1/preview', videoHref: 'https://drive.google.com/file/d/1f1C4sQ6N5kX8f9R1b2Z3D4F5g6H7J8K9/preview' },
    { num: 3, title: 'LES OSCILLATIONS MÉCANIQUES LIBRES', pdfHref: 'https://drive.google.com/file/d/1X8f9R1b2Z3D4F5g6H7J8K9L0f1C4sQ6N/preview', videoHref: 'https://drive.google.com/file/d/1b2Z3D4F5g6H7J8K9L0f1C4sQ6N5kX8f/preview' },
    { num: 4, title: 'LES OSCILLATIONS ÉLECTRIQUES LIBRES', pdfHref: 'https://drive.google.com/file/d/1Q6N5kX8f9R1b2Z3D4F5g6H7J8K9L0f1C/preview', videoHref: 'https://drive.google.com/file/d/1F5g6H7J8K9L0f1C4sQ6N5kX8f9R1b2Z3/preview' },
    { num: 5, title: 'Les ondes mécaniques progressives', pdfHref: 'https://drive.google.com/file/d/1N5kX8f9R1b2Z3D4F5g6H7J8K9L0f1C4s/preview', videoHref: 'https://drive.google.com/file/d/1J8K9L0f1C4sQ6N5kX8f9R1b2Z3D4F5g/preview' },
    { num: 6, title: 'MODÈLE CORPUSCULAIRE DE LA LUMIÈRE : L’EFFET PHOTOÉLECTRIQUE', pdfHref: 'https://drive.google.com/file/d/1sQ6N5kX8f9R1b2Z3D4F5g6H7J8K9L0f1/preview', videoHref: 'https://drive.google.com/file/d/1f1C4sQ6N5kX8f9R1b2Z3D4F5g6H7J8K9/preview' },
    { num: 7, title: 'REACTIONS NUCLEAIRES SPONTANEES : LA RADIOACTIVITE', pdfHref: 'https://drive.google.com/file/d/1b2Z3D4F5g6H7J8K9L0f1C4sQ6N5kX8f9/preview', videoHref: '#' },
    { num: 8, title: 'REACTIONS NUCLEAIRES PROVOQUEES', pdfHref: 'https://drive.google.com/file/d/1F5g6H7J8K9L0f1C4sQ6N5kX8f9R1b2Z3/preview', videoHref: 'https://drive.google.com/file/d/1fJ8K9L0f1C4sQ6N5kX8f9R1b2Z3D4F5g/preview' },
    { num: 9, title: 'ENERGIE NUCLEAIRE', pdfHref: 'https://drive.google.com/file/d/1J8K9L0f1C4sQ6N5kX8f9R1b2Z3D4F5g/preview', videoHref: 'https://drive.google.com/file/d/1b2Z3D4F5g6H7J8K9L0f1C4sQ6N5kX8f9/preview' }
];

export default function PhysiqueChimieTerminaleDPage() {
  const { userProfile, hasCourseAccess } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' | 'video' } | null>(null);
  const hasAccess = hasCourseAccess && userProfile?.className === 'terminale';

  const handleLockedContent = () => {
    if (!userProfile) return;
    let message = "Vous n'avez pas accès à ce contenu.";
    if (!hasCourseAccess) {
        message = "Veuillez débloquer l'accès aux cours depuis votre tableau de bord.";
    } else if (userProfile.className !== 'terminale') {
        message = "Ce contenu est réservé aux élèves de Terminale.";
    }
    
    toast({
        title: 'Accès non autorisé',
        description: message,
        variant: 'destructive',
    });
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
        <p className="text-sm font-medium text-primary">Terminale D</p>
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
