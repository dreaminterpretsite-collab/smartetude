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
  id: 'histoire-geographie-terminale-c',
  name: 'Histoire-Géographie Terminale C',
  url: '/courses/histoire-geographie-terminale-c',
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

const geographyLessons = [
  { num: 'T1 L1', title: 'LES FONDEMENTS DU DEVELOPPEMENT ECONOMIQUE DE LA CÔTE D’IVOIRE', videoHref: 'https://drive.google.com/file/d/1Y1yde9F3-PgnhFC0Bd0NftqKj7BE_aFb/preview', pdfHref: '#' },
  { num: 'T1 L2', title: 'LES SECTEURS D’ACTIVITES ECONOMIQUES DE LA CÔTE D’IVOIRE', videoHref: 'https://drive.google.com/file/d/1IEnpfgaA9o0baWWjkwmvLAsJmbchA_ZM/preview', pdfHref: 'https://drive.google.com/file/d/1X3Qh9SbbTdyLK9V0bNtkVig7KddVcXWF/preview' },
  { num: 'T1 L3', title: 'LES PROBLEMES DE DEVELOPPEMENT ECONOMIQUE DE LA COTE D’IVOIRE', videoHref: 'https://drive.google.com/file/d/1mifBp25jBI68enl1HWYIdzQBLO12KaKy/preview', pdfHref: 'https://drive.google.com/file/d/1Eh4HxKbUKs5xQ3z9_gsENgdsUsR-sJDv/preview' },
  { num: 'T2 L1', title: 'LES FONDEMENTS DU DEVELOPPEMENT ECONOMIQUE DE LA COREE DU SUD', videoHref: 'https://drive.google.com/file/d/16I1UbwmcPGfidxndYJjCMtYVO_YMfV9y/preview', pdfHref: 'https://drive.google.com/file/d/183s9iWXFqVwxM5ygDqjQSMWTt0ofvayg/preview' },
  { num: 'T3 L5', title: 'LA COREE DU SUD: UNE PUISSANCE ECONOMIQUE EMERGENTE', videoHref: 'https://drive.google.com/file/d/1M6m1b-HNG3Lik_KzWcr_29SuN_QfDuCI/preview', pdfHref: '#' },
  { num: 'T3 L1', title: 'LA CEDEAO : UNE ORGANISATION REGIONALE A CARACTERE ECONOMIQUE', videoHref: 'https://drive.google.com/file/d/1MvAHbOLXewVhIdF0MMPgFahdHgRbRGVe/preview', pdfHref: 'https://drive.google.com/file/d/1YEGo2FbE14IZYzhIgyxWmI_Kjtio0yap/preview' },
  { num: 'T3 L2', title: 'LES RELATIONS UE/ACP : UN EXEMPLE DE COOPERATION NORD-SUD', videoHref: 'https://drive.google.com/file/d/1i_aDnxhEGUEZL-Gu4FwL9YumdhKvCnCp/preview', pdfHref: 'https://drive.google.com/file/d/1boUii0BqArb4a2jH9YLZpcJlgg6FVnid/preview' },
];

const historyLessons = [
  { num: 'T1 L1', title: 'L’ORGANISATION DES NATIONS UNIES (ONU)', videoHref: 'https://drive.google.com/file/d/1pWlBdosTmH7187CaBaZEHHA6Gwd60GKT/preview', pdfHref: 'https://drive.google.com/file/d/1rg5b-_uBlHA7OLCSzVseYJh4Bcw9V5jf/preview' },
  { num: 'T1 L2', title: 'L’ERE DE LA BIPOLARISATION DE 1947 A 1991', videoHref: 'https://drive.google.com/file/d/1OA7p4J-MjwS-yTn3RAWB6kOl4izRdkrf/preview', pdfHref: 'https://drive.google.com/file/d/1QejR96Kl1c2T8KjGmQKnQ6s4SUEm68X3/preview' },
  { num: 'T1 L3', title: 'DE LA FIN DE LA GUERRE FROIDE VERS UN MONDE MULTIPOLAIRE', videoHref: 'https://drive.google.com/file/d/1YkZtpomdEvvVCWJ5MrI8-6CXelqPv9BS/preview', pdfHref: 'https://drive.google.com/file/d/1h-YdtXf4yzz0HcD07z5xNu_2JIbOuVtI/preview' },
  { num: 'T2 L1', title: 'LA MONTÉE DES NATIONALISMES EN AFRIQUE', videoHref: 'https://drive.google.com/file/d/1ZgT2eg98M_OP6o3ofDT0VZZ76gc65uEx/preview', pdfHref: 'https://drive.google.com/file/d/1QgpFOwibpPpogH41YnyqWrHrMyomHf7E/preview' },
  { num: 'T2 L2', title: 'L’ACCESSION DE LA CÔTE D’IVOIRE A L’INDEPENDANCE', videoHref: 'https://drive.google.com/file/d/14OEyc1ijVKaUD3Vhr49yPq2V8SlbCBu7/preview', pdfHref: 'https://drive.google.com/file/d/1FjdOwj_7jUyKOE9f8JI_BiMuOcKhR1nO/preview' },
  { num: 'T2 L3', title: 'L\'ACCESSION DE L\'ALGÉRIE A L\'INDÉPENDANCE', videoHref: 'https://drive.google.com/file/d/1LrUJilR9pwgr4RuRp7eDEHDGBE0Ll_Cd/preview', pdfHref: 'https://drive.google.com/file/d/1DIJW7hVciB2Qd5DBPWrC9G7XZRNoRaw8/preview' },
  { num: 'T2 L4', title: 'L’UNION AFRICAINE (U.A.)', videoHref: 'https://drive.google.com/file/d/1YfEX8qcKgMEOQgOspNWPqEX4Xay8fr2e/preview', pdfHref: 'https://drive.google.com/file/d/1r2gAdC07SddrVUXx1GqUct7jDNm2dyNB/preview' },
  { num: 'T3 L1', title: 'CROYANCES ET VALEURS DOMINANTES DANS LE MONDE OCCIDENTAL', videoHref: 'https://drive.google.com/file/d/1H4QcE-azBKyHYfW3mv6o8vxjpW77Wh2V/preview', pdfHref: 'https://drive.google.com/file/d/1mtjmbPCL15oT694edvRkLzsXcvlUDUDl/preview' },
  { num: 'T3 L2', title: 'LES MUTATIONS CONTEMPORAINES DE LA CIVILISATION NEGRO-AFRICAINE', videoHref: 'https://drive.google.com/file/d/1frXDnqM3HdZV5N75OuliYQGkiXWGTKG5/preview', pdfHref: 'https://drive.google.com/file/d/15be7iDtf-kBfOman-c11NONHwZOdYUIW/preview' },
];

export default function HistoireGeographieTerminaleCPage() {
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
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setViewerContent(null);
          }
        }} 
      />
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Terminale C</p>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Histoire - Géographie
        </h1>
        <p className="text-muted-foreground">
          Liste des leçons disponibles pour cette matière.
        </p>
      </div>

      <div className="space-y-8">
        <div>
            <h2 className="font-headline text-2xl font-bold mb-4">Géographie</h2>
            <div className="grid gap-6 md:grid-cols-2">
                {geographyLessons.map((lesson, index) => (
                <Card key={`geo-${index}`}>
                    <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        {hasAccess ? (
                          <Unlock className="h-5 w-5 text-green-500" />
                        ) : (
                          <Lock className="h-5 w-5 text-red-500" />
                        )}
                        <span>
                            <span className="font-bold text-foreground">
                            {lesson.num}:
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
        
        <Separator />

        <div>
            <h2 className="font-headline text-2xl font-bold mb-4">Histoire</h2>
            <div className="grid gap-6 md:grid-cols-2">
                {historyLessons.map((lesson, index) => (
                <Card key={`hist-${index}`}>
                    <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                       {hasAccess ? (
                          <Unlock className="h-5 w-5 text-green-500" />
                        ) : (
                          <Lock className="h-5 w-5 text-red-500" />
                        )}
                        <span>
                            <span className="font-bold text-foreground">
                            {lesson.num}:
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
      </div>
    </div>
  );
}
