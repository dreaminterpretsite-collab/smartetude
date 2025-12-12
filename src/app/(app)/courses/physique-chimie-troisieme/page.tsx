'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, FileText, Lock, Unlock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { trackCourseVisit, type CourseInfo } from '@/lib/course-visits';
import { useToast } from '@/hooks/use-toast';
import { ContentViewer } from '@/components/content-viewer';
import { useFirebase } from '@/firebase/client-provider';

const courseInfo: CourseInfo = {
  id: 'physique-chimie-troisieme',
  name: 'Physique-Chimie Troisième',
  url: '/courses/physique-chimie-troisieme',
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
    { title: 'MASSE ET POIDS D’UN CORPS', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1gaInIRVw12RXVOb_E-zWXSJp-iBaSIyE/preview' },
    { title: 'LES FORCES', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1XzB3PLaZ9KIkprC7j8DVax6AW43rnPC1/preview' },
    { title: 'ÉQUILIBRE D’UN SOLIDE SOUMIS A DEUX FORCES', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/170wpfQnN3Se5pZ_wYDLu2uYkYUMNfHB8/preview' },
    { title: 'TRAVAIL ET PUISSANCE MÉCANIQUES', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1ZNm5w1lLDDr9NDsMzCRxwF3ELEI968eV/preview' },
    { title: 'ÉNERGIE MÉCANIQUE', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1lWGG5kc85CXiUcnhZXGIfzR1jS6BP4WY/preview' },
    { title: 'ELECTROLYSE ET SYNTHESE DE L’EAU', videoHref: 'https://drive.google.com/file/d/1KC_IrZO2B9E5yBRvfFHK6EiUj2Pf0-l5/preview', pdfHref: 'https://drive.google.com/file/d/1bzyWpONrfwDc8sBKUWo96ILyiCY94WEV/preview' },
    { title: 'LES ALCANES', videoHref: 'https://drive.google.com/file/d/17E81ATkxmqR4tKH84v3CMCXL4StRUOas/preview', pdfHref: 'https://drive.google.com/file/d/1QgYKqzVl8eB9ymNG8RQlt6jCYUEQDRjO/preview' },
    { title: 'LES LENTILLES', videoHref: 'https://drive.google.com/file/d/1vMYoC1jNzGFxaFwAlt-iccHJH3TavS2W/preview', pdfHref: 'https://drive.google.com/file/d/1_1z98fwmwkNmpV33RPP9ftXo_x-Fizk0/preview' },
    { title: 'LES DÉFAUTS DE L’ŒIL ET LEURS CORRECTIONS', videoHref: 'https://drive.google.com/file/d/1WKZUzWdDSFSZJAZjAQQBFCy6AM1XuW7g/preview', pdfHref: 'https://drive.google.com/file/d/1scyFFbzwi0nWM3Bt5AKGS0ZWDe4DPTLN/preview' },
    { title: 'OXYDATION DES CORPS PURS SIMPLES', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1sPelevp4F73DsjVgDZk6OdAqNwkyyHMX/preview' },
    { title: 'RÉDUCTION DES OXYDES', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1JgkIRsi_SjRhoXxjSXvP0AUqYuq-NyMs/preview' },
    { title: 'SOLUTIONS ACIDES, BASIQUES ET NEUTRES', videoHref: '#', pdfHref: '#' },
    { title: 'LE CONDUCTEUR OHMIQUE', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1SaISr3wQcU1nELDgtjH8SP-HILppNPeW/preview' },
    { title: 'PUISSANCE ET ENERGIE ELECTRIQUES', videoHref: '#', pdfHref: '#' },
];

export default function PhysiqueChimieTroisiemePage() {
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
          Physique - Chimie
        </h1>
        <p className="text-muted-foreground">
          Liste des leçons disponibles pour cette matière.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
