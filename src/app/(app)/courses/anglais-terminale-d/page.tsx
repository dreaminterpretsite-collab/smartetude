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
  id: 'anglais-terminale-d',
  name: 'Anglais Terminale D',
  url: '/courses/anglais-terminale-d',
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
    title: 'UNIT 1: Lifestyle',
    lessons: [
      { title: 'Writing', videoHref: 'https://drive.google.com/file/d/1ffcHV9ozNpvyRSNuk45wMDly15MsO6PU/preview', pdfHref: '#' },
      { title: 'Reading', videoHref: 'https://drive.google.com/file/d/1bRs1iFvY1nlVUSmOj1P6epOymrUpx0bb/preview', pdfHref: 'https://drive.google.com/file/d/16OYfjVNniGEcrPVBCzxjxyDWc8zWkVjm/preview' },
    ],
  },
  {
    title: 'UNIT 2: Freedom and Rights',
    lessons: [
      { title: 'Writing', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1AinIx5JRFr1ZkxPeo14TEX8LooyZFDyE/preview' },
      { title: 'Reading', videoHref: 'https://drive.google.com/file/d/1iGemAYUp_z620bcUkQ-boYTIIKHHrjMB/preview', pdfHref: 'https://drive.google.com/file/d/1oV0vSZSBCmnKeKbHNTYRowbYN7ioQJ4d/preview' },
      { title: 'Listening', videoHref: 'https://drive.google.com/file/d/1XKzsIFyamVcqzo47-Eg-6wZDxnUgm7oB/preview', pdfHref: '#' },
    ],
  },
  {
    title: 'UNIT 3: Development issues',
    lessons: [
      { title: 'Listening', videoHref: 'https://drive.google.com/file/d/1rrx0l6EFipdP0c8gzSxt2qu9b1qxli6a/preview', pdfHref: 'https://drive.google.com/file/d/18rXr-PQUHrdvmYJ0Myq83tF18bDGAldO/preview' },
      { title: 'Reading', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1gT9gXtjgntRf09rVsTpMei5Z_CeuqakY/preview' },
      { title: 'Writing', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1_jqz3Koz3e_gCqNT5g8uqzi0fukbX3DZ/preview' },
    ],
  },
  {
    title: 'UNIT 4: What the future holds',
    lessons: [
      { title: 'Reading', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1-IFSIl5mT195UeugCYWfBEUVWQ6nRQYE/preview' },
      { title: 'Writing', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1ci9fYImYU_USisR8slP733-FYLTCG_SV/preview' },
    ],
  },
  {
    title: 'UNIT 5: Managing resources',
    lessons: [
        { title: 'Reading', videoHref: 'https://drive.google.com/file/d/1CQsQ8qbgJWWAG4MMusZpn5AApWlG6Rbn/preview', pdfHref: 'https://drive.google.com/file/d/1YJo-Z4XP15g1p39Fgk9-GtTOwfN9oA4d/preview' },
        { title: 'Writing', videoHref: '#', pdfHref: 'https://drive.google.com/file/d/1kWo0KT8PIYKRC05UGDCbMqL9gA1Iyzmb/preview' },
    ],
  },
  {
    title: 'UNIT 6: Contemporary Africa',
    lessons: [
        { title: 'Speaking', videoHref: 'https://drive.google.com/file/d/12NBKa1n_mNZSrWP4ZwhmV0n-aVW_3YHV/preview', pdfHref: 'https://drive.google.com/file/d/1iTCVPTlCI1kCO1y8JpHJTrxzE2zCEozN/preview' },
        { title: 'Listening', videoHref: '#', pdfHref: '#' },
        { title: 'Writing', videoHref: 'https://drive.google.com/file/d/1srfEGGHPbY80TlC4qgPXTPznXKLbD4YH/preview', pdfHref: '#' },
        { title: 'Reading', videoHref: '#', pdfHref: '#' },
    ],
  },
  {
    title: 'UNIT 7: Bribery and corruption',
    lessons: [
        { title: 'Reading', videoHref: 'https://drive.google.com/file/d/1AHew15GAn8noJaoForFDMZY2WKnQAylG/preview', pdfHref: 'https://drive.google.com/file/d/1p3safdrim0fMPuKtbGqTrAVBfiOyuqVr/preview' },
    ],
  },
    {
    title: 'UNIT 8: Accross Cultures',
    lessons: [
        { title: 'Reading', videoHref: 'https://drive.google.com/file/d/1LrZaIoiPPqJyWlINaC_9qBOSDtX8jVO_/preview', pdfHref: 'https://drive.google.com/file/d/1T4upaZWfM72GqJYnTPNTDeOVoOtGSvKE/preview' },
        { title: 'Speaking', videoHref: '#', pdfHref: '#' },
    ],
  },
];

export default function AnglaisTerminaleDPage() {
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
        <p className="text-sm font-medium text-primary">Terminale D</p>
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
