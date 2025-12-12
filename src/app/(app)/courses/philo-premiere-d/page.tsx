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
  id: 'philo-premiere-d',
  name: 'Philosophie Première D',
  url: '/courses/philo-premiere-d',
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
    { num: 1, title: "La méthode de lecture de texte", pdfHref: 'https://drive.google.com/file/d/1wAUzZh8SU5jBGhFCHeOrN9f_IODiK4r7/preview' },
    { num: 2, title: "L'introduction du commentaire de texte philosophique", pdfHref: 'https://drive.google.com/file/d/1O6CXzbwcBbnQsW7ots5KaQFKbIjucwHn/preview' },
    { num: 3, title: "La conclusion du commentaire de texte philosophique", pdfHref: 'https://drive.google.com/file/d/1q1fIFZgQgPIFdK0N1zZUknRnS06wFykA/preview' },
    { num: 4, title: "L'essai de problématisation", pdfHref: 'https://drive.google.com/file/d/18S_4fIr2zu-dZ7LSjhg4lHa87TqBjrLu/preview' },
    { num: 5, title: "L'introduction de la dissertation philosophique", pdfHref: 'https://drive.google.com/file/d/1gbpWC02v3IG2ew56YYwXiHGrVryNumaM/preview' },
    { num: 6, title: "Présentation de l'histoire de la philosophie", pdfHref: 'https://drive.google.com/file/d/1N659GXxkJ5k_eapg46KQCf8SOjZhHbQP/preview' },
    { num: 7, title: "Le moyen-âge et la renaissance", pdfHref: 'https://drive.google.com/file/d/1r9LAFAjkiht_Op0nPB_5HsuOGlM_UmBN/preview' },
    { num: 8, title: "La période moderne", pdfHref: 'https://drive.google.com/file/d/1EPh6mZRpKKHHNKZKJ2o3dORVQ4xAt5oR/preview' },
    { num: 9, title: "La période comtemporaine", pdfHref: 'https://drive.google.com/file/d/11FggrhZEcpcOWQ6bZ1uG1JUyvEMYA9m-/preview' },
];

export default function PhiloPremiereDPage() {
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
        <p className="text-sm font-medium text-primary">Première D</p>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Philosophie
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
