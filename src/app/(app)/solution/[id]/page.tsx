'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useFirebase } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import type { Exercise } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, BookCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function SolutionPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user || !id || !firestore) return;

        const fetchExercise = async () => {
            try {
                const docRef = doc(firestore, 'users', user.uid, 'exercises', id as string);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setExercise({ id: docSnap.id, ...docSnap.data() } as Exercise);
                } else {
                    setError("Exercice non trouvé ou vous n'avez pas la permission de le voir.");
                }
            } catch (e: any) {
                if (e.code === 'permission-denied') {
                     const permissionError = new FirestorePermissionError({
                        path: `users/${user.uid}/exercises/${id}`,
                        operation: 'get',
                    });
                    errorEmitter.emit('permission-error', permissionError);
                }
                setError("Une erreur est survenue lors de la récupération de l'exercice.");
            } finally {
                setLoading(false);
            }
        };

        fetchExercise();
    }, [user, id, firestore]);

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-1/2" />
                <div className="grid md:grid-cols-2 gap-8">
                    <Skeleton className="h-[400px] w-full" />
                    <Skeleton className="h-[400px] w-full" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="text-center">
                <CardHeader>
                    <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
                    <CardTitle className="mt-4">Erreur</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{error}</p>
                </CardContent>
            </Card>
        );
    }

    if (!exercise) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className='space-y-2'>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Solution de l'exercice</h1>
                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                     <Badge variant="outline">{exercise.subject}</Badge>
                    <span>Soumis le: {new Date(exercise.submissionDate).toLocaleDateString('fr-FR')}</span>
                </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-8 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle>Votre Exercice</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                            <Image src={exercise.imageUri} alt="Exercice soumis" fill objectFit="contain" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-muted/30">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <BookCheck className="h-6 w-6 text-primary" />
                            <CardTitle>Solution Détaillée</CardTitle>
                        </div>
                        <CardDescription>Voici la solution détaillée, étape par étape.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Separator className='mb-6' />
                        <div
                            className="prose prose-sm dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: exercise.solution.replace(/\n/g, '<br />') }}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
