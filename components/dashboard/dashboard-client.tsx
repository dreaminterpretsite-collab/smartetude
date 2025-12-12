'use client';
import { useAuth } from "@/context/AuthContext";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { AlertCircle, BookLock, CheckCircle2 } from "lucide-react";
import { SolveExerciseForm } from "@/components/dashboard/solve-exercise-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useFirebase } from "@/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const EXERCISE_COST = 200;
const COURSE_ACCESS_COST = 200;

export function DashboardClient() {
    const { user, userProfile, hasCourseAccess } = useAuth();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [unlocking, setUnlocking] = useState(false);
    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setWelcomeMessage("Bonjour");
        else if (hour < 18) setWelcomeMessage("Bon après-midi");
        else setWelcomeMessage("Bonsoir");
    }, []);

    useEffect(() => {
        if (hasCourseAccess && userProfile?.courseAccessExpires) {
            const interval = setInterval(() => {
                const now = Date.now();
                const timeLeft = userProfile.courseAccessExpires! - now;
                if (timeLeft <= 0) {
                    setCountdown("Expiré");
                    clearInterval(interval);
                } else {
                    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
                    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
                    const seconds = Math.floor((timeLeft / 1000) % 60);
                    setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [hasCourseAccess, userProfile?.courseAccessExpires]);

    const handleUnlockCourses = async () => {
        if (!user || !userProfile) return;

        if (userProfile.solde < COURSE_ACCESS_COST) {
            toast({
                variant: "destructive",
                title: "Solde insuffisant",
                description: `Vous avez besoin de ${COURSE_ACCESS_COST} FCFA pour débloquer les cours.`,
            });
            return;
        }

        setUnlocking(true);
        try {
            const userRef = doc(firestore, "users", user.uid);
            const newExpiry = Date.now() + 48 * 60 * 60 * 1000; // 48 hours from now
            await updateDoc(userRef, {
                solde: increment(-COURSE_ACCESS_COST),
                courseAccessExpires: newExpiry,
            });
            toast({
                title: "Accès débloqué!",
                description: "Vous avez accès à tous les cours de votre classe pour les 48 prochaines heures.",
            });
        } catch (error) {
            console.error("Error unlocking courses:", error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de débloquer les cours. Veuillez réessayer."
            });
        } finally {
            setUnlocking(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    {welcomeMessage}, {userProfile?.name?.split(' ')[0]} !
                </h1>
                <p className="text-muted-foreground">Prêt à résoudre des exercices? C'est parti !</p>
            </div>
            
            {userProfile && userProfile.solde < EXERCISE_COST && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Solde Faible</AlertTitle>
                    <AlertDescription>
                        Votre solde est de {userProfile.solde} FCFA. Un minimum de {EXERCISE_COST} FCFA est requis pour soumettre un exercice.
                        <Button asChild variant="link" className="p-0 h-auto ml-2 text-destructive-foreground">
                            <Link href="/payment">Rechargez maintenant.</Link>
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Nouveau Défi</CardTitle>
                        <CardDescription>Soumettez un exercice pour obtenir une solution pas à pas de notre système.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <SolveExerciseForm />
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Accès aux Cours</CardTitle>
                        <CardDescription>Débloquez l'accès à toutes les fiches de cours de votre classe.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
                        {hasCourseAccess ? (
                            <>
                                <CheckCircle2 className="h-16 w-16 text-green-500" />
                                <div className="space-y-1">
                                    <p className="font-semibold">Accès aux cours activé !</p>
                                    <p className="text-muted-foreground text-sm">Temps restant :</p>
                                    <p className="font-mono text-2xl font-bold text-primary">{countdown}</p>
                                </div>
                                <Button asChild>
                                    <Link href="/courses">Voir les cours</Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <BookLock className="h-16 w-16 text-destructive" />
                                <p className="text-muted-foreground">
                                    Accédez à toutes les fiches de cours de votre classe pendant 48 heures.
                                </p>
                                <Button onClick={handleUnlockCourses} disabled={unlocking || (userProfile?.solde ?? 0) < COURSE_ACCESS_COST}>
                                    {unlocking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Débloquer pour 48h ({COURSE_ACCESS_COST} FCFA)
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
