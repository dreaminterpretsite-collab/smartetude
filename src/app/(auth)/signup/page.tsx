import { SignupForm } from '@/components/auth/signup-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Créer un compte</CardTitle>
        <CardDescription>
          Entrez vos informations pour commencer votre parcours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
        <div className="mt-4 text-center text-sm">
          Vous avez déjà un compte?{" "}
          <Link href="/login" className="underline hover:text-primary">
            Connectez-vous
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
