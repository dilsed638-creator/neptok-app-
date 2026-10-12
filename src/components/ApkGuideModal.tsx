import React, { useState, useEffect } from 'react';
import { X, Smartphone, Download, Copy, Check, Terminal, ExternalLink, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ApkGuideModal: React.FC = () => {
  const { isApkGuideOpen, setIsApkGuideOpen } = useApp();
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  if (!isApkGuideOpen) return null;

  const handleInstallPwa = async () => {
    if (!installPrompt) {
      alert('To install on Android: Tap the 3 dots (⋮) in Chrome browser, then select "Add to Home screen" or "Install App"!');
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsPwaInstalled(true);
      setInstallPrompt(null);
    }
  };

  const copyToClipboard = (text: string, stepIndex: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const CAPACITOR_COMMANDS = `npm run build
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "NepTok" "com.neptok.app" --web-dir=dist
npx cap add android
npx cap copy
npx cap open android`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md pointer-events-auto">
      <div className="relative w-full max-w-md max-h-[90vh] rounded-2xl bg-[#14141C] border border-zinc-800 flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Android APK & Mobile Setup
              </h3>
              <span className="text-[10px] text-zinc-400">Ready for Android devices & APK packaging</span>
            </div>
          </div>
          <button
            onClick={() => setIsApkGuideOpen(false)}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 no-scrollbar text-xs text-zinc-300">
          {/* Method 1: Instant PWA Install on Android */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/40 to-zinc-900 border border-emerald-500/40">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-emerald-400 text-xs flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Option 1: Direct Android App Install (PWA)
              </span>
              <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                No SDK Required
              </span>
            </div>
            <p className="text-[11px] text-zinc-300 mb-3 leading-relaxed">
              Install NepTok directly onto any Android phone as a standalone full-screen application with our verified web app manifest.
            </p>
            <button
              onClick={handleInstallPwa}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Install NepTok on Android Device</span>
            </button>
          </div>

          {/* Method 2: Native Android APK Packaging with Capacitor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-rose-500" />
                Option 2: Build Standalone .apk with Capacitor
              </span>
              <button
                onClick={() => copyToClipboard(CAPACITOR_COMMANDS, 99)}
                className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                {copiedStep === 99 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedStep === 99 ? 'Copied All' : 'Copy All'}</span>
              </button>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              To produce an installable <strong>NepTok-release.apk</strong> or debug APK for Google Play Store / sideloading, follow these simple steps:
            </p>

            {/* Step 1 */}
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200 text-[11px]">1. Build the Web Assets</span>
                <button
                  onClick={() => copyToClipboard('npm run build', 1)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  {copiedStep === 1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <code className="block p-1.5 rounded bg-black/60 text-rose-400 text-[11px] font-mono">
                npm run build
              </code>
            </div>

            {/* Step 2 */}
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200 text-[11px]">2. Install Capacitor Android Tooling</span>
                <button
                  onClick={() => copyToClipboard('npm install @capacitor/core @capacitor/cli @capacitor/android', 2)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  {copiedStep === 2 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <code className="block p-1.5 rounded bg-black/60 text-zinc-300 text-[11px] font-mono">
                npm install @capacitor/core @capacitor/cli @capacitor/android
              </code>
            </div>

            {/* Step 3 */}
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200 text-[11px]">3. Initialize & Add Android Native Project</span>
                <button
                  onClick={() => copyToClipboard('npx cap init "NepTok" "com.neptok.app" --web-dir=dist && npx cap add android', 3)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  {copiedStep === 3 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <code className="block p-1.5 rounded bg-black/60 text-zinc-300 text-[11px] font-mono">
                npx cap init "NepTok" "com.neptok.app" --web-dir=dist<br />
                npx cap add android
              </code>
            </div>

            {/* Step 4 */}
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200 text-[11px]">4. Open in Android Studio & Generate APK</span>
                <button
                  onClick={() => copyToClipboard('npx cap open android', 4)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  {copiedStep === 4 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <code className="block p-1.5 rounded bg-black/60 text-emerald-400 text-[11px] font-mono">
                npx cap open android
              </code>
              <p className="text-[10px] text-zinc-400 mt-1">
                In Android Studio, click <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong> to generate your ready-to-install `.apk`!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 bg-[#101017] rounded-b-2xl flex items-center justify-between">
          <span className="text-[10px] text-zinc-500">Android 8.0+ Compatible • NepTok 2026</span>
          <button
            onClick={() => setIsApkGuideOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
