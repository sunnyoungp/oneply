import React from 'react';
import {
  CheckCircle2,
  Calendar,
  Building,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  FileText,
  Mail,
  Home,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ListingDetails, ApplicationType, ProfileFormData } from '../types';

interface SubmissionConfirmationProps {
  listing: ListingDetails;
  applicationType: ApplicationType;
  formData: ProfileFormData;
  onViewApplications: () => void;
  onReturnToListing: () => void;
  onNotify: (msg: string) => void;
}

export const SubmissionConfirmation: React.FC<SubmissionConfirmationProps> = ({
  listing,
  applicationType,
  formData,
  onViewApplications,
  onReturnToListing,
  onNotify,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Top Bar */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between pb-4 border-b border-gray-200">
        <button
          onClick={onReturnToListing}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Back to Listing Details (Step 1)</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Rental Pass · Step 11: Application Sent</span>
        </div>
      </div>

      {/* Main Confirmation Card */}
      <div className="max-w-2xl w-full mx-auto my-auto py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl text-center">
          {/* Animated Success Badge */}
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center mb-5 ring-8 ring-emerald-50 animate-bounce duration-1000">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            Application successfully sent!
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">
            Your Rental Pass packet has been transmitted directly to{' '}
            <strong className="text-gray-900">{listing.managementCompany}</strong> for{' '}
            <strong className="text-gray-900">{listing.address}, {listing.unit}</strong>.
          </p>

          {/* Submission Info Box */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-xs text-left mb-6 space-y-2.5">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Submission Type:</span>
              <span className="font-bold text-gray-800 uppercase tracking-wide">
                {applicationType === 'solo' ? 'Solo Leaseholder' : 'Joint Group Application (3 Applicants)'}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Transmission Timestamp:</span>
              <span className="font-medium text-gray-800">
                September 12, 2026 · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EDT
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Leasing Point of Contact:</span>
              <span className="font-medium text-gray-800">
                {listing.contactPerson} ({listing.managementCompany})
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CLEARLY LABELED MOCK MATCH-LIKELIHOOD NOTE */}
          {/* (estimate only, not a guarantee) */}
          {/* ========================================================= */}
          <div
            id="match-likelihood-box"
            className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 text-xs text-left mb-6 flex items-start gap-3"
          >
            <TrendingUp className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-950 text-sm">
                  Match Likelihood: Strong Fit (94% Compatibility)
                </span>
                <span className="text-[10px] bg-blue-200/70 text-blue-900 font-semibold px-2 py-0.5 rounded">
                  ESTIMATE ONLY
                </span>
              </div>
              <p className="text-blue-900 leading-relaxed text-xs">
                Based on this listing’s stated requirements (3x rent-to-income ratio, pet guidelines, verified credit authorization, and complete cosigner backing), your profile looks like a <strong>strong fit</strong>.
              </p>
              <p className="text-[11px] text-blue-700 italic">
                *Note: This compatibility score is an automated estimate only and does not constitute a guaranteed lease offer or formal pre-approval.
              </p>
            </div>
          </div>

          {/* Action Navigation (Zero dead ends) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="btn-return-to-listing"
              type="button"
              onClick={onReturnToListing}
              className="w-full sm:w-auto px-5 py-3 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Return to Listing
            </button>

            <button
              id="btn-view-applications"
              type="button"
              onClick={onViewApplications}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <FileText className="w-4 h-4" />
              <span>View your applications (Step 12)</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-3xl w-full mx-auto text-center text-xs text-gray-500 py-2">
        <span>Step 11: Submission Confirmation &amp; Match Likelihood</span>
      </div>
    </div>
  );
};
