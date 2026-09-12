import React from 'react';
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
  Building,
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
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Top Header */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between">
        <button
          id="btn-back-to-handoff"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to handoff</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Rental Pass · Step 5 of 12</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-2xl w-full mx-auto my-auto py-8">
        {/* Step Indicator & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Returning Applicant Detected</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            We found your saved profile from {mockSavedDate}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-lg mx-auto">
            You can reuse your verified identity, rental references, and background disclosures, or start a fresh blank application for{' '}
            <strong className="text-gray-900">{listing.address}</strong>.
          </p>
        </div>

        {/* The Two Decisions (Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {/* OPTION 1: "Use my saved profile" */}
          <div
            id="card-use-saved-profile"
            onClick={() => {
              onNotify('Selected: Use saved profile (with pre-filled data & flagged update fields)');
              onSelectSavedProfile();
            }}
            className="bg-white rounded-2xl p-6 border-2 border-blue-500 hover:border-blue-600 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ring-2 ring-blue-50"
          >
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-bl-lg">
              Recommended
            </div>

            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center justify-between">
                <span>Use my saved profile</span>
              </h3>

              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                Pre-populates your verified personal info, past rental history, credit authorization, and background disclosures.
              </p>

              {/* Status Pills */}
              <div className="space-y-2 bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-xs">
                <div className="flex items-center justify-between text-emerald-700 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>8 of 10 sections complete</span>
                  </span>
                  <span className="text-[11px] bg-emerald-100 px-1.5 py-0.2 rounded">Fast track</span>
                </div>

                <div className="flex items-center gap-1.5 text-amber-800 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>2 fields flagged to verify (Employer &amp; recent pay stub)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>Takes ~2 minutes</span>
              </span>
              <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Select</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* OPTION 2: "Start a new application" */}
          <div
            id="card-start-new-application"
            onClick={() => {
              onNotify('Selected: Start a new application (blank slate)');
              onSelectNewApplication();
            }}
            className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-gray-400 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <PlusCircle className="w-6 h-6 text-gray-700" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Start a new application
              </h3>

              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                Begin with an empty form. Best if your income, employer, or primary details have completely changed.
              </p>

              {/* Status Pills */}
              <div className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs">
                <div className="flex items-center gap-1.5 text-gray-700">
                  <User className="w-3.5 h-3.5 text-gray-500" />
                  <span>Empty template — fill from scratch</span>
                </div>
                <div className="text-[11px] text-gray-500">
                  Previous saved records will not be imported into this application.
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>Takes ~10 minutes</span>
              </span>
              <span className="text-xs font-bold text-gray-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Select</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Explanatory note */}
        <div className="text-center text-xs text-gray-500">
          Both options direct to the exact same unified profile component — pre-filled or blank.
        </div>
      </div>

      {/* Footer Info Pill */}
      <div className="max-w-3xl w-full mx-auto text-center text-xs text-gray-500 py-2 border-t border-gray-200/80">
        <span>Target Listing: {listing.address}, {listing.unit} ({listing.managementCompany})</span>
      </div>
    </div>
  );
};
