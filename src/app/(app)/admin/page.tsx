'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, onSnapshot, doc, writeBatch, getDocs, getDoc, increment, collectionGroup, Query, DocumentData } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import type { Payment, UserProfile } from '@/lib/types';
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
import { Loader2, ShieldAlert, Users, TrendingUp, DollarSign, UserCheck, ArrowRight, BookCheck as BookCheckIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

interface Stats {
    totalUsers: number;
    activeUsers: number;
    dailyRevenue: number;
    annualRevenue: number;
    solvedExercises: number;
}

const WELCOME_BONUS = 1000;

export default function AdminPage() {
  const { user, userProfile, isAdmin, loading: authLoading } = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<'completed' | 'failed' | null>(null);
  const [bulkIds, setBulkIds] = useState('');
  const [bulkUpdating, setBulkUpdating] = useState(false);

  useEffect(() => {
    if (authLoading || !firestore) return;

    if (isAdmin) {
        // Fetch stats only for admins
        const fetchStats = async () => {
            try {
                // User stats
                const usersCollection = collection(firestore, 'users');
                const usersSnapshot = await getDocs(usersCollection).catch(err => {
                  errorEmitter.emit('permission-error', new FirestorePermissionError({ path: usersCollection.path, operation: 'list' }));
                  throw err;
                });
                const totalUsers = usersSnapshot.size;

                let activeUsers = 0;
                usersSnapshot.forEach(doc => {
                    const user = doc.data() as UserProfile;
                    if (user.solde > 0) {
                        activeUsers++;
                    }
                });

                // Revenue stats
                const today = new Date();
                const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime();
                const startOfYear = new Date(today.getFullYear(), 0, 1).getTime();

                let dailyRevenue = 0;
                let annualRevenue = 0;
                
                const paymentsCollection = collection(firestore, 'payments');
                const paymentsQuery = query(paymentsCollection, where('status', '==', 'completed'));
                const paymentsSnapshot = await getDocs(paymentsQuery).catch(err => {
                  errorEmitter.emit('permission-error', new FirestorePermissionError({ path: paymentsCollection.path, operation: 'list' }));
                  throw err;
                });

                paymentsSnapshot.forEach(doc => {
                    const payment = doc.data() as Payment;
                    const paymentTime = new Date(payment.paymentDate).getTime();
                    if(paymentTime >= startOfYear) {
                        annualRevenue += payment.amount;
                    }
                    if (paymentTime >= startOfDay) {
                        dailyRevenue += payment.amount;
                    }
                });

                // Solved exercises stats
                const exercisesQuery = collectionGroup(firestore, 'exercises');
                const exercisesSnapshot = await getDocs(exercisesQuery).catch(err => {
                    errorEmitter.emit('permission-error', new FirestorePermissionError({ path: 'exercises', operation: 'list'}));
                    throw err;
                });
                const solvedExercises = exercisesSnapshot.size;
                
                setStats({ totalUsers, activeUsers, dailyRevenue, annualRevenue, solvedExercises });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();

        // Subscribe to pending payments for admins
        const q = query(collection(firestore, "payments"), where("status", "==", "pending"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const pendingPayments: Payment[] = [];
            querySnapshot.forEach((doc) => {
            pendingPayments.push({ id: doc.id, ...doc.data() } as Payment);
            });
            setPayments(pendingPayments);
            setLoading(false);
        }, (err) => {
            const permissionError = new FirestorePermissionError({
                path: (q as any)._query.path.canonicalString(),
                operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
            setLoading(false);
        });

        return () => unsubscribe();
    } else {
        // Not an admin, so don't fetch anything sensitive
        setLoading(false);
    }
  }, [firestore, isAdmin, authLoading]);
  
  const handleUpdatePayment = async (payment: Payment, status: 'completed' | 'failed') => {
    if (!isAdmin || !firestore) {
        toast({ variant: 'destructive', title: 'Action non autorisée', description: 'Vous devez être administrateur pour effectuer cette action.' });
        return;
    }
    setUpdatingId(payment.id);
    setNewStatus(status);
    try {
      const batch = writeBatch(firestore);
      const paymentRef = doc(firestore, 'payments', payment.id);
      batch.update(paymentRef, { status: status });

      if (status === 'completed') {
        const userRef = doc(firestore, 'users', payment.userProfileId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userProfile = userDoc.data() as UserProfile;
            let amountToCredit = payment.amount;
            const updateData: any = {};

            if (userProfile.welcomeBonusPending) {
                amountToCredit += WELCOME_BONUS;
                updateData.welcomeBonusPending = false;
                toast({ title: 'Bonus Appliqué!', description: `Le bonus de bienvenue de ${WELCOME_BONUS} FCFA a été ajouté au solde de l'utilisateur.` });
            }
            
            updateData.solde = increment(amountToCredit);
            batch.update(userRef, updateData);
        }
      }

      await batch.commit();

      toast({ title: 'Succès', description: `Paiement ${status === 'completed' ? 'approuvé' : 'rejeté'}.` });
    } catch (e: any) {
       console.error("Failed to update payment", e);
       const permissionError = new FirestorePermissionError({
          path: `payments/${payment.id}`,
          operation: 'update',
          requestResourceData: { status }
      });
      errorEmitter.emit('permission-error', permissionError);
    } finally {
      setUpdatingId(null);
      setNewStatus(null);
    }
  };

  const handleBulkUpdate = async () => {
    if (!isAdmin || !firestore) return;
    setBulkUpdating(true);
    
    const idsToUpdate = bulkIds.split(/[\s,]+/).filter(id => id.trim().length === 17);
    if (idsToUpdate.length === 0) {
        toast({ variant: 'destructive', title: 'Aucun ID valide', description: 'Veuillez entrer des ID de transaction valides.' });
        setBulkUpdating(false);
        return;
    }

    try {
        const batch = writeBatch(firestore);
        const paymentsToUpdate: Payment[] = [];

        // Firestore 'in' query can take up to 30 items
        for (let i = 0; i < idsToUpdate.length; i += 30) {
            const chunk = idsToUpdate.slice(i, i + 30);
            const q = query(
              collection(firestore, 'payments'), 
              where('waveTransactionId', 'in', chunk),
              where('status', '==', 'pending')
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(doc => paymentsToUpdate.push({ id: doc.id, ...doc.data() } as Payment));
        }

        if (paymentsToUpdate.length === 0) {
            toast({ variant: 'destructive', title: 'Aucun paiement trouvé', description: 'Aucun paiement en attente ne correspond aux ID fournis.' });
            setBulkUpdating(false);
            return;
        }

        for (const payment of paymentsToUpdate) {
            const paymentRef = doc(firestore, 'payments', payment.id);
            batch.update(paymentRef, { status: 'completed' });
            
            const userRef = doc(firestore, 'users', payment.userProfileId);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userProfile = userDoc.data() as UserProfile;
                let amountToCredit = payment.amount;
                const updateData: any = {};
    
                if (userProfile.welcomeBonusPending) {
                    amountToCredit += WELCOME_BONUS;
                    updateData.welcomeBonusPending = false;
                }
                
                updateData.solde = increment(amountToCredit);
                batch.update(userRef, updateData);
            }
        }
        
        await batch.commit();
        
        toast({ title: 'Succès', description: `${paymentsToUpdate.length} paiements ont été approuvés avec succès.` });
        setBulkIds('');
    } catch (e: any) {
        console.error('Bulk update failed:', e);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: 'payments',
            operation: 'update',
            requestResourceData: { info: 'Bulk update failed' }
        }));
    } finally {
        setBulkUpdating(false);
    }
  };


  if (authLoading) {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return '...';
    return new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Panneau de Gestion</h1>
      
      {isAdmin && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs Inscrits</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {stats ? <div className="text-2xl font-bold">{stats.totalUsers}</div> : <Loader2 className="h-6 w-6 animate-spin" /> }
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Exercices Résolus</CardTitle>
                <BookCheckIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {stats ? <div className="text-2xl font-bold">{stats.solvedExercises}</div> : <Loader2 className="h-6 w-6 animate-spin" /> }
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {stats ? <div className="text-2xl font-bold">{stats.activeUsers}</div> : <Loader2 className="h-6 w-6 animate-spin" />}
                <p className="text-xs text-muted-foreground">Utilisateurs avec un solde positif</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenu Journalier</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {stats ? <div className="text-2xl font-bold">{formatCurrency(stats.dailyRevenue)}</div> : <Loader2 className="h-6 w-6 animate-spin" />}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenu Annuel</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {stats ? <div className="text-2xl font-bold">{formatCurrency(stats.annualRevenue)}</div> : <Loader2 className="h-6 w-6 animate-spin" />}
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
                <CardTitle>Gestion des Utilisateurs</CardTitle>
                <CardDescription>Promouvoir ou révoquer les privilèges administrateur des utilisateurs.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/admin/users">
                        Gérer les utilisateurs <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
          </Card>
        </>
      )}


       <Card>
        <CardHeader>
          <CardTitle>Paiements en Attente</CardTitle>
          <CardDescription>Validez ou rejetez les recharges de compte soumises par les utilisateurs.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : !isAdmin || payments.length === 0 ? (
            <div className="text-center text-muted-foreground p-8">
                <ShieldAlert className="mx-auto h-12 w-12 mb-4" />
                <p>Aucun paiement en attente de validation.</p>
                {!isAdmin && <p className="text-xs mt-2">Cette section est réservée aux administrateurs.</p>}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>ID Transaction</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{new Date(p.paymentDate).toLocaleString('fr-FR')}</TableCell>
                    <TableCell>{p.userEmail}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{p.amount.toLocaleString('fr-FR')} FCFA</Badge>
                    </TableCell>
                    <TableCell className="font-mono">{p.waveTransactionId}</TableCell>
                    <TableCell className="text-right space-x-2">
                        <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdatePayment(p, 'completed')}
                        disabled={updatingId === p.id}
                        >
                        {updatingId === p.id && newStatus === 'completed' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Approuver
                        </Button>
                        <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleUpdatePayment(p, 'failed')}
                        disabled={updatingId === p.id}
                        >
                        {updatingId === p.id && newStatus === 'failed' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Rejeter
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
            <CardHeader>
                <CardTitle>Validation en Masse</CardTitle>
                <CardDescription>Collez plusieurs ID de transaction Wave (séparés par des virgules, espaces ou sauts de ligne) pour les approuver en une seule fois.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea 
                    placeholder="Collez les ID de transaction ici..."
                    value={bulkIds}
                    onChange={(e) => setBulkIds(e.target.value)}
                    disabled={bulkUpdating}
                    rows={6}
                />
                <Button onClick={handleBulkUpdate} disabled={bulkUpdating || !bulkIds.trim()}>
                    {bulkUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {bulkUpdating ? 'Validation en cours...' : `Valider en Masse`}
                </Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
