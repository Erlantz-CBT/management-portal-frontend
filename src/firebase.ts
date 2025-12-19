// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    FieldValue,
    Timestamp
} from "firebase/firestore"
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_FIREBASE_APP_ID,
    measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const fs = getFirestore(app);

signInAnonymously(auth).then(() => {
    console.log("FS signed correctly")
})

interface Log {
    eventName: string,
    timestamp?: FieldValue | Timestamp | null
}

/**
 * Log event wrapper for firebase analytics
 * log an event on the analytics data stream,
 * and store the event on firestore,
 * avoiding 60 days retention limit from BigQuery
 * @param event: Log
 */
console.log(process.env.NODE_ENV)
const logEventAndStore = async (event: Log) => {
    logEvent(analytics, event.eventName)
    event.timestamp = serverTimestamp()
    const kpiCollection: string = process.env.VUE_APP_FIRESTORE_KPI_COLLECTION || "kpi"
    await addDoc(collection(fs, kpiCollection), event)
}

export {
    analytics,
    fs,
    collection,
    addDoc,
    logEventAndStore,
    logEvent
};