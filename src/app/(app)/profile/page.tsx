'use client';

import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Gift, PiggyBank, CircleAlert, Edit, TrendingUp, Users, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const profileFormSchema = z.object({
  className: z.enum(['troisieme', 'seconde', 'premiere', 'terminale']),
});

const getInitials = (name: string | undefined) => {
    if (!name) return '..';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
};

const capitalize = (s: string | undefined) => {
    if(!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

const MIN_WITHDRAWAL_AMOUNT = 10000;

export default function ProfilePage() {
    const { userProfile, user, firestore } = useAuth();
    const { toast } = useToast();
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            className: userProfile?.className || 'troisieme',
        }
    });

    const {formState: {isSubmitting}} = form;

    // Met à jour automatiquement le formulaire quand userProfile arrive
    useEffect(() => {
      if (userProfile?.className) {
        form.reset({ className: userProfile.className });
      }
    }, [userProfile, form]);

    const formatCurrency = (amount: number | null | undefined) => {
        if (amount === undefined || amount === null) return '...';
        return new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount);
    };

    const copyToClipboard = () => {
        if (!user) return;
        navigator.clipboard.writeText(user.uid);
        toast({ title: 'Copié !', description: 'Le code de parrainage a été copié dans le presse-papiers.' });
    };

    const handleWithdrawal = async () => {
        if (!user || !userProfile || !firestore || (userProfile.referralBalance ?? 0) < MIN_WITHDRAWAL_AMOUNT) {
          toast({
            variant: 'destructive',
            title: 'Action impossible',
            description: `Le montant minimum pour un retrait est de ${formatCurrency(MIN_WITHDRAWAL_AMOUNT)}.`,
          });
          return;
        }
        setIsWithdrawing(true);
        try {
          await addDoc(collection(firestore, 'withdrawalRequests'), {
            userId: user.uid,
            userEmail: userProfile.email,
            userName: userProfile.name,
            amount: userProfile.referralBalance,
            status: 'pending' as const,
            requestDate: Date.now(),
          });
          toast({
            title: 'Demande envoyée',
            description: 'Votre demande de retrait a été envoyée et sera traitée par un administrateur.',
          });
        } catch (error) {
          console.error('Erreur lors de la demande de retrait:', error);
          toast({
            variant: 'destructive',
            title: 'Erreur',
            description: 'Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.',
          });
        } finally {
          setIsWithdrawing(false);
        }
    };
    
    const onProfileUpdate = async (values: z.infer<typeof profileFormSchema>) => {
        if (!user || !firestore) return;
        try {
            const userRef = doc(firestore, 'users', user.uid);
            await updateDoc(userRef, {
                className: values.className
            });
            toast({ title: 'Succès', description: 'Votre classe a été mise à jour.' });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de mettre à jour votre profil.' });
        }
    };

    if (!userProfile || !user) {
        return (
            <div className="space-y-6">
                 <h1 className="text-3xl font-bold tracking-tight font-headline">Profil</h1>
                 <Card className="max-w-2xl">
                    <CardHeader className="items-center">
                        <Skeleton className="h-24 w-24 rounded-full" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-6 w-1/2 mx-auto" />
                        <Skeleton className="h-4 w-3/4 mx-auto" />
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                 </Card>
            </div>
        )
    }

    const profileItems = [
        { label: "Nom Complet", value: userProfile.name },
        { label: "Adresse Email", value: userProfile.email },
        { label: "Membre Depuis", value: new Date(userProfile.inscriptionDate).toLocaleDateString('fr-FR') },
        { label: "Solde Actuel", value: formatCurrency(userProfile.solde) },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Profil & Parrainage</h1>
            <div className="grid lg:grid-cols-2 gap-6 items-start">
                <Card>
                    <CardHeader className="text-center items-center space-y-4">
                        <Avatar className="h-24 w-24 text-3xl border-2 border-primary">
                            <AvatarImage src={userProfile?.photoURL || ''} />
                            <AvatarFallback>{getInitials(userProfile?.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="font-headline text-2xl">{userProfile.name}</CardTitle>
                            <CardDescription>{userProfile.email}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            {profileItems.map(item => (
                                <div key={item.label} className="p-4 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground">{item.label}</p>
                                    <p className="font-semibold">{item.value}</p>
                                </div>
                            ))}
                            <div className="p-4 bg-muted/50 rounded-lg sm:col-span-2">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Classe</p>
                                        <p className="font-semibold">{capitalize(userProfile.className)}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </div>
                                {isEditing && (
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onProfileUpdate)} className="mt-4 space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="className"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Mettre à jour la classe</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Sélectionnez votre classe" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="troisieme">Troisième</SelectItem>
                                                                <SelectItem value="seconde">Seconde</SelectItem>
                                                                <SelectItem value="premiere">Première</SelectItem>
                                                                <SelectItem value="terminale">Terminale</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                {isSubmitting ? 'Sauvegarde...' : 'Enregistrer'}
                                            </Button>
                                        </form>
                                    </Form>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg"><Gift className="h-5 w-5 text-primary"/>Programme de Parrainage</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Votre code de parrainage unique :</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Input readOnly value={user.uid} className="font-mono bg-background" />
                                    <Button size="icon" variant="outline" onClick={copyToClipboard}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">Partagez ce code. Quand un nouvel utilisateur s'inscrit avec, vous recevez tous les deux <span className="font-bold text-accent">1000 FCFA</span> sur votre solde principal.</p>
                            <div className="border-t pt-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Gains de parrainage (MLM)</p>
                                        <p className="text-lg font-bold">{formatCurrency(userProfile.referralBalance)}</p>
                                    </div>
                                    <Button 
                                        onClick={handleWithdrawal} 
                                        disabled={isWithdrawing || (userProfile.referralBalance ?? 0) < MIN_WITHDRAWAL_AMOUNT}
                                    >
                                        {isWithdrawing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Demander un retrait
                                    </Button>
                                </div>
                                {(userProfile.referralBalance ?? 0) < MIN_WITHDRAWAL_AMOUNT && (
                                    <div className="flex items-start text-xs text-muted-foreground gap-2">
                                        <CircleAlert className="h-4 w-4 mt-0.5 shrink-0" />
                                        <span>Le montant minimum pour une demande de retrait est de {formatCurrency(MIN_WITHDRAWAL_AMOUNT)}.</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg"><TrendingUp className="h-5 w-5 text-primary"/>Fonctionnement des Gains</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex items-start gap-3">
                                <div className="flex-shrink-0"><Users className="h-5 w-5 text-muted-foreground" /></div>
                                <div>
                                    <h4 className="font-semibold">Parrainage Direct</h4>
                                    <p className="text-sm text-muted-foreground">Invitez un ami avec votre code. Quand il s'inscrit, vous gagnez <span className="font-bold text-accent">1000 FCFA</span> et lui aussi ! Ce bonus est ajouté à votre <span className="font-bold">solde principal</span>, utilisable pour les services de l'application.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0"><PiggyBank className="h-5 w-5 text-muted-foreground" /></div>
                                <div>
                                    <h4 className="font-semibold">Gains sur les Recharges (MLM)</h4>
                                    <p className="text-sm text-muted-foreground">Vous gagnez des commissions sur les recharges de vos filleuls sur 3 niveaux :</p>
                                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc pl-5">
                                        <li><Badge variant="secondary">Niveau 1</Badge> (vos filleuls directs) : <span className="font-bold text-accent">10%</span></li>
                                        <li><Badge variant="secondary">Niveau 2</Badge> (filleuls de vos filleuls) : <span className="font-bold text-accent">3%</span></li>
                                        <li><Badge variant="secondary">Niveau 3</Badge> : <span className="font-bold text-accent">1%</span></li>
                                    </ul>
                                    <p className="text-sm text-muted-foreground mt-2">Ces gains sont versés dans votre solde "Gains de parrainage (MLM)".</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-3">
                                <div className="flex-shrink-0"><Wallet className="h-5 w-5 text-muted-foreground" /></div>
                                <div>
                                    <h4 className="font-semibold">Retrait des Gains</h4>
                                    <p className="text-sm text-muted-foreground">Vous pouvez demander le retrait de votre solde MLM dès qu'il atteint <span className="font-bold text-accent">{formatCurrency(MIN_WITHDRAWAL_AMOUNT)}</span>. Les demandes sont traitées par un administrateur.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
