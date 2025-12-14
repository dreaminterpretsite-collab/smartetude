'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Loader2, User, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

const chatSchema = z.object({
    message: z.string().min(1, 'Le message ne peut pas être vide'),
});

export function ChatInterface() {
    const { userProfile } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Bonjour! Je suis Clara, l\'assistante virtuelle de Smart Études. Comment puis-je vous aider?' }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const form = useForm<z.infer<typeof chatSchema>>({
        resolver: zodResolver(chatSchema),
        defaultValues: { message: '' },
    });
    
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    async function onSubmit(values: z.infer<typeof chatSchema>) {
        setLoading(true);
        const userMessage: Message = { role: 'user', content: values.message };
        
        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);
        form.reset();

        try {
            const result = await getSupportChatResponse({ messages: currentMessages.slice(-6) }); // Keep context manageable
            
            if (!result.response) {
                throw new Error("La réponse du support a échoué.");
            }

            const assistantMessage: Message = { role: 'assistant', content: result.response };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error: any) {
            console.error(error);
            const errorMessage: Message = { role: 'assistant', content: error.message || 'Désolé, une erreur est survenue. Veuillez réessayer.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    }
    
    const getInitials = (name: string | undefined) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <Card className="flex-1 flex flex-col">
            <CardContent className="flex-1 flex flex-col p-4">
                <ScrollArea className="flex-grow pr-4 -mr-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                {msg.role === 'assistant' && (
                                    <Avatar className='border'>
                                        <AvatarFallback><Bot className='h-5 w-5' /></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <p className="text-sm">{msg.content}</p>
                                </div>
                                {msg.role === 'user' && (
                                    <Avatar className='border'>
                                        <AvatarFallback>{getInitials(userProfile?.name)}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                         {loading && (
                            <div className="flex items-start gap-3">
                                <Avatar className='border'>
                                    <AvatarFallback><Bot className='h-5 w-5' /></AvatarFallback>
                                </Avatar>
                                <div className="max-w-xs md:max-w-md p-3 rounded-lg bg-muted flex items-center">
                                   <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2 pt-4 border-t">
                    <Input {...form.register('message')} placeholder="Tapez votre message..." autoComplete="off" disabled={loading} />
                    <Button type="submit" size="icon" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
