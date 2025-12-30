'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2 } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';  // Importation de FirebaseError

const formSchema = z.object({
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide.' }),
  password: z.string().min(1, { message: 'Veuillez entrer votre mot de passe.' }),
});

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { auth } = useFirebase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    try {
      if (!auth) throw new Error("Firebase Auth not initialized");
      await signInWithEmailAndPassword(auth, values.email, values.password);
      router.push('/dashboard');
    } catch (e: any) {
      if (e instanceof FirebaseError) {  // Vérification de FirebaseError
        setError(`Erreur Firebase : ${e.message}`);
      } else {
        setError('Email ou mot de passe incorrect.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
    </Form>
  );
}
