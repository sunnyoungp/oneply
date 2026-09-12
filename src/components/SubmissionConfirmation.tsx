import React from 'react';
import {
  CheckCircle2,
  Calendar,
  Building,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  FileText,
  Mail,
  Home,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ListingDetails, ApplicationType, ProfileFormData } from '../types';
import { Button } from './ui/Button';

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
        <Button
          id="btn-confirm-return-listing"
          variant="secondary"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={onReturnToListing}
        >
          Back
        </Button>
      </div>

      {/* Main Confirmation Card */}
      <div className="max-w-2xl w-full mx-auto my-auto py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl text-center">
          {/* Animated Success Badge */}
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center mb-5 ring-8 ring-emerald-50 animate-bounce duration-1000">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            Application submitted!
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">
            Sent directly to{' '}
            <strong className="text-gray-900">{listing.managementCompany}</strong> for{' '}
            <strong className="text-gray-900">{listing.address}, {listing.unit}</strong>.
          </p>

          {/* Submission Info Box */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-xs text-left mb-6 space-y-2.5">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Application:</span>
              <span className="font-bold text-gray-800 uppercase tracking-wide">
                {applicationType === 'solo' ? 'Solo' : 'Group (3 Roommates)'}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Submitted:</span>
              <span className="font-medium text-gray-800">
                September 12, 2026 · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EDT
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Contact:</span>
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
                  Match Fit: Strong (94%)
                </span>
                <span className="text-[10px] bg-blue-200/70 text-blue-900 font-bold px-2.5 py-1 rounded-md tracking-wider">
                  ESTIMATE ONLY
                </span>
              </div>
              <p className="text-blue-900 leading-relaxed text-xs">
                Your income, credit authorization, and cosigner meet the landlord&apos;s published criteria.
              </p>
              <p className="text-[11px] text-blue-700 italic">
                *Note: Estimate only; does not guarantee approval.
              </p>
            </div>
          </div>

          {/* Action Navigation (Zero dead ends) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              id="btn-return-to-listing"
              type="button"
              variant="secondary"
              size="md"
              onClick={onReturnToListing}
            >
              Back
            </Button>

            <Button
              id="btn-view-applications"
              type="button"
              variant="primary"
              size="lg"
              leftIcon={<FileText className="w-4 h-4" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={onViewApplications}
            >
              Applications
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-3xl w-full mx-auto text-center text-xs text-gray-500 py-2">
        <span>Submission Confirmation &amp; Match Likelihood</span>
      </div>
    </div>
  );
};
