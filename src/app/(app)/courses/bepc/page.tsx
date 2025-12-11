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

const bepcSubjectsByYear = [
  {
    year: '2018',
    subjects: [
      { name: 'Allemand LV2', href: '#' },
      { name: 'Anglais LV1', href: '#' },
      { name: 'AP', href: '#' },
      { name: 'EDHC', href: '#' },
      { name: 'EM', href: '#' },
      { name: 'Espagnol LV2', href: '#' },
      { name: 'Français', href: '#' },
      { name: 'HG', href: '#' },
      { name: 'Mathématiques', href: '#' },
      { name: 'Orthographe', href: '#' },
      { name: 'PC', href: '#' },
      { name: 'SVT', href: '#' },
    ],
  },
  {
    year: '2017',
    subjects: [
      { name: 'SVT', href: 'https://drive.google.com/file/d/16hFLeWUG5chkjeZaBTAfbttEIQM-cd1C/preview' },
      { name: 'PC', href: 'https://drive.google.com/file/d/1_BGebyUk4de-Polo4G4RYvtzhrR9Wa-Q/preview' },
      { name: 'Orthographe', href: 'https://drive.google.com/file/d/1HqjbAETJNCrNjDrei40zv7aJOKjSoFnx/preview' },
      { name: 'Mathématiques', href: 'https://drive.google.com/file/d/1IDsF1UdlA9yECq3Ofvs9HiEOVnZMNXB5/preview' },
      { name: 'HG', href: 'https://drive.google.com/file/d/1j6xqtx5VQvOLOj_umC0RZvjgPLltxzzA/preview' },
      { name: 'Français', href: 'https://drive.google.com/file/d/1JmNZoniyBOVqbjpAY9c9PDebOGR6Dj3W/preview' },
      { name: 'Espagnol LV2', href: 'https://drive.google.com/file/d/1oFAmyOM8VewAZcIYwGAbMENejZeeu4V9/preview' },
      { name: 'EM', href: 'https://drive.google.com/file/d/1ZtzLejl5rdTNIrPa1rthXz-NtRZE013P/preview' },
      { name: 'EDHC', href: 'https://drive.google.com/file/d/1zkzkJ8qk6h8id5yJKjqN2-8fd2Tst5yt/preview' },
      { name: 'AP', href: 'https://drive.google.com/file/d/1dARASn4-JCCd1ah6a75FGVf42uSwgetD/preview' },
      { name: 'Anglais LV1', href: 'https://drive.google.com/file/d/1EUdAvT4eHL0Q90yL8WnLfY_OYhUDeEeB/preview' },
      { name: 'Allemand LV2', href: 'https://drive.google.com/file/d/1x4q9FpwHyerCE1T--4E4max3t72kDVAU/preview' },
    ],
  },
  {
    year: '2016',
    subjects: [
      { name: 'SVT', href: 'https://drive.google.com/file/d/1c4gCJ7AhZAtN9o-frv8f3-L5W4tRHO4t/preview' },
      { name: 'PC', href: 'https://drive.google.com/file/d/1cfIZzaPTB2HAotGqvrYUiKyRXU6M-7Wd/preview' },
      { name: 'Orthographe', href: 'https://drive.google.com/file/d/1TIbBhRGZbYxsXkUgUOkXGlgCDSzMTOMO/preview' },
      { name: 'Mathématiques', href: 'https://drive.google.com/file/d/1uPxSZagFRiTv8UhOk7p5K-npRnFUEpxe/preview' },
      { name: 'HG', href: 'https://drive.google.com/file/d/1FrFXic0NykFz2XCsAmlC5Nxv3QbwxXk-/preview' },
      { name: 'Français', href: 'https://drive.google.com/file/d/1MgZ4hdDUOhz60v2WhY3iE2Vz8Q2DweB2/preview' },
      { name: 'Espagnol LV2', href: 'https://drive.google.com/file/d/1hdCTv2CBvQJmx8W02fSA-eY_5vLC1mRa/preview' },
      { name: 'EM', href: 'https://drive.google.com/file/d/1AiCylfVKj4R_bQatw64SSdZsWiZRRZGv/preview' },
      { name: 'EDHC', href: 'https://drive.google.com/file/d/10cDelRfVxoWjjqbkpGPDaGgMvasFH2Wh/preview' },
      { name: 'AP', href: 'https://drive.google.com/file/d/1m0-xZ53raYUVRKcgt1au3K6KD_1Lnyj6/preview' },
      { name: 'Anglais LV1', href: 'https://drive.google.com/file/d/1pRBpVCSKEXAvfKM5VXiSstQx-FceFbYm/preview' },
      { name: 'Allemand LV2', href: 'https://drive.google.com/file/d/1uk5Wp5V_zz_1TBx52M967ZSoZ6ZRMqjx/preview' },
    ],
  },
  {
    year: '2015',
    subjects: [
      { name: 'PC', href: 'https://drive.google.com/file/d/1flbHXkAmAt-xhYwQlMdZVyNCc2cxQ29M/preview' },
      { name: 'Orthographe', href: 'https://drive.google.com/file/d/1GRthhNeb3VQn2AIZfvkgOX2bfpexEPRF/preview' },
      { name: 'Mathématiques', href: 'https://drive.google.com/file/d/1QH9Lde0fGmJQB4CDgg6aQH7lTa7Qe_pJ/preview' },
      { name: 'HG', href: 'https://drive.google.com/file/d/1OVX5GyXHLly2vjYdFEVgS7RuJcmrYMg9/preview' },
      { name: 'Français', href: 'https://drive.google.com/file/d/17J_APMNSfNyF_ebMEMiMNh9B7AZWPxP-/preview' },
      { name: 'Espagnol LV2', href: 'https://drive.google.com/file/d/1epIWBNZ1ZjKAxV3cHOqmHaAMHWf0iM8_/preview' },
      { name: 'EM', href: 'https://drive.google.com/file/d/1LSiRXLbaZ0GKo82TSEwfePLetInq_3GM/preview' },
      { name: 'EDHC', href: 'https://drive.google.com/file/d/1ZUQByNhFNeGVmDYfgOc44Brn0IGDbP3S/preview' },
      { name: 'AP', href: 'https://drive.google.com/file/d/1798nlMpAL-BaXo1bHB3TkKf_vJ28-Ch0/preview' },
      { name: 'Anglais LV1', href: 'https://drive.google.com/file/d/1cjUfRlen1U3BSVTugL1Y6MdlmxBA6XTy/preview' },
    ],
  },
  {
    year: '2014',
    subjects: [
      { name: 'SVT', href: 'https://drive.google.com/file/d/1Hkfvz5wluScupAK6ifAKeQhRjsVNRHtr/preview' },
      { name: 'PC', href: 'https://drive.google.com/file/d/1n8DW4pbZF_Em9uBvQuVx1rKUUIcrif9s/preview' },
      { name: 'Orthographe', href: 'https://drive.google.com/file/d/1UyYCUrCgPIwSgvV1c7wZUCJxFB-LsW9I/preview' },
      { name: 'Mathématiques', href: 'https://drive.google.com/file/d/1W14BJ89tTdvftoq0DuIrEd9cetTxbaKi/preview' },
      { name: 'Espagnol LV2', href: 'https://drive.google.com/file/d/186kGTIqVIjjHn4UvxlUoTA6S2kW0ajm9/preview' },
      { name: 'EM', href: 'https://drive.google.com/file/d/1GdJntAEsdDi9dB6QUZZciPUAP-lovjdD/preview' },
      { name: 'EDHC', href: 'https://drive.google.com/file/d/1JKnSMinDSPYSqf-cPLowvBZJBgVrkMbp/preview' },
      { name: 'AP', href: 'https://drive.google.com/file/d/1qLFOraZM9cOYdeL5BX4Xac0G-0U3Id-6/preview' },
      { name: 'Anglais LV1', href: 'https://drive.google.com/file/d/1z3ccvb1hEJ7jn8U5QoxzQALxA8YX2p_5/preview' },
    ],
  },
  {
    year: '2013',
    subjects: [
      { name: 'PC', href: 'https://drive.google.com/file/d/10VnEkkLPUBPWAp9lLCy5d0lNKaXBiStX/preview' },
      { name: 'Orthographe', href: 'https://drive.google.com/file/d/16_FzUQKS9N2MFBqriob_ZAWQnyqTMCEb/preview' },
      { name: 'Mathématiques', href: 'https://drive.google.com/file/d/10oJIWP-qvE0_iTqhKu1K8Bu9vaFYsgzo/preview' },
      { name: 'Français', href: 'https://drive.google.com/file/d/1dOZIvaFhuW7BERL09pvvYli0TdAgYo2G/preview' },
      { name: 'AP', href: 'https://drive.google.com/file/d/1bMQZPXVa2Mp7Rw7fz8aa_iHKKaVR0dX4/preview' },
      { name: 'Anglais LV1', href: 'https://drive.google.com/file/d/1PVacNj2Y8JbRhIv-y-dAJ6joF_S_-XWo/preview' },
    ],
  },
];

export default function BepcPage() {
  const { userProfile, hasCourseAccess } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' } | null>(null);
  const hasAccess = hasCourseAccess && userProfile?.className === 'troisieme';

  const handleLockedContent = () => {
    if (!userProfile) return;
    let message = "Vous n'avez pas accès à ce contenu.";
    if (!hasCourseAccess) {
        message = "Veuillez débloquer l'accès aux cours depuis votre tableau de bord.";
    } else if (userProfile.className !== 'troisieme') {
        message = "Ce contenu est réservé aux élèves de Troisième.";
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
        title: 'Contenu Bientôt Disponible',
        description: 'Les liens pour ce sujet seront bientôt disponibles.',
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
          Anciens Sujets du BEPC
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
            {bepcSubjectsByYear.map((item) => (
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
