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
  id: 'espagnol-terminale-a',
  name: 'Espagnol Terminale A',
  url: '/courses/espagnol-terminale-a',
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
  { num: 1, title: 'Connaître les réalités socio linguistiques de l’Espagne', pdfHref: 'https://drive.google.com/file/d/1OBGmkXBs5tXpNOM-LzvHB4I_oqpnCWOl/preview', videoHref: '#' },
  { num: 2, title: 'Connaître les réalités politiques, sociales et historiques de l’Espagne', pdfHref: 'https://drive.google.com/file/d/1U4ugO62Ka9EPw7Dgc_o_j_bLGJjXzjT9/preview', videoHref: '#' },
  { num: 3, title: 'Connaître les réalités sociales et historiques de l’Amérique hispanique', pdfHref: 'https://drive.google.com/file/d/1SbQ49bl_0cDf_D4OsKKzWnCv43oab8xx/preview', videoHref: '#' },
  { num: 4, title: 'Connaître les réalités économiques et sociales de l’Amérique hispanique', pdfHref: 'https://drive.google.com/file/d/1TItFbod-9A2yAm8vlhhMbyHe5jlJc_4I/preview', videoHref: '#' },
  { num: 5, title: 'Connaître les réalités historiques, politiques, économiques et sociolinguistiques de Guinée Equatoriale', pdfHref: 'https://drive.google.com/file/d/1sz1uGcRHgIeRaG_aXIcmh99FqOYPZvmX/preview', videoHref: '#' },
  { num: 6, title: 'Poser des questions', pdfHref: 'https://drive.google.com/file/d/1AvMdi_AVWUrWMzFGYOb4P-IlGXRhyibA/preview', videoHref: '#' },
  { num: 7, title: 'Décrire', pdfHref: 'https://drive.google.com/file/d/1aZZ8Q5DQ-d8VTTGjfJzGEiGG8XPPXqfK/preview', videoHref: '#' },
  { num: 8, title: 'Raconter un fait', pdfHref: 'https://drive.google.com/file/d/1b-W4z48YvQPpIh4W0UGKht8cOZt6QKUM/preview', videoHref: '#' },
  { num: 9, title: 'Résumer', pdfHref: 'https://drive.google.com/file/d/1DUksnifrKdN1uueD3lei36cgt9zGs2Oc/preview', videoHref: '#' },
  { num: 10, title: 'Rappeler une information', pdfHref: 'https://drive.google.com/file/d/1ND7yI9zsyY4R_PWrqwvQvEBqezxDshsO/preview', videoHref: '#' },
  { num: 11, title: 'Exprimer une opinion', pdfHref: 'https://drive.google.com/file/d/1ND7yI9zsyY4R_PWrqwvQvEBqezxDshsO/preview', videoHref: '#' },
  { num: 12, title: 'Exprimer la capacité - l\'incapacité', pdfHref: 'https://drive.google.com/file/d/1ND7yI9zsyY4R_PWrqwvQvEBqezxDshsO/preview', videoHref: '#' },
  { num: 13, title: 'Exprimer l\'approbation', pdfHref: 'https://drive.google.com/file/d/1s-Th0Vz9JfQpy9ZcuLVmrFBtXZKhNIte/preview', videoHref: '#' },
  { num: 14, title: 'Exprimer la désapprobation', pdfHref: 'https://drive.google.com/file/d/14wWciqlt-kbvho9P3Zod4-2IYQSoiyw5/preview', videoHref: '#' },
  { num: 15, title: 'Convaincre', pdfHref: 'https://drive.google.com/file/d/1np2GOcG_Bv1_l2B52I0TQoRtnOu7ZV0f/preview', videoHref: '#' },
  { num: 16, title: 'Exprimer l’indignation', pdfHref: 'https://drive.google.com/file/d/1JdFaRkNhEPiYqz9ZJRC7Oba9Ic49nwlo/preview', videoHref: '#' },
  { num: 17, title: 'Exprimer la gratitude/ Exprimer le vœu. (Expression et interaction écrites)', pdfHref: 'https://drive.google.com/file/d/1lvKLsPkqsTKpZtVidtFmZkOvPCWvlW3h/preview', videoHref: '#' },
  { num: 18, title: 'Exprimer la joie', pdfHref: '#', videoHref: '#' },
  { num: 19, title: 'Exprimer la peine', pdfHref: 'https://drive.google.com/file/d/1TWW9MkTUtbo44qo19JU3Sz1bSQ5A7au_/preview', videoHref: '#' },
  { num: 20, title: 'Exprimer l\'espoir', pdfHref: 'https://drive.google.com/file/d/1mOsWdVT8nElWwsEVlkcrpcvaQzFWJuHn/preview', videoHref: '#' },
  { num: 21, title: 'Donner des consignes', pdfHref: 'https://drive.google.com/file/d/1h11dhEMHV1KeeJbyRrt-av1nxE6geZti/preview', videoHref: '#' },
  { num: 22, title: 'Donner des conseils', pdfHref: '#', videoHref: '#' },
  { num: 23, title: 'Faire des suggestions', pdfHref: 'https://drive.google.com/file/d/1RmgpjHASB98DIsDhH0LUEySY60dy_VFE/preview', videoHref: '#' },
  { num: 24, title: 'Faire une demande', pdfHref: 'https://drive.google.com/file/d/1xAA_bYwUyBfJ3INI7Ca4mOZUssMRr2X9/preview', videoHref: 'https://drive.google.com/file/d/13md_XBMfBMbqolEtio1Df3kQbFzei6Sm/preview' },
  { num: 25, title: 'Dissuader', pdfHref: 'https://drive.google.com/file/d/1HWxNEmgOtyquXgfgqyym7DlGmtFD4HCQ/preview', videoHref: 'https://drive.google.com/file/d/1z49I_fDJcH0-GPKMmITLPXXDuhYRLq56/preview' },
  { num: 26, title: 'Réaliser une conversation', pdfHref: 'https://drive.google.com/file/d/1qB9A0H1RJgNR6LtewsVwKLsh3U5QhL7F/preview', videoHref: 'https://drive.google.com/file/d/1U8a_8kCLIIcr1whMy-Kwi2sx0mw89-mw/preview' },
  { num: 27, title: 'Réaliser une interview', pdfHref: 'https://drive.google.com/file/d/1p3DnmUi0kfMgVKQyxsSPqMoXnn4q2CQG/preview', videoHref: '#' },
  { num: 28, title: 'Faire un exposé', pdfHref: 'https://drive.google.com/file/d/16GJYpP1EClh85G8RTYdo2eQM3uhpWaT0/preview', videoHref: '#' },
  { num: 29, title: 'Présenter un thème', pdfHref: 'https://drive.google.com/file/d/1Ca-Q0oqnK6beOk2RSDIuWBiyBk_T85iy/preview', videoHref: '#' },
  { num: 30, title: 'Commenter une image', pdfHref: 'https://drive.google.com/file/d/19OvieInxLsOvjNrSXmF5hYJd-0pK5-vm/preview', videoHref: '#' },
];

export default function EspagnolTerminaleAPage() {
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
        onOpenChange={(isOpen) => !isOpen && setViewerContent(null)}
      />
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Terminale A</p>
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

    