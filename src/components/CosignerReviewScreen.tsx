import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  DollarSign,
  Briefcase,
  FileText,
  Lock,
  ArrowRight,
  ArrowLeft,
  Check,
  Edit2,
  PenTool,
  ExternalLink,
} from 'lucide-react';
import { CosignerData, ListingDetails } from '../types';

interface CosignerReviewScreenProps {
  listing: ListingDetails;
  applicantName: string;
  cosignerData: CosignerData;
  onConfirmAndSign: (updatedData: CosignerData) => void;
  onReturnToApplicantProfile: () => void;
  onNotify: (msg: string) => void;
}

export const CosignerReviewScreen: React.FC<CosignerReviewScreenProps> = ({
  listing,
  applicantName,
  cosignerData,
  onConfirmAndSign,
  onReturnToApplicantProfile,
  onNotify,
}) => {
  const [isEverythingCorrect, setIsEverythingCorrect] = useState(true);
  const [typedSignature, setTypedSignature] = useState(cosignerData.fullName);
  const [agreedToCreditCheck, setAgreedToCreditCheck] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Local editable draft state if cosigner wants to tweak
  const [editedEmployer, setEditedEmployer] = useState(cosignerData.employer);
  const [editedIncome, setEditedIncome] = useState(cosignerData.monthlyIncome);

  const canSubmitSignoff = agreedToCreditCheck && typedSignature.trim().length > 2;

  const handleFinalConfirm = () => {
    if (!canSubmitSignoff) {
      onNotify('Please sign and accept the Guarantor Credit-Check authorization.');
      return;
    }

    const confirmedCosigner: CosignerData = {
      ...cosignerData,
      employer: editedEmployer,
      monthlyIncome: editedIncome,
      status: 'confirmed',
      signedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onConfirmAndSign(confirmedCosigner);
    onNotify(`Guarantor signed! Returning to ${applicantName}'s profile with status: Confirmed ✓`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Demo Simulation Bar */}
      <div className="max-w-3xl w-full mx-auto bg-blue-950/80 border border-blue-500/30 rounded-2xl p-3 px-4 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 text-blue-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold">Cosigner Recipient Link Preview:</span>
          <span>Viewing as <strong>{cosignerData.fullName}</strong> ({cosignerData.relationship})</span>
        </div>
        <button
          onClick={onReturnToApplicantProfile}
          className="text-xs text-blue-300 hover:text-white underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to {applicantName}&apos;s profile</span>
        </button>
      </div>

      {/* Main Review Container */}
      <div className="max-w-2xl w-full mx-auto my-auto py-8">
        <div className="bg-slate-800/90 rounded-3xl border border-slate-700 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="mb-6 pb-4 border-b border-slate-700">
            <div className="inline-flex items-center gap-1.5 bg-blue-600/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-blue-500/30">
              <Lock className="w-3.5 h-3.5" />
              <span>One-Time Delegated Cosigner Authorization</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {applicantName} has drafted your cosigner guarantee
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              For lease application at <strong className="text-white">{listing.address}, {listing.unit}</strong> (${listing.rent.toLocaleString()}/mo). Please review your pre-filled details below and provide legal sign-off.
            </p>
          </div>

          {/* Pre-filled Draft Card */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pre-Filled Information
              </span>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Done editing' : 'Edit details'}</span>
              </button>
            </div>

            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-700 text-xs space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Full Name</span>
                  <span className="font-semibold text-white text-sm">{cosignerData.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Relationship</span>
                  <span className="font-semibold text-white text-sm">{cosignerData.relationship}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[11px]">Employer</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedEmployer}
                      onChange={(e) => setEditedEmployer(e.target.value)}
                      className="bg-slate-800 border border-slate-600 rounded-lg px-2 py-1 text-xs text-white w-full mt-1"
                    />
                  ) : (
                    <span className="font-semibold text-white">{editedEmployer}</span>
                  )}
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Monthly Gross Income</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedIncome}
                      onChange={(e) => setEditedIncome(Number(e.target.value))}
                      className="bg-slate-800 border border-slate-600 rounded-lg px-2 py-1 text-xs text-white w-full mt-1"
                    />
                  ) : (
                    <span className="font-semibold text-emerald-400 text-sm">
                      ${editedIncome.toLocaleString()}/mo
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-slate-300">
                <span>Verified Income Document Attached:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified W-2 &amp; Direct Deposit</span>
                </span>
              </div>
            </div>
          </div>

          {/* Toggle 1: "Everything correct?" */}
          <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-700 mb-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-bold text-white text-sm">Is this information correct?</span>
                <p className="text-[11px] text-slate-400">Confirm accuracy of relationship, income, and employer</p>
              </div>
            </div>

            <button
              type="button"
              id="btn-toggle-correct"
              onClick={() => {
                setIsEverythingCorrect(!isEverythingCorrect);
                onNotify(isEverythingCorrect ? 'Marked as needing review' : 'Confirmed everything is correct');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
                isEverythingCorrect
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-700 text-slate-300 border border-slate-600'
              }`}
            >
              {isEverythingCorrect && <Check className="w-3.5 h-3.5" />}
              <span>{isEverythingCorrect ? 'Confirmed Correct' : 'Click to confirm'}</span>
            </button>
          </div>

          {/* ========================================================= */}
          {/* DISTINCT SIGNATURE FIELD SPECIFICALLY LABELED FOR CREDIT-CHECK AUTHORIZATION */}
          {/* (Visually separate from general confirm step, representing specific legal consent) */}
          {/* ========================================================= */}
          <div
            id="distinct-credit-auth-section"
            className="bg-linear-to-br from-blue-950/70 to-slate-900 rounded-2xl p-5 border-2 border-blue-500/40 shadow-inner mb-6 space-y-4"
          >
            <div className="flex items-center gap-2 text-blue-300 pb-2 border-b border-blue-500/20">
              <PenTool className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Legal Guarantor Authorization &amp; Soft Credit Check Consent
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              By typing your legal name below, you authorize Lobos Management and Rental Pass to perform a soft credit check (with no impact on your credit score) and agree to serve as financial guarantor for {applicantName} for the lease term at {listing.address}.
            </p>

            {/* Checkbox for legal consent */}
            <label className="flex items-start gap-2.5 text-xs text-slate-200 cursor-pointer select-none">
              <input
                id="checkbox-credit-auth"
                type="checkbox"
                checked={agreedToCreditCheck}
                onChange={(e) => setAgreedToCreditCheck(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 h-4 w-4 bg-slate-800 border-slate-600"
              />
              <span className="leading-snug">
                I acknowledge and execute this credit authorization legally under the E-SIGN Act.
              </span>
            </label>

            {/* Distinct signature field */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Type Full Legal Signature
              </label>
              <div className="relative">
                <input
                  id="input-cosigner-signature"
                  type="text"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  placeholder="Type legal name..."
                  className="w-full bg-slate-950 border-2 border-blue-400/60 rounded-xl px-4 py-2.5 text-base font-serif italic text-blue-200 focus:outline-none focus:border-blue-400 tracking-wider shadow-inner"
                />
                <span className="absolute right-3 top-3 text-[10px] text-blue-400 font-mono">
                  E-SIGNED
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onReturnToApplicantProfile}
              className="w-full sm:w-auto text-xs text-slate-400 hover:text-white px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Cancel &amp; return to profile
            </button>

            <button
              id="btn-confirm-cosigner-guarantee"
              type="button"
              disabled={!canSubmitSignoff}
              onClick={handleFinalConfirm}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Confirm &amp; Sign Guarantee</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-2xl w-full mx-auto text-center text-xs text-slate-400 py-2">
        <span>Step 8: Delegated Cosigner Flow · Pre-filled draft confirmation screen</span>
      </div>
    </div>
  );
};
