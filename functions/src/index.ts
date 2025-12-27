import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import next from 'next';

admin.initializeApp();

const isDev = process.env.NODE_ENV !== 'production';

const app = next({
  dev: isDev,
  conf: { distDir: '../.next' },
});

const handle = app.getRequestHandler();

// HTTPS function for Next.js
export const nextjsFunc = functions.https.onRequest(async (req, res) => {
  await app.prepare();
  return handle(req, res);
});

// Import and export the onUserCreate function
export { onUserCreate } from './on-user-create';
// Import and export the onPaymentComplete function
export { onPaymentComplete } from './on-payment-complete';
