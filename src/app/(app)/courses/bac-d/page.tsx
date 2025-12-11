'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Download, Lock, Unlock } from 'lucide-react';
import { useState } from 'react';
import { ContentViewer } from '@/components/content-viewer';

const bacSubjectsByYear = [
    { year: '2019', subjects: [ { name: 'SVT', href: 'https://drive.google.com/file/d/1ivGSJGli_5rBh9TONRU3oM15MLhbpkPp/preview' }, { name: 'Physique-Chimie', href: 'https://drive.google.com/file/d/1Q7bpTNNaURGXgVxVbisYUGqKR2lC77Mh/preview' }, { name: 'Philosophie', href: 'https://drive.google.com/file/d/1_65qtIkumNecO2eP0We9MvCCf8dJw669/preview' }, { name: 'Mathématiques', href: 'https://drive.google.com/file/d/1hU0MSM3mDYwJgK5bGfv1HV6mZvLr5c_n/preview' } ] },
    { year: '2018', subjects: [ { name: 'SVT', href: 'https://drive.google.com/file/d/17_NO5Y9tdpK8C70CyxH4ojwHJqEJxa-r/preview' }, { name: 'Physique-Chimie', href: 'https://drive.google.com/file/d/1QbBPDmo20uo8brpJX8njWQkwDxIlI79w/preview' }, { name: 'Philosophie', href: 'https://drive.google.com/file/d/1-X7aGwXdVHpKG_0K_uUecHnheDtE57Q_/preview' }, { name: 'Mathématiques', href: 'https://drive.google.com/file/d/1eSHcy3OyGlVbfWl_lOYH3Gtsl_0f1qzp/preview' } ] },
    { year: '2017', subjects: [ { name: 'SVT', href: 'https://drive.google.com/file/d/1j6LeWXOzU-6h8B1ls1bRUF6yPSboOoRH/preview' }, { name: 'Physique-Chimie', href: 'https://drive.google.com/file/d/1SpTZe3_N6Wq4x0mLQlSMkX8sKrGytcd6/preview' }, { name: 'Philosophie', href: 'https://drive.google.com/file/d/1i3DyiHeWMZRwNiqju1BuQiXNH2ihcgXg/preview' }, { name: 'Mathématiques', href: 'https://drive.google.com/file/d/1UjSqqJkQ7ZA9Zl7EiEGhnlizIHj9vmgW/preview' } ] },
    { year: '2016', subjects: [ { name: 'SVT', href: 'https://drive.google.com/file/d/1UUksmm3_cHyNRyhbk2flwc06K2qlk7Q9/preview' }, { name: 'Physique-Chimie', href: 'https://drive.google.com/file/d/1tlvcLEaV02O_9Ft8nhaKJMk0PDGg8n4S/preview' }, { name: 'Philosophie', href: 'https://drive.google.com/file/d/1HmfNshONQP3koNfNFgthfDLiBz4voAr7/preview' }, { name: 'Mathématiques', href: 'https://drive.google.com/file/d/1YL69OYSUbEdXyYva-J0fxLWlmtEP-gL9/preview' } ] },
    { year: '2015', subjects: [ { name: 'SVT', href: 'https://drive.google.com/file/d/1n7xGuWP4aWfGWcYkf7FpFLxG89kBwf_8/preview' }, { name: 'Physique-Chimie', href: 'https://drive.google.com/file/d/1pqH6zGaxRkrPZhrOEdlwuC_1fVzkUZq2/preview' }, { name: 'Philosophie', href: 'https://drive.google.com/file/d/1yQgNO8xAQQ_6V6SnXeio-qLQ6A9rGTtb/preview' }, { name: 'Mathématiques', href: 'https://drive.google.com/file/d/1sKg_pUrWMDhbIoUDE_LZ8WrHqXNw03yR/preview' } ] },
    { year: '2014', subjects: [ { name: 'SVT', href: 'https://drive.google.com/file/d/1f7QQyPyTIzEU2B-lCDAaWsmFmqDaJJwo/preview' }, { name: 'Physique-Chimie', href: 'https://drive.google.com/file/d/12u7etTdGYD39ke2T32mfpxQX3EpiNmgi/preview' }, { name: 'Philosophie', href: 'https://drive.google.com/file/d/1uUka9JP8gaccqceKz69SM_RBGPOywMUH/preview' }, { name: 'Mathématiques', href: 'https://drive.google.com/file/d/1sXFtOOYZk2xM1uHcsT687NvwwLp2p6sf/preview' } ] },
    { year: '2013', subjects: [ { name: 'SVT', href: 'https://drive.google.com/file/d/1Z4vdanYZ741Rg0ww26raKgR1LBwLoWrf/preview' }, { name: 'Physique-Chimie', href: 'https://drive.google.com/file/d/1020ozYgIoctUcy39rzr3Y-w2Fh-NkkkW/preview' }, { name: 'Philosophie', href: 'https://drive.google.com/file/d/16TmHQkR6nTNiVsrpeRjEaKUI5Hn8UWt3/preview' }, { name: 'Mathématiques', href: 'https://drive.google.com/file/d/1vbmOu4O1fH5h5FindS0n4d0X_4FkY5p1/preview' } ] },
    { year: '2012', subjects: [ { name: 'SVT', href: 'https://drive.google.com/file/d/1PHQfe-Y6ewcpsNEM5bjUJQZdSvnUVKfL/preview' }, { name: 'Physique-Chimie', href: 'https://drive.google.com/file/d/1Q5GJicZEYKpZXVOxyeE7KyW2g-JYNOhx/preview' }, { name: 'Philosophie', href: 'https://drive.google.com/file/d/1IfkH3CTmyd3blbdUoarDHQQT-ETTCiA1/preview' }, { name: 'Mathématiques', href: 'https://drive.google.com/file/d/1QKz43RUDKgViBsX2dDUPmiXyAzhjrsvp/preview' } ] },
    { year: '2011', subjects: [ { name: 'SVT', href: 'https://drive.google.com/file/d/1i2Nj2OkgWPIyfOO_7-KJVm1gvGGSpM49/preview' }, { name: 'Physique-Chimie', href: 'https://drive.google.com/file/d/1UA7LXnYLJHzgLtujSwBCxIMWq_Xol4Gz/preview' }, { name: 'Philosophie', href: 'https://drive.google.com/file/d/1GsbzkuZPGQFbIjZuJtC3dFqANnNCF7v7/preview' }, { name: 'Mathématiques', href: 'https://drive.google.com/file/d/1XtdMhCsEeSjZjiiOKYfZkKxEHhwUE7Hk/preview' } ] },
    { year: '2010', subjects: [ { name: 'SVT', href: 'https://drive.google.com/file/d/1TSGqWRYLHSQKtwatXbU11Dx2oezG7mmU/preview' }, { name: 'Physique', href: 'https://drive.google.com/file/d/1FwyniNcXpX85Rj33wnFV4WPlyG7turvw/preview' }, { name: 'Mathématiques', href: 'https://drive.google.com/file/d/1cUE_0gReZG9Zzc5368M2XWJP1jxmjI1S/preview' } ] },
    { year: '2009', subjects: [ { name: 'SVT', href: 'https://drive.google.com/file/d/1B87G27iz4PNwgu2_B45G6r84A1qh0qi9/preview' }, { name: 'Physique-Chimie', href: 'https://drive.google.com/file/d/10n7FLC0ET8ITB_r8Tq8sgZo4gBFyJXAk/preview' }, { name: 'Philosophie', href: 'https://drive.google.com/file/d/12L19IIOtknrN3Dskqm_cwNlBhhkAJjBV/preview' }, { name: 'Mathématiques', href: 'https://drive.google.com/file/d/1JpM1OIkVvjAnyTVaH_4dXKv8fdtocySH/preview' } ] },
    { year: '2008', subjects: [ { name: 'SVT', href: 'https://drive.google.com/file/d/1c66FzrFeAEY3iGpsy5BxkmQDJTA9Ert8/preview' }, { name: 'Physique-Chimie', href: 'https://drive.google.com/file/d/1HF9-yud8cSWQu3uOCU3Bromwbj6jusgk/preview' }, { name: 'Philosophie', href: 'https://drive.google.com/file/d/11l-LSFsftGkAbMo30w2FVHyc9WcsLCjc/preview' } ] },
    { year: '2007', subjects: [ { name: 'SVT', href: 'https://drive.google.com/file/d/1YaWdFxDxj4kAMj580X2nn-Kt3qxdjagY/preview' }, { name: 'Physique-Chimie', href: 'https://drive.google.com/file/d/1w_IRlMdQIlIKoWKo8vFgeT1iqb8gdDsw/preview' }, { name: 'Philosophie', href: 'https://drive.google.com/file/d/1DHokmZWS401LDb3JILne-GpQUImZIGmd/preview' } ] },
];


export default function BacDPage() {
  const { userProfile, hasCourseAccess } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' } | null>(null);
  const hasAccess = hasCourseAccess && userProfile?.className === 'terminale';

  const handleLockedContent = () => {
    if (!userProfile) return;
    let message = "Vous n'avez pas accès à ce contenu.";
    if (!hasCourseAccess) {
        message = "Veuillez débloquer l'accès aux cours depuis votre tableau de bord.";
    } else if (userProfile.className !== 'terminale') {
        message = "Ce contenu est réservé aux élèves de Terminale.";
    }
    
    toast({
        title: 'Accès non autorisé',
        description: message,
        variant: 'destructive',
    });
  };

  const openViewer = (url: string) => {
    if (url === '#') {
      toast({
        title: 'Contenu Indisponible',
        description: 'Cette ressource n\'est pas encore disponible.',
      });
      return;
    }
    setViewerContent({ url, type: 'pdf' });
  };


  return (
    <div className="space-y-6">
       <ContentViewer 
        content={viewerContent} 
        onOpenChange={(isOpen) => !isOpen && setViewerContent(null)}
      />
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Anciens Sujets du BAC Série D
        </h1>
        <p className="text-muted-foreground">
          Entraînez-vous avec les sujets des années précédentes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {hasAccess ? (
              <Unlock className="h-5 w-5 text-green-500" />
            ) : (
              <Lock className="h-5 w-5 text-red-500" />
            )}
            Sujets par Année
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {bacSubjectsByYear.map((item) => (
              <AccordionItem key={item.year} value={item.year}>
                <AccordionTrigger className="text-lg font-bold">
                  Année {item.year}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {item.subjects.map((subject) => (
                      <Button
                        key={subject.name}
                        disabled={!hasAccess}
                        variant="outline"
                        onClick={() => hasAccess ? openViewer(subject.href) : handleLockedContent()}
                      >
                          <Download className="mr-2 h-4 w-4" />
                          {subject.name}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
