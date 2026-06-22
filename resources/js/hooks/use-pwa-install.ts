import { useCallback, useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        __pwaDeferredPrompt?: Event;
        __pwaCanInstall?: boolean;
    }
}

type Platform = 'android' | 'ios' | 'desktop' | null;

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function detectPlatform(): Platform {
    if (typeof navigator === 'undefined') {
        return null;
    }

    const ua = navigator.userAgent;

    if (/android/i.test(ua)) {
        return 'android';
    }

    if (
        /iPad|iPhone|iPod/.test(ua) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    ) {
        return 'ios';
    }

    return 'desktop';
}

export function usePwaInstall() {
    const [platform, setPlatform] = useState<Platform>(null);
    const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
    const [canInstall, setCanInstall] = useState(false);

    useEffect(() => {
        setPlatform(detectPlatform());
    }, []);

    useEffect(() => {
        if (window.__pwaDeferredPrompt) {
            deferredPromptRef.current = window.__pwaDeferredPrompt as BeforeInstallPromptEvent;
            setCanInstall(true);
            return;
        }

        const handler = (e: Event) => {
            e.preventDefault();
            deferredPromptRef.current = e as BeforeInstallPromptEvent;
            setCanInstall(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        const interval = setInterval(() => {
            if (window.__pwaDeferredPrompt && !deferredPromptRef.current) {
                deferredPromptRef.current = window.__pwaDeferredPrompt as BeforeInstallPromptEvent;
                setCanInstall(true);
                clearInterval(interval);
            }
        }, 2000);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            clearInterval(interval);
        };
    }, []);

    const promptInstall = useCallback(async (): Promise<boolean> => {
        const prompt = deferredPromptRef.current;

        if (!prompt) {
            return false;
        }

        await prompt.prompt();
        const { outcome } = await prompt.userChoice;
        deferredPromptRef.current = null;
        setCanInstall(false);

        return outcome === 'accepted';
    }, []);

    return {
        platform,
        isMobile: platform === 'android' || platform === 'ios',
        canInstall,
        promptInstall,
    };
}
