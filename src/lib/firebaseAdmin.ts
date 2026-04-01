import admin from "firebase-admin";

if (!admin.apps.length) {
  const raw = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

  const serviceAccount = {
    projectId: raw.project_id,
    clientEmail: raw.client_email,
    privateKey: raw.private_key.replace(/\\n/g, "\n"),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();