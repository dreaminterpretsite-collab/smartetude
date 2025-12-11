'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, FileText, Lock, Unlock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { trackCourseVisit, type CourseInfo } from '@/lib/course-visits';
import { useToast } from '@/hooks/use-toast';
import { ContentViewer } from '@/components/content-viewer';
import { useFirebase } from '@/firebase';

const courseInfo: CourseInfo = {
  id: 'anglais-troisieme',
  name: 'Anglais Troisième',
  url: '/courses/anglais-troisieme',
};

// A small component to handle the tracking logic
function CourseTracker() {
  const { firestore } = useFirebase();
  useEffect(() => {
    if (firestore) {
      trackCourseVisit(firestore, courseInfo);
    }
  }, [firestore]);
  return null;
}

const units = [
  {
    title: 'UNIT 1: SCHOOL LIFE',
    lessons: [
      { 
        title: 'Lesson 1: Speaking-Writing', 
        resources: [
          { type: 'pdf', href: 'https://drive.google.com/file/d/1WfVKRYq7slj9uWuBKvRrVUt58wdvfGcb/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/1sFkMnGq1uwvMNkMqXW32WnYUhBuKu38_/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/1UokWElWz2w5MBXOeeC6tAw-CKznxup_R/preview' }
        ]
      },
      { 
        title: 'Lesson 2: Speaking', 
        resources: [
          { type: 'pdf', href: 'https://drive.google.com/file/d/13UB4yaJRdmlPrWfQUFEylMAeeDkmhZyN/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/1jJ_EbARxNxxIHAq_6flsqs49PL0LhO74/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/1LlbJyVTG13rogyIHhF0Fk1Nb3wC1Uz2L/preview' }
        ]
      },
      { 
        title: 'Lesson 3: Speaking', 
        resources: [
          { type: 'pdf', href: 'https://drive.google.com/file/d/1YdSP5WFPHVtvraajZDX3vIU8ThQ6XBtJ/preview' }
        ]
      },
    ],
  },
  {
    title: 'UNIT 2: WOMEN AT WORK',
    lessons: [
      { 
        title: 'Lesson 1: Speaking', 
        resources: [] 
      },
      { 
        title: 'Lesson 2: Speaking', 
        resources: [
          { type: 'pdf', href: 'https://drive.google.com/file/d/1AXoEIbV_eoQTYcVDXeyHR8iIiydS-YPV/preview' }
        ]
      },
      { 
        title: 'Lesson 3: Speaking', 
        resources: [
          { type: 'pdf', href: 'https://drive.google.com/file/d/1voIR40zmLUQ8H8-iUOqc3jQ_gKTdOAVH/preview' },
          { type: 'pdf', href: 'https://drive.google.com/file/d/1uixSlWD_fYlSsSXizY2KV4qRFIRXpImv/preview' }
        ]
      },
    ],
  },
  {
    title: 'UNIT 3: TRAVELLING',
    lessons: [
      { 
        title: 'Lesson 1: Writing', 
        resources: [
          { type: 'pdf', href: 'https://drive.google.com/file/d/1L90NUf81OVH-zHmvrhJ6hRbHOynbCPBF/preview' }
        ]
      },
      { 
        title: 'Lesson 2: Writing', 
        resources: [
          { type: 'pdf', href: 'https://drive.google.com/file/d/1UGfdSRWy_g_CiLWK64kAIqS7wc2RnZwG/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/1wbCljpFZFn3xCBxaIs-ssO3DXnmQ_NHC/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/1mjfwnyYjsswfeVV078w65RNKWYVzHATY/preview' }
        ]
      },
      { 
        title: 'Lesson 3: Writing', 
        resources: [
          { type: 'pdf', href: 'https://drive.google.com/file/d/13Cw5RMaep6GCzg-KUr5izOX8Eh10J_ES/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/1U90nAOa5DMjJCNZT1KcHGsY8KCSx5Dtq/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/10RpJ85_w70csT5DzG0ZxmY_DF--1dyFo/preview' }
        ]
      },
    ],
  },
  {
    title: 'UNIT 4: FASHION AFRICA',
    lessons: [
      { 
        title: 'Lesson 1: Writing', 
        resources: [
          { type: 'pdf', href: 'https://drive.google.com/file/d/1Ry9jePCO_jQky7BfTN0WrRXw8sDcTYbf/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/1nWpH9UICQ-bPOEKNvh_WlEkUfJrA03ky/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/19psatN0ic33E4IWV4NOiKkuOLchiBZRV/preview' }
        ]
      },
      { 
        title: 'Lesson 2: Writing', 
        resources: [
          { type: 'pdf', href: 'https://drive.google.com/file/d/1EClQvbbSgs8136Uzp3Hzf46MfPtAd82e/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/1qXiVpUnXAU-IIgHGISdZDOQsVs42XY-u/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/1JwN8JCTcWo4nv5kXX_FYj4J5fs9r-ee8/preview' }
        ]
      },
      { 
        title: 'Lesson 3: Writing', 
        resources: [
          { type: 'pdf', href: 'https://drive.google.com/file/d/1c48rswG5Q2YBXmcwAv6Uy0_0ObHpZALR/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/1JicwoWon1IaJiA4iLkDvR_EAWzV8V78x/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/13NyeXjbSsx54EdQa9i9Ny5uoAiWtACUh/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/1tfiqaC0h2QCvq0ZGQrLJJM5rYVuURsoI/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/1CRv78tAbh2DrV-5DkO71OZ1yksgEswVV/preview' }
        ]
      },
    ],
  },
  {
    title: 'UNIT 5: CITY OR VILLAGE',
    lessons: [
      { 
        title: 'Lesson 1: Listening', 
        resources: [
          { type: 'pdf', href: 'https://drive.google.com/file/d/14M7hZY4-1GQvwu779D0Qikj4O-S9pApv/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/1N3_BOMYrnIM8vU4Qc4TXm0V7tSobc0wF/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/1JCsqXPDTYAFzvVmvgoXFzh9RQ8UCN0jw/preview' }
        ]
      },
      { 
        title: 'Lesson 2: Listening', 
        resources: [
          { type: 'pdf', href: 'https://drive.google.com/file/d/1qETD2BeLDwwm3FMgG3Ch_VZvbR2qj28Z/preview' }
        ]
      },
      { 
        title: 'Lesson 3: Listening', 
        resources: [
          { type: 'pdf', href: 'https://drive.google.com/file/d/1n-HYYTdL90hU4hJbV-mqMVgkzTUSi2qf/preview' }
        ]
      },
    ],
  },
  {
    title: 'UNIT 6: HUMAN RIGHTS',
    lessons: [
      { 
        title: 'Lesson 1: Speaking', 
        resources: [
          { type: 'pdf', href: 'https://drive.google.com/file/d/1-lKF_1UXVfujnQl_zdR0C2xfSJ5DfC05/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/1pFCXanoG6w6UtKlxqK03fcArbFN8hx0v/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/1IbiiRjzzY1fHjr6RzlVa_mOTmkbTkn4G/preview' }
        ]
      },
      { 
        title: 'Lesson 2: Listening', 
        resources: [
          { type: 'pdf', href: 'https://drive.google.com/file/d/1da4cuDhtLL8E9i0Rr7m4p3JVf8FypvhH/preview' }
        ]
      },
      { 
        title: 'Lesson 3: Listening', 
        resources: [
          { type: 'pdf', href: 'https://drive.google.com/file/d/1JiFp4yEHm9E1PQLVOukd2J1qRo25Wr5m/preview' }
        ]
      },
    ],
  },
  {
    title: 'UNIT 7: HYGIENE AND HEALTH',
    lessons: [
      { 
        title: 'Lesson 1: Reading', 
        resources: [
          { type: 'pdf', href: 'https://drive.google.com/file/d/1-cQKymoJKnzFhoHPXjIX_JbwMG2PQZyQ/preview' }
        ]
      },
      { 
        title: 'Lesson 3: Reading', 
        resources: [
          { type: 'pdf', href: 'https://drive.google.com/file/d/1__qXn98cZ3iRfftoEK4uRjQwBK5USF9g/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/1aB6CK0UgiU_2RWWs_HpHzgyVGvKhCgx4/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/1HU6TnhRomOmyUsIzqogcVt0gNiC5fhmX/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/1ZP053o7ZwH5a2IBa72HaLLyhwgB-328Z/preview' },
          { type: 'video', href: 'https://drive.google.com/file/d/15mkz4zPxwzv899ouuUiJ3BHrJR0Ew7Qr/preview' }
        ]
      },
    ],
  },
];

export default function AnglaisTroisiemePage() {
  const { userProfile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [viewerContent, setViewerContent] = useState<{ url: string; type: 'pdf' | 'video' } | null>(null);
  const hasAccess = isAdmin || (userProfile && userProfile.solde > 0 && userProfile.className === 'troisieme');

  const handleLockedContent = () => {
    if (!userProfile || hasAccess) return;
    if (userProfile.solde <= 0) {
      toast({
        title: 'Contenu Verrouillé',
        description:
          "Votre solde est épuisé. Veuillez recharger votre compte pour accéder à ce cours.",
        variant: 'destructive',
      });
    } else if (userProfile.className !== 'troisieme') {
      toast({
        title: 'Accès non autorisé',
        description: "Ce contenu est réservé aux élèves de Troisième. Veuillez vous connecter avec un compte correspondant.",
        variant: 'destructive',
      });
    }
  };

  const openViewer = (url: string, type: 'pdf' | 'video') => {
    if (url === '#') {
      toast({
        title: 'Contenu Indisponible',
        description: 'Cette ressource n\'est pas encore disponible.',
      });
      return;
    }
    setViewerContent({ url, type });
  };

  return (
    <div className="space-y-6">
      <CourseTracker />
      <ContentViewer 
        content={viewerContent} 
        onOpenChange={(isOpen) => !isOpen && setViewerContent(null)}
      />
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Troisième</p>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Anglais
        </h1>
        <p className="text-muted-foreground">
          Liste des leçons disponibles pour cette matière.
        </p>
      </div>

      <div className="space-y-8">
        {units.map((unit, unitIndex) => (
          <div key={unit.title}>
            <h2 className="font-headline text-2xl font-bold mb-4">{unit.title}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {unit.lessons.map((lesson, lessonIndex) => (
                <Card key={`${unitIndex}-${lessonIndex}`}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {hasAccess ? (
                        <Unlock className="h-5 w-5 text-green-500" />
                      ) : (
                        <Lock className="h-5 w-5 text-red-500" />
                      )}
                      <span>
                        <span className="font-bold text-accent">{lesson.title}</span>
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col space-y-2">
                    {lesson.resources.length > 0 ? (
                      lesson.resources.map((resource, resourceIndex) => (
                        <Button
                          key={resourceIndex}
                          variant="outline"
                          disabled={!hasAccess}
                          onClick={() => hasAccess ? openViewer(resource.href, resource.type as 'pdf' | 'video') : handleLockedContent()}
                        >
                          {resource.type === 'pdf' ? <FileText className="mr-2 h-4 w-4" /> : <Video className="mr-2 h-4 w-4" />}
                          {resource.type === 'pdf' ? 'Cours PDF' : `Vidéo ${resourceIndex + 1}`}
                        </Button>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Aucune ressource pour cette leçon.</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {unitIndex < units.length - 1 && <Separator className="my-8" />}
          </div>
        ))}
      </div>
    </div>
  );
}
