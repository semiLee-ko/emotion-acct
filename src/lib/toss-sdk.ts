/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { appLogin as frameworkAppLogin } from '@apps-in-toss/web-framework';

// Define Mock SDK interface based on usage
interface TossAppSDK {
    appLogin: () => Promise<{ authorizationCode: string; referrer?: string }>;
    saveBase64Data: (base64: string, filename: string) => Promise<boolean>;
}

// Declare window.AppsInToss type
declare global {
    interface Window {
        AppsInToss?: TossAppSDK;
        Bedrock?: any; // For miracle-3min compatibility
    }
}

// Mock Implementation for Local Browser (Fallback)
const mockSDK: TossAppSDK = {
    appLogin: async () => {
        console.log("[TossSDK] Mock Login Called");
        return { authorizationCode: "mock_auth_code_12345", referrer: "local_dev" };
    },
    saveBase64Data: async (base64, filename) => {
        console.log("[TossSDK] Mock saveBase64Data Called", filename);
        // In dev, we can just trigger a download for convenience
        const link = document.createElement('a');
        link.href = base64;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
    }
};

export async function loginWithToss() {
    // 1. Try Framework
    try {
        if (typeof frameworkAppLogin === 'function') {
            console.log("[TossSDK] Using Framework App Login");
            return await frameworkAppLogin();
        }
    } catch (e) {
        console.warn('⚠️ Framework Login check failed:', e);
    }

    // 2. Fallback to Window (Legacy/Manual)
    if (typeof window !== 'undefined' && window.AppsInToss && typeof window.AppsInToss.appLogin === 'function') {
        console.log("[TossSDK] Using window.AppsInToss Login");
        return window.AppsInToss.appLogin();
    }

    // 3. Mock
    console.warn("[TossSDK] Not in Toss App environment, using Mock.");
    return mockSDK.appLogin();
}
