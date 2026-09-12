import React, { useState } from 'react';
import {
  CheckCircle2,
  Building,
  User,
  DollarSign,
  Briefcase,
  Lock,
  ArrowRight,
  ArrowLeft,
  Check,
  Edit2,
  PenTool,
  ShieldCheck,
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
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Top Navigation & Simulation Indicator */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between flex-wrap gap-3">
        <button
          id="btn-return-applicant-profile"
          onClick={onReturnToApplicantProfile}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Cosigner Preview · <strong>{cosignerData.fullName}</strong></span>
        </div>
      </div>

      {/* Main Review Container */}
      <div className="max-w-2xl w-full mx-auto my-auto py-6 sm:py-8">
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="mb-6 pb-5 border-b border-gray-100">
            <div className="inline-flex items-center gap-1.5 bg-[#EFF6FF] text-[#1D4ED8] text-xs font-bold px-3 py-1 rounded-full mb-3 border border-[#BFDBFE]">
              <Lock className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span>Guarantor Sign-Off</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Review your cosigner guarantee
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1.5 leading-relaxed">
              {applicantName} pre-filled your info for{' '}
              <strong className="text-gray-900">{listing.address}, {listing.unit}</strong>. Please review and sign below.
            </p>
          </div>

          {/* Pre-filled Draft Card */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Pre-Filled Information
              </span>
              <button
                type="button"
                id="btn-edit-cosigner-info"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-[#006AFF] hover:text-blue-700 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Save' : 'Edit'}</span>
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200 text-xs space-y-3.5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 block text-[11px] font-medium">Full Name</span>
                  <span className="font-bold text-gray-900 text-sm mt-0.5 block">{cosignerData.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px] font-medium">Relationship</span>
                  <span className="font-bold text-gray-900 text-sm mt-0.5 block">{cosignerData.relationship}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                <div>
                  <span className="text-gray-500 block text-[11px] font-medium">Employer</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedEmployer}
                      onChange={(e) => setEditedEmployer(e.target.value)}
                      className="bg-white border border-gray-300 focus:border-[#006AFF] focus:ring-1 focus:ring-[#006AFF] rounded-lg px-2.5 py-1.5 text-xs text-gray-900 w-full mt-1 outline-none"
                    />
                  ) : (
                    <span className="font-bold text-gray-900 text-sm mt-0.5 block">{editedEmployer}</span>
                  )}
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px] font-medium">Monthly Gross Income</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedIncome}
                      onChange={(e) => setEditedIncome(Number(e.target.value))}
                      className="bg-white border border-gray-300 focus:border-[#006AFF] focus:ring-1 focus:ring-[#006AFF] rounded-lg px-2.5 py-1.5 text-xs text-gray-900 w-full mt-1 outline-none"
                    />
                  ) : (
                    <span className="font-bold text-emerald-700 text-sm mt-0.5 block">
                      ${editedIncome.toLocaleString()}/mo
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-gray-600">
                <span className="text-xs">Verified Income Document Attached:</span>
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified W-2 &amp; Direct Deposit</span>
                </span>
              </div>
            </div>
          </div>

          {/* Toggle: "Is this information correct?" */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 mb-6 flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className={`w-4 h-4 ${isEverythingCorrect ? 'text-emerald-600' : 'text-gray-400'}`} />
              <div>
                <span className="font-bold text-gray-900 text-sm">Is this information correct?</span>
                <p className="text-[11px] text-gray-500">Confirm accuracy of relationship, income, and employer</p>
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
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              {isEverythingCorrect && <Check className="w-3.5 h-3.5" />}
              <span>{isEverythingCorrect ? 'Confirmed Correct' : 'Click to confirm'}</span>
            </button>
          </div>

          {/* ========================================================= */}
          {/* DISTINCT SIGNATURE FIELD SPECIFICALLY LABELED FOR CREDIT-CHECK AUTHORIZATION */}
          {/* ========================================================= */}
          <div
            id="distinct-credit-auth-section"
            className="bg-[#EFF6FF] rounded-2xl p-5 border-2 border-[#BFDBFE] mb-6 space-y-4 shadow-xs"
          >
            <div className="flex items-center gap-2 text-[#1D4ED8] pb-2 border-b border-blue-200">
              <PenTool className="w-4 h-4 text-[#006AFF]" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Guarantor Consent &amp; Soft Credit Check
              </span>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed">
              By typing your name, you authorize a soft credit check (no score impact) and agree to serve as financial cosigner for {applicantName} for this lease.
            </p>

            {/* Checkbox for legal consent */}
            <label className="flex items-start gap-2.5 text-xs text-gray-800 cursor-pointer select-none">
              <input
                id="checkbox-credit-auth"
                type="checkbox"
                checked={agreedToCreditCheck}
                onChange={(e) => setAgreedToCreditCheck(e.target.checked)}
                className="mt-0.5 rounded text-[#006AFF] focus:ring-[#006AFF] h-4 w-4 border-gray-300"
              />
              <span className="leading-snug">
                I agree to the soft credit check and accept guarantor terms.
              </span>
            </label>

            {/* Distinct signature field */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Full Legal Name
              </label>
              <div className="relative">
                <input
                  id="input-cosigner-signature"
                  type="text"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  placeholder="Your full name..."
                  className="w-full bg-white border-2 border-[#006AFF] rounded-xl px-4 py-2.5 text-base font-serif italic text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 tracking-wider shadow-xs"
                />
                <span className="absolute right-3 top-3 text-[10px] bg-blue-100 text-[#006AFF] font-bold px-2 py-0.5 rounded font-mono">
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
              className="w-full sm:w-auto text-xs text-gray-500 hover:text-gray-800 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="btn-confirm-cosigner-guarantee"
              type="button"
              disabled={!canSubmitSignoff}
              onClick={handleFinalConfirm}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#006AFF] hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Submit</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-2xl w-full mx-auto text-center text-xs text-gray-500 py-2 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Encrypted &amp; secure · Rental Pass</span>
      </div>
    </div>
  );
};
