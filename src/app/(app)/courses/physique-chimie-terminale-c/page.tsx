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
  id: 'physique-chimie-terminale-c',
  name: 'Physique-Chimie Terminale C',
  url: '/courses/physique-chimie-terminale-c',
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
    { num: 1, title: 'Les alcools', pdfHref: 'https://drive.google.com/file/d/1gIlTW_eZeykVmy3rubEsJAhB8CieZob4/preview', videoHref: 'https://drive.google.com/file/d/1g05zymYmBUPaqU46neDxqhbOaAzYpbdB/preview' },
    { num: 2, title: 'Composés carbonylés: aldéhydes et cétones', pdfHref: 'https://drive.google.com/file/d/1P0-HPYYRZwtVAYQt-sB7npWl0_ZDzHc5/preview', videoHref: '#' },
    { num: 3, title: 'Les amines', pdfHref: 'https://drive.google.com/file/d/17lNuusoAR64lTvqe2LPCklHIKmW-dJ3K/preview', videoHref: '#' },
    { num: 4, title: 'Acides carboxyliques et dérivés', pdfHref: 'https://drive.google.com/file/d/1T6DFl7sY0pzCdL9IYkiPScBlMH-RFzAJ/preview', videoHref: 'https://drive.google.com/file/d/1EqzafFypujtbJzaVMx1-JPgLKp1D0s_T/preview' },
    { num: 5, title: 'Fabrication d\'un savon', pdfHref: 'https://drive.google.com/file/d/1d9wybycbyHA3__XqtqidL6_tkj23leUo/preview', videoHref: '#' },
    { num: 6, title: 'Solutions aqueuses-Notion de pH', pdfHref: 'https://drive.google.com/file/d/1TN9-lRk8dyxB6n35-FUYh_FEuJEg6LdL/preview', videoHref: '#' },
    { num: 7, title: 'Acide fort-Base forte', pdfHref: 'https://drive.google.com/file/d/1OjmBfyE0zkTxk8C3hRqG4Hpw4UabQOYF/preview', videoHref: '#' },
    { num: 8, title: 'Acide faible - Base faible', pdfHref: 'https://drive.google.com/file/d/1NLFEgYMcHjFk3ky82s-ZJ2X2XO5E0O4v/preview', videoHref: '#' },
    { num: 9, title: 'Couple acide/base-Classification', pdfHref: 'https://drive.google.com/file/d/1w0LIausXNrwiSFS6-ycrBkR6prYCdqYz/preview', videoHref: 'https://drive.google.com/file/d/1N-Ft4ODAjpsmndg_e37JWeu3_sXtOs_O/preview' },
    { num: 10, title: 'Réactions acidobasiques. Solutions tampons', pdfHref: 'https://drive.google.com/file/d/1mMFoT-dspa5XuTBbW90Iq7a3A5uWK1ve/preview', videoHref: '#' },
    { num: 11, title: 'Dosage Acido-Basique (2)', pdfHref: 'https://drive.google.com/file/d/1R9utA4gVXiPHuAOuY8NV3IjDK0weoY-4/preview', videoHref: '#' },
    { num: 12, title: 'Acides alpha aminés', pdfHref: 'https://drive.google.com/file/d/1Fpwiw5yOZnyBYrFmiufP8eU3sd0QfptH/preview', videoHref: '#' },
];

const physiqueLessons = [
    { num: 1, title: 'Cinématique du point', pdfHref: 'https://drive.google.com/file/d/1XfEYGuXLMdAr9wEbJmyJABJiebcgYhm2/preview', videoHref: 'https://drive.google.com/file/d/1g05zymYmBUPaqU46neDxqhbOaAzYpbdB/preview' },
    { num: 2, title: 'Mouvement du centre d\'inertie d\'un solide', pdfHref: 'https://drive.google.com/file/d/1bnyqhxhbW5yCWtdcppDSAnyALDVYXxfx/preview', videoHref: 'https://drive.google.com/file/d/1hlIES9tRIEq9JBvnMtmZGrON1ucXP1wq/preview' },
    { num: 3, title: 'Interaction gravitationnelle', pdfHref: 'https://drive.google.com/file/d/1imPCrOu_-03sHmx07J_uVt38I3sUciaJ/preview', videoHref: 'https://drive.google.com/file/d/19_mPOLnv1mwhLQhKGnZVq-3rAJ_lCkWN/preview' },
    { num: 4, title: 'Mouvement dans les champs G et E uniformes', pdfHref: 'https://drive.google.com/file/d/1IfY403HEDoE5_28mw2YoLHNVnMH1-i4x/preview', videoHref: 'https://drive.google.com/file/d/1OMekgkeSXFKFFvtt6BpQnoV25Xe0iklQ/preview' },
    { num: 5, title: 'Oscillations mécaniques libres', pdfHref: 'https://drive.google.com/file/d/1MOMTFQv7ZvBjV08m5W0_lVAU63DhV4IN/preview', videoHref: '#' },
    { num: 6, title: 'Champ magnétique', pdfHref: 'https://drive.google.com/file/d/1K4wZS1bJd1m7WUMPcRv2kp21-2vi6yBy/preview', videoHref: 'https://drive.google.com/file/d/1-TPqLLxJUm21Y7uG8qSSazZE9krK8oqr/preview' },
    { num: 8, title: 'Loi de Laplace', pdfHref: 'https://drive.google.com/file/d/12GuSfkZytfaJ_3AeWzBz4nJDW9_xQCdg/preview', videoHref: 'https://drive.google.com/file/d/1_hvF4MnIw2jg0fAqQST08t7hZTocpLRi/preview' },
    { num: 9, title: 'Induction électromagnétique', pdfHref: '#', videoHref: 'https://drive.google.com/file/d/1N-Ft4ODAjpsmndg_e37JWeu3_sXtOs_O/preview' },
    { num: 10, title: 'Auto induction', pdfHref: 'https://drive.google.com/file/d/1HscrEcVCwNDGLk8rzKEMyRWKuL7xsZ7A/preview', videoHref: '#' },
    { num: 11, title: 'Montages dérivateur et intégrateur', pdfHref: 'https://drive.google.com/file/d/1fK3s0mMLAUdiWnhIy2OANlCe-Ren8J5o/preview', videoHref: '#' },
    { num: 13, title: 'Circuit RLC en régime sinusoïdal forcé', pdfHref: 'https://drive.google.com/file/d/1B1DtDECK-OZqqjLsaSIgm18cAiOk0icm/preview', videoHref: '#' },
    { num: 14, title: 'Résonance d\'intensité d\'un circuit RLC série', pdfHref: 'https://drive.google.com/file/d/19I_jTfSZ9Y-KdeCHIZGqjXpY6DbJG1g1/preview', videoHref: '#' },
    { num: 15, title: 'Puissance en courant alternatif', pdfHref: 'https://drive.google.com/file/d/1jH5o5YGe04k_vRigP6rAlrha7abE52qj/preview', videoHref: 'https://drive.google.com/file/d/1kqdr_vtEkrFxs6As_j6m59ywdEIfIIlD/preview' },
    { num: 16, title: 'Modèle ondulatoire de la lumière', pdfHref: 'https://drive.google.com/file/d/1YR515rD2Q_5DmOCrLhW5tfQePi9LoY93/preview', videoHref: '#' },
    { num: 17, title: 'Modèle corpusculaire Lumière', pdfHref: '#', videoHref: 'https://drive.google.com/file/d/1FQLrRhy3zjAwKcon_Dx434E7fFP9MrOO/preview' },
    { num: 18, title: 'Réactions nucléaires spontanées', pdfHref: 'https://drive.google.com/file/d/1cs0KrHZ2Ryu3rsNT9KmvYVRuGEwDb9Q5/preview', videoHref: 'https://drive.google.com/file/d/1q4DUNHoSY8izbST8zJTRoaG_MYya4vHh/preview' },
    { num: 19, title: 'RÉACTIONS NUCLÉAIRES PROVOQUÉES', pdfHref: 'https://drive.google.com/file/d/1DJ-gh5TMM_OBnoC2ZG6bMqBYnNPX_okj/preview', videoHref: 'https://drive.google.com/file/d/1mcjAve9X4_9CCG4oObYyXzlrIhROpeC7/preview' },
];


export default function PhysiqueChimieTerminaleCPage() {
  const { userProfile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' | 'video' } | null>(null);
  const hasAccess = isAdmin || (userProfile && userProfile?.solde > 0 && userProfile?.className === 'terminale');

  const handleLockedContent = () => {
    if (!userProfile || hasAccess) return;
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
