import React, { useState } from 'react';
import {
  User,
  Briefcase,
  Home,
  FileCheck2,
  ShieldCheck,
  PhoneCall,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Paperclip,
  Upload,
  Eye,
  Check,
  Users,
  ChevronDown,
} from 'lucide-react';
import { ListingDetails, ProfileFormData, ApplicationType, Roommate, CosignerData } from '../types';
import { Button } from './ui/Button';

interface ProfileStepProps {
  listing: ListingDetails;
  isSavedProfile: boolean;
  formData: ProfileFormData;
  onChangeFormData: (updated: ProfileFormData) => void;
  applicationType: ApplicationType;
  roommates: Roommate[];
  currentUser: string;
  onSwitchUser: (userName: string) => void;
  onOpenCosignerDraft: () => void;
  onOpenCosignerPreview: () => void;
  onContinueToSubmit: () => void;
  onBack: () => void;
  onNotify: (msg: string) => void;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({
  listing,
  isSavedProfile,
  formData,
  onChangeFormData,
  applicationType,
  roommates,
  currentUser,
  onSwitchUser,
  onOpenCosignerDraft,
  onOpenCosignerPreview,
  onContinueToSubmit,
  onBack,
  onNotify,
}) => {
  // Track resolved state for flagged fields
  const [isEmployerUpdated, setIsEmployerUpdated] = useState(false);
  const [isPaystubUploaded, setIsPaystubUploaded] = useState(false);

  const updateField = <K extends keyof ProfileFormData>(field: K, value: ProfileFormData[K]) => {
    onChangeFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSimulateDocUpload = () => {
    setIsPaystubUploaded(true);
    updateField('incomeDocAttached', true);
    onNotify('Simulated latest pay stub uploaded successfully (Sept 2026 Paystub.pdf)');
  };

  const handleEmployerBlur = () => {
    if (formData.employer && !formData.employer.includes('Need to update')) {
      setIsEmployerUpdated(true);
    }
  };

  const canProceed =
    formData.fullName.trim() !== '' &&
    (formData.cosigner?.status !== 'pending' || true); // can proceed or warn

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-3 sm:p-8 font-sans">
      {/* Top sticky navigation bar (Zero dead ends) */}
      <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-md pb-4 pt-2 border-b border-gray-200 -mx-3 sm:-mx-8 px-3 sm:px-8 shadow-2xs">
        <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
          <Button
            id="btn-back-to-step-6"
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={onBack}
          >
            Back
          </Button>

          <div className="flex items-center gap-2">
            {applicationType === 'group' && (
              <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs px-2.5 py-1 rounded-full font-medium">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Roommate Session:</span>
                <select
                  value={currentUser}
                  onChange={(e) => onSwitchUser(e.target.value)}
                  className="bg-transparent font-bold cursor-pointer focus:outline-none"
                >
                  <option value="Jordan Reed">Jordan Reed (You)</option>
                  <option value="Priya Sharma">Priya Sharma</option>
                  <option value="Sam Chen">Sam Chen</option>
                </select>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Rental Pass · Application Profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-4xl w-full mx-auto py-6">
        {/* Header Title with Reusable Context */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1">
                Rental Profile
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                {currentUser}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Applying for <strong className="text-gray-900">{listing.address}, {listing.unit}</strong>
              </p>
            </div>

            {isSavedProfile && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold">Saved profile loaded</div>
                  <div className="text-[11px] text-emerald-700">Pre-filled with your saved information</div>
                </div>
              </div>
            )}
          </div>

          {/* Attention Banner if Saved Profile has flagged fields */}
          {isSavedProfile && (!isEmployerUpdated || !isPaystubUploaded) && (
            <div className="mt-4 bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-amber-950">Update needed:</span>{' '}
                Please update your employer and attach a recent pay stub.
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* THE 7 SECTIONS IN EXACT REQUIRED ORDER */}
        {/* ========================================================= */}

        <div className="space-y-6">
          {/* SECTION 1: Personal & ID */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">1. Personal &amp; ID</h2>
                  <p className="text-[11px] text-gray-500">Identity and credit check authorization</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Verified ✓
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => updateField('dob', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Government ID (Driver&apos;s License/Passport)</label>
                <input
                  type="text"
                  value={formData.govIdNumber}
                  onChange={(e) => updateField('govIdNumber', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Social Security Number (Last 4 digits)</label>
                <input
                  type="password"
                  maxLength={4}
                  value={formData.ssnLastFour}
                  onChange={(e) => updateField('ssnLastFour', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Credit-check authorization */}
            <div className="mt-4 p-3 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-gray-800">
                  TransUnion &amp; Experian Soft Credit-Check Authorization
                </span>
              </div>
              <span className="font-bold text-xs text-emerald-700 flex items-center gap-1 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                <Check className="w-3.5 h-3.5" />
                <span>Signed ✓</span>
              </span>
            </div>
          </div>

          {/* SECTION 2: Employment & Income */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">2. Employment &amp; Income</h2>
                  <p className="text-[11px] text-gray-500">Current employment and monthly compensation</p>
                </div>
              </div>

              {isSavedProfile && !isEmployerUpdated && (
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                  <AlertCircle className="w-3 h-3" />
                  <span>Update Flagged</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700">Current Employer</label>
                  {isSavedProfile && !isEmployerUpdated && (
                    <span className="text-[10px] text-amber-700 font-semibold">Flagged: Confirm current</span>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.employer}
                  onBlur={handleEmployerBlur}
                  onChange={(e) => {
                    updateField('employer', e.target.value);
                    setIsEmployerUpdated(true);
                  }}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 ${
                    isSavedProfile && !isEmployerUpdated
                      ? 'bg-amber-50/70 border-2 border-amber-400 text-amber-950 focus:bg-white focus:ring-amber-500'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 focus:bg-white focus:ring-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Gross Monthly Income ($)</label>
                <input
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) => updateField('monthlyIncome', Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Listing rent is ${listing.rent.toLocaleString()}/mo (meets standard 3x income rule)
                </span>
              </div>
            </div>

            {/* Income verification docs row */}
            <div className="mt-4 p-3.5 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-between flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-gray-500" />
                <div>
                  <span className="font-semibold text-gray-900">Income Verification Docs</span>
                  <p className="text-[11px] text-gray-500">W-2, offer letter, or 2 recent paystubs</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isPaystubUploaded || formData.incomeDocAttached ? (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sept_2026_Paystub.pdf Attached</span>
                  </span>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    leftIcon={<Upload className="w-3.5 h-3.5" />}
                    onClick={handleSimulateDocUpload}
                  >
                    Attach paystub
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: Household */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">3. Household</h2>
                  <p className="text-[11px] text-gray-500">Occupants, pets, and lease terms</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Total Occupants (All living there)
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.occupantsCount}
                  onChange={(e) => updateField('occupantsCount', Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Occupant Names</label>
                <input
                  type="text"
                  placeholder="Names of non-signing occupants"
                  value={formData.occupantsNames}
                  onChange={(e) => updateField('occupantsNames', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Pets (Type, Breed, Weight)</label>
                <input
                  type="text"
                  value={formData.petDetails}
                  onChange={(e) => updateField('petDetails', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[10px] text-emerald-600 font-medium mt-1 block">
                  Property is pet-friendly (Cats/Small dogs permitted)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Desired Move-in</label>
                  <input
                    type="date"
                    value={formData.desiredMoveIn}
                    onChange={(e) => updateField('desiredMoveIn', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Lease Term</label>
                  <select
                    value={formData.leaseTermMonths}
                    onChange={(e) => updateField('leaseTermMonths', Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={12}>12 Months</option>
                    <option value={15}>15 Months</option>
                    <option value={24}>24 Months</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Rental History */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">4. Rental History</h2>
                  <p className="text-[11px] text-gray-500">Past residential addresses &amp; landlord contact</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Past Address (Last 2 Years)</label>
                <input
                  type="text"
                  value={formData.pastAddress}
                  onChange={(e) => updateField('pastAddress', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Past Landlord / Management Reference</label>
                  <input
                    type="text"
                    value={formData.pastLandlord}
                    onChange={(e) => updateField('pastLandlord', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Reason for Leaving</label>
                  <input
                    type="text"
                    value={formData.reasonForLeaving}
                    onChange={(e) => updateField('reasonForLeaving', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: Background Disclosures */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">5. Background Disclosures</h2>
                  <p className="text-[11px] text-gray-500">Standard self-reported yes/no rows</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Self-Reported ✓
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Prior Eviction */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="font-medium text-gray-800">Have you ever had a prior eviction filed against you?</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="eviction"
                      value="no"
                      checked={formData.priorEviction === 'no'}
                      onChange={() => updateField('priorEviction', 'no')}
                      className="text-blue-600"
                    />
                    <span>No</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="eviction"
                      value="yes"
                      checked={formData.priorEviction === 'yes'}
                      onChange={() => updateField('priorEviction', 'yes')}
                      className="text-blue-600"
                    />
                    <span>Yes</span>
                  </label>
                </div>
              </div>

              {/* Bankruptcy */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="font-medium text-gray-800">Have you declared bankruptcy in the past 7 years?</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="bankruptcy"
                      value="no"
                      checked={formData.bankruptcy === 'no'}
                      onChange={() => updateField('bankruptcy', 'no')}
                      className="text-blue-600"
                    />
                    <span>No</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="bankruptcy"
                      value="yes"
                      checked={formData.bankruptcy === 'yes'}
                      onChange={() => updateField('bankruptcy', 'yes')}
                      className="text-blue-600"
                    />
                    <span>Yes</span>
                  </label>
                </div>
              </div>

              {/* Criminal History */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="font-medium text-gray-800">Do you have any felony criminal convictions?</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="criminal"
                      value="no"
                      checked={formData.criminalHistory === 'no'}
                      onChange={() => updateField('criminalHistory', 'no')}
                      className="text-blue-600"
                    />
                    <span>No</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="criminal"
                      value="yes"
                      checked={formData.criminalHistory === 'yes'}
                      onChange={() => updateField('criminalHistory', 'yes')}
                      className="text-blue-600"
                    />
                    <span>Yes</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6: Emergency Contact */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">6. Emergency Contact</h2>
                  <p className="text-[11px] text-gray-500">Primary emergency point of contact</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={formData.emergencyName}
                  onChange={(e) => updateField('emergencyName', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => updateField('emergencyPhone', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Relationship</label>
                <input
                  type="text"
                  value={formData.emergencyRelation}
                  onChange={(e) => updateField('emergencyRelation', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 7: COSIGNER ROW (Styled as single row with "+ Add") */}
          {/* ========================================================= */}
          <div
            id="section-cosigner-row"
            className={`rounded-2xl p-5 sm:p-6 border transition-all ${
              formData.cosigner?.status === 'confirmed'
                ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                : formData.cosigner?.status === 'pending'
                ? 'bg-[#EFF6FF]/60 border-[#BFDBFE] shadow-xs'
                : 'bg-white border-gray-200 shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    formData.cosigner?.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : formData.cosigner?.status === 'pending'
                      ? 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-gray-900">7. Cosigner / Guarantor</h2>
                    <span className="text-[11px] bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-medium">
                      Optional
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {formData.cosigner?.status === 'confirmed'
                      ? `Confirmed: ${formData.cosigner.fullName} (${formData.cosigner.relationship})`
                      : formData.cosigner?.status === 'pending'
                      ? `Awaiting confirmation from ${formData.cosigner.fullName}`
                      : 'Add a cosigner to strengthen your application.'}
                  </p>
                </div>
              </div>

              {/* Status or Add Trigger */}
              <div className="flex items-center gap-2 shrink-0">
                {formData.cosigner?.status === 'confirmed' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Confirmed</span>
                    </span>
                    <button
                      type="button"
                      onClick={onOpenCosignerDraft}
                      className="text-xs text-gray-600 hover:text-gray-900 font-semibold underline p-1"
                    >
                      Edit
                    </button>
                  </div>
                ) : formData.cosigner?.status === 'pending' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#1D4ED8]" />
                      <span>Pending</span>
                    </span>
                    <Button
                      type="button"
                      id="btn-preview-cosigner-link"
                      variant="outline"
                      size="sm"
                      leftIcon={<Eye className="w-3.5 h-3.5 text-[#1D4ED8]" />}
                      onClick={onOpenCosignerPreview}
                    >
                      Preview
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    id="btn-add-cosigner"
                    variant="primary"
                    size="sm"
                    leftIcon={<UserPlus className="w-4 h-4" />}
                    onClick={onOpenCosignerDraft}
                  >
                    Add cosigner
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Submission Bar (Zero dead ends) */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-500">
            {formData.cosigner?.status === 'pending' ? (
              <span className="text-[#1D4ED8] bg-[#EFF6FF] px-2.5 py-1 rounded-lg border border-[#BFDBFE] font-medium inline-block">
                Cosigner invitation is pending confirmation.
              </span>
            ) : (
              <span>Profile complete.</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full sm:w-auto"
              onClick={onBack}
            >
              Back
            </Button>

            <Button
              id="btn-continue-to-submit"
              type="button"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={onContinueToSubmit}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-gray-500 py-3 border-t border-gray-200">
        <span>Rental Pass · Reusable Profile</span>
      </div>
    </div>
  );
};
