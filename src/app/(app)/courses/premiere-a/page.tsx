'use client';

// Ce fichier a été créé pour corriger une erreur de déploiement.
// Il peut être complété plus tard.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function PremiereAPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Première A</p>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Cours de Première A
        </h1>
        <p className="text-muted-foreground">
          Cette page est en cours de construction.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contenu Bientôt Disponible</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 text-center">
            <Construction className="h-16 w-16 text-yellow-500" />
            <p className="text-lg text-muted-foreground">
                Les cours pour cette section sont en cours de préparation. Revenez bientôt !
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
// This file is intentionally left blank. It will be created by the user later.
