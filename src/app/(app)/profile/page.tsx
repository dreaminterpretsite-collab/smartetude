'use client';

import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
}

export default function ProfilePage() {
    const { userProfile, user } = useAuth();
    const { toast } = useToast();
    
    const formatCurrency = (amount: number | null | undefined) => {
        if (amount === undefined || amount === null) return '...';
        return new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount);
    };

    const copyToClipboard = () => {
        if (!user) return;
        navigator.clipboard.writeText(user.uid);
        toast({ title: 'Copié !', description: 'Le lien de parrainage a été copié dans le presse-papiers.' });
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
        { label: "Classe", value: capitalize(userProfile.className) },
        { label: "Membre Depuis", value: new Date(userProfile.inscriptionDate).toLocaleDateString('fr-FR') },
        { label: "Solde Actuel", value: formatCurrency(userProfile.solde) },
    ];


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Profil</h1>
            <Card className="max-w-2xl">
                <CardHeader className="text-center items-center space-y-4">
                    <Avatar className="h-24 w-24 text-3xl border-2 border-primary">
                        <AvatarImage src={user?.photoURL || ''} />
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
                    </div>
                </CardContent>
            </Card>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Gift className="h-6 w-6 text-accent"/>
                        Programme de Parrainage
                    </CardTitle>
                    <CardDescription>
                        Partagez votre code de parrainage avec vos amis. Quand ils s'inscrivent, vous recevrez tous les deux un bonus de 1,000 FCFA !
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input value={user.uid} readOnly className="font-mono bg-muted"/>
                        <Button onClick={copyToClipboard} variant="outline" size="icon">
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copier le code</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
