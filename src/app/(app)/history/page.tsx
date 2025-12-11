'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useFirebase } from '@/firebase';
import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import type { Exercise } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function HistoryPage() {
  const { user } = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | 'all' | null>(null);

  useEffect(() => {
    if (!user || !firestore) return;

    setLoading(true);
    const exercisesRef = collection(firestore, 'users', user.uid, 'exercises');
    const q = query(exercisesRef, orderBy('submissionDate', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userExercises: Exercise[] = [];
      querySnapshot.forEach((doc) => {
        userExercises.push({ ...doc.data(), id: doc.id } as Exercise);
      });
      setExercises(userExercises);
      setLoading(false);
    },
    async (err) => {
        const permissionError = new FirestorePermissionError({
            path: exercisesRef.path,
            operation: 'list'
        });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user, firestore]);

  const handleDelete = async () => {
    if (!user || !firestore || !deleteTarget) return;

    try {
        if (deleteTarget === 'all') {
          // Delete all exercises
          const batch = writeBatch(firestore);
          exercises.forEach((exercise) => {
            const docRef = doc(firestore, 'users', user.uid, 'exercises', exercise.id);
            batch.delete(docRef);
          });
          await batch.commit()
          toast({ title: 'Succès', description: "Tout l'historique a été supprimé." });
        } else {
          // Delete single exercise
          const docRef = doc(firestore, 'users', user.uid, 'exercises', deleteTarget);
          await deleteDoc(docRef)
          toast({ title: 'Succès', description: "L'exercice a été supprimé." });
        }
    } catch(err) {
        let permissionError;
        if (deleteTarget === 'all') {
             permissionError = new FirestorePermissionError({
                path: `users/${user.uid}/exercises`,
                operation: 'delete',
             });
        } else {
            const docRef = doc(firestore, 'users', user.uid, 'exercises', deleteTarget);
            permissionError = new FirestorePermissionError({
              path: docRef.path,
              operation: 'delete',
            });
        }
        errorEmitter.emit('permission-error', permissionError);
    }
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Historique des exercices
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <AlertDialog onOpenChange={(open) => !open && setDeleteTarget(null)}>
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <h1 className="font-headline text-3xl font-bold tracking-tight">
                Historique des exercices
            </h1>
            {exercises.length > 0 && (
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" onClick={() => setDeleteTarget('all')}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Tout supprimer
                    </Button>
                </AlertDialogTrigger>
            )}
        </div>

        {exercises.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <p>Vous n'avez pas encore soumis d'exercices.</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard">Soumettre mon premier exercice</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {exercises.map((exercise, index) => (
              <Card key={exercise.id} className="flex flex-col">
                <div className="relative h-48 w-full">
                    <Image
                        src={exercise.imageUri}
                        alt={`Exercice de ${exercise.subject}`}
                        fill
                        className="rounded-t-lg object-cover"
                    />
                </div>
                <CardHeader>
                  <CardTitle>Exercice #{exercises.length - index}</CardTitle>
                  <CardDescription>
                    {exercise.subject} - {new Date(exercise.submissionDate).toLocaleDateString('fr-CI')}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto flex gap-2">
                  <Button asChild className="w-full">
                    <Link href={`/solution/${exercise.id}`}>Voir la solution</Link>
                  </Button>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setDeleteTarget(exercise.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                    </Button>
                  </AlertDialogTrigger>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

       <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. {deleteTarget === 'all' ? "Cela supprimera définitivement tout votre historique d'exercices." : "Cela supprimera définitivement cet exercice de votre historique."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
