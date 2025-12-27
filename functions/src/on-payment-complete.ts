import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import type { Payment, UserProfile } from '../../src/lib/types';

const db = admin.firestore();

// Commission rates: 10% for level 1, 3% for level 2, 1% for level 3
const COMMISSION_RATES = [0.10, 0.03, 0.01]; 

/**
 * Cloud Function that triggers on payment document update.
 * When a payment status changes from 'pending' to 'completed', it distributes
 * referral commissions up to 3 levels in the user's upline.
 */
export const onPaymentComplete = functions.firestore
  .document('payments/{paymentId}')
  .onUpdate(async (change, context) => {
    const paymentAfter = change.after.data() as Payment;
    const paymentBefore = change.before.data() as Payment;

    // Trigger only when status becomes 'completed'
    if (paymentAfter.status !== 'completed' || paymentBefore.status === 'completed') {
      return null;
    }

    const payingUserId = paymentAfter.userProfileId;
    const amountPaid = paymentAfter.amount;

    const payingUserRef = db.doc(`users/${payingUserId}`);
    
    try {
        const payingUserDoc = await payingUserRef.get();
        if (!payingUserDoc.exists) {
            console.log(`Paying user ${payingUserId} not found.`);
            return null;
        }

        const payingUserData = payingUserDoc.data() as UserProfile;
        const upline = payingUserData.upline; // e.g., [referrer1_id, referrer2_id, referrer3_id]

        if (!upline || upline.length === 0) {
            console.log(`User ${payingUserId} has no upline. No commissions to distribute.`);
            return null;
        }

        const commissionPromises: Promise<any>[] = [];

        // Distribute commissions to up to 3 levels in the upline
        for (let i = 0; i < Math.min(upline.length, COMMISSION_RATES.length); i++) {
            const referrerId = upline[i];
            const commission = amountPaid * COMMISSION_RATES[i];
            
            if (commission > 0) {
                const referrerRef = db.doc(`users/${referrerId}`);
                functions.logger.log(`Distributing ${commission} FCFA to referrer ${referrerId} (Level ${i + 1})`);
                
                // Increment the referralBalance (MLM balance)
                const promise = referrerRef.update({
                    referralBalance: admin.firestore.FieldValue.increment(commission)
                });
                commissionPromises.push(promise);
            }
        }

        await Promise.all(commissionPromises);
        functions.logger.log(`Successfully distributed commissions for payment ${context.params.paymentId}.`);
        return null;

    } catch (error) {
        functions.logger.error(`Failed to distribute commissions for payment ${context.params.paymentId}:`, error);
        return null;
    }
  });
