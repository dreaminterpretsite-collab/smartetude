import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Politique de Confidentialité</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-CI')}</p>

          <h2>1. Introduction</h2>
          <p>
            Bienvenue sur Smart Études CI. Nous respectons votre vie privée et nous nous engageons à la protéger. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations.
          </p>

          <h2>2. Informations que nous collectons</h2>
          <p>Nous pouvons collecter les informations suivantes :</p>
          <ul>
            <li>
              <strong>Informations personnelles :</strong> Nom, adresse e-mail, classe, que vous nous fournissez lors de votre inscription.
            </li>
            <li>
              <strong>Informations d'utilisation :</strong> Informations sur la manière dont vous utilisez notre application, comme les exercices soumis et les pages visitées.
            </li>
            <li>
              <strong>Données de paiement :</strong> Nous collectons les informations de transaction lorsque vous rechargez votre compte, mais nous ne stockons pas les détails de votre carte ou de votre compte Wave.
            </li>
          </ul>

          <h2>3. Comment nous utilisons vos informations</h2>
          <p>Nous utilisons vos informations pour :</p>
          <ul>
            <li>Fournir, exploiter et maintenir notre service.</li>
            <li>Améliorer, personnaliser et développer notre service.</li>
            <li>Communiquer avec vous, notamment pour le service client.</li>
            <li>Traiter vos transactions et prévenir la fraude.</li>
          </ul>

          <h2>4. Partage de vos informations</h2>
          <p>
            Nous ne partageons pas vos informations personnelles avec des tiers, sauf dans les cas suivants :
          </p>
          <ul>
            <li>Pour nous conformer à la loi.</li>
            <li>Pour protéger nos droits.</li>
            <li>Avec votre consentement.</li>
          </ul>

          <h2>5. Sécurité des données</h2>
          <p>
            Nous utilisons des mesures de sécurité pour protéger vos informations. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est sécurisée à 100 %.
          </p>

          <h2>6. Vos droits</h2>
          <p>
            Vous avez le droit d'accéder, de corriger ou de supprimer vos informations personnelles. Veuillez nous contacter pour exercer ces droits.
          </p>

          <h2>7. Modifications de cette politique</h2>
          <p>
            Nous pouvons mettre à jour notre politique de confidentialité de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle politique de confidentialité sur cette page.
          </p>

          <h2>8. Nous contacter</h2>
          <p>
            Si vous avez des questions sur cette politique de confidentialité, veuillez nous contacter via la page de support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
