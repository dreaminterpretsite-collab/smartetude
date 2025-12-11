'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { Loader2, ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const paymentSchema = z.object({
  amount: z.string().refine(val => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0, {
    message: "Veuillez sélectionner un montant."
  }),
  waveTransactionId: z.string().length(17, { message: "L'ID de transaction doit contenir exactement 17 caractères." }),
});

export default function PaymentPage() {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
        amount: '',
        waveTransactionId: '',
    }
  });

  async function onSubmit(values: z.infer<typeof paymentSchema>) {
    if (!user || !userProfile) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Vous devez être connecté.' });
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(firestore, 'payments'), {
        userProfileId: user.uid,
        userEmail: user.email,
        paymentDate: Date.now(),
        amount: parseInt(values.amount, 10),
        waveTransactionId: values.waveTransactionId,
        status: 'pending',
      });
      toast({ title: 'Demande Soumise', description: 'Votre paiement est en cours de vérification. Votre solde sera mis à jour après validation.' });
      form.reset();
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de soumettre votre demande. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Recharger votre compte</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Étape 1: Effectuer le paiement</CardTitle>
            <CardDescription>Utilisez le lien Wave ci-dessous pour effectuer votre paiement.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Cliquez sur le bouton pour ouvrir la page de paiement Wave. Assurez-vous de conserver l'ID de la transaction après le paiement.</p>
            <Button asChild>
              <Link href="https://pay.wave.com/m/M_ci_Q9AYZJIuLVA9/c/ci/" target="_blank" rel="noopener noreferrer">
                Payer avec Wave <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Étape 2: Valider votre paiement</CardTitle>
            <CardDescription>Entrez les informations de votre transaction pour que nous puissions créditer votre compte.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant Rechargé (FCFA)</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un montant" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="2000">2,000 FCFA</SelectItem>
                          <SelectItem value="5000">5,000 FCFA</SelectItem>
                          <SelectItem value="10000">10,000 FCFA</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="waveTransactionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID de Transaction Wave</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 1234567890ABCDEFG" {...field} />
                      </FormControl>
                      <FormDescription>
                        Vous pouvez trouver cet ID dans vos reçus Wave.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {loading ? 'Soumission...' : 'Soumettre pour validation'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
