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
  id: 'anglais-seconde-c',
  name: 'Anglais Seconde C',
  url: '/courses/anglais-seconde-c',
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
    title: 'UNIT 1: People',
    lessons: [
      { title: 'Listening', videoHref: '#', pdfHref: '#' },
      { title: 'Reading', videoHref: '#', pdfHref: '#' },
    ],
  },
  {
    title: 'UNIT 2: Health and Lifestyle',
    lessons: [
      { title: 'Reading', videoHref: '#', pdfHref: '#' },
      { title: 'Writing', videoHref: '#', pdfHref: '#' },
    ],
  },
  {
    title: 'UNIT 3: Technology',
    lessons: [
      { title: 'Reading', videoHref: '#', pdfHref: '#' },
      { title: 'Speaking', videoHref: '#', pdfHref: '#' },
    ],
  },
  {
    title: 'UNIT 4: Looking forward',
    lessons: [
      { title: 'Speaking', videoHref: '#', pdfHref: '#' },
      { title: 'Writing', videoHref: '#', pdfHref: '#' },
    ],
  },
  {
    title: 'UNIT 5: Gender and Education',
    lessons: [
        { title: 'Reading', videoHref: '#', pdfHref: '#' },
        { title: 'Listening', videoHref: '#', pdfHref: '#' },
    ],
  },
  {
    title: 'UNIT 6: Citizenship',
    lessons: [
        { title: 'Reading', videoHref: '#', pdfHref: '#' },
        { title: 'Writing', videoHref: '#', pdfHref: '#' },
    ],
  },
  {
    title: 'UNIT 7: Sports',
    lessons: [
        { title: 'Lesson 2_Reading', videoHref: '#', pdfHref: '#' },
        { title: 'Speaking', videoHref: '#', pdfHref: '#' },
    ],
  },
  {
    title: 'UNIT 8: Science',
    lessons: [
        { title: 'Listening', videoHref: '#', pdfHref: '#' },
    ],
  },
];

export default function AnglaisSecondeCPage() {
  const { userProfile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' | 'video' } | null>(null);
  const hasAccess = isAdmin || (userProfile && userProfile?.solde > 0 && userProfile?.className === 'seconde');

  const handleLockedContent = () => {
    if (!userProfile || hasAccess) return;
    if (userProfile.solde <= 0) {
      toast({
        title: 'Contenu Verrouillé',
        description:
          "Votre solde est épuisé. Veuillez recharger votre compte pour accéder à ce cours.",
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
        <p className="text-sm font-medium text-primary">Seconde C</p>
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
