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
  id: 'francais-troisieme',
  name: 'Français Troisième',
  url: '/courses/francais-troisieme',
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

const categories = [
    {
        name: 'Expression Orale',
        lessons: [{ title: 'Expression Orale', videoHref: '#', pdfHref: '#' }]
    },
    {
        name: 'Expression Écrite',
        lessons: [
            { title: "Le résumé du texte argumentatif", videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1IHdaAq5HTip6PEWUjtuY4XIf4vU6D0Qc/preview' },
            { title: "Le texte argumentatif - Rédiger pour étayer un point de vue", videoHref: '#', pdfHref: '#' }
        ]
    },
    {
        name: 'Grammaire',
        lessons: [
            { title: "L'expression de la cause (phrase simple et complexe)", videoHref: 'https://drive.google.com/file/d/1akblCWqdfVbWN7iP7NQAaXNTcFh43XhR/preview', pdfHref: 'https://drive.google.com/file/d/1YIv7EJf9f2ZPwMdWfCE16jHVKqC2-ZQb/preview' },
            { title: "L'expression de la conséquence (phrase simple et complexe)", videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1VoTBaU2HwXgmeFUxvufB7tp1RtRP6lP6/preview' },
            { title: "L'expression du but (phrase simple et complexe)", videoHref: '#', pdfHref: 'https://drive.google.com/file/d/19ZdOKPa1Dp4k2hanw7ykKjPcFg7UHY3-/preview' },
            { title: "L'expression du temps (phrase simple et complexe)", videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1anmNGxNxjPj4rDcqwwqOpad--hwwPjdY/preview' },
            { title: "L'expression de la comparaison (phrase complexe)", videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1vXL6Q83ggTqV58vcqsEpATQULn-2UGZg/preview' },
            { title: "L'expression de l'opposition et de la concession (phrase complexe)", videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1MM7oQp36lurLaXtaaWDipafS9DJ3Ci0O/preview' },
            { title: "L'adverbe et le groupe adverbial", videoHref: 'https://drive.google.com/file/d/17ZXaKNzU6VesRl6vlQKNN9x93qHAICM8/preview', pdfHref: 'https://drive.google.com/file/d/18QIrFGWWONwmx-RStLS6QQnmSi1LlE0J/preview' },
            { title: "Le comparatif et superlatif de l'adverbe", videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1kSRLJjsDaKzgIAu2JnqMtCZYQyOt3Um2/preview' },
            { title: "La communication", videoHref: 'https://drive.google.com/file/d/1QJtpEEvEXXkL8l0XgXcmKLV-WsugckOl/preview', pdfHref: 'https://drive.google.com/file/d/1zNAlZ1W8RtbyvxZ06NegkyxQ88OqLRqU/preview' },
            { title: "Les registres de langue", videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1JV8Zms9pDO2P07HgL1sKithmaMEOYeoF/preview' },
        ]
    },
    {
        name: 'Orthographe',
        lessons: [
            { title: "L'accord des participes passés employés avec 'avoir' et précédé de 'en'", videoHref: '#', pdfHref: '#' }
        ]
    },
    {
        name: 'Lecture',
        lessons: [
            { title: "Étude d'œuvre - La conclusion", videoHref: '#', pdfHref: '#' },
        ]
    }
];

export default function FrancaisTroisiemePage() {
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
          Français
        </h1>
        <p className="text-muted-foreground">
          Liste des leçons disponibles pour cette matière.
        </p>
      </div>

      <div className="space-y-8">
        {categories.map((category, catIndex) => (
            <div key={category.name}>
                <h2 className="font-headline text-2xl font-bold mb-4">{category.name}</h2>
                <div className="grid gap-6 md:grid-cols-2">
                    {category.lessons.map((lesson, index) => (
                    <Card key={`${catIndex}-${index}`}>
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
                {catIndex < categories.length - 1 && <Separator className="my-8" />}
            </div>
        ))}
      </div>
    </div>
  );
}
