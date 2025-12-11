'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, FileText, Lock, Unlock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { trackCourseVisit, type CourseInfo } from '@/lib/course-visits';
import { useToast } from '@/hooks/use-toast';
import { ContentViewer } from '@/components/content-viewer';
import { useFirebase } from '@/firebase';

const courseInfo: CourseInfo = {
  id: 'maths-terminale-c',
  name: 'Maths Terminale C',
  url: '/courses/math-terminale-c',
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
  { num: 1, title: 'Limite et continuité', pdfHref: 'https://drive.google.com/file/d/1tAlMC-iVaKRv3MTu6pDZzbsFmMva5Gxg/preview', videoHref: 'https://drive.google.com/file/d/1fGt1-wLPJiqyBoQC1FlRZReNEtatmpFh/preview' },
  { num: 2, title: 'Barycentre', pdfHref: 'https://drive.google.com/file/d/1QatHRU7JdvBN1DCbSOLdJtTOMP4DIzvU/preview', videoHref: '#' },
  { num: 3, title: 'Divisibilité dans Z', pdfHref: 'https://drive.google.com/file/d/1tF7aA6sn0By510auzuBRWacROdjEaegd/preview', videoHref: '#' },
  { num: 4, title: 'DERIVABILITE ET ETUDE DE FONCTIONS', pdfHref: 'https://drive.google.com/file/d/1JIl6RDnDIMuU2Cf6w-9Qy5MPZoWTWnse/preview', videoHref: '#' },
  { num: 5, title: "Géometrie analytique de l'espace", pdfHref: 'https://drive.google.com/file/d/1oE8xduMddE4uO90EUMFvFiWQoqeiN6sI/preview', videoHref: '#' },
  { num: 6, title: 'PRIMITIVES', pdfHref: 'https://drive.google.com/file/d/1O_MZRdNk3JZdNoBrN3EJztDK9NqMDUT-/preview', videoHref: 'https://drive.google.com/file/d/1hSTBl8NRFziWzutiMsvFzVY2uq3CSA2M/preview' },
  { num: 7, title: 'Coniques', pdfHref: 'https://drive.google.com/file/d/1gt75C8UF4_LeSc-9k5bBdNrguB37kWNH/preview', videoHref: '#' },
  { num: 8, title: 'FONCTIONS LOGARITHMES', pdfHref: 'https://drive.google.com/file/d/1-KvJZjG3a-agPhbX8HIbimL37pBpebQo/preview', videoHref: 'https://drive.google.com/file/d/15lvFpUehZ7LTnZRViEUWwNAcfaai56ax/preview' },
  { num: 9, title: 'Nombres complexes', pdfHref: 'https://drive.google.com/file/d/1ZAaHLNCUNg-4Ea9FK59_cy-9uYqg7ivV/preview', videoHref: '#' },
  { num: 10, title: 'Fonction exponentielle et fonction puissance', pdfHref: 'https://drive.google.com/file/d/1QzZnoASRgBM_3sw4m392YNeCXe8_BSoM/preview', videoHref: 'https://drive.google.com/file/d/11cftYjtRo8NO2XPw8zCRcObnj-YVv6XJ/preview' },
  { num: 11, title: 'PPCM et PGCD de deux entiers relatifs', pdfHref: 'https://drive.google.com/file/d/1SkUy15Ly7AAkzm7oC6bmZP6ItqlmkFej/preview', videoHref: '#' },
  { num: 12, title: 'Suites numériques', pdfHref: 'https://drive.google.com/file/d/1234YssMZ-xIL2usjvamhhUrRyxzYsygN/preview', videoHref: '#' },
  { num: 13, title: 'Nombres complexes et géometrie du plan', pdfHref: 'https://drive.google.com/file/d/1rEZsnVcYLUN49lgKmSCQBLwlGMQJk1J-/preview', videoHref: '#' },
  { num: 14, title: 'isometrie du plan', pdfHref: 'https://drive.google.com/file/d/10IBQETR4WdftPeuxXtW94rySYTV3NMjt/preview', videoHref: '#' },
  { num: 15, title: 'Calcul intégral', pdfHref: 'https://drive.google.com/file/d/1gfTRKkdYvchUWPzbD1dWePaWKwXAWG81/preview', videoHref: '#' },
  { num: 16, title: 'Similitudes directes du plan', pdfHref: 'https://drive.google.com/file/d/1DmmgSXGk9ZzUhDjL8OR1rXI8eS2XMx3C/preview', videoHref: '#' },
  { num: 17, title: 'Probabilité', pdfHref: 'https://drive.google.com/file/d/1FMdHUPprW62L7HiOKPGuYLq7_U3SQIZb/preview', videoHref: 'https://drive.google.com/file/d/1wefBpEVyrbc7Jwl-8cDOHl9bGbr1yqXH/preview' },
  { num: 18, title: 'Equations différentielles', pdfHref: 'https://drive.google.com/file/d/1uP-qLD7RL2W43Zk_NjGsQ18ZaJV_ZoOk/preview', videoHref: '#' },
  { num: 19, title: 'Statistiques', pdfHref: 'https://drive.google.com/file/d/19F4_qt-UlUvfrNWBRz5JavP6eAlPOF_d/preview', videoHref: '#' },
];

export default function MathTerminaleCPage() {
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
        onOpenChange={(isOpen) => !isOpen && setViewerContent(null)}
      />
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Terminale C</p>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Mathématiques
        </h1>
        <p className="text-muted-foreground">
          Liste des leçons disponibles pour cette matière.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {lessons.map((lesson) => (
          <Card key={lesson.num}>
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
  );
}
