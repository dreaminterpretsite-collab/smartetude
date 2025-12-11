'use client';

import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Moon, Laptop } from 'lucide-react';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();

    const themes = [
        { name: 'light', label: 'Clair', icon: Sun },
        { name: 'dark', label: 'Sombre', icon: Moon },
        { name: 'system', label: 'Système', icon: Laptop },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Paramètres</h1>
            <Card className="max-w-md">
                <CardHeader>
                    <CardTitle>Thème de l'application</CardTitle>
                    <CardDescription>
                        Choisissez l'apparence de l'application. Le mode "Système" suivra les préférences de votre appareil.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        {themes.map((t) => (
                            <Button
                                key={t.name}
                                variant={theme === t.name ? 'default' : 'outline'}
                                onClick={() => setTheme(t.name as 'light' | 'dark' | 'system')}
                                className="flex flex-col h-24"
                            >
                                <t.icon className="h-6 w-6 mb-2" />
                                {t.label}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
