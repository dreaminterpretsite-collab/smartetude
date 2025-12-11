'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../ui/button';
import Link from 'next/link';
import { CreditCard, Bell, Info } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const { userProfile } = useAuth();
  
  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === undefined || amount === null) return '...';
    return new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount);
  };

  const balance = userProfile?.solde ?? 0;
  const EXERCISE_COST = 200;
  const isLowBalance = balance < EXERCISE_COST;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 p-2 rounded-md border bg-muted/50">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <span className={cn(
              "font-semibold text-sm",
              isLowBalance ? "text-destructive animate-pulse" : "text-green-600"
            )}>
              {formatCurrency(userProfile?.solde)}
            </span>
        </div>
        <Button variant="outline" size="sm" asChild style={{ backgroundColor: 'hsl(var(--accent))', color: 'white' }} className='hover:bg-accent/90'>
            <Link href="/payment">Recharger</Link>
        </Button>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='w-80'>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='flex items-start gap-3'>
                <Info className='h-4 w-4 mt-1 text-primary' />
                <div className="flex flex-col">
                  <span className="font-semibold">Bienvenue !</span>
                  <span className="text-sm text-muted-foreground">Votre bonus de 1000 FCFA a été ajouté.</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
