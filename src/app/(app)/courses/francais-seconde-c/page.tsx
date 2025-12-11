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
  id: 'francais-seconde-c',
  name: 'Français Seconde C',
  url: '/courses/francais-seconde-c',
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

const savoirFaireLessons = [
    { title: "SF 1: La prise de notes", pdfHref: 'https://drive.google.com/file/d/1T8e1zwKloPQeIMkfhBru6rdPP6tepiAL/preview' },
    { title: "SF 2: Apprendre à présenter un exposé oral", pdfHref: 'https://drive.google.com/file/d/1aPkIxOFvXGbfftavMwV9MB-AdxURp8z0/preview' },
];

const etudeOeuvreLessons = [
    { title: "EOI 1: Roman_LD_1", pdfHref: 'https://drive.google.com/file/d/1xIrpkqW_yNbQhpftHweMqcKF6ib_Z8Ek/preview' },
    { title: "EOI 2: Roman_LM_1", pdfHref: 'https://drive.google.com/file/d/1TwaayqTBT6wYb5cxnkkpXOwBHXQ8vLgT/preview' },
    { title: "EOI 3: Roman_Conclusion", pdfHref: 'https://drive.google.com/file/d/15zutnYlQXi4RG-DudLIOFVB7vNKHdtsu/preview' },
];

const productionLitteraireLessons = [
    { title: "PL1 : Les fonctions du langage", pdfHref: 'https://drive.google.com/file/d/1Dq4g3rFUR4gzBZ9cizxsmiFq7uAjTYo-/preview' },
    { title: "PL2: Outils de l'argumentation Les moyens d'expression d'une opinion", pdfHref: 'https://drive.google.com/file/d/1vnte2M4-fJx4KBowcbk4PewTZ6MtjW06/preview' },
    { title: "PL3: Outils de l'argumentation Les connecteurs logiques", pdfHref: 'https://drive.google.com/file/d/1Evd_lMawYJ-b4Er624G0f0Ay3-6XInYX/preview' },
    { title: "PL4: La sémantique", pdfHref: 'https://drive.google.com/file/d/10rxe0YS61Yvt7_7Te-QENmAUie-7dR0N/preview' },
    { title: "PL5: ENONCIATION les indices grammaticaux", pdfHref: 'https://drive.google.com/file/d/17hhWOqH8rdqvKph1kJmisnw7eyIwVIOE/preview' },
    { title: "PL6: ENONCIATION les indices lexicaux", pdfHref: 'https://drive.google.com/file/d/1aT6wTXdk5gvkxjL9rSY1v_Lcq7zR0b2M/preview' },
    { title: "PL7: FIGURES D'ANALOGIE", pdfHref: 'https://drive.google.com/file/d/15ZsoBlISzpyg51G6JYAlauvK-GFg1KLJ/preview' },
    { title: "PL8: FIGURES d'amplification et d'atténuation", pdfHref: 'https://drive.google.com/file/d/1Vpc5-Sa7yXxHa1AlWbeSgHmTZVQxyd7R/preview' },
    { title: "PL9: FIGURES d'opposition et de construction", pdfHref: 'https://drive.google.com/file/d/1RDI6RZ7vtJ83QXvFMTo5CA_7gk4k6JSe/preview' },
    { title: "PL10: La versification vers et strophes", pdfHref: 'https://drive.google.com/file/d/1WdpS3eOjG0Xb_Ojq7oSs_gNECM5v8XVG/preview' },
    { title: "PL11: La versification les sonorités", pdfHref: 'https://drive.google.com/file/d/1oNJp06m1ElCPCGqChUxgvYlyKU7yLYtY/preview' },
    { title: "PL12: L'implicite", pdfHref: 'https://drive.google.com/file/d/1YUpSjrssjPT5qJ6yRwB1ZPAaxQbgt9fi/preview' },
];

const expressionEcriteLessons = [
    { title: "EE 1: Com_Composé Analyser_libellé_construire_sens", pdfHref: 'https://drive.google.com/file/d/11DIgtS1VZdk4iKbr8RXOIiIOycRaH-Xv/preview' },
    { title: "EE 2: Com_Composé_Organiser_CI", pdfHref: 'https://drive.google.com/file/d/1_NwkjC35yZTJuuIjfeLlMwb9GR_kGAtr/preview' },
    { title: "EE 3: Com_Composé_Rédiger_CI", pdfHref: 'https://drive.google.com/file/d/1poOXEGeiZydgSSSKHXsV7EIGei7bH-rP/preview' },
    { title: "EE 4: Com_Composé_Rédiger_Introduction", pdfHref: 'https://drive.google.com/file/d/1WffgX8YgCOcS5Z0Qi6iAhCJZuNJv3U22/preview' },
    { title: "EE 5: Production-écrite_Analyser_sujet-Rech_idées", pdfHref: 'https://drive.google.com/file/d/11YYjabu41BWQYLBDJ9zOby7uwxqvllnk/preview' },
    { title: "EE 6: Production-écrite Organiser idées", pdfHref: 'https://drive.google.com/file/d/1NXJZxxIfcOvQqhq0NUf5ErokxjmMyBZl/preview' },
    { title: "EE 7: Production-écrite_rédiger_paragr_argumentatif", pdfHref: 'https://drive.google.com/file/d/1ykPC3pqAmuWodaGcPEwrMSM4ZTaD-rgx/preview' },
    { title: "EE 8 & 9: Production-écrite_Rédiger_intro_conclusion", pdfHref: 'https://drive.google.com/file/d/15b-nL35kuo9jwUZCCZr3SNgF3-ApWGaz/preview' },
    { title: "EE 10: Résumé_Texte_Argu_Répondre_questions", pdfHref: 'https://drive.google.com/file/d/15AuCnVOkirfZLeBNg59Y656UHY27sAYI/preview' },
    { title: "EE 11: Résumé_Texte_Argu_Ident_sitaut_argumentation", pdfHref: 'https://drive.google.com/file/d/1XoVN0yTCCTfhKaEMbpS_mGNTEcHYQQ0O/preview' },
    { title: "EE 12: Résumé_Texte_Argu_Sélection_IE_Enchai_logique", pdfHref: 'https://drive.google.com/file/d/1WUHqcYenmnbtScKZXHVNBM0_5F-uQyEf/preview' },
    { title: "EE 13: Résumé_Texte_Argu_Reformulation_IE", pdfHref: 'https://drive.google.com/file/d/1_y14VI_9rFIKXNVD8LjRJhws0fz583jD/preview' },
    { title: "EE 14: Résumé_Texte_Argu_Rédiger_résumé", pdfHref: 'https://drive.google.com/file/d/1i51TvfV2Iqj26w9LTsGfOXwTAdMBLjs7/preview' },
    { title: "EE 15: Evaluation", pdfHref: 'https://drive.google.com/file/d/1oIzDXQccSNCoMgMSQtciqu9tKV5vkO3b/preview' },
];

const lessonGroups = [
    { title: "Savoir-Faire (Expression Orale)", lessons: savoirFaireLessons },
    { title: "Etude de l'œuvre intégrale", lessons: etudeOeuvreLessons },
    { title: "Production Littéraire", lessons: productionLitteraireLessons },
    { title: "Expression Écrite", lessons: expressionEcriteLessons },
];

export default function FrancaisSecondeCPage() {
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
        <p className="text-sm font-medium text-primary">Seconde C</p>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Français
        </h1>
        <p className="text-muted-foreground">
          Liste des leçons disponibles pour cette matière.
        </p>
      </div>

      <div className="space-y-8">
        {lessonGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h2 className="font-headline text-2xl font-bold mb-4">{group.title}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {group.lessons.map((lesson, lessonIndex) => (
                <Card key={lessonIndex}>
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
            {groupIndex < lessonGroups.length - 1 && <Separator className="my-8" />}
          </div>
        ))}
      </div>
    </div>
  );
}
