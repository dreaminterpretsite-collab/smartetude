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

const bacSubjectsByYear = [
    { year: '2007', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Mathématiques', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'SVT', href: '#' } ] },
    { year: '2008', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Mathématiques', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Physique', href: '#' }, { name: 'SVT', href: '#' } ] },
    { year: '2009', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Mathématiques', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Physique', href: '#' }, { name: 'SVT', href: '#' } ] },
    { year: '2010', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Mathématiques', href: '#' }, { name: 'Physique', href: '#' }, { name: 'SVT', href: '#' } ] },
    { year: '2011', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Mathématiques', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Physique', href: '#' }, { name: 'SVT', href: '#' } ] },
    { year: '2012', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Mathématiques', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Physique', href: '#' }, { name: 'SVT', href: '#' } ] },
    { year: '2013', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Mathématiques', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Physique', href: '#' }, { name: 'SVT', href: '#' } ] },
    { year: '2014', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Mathématiques', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Physique', href: '#' }, { name: 'SVT', href: '#' } ] },
    { year: '2015', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Mathématiques', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Physique', href: '#' }, { name: 'SVT', href: '#' } ] },
    { year: '2016', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Mathématiques', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Physique', href: '#' }, { name: 'SVT', href: '#' } ] },
    { year: '2017', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Mathématiques', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Physique', href: '#' }, { name: 'SVT', href: '#' } ] },
    { year: '2018', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Mathématiques', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Physique', href: '#' }, { name: 'SVT', href: '#' } ] },
    { year: '2019', subjects: [ { name: 'Français', href: '#' }, { name: 'Histoire-Géo', href: '#' }, { name: 'Mathématiques', href: '#' }, { name: 'Philosophie', href: '#' }, { name: 'Physique', href: '#' }, { name: 'SVT', href: '#' } ] },
];


export default function BacCPage() {
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


  return (
    <div className="space-y-6">
       <ContentViewer 
        content={viewerContent} 
        onOpenChange={(isOpen) => !isOpen && setViewerContent(null)}
      />
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Anciens Sujets du BAC Série C
        </h1>
        <p className="text-muted-foreground">
          Entraînez-vous avec les sujets des années précédentes.
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
            Sujets par Année
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {bacSubjectsByYear.map((item) => (
              <AccordionItem key={item.year} value={item.year}>
                <AccordionTrigger className="text-lg font-bold">
                  Année {item.year}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {item.subjects.map((subject) => (
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
        </CardContent>
      </Card>
    </div>
  );
}
