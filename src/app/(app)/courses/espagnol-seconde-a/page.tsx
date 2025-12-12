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
  id: 'espagnol-seconde-a',
  name: 'Espagnol Seconde A',
  url: '/courses/espagnol-seconde-a',
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
  { num: 1, title: "Connaitre les réalités de l'Espagne", pdfHref: 'https://drive.google.com/file/d/1Gx2x45-_NbbKNLLHstlZ4gmBX3mkeuoc/preview', videoHref: '#' },
  { num: 2, title: "Connaitre les réalités de l'Amérique hispa", pdfHref: 'https://drive.google.com/file/d/1Q4_35NG6Z99QehXu0o9Cmd99mN8dY-oh/preview', videoHref: '#' },
  { num: 3, title: "Connaitre les réalité de Guinée Ecuato", pdfHref: 'https://drive.google.com/file/d/1qi3FmzqU84sd7jBrfRQYX1kVToOzt7rt/preview', videoHref: '#' },
  { num: 4, title: 'Exprimer la gratitude', pdfHref: 'https://drive.google.com/file/d/16-QLf0m3XhKQ4Y9zII6FdTkVWZOF8eS-/preview', videoHref: '#' },
  { num: 5, title: "Inviter quelqu'un", pdfHref: 'https://drive.google.com/file/d/15UYZEzJa6Z9T_esomZyU2BbbX-f7HF1T/preview', videoHref: '#' },
  { num: 6, title: "Demander de l'aide ou secours", pdfHref: 'https://drive.google.com/file/d/1o-Suh4pG4OoMPXoaccdlWk62njCEWTXV/preview', videoHref: '#' },
  { num: 7, title: "Expression de l'interpellation", pdfHref: 'https://drive.google.com/file/d/1G6niaUODhQfcqEAHzcSCYWizpPpjelHI/preview', videoHref: '#' },
  { num: 8, title: 'Poser des questions', pdfHref: 'https://drive.google.com/file/d/18W7owcxdqC-CMc525VcXYnk0s07nw24G/preview', videoHref: '#' },
  { num: 9, title: 'Décrire', pdfHref: 'https://drive.google.com/file/d/1O7mmxokax72xG3r6wHnkeegj-MEzetF8/preview', videoHref: '#' },
  { num: 10, title: 'Résumer', pdfHref: 'https://drive.google.com/file/d/1_X01vmogAoTwlWu4y0lRjh5GyPo_SwSD/preview', videoHref: '#' },
  { num: 11, title: "Orienter - s'orienter", pdfHref: 'https://drive.google.com/file/d/1XAX81ezJ7k28JVWa9A003Bvp8OS7pLyb/preview', videoHref: '#' },
  { num: 12, title: 'Raconter un fait', pdfHref: 'https://drive.google.com/file/d/1eaoJT8sTFbE6IA13xxAmkbVqDJNAw190/preview', videoHref: '#' },
  { num: 13, title: 'Donner une opinion', pdfHref: 'https://drive.google.com/file/d/1lUtcIfQTAF2FG-pguhOW_rxVuYOlySN-/preview', videoHref: '#' },
  { num: 14, title: 'Approuver - Désapprouver', pdfHref: 'https://drive.google.com/file/d/1ZXaEs5MsV3oIxwcnirKCA_RcvTJAYTQO/preview', videoHref: '#' },
  { num: 15, title: 'Demander ou donner une opinion', pdfHref: '#', videoHref: '#' },
  { num: 16, title: 'Exprimer la certitude', pdfHref: 'https://drive.google.com/file/d/161oVI-ff2f9v928Ou5udzg2wzPs6S5ns/preview', videoHref: '#' },
  { num: 17, title: 'Exprimer le doute', pdfHref: 'https://drive.google.com/file/d/1ulPY614YfkrenyFXXKeXW3NHBLuYouWp/preview', videoHref: '#' },
  { num: 18, title: "Exprimer l'inquiétude", pdfHref: 'https://drive.google.com/file/d/10lvQ_zdYV1olxTwZAJhukYX1tcfDpajp/preview', videoHref: '#' },
  { num: 19, title: 'Exprimer la peine', pdfHref: 'https://drive.google.com/file/d/1K_DRA18wJ7SkQ95KNvsezS_4g_jQ5mnJ/preview', videoHref: '#' },
  { num: 20, title: "Exprimer l'incrédulité ou la méfiance", pdfHref: 'https://drive.google.com/file/d/1OBdWdfvU23eBDdI2XA_gQ7Tr1AxZl3xP/preview', videoHref: '#' },
  { num: 21, title: "Exprimer l'admiration", pdfHref: 'https://drive.google.com/file/d/1FhtfYsDzxBPrph98N-h9-NyiLAhrPS2_/preview', videoHref: '#' },
  { num: 22, title: "Exprimer l'indignation", pdfHref: 'https://drive.google.com/file/d/1Ivt6ZXAsKO5icHEjJMhURc4Sti4-T5gI/preview', videoHref: '#' },
  { num: 23, title: 'Donner des instructions', pdfHref: 'https://drive.google.com/file/d/1ja2Z9U-arGDaWi1XRzCvDYx_f2IOYezE/preview', videoHref: '#' },
  { num: 24, title: 'Conseiller', pdfHref: 'https://drive.google.com/file/d/1GQGx3FCawxBywtn9ZssiNVGZUsPInxOd/preview', videoHref: '#' },
  { num: 25, title: 'Donner un ordre', pdfHref: 'https://drive.google.com/file/d/13M-IQifpIEDw7NsAvO5o4z1Br5Q2nG9C/preview', videoHref: '#' },
  { num: 26, title: 'Autoriser - permettre', pdfHref: '#', videoHref: '#' },
  { num: 27, title: 'Suggérer', pdfHref: '#', videoHref: '#' },
  { num: 28, title: 'Cours 28', pdfHref: '#', videoHref: '#' },
  { num: 29, title: 'Cours 29', pdfHref: '#', videoHref: '#' },
  { num: 30, title: 'Cours 30', pdfHref: '#', videoHref: '#' },
  { num: 31, title: "L'EXPRESSION ECRITE copie 6", pdfHref: '#', videoHref: '#' },
];

export default function EspagnolSecondeAPage() {
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
          Espagnol
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
                    LEÇON {lesson.num}:
                    </span>{' '}
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
  );
}
