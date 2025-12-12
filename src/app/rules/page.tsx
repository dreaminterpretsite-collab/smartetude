'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export default function RulesPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString('fr-CI'));
  }, []);

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Règlement de l'Application</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          <p>Dernière mise à jour : {lastUpdated}</p>

          <h2 className="font-bold">1. Utilisation Acceptable</h2>
          <p>
            En utilisant Smart Études CI, vous acceptez de ne pas utiliser le service à des fins illégales ou interdites par ces règles. Vous ne devez pas :
          </p>
          <ul>
            <li>Tenter d'obtenir un accès non autorisé à nos systèmes ou à nos réseaux.</li>
            <li>Soumettre du contenu qui est illégal, offensant, ou qui porte atteinte aux droits d'autrui.</li>
            <li>Utiliser des moyens automatisés (bots, scrapers) pour accéder au service sans notre permission écrite.</li>
          </ul>

          <h2 className="font-bold">2. Système de Crédit</h2>
          <ul>
            <li>Chaque solution d'exercice coûte 200 FCFA, déduits de votre solde.</li>
            <li>Le solde est non remboursable et non transférable.</li>
            <li>Le bonus de bienvenue de 1000 FCFA est à usage unique et s'applique après la première recharge.</li>
          </ul>

          <h2 className="font-bold">3. Soumission d'Exercices</h2>
          <ul>
            <li>Les images soumises doivent être claires et lisibles.</li>
            <li>Le service est destiné à des fins d'aide à l'apprentissage. Toute tentative de tricherie lors d'examens est strictement interdite.</li>
          </ul>

          <h2 className="font-bold">4. Propriété Intellectuelle</h2>
          <p>
            Les fiches de cours sont la propriété du MENA (Ministère de l'Éducation Nationale et de l'Alphabétisation) de Côte d'Ivoire et sont distribuées gratuitement. Cependant, le contenu fourni par l'application, y compris les solutions générées, nous appartient.
          </p>

          <h2 className="font-bold">5. Sanctions</h2>
          <p>
            Nous nous réservons le droit de suspendre ou de résilier votre compte sans préavis pour toute violation de ces règles.
          </p>

          <h2 className="font-bold">6. Modifications du Règlement</h2>
          <p>
            Nous pouvons modifier ces règles à tout moment. Il est de votre responsabilité de les consulter régulièrement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
