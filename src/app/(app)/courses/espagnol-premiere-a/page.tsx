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
  id: 'espagnol-premiere-a',
  name: 'Espagnol Première A',
  url: '/courses/espagnol-premiere-a',
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
    { num: 1, title: "Connaître les réalités de l'espagnol dans le monde", pdfHref: 'https://drive.google.com/file/d/1NFEOPaOlw3URe9drDXnHL3AegUEZo2Mz/preview', videoHref: '#' },
    { num: 2, title: "Connaître les réalités de l'Amérique hispanique", pdfHref: 'https://drive.google.com/file/d/1CZGcSQUrPdqwflBpAc7-pUFWMJctsMx0/preview', videoHref: '#' },
    { num: 3, title: "Connaître les réalités de la Guinée Equatoriale", pdfHref: 'https://drive.google.com/file/d/1q56kaF_4SH6UpvmfG6bBo8W4FGlAvo4Q/preview', videoHref: '#' },
    { num: 4, title: 'Décrire', pdfHref: 'https://drive.google.com/file/d/1lrl7VSmewTr6cJ33-Zc-RU1H4FNFDkoY/preview', videoHref: '#' },
    { num: 5, title: 'Raconter un fait', pdfHref: 'https://drive.google.com/file/d/1USdx9LZJKbMLi6DIV1W4zOf2uBTgCk19/preview', videoHref: '#' },
    { num: 6, title: 'Insister', pdfHref: 'https://drive.google.com/file/d/1_wEkyEfi_4B4ZrxRQqTz1tFHCPVMeaaa/preview', videoHref: '#' },
    { num: 7, title: 'Résumer', pdfHref: 'https://drive.google.com/file/d/1TkAeJ60cHv5d5Qd4odzc-dzOGUqVGHlv/preview', videoHref: '#' },
    { num: 8, title: 'Poser des questions', pdfHref: 'https://drive.google.com/file/d/1FrNFVJ7uoQZhlBtNkkhk_q0iGGadGAn8/preview', videoHref: '#' },
    { num: 9, title: 'Donner une opinion', pdfHref: 'https://drive.google.com/file/d/1rqUwnvpmSJ5dRib4x2T6XypIEy6HgLaT/preview', videoHref: '#' },
    { num: 10, title: 'Approuver-Désapprouver', pdfHref: 'https://drive.google.com/file/d/1R1fGSAZLknx8wQeGB18mXm23Jff7b4Bh/preview', videoHref: '#' },
    { num: 11, title: 'Exprimer la certitude', pdfHref: 'https://drive.google.com/file/d/1SN7Zs73kImy4i2f9mre868iMKgxBz4Lj/preview', videoHref: '#' },
    { num: 12, title: 'Exprimer la capacité', pdfHref: 'https://drive.google.com/file/d/1_juLzAy12pOYlr7STmqkr-1I_EkUxQL9/preview', videoHref: '#' },
    { num: 13, title: 'Exprimer la probabilité', pdfHref: 'https://drive.google.com/file/d/14q_d30NKlisGVVLjTKcfXaBZfL1IBgXx/preview', videoHref: '#' },
    { num: 14, title: "Exprimer l'indignation", pdfHref: 'https://drive.google.com/file/d/1ZdkDfQn8zvaf3QrAa8xeQSks7poLE11P/preview', videoHref: '#' },
    { num: 15, title: 'Exprimer la peur', pdfHref: 'https://drive.google.com/file/d/1evch54Eg5cvloTMa-_P3KH39Nd_xqe0g/preview', videoHref: '#' },
    { num: 16, title: 'Faire des éloges', pdfHref: 'https://drive.google.com/file/d/1q_YzYCBM7R_iB2Qnd51IUCkXSTgt8z-Z/preview', videoHref: '#' },
    { num: 17, title: "Exprimer l'intention", pdfHref: 'https://drive.google.com/file/d/1akoViHoP8Jfc0oOaqrF8df9SKMgBwzPf/preview', videoHref: '#' },
    { num: 18, title: "Exprimer l'espoir", pdfHref: 'https://drive.google.com/file/d/184b334qvngJYf5liTKHQNcDsKiEk62W0/preview', videoHref: '#' },
    { num: 19, title: 'Donner une consigne', pdfHref: 'https://drive.google.com/file/d/1TpCt7dxjQCDvOLXxT15LOg9v4bdZNONL/preview', videoHref: '#' },
    { num: 20, title: "Exprimer une intention", pdfHref: 'https://drive.google.com/file/d/1sLBBF162CqQq_KJhJEIeHoGEPCLE_h1j/preview', videoHref: '#' },
    { num: 21, title: "Conseiller quelqu'un", pdfHref: 'https://drive.google.com/file/d/17JrfKdoOxu_PutxxJe_t8IqwnmnvLrH4/preview', videoHref: '#' },
    { num: 22, title: 'Donner un ordre', pdfHref: 'https://drive.google.com/file/d/1b_n1vnv4CsfHuRtOhgt78RMjBV0KWAgi/preview', videoHref: '#' },
    { num: 23, title: 'Convaincre', pdfHref: 'https://drive.google.com/file/d/1Sg2TiyZjuvu0dWX7Vqmkw_wR6mHwEufM/preview', videoHref: '#' },
    { num: 24, title: 'Commenter une image ou un texte', pdfHref: 'https://drive.google.com/file/d/1hQPKNiFFUOREyPe45j04xo0TvHIdvLu7/preview', videoHref: '#' },
    { num: 25, title: 'Décrire une image', pdfHref: 'https://drive.google.com/file/d/1aVMG8HI01ixbVFUPcQTpwiUZUPvgC1Gm/preview', videoHref: '#' },
    { num: 26, title: 'Rédiger un dialogue', pdfHref: 'https://drive.google.com/file/d/1LR3dgeRfPn-veE4ZJ60MyS3ZJML37VWW/preview', videoHref: '#' },
    { num: 27, title: 'Produire un récit', pdfHref: 'https://drive.google.com/file/d/1nFydom52hJeYXVPThQpMEL-BX--Ovt83/preview', videoHref: '#' },
    { num: 28, title: 'Argumenter', pdfHref: 'https://drive.google.com/file/d/16eEK2TyJHra6a0fkhB6TgfUau0eNdJk6/preview', videoHref: '#' },
];

export default function EspagnolPremiereAPage() {
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
        <p className="text-sm font-medium text-primary">Première A</p>
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
