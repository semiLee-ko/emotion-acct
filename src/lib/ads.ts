"use client";

import { GoogleAdMob } from '@apps-in-toss/web-framework';

// Rewarded ad state management
let isRewardedAdLoaded = false;
let rewardedAdCleanup: (() => void) | null = null;

/**
 * 보상형 광고 미리 로드
 */
export async function prepareRewardedAd() {
    try {
        // Check if we're in a browser environment (dev mode)
        if (typeof window !== 'undefined' && !(window as any).ReactNativeWebView) {
            //console.log('🔧 Dev mode: Skipping ad preload (browser environment)');
            return;
        }

        if (!GoogleAdMob.loadAppsInTossAdMob.isSupported) {
            //console.warn('⚠️ AdMob not supported');
            return;
        }

        const cleanup = GoogleAdMob.loadAppsInTossAdMob({
            //options: { adGroupId: 'ait-ad-test-rewarded-id' },
            options: { adGroupId: 'ait.v2.live.2beddcd0dbfc4aa4' },
            onEvent: (event) => {
                if (event.type === 'loaded') {
                    isRewardedAdLoaded = true;
                    //console.log('✅ Rewarded ad loaded');
                    cleanup(); // IMPORTANT: Must call cleanup after load success!
                }
            },
            onError: (error) => {
                //console.error('❌ Rewarded Ad Preload Failed:', error);
                isRewardedAdLoaded = false;
                cleanup && cleanup();
            }
        });
    } catch (error) {
        //console.warn('⚠️ prepareRewardedAd Error (browser mode):', error);
        // Silently fail in dev/browser mode
    }
}

/**
 * 보상형 광고 표시 (미리 로드된 광고 사용)
 * @returns Promise<{ rewarded: boolean }> - rewarded is true if user watched the ad
 */
export function showRewardedAd(): Promise<{ rewarded: boolean }> {
    return new Promise((resolve) => {
        // Check if we're in a browser environment (dev mode)
        if (typeof window !== 'undefined' && !(window as any).ReactNativeWebView) {
            //console.log('🔧 Dev mode: Allowing download without ad (browser environment)');
            resolve({ rewarded: true }); // Allow download in dev
            return;
        }

        if (!isRewardedAdLoaded) {
            //console.warn('⚠️ Rewarded ad not loaded, allowing download anyway');
            prepareRewardedAd(); // Try to load for next time
            resolve({ rewarded: true }); // Allow download in dev/sandbox
            return;
        }

        try {
            if (!GoogleAdMob.showAppsInTossAdMob.isSupported) {
                //console.warn('⚠️ showAppsInTossAdMob not supported');
                resolve({ rewarded: true }); // Allow download in dev
                return;
            }

            GoogleAdMob.showAppsInTossAdMob({
                //options: { adGroupId: 'ait-ad-test-rewarded-id' },
                options: { adGroupId: 'ait.v2.live.2beddcd0dbfc4aa4' },
                onEvent: (event) => {
                    switch (event.type) {
                        case 'show':
                            //console.log('📺 Rewarded ad showing');
                            break;
                        case 'userEarnedReward':
                            //console.log('🎁 User earned reward');
                            break;
                        case 'dismissed':
                            //console.log('✅ Ad dismissed');
                            isRewardedAdLoaded = false;
                            prepareRewardedAd(); // Preload next ad
                            resolve({ rewarded: true });
                            break;
                        case 'failedToShow':
                            //console.warn('⚠️ 보상형 광고 표시 실패');
                            isRewardedAdLoaded = false;
                            resolve({ rewarded: false });
                            break;
                    }
                },
                onError: (error) => {
                    //console.error('❌ Failed to show Rewarded Ad:', error);
                    isRewardedAdLoaded = false;
                    resolve({ rewarded: false });
                }
            });
        } catch (error) {
            //console.error('❌ Error calling showRewardedAd:', error);
            resolve({ rewarded: false });
        }
    });
}

// Interstitial ad state management
let isInterstitialAdLoaded = false;
let interstitialAdCleanup: (() => void) | null = null;

/**
 * 전면형 광고 미리 로드
 */
export async function prepareInterstitialAd() {
    try {
        if (typeof window !== 'undefined' && !(window as any).ReactNativeWebView) {
            //console.log('🔧 Dev mode: Skipping interstitial ad preload (browser environment)');
            return;
        }

        if (!GoogleAdMob.loadAppsInTossAdMob.isSupported) {
            //console.warn('⚠️ AdMob not supported');
            return;
        }

        const cleanup = GoogleAdMob.loadAppsInTossAdMob({
            //options: { adGroupId: 'ait-ad-test-interstitial-id' },
            options: { adGroupId: 'ait.v2.live.9ac3899a7b1f48dc' },
            onEvent: (event) => {
                if (event.type === 'loaded') {
                    isInterstitialAdLoaded = true;
                    //console.log('✅ Interstitial ad loaded');
                    cleanup();
                }
            },
            onError: (error) => {
                //console.error('❌ Interstitial Ad Preload Failed:', error);
                isInterstitialAdLoaded = false;
                cleanup && cleanup();
            }
        });
    } catch (error) {
        console.warn('⚠️ prepareInterstitialAd Error (browser mode):', error);
    }
}

/**
 * 전면형 광고 표시
 * @returns Promise<{ result: boolean }> - result is true if ad was shown and closed, or allowed in dev
 */
export function showInterstitialAd(): Promise<{ result: boolean }> {
    return new Promise((resolve) => {
        if (typeof window !== 'undefined' && !(window as any).ReactNativeWebView) {
            //console.log('🔧 Dev mode: Allowing action without ad (browser environment)');
            resolve({ result: true });
            return;
        }

        if (!isInterstitialAdLoaded) {
            //console.warn('⚠️ Interstitial ad not loaded, allowing action anyway');
            prepareInterstitialAd();
            resolve({ result: true });
            return;
        }

        try {
            if (!GoogleAdMob.showAppsInTossAdMob.isSupported) {
                //console.warn('⚠️ showAppsInTossAdMob not supported');
                resolve({ result: true });
                return;
            }

            GoogleAdMob.showAppsInTossAdMob({
                //options: { adGroupId: 'ait-ad-test-interstitial-id' },
                options: { adGroupId: 'ait.v2.live.9ac3899a7b1f48dc' },
                onEvent: (event) => {
                    switch (event.type) {
                        case 'show':
                            //console.log('📺 Interstitial ad showing');
                            break;
                        case 'dismissed':
                            //console.log('✅ Interstitial Ad dismissed');
                            isInterstitialAdLoaded = false;
                            prepareInterstitialAd(); // Preload next
                            resolve({ result: true });
                            break;
                        case 'failedToShow':
                            //console.warn('⚠️ 전면형 광고 표시 실패');
                            isInterstitialAdLoaded = false;
                            prepareInterstitialAd();
                            resolve({ result: false });
                            break;
                    }
                },
                onError: (error) => {
                    console.error('❌ Failed to show Interstitial Ad:', error);
                    isInterstitialAdLoaded = false;
                    resolve({ result: false });
                }
            });
        } catch (error) {
            console.error('❌ Error calling showInterstitialAd:', error);
            resolve({ result: false });
        }
    });
}
