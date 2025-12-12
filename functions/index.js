const functions = require("firebase-functions");
const next = require("next");

const isDev = process.env.NODE_ENV !== "production";

const app = next({
  dev: isDev,
  conf: { distDir: "../.next" }
});

const handle = app.getRequestHandler();

exports.nextjsFunc = functions.https.onRequest(async (req, res) => {
  await app.prepare();
  return handle(req, res);
});
