'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Download, Lock, Unlock } from 'lucide-react';
import { useState } from 'react';
import { ContentViewer } from '@/components/content-viewer';

const bacSubjectsByYearA1 = [
    { year: '2006', subjects: [ { name: 'Allemand', href: '#' }, { name: 'Mathématiques', href: '#' } ] },
    { year: '2006 2ème session', subjects: [ { name: 'Allemand', href: '#' }, { name: 'Mathématiques', href: '#' } ] },
    { year: '2007', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Mathématiques', href: '#' } ] },
    { year: '2008', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand', href: '#' }, { name: 'Espagnol LV1', href: 'https://drive.google.com/file/d/1X_ofMsGev6GPy7T7k1uCJE14p-h47tob/preview' } ] },
    { year: '2009', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand', href: '#' }, { name: 'Mathématiques', href: '#' } ] },
    { year: '2010', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Mathématiques', href: '#' } ] },
    { year: '2011', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand suite', href: '#' }, { name: 'Allemand', href: '#' }, { name: 'Mathématiques', href: '#' } ] },
    { year: '2012', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand', href: '#' }, { name: 'Mathématiques', href: '#' } ] },
    { year: '2013', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand', href: '#' }, { name: 'Mathématiques', href: '#' } ] },
    { year: '2014', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand', href: '#' }, { name: 'Mathématiques', href: '#' } ] },
    { year: '2015', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand', href: '#' }, { name: 'Mathématiques', href: '#' } ] },
    { year: '2016', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand', href: '#' }, { name: 'Mathématiques', href: '#' } ] },
    { year: '2017', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand', href: '#' }, { name: 'Mathématiques', href: '#' } ] },
    { year: '2018', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand', href: '#' }, { name: 'Mathématiques', href: '#' } ] },
    { year: '2019', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Mathématiques', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Espagnol', href: '#' } ] },
];

const bacSubjectsByYearA2 = [
    { year: '2006 Session 1', subjects: [ { name: 'Allemand', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Espagnol s2', href: '#' } ] },
    { year: '2006 Session 2', subjects: [ { name: 'Allemand', href: '#' } ] },
    { year: '2007', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Philosophie', href: '#' } ] },
    { year: '2008', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand', href: '#' }, { name: 'Espagnol', href: '#' } ] },
    { year: '2009', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand', href: '#' } ] },
    { year: '2010', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand', href: '#' } ] },
    { year: '2011', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand suite', href: '#' }, { name: 'Allemand', href: '#' } ] },
    { year: '2012', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand', href: '#' } ] },
    { year: '2013', subjects: [ { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand', href: '#' } ] },
    { year: '2014', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand', href: '#' }, { name: 'Anglais', href: '#' } ] },
    { year: '2015', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand', href: '#' } ] },
    { year: '2016', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand', href: '#' } ] },
    { year: '2017', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand', href: '#' } ] },
    { year: '2018', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Espagnol', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand', href: '#' } ] },
    { year: '2019', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Allemand', href: '#' }, { name: 'Anglais', href: '#' }, { name: 'Espagnol', href: '#' } ] },
];


export default function BacAPage() {
  const { userProfile, hasCourseAccess } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' } | null>(null);
  const hasAccess = hasCourseAccess && userProfile?.className === 'terminale';

  const handleLockedContent = () => {
    if (!userProfile) return;
    let message = "Vous n'avez pas accès à ce contenu.";
    if (!hasCourseAccess) {
        message = "Veuillez débloquer l'accès aux cours depuis votre tableau de bord.";
    } else if (userProfile.className !== 'terminale') {
        message = "Ce contenu est réservé aux élèves de Terminale.";
    }
    
    toast({
        title: 'Accès non autorisé',
        description: message,
        variant: 'destructive',
    });
  };

  const openViewer = (url: string) => {
    if (url === '#') {
      toast({
        title: 'Contenu Indisponible',
        description: 'Cette ressource n\'est pas encore disponible.',
      });
      return;
    }
    setViewerContent({ url, type: 'pdf' });
  };

  const renderSubjects = (subjectsByYear: any[]) => (
    <Accordion type="single" collapsible className="w-full">
      {subjectsByYear.map((item) => (
        <AccordionItem key={item.year} value={item.year}>
          <AccordionTrigger className="text-lg font-bold">
            Année {item.year}
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {item.subjects.map((subject: any) => (
                <Button
                  key={subject.name}
                  disabled={!hasAccess}
                  variant="outline"
                  onClick={() => hasAccess ? openViewer(subject.href) : handleLockedContent()}
                >
                    <Download className="mr-2 h-4 w-4" />
                    {subject.name}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  return (
    <div className="space-y-6">
      <ContentViewer 
        content={viewerContent} 
        onOpenChange={(isOpen) => !isOpen && setViewerContent(null)}
      />
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Anciens Sujets du BAC Série A
        </h1>
        <p className="text-muted-foreground">
          Entraînez-vous avec les sujets des années précédentes pour les séries A1 et A2.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {hasAccess ? (
              <Unlock className="h-5 w-5 text-green-500" />
            ) : (
              <Lock className="h-5 w-5 text-red-500" />
            )}
            Sujets Série A1
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderSubjects(bacSubjectsByYearA1)}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {hasAccess ? (
              <Unlock className="h-5 w-5 text-green-500" />
            ) : (
              <Lock className="h-5 w-5 text-red-500" />
            )}
            Sujets Série A2
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderSubjects(bacSubjectsByYearA2)}
        </CardContent>
      </Card>
    </div>
  );
}
