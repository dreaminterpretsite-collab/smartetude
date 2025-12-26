'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { useAuth } from '@/context/AuthContext';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Loader2,
  Camera,
  Upload,
  Video,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { useFirebase } from '@/firebase/client-provider';
import {
  updateDoc,
  addDoc,
  collection,
  doc,
  increment,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const EXERCISE_COST = 200;

/* ----------------------------- Schema ----------------------------- */

const formSchema = z.object({
  subject: z.string({
    required_error: 'Veuillez sélectionner une matière.',
  }),
  image: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'Veuillez sélectionner une image.')
    .refine(
      (files) => files?.[0]?.type.startsWith('image/'),
      'Seuls les fichiers image sont autorisés.',
    )
    .refine(
      (files) => files?.[0].size <= 10 * 1024 * 1024,
      "La taille de l'image ne doit pas dépasser 10MB.",
    ),
});

/* -------------------------- Utils -------------------------- */

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* -------------------------- Component -------------------------- */

export function SolveExerciseForm() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const [hasCameraPermission, setHasCameraPermission] =
    useState<boolean | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  /* -------------------------- Camera Logic -------------------------- */

  useEffect(() => {
    if (activeTab !== 'camera') {
      stopCamera();
      return;
    }

    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Camera error:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Accès caméra refusé',
          description:
            "Veuillez autoriser l'accès à la caméra dans votre navigateur.",
        });
      }
    };

    getCameraPermission();
    return () => stopCamera();
  }, [activeTab, toast]);

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current!.srcObject = null;
    }
  };

  /* -------------------------- Handlers -------------------------- */

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    form.setValue('image', e.target.files as FileList, {
      shouldValidate: true,
    });

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg');
    setPreview(dataUrl);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], `capture.jpg`, {
        type: 'image/jpeg',
      });

      const dt = new DataTransfer();
      dt.items.add(file);

      form.setValue('image', dt.files, { shouldValidate: true });
    }, 'image/jpeg');
  };

  /* -------------------------- Submit -------------------------- */

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !userProfile) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Vous devez être connecté.',
      });
      return;
    }

    if (userProfile.solde < EXERCISE_COST) {
      toast({
        variant: 'destructive',
        title: 'Solde insuffisant',
        description: 'Veuillez recharger votre compte.',
      });
      router.push('/payment');
      return;
    }

    setLoading(true);

    try {
      const photoDataUri = await fileToDataUrl(values.image[0]);

      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoDataUri,
          subject: values.subject,
        }),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la génération de la solution');
      }

      const aiResult: { solution: string } = await res.json();

      if (!aiResult.solution) {
        throw new Error("Aucune solution générée.");
      }

      const exerciseDocRef = await addDoc(
        collection(firestore, 'users', user.uid, 'exercises'),
        {
          userProfileId: user.uid,
          subject: values.subject,
          imageUri: photoDataUri,
          submissionDate: Date.now(),
          solution: aiResult.solution,
        },
      );

      await updateDoc(doc(firestore, 'users', user.uid), {
        solde: increment(-EXERCISE_COST),
      });

      toast({
        title: 'Succès 🎉',
        description: 'Solution générée. Redirection...',
      });

      router.push(`/solution/${exerciseDocRef.id}`);
    } catch (e: any) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description:
          e.message || "Impossible de résoudre l'exercice.",
      });
    } finally {
      setLoading(false);
    }
  }

  const isSubmitDisabled =
    loading ||
    !userProfile ||
    userProfile.solde < EXERCISE_COST ||
    !form.formState.isValid;

  /* -------------------------- UI -------------------------- */

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={(v) =>
            setActiveTab(v as 'upload' | 'camera')
          }
        >
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              Téléverser
            </TabsTrigger>
            <TabsTrigger value="camera">
              <Video className="w-4 h-4 mr-2" />
              Appareil photo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <FormField
              control={form.control}
              name="image"
              render={({ fieldState }) => (
                <FormItem>
                  <FormControl>
                    <div
                      className={`relative h-64 border-2 border-dashed rounded-lg ${
                        fieldState.error
                          ? 'border-destructive'
                          : 'border-input'
                      }`}
                    >
                      {preview ? (
                        <Image
                          src={preview}
                          alt="Aperçu"
                          fill
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                          <Camera className="w-12 h-12 mb-2" />
                          <p>Cliquez pour téléverser</p>
                        </div>
                      )}

                      <Input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageChange}
                        disabled={loading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="camera">
            <div className="space-y-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />

                {hasCameraPermission === false && (
                  <Alert
                    variant="destructive"
                    className="absolute inset-0 m-4"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Caméra inaccessible</AlertTitle>
                    <AlertDescription>
                      Vérifiez les permissions navigateur.
                    </AlertDescription>
                  </Alert>
                )}

                {preview && (
                  <Image
                    src={preview}
                    alt="Capture"
                    fill
                    className="object-contain"
                  />
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleCapture}
                  disabled={!hasCameraPermission || loading}
                  className="w-full"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Capturer
                </Button>

                {preview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setPreview(null)}
                  >
                    <RefreshCw />
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matière</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez la matière" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[
                    'Mathématiques',
                    'Physique-Chimie',
                    'SVT',
                    'Français',
                    'Anglais',
                    'Allemand',
                    'Espagnol',
                    'Histoire-Géographie',
                    'Autre',
                  ].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitDisabled}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            `Résoudre (Coût: ${EXERCISE_COST} FCFA)`
          )}
        </Button>
      </form>
    </Form>
  );
}
