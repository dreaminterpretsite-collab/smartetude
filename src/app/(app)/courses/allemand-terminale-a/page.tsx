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
  id: 'allemand-terminale-a',
  name: 'Allemand Terminale A',
  url: '/courses/allemand-terminale-a',
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

const units = [
  {
    title: 'MITMACHEN',
    lessons: [
      { num: 1, title: 'FICHE 1', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1b-sNaBmy5nTFYsWycF4op87_UEx6C2qa/preview' },
      { num: 2, title: 'FICHE 2', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/10zjtApcjI1SzfKz43TgjX1Rl4FLjhFwG/preview' },
      { num: 3, title: 'FICHE 3', videoHref: 'https://drive.google.com/file/d/1fn4IYmGhY82h3F2j4JH9UUQPqBAwqFzO/preview', pdfHref: 'https://drive.google.com/file/d/1a-9K8IAGj2WHsSUq3CTqg-NrxXy9Q8vU/preview' },
    ],
  },
  {
    title: 'KEIN PROBLEM ?',
    lessons: [
      { num: 4, title: 'FICHE 1', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1wrx6rBZ4z04jeYt-L-UwhEZBfuAd0UbX/preview' },
      { num: 5, title: 'FICHE 2', videoHref: 'https://drive.google.com/file/d/1-ewTp_m9xhS6glRGM0RSRDD1ewOLRa3t/preview', pdfHref: 'https://drive.google.com/file/d/1ryLLpA9xDr4DP5NxJrVR-zcYQcGV8Hm3/preview' },
      { num: 6, title: 'FICHE 3', videoHref: 'https://drive.google.com/file/d/1BmCXW7XOkM0tv2k7_Qqbffmj6yaxJGfo/preview', pdfHref: 'https://drive.google.com/file/d/1ny3-zABdQ4ntsDi6TTQkJccG4FPvLOb-/preview' },
    ],
  },
  {
    title: 'ALLES ILLUSION ?',
    lessons: [
      { num: 7, title: 'FICHE 1', videoHref: 'https://drive.google.com/file/d/1bRzL35HfCbAb_UP4NeTCH5OfZMbU0Z2T/preview', pdfHref: 'https://drive.google.com/file/d/1A-wr-QwVNTm6petU9Un7HfgjCIWrCOAY/preview' },
      { num: 8, title: 'FICHE 2', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1XGL8ixjEq2JhuwPhEHSY2OzLDfdDnyjH/preview' },
    ],
  },
];

export default function AllemandTerminaleAPage() {
  const { userProfile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' | 'video' } | null>(null);
  const hasAccess = isAdmin || (userProfile && userProfile?.solde > 0 && userProfile?.className === 'terminale');

  const handleLockedContent = () => {
    if (!userProfile) return;
    if (userProfile.solde <= 0) {
        toast({
            title: 'Contenu Verrouillé',
            description: "Votre solde est épuisé. Veuillez recharger votre compte pour accéder à ce cours.",
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
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setViewerContent(null);
          }
        }} 
      />
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Terminale A</p>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Allemand
        </h1>
        <p className="text-muted-foreground">
          Liste des leçons disponibles pour cette matière.
        </p>
      </div>

      <div className="space-y-8">
        {units.map((unit, unitIndex) => (
            <div key={unit.title}>
                <h2 className="font-headline text-2xl font-bold mb-4">{unit.title}</h2>
                <div className="grid gap-6 md:grid-cols-2">
                    {unit.lessons.map((lesson) => (
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
            {unitIndex < units.length - 1 && <Separator className="my-8" />}
        </div>
        ))}
      </div>
    </div>
  );
}
