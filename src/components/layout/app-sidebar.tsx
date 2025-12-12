'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Book,
  BotMessageSquare,
  Cog,
  DollarSign,
  History,
  LayoutDashboard,
  LogOut,
  Shield,
  User,
  Home,
  Briefcase,
  CalendarClock
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { useFirebase } from '@/firebase/client-provider';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useTheme } from '../theme-provider';

const menuItems = [
  { href: '/dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
  { href: '/courses', label: 'Cours', icon: Book },
  { href: '/history', label: 'Historique', icon: History },
  { href: '/payment', label: 'Paiement', icon: DollarSign },
  { href: '/agenda', label: 'Agenda', icon: CalendarClock },
  { href: '/contact', label: 'Support', icon: BotMessageSquare },
];

const getInitials = (name: string | undefined) => {
    if (!name) return '..';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile, isAdmin } = useAuth();
  const { auth } = useFirebase();

  const handleLogout = async () => {
    if(!auth) return;
    await signOut(auth);
    router.push('/');
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          <span className="font-bold text-lg font-headline">Smart Études CI</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2 flex-grow">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          
          {isAdmin && (
            <>
              <SidebarSeparator className='my-2' />
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/admin')}
                  tooltip="Gestion"
                >
                  <Link href="/admin">
                    <Briefcase />
                    <span>Gestion</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
          
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarSeparator />
        <div className="flex items-center justify-between p-2">
            <Link href="/profile" className='flex items-center gap-3 overflow-hidden'>
                <Avatar className='h-9 w-9'>
                    <AvatarImage src={userProfile?.photoURL || ''} alt={userProfile?.name} />
                    <AvatarFallback>{getInitials(userProfile?.name)}</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                    <p className="font-semibold truncate text-sm">{userProfile?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{userProfile?.email}</p>
                </div>
            </Link>
            <div className='flex items-center'>
                <SidebarMenuButton asChild size="sm" variant="ghost" className="h-8 w-8" tooltip="Paramètres">
                    <Link href="/settings"><Cog /></Link>
                </SidebarMenuButton>
                 <SidebarMenuButton onClick={handleLogout} size="sm" variant="ghost" className="h-8 w-8" tooltip="Déconnexion">
                    <LogOut />
                </SidebarMenuButton>
            </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
