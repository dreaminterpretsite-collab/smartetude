import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import type { UserProfile } from '../../src/lib/types';

const db = admin.firestore();
const REFERRAL_BONUS = 1000;

/**
 * Cloud Function that triggers on new user document creation in Firestore.
 * It handles the referral bonus logic and upline creation securely on the server.
 */
export const onUserCreate = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const newUser = snap.data() as UserProfile;
    const { userId } = context.params;

    if (!newUser) {
      console.log(`No data for new user: ${userId}`);
      return null;
    }

    const { referralId } = newUser;
    let bonusApplied = false;
    let newUpline: string[] = [];

    // 1. Check if the new user was referred
    if (referralId) {
      const referrerRef = db.doc(`users/${referralId}`);
      
      try {
        await db.runTransaction(async (transaction) => {
          const referrerDoc = await transaction.get(referrerRef);

          if (!referrerDoc.exists) {
            console.log(`Referrer with ID ${referralId} does not exist.`);
            return;
          }

          const referrerData = referrerDoc.data() as UserProfile;

          // Construct the new user's upline (referrer is level 1, their referrer is level 2, etc.)
          newUpline = [referralId, ...(referrerData.upline || [])].slice(0, 3); // Max 3 levels

          // Credit the referrer (godfather) with the welcome bonus
          functions.logger.log(`Crediting referrer ${referralId} with ${REFERRAL_BONUS} FCFA.`);
          transaction.update(referrerRef, { solde: admin.firestore.FieldValue.increment(REFERRAL_BONUS) });
          
          // Credit the new user (filleul) with the welcome bonus as well
          functions.logger.log(`Crediting new user ${userId} with referral bonus of ${REFERRAL_BONUS} FCFA.`);
          transaction.update(snap.ref, { 
            solde: admin.firestore.FieldValue.increment(REFERRAL_BONUS),
            upline: newUpline, // Set the upline for future commission calculations
            welcomeBonusPending: false // Mark bonus as applied
          });
          bonusApplied = true;
        });
      } catch (error) {
        functions.logger.error(`Transaction failed for referral ${referralId} to ${userId}:`, error);
        // Do not apply any bonus if the referral transaction fails
        return null;
      }
    }

    // 2. If no referral bonus was applied, apply the standard welcome bonus
    if (!bonusApplied && newUser.welcomeBonusPending) {
        functions.logger.log(`Applying standard welcome bonus of 1000 FCFA to new user ${userId}.`);
        await snap.ref.update({
             solde: admin.firestore.FieldValue.increment(REFERRAL_BONUS),
             welcomeBonusPending: false, // Mark bonus as applied
        });
    }

    return null;
  });
