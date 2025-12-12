'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase/client-provider';
import type { UserProfile } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, ShieldOff, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useRouter } from 'next/navigation';

type UserWithAdminStatus = UserProfile & { isAdmin: boolean };

export default function AdminUsersPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const { firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithAdminStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !firestore) return;

    if (!isAdmin) {
      toast({ variant: 'destructive', title: 'Accès non autorisé' });
      router.push('/dashboard');
      return;
    }

    const fetchUsers = async () => {
      try {
        const usersCollection = collection(firestore, 'users');
        const adminRolesCollection = collection(firestore, 'roles_admin');

        const [usersSnapshot, adminRolesSnapshot] = await Promise.all([
          getDocs(usersCollection).catch(err => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({ path: usersCollection.path, operation: 'list' }));
            throw err;
          }),
          getDocs(adminRolesCollection).catch(err => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({ path: adminRolesCollection.path, operation: 'list' }));
            throw err;
          })
        ]);

        const adminIds = new Set(adminRolesSnapshot.docs.map(doc => doc.id));
        const allUsers = usersSnapshot.docs.map(doc => ({
          ...(doc.data() as UserProfile),
          id: doc.id,
          isAdmin: adminIds.has(doc.id),
        }));

        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger la liste des utilisateurs.' });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [firestore, isAdmin, authLoading, router, toast]);

  const handleToggleAdmin = async (user: UserWithAdminStatus) => {
    if (!firestore) return;
    setUpdatingId(user.id);
    try {
      const adminRef = doc(firestore, 'roles_admin', user.id);
      if (user.isAdmin) {
        await deleteDoc(adminRef);
        toast({ title: 'Succès', description: `${user.name} n'est plus administrateur.` });
      } else {
        await setDoc(adminRef, { promotedAt: new Date() });
        toast({ title: 'Succès', description: `${user.name} est maintenant administrateur.` });
      }
      // Refresh list
      setUsers(users.map(u => u.id === user.id ? { ...u, isAdmin: !u.isAdmin } : u));
    } catch (e: any) {
      const permissionError = new FirestorePermissionError({
        path: `roles_admin/${user.id}`,
        operation: user.isAdmin ? 'delete' : 'create',
      });
      errorEmitter.emit('permission-error', permissionError);
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  const capitalize = (s: string | undefined) => {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Gérer les Rôles Utilisateur</h1>
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
          <CardDescription>Promouvez ou révoquez les privilèges administrateur.</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 && !loading ? (
            <div className="text-center text-muted-foreground p-8">
              <UserX className="mx-auto h-12 w-12 mb-4" />
              <p>Aucun utilisateur trouvé ou chargement en cours.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{capitalize(u.className)}</TableCell>
                    <TableCell>
                      {u.isAdmin ? (
                        <Badge><ShieldCheck className="h-4 w-4 mr-1" /> Admin</Badge>
                      ) : (
                        <Badge variant="secondary">Utilisateur</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={u.isAdmin ? 'destructive' : 'outline'}
                        onClick={() => handleToggleAdmin(u)}
                        disabled={updatingId === u.id}
                      >
                        {updatingId === u.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : u.isAdmin ? (
                          <ShieldOff className="mr-2 h-4 w-4" />
                        ) : (
                          <ShieldCheck className="mr-2 h-4 w-4" />
                        )}
                        {u.isAdmin ? 'Révoquer' : 'Promouvoir'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
