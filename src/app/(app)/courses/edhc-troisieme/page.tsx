'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Video, FileText, Construction, Lock, Unlock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { trackCourseVisit, type CourseInfo } from '@/lib/course-visits';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import { ContentViewer } from '@/components/content-viewer';

const courseInfo: CourseInfo = {
  id: 'edhc-troisieme',
  name: 'EDHC Troisième',
  url: '/courses/edhc-troisieme',
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
    { num: 1, title: 'LES DEVOIRS DE PARENTS ET L’EPANOUISSEMENT DE L’ENFANT', pdfHref: 'https://drive.google.com/file/d/1t6mI3LNAZnrLFQF9yV1Z5JYCzcd01bX2/preview', videoHrefs: ['https://drive.google.com/file/d/118Obn5YLX-3LdeV0ngV3M0g7ZmAPqG-e/preview'] },
    { num: 2, title: 'LES ORGANISATIONS HUMANITAIRES ET L’ASSISTANCE AUX POPULATIONS EN DETRESSE', pdfHref: 'https://drive.google.com/file/d/1lbf2AklUFEiEj0oL5IjJlkyqav5om_-x/preview', videoHrefs: ['https://drive.google.com/file/d/1xreSekz2VkRk4ZP9M8tVFIOW5ebm_CMs/preview'] },
    { num: 3, title: 'LES INSTRUMENTS ET LES MECANISMES JURIDIQUES ET LA LUTTE CONTRE LES VIOLENCES', pdfHref: 'https://drive.google.com/file/d/1zG0qWdO1Rsg_ac6Jkra4myd30tBgUGs0/preview', videoHrefs: ['https://drive.google.com/file/d/1THgltIgSPKjpjwgo3qyfXWV-kS1BX24D/preview'] },
    { num: 4, title: 'LES PARTIS POLITIQUES ET LES INSTITUTIONS DE LA REPUBLIQUE', pdfHref: 'https://drive.google.com/file/d/1gRkZ4y_rIbpU-WuDbz5s8l9pWdWfsVBr/preview', videoHrefs: [] },
    { num: 5, title: 'LE VOTE ET LA PARTICIPATION DU CITOYEN A LA VIE DE LA NATION', pdfHref: 'https://drive.google.com/file/d/1SCCwB7P8YvzIIORwVud-f6j_VCb5aYMy/preview', videoHrefs: [] },
    { num: 6, title: 'L’IMPÔT ET LE DEVELOPPEMENT DE LA NATION', pdfHref: 'https://drive.google.com/file/d/1sJa6w1hcZ5mnyeuYUKjiVXGfDrPC285N/preview', videoHrefs: ['https://drive.google.com/file/d/1PYcdSFozqwuLf47qMGyODejAUZYeFJBN/preview'] },
    { num: 7, title: 'L’UTILISATION RATIONNELLE DES BIENS PUBLICS ET LE DEVELOPPEMENT DU PAYS', pdfHref: 'https://drive.google.com/file/d/1nXS3RoZlT0emv41-q6ZcXaKSK_VdcZuK/preview', videoHrefs: ['https://drive.google.com/file/d/1L1uSqssC-0zy37YH6aN4GCXa882iQYMF/preview'] },
    { num: 8, title: 'LE PROJET D’ENTREPRISE ET L’INSERTION SOCIALE', pdfHref: 'https://drive.google.com/file/d/19NOmZa4u9XdvoIbduBeRGoBg-6r-YsNF/preview', videoHrefs: ['https://drive.google.com/file/d/1PTrXt1xjsA8TUJF6H5PoVt1TxycaahL0/preview'] },
    { num: 9, title: 'LEÇON 9', pdfHref: '#', videoHrefs: ['https://drive.google.com/file/d/1kXzpugCuFHV8qZeHVyUXllyktENMBSZF/preview'] },
    { num: 13, title: 'GESTION RATIONNELLE DE L\'EAU ET SAUVEGARDE DE LA PAIX SOCIALE', pdfHref: '#', videoHrefs: ['https://drive.google.com/file/d/1SChaiFg08EQ3JlPLN-bqZKt6p1xlzqR6/preview'] },
];

export default function EdhcTroisiemePage() {
    const { userProfile, isAdmin } = useAuth();
    const { toast } = useToast();
    const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' | 'video' } | null>(null);
    const hasAccess = isAdmin || (userProfile && userProfile.solde > 0 && userProfile.className === 'troisieme');

    const handleLockedContent = () => {
        if (!userProfile) return;
        if (userProfile.solde <= 0) {
            toast({
                title: 'Contenu Verrouillé',
                description: "Votre solde est épuisé. Veuillez recharger votre compte pour accéder à ce cours.",
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
          EDHC (Éducation aux Droits de l'Homme et à la Citoyenneté)
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
              <Button variant="outline" disabled={!hasAccess || lesson.pdfHref === '#'} onClick={() => hasAccess ? openViewer(lesson.pdfHref, 'pdf') : handleLockedContent()}>
                <FileText className="mr-2 h-4 w-4" />
                Cours PDF
              </Button>
              {lesson.videoHrefs.map((videoHref, index) => (
                 <Button key={index} variant="outline" disabled={!hasAccess || videoHref === '#'} onClick={() => hasAccess ? openViewer(videoHref, 'video') : handleLockedContent()}>
                    <Video className="mr-2 h-4 w-4" />
                    Cours Vidéo {lesson.videoHrefs.length > 1 ? index + 1 : ''}
                </Button>
              ))}
              {lesson.videoHrefs.length === 0 && (
                 <Button variant="outline" disabled>
                    <Video className="mr-2 h-4 w-4" />
                    Cours Vidéo (Bientôt)
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
