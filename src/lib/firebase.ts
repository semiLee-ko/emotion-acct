import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyALxzp8NTMb05UygqzEQskMsUmF5Si1e-U",
    authDomain: "miracle-3min.firebaseapp.com",
    projectId: "miracle-3min",
    storageBucket: "miracle-3min.firebasestorage.app",
    messagingSenderId: "831208923404",
    appId: "1:831208923404:web:f4a6362be68484d0262929",
    measurementId: "G-XVDZ7518X6"
};

// Singleton pattern to prevent multiple initializations
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Helper Functions
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc, setDoc } from "firebase/firestore";

import { Receipt, EmotionType } from "./types";

import { signInAnonymously, onAuthStateChanged, User, signInWithCustomToken } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { loginWithToss as getTossAuthCode } from "./toss-sdk"; // Rename import to avoid confusion

export const functions = getFunctions(app, 'asia-northeast3');

export const signIn = (): Promise<User> => {
    return new Promise(async (resolve, reject) => {
        // 1. Check if already logged in
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                unsubscribe();
                resolve(user);
            }
        });

        // 2. Try Toss Login
        try {
            const authResult = await getTossAuthCode();

            if (authResult?.authorizationCode) {
                // Skip Cloud Function if using Mock Code (Local Dev)
                if (authResult.authorizationCode.startsWith("mock_")) {
                    console.log("🔸 Local Mock Auth detected. Skipping Cloud Function call.");
                    throw new Error("Skipping server login in local environment");
                }

                console.log("🚀 Toss Auth Code received, calling Cloud Function...");
                const emotionLogin = httpsCallable(functions, 'emotionLogin');
                const response = await emotionLogin({
                    authorizationCode: authResult.authorizationCode,
                    referrer: authResult.referrer || ''
                });

                const { token } = response.data as any;
                if (token) {
                    console.log("✅ Custom Token received, signing in...");
                    const userCredential = await signInWithCustomToken(auth, token);
                    // Listener above will resolve, but we can resolve here too? 
                    // onAuthStateChanged is safer for single source of truth.
                    return;
                }
            }
        } catch (e) {
            console.error("⚠️ Toss Login failed, falling back to anonymous:", e);
        }

        // 3. Fallback: Anonymous Login (for Dev or cleanup)
        // If we are here, Toss login failed or not in Toss app.
        // wait a bit for onAuthStateChanged to fire if it was already logged in?
        // Actually onAuthStateChanged fires immediately if already logged in. 
        // If we are here, we are likely not logged in or waiting.

        // Simple check: if no user in 1 sec, do anonymous? 
        // Better: just trigger anonymous if auth state is null.
        if (!auth.currentUser) {
            console.log("👻 Signing in anonymously...");
            signInAnonymously(auth).catch(reject);
        }
    });
};

export const addReceipt = async (userId: string, data: { amount: number; emotion: EmotionType; note: string; date: Date }) => {
    try {
        await addDoc(collection(db, `emotion-acct-users/${userId}/receipts`), {
            amount: data.amount,
            emotion: data.emotion,
            note: data.note,
            date: Timestamp.fromDate(data.date),
            createdAt: Timestamp.now()
        });
    } catch (e) {
        console.error("Error adding receipt", e);
        throw e;
    }
}

export const subscribeToReceipts = (userId: string, callback: (receipts: Receipt[]) => void) => {
    const q = query(collection(db, `emotion-acct-users/${userId}/receipts`), orderBy("date", "desc"));
    return onSnapshot(q, (snapshot) => {
        const receipts: Receipt[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            receipts.push({
                id: doc.id,
                amount: data.amount,
                emotion: data.emotion as EmotionType,
                note: data.note,
                date: data.date.toDate(),
                createdAt: data.createdAt ? data.createdAt.toDate() : new Date(0), // Fallback for old data
            });
        });
        callback(receipts);
    });
}

export const deleteReceipt = async (userId: string, receiptId: string) => {
    await deleteDoc(doc(db, `emotion-acct-users/${userId}/receipts`, receiptId));
}

export const updateReceipt = async (userId: string, receiptId: string, data: { amount: number; emotion: EmotionType; note: string; date: Date }) => {
    try {
        await setDoc(doc(db, `emotion-acct-users/${userId}/receipts`, receiptId), {
            ...data,
            date: Timestamp.fromDate(data.date),
            updatedAt: Timestamp.now()
        }, { merge: true });
    } catch (e) {
        console.error("Error updating receipt", e);
        throw e;
    }
}
