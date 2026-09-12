import React, { useEffect, useState } from 'react';
import {
  Home,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Layers,
} from 'lucide-react';
import { ListingDetails } from '../types';

interface HandoffInterstitialProps {
  listing: ListingDetails;
  onContinue: () => void;
  onCancel: () => void;
  onNotify: (msg: string) => void;
}

export const HandoffInterstitial: React.FC<HandoffInterstitialProps> = ({
  listing,
  onContinue,
  onCancel,
  onNotify,
}) => {
  const [progress, setProgress] = useState(0);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(true);

  // Auto-advance timer (reaches 100% in ~2.8s)
  useEffect(() => {
    if (!isAutoAdvancing) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onContinue();
          return 100;
        }
        return prev + 2.5;
      });
    }, 70);

    return () => clearInterval(interval);
  }, [isAutoAdvancing, onContinue]);

  const handleManualContinue = () => {
    setIsAutoAdvancing(false);
    onContinue();
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-blue-950 to-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Cancel / Back link (Zero dead ends) */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between z-10">
        <button
          id="btn-cancel-handoff"
          onClick={onCancel}
          className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/10 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel and return to listing</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-blue-300 bg-blue-900/40 border border-blue-500/30 px-3 py-1 rounded-full">
          <Lock className="w-3.5 h-3.5 text-blue-400" />
          <span>256-Bit Encrypted Handoff</span>
        </div>
      </div>

      {/* Main Center Transition Graphic */}
      <div className="max-w-2xl w-full mx-auto my-auto text-center z-10 py-6">
        {/* Animated Origin to Destination badges */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-8 flex-wrap">
          {/* Discovery / Zillow Card */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 w-44 sm:w-52 shadow-lg backdrop-blur-md text-left">
            <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Home className="w-4 h-4 text-blue-400" />
              <span>Zillow Listing</span>
            </div>
            <div className="text-xs text-slate-300 font-semibold truncate">
              {listing.address}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              ${listing.rent.toLocaleString()}/mo · Unit {listing.unit}
            </div>
            <div className="mt-2.5 inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
              <CheckCircle2 className="w-3 h-3" />
              <span>Listing Verified</span>
            </div>
          </div>

          {/* Animated Connecting Pulse */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400/50 flex items-center justify-center animate-pulse">
              <ArrowRight className="w-5 h-5 text-blue-300" />
            </div>
            <span className="text-[10px] font-mono text-blue-300 mt-1 uppercase tracking-wider">
              Handing off
            </span>
          </div>

          {/* Rental Pass Application Card */}
          <div className="bg-blue-600/20 border-2 border-blue-400/60 rounded-2xl p-4 w-44 sm:w-52 shadow-lg backdrop-blur-md text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/20 rounded-bl-full pointer-events-none" />
            <div className="flex items-center gap-1.5 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Rental Pass</span>
            </div>
            <div className="text-xs text-white font-semibold">
              Reusable Profile
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">
              Apply in 1 Click
            </div>
            <div className="mt-2.5 inline-flex items-center gap-1 text-[10px] text-blue-200 bg-blue-900/80 border border-blue-700 px-2 py-0.5 rounded">
              <ShieldCheck className="w-3 h-3 text-blue-300" />
              <span>Smart Verification</span>
            </div>
          </div>
        </div>

        {/* Transition Headline */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          Launching Rental Pass
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto leading-relaxed mb-6">
          Transferring property parameters for <strong className="text-white">{listing.address}</strong> to your reusable tenant application.
        </p>

        {/* Progress Bar with Percentage */}
        <div className="max-w-md mx-auto mb-6">
          <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
            <span>Synchronizing listing data...</span>
            <span>{Math.min(100, Math.round(progress))}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="bg-linear-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-100 ease-out"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>

        {/* Primary Action Button (Continue) + Pause/Advance toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="btn-handoff-continue"
            onClick={handleManualContinue}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Continue to application</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            id="btn-toggle-autoadvance"
            onClick={() => {
              setIsAutoAdvancing(!isAutoAdvancing);
              onNotify(isAutoAdvancing ? 'Paused auto-advance timer.' : 'Resumed auto-advance timer.');
            }}
            className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg border border-slate-700/60 hover:bg-slate-800/50 transition-colors"
          >
            {isAutoAdvancing ? 'Pause countdown' : 'Resume countdown'}
          </button>
        </div>
      </div>

      {/* Footer Info Pill */}
      <div className="max-w-2xl w-full mx-auto text-center z-10 text-xs text-slate-400 flex items-center justify-center gap-4 flex-wrap">
        <span>Step 4: Handoff Interstitial</span>
        <span>•</span>
        <span>No hard credit check without explicit consent</span>
        <span>•</span>
        <span>All data remains encrypted</span>
      </div>
    </div>
  );
};
