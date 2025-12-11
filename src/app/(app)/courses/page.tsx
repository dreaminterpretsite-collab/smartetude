'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BookOpen, Lock, Unlock } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const terminaleSubjects = {
  'Série A': [
    { name: 'Philosophie', href: '/courses/philo-terminale-a' },
    { name: 'Français', href: '/courses/francais-terminale-a' },
    { name: 'Anglais', href: '/courses/anglais-terminale-a' },
    { name: 'Espagnol', href: '/courses/espagnol-terminale-a' },
    { name: 'Allemand', href: '/courses/allemand-terminale-a' },
    { name: 'Histoire-Géographie', href: '/courses/histoire-geographie-terminale-a' },
    { name: 'Mathématiques', href: '/courses/math-terminale-a' },
  ],
  'Série C': [
    { name: 'Mathématiques', href: '/courses/math-terminale-c' },
    { name: 'Physique-Chimie', href: '/courses/physique-chimie-terminale-c' },
    { name: 'SVT', href: '/courses/svt-terminale-c' },
    { name: 'Philosophie', href: '/courses/philo-terminale-c' },
    { name: 'Français', href: '/courses/francais-terminale-c' },
    { name: 'Anglais', href: '/courses/anglais-terminale-c' },
    { name: 'Histoire-Géographie', href: '/courses/histoire-geographie-terminale-c' },
    { name: 'Espagnol', href: '#' },
    { name: 'Allemand', href: '#' },
  ],
  'Série D': [
    { name: 'SVT', href: '/courses/svt-terminale-d' },
    { name: 'Physique-Chimie', href: '/courses/physique-chimie-terminale-d' },
    { name: 'Mathématiques', href: '/courses/math-terminale-d' },
    { name: 'Philosophie', href: '/courses/philo-terminale-d' },
    { name: 'Français', href: '/courses/francais-terminale-d' },
    { name: 'Anglais', href: '/courses/anglais-terminale-d' },
    { name: 'Histoire-Géographie', href: '/courses/histoire-geographie-terminale-d' },
    { name: 'Espagnol', href: '/courses/espagnol-terminale-d' },
    { name: 'Allemand', href: '#' },
  ],
};

const premiereSubjects = {
  'Série A': [
    { name: 'Français', href: '/courses/francais-premiere-a' },
    { name: 'Anglais', href: '/courses/anglais-premiere-a' },
    { name: 'Histoire-Géographie', href: '/courses/histoire-geographie-premiere-a' },
    { name: 'Mathématiques', href: '/courses/math-premiere-a' },
    { name: 'Philosophie', href: '/courses/philo-premiere-a' },
    { name: 'Espagnol', href: '/courses/espagnol-premiere-a' },
    { name: 'Allemand', href: '/courses/allemand-premiere-a' },
  ],
  'Série C': [
    { name: 'Mathématiques', href: '/courses/math-premiere-c' },
    { name: 'Physique-Chimie', href: '/courses/physique-chimie-premiere-c' },
    { name: 'SVT', href: '/courses/svt-premiere-c' },
    { name: 'Français', href: '/courses/francais-premiere-c' },
    { name: 'Anglais', href: '/courses/anglais-premiere-c' },
    { name: 'Histoire-Géographie', href: '/courses/histoire-geographie-premiere-c' },
    { name: 'Philosophie', href: '/courses/philo-premiere-c' },
  ],
  'Série D': [
    { name: 'SVT', href: '/courses/svt-premiere-d' },
    { name: 'Physique-Chimie', href: '/courses/physique-chimie-premiere-d' },
    { name: 'Mathématiques', href: '/courses/math-premiere-d' },
    { name: 'Français', href: '/courses/francais-premiere-d' },
    { name: 'Anglais', href: '/courses/anglais-premiere-d' },
    { name: 'Histoire-Géographie', href: '/courses/histoire-geographie-premiere-d' },
    { name: 'Philosophie', href: '/courses/philo-premiere-d' },
  ],
};

const secondeSubjects = {
  'Série A': [
    { name: 'Français', href: '/courses/francais-seconde-a' },
    { name: 'Anglais', href: '/courses/anglais-seconde-a' },
    { name: 'Histoire-Géographie', href: '/courses/histoire-geographie-seconde-a' },
    { name: 'Mathématiques', href: '/courses/math-seconde-a' },
    { name: 'Physique-Chimie', href: '/courses/physique-chimie-seconde-a' },
    { name: 'SVT', href: '/courses/svt-seconde-a' },
    { name: 'Allemand', href: '/courses/allemand-seconde-a' },
    { name: 'Espagnol', href: '/courses/espagnol-seconde-a' },
  ],
  'Série C': [
    { name: 'Mathématiques', href: '/courses/math-seconde-c' },
    { name: 'Physique-Chimie', href: '/courses/physique-chimie-seconde-c' },
    { name: 'SVT', href: '/courses/svt-seconde-c' },
    { name: 'Français', href: '/courses/francais-seconde-c' },
    { name: 'Anglais', href: '/courses/anglais-seconde-c' },
    { name: 'Histoire-Géographie', href: '/courses/histoire-geographie-seconde-c' },
  ],
};

const troisiemeSubjects = [
  { name: 'Français', href: '/courses/francais-troisieme' },
  { name: 'Anglais', href: '/courses/anglais-troisieme' },
  { name: 'Histoire-Géographie', href: '/courses/histoire-geographie-troisieme' },
  { name: 'Mathématiques', href: '/courses/math-troisieme' },
  { name: 'Physique-Chimie', href: '/courses/physique-chimie-troisieme' },
  { name: 'SVT', href: '/courses/svt-troisieme' },
  { name: 'Allemand', href: '/courses/allemand-troisieme' },
  { name: 'Espagnol', href: '/courses/espagnol-troisieme' },
  { name: 'EDHC', href: '/courses/edhc-troisieme' },
];

const bacLinks = [
    { serie: 'Série A', href: '/courses/bac-a'},
    { serie: 'Série C', href: '/courses/bac-c'},
    { serie: 'Série D', href: '/courses/bac-d'},
];

export default function CoursesPage() {
  const { userProfile, hasCourseAccess } = useAuth();
  const { toast } = useToast();

  const handleLockedContent = (className: 'Terminale' | 'Première' | 'Seconde' | 'Troisième') => {
    if (!userProfile) return;
    
    let message = "Vous n'avez pas accès à cette classe.";
    if (!hasCourseAccess) {
        message = "Veuillez débloquer l'accès aux cours depuis votre tableau de bord.";
    } else if (userProfile.className !== className.toLowerCase()) {
        message = `Ce contenu est réservé aux élèves de ${className}.`;
    }

    toast({
        title: 'Accès non autorisé',
        description: message,
        variant: 'destructive',
    });
  };

  const renderSubjectList = (subjects: {name: string, href: string}[], level: 'terminale' | 'premiere' | 'seconde' | 'troisieme') => {
    const isLevelAccessible = hasCourseAccess && userProfile?.className === level;
    return (
      <div className="flex flex-col space-y-1 pl-4">
        {subjects.map((subject, index) => (
          <Link 
            key={`${level}-${subject.name}-${index}`} 
            href={isLevelAccessible ? (subject.href || '#') : '#'}
            onClick={(e) => {
              if (!isLevelAccessible) {
                e.preventDefault();
                handleLockedContent(level.charAt(0).toUpperCase() + level.slice(1) as any);
              } else if (subject.href === '#') {
                e.preventDefault();
                toast({ title: 'Bientôt disponible', description: 'Les cours pour cette matière seront bientôt ajoutés.'});
              }
            }}
            className={cn(
              "flex items-center gap-3 rounded-md p-2 text-sm justify-start font-normal",
              isLevelAccessible ? 'cursor-pointer hover:bg-accent/50' : 'cursor-not-allowed opacity-50'
            )}
          >
              <BookOpen className="h-4 w-4 text-primary" />
              <span>{subject.name}</span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Fiches de Cours
        </h1>
        <p className="text-muted-foreground">
          Parcourez nos fiches de cours détaillées, conformes au programme
          ivoirien.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            {hasCourseAccess && userProfile?.className === 'terminale' ? <Unlock className="h-5 w-5 text-green-500" /> : <Lock className="h-5 w-5 text-red-500" />}
            Terminale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {(Object.keys(terminaleSubjects) as Array<keyof typeof terminaleSubjects>).map((serie) => (
              <AccordionItem key={serie} value={serie}>
                <AccordionTrigger className="text-lg font-bold">
                  {serie.startsWith('Série A') ? (
                    <span>
                      Série <span className="font-extrabold text-yellow-400">A</span>
                    </span>
                  ) : serie.startsWith('Série C') ? (
                    <span>
                      Série <span className="font-extrabold text-yellow-400">C</span>
                    </span>
                  ) : serie.startsWith('Série D') ? (
                    <span>
                      Série <span className="font-extrabold text-yellow-400">D</span>
                    </span>
                  ) : (
                    serie
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  {renderSubjectList(terminaleSubjects[serie], 'terminale')}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            {hasCourseAccess && userProfile?.className === 'premiere' ? <Unlock className="h-5 w-5 text-green-500" /> : <Lock className="h-5 w-5 text-red-500" />}
            Première
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
             {(Object.keys(premiereSubjects) as Array<keyof typeof premiereSubjects>).map((serie) => (
              <AccordionItem key={`premiere-${serie}`} value={`premiere-${serie}`}>
                <AccordionTrigger className="text-lg font-bold">
                  {serie.startsWith('Série A') ? (
                    <span>
                      Série <span className="font-extrabold text-yellow-400">A</span>
                    </span>
                  ) : serie.startsWith('Série C') ? (
                    <span>
                      Série <span className="font-extrabold text-yellow-400">C</span>
                    </span>
                  ) : serie.startsWith('Série D') ? (
                    <span>
                      Série <span className="font-extrabold text-yellow-400">D</span>
                    </span>
                  ) : (
                    serie
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  {renderSubjectList(premiereSubjects[serie], 'premiere')}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            {hasCourseAccess && userProfile?.className === 'seconde' ? <Unlock className="h-5 w-5 text-green-500" /> : <Lock className="h-5 w-5 text-red-500" />}
            Seconde
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
             {(Object.keys(secondeSubjects) as Array<keyof typeof secondeSubjects>).map((serie) => (
              <AccordionItem key={`seconde-${serie}`} value={`seconde-${serie}`}>
                <AccordionTrigger className="text-lg font-bold">
                  {serie.startsWith('Série A') ? (
                    <span>
                      Série <span className="font-extrabold text-yellow-400">A</span>
                    </span>
                  ) : serie.startsWith('Série C') ? (
                    <span>
                      Série <span className="font-extrabold text-yellow-400">C</span>
                    </span>
                  ) : (
                    serie
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  {renderSubjectList(secondeSubjects[serie], 'seconde')}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            {hasCourseAccess && userProfile?.className === 'troisieme' ? <Unlock className="h-5 w-5 text-green-500" /> : <Lock className="h-5 w-5 text-red-500" />}
            Troisième
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
            {renderSubjectList(troisiemeSubjects, 'troisieme')}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            {hasCourseAccess && userProfile?.className === 'terminale' ? <Unlock className="h-5 w-5 text-green-500" /> : <Lock className="h-5 w-5 text-red-500" />}
            Anciens Sujets du Bac
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
            <div className="flex flex-col space-y-1">
              {bacLinks.map((link) => (
                 <Link
                  key={link.serie}
                  href={hasCourseAccess && userProfile?.className === 'terminale' ? link.href : '#'}
                  onClick={(e) => {
                    if (!hasCourseAccess || userProfile?.className !== 'terminale') {
                      e.preventDefault();
                      handleLockedContent('Terminale');
                    }
                  }}
                  className={cn("flex items-center gap-3 rounded-md p-2 text-sm justify-start font-normal",
                    hasCourseAccess && userProfile?.className === 'terminale' ? 'cursor-pointer hover:bg-accent/50' : 'cursor-not-allowed opacity-50'
                  )}>
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>{link.serie}</span>
                </Link>
              ))}
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            {hasCourseAccess && userProfile?.className === 'troisieme' ? <Unlock className="h-5 w-5 text-green-500" /> : <Lock className="h-5 w-5 text-red-500" />}
            Anciens Sujets du BEPC
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
            <div className="flex flex-col space-y-1">
              <Link href={hasCourseAccess && userProfile?.className === 'troisieme' ? "/courses/bepc" : '#'}
                onClick={(e) => {
                  if (!hasCourseAccess || userProfile?.className !== 'troisieme') {
                    e.preventDefault();
                    handleLockedContent('Troisième');
                  }
                }}
                className={cn("flex items-center gap-3 rounded-md p-2 text-sm justify-start font-normal",
                  hasCourseAccess && userProfile?.className === 'troisieme' ? 'cursor-pointer hover:bg-accent/50' : 'cursor-not-allowed opacity-50'
              )}>
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Consulter les sujets</span>
              </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
