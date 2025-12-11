'use client';
import { ChatInterface } from '@/components/chat-interface';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mail } from 'lucide-react';

export default function SupportPage() {
  const claraAvatar = PlaceHolderImages.find((p) => p.id === 'clara-avatar');
  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col">
      <div className="mb-6 flex items-center gap-4">
        {claraAvatar && (
          <Avatar className="h-14 w-14">
            <AvatarImage
              src={claraAvatar.imageUrl}
              alt="Avatar de Clara"
              data-ai-hint={claraAvatar.imageHint}
            />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
        )}
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Support Client
          </h1>
          <p className="text-muted-foreground">
            Posez vos questions à notre assistante, Clara.
          </p>
        </div>
      </div>

      <Alert className="mb-6">
        <Mail className="h-4 w-4" />
        <AlertTitle>Besoin d'une aide personnalisée ?</AlertTitle>
        <AlertDescription>
          Pour les questions complexes ou les problèmes de compte, vous pouvez contacter directement notre équipe de support par e-mail à l'adresse suivante :{' '}
          <a href="mailto:support@smart-etudes.com" className="font-semibold text-primary underline">
            support@smart-etudes.com
          </a>
        </AlertDescription>
      </Alert>

      <ChatInterface />
    </div>
  );
}
