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
        console.log('[Firebase] signIn initiated');

        // 1. Check if already logged in
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('[Firebase] Auth state changed: User logged in', user.uid);
                unsubscribe();
                resolve(user);
            }
        });

        // 2. Try Toss Login
        try {
            //console.log('[Firebase] Attempting Toss Auth Code...');
            const authResult = await getTossAuthCode();
            //console.log('[Firebase] Toss Auth Code result:', authResult ? 'Recieved' : 'Empty');

            if (authResult?.authorizationCode) {
                // Skip Cloud Function if using Mock Code (Local Dev)
                if (authResult.authorizationCode.startsWith("mock_")) {
                    //console.log("[Firebase] 🔸 Local Mock Auth detected. Skipping Cloud Function call.");
                    // We don't throw here, just let it fall back to anonymous if needed, 
                    // but usually onAuthStateChanged would handle it if mock signs in.
                    // Actually, if it's mock, we might need to trigger anonymous or mock sign in.
                } else {
                    //console.log("🚀 [Firebase] Toss Auth Code received, calling Cloud Function...");
                    const emotionLogin = httpsCallable(functions, 'emotionLogin');
                    const response = await emotionLogin({
                        authorizationCode: authResult.authorizationCode,
                        referrer: authResult.referrer || ''
                    });

                    const { token } = response.data as any;
                    if (token) {
                        //console.log("✅ [Firebase] Custom Token received, signing in...");
                        await signInWithCustomToken(auth, token);
                        //console.log("✅ [Firebase] Custom Token sign-in call completed");
                        return; // Let onAuthStateChanged resolve
                    } else {
                        //console.warn('⚠️ [Firebase] No token in Cloud Function response');
                    }
                }
            }
        } catch (e) {
            //console.error("⚠️ [Firebase] Toss Login flow failed:", e);
        }

        // 3. Fallback: Anonymous Login
        if (!auth.currentUser) {
            console.log("👻 [Firebase] Triggering anonymous login fallback...");
            try {
                const cred = await signInAnonymously(auth);
                //console.log("✅ [Firebase] Anonymous login successful", cred.user.uid);
                // resolve(cred.user); // onAuthStateChanged will handle it
            } catch (err) {
                console.error("❌ [Firebase] Anonymous login failed:", err);
                reject(err);
            }
        } else {
            //console.log("[Firebase] Already has current user, skipping anonymous fallback");
            resolve(auth.currentUser);
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
