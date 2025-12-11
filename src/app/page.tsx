import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, BookOpen, BrainCircuit, Award } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';

const heroImage = placeholderImages.placeholderImages.find(p => p.id === "hero-image");
const feature1Image = placeholderImages.placeholderImages.find(p => p.id === "feature-1");
const feature2Image = placeholderImages.placeholderImages.find(p => p.id === "feature-2");
const feature3Image = placeholderImages.placeholderImages.find(p => p.id === "feature-3");
const feature4Image = placeholderImages.placeholderImages.find(p => p.id === "feature-4");


export default function Home() {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-accent" />,
      title: "Solution Instantanée",
      description: "Prenez une photo de votre exercice et recevez une solution détaillée en quelques secondes.",
      image: feature1Image
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-accent" />,
      title: "Pédagogie Interactive",
      description: "Nos solutions ne donnent pas seulement la réponse, elles expliquent chaque étape pour une vraie compréhension.",
      image: feature2Image
    },
    {
      icon: <BookOpen className="h-8 w-8 text-accent" />,
      title: "Ressources Complètes",
      description: "Accédez à des fiches de cours et des résumés pour toutes les matières de votre niveau.",
      image: feature3Image
    },
    {
      icon: <Award className="h-8 w-8 text-accent" />,
      title: "Préparation aux Examens",
      description: "Entraînez-vous avec d'anciens sujets du BAC et du BEPC pour être prêt le jour J.",
      image: feature4Image
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="sr-only">Smart Études CI</span>
          <span className="ml-2 text-xl font-bold font-headline">
            <span className="text-accent">Smart</span> Études <span className="text-accent">CI</span>
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Se connecter
          </Link>
          <Button asChild>
            <Link href="/signup" prefetch={false}>S'inscrire</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full pt-24 md:pt-32 lg:pt-40 relative">
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <div className="container px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16 items-center">
              <div>
                <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem] font-headline">
                  Photographie ton exercice, <span className="text-primary">nous t’expliquons tout pas à pas !</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
                  Débloquez votre potentiel. Smart Études CI est votre tuteur personnel, disponible 24/7 pour vous aider à maîtriser chaque concept.
                </p>
                <div className="space-x-4 mt-6">
                  <Button asChild size="lg" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                    <Link href="/signup" prefetch={false}>Commencer Gratuitement</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="#features" prefetch={false}>Découvrir</Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                 {heroImage && (
                    <Image
                      src={heroImage.imageUrl}
                      width={600}
                      height={400}
                      alt={heroImage.description}
                      data-ai-hint={heroImage.imageHint}
                      className="mx-auto aspect-[3/2] overflow-hidden rounded-xl object-cover shadow-2xl"
                    />
                 )}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm border">Fonctionnalités Clés</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Conçu pour votre Réussite</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Des outils puissants et intuitifs pour vous accompagner à chaque étape de votre apprentissage.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4 mt-12">
              {features.map((feature, index) => (
                <Card key={index} className="h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                  <CardHeader className="flex flex-col items-center text-center p-6">
                    {feature.image && (
                      <Image
                        src={feature.image.imageUrl}
                        width={400}
                        height={250}
                        alt={feature.image.description}
                        data-ai-hint={feature.image.imageHint}
                        className="mb-4 rounded-lg aspect-video object-cover"
                      />
                    )}
                    {feature.icon}
                    <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center p-6 pt-0">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Prêt à Transformer Votre Façon d'Étudier ?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Inscrivez-vous maintenant et recevez 1000 FCFA de bonus pour essayer notre solveur d'exercices.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
               <Button asChild size="lg" className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                <Link href="/signup" prefetch={false}>Créer un compte</Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                Rejoignez des milliers d'élèves qui excellent déjà.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Smart Études CI. Tous droits réservés.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/rules" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Règlement
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Politique de confidentialité
          </Link>
        </nav>
      </footer>
    </div>
  );
}
