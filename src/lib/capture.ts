import html2canvas from 'html2canvas';
import { saveBase64Data } from '@apps-in-toss/web-framework';

/**
 * Captures a specific DOM element by ID and returns base64 PNG string.
 * Handles hidden/off-screen elements by cloning them to a visible (but off-screen) container first.
 */
interface CaptureOptions {
    onClone?: (clone: HTMLElement) => void;
}

export async function captureElement(elementId: string, options: CaptureOptions = {}): Promise<string | null> {
    const originalElement = document.getElementById(elementId);
    if (!originalElement) {
        console.error(`Element with id ${elementId} not found`);
        return null;
    }

    try {
        // 1. Clone the element
        const clone = originalElement.cloneNode(true) as HTMLElement;

        // 1.5. Apply customizations
        if (options.onClone) {
            options.onClone(clone);
        }

        // 2. Style the clone to ensure it's captured correctly but not visible to user
        // We put it in a fixed container off-screen
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        container.style.left = '-9999px';
        container.style.width = `${Math.max(originalElement.offsetWidth, 360)}px`; // Match original width, with min fallback
        container.style.height = 'auto';
        container.style.zIndex = '-1';
        container.style.background = '#fff'; // Ensure background is white/set (can be overridden in onClone)

        // Copy specific computed styles that might be lost or rely on parent
        // For simplicity, we assume generic styling carries over or is inline.
        // But for gradients/etc, inline styles in the component are best.

        container.appendChild(clone);
        document.body.appendChild(container);

        // 3. Wait a moment for layout/rendering (sometimes needed for fonts/images)
        await new Promise(resolve => setTimeout(resolve, 100));

        // 4. Capture
        const canvas = await html2canvas(clone, {
            backgroundColor: null, // Transparent background if not set
            scale: 2, // High resolution
            logging: false,
            useCORS: true // For external images if any
        });

        // 5. Cleanup
        document.body.removeChild(container);

        // 6. Return Base64
        return canvas.toDataURL('image/png');

    } catch (error) {
        console.error('Error capturing element:', error);
        return null;
    }
}

/**
 * Downloads a Base64 string as a file
 */
export async function downloadBase64(base64: string, filename: string) {
    // 1. Try Framework saveBase64Data (Official Signature)
    try {
        console.log('Calling Framework saveBase64Data');

        // Remove data URL prefix if present (Framework expects raw base64)
        const cleanBase64 = base64.split(',')[1] || base64;

        await saveBase64Data({
            data: cleanBase64,
            fileName: filename,
            mimeType: 'image/png'
        });

        // Success: Silent return (Alert removed as requested)
        return;

    } catch (e) {
        console.warn('Framework saveBase64Data failed:', e);
        // Error alert could be kept or removed; removing as per general "remove debug alerts" guidance,
        // but usually errors should be shown. Sticking to console for now to be "clean".
    }

    // 2. Legacy / Fallback (AppsInToss Object) - Only if framework logic didn't return
    let appsInToss = typeof window !== 'undefined' ? window.AppsInToss : undefined;
    if (appsInToss && appsInToss.saveBase64Data) {
        try {
            const success = await appsInToss.saveBase64Data(base64, filename);
            if (success) return;
        } catch (error) {
            console.warn('Legacy AppsInToss saveBase64Data failed:', error);
        }
    }

    // 3. Fallback: Classic Link Download (Desktop / Dev Mode)
    const link = document.createElement('a');
    link.href = base64;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
