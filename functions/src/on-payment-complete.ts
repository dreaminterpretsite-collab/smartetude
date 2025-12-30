
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import type { Payment, UserProfile } from '../../src/lib/types';

const db = admin.firestore();

// Commission rates: 10% for level 1, 3% for level 2, 1% for level 3
const COMMISSION_RATES = [0.10, 0.03, 0.01];

export const onPaymentComplete = onDocumentUpdated('payments/{paymentId}', async (event) => {
    if (!event.data) {
        functions.logger.log('No data associated with the event, skipping.');
        return null;
    }

    const paymentAfter = event.data.after.data() as Payment;
    const paymentBefore = event.data.before.data() as Payment;
    const paymentId = event.params.paymentId;

    // Trigger only when status changes from something else to 'completed'
    if (paymentAfter.status !== 'completed' || paymentBefore.status === 'completed') {
        functions.logger.log(`Payment ${paymentId} status is not newly 'completed'. Current status: ${paymentAfter.status}, Previous: ${paymentBefore.status}. Skipping.`);
        return null;
    }

    const payingUserId = paymentAfter.userProfileId;
    const amountPaid = paymentAfter.amount;

    if (!payingUserId) {
        functions.logger.error(`Payment ${paymentId} is missing the userProfileId field.`);
        return null;
    }
    
    if (!amountPaid || amountPaid <= 0) {
        functions.logger.error(`Payment ${paymentId} has an invalid amount: ${amountPaid}.`);
        return null;
    }

    const payingUserRef = db.doc(`users/${payingUserId}`);

    try {
        const payingUserDoc = await payingUserRef.get();
        if (!payingUserDoc.exists) {
            functions.logger.error(`Paying user document ${payingUserId} not found for payment ${paymentId}.`);
            return null;
        }

        const payingUserData = payingUserDoc.data() as UserProfile;
        const upline = payingUserData.upline;

        if (!upline || upline.length === 0) {
            functions.logger.info(`User ${payingUserId} has no upline. No commissions to distribute for payment ${paymentId}.`);
            return null;
        }

        functions.logger.log(`Starting commission distribution for payment ${paymentId} from user ${payingUserId}. Upline: [${upline.join(', ')}]`);

        // Distribute commissions to up to 3 levels in the upline
        for (let i = 0; i < Math.min(upline.length, COMMISSION_RATES.length); i++) {
            const referrerId = upline[i];
            const commission = amountPaid * COMMISSION_RATES[i];

            if (commission > 0) {
                const referrerRef = db.doc(`users/${referrerId}`);
                functions.logger.log(`Attempting to distribute ${commission} FCFA to referrer ${referrerId} (Level ${i + 1}) for payment ${paymentId}.`);

                try {
                    // Use a transaction to safely update the balance
                    await db.runTransaction(async (transaction) => {
                        const referrerDoc = await transaction.get(referrerRef);
                        if (!referrerDoc.exists) {
                            functions.logger.warn(`Referrer ${referrerId} not found. Cannot distribute commission.`);
                            return;
                        }
                        transaction.update(referrerRef, {
                            referralBalance: admin.firestore.FieldValue.increment(commission)
                        });
                    });
                    functions.logger.log(`Successfully distributed commission to ${referrerId}.`);
                } catch (error) {
                    functions.logger.error(`Failed to update referralBalance for user ${referrerId} (Level ${i + 1}) for payment ${paymentId}:`, error);
                    // Continue to the next referrer even if one fails
                }
            }
        }

        functions.logger.log(`Successfully completed commission distribution for payment ${paymentId}.`);
        return null;

    } catch (error) {
        functions.logger.error(`A critical error occurred while processing commissions for payment ${paymentId}:`, error);
        // Depending on the desired behavior, you might want to re-throw or handle differently
        return null;
    }
  });

import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import type { Payment, UserProfile } from '../../src/lib/types';

const db = admin.firestore();

// Commission rates: 10% for level 1, 3% for level 2, 1% for level 3
const COMMISSION_RATES = [0.10, 0.03, 0.01];

export const onPaymentComplete = onDocumentUpdated('payments/{paymentId}', async (event) => {
    if (!event.data) {
        functions.logger.log('No data associated with the event, skipping.');
        return null;
    }

    const paymentAfter = event.data.after.data() as Payment;
    const paymentBefore = event.data.before.data() as Payment;
    const paymentId = event.params.paymentId;

    // Trigger only when status changes from something else to 'completed'
    if (paymentAfter.status !== 'completed' || paymentBefore.status === 'completed') {
        functions.logger.log(`Payment ${paymentId} status is not newly 'completed'. Current status: ${paymentAfter.status}, Previous: ${paymentBefore.status}. Skipping.`);
        return null;
    }

    const payingUserId = paymentAfter.userProfileId;
    const amountPaid = paymentAfter.amount;

    if (!payingUserId) {
        functions.logger.error(`Payment ${paymentId} is missing the userProfileId field.`);
        return null;
    }
    
    if (!amountPaid || amountPaid <= 0) {
        functions.logger.error(`Payment ${paymentId} has an invalid amount: ${amountPaid}.`);
        return null;
    }

    const payingUserRef = db.doc(`users/${payingUserId}`);

    try {
        const payingUserDoc = await payingUserRef.get();
        if (!payingUserDoc.exists) {
            functions.logger.error(`Paying user document ${payingUserId} not found for payment ${paymentId}.`);
            return null;
        }

        const payingUserData = payingUserDoc.data() as UserProfile;
        const upline = payingUserData.upline;

        if (!upline || upline.length === 0) {
            functions.logger.info(`User ${payingUserId} has no upline. No commissions to distribute for payment ${paymentId}.`);
            return null;
        }

        functions.logger.log(`Starting commission distribution for payment ${paymentId} from user ${payingUserId}. Upline: [${upline.join(', ')}]`);

        // Distribute commissions to up to 3 levels in the upline
        for (let i = 0; i < Math.min(upline.length, COMMISSION_RATES.length); i++) {
            const referrerId = upline[i];
            const commission = amountPaid * COMMISSION_RATES[i];

            if (commission > 0) {
                const referrerRef = db.doc(`users/${referrerId}`);
                functions.logger.log(`Attempting to distribute ${commission} FCFA to referrer ${referrerId} (Level ${i + 1}) for payment ${paymentId}.`);

                try {
                    // Use a transaction to safely update the balance
                    await db.runTransaction(async (transaction) => {
                        const referrerDoc = await transaction.get(referrerRef);
                        if (!referrerDoc.exists) {
                            functions.logger.warn(`Referrer ${referrerId} not found. Cannot distribute commission.`);
                            return;
                        }
                        transaction.update(referrerRef, {
                            referralBalance: admin.firestore.FieldValue.increment(commission)
                        });
                    });
                    functions.logger.log(`Successfully distributed commission to ${referrerId}.`);
                } catch (error) {
                    functions.logger.error(`Failed to update referralBalance for user ${referrerId} (Level ${i + 1}) for payment ${paymentId}:`, error);
                    // Continue to the next referrer even if one fails
                }
            }
        }

        functions.logger.log(`Successfully completed commission distribution for payment ${paymentId}.`);
        return null;

    } catch (error) {
        functions.logger.error(`A critical error occurred while processing commissions for payment ${paymentId}:`, error);
        // Depending on the desired behavior, you might want to re-throw or handle differently
        return null;
    }
  });
