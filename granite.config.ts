import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
    appName: 'emotion-acct',
    brand: {
        displayName: '내감정소비',
        primaryColor: '#171717ff', // Added alpha
        icon: 'https://static.toss.im/appsintoss/10277/9d748105-b5be-4fd5-8524-7922027e0585.png', // Fallback icon
        bridgeColorMode: 'basic',
    },
    web: {
        host: '0.0.0.0',
        port: 5173,
        commands: {
            dev: 'vite',
            build: 'vite build',
        },
    },
    permissions: [
        { name: 'photos', access: 'read' }
    ],
    webViewProps: {
        type: 'partner',
    },
    outdir: 'dist',
});
