interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { __ } from '@/utils/i18n';
import { DownloadIcon, EllipsisIcon, PlusSquareIcon, ShareIcon } from 'lucide-react';
import { useState } from 'react';

export default function InstallAppButton() {
    const { platform, canInstall, promptInstall } = usePwaInstall();
    const [showPromptDialog, setShowPromptDialog] = useState(false);
    const [showAndroidDialog, setShowAndroidDialog] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const shouldRender = canInstall || platform === 'ios' || platform === 'android';
    if (!shouldRender) {
        return null;
    }

    if (platform === 'ios') {
        return (
            <>
                <Button
                    onClick={() => setShowPromptDialog(true)}
                    className="text-shadow h-14 w-full cursor-pointer bg-gradient-to-t from-zinc-700 to-zinc-900 text-base text-white shadow-sm transition-all hover:from-zinc-800 hover:to-black hover:shadow-md dark:bg-[#eeeeec] dark:from-zinc-200 dark:to-zinc-300 dark:text-[#1C1C1A] dark:hover:bg-white hover:dark:from-zinc-50 dark:hover:shadow-md"
                >
                    <DownloadIcon className="size-5" />
                    {__('Install App')}
                </Button>

                <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
                    <DialogContent className="max-w-sm">
                        <DialogHeader>
                            <DialogTitle>
                                {__('Install Whisper Money')}
                            </DialogTitle>
                            <DialogDescription>
                                {__(
                                    'Add the app to your home screen for the best experience.',
                                )}
                            </DialogDescription>
                        </DialogHeader>

                        <ol className="flex flex-col gap-5 py-2">
                            <li className="flex items-center gap-4">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                    <ShareIcon className="size-5 text-zinc-600 dark:text-zinc-400" />
                                </span>
                                <span className="text-sm">
                                    {__('Tap the')}{' '}
                                    <strong className="font-semibold">
                                        {__('Share')}
                                    </strong>{' '}
                                    {__('button in your browser toolbar')}
                                </span>
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                    <PlusSquareIcon className="size-5 text-zinc-600 dark:text-zinc-400" />
                                </span>
                                <span className="text-sm">
                                    {__('Tap')}{' '}
                                    <strong className="font-semibold">
                                        {__('Add to Home Screen')}
                                    </strong>
                                </span>
                            </li>
                        </ol>

                        <Button
                            variant="secondary"
                            className="mt-2 w-full"
                            onClick={() => setShowPromptDialog(false)}
                        >
                            {__('Got it')}
                        </Button>
                    </DialogContent>
                </Dialog>
            </>
        );
    }

    return (
        <>
            <Button
                onClick={async () => {
                    if (canInstall) {
                        promptInstall();
                        return;
                    }

                    if (window.__pwaDeferredPrompt) {
                        const e = window.__pwaDeferredPrompt as BeforeInstallPromptEvent;
                        e.prompt();
                        await e.userChoice;
                        return;
                    }

                    setIsChecking(true);
                    for (let i = 0; i < 10; i++) {
                        await new Promise((r) => setTimeout(r, 500));
                        if (window.__pwaDeferredPrompt) {
                            const e = window.__pwaDeferredPrompt as BeforeInstallPromptEvent;
                            e.prompt();
                            await e.userChoice;
                            setIsChecking(false);
                            return;
                        }
                    }
                    setIsChecking(false);
                    setShowAndroidDialog(true);
                }}
                className="text-shadow h-14 w-full cursor-pointer bg-gradient-to-t from-zinc-700 to-zinc-900 text-base text-white shadow-sm transition-all hover:from-zinc-800 hover:to-black hover:shadow-md dark:bg-[#eeeeec] dark:from-zinc-200 dark:to-zinc-300 dark:text-[#1C1C1A] dark:hover:bg-white hover:dark:from-zinc-50 dark:hover:shadow-md"
            >
                <DownloadIcon className="size-5" />
                {isChecking ? __('Checking...') : __('Install App')}
            </Button>

            <Dialog open={showAndroidDialog} onOpenChange={setShowAndroidDialog}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>
                            {__('Install Whisper Money')}
                        </DialogTitle>
                        <DialogDescription>
                            {__(
                                'Add the app to your home screen for the best experience.',
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <ol className="flex flex-col gap-5 py-2">
                        <li className="flex items-center gap-4">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <EllipsisIcon className="size-5 text-zinc-600 dark:text-zinc-400" />
                            </span>
                            <span className="text-sm">
                                {__('Tap the')}{' '}
                                <strong className="font-semibold">
                                    {__('menu')}
                                </strong>{' '}
                                {__('button (⋮) in your browser toolbar')}
                            </span>
                        </li>
                        <li className="flex items-center gap-4">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <PlusSquareIcon className="size-5 text-zinc-600 dark:text-zinc-400" />
                            </span>
                            <span className="text-sm">
                                {__('Tap')}{' '}
                                <strong className="font-semibold">
                                    {__('Install App')}
                                </strong>{' '}
                                {__('or')}{' '}
                                <strong className="font-semibold">
                                    {__('Add to Home Screen')}
                                </strong>
                            </span>
                        </li>
                    </ol>

                    <Button
                        variant="secondary"
                        className="mt-2 w-full"
                        onClick={() => setShowAndroidDialog(false)}
                    >
                        {__('Got it')}
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
}
