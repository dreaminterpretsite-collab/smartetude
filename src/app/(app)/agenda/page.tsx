'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Bell, BellOff, BellRing, AlarmClockCheck } from 'lucide-react';
import { format, set } from 'date-fns';

const agendaSchema = z.object({
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Heure invalide (format HH:mm)"),
});

export default function AgendaPage() {
  const { toast } = useToast();
  const [reminder, setReminder] = useState<NodeJS.Timeout | null>(null);
  const [reminderTime, setReminderTime] = useState<Date | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const form = useForm<z.infer<typeof agendaSchema>>({
    resolver: zodResolver(agendaSchema),
    defaultValues: { time: '' },
  });
  
  useEffect(() => {
    // Pré-charge l'audio pour éviter les délais
    audioRef.current = new Audio('/alarm.mp3');
    return () => {
      // Nettoie le timeout si le composant est démonté
      if (reminder) {
        clearTimeout(reminder);
      }
    };
  }, [reminder]);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({ title: "Notifications non supportées", description: "Votre navigateur ne supporte pas les notifications.", variant: 'destructive' });
      return false;
    }
    if (Notification.permission === 'granted') {
      return true;
    }
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        return true;
      }
    }
    toast({ title: 'Permission Refusée', description: 'Vous avez bloqué les notifications. Veuillez les activer dans les paramètres de votre navigateur.' });
    return false;
  };

  const onSubmit = async (values: z.infer<typeof agendaSchema>) => {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return;
    
    // Annule tout rappel précédent
    if (reminder) {
      clearTimeout(reminder);
    }
    
    const [hours, minutes] = values.time.split(':').map(Number);
    const now = new Date();
    let targetTime = set(now, { hours, minutes, seconds: 0, milliseconds: 0 });

    // Si l'heure est déjà passée aujourd'hui, programmer pour demain
    if (targetTime < now) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    const delay = targetTime.getTime() - now.getTime();
    
    const newReminder = setTimeout(() => {
      // Fait vibrer le téléphone (si supporté)
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 500]); // Vibre 2 fois puis une longue vibration
      }
      // Joue le son
      audioRef.current?.play().catch(e => console.error("Erreur lecture audio:", e));
      // Affiche la notification
      new Notification('⏰ C\'est l\'heure d\'étudier !', {
        body: 'Votre session d\'étude programmée commence maintenant. À vous de jouer !',
        icon: '/icon.png',
      });
      setReminder(null);
      setReminderTime(null);
    }, delay);

    setReminder(newReminder);
    setReminderTime(targetTime);
    form.reset();
    toast({
      title: 'Rappel Programmé !',
      description: `Vous recevrez une notification le ${format(targetTime, "dd/MM/yyyy 'à' HH:mm")}.`,
    });
  };
  
  const cancelReminder = () => {
    if (reminder) {
      clearTimeout(reminder);
      setReminder(null);
      setReminderTime(null);
      toast({ title: 'Rappel Annulé', description: 'Votre rappel a été supprimé.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Mon Agenda d'Étude</h1>
        <p className="text-muted-foreground">Programmez des rappels pour ne jamais manquer une session d'étude.</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlarmClockCheck className="h-6 w-6 text-primary"/>
            Programmer un Rappel
          </CardTitle>
          <CardDescription>
            Choisissez une heure pour recevoir une notification et une alerte sonore.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!reminderTime ? (
             <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heure du rappel</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  <Bell className="mr-2 h-4 w-4" />
                  Programmer le rappel
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-muted rounded-lg border border-primary/50">
                  <BellRing className="mx-auto h-12 w-12 text-primary" />
                  <p className="font-semibold mt-4">Prochain rappel programmé pour :</p>
                  <p className="text-xl font-bold text-primary">{format(reminderTime, 'HH:mm')}</p>
                  <p className="text-sm text-muted-foreground">Le {format(reminderTime, 'dd/MM/yyyy')}</p>
              </div>
              <Button onClick={cancelReminder} variant="destructive" className="w-full">
                <BellOff className="mr-2 h-4 w-4" />
                Annuler le rappel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <audio ref={audioRef} src="/alarm.mp3" preload="auto" className="hidden" />
    </div>
  );
}
