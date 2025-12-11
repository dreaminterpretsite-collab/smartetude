import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Connexion</CardTitle>
        <CardDescription>
          Entrez votre email pour vous connecter à votre compte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <div className="mt-4 text-center text-sm">
          Vous n'avez pas de compte?{" "}
          <Link href="/signup" className="underline hover:text-primary">
            Inscrivez-vous
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
