import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  User,
  Building,
  Home,
  ArrowRight,
  ArrowLeft,
  Users,
  AlertTriangle,
  Sparkles,
  Lock,
} from 'lucide-react';
import { ListingDetails, ProfileFormData, ApplicationType, Roommate } from '../types';

interface SubmissionStepProps {
  listing: ListingDetails;
  formData: ProfileFormData;
  applicationType: ApplicationType;
  roommates: Roommate[];
  currentUser: string;
  onSubmit: () => void;
  onBackToProfile: () => void;
  onNotify: (msg: string) => void;
}

export const SubmissionStep: React.FC<SubmissionStepProps> = ({
  listing,
  formData,
  applicationType,
  roommates,
  currentUser,
  onSubmit,
  onBackToProfile,
  onNotify,
}) => {
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      onNotify('Please agree to application submission terms.');
      return;
    }

    if (applicationType === 'solo') {
      onNotify('Application submitted! Routing directly to Step 11 Confirmation.');
    } else {
      onNotify(`Your profile submitted! Routing to Step 10 Group Status Dashboard.`);
    }

    onSubmit();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Top Bar */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between pb-4 border-b border-gray-200">
        <button
          id="btn-back-from-submit"
          onClick={onBackToProfile}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to edit profile (Step 7)</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Rental Pass · Step 9 of 12</span>
        </div>
      </div>

      {/* Main Review Card */}
      <div className="max-w-2xl w-full mx-auto my-auto py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Profile Verified &amp; Complete</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Ready to submit your application
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-md mx-auto">
              Review your submission packet for{' '}
              <strong className="text-gray-900">{listing.address}, {listing.unit}</strong> before transmitting to {listing.managementCompany}.
            </p>
          </div>

          {/* Review Packet Cards */}
          <div className="space-y-4 mb-6 text-xs">
            {/* Applicant Summary */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="flex items-center justify-between text-gray-700 font-bold">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Applicant: {formData.fullName}</span>
                </span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                  100% Ready
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-gray-600 pt-1">
                <div>Employer: <strong>{formData.employer}</strong></div>
                <div>Income: <strong>${formData.monthlyIncome.toLocaleString()}/mo</strong></div>
                <div>Move-in: <strong>{formData.desiredMoveIn || 'Oct 1, 2026'}</strong></div>
                <div>Credit Auth: <strong>Signed ✓</strong></div>
              </div>
            </div>

            {/* Cosigner Summary if present */}
            {formData.cosigner && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1 text-indigo-950">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Cosigner / Guarantor: {formData.cosigner.fullName} ({formData.cosigner.relationship})</span>
                  </span>
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px] font-semibold">
                    {formData.cosigner.status === 'confirmed' ? 'Confirmed ✓' : 'Pending'}
                  </span>
                </div>
                <div className="text-[11px] text-indigo-700">
                  Income: ${formData.cosigner.monthlyIncome.toLocaleString()}/mo · Soft credit check authorized
                </div>
              </div>
            )}

            {/* Branching routing indicator */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-950 leading-relaxed">
                {applicationType === 'solo' ? (
                  <div>
                    <strong className="text-blue-900 font-bold block mb-0.5">Solo Application Workflow:</strong>
                    Tapping submit transmits your file immediately to Lobos Management and proceeds directly to the <strong>Confirmation Screen (Step 11)</strong>.
                  </div>
                ) : (
                  <div>
                    <strong className="text-indigo-900 font-bold block mb-0.5">Group Application Workflow ({roommates.length + 1} Renters):</strong>
                    Tapping submit locks your individual profile and takes you to the <strong>Step 10 Group Status Dashboard</strong> to track Priya and Sam&apos;s submissions.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Legal agreement checkbox */}
          <label className="flex items-start gap-2.5 text-xs text-gray-700 mb-6 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span className="leading-snug">
              I certify that all self-reported information is true and accurate. I authorize {listing.managementCompany} to review my Rental Pass packet for unit {listing.unit}.
            </span>
          </label>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onBackToProfile}
              className="w-full sm:w-auto text-xs text-gray-600 hover:text-gray-900 font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Review again
            </button>

            <button
              id="btn-submit-application"
              type="button"
              onClick={handleSubmit}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Submit application</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-3xl w-full mx-auto text-center text-xs text-gray-500 py-2">
        <span>Step 9: Individual Application Submission</span>
      </div>
    </div>
  );
};
