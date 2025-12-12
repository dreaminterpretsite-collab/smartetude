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
import { useFirebase } from '@/firebase/client-provider';

const courseInfo: CourseInfo = {
  id: 'anglais-premiere-a',
  name: 'Anglais Première A',
  url: '/courses/anglais-premiere-a',
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
    title: 'UNIT 1: Travel and World Tourism',
    lessons: [
      { title: 'Reading', pdfHref: 'https://drive.google.com/file/d/1g6B-KXpOXuK5W69dKgPeuSJsSIs9Jtkl/preview', videoHref: '#' },
      { title: 'Speaking', pdfHref: 'https://drive.google.com/file/d/14opuKlnwBjkOQIgf-jzNdgBKNkE1xm-3/preview', videoHref: '#' },
    ],
  },
  {
    title: 'UNIT 2: Natural resources',
    lessons: [
      { title: 'Listening', pdfHref: 'https://drive.google.com/file/d/1PNvLf1HNsya5jZK-zbqEc2bo9LONeYG1/preview', videoHref: '#' },
      { title: 'Reading', pdfHref: 'https://drive.google.com/file/d/1UCYo7iYmy4mUIBeOcqUtghRQv5_K0WHW/preview', videoHref: '#' },
    ],
  },
  {
    title: 'UNIT 3: Deadly Viruses and Diseases',
    lessons: [
      { title: 'Writing', pdfHref: 'https://drive.google.com/file/d/1cUFFUKZDRcdVSYFrbunv-e3wJlzAYDow/preview', videoHref: '#' },
      { title: 'Speaking', pdfHref: 'https://drive.google.com/file/d/1HJ3cutoXLKfA97NKrfj4Ly2uc2rW5MQu/preview', videoHref: '#' },
    ],
  },
  {
    title: 'UNIT 4: Crime and Violence',
    lessons: [
      { title: 'Reading', pdfHref: 'https://drive.google.com/file/d/1iGLcEg6P7LEf5pT0kuy_Xg-kHR0IRybC/preview', videoHref: '#' },
      { title: 'Speaking', pdfHref: 'https://drive.google.com/file/d/159EbOVnIBJItjMXdh1fM7nkm1FiP6Nr2/preview', videoHref: '#' },
    ],
  },
  {
    title: 'UNIT 5: Human Rights',
    lessons: [
        { title: 'Writing', pdfHref: 'https://drive.google.com/file/d/1idAddEdD-_Q3-qslFz6LD6yAxsTPNeEY/preview', videoHref: '#' },
        { title: 'Speaking', pdfHref: '#', videoHref: '#' },
    ],
  },
  {
    title: 'UNIT 6: Technology and our lives',
    lessons: [
        { title: 'Reading', pdfHref: 'https://drive.google.com/file/d/1h774Vs4nmPF_CRsZnifA3hiYMbC7vHSI/preview', videoHref: '#' },
        { title: 'Writing', pdfHref: 'https://drive.google.com/file/d/1f9kfqNb2ZPfq_NmsjKFSVxHAOSgUHAyc/preview', videoHref: '#' },
    ],
  },
  {
    title: 'UNIT 7: Political change',
    lessons: [
        { title: 'Reading', pdfHref: 'https://drive.google.com/file/d/10OsL-dyjqxzmjv-Zpd-Bv2-roa684RhE/preview', videoHref: '#' },
        { title: 'Speaking', pdfHref: 'https://drive.google.com/file/d/1e5kQ8UNwZdNJzqXDUTe15MzotfIhmLUV/preview', videoHref: '#' },
    ],
  },
    {
    title: 'UNIT 8: African Cultural Heritage',
    lessons: [
        { title: 'Listening', pdfHref: 'https://drive.google.com/file/d/1cRpocesBUXn7ofSgEBB-egSUQ4ISW9au/preview', videoHref: '#' },
        { title: 'Reading', pdfHref: 'https://drive.google.com/file/d/1-2tU-bwCQPG79RDn2qocTrleGoD9CiYn/preview', videoHref: '#' },
    ],
  },
];

export default function AnglaisPremiereAPage() {
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
          Anglais
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
                    {unit.lessons.map((lesson, lessonIndex) => (
                    <Card key={`${unitIndex}-${lessonIndex}`}>
                        <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            {hasAccess ? (
                              <Unlock className="h-5 w-5 text-green-500" />
                            ) : (
                              <Lock className="h-5 w-5 text-red-500" />
                            )}
                            <span className="font-bold text-accent">{lesson.title}</span>
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
