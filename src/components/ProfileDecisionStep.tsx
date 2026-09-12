import React, { useState } from 'react';
import {
  FileText,
  PlusCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  User,
  Check,
} from 'lucide-react';
import { ListingDetails } from '../types';

interface ProfileDecisionStepProps {
  listing: ListingDetails;
  mockSavedDate?: string;
  onSelectSavedProfile: () => void;
  onSelectNewApplication: () => void;
  onBack: () => void;
  onNotify: (msg: string) => void;
}

export const ProfileDecisionStep: React.FC<ProfileDecisionStepProps> = ({
  listing,
  mockSavedDate = 'August 14, 2026',
  onSelectSavedProfile,
  onSelectNewApplication,
  onBack,
  onNotify,
}) => {
  // Phase 3: Two-tap pattern (card selection + explicit Next button)
  const [selectedChoice, setSelectedChoice] = useState<'saved' | 'new'>('saved');

  const handleCardClick = (choice: 'saved' | 'new') => {
    setSelectedChoice(choice);
    onNotify(
      choice === 'saved'
        ? 'Selected saved profile. Tap Continue below to proceed.'
        : 'Selected new application template. Tap Continue below to proceed.'
    );
  };

  const handleContinue = () => {
    if (selectedChoice === 'saved') {
      onSelectSavedProfile();
    } else {
      onSelectNewApplication();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Top Header */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between">
        <button
          id="btn-back-to-listing"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1 rounded-full font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1D4ED8]" />
          <span>Rental Pass · Application Setup</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-2xl w-full mx-auto my-auto py-8">
        {/* Step Indicator & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#EFF6FF] text-[#1D4ED8] text-xs font-bold px-3 py-1 rounded-full mb-3 border border-[#BFDBFE]">
            <Sparkles className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span>Saved Profile Available</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Apply with your saved profile?
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-lg mx-auto">
            Choose whether to reuse your information from {mockSavedDate} or start fresh for{' '}
            <strong className="text-gray-900">{listing.address}</strong>.
          </p>
        </div>

        {/* The Two Decisions (Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {/* OPTION 1: "Use my saved profile" */}
          <div
            id="card-use-saved-profile"
            onClick={() => handleCardClick('saved')}
            className={`rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
              selectedChoice === 'saved'
                ? 'bg-white border-2 border-[#006AFF] ring-4 ring-blue-100 shadow-lg'
                : 'bg-white border-2 border-gray-200 hover:border-gray-300 shadow-xs'
            }`}
          >
            <div className="absolute top-0 right-0 flex items-center">
              <span className="bg-[#006AFF] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-bl-lg">
                Recommended
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-[#006AFF] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6 text-[#006AFF]" />
                </div>
                {/* Radio Indicator */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                    selectedChoice === 'saved'
                      ? 'border-[#006AFF] bg-[#006AFF] text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {selectedChoice === 'saved' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-black text-gray-900 mb-1">
                Use saved profile
              </h3>

              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                Pre-fills your info, rental history, and verified documents so you can apply in minutes.
              </p>

              {/* Status Pills */}
              <div className="space-y-2 bg-[#EFF6FF] p-3 rounded-xl border border-[#BFDBFE] text-xs">
                <div className="flex items-center justify-between text-emerald-800 font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>8 of 10 sections complete</span>
                  </span>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md font-bold">Fast track</span>
                </div>

                <div className="flex items-center gap-1.5 text-[#1D4ED8] text-[11px] font-medium">
                  <AlertCircle className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
                  <span>2 items need quick review</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>~2 minutes</span>
              </span>
              <span className={`font-bold ${selectedChoice === 'saved' ? 'text-[#006AFF]' : 'text-gray-500'}`}>
                {selectedChoice === 'saved' ? 'Selected' : 'Select'}
              </span>
            </div>
          </div>

          {/* OPTION 2: "Start a new application" */}
          <div
            id="card-start-new-application"
            onClick={() => handleCardClick('new')}
            className={`rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between group ${
              selectedChoice === 'new'
                ? 'bg-white border-2 border-[#006AFF] ring-4 ring-blue-100 shadow-lg'
                : 'bg-white border-2 border-gray-200 hover:border-gray-300 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <PlusCircle className="w-6 h-6 text-gray-700" />
                </div>
                {/* Radio Indicator */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                    selectedChoice === 'new'
                      ? 'border-[#006AFF] bg-[#006AFF] text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {selectedChoice === 'new' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-black text-gray-900 mb-1">
                Start fresh
              </h3>

              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                Fill out a blank application. Useful if your income, employer, or details have changed.
              </p>

              {/* Status Pills */}
              <div className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs">
                <div className="flex items-center gap-1.5 text-gray-700 font-semibold">
                  <User className="w-3.5 h-3.5 text-gray-500" />
                  <span>Blank template</span>
                </div>
                <div className="text-[11px] text-gray-500">
                  Past saved records will not be imported.
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>~10 minutes</span>
              </span>
              <span className={`font-bold ${selectedChoice === 'new' ? 'text-[#006AFF]' : 'text-gray-500'}`}>
                {selectedChoice === 'new' ? 'Selected' : 'Select'}
              </span>
            </div>
          </div>
        </div>

        {/* Phase 3 Explicit Continue Action (Second Tap) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="btn-continue-profile-decision"
            onClick={handleContinue}
            className="w-full sm:w-auto min-w-[280px] py-3.5 px-8 rounded-xl bg-[#006AFF] hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Explanatory note */}
        <div className="text-center text-xs text-gray-400 mt-4">
          You can edit any details before submitting.
        </div>
      </div>

      {/* Footer Info Pill */}
      <div className="max-w-3xl w-full mx-auto text-center text-xs text-gray-500 py-2 border-t border-gray-200/80">
        <span>Applying to: {listing.address}, {listing.unit}</span>
      </div>
    </div>
  );
};

