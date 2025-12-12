'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface ContentViewerProps {
  content: { url: string; type: 'pdf' | 'video' } | null;
  onOpenChange: (open: boolean) => void;
}

export function ContentViewer({ content, onOpenChange }: ContentViewerProps) {
  const isOpen = content !== null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Aperçu du Contenu</DialogTitle>
          <DialogDescription>
            {content?.type === 'pdf' ? 'Document PDF' : 'Lecteur Vidéo'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 w-full h-full">
          {content?.type === 'pdf' && (
            <iframe
              src={content.url}
              className="w-full h-full border-0"
              title="Aperçu PDF"
              allow="fullscreen"
            ></iframe>
          )}
          {content?.type === 'video' && (
            <div className='w-full h-full flex items-center justify-center bg-black rounded-md'>
                <p className='text-white'>Le lecteur vidéo sera bientôt disponible.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
