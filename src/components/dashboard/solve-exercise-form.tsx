'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createId } from '@paralleldrive/cuid2';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Camera, Upload, Video, RefreshCw, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useFirebase } from '@/firebase/client-provider';
import { updateDoc, addDoc, collection, doc, increment } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { solveExerciseFromPhoto } from '@/ai/flows/solve-exercise-from-photo';

const EXERCISE_COST = 200;

const formSchema = z.object({
    subject: z.string({ required_error: 'Veuillez sélectionner une matière.' }),
    image: z
      .custom<FileList>()
      .refine((files) => files?.length === 1, 'Veuillez sélectionner une image.')
      .refine((files) => files?.[0]?.type.startsWith('image/'), 'Seuls les fichiers image sont autorisés.')
      .refine((files) => files?.[0].size <= 10 * 1024 * 1024, 'La taille de l\'image ne doit pas dépasser 10MB.'),
});

function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
}

export function SolveExerciseForm() {
    const router = useRouter();
    const { user, userProfile } = useAuth();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('upload');
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (activeTab !== 'camera') {
            stopCamera();
            return;
        }

        const getCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            setHasCameraPermission(true);
    
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Accès Caméra Refusé',
              description: 'Veuillez autoriser l\'accès à la caméra dans les paramètres de votre navigateur.',
            });
          }
        };
    
        getCameraPermission();

        return () => {
            stopCamera();
        };
    }, [activeTab, toast]);

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue('image', e.target.files as FileList, { shouldValidate: true });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            
            const dataUrl = canvas.toDataURL('image/jpeg');
            setPreview(dataUrl);

            canvas.toBlob(blob => {
                if (blob) {
                    const file = new File([blob], `${createId()}.jpg`, { type: 'image/jpeg' });
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    form.setValue('image', dataTransfer.files, { shouldValidate: true });
                }
            }, 'image/jpeg');
        }
    };
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user || !userProfile) {
            toast({ variant: 'destructive', title: 'Erreur', description: 'Vous devez être connecté.' });
            return;
        }

        if (userProfile.solde < EXERCISE_COST) {
            toast({ variant: 'destructive', title: 'Solde insuffisant', description: 'Veuillez recharger votre compte.' });
            router.push('/payment');
            return;
        }

        setLoading(true);

        try {
            const photoDataUri = await fileToDataUrl(values.image[0]);

            const aiResult = await solveExerciseFromPhoto({
              photoDataUri,
              subject: values.subject,
            });

            if (!aiResult.solution) {
                throw new Error("Notre système n'a pas pu générer de solution.");
            }
            
            const exerciseDocRef = await addDoc(collection(firestore, 'users', user.uid, 'exercises'), {
                userProfileId: user.uid,
                subject: values.subject,
                imageUri: photoDataUri,
                submissionDate: Date.now(),
                solution: aiResult.solution,
            });

            const userDocRef = doc(firestore, 'users', user.uid);
            await updateDoc(userDocRef, {
                solde: increment(-EXERCISE_COST),
            });
            
            toast({ title: 'Succès!', description: 'Solution générée. Redirection...' });
            
            router.push(`/solution/${exerciseDocRef.id}`);

        } catch (e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Une erreur est survenue', description: e.message || "Impossible de résoudre l'exercice." });
        } finally {
            setLoading(false);
        }
    }

    const isSubmitDisabled = loading || !userProfile || userProfile.solde < EXERCISE_COST || !form.formState.isValid;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload"><Upload className="w-4 h-4 mr-2" />Téléverser</TabsTrigger>
                        <TabsTrigger value="camera"><Video className="w-4 h-4 mr-2" />Appareil Photo</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload">
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="sr-only">Image de l'exercice</FormLabel>
                                    <FormControl>
                                        <div className={`relative flex justify-center w-full h-64 border-2 border-dashed rounded-lg group transition-colors ${fieldState.error ? 'border-destructive' : 'border-input'}`}>
                                            {preview ? (
                                                <Image src={preview} alt="Aperçu" fill className="object-contain rounded-lg p-2" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                                    <Camera className="w-12 h-12 mb-2"/>
                                                    <p className="font-semibold">Cliquez pour téléverser</p>
                                                    <p className="text-xs">Ou glissez-déposez une image</p>
                                                </div>
                                            )}
                                            <Input 
                                                type="file" 
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
                            <div className="relative w-full aspect-video border rounded-lg overflow-hidden bg-black flex items-center justify-center">
                                <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                                <canvas ref={canvasRef} className="hidden" />
                                {hasCameraPermission === false && (
                                    <Alert variant="destructive" className="w-auto m-4">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>Caméra inaccessible</AlertTitle>
                                        <AlertDescription>Vérifiez les permissions.</AlertDescription>
                                    </Alert>
                                )}
                                {preview && (
                                    <Image src={preview} alt="Aperçu de la capture" fill className="object-contain p-1"/>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button type="button" onClick={handleCapture} disabled={!hasCameraPermission || loading} className="w-full">
                                    <Camera className="w-4 h-4 mr-2" /> Capturer
                                </Button>
                                {preview && (
                                    <Button type="button" variant="outline" size="icon" onClick={() => setPreview(null)}><RefreshCw /></Button>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez la matière de l'exercice" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                                <SelectItem value="Physique-Chimie">Physique-Chimie</SelectItem>
                                <SelectItem value="SVT">Sciences de la Vie et de la Terre</SelectItem>
                                <SelectItem value="Français">Français</SelectItem>
                                <SelectItem value="Anglais">Anglais</SelectItem>
                                <SelectItem value="Allemand">Allemand</SelectItem>
                                <SelectItem value="Espagnol">Espagnol</SelectItem>
                                <SelectItem value="Histoire-Géographie">Histoire-Géographie</SelectItem>
                                <SelectItem value="Autre">Autre</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitDisabled}>
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