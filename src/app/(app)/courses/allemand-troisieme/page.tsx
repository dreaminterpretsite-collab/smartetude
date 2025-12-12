'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Construction, Lock } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFirebase } from '@/firebase/client-provider';
import { trackCourseVisit, type CourseInfo } from '@/lib/course-visits';
import { useToast } from '@/hooks/use-toast';

const courseInfo: CourseInfo = {
  id: 'allemand-troisieme',
  name: 'Allemand Troisième',
  url: '/courses/allemand-troisieme',
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

export default function AllemandTroisiemePage() {
    const { userProfile } = useAuth();
    const { toast } = useToast();

    const handleLockedContent = () => {
        if (!userProfile) return;
        if (userProfile.solde <= 0) {
            toast({
                title: 'Contenu Verrouillé',
                description: "Votre solde est épuisé. Veuillez recharger votre compte pour accéder à ce cours.",
                variant: 'destructive',
            });
        } else if (userProfile.className !== 'troisieme') {
            toast({
                title: 'Accès non autorisé',
                description: "Ce contenu est réservé aux élèves de Troisième. Veuillez vous connecter avec un compte correspondant.",
                variant: 'destructive',
            });
        } else {
             toast({
                title: 'Contenu Bientôt Disponible',
                description: "Les cours pour cette matière sont en cours de préparation.",
            });
        }
    };

  return (
    <div className="space-y-6">
      <CourseTracker />
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Troisième</p>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Allemand
        </h1>
        <p className="text-muted-foreground">
          Les leçons pour cette matière sont en cours de préparation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Lock className="h-5 w-5 text-red-500" />
            Contenu bientôt disponible
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 text-center">
            <Construction className="h-16 w-16 text-yellow-500" />
            <p className="text-lg text-muted-foreground">
                Nos équipes pédagogiques travaillent activement pour mettre à votre disposition les fiches de cours pour cette matière. <br /> Revenez bientôt !
            </p>
            <Button asChild>
                <Link href="/courses">Retour à la liste des cours</Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
