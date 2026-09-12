import React, { useMemo, useState } from 'react';
import {
  Search,
  Heart,
  FileText,
  Mail,
  ChevronLeft,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  UserPlus,
} from 'lucide-react';
import { ListingDetails, ProfileFormData, ApplicationType, Roommate } from '../types';
import { Button } from './ui/Button';
import { helpClass, inputClass, labelClass } from './ui/tokens';

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

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatMoney(n: number): string {
  return n.toLocaleString('en-US');
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
  const [isEmployerUpdated, setIsEmployerUpdated] = useState(false);
  const [isPaystubUploaded, setIsPaystubUploaded] = useState(false);
  const [cosignerOpen, setCosignerOpen] = useState(false);
  const [inlineCosigner, setInlineCosigner] = useState({
    fullName: formData.cosigner?.fullName ?? '',
    email: formData.cosigner?.email ?? '',
    relationship: formData.cosigner?.relationship ?? '',
  });

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

  const incomeDocReady = isPaystubUploaded || formData.incomeDocAttached;
  const employerNeedsUpdate = isSavedProfile && !isEmployerUpdated;
  const paystubNeedsUpdate = isSavedProfile && !isPaystubUploaded;
  const incomeSectionNeedsUpdate = employerNeedsUpdate || paystubNeedsUpdate;

  const incomeMultiplier = listing.minIncomeMultiplier ?? 3;
  const requiredIncome = listing.rent * incomeMultiplier;
  const incomeRatio = listing.rent > 0 && formData.monthlyIncome > 0 ? formData.monthlyIncome / listing.rent : 0;
  const incomeShortfall = requiredIncome - formData.monthlyIncome;
  const needsCosignerForIncome = formData.monthlyIncome > 0 && formData.monthlyIncome < requiredIncome;

  const aboutComplete = Boolean(
    formData.fullName.trim() && formData.dob && formData.govIdNumber.trim() && formData.ssnLastFour.trim()
  );
  const householdComplete = Boolean(formData.occupantsNames.trim() && formData.desiredMoveIn);
  const incomeFilled = Boolean(formData.employer.trim() && formData.monthlyIncome > 0);
  const historyComplete = Boolean(formData.pastAddress.trim());
  const disclosuresComplete = Boolean(formData.priorEviction && formData.bankruptcy && formData.criminalHistory);
  const emergencyComplete = Boolean(formData.emergencyName.trim() && formData.emergencyPhone.trim());
  const cosignerComplete = Boolean(formData.cosigner);

  const progressItems = [
    { id: 'sec-1', label: 'About you', complete: aboutComplete, attention: false, recommended: false },
    { id: 'sec-2', label: 'Household & lease', complete: householdComplete, attention: false, recommended: false },
    { id: 'sec-3', label: 'Income & employment', complete: incomeFilled && !incomeSectionNeedsUpdate, attention: incomeSectionNeedsUpdate, recommended: false },
    { id: 'sec-4', label: "Where you've lived", complete: historyComplete, attention: false, recommended: false },
    { id: 'sec-5', label: 'Disclosures', complete: disclosuresComplete, attention: false, recommended: false },
    { id: 'sec-6', label: 'Emergency contact', complete: emergencyComplete, attention: false, recommended: false },
    {
      id: 'sec-7',
      label: 'Cosigner',
      complete: cosignerComplete,
      attention: false,
      recommended: needsCosignerForIncome && !cosignerComplete,
    },
  ];

  const filledProgressCount = [
    aboutComplete,
    householdComplete,
    incomeFilled,
    historyComplete,
    disclosuresComplete,
    emergencyComplete,
    cosignerComplete || !needsCosignerForIncome,
  ].filter(Boolean).length;
  const progressPct = Math.round((filledProgressCount / progressItems.length) * 100);

  const canProceed = formData.fullName.trim() !== '';

  const disclosureDefs: { key: 'priorEviction' | 'bankruptcy' | 'criminalHistory'; label: string }[] = [
    { key: 'priorEviction', label: 'Has an eviction ever been filed against you?' },
    { key: 'bankruptcy', label: 'Have you declared bankruptcy in the past 7 years?' },
    { key: 'criminalHistory', label: 'Do you have any felony convictions?' },
  ];

  const userInitials = initialsFromName(currentUser);
  const listingPhoto = listing.photos?.[0]?.url;
  const hasCosigner = Boolean(formData.cosigner);
  const roommateNames = useMemo(() => roommates.map((r) => r.name), [roommates]);

  const handleToggleCosigner = () => {
    if (hasCosigner) {
      onOpenCosignerDraft();
      return;
    }
    setCosignerOpen((open) => !open);
  };

  const handleSendInlineCosigner = () => {
    if (!inlineCosigner.fullName.trim() || !inlineCosigner.email.trim()) {
      onNotify("Please enter your cosigner's name and email, or open the full invite form.");
      return;
    }
    onOpenCosignerDraft();
  };

  const handleSaveLater = () => {
    onNotify('Application saved. Your answers will carry over to your next visit.');
  };

  const pillClass = (active: boolean, tone: 'yes' | 'no') => {
    const base = 'px-5 py-2 text-sm font-bold rounded-xl cursor-pointer transition-colors min-h-[38px]';
    if (!active) {
      return `${base} text-gray-800 bg-white border border-gray-300 hover:bg-gray-50`;
    }
    return tone === 'yes'
      ? `${base} text-amber-950 bg-amber-50 border-2 border-amber-500`
      : `${base} text-white bg-[#006AFF] border-2 border-[#006AFF]`;
  };

  const navItemClass = (active?: boolean) =>
    `flex flex-col items-center gap-1 w-full py-1 text-[11px] font-semibold no-underline hover:no-underline ${
      active ? 'text-[#006AFF] font-bold' : 'text-gray-800 hover:text-[#006AFF]'
    }`;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-5 h-[60px] px-4 sm:px-6 bg-white border-b border-gray-200">
        <nav className="hidden sm:flex items-center gap-6">
          {['Buy', 'Rent', 'Sell', 'Manage rentals'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onNotify(`${item} (demo)`)}
              className={`text-[15px] font-semibold ${item === 'Rent' ? 'text-[#006AFF]' : 'text-gray-900 hover:text-[#006AFF]'}`}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-4 ml-auto">
          {applicationType === 'group' && (
            <select
              value={currentUser}
              onChange={(e) => onSwitchUser(e.target.value)}
              className="hidden md:block text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-gray-800"
              aria-label="Switch roommate session"
            >
              <option value="Jordan Reed">Jordan Reed</option>
              {roommateNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={() => onNotify('Get help (demo)')}
            className="text-[15px] font-semibold text-gray-900 hover:text-[#006AFF]"
          >
            Get help
          </button>
          <span
            className="w-9 h-9 rounded-full bg-[#006AFF] text-white text-xs font-bold flex items-center justify-center"
            title={currentUser}
          >
            {userInitials}
          </span>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[74px_minmax(0,1fr)] items-start">
        <aside className="hidden lg:flex sticky top-[60px] flex-col items-center gap-5 py-4 border-r border-gray-200 min-h-[calc(100vh-60px)] bg-white">
          <button type="button" className={navItemClass()} onClick={() => onNotify('Search listings')}>
            <Search className="w-[21px] h-[21px]" strokeWidth={2} />
            Search
          </button>
          <button type="button" className={navItemClass()} onClick={() => onNotify('Saved homes')}>
            <Heart className="w-[21px] h-[21px]" strokeWidth={2} />
            Saved
          </button>
          <button type="button" className={navItemClass(true)}>
            <FileText className="w-[21px] h-[21px]" strokeWidth={2} />
            Apply
          </button>
          <button type="button" className={navItemClass()} onClick={() => onNotify('Inbox')}>
            <Mail className="w-[21px] h-[21px]" strokeWidth={2} />
            Inbox
          </button>
        </aside>

        <div className="min-w-0">
          <div className="border-b border-gray-200">
            <div className="max-w-[1160px] mx-auto px-4 sm:px-7 py-3.5">
              <Button
                id="btn-back-to-step-6"
                variant="ghost"
                size="sm"
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                onClick={onBack}
                className="!px-1.5 !text-[15px] !font-semibold !text-gray-900 hover:!text-[#006AFF]"
              >
                Back to listing
              </Button>
            </div>
          </div>

          <div className="max-w-[1160px] mx-auto px-4 sm:px-7 py-6 pb-16 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,330px)] gap-8 items-start">
            <main className="min-w-0 flex flex-col gap-4">
              <div>
                <h1 className="m-0 mb-1.5 text-[28px] sm:text-[30px] font-bold tracking-tight text-gray-900">
                  Rental application
                </h1>
                <p className="m-0 text-base text-gray-600">
                  Fill it out once, then apply to as many participating rentals as you want for 30 days.
                </p>
                {isSavedProfile && (
                  <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">Saved profile loaded</span>
                  </div>
                )}
              </div>

              {incomeSectionNeedsUpdate && (
                <div className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-300 rounded-xl">
                  <span className="flex-none w-[22px] h-[22px] rounded-full bg-amber-700 text-white text-sm font-bold flex items-center justify-center mt-0.5">
                    !
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-bold text-amber-950">One thing left before you can submit</div>
                    <div className="text-[15px] text-amber-900 mt-0.5 leading-relaxed">
                      Confirm your current employer and attach a recent pay stub.{' '}
                      <a href="#sec-3" className="font-bold text-amber-950 underline">
                        Go to income &amp; employment
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* 1. About you */}
              <section id="sec-1" className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xs">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="m-0 mb-1 text-xl font-bold text-gray-900">1. About you</h2>
                    <p className="m-0 text-[15px] text-gray-600">Used for your identity and credit check. Only the landlord sees it.</p>
                  </div>
                  <span className="flex-none text-xs font-bold text-emerald-800 bg-emerald-50 rounded-lg px-2.5 py-1.5">
                    Verified
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className={labelClass}>Full legal name</span>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Date of birth</span>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => updateField('dob', e.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Driver&apos;s license or passport number</span>
                    <input
                      type="text"
                      value={formData.govIdNumber}
                      onChange={(e) => updateField('govIdNumber', e.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Last 4 of your SSN</span>
                    <input
                      type="password"
                      maxLength={4}
                      value={formData.ssnLastFour}
                      onChange={(e) => updateField('ssnLastFour', e.target.value)}
                      className={`${inputClass} tracking-[0.2em]`}
                    />
                  </label>
                </div>
                <div className="flex items-center justify-between gap-4 flex-wrap mt-4 px-4 py-3 bg-gray-50 rounded-xl">
                  <div className="min-w-0">
                    <div className="text-[15px] font-semibold text-gray-900">Credit and background check authorization</div>
                    <div className="text-sm text-gray-600 mt-0.5">A soft pull — it won&apos;t affect your credit score.</div>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 rounded-lg px-2.5 py-1.5">
                    {formData.creditCheckAuthSigned ? 'Signed' : 'Required'}
                  </span>
                </div>
              </section>

              {/* 2. Household & lease */}
              <section id="sec-2" className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xs">
                <div className="mb-4">
                  <h2 className="m-0 mb-1 text-xl font-bold text-gray-900">2. Household &amp; lease</h2>
                  <p className="m-0 text-[15px] text-gray-600">Who&apos;s moving in, and the terms you&apos;re asking for.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className={labelClass}>Everyone moving in</span>
                    <input
                      type="text"
                      value={formData.occupantsNames}
                      onChange={(e) => updateField('occupantsNames', e.target.value)}
                      placeholder="Names of everyone 18 or older"
                      className={inputClass}
                    />
                    <span className={helpClass}>Include anyone 18 or older — they&apos;ll each get their own check.</span>
                  </label>
                  <label className="block">
                    <span className={labelClass}>Adults on the lease</span>
                    <input
                      type="number"
                      min={1}
                      value={formData.occupantsCount}
                      onChange={(e) => updateField('occupantsCount', Number(e.target.value))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Pets</span>
                    <input
                      type="text"
                      value={formData.petDetails}
                      onChange={(e) => {
                        const value = e.target.value;
                        onChangeFormData({
                          ...formData,
                          petDetails: value,
                          hasPets: value.trim() !== '' && value.trim().toLowerCase() !== 'none',
                        });
                      }}
                      className={inputClass}
                    />
                    <span className="block text-xs text-emerald-700 font-medium mt-1.5">
                      Allowed here — pet rent may apply.
                    </span>
                  </label>
                  <label className="block">
                    <span className={labelClass}>Preferred move-in date</span>
                    <input
                      type="date"
                      value={formData.desiredMoveIn}
                      onChange={(e) => updateField('desiredMoveIn', e.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Lease length</span>
                    <select
                      value={formData.leaseTermMonths}
                      onChange={(e) => updateField('leaseTermMonths', Number(e.target.value))}
                      className={inputClass}
                    >
                      <option value={12}>12 months</option>
                      <option value={15}>15 months</option>
                      <option value={18}>18 months</option>
                      <option value={24}>24 months</option>
                      <option value={1}>Month to month</option>
                    </select>
                  </label>
                </div>
              </section>

              {/* 3. Income & employment */}
              <section
                id="sec-3"
                className={`bg-white rounded-2xl p-5 sm:p-6 shadow-xs ${
                  incomeSectionNeedsUpdate ? 'border-2 border-amber-300' : 'border border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="m-0 mb-1 text-xl font-bold text-gray-900">3. Income &amp; employment</h2>
                    <p className="m-0 text-[15px] text-gray-600">
                      Landlords here look for monthly income of about {incomeMultiplier}× the rent.
                    </p>
                  </div>
                  {incomeSectionNeedsUpdate && (
                    <span className="flex-none text-xs font-bold text-amber-900 bg-amber-50 rounded-lg px-2.5 py-1.5">
                      Needs an update
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className={labelClass}>Current employer</span>
                    <input
                      type="text"
                      value={formData.employer}
                      onBlur={handleEmployerBlur}
                      onChange={(e) => {
                        updateField('employer', e.target.value);
                        setIsEmployerUpdated(true);
                      }}
                      className={
                        employerNeedsUpdate
                          ? 'w-full rounded-xl px-3 py-2.5 text-sm font-medium bg-amber-50 border-2 border-amber-600 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500'
                          : inputClass
                      }
                    />
                    {employerNeedsUpdate && (
                      <span className="block text-xs font-semibold text-amber-900 mt-1.5">
                        Still here? Confirm or replace — last updated March 2026.
                      </span>
                    )}
                  </label>
                  <label className="block">
                    <span className={labelClass}>Gross monthly income</span>
                    <input
                      type="number"
                      value={formData.monthlyIncome || ''}
                      onChange={(e) => updateField('monthlyIncome', Number(e.target.value))}
                      className={inputClass}
                    />
                    <span className={helpClass}>
                      {incomeRatio > 0
                        ? `${incomeRatio.toFixed(1)}× the $${formatMoney(listing.rent)} rent${
                            needsCosignerForIncome
                              ? ` — just under the ${incomeMultiplier}× most landlords look for.`
                              : ` — meets the ${incomeMultiplier}× income guideline.`
                          }`
                        : `Listing rent is $${formatMoney(listing.rent)}/mo (${incomeMultiplier}× income guideline).`}
                    </span>
                  </label>
                </div>
                <div className="flex items-center justify-between gap-4 flex-wrap mt-4 px-4 py-3.5 bg-gray-50 rounded-xl">
                  <div className="min-w-0">
                    <div className="text-[15px] font-semibold text-gray-900">Proof of income</div>
                    <div className="text-sm text-gray-600 mt-0.5">Two recent pay stubs, an offer letter, or last year&apos;s W-2.</div>
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {incomeDocReady && <span className="text-sm text-gray-900">Sept_2026_Paystub.pdf</span>}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="!border-[#006AFF] !text-[#006AFF] hover:!bg-blue-50"
                      onClick={handleSimulateDocUpload}
                    >
                      {incomeDocReady ? 'Add another' : 'Attach paystub'}
                    </Button>
                  </div>
                </div>
                {needsCosignerForIncome && (
                  <div className="flex items-start gap-3 mt-4 px-4 py-3.5 bg-amber-50 border border-amber-300 rounded-xl">
                    <span className="flex-none w-6 h-6 rounded-full bg-amber-200 text-amber-900 text-sm font-bold italic flex items-center justify-center">
                      i
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[15px] font-bold text-amber-950">May need a cosigner to be approved</div>
                      <div className="text-sm leading-relaxed text-amber-900 mt-1">
                        At ${formatMoney(formData.monthlyIncome)}/mo you&apos;re ${formatMoney(Math.max(0, Math.round(incomeShortfall)))} short of the{' '}
                        {incomeMultiplier}× income this listing asks for. Adding a cosigner is the fastest way to close that gap — or add other
                        income sources to get above ${formatMoney(Math.round(requiredIncome))}.
                      </div>
                      <a href="#sec-7" className="inline-block text-sm font-bold text-amber-950 mt-2 underline">
                        Add a cosigner
                      </a>
                    </div>
                  </div>
                )}
              </section>

              {/* 4. Where you've lived */}
              <section id="sec-4" className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xs">
                <div className="mb-4">
                  <h2 className="m-0 mb-1 text-xl font-bold text-gray-900">4. Where you&apos;ve lived</h2>
                  <p className="m-0 text-[15px] text-gray-600">The last two years, plus someone who can vouch for you.</p>
                </div>
                <label className="block mb-4">
                  <span className={labelClass}>Previous address</span>
                  <input
                    type="text"
                    value={formData.pastAddress}
                    onChange={(e) => updateField('pastAddress', e.target.value)}
                    className={inputClass}
                  />
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className={labelClass}>Landlord or property manager</span>
                    <input
                      type="text"
                      value={formData.pastLandlord}
                      onChange={(e) => updateField('pastLandlord', e.target.value)}
                      className={inputClass}
                    />
                    <span className={helpClass}>We&apos;ll only contact them if your application moves forward.</span>
                  </label>
                  <label className="block">
                    <span className={labelClass}>Why you&apos;re moving</span>
                    <input
                      type="text"
                      value={formData.reasonForLeaving}
                      onChange={(e) => updateField('reasonForLeaving', e.target.value)}
                      className={inputClass}
                    />
                  </label>
                </div>
              </section>

              {/* 5. Disclosures */}
              <section id="sec-5" className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xs">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h2 className="m-0 mb-1 text-xl font-bold text-gray-900">5. Disclosures</h2>
                    <p className="m-0 text-[15px] text-gray-600">
                      Answer honestly — a &quot;yes&quot; isn&apos;t automatically disqualifying, and you can explain.
                    </p>
                  </div>
                  <span className="flex-none text-xs font-bold text-emerald-800 bg-emerald-50 rounded-lg px-2.5 py-1.5">
                    Answered
                  </span>
                </div>
                <div className="flex flex-col">
                  {disclosureDefs.map((q) => (
                    <div
                      key={q.key}
                      className="flex items-center justify-between gap-5 py-3.5 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-[15px] text-gray-900">{q.label}</span>
                      <div className="flex gap-2 flex-none">
                        <button
                          type="button"
                          className={pillClass(formData[q.key] === 'no', 'no')}
                          onClick={() => updateField(q.key, 'no')}
                        >
                          No
                        </button>
                        <button
                          type="button"
                          className={pillClass(formData[q.key] === 'yes', 'yes')}
                          onClick={() => updateField(q.key, 'yes')}
                        >
                          Yes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 6. Emergency contact */}
              <section id="sec-6" className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xs">
                <div className="mb-4">
                  <h2 className="m-0 mb-1 text-xl font-bold text-gray-900">6. Emergency contact</h2>
                  <p className="m-0 text-[15px] text-gray-600">Someone the landlord can reach if they can&apos;t reach you.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="block">
                    <span className={labelClass}>Name</span>
                    <input
                      type="text"
                      value={formData.emergencyName}
                      onChange={(e) => updateField('emergencyName', e.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Phone</span>
                    <input
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => updateField('emergencyPhone', e.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Relationship to you</span>
                    <input
                      type="text"
                      value={formData.emergencyRelation}
                      onChange={(e) => updateField('emergencyRelation', e.target.value)}
                      className={inputClass}
                    />
                  </label>
                </div>
              </section>

              {/* 7. Cosigner */}
              <section
                id="sec-7"
                className={`rounded-2xl p-5 sm:p-6 shadow-xs ${
                  formData.cosigner?.status === 'confirmed'
                    ? 'bg-emerald-50/50 border border-emerald-300'
                    : formData.cosigner?.status === 'pending'
                      ? 'bg-blue-50/60 border border-blue-200'
                      : needsCosignerForIncome
                        ? 'bg-white border-2 border-amber-300'
                        : 'bg-white border border-gray-200'
                }`}
              >
                <span id="section-cosigner-row" className="sr-only">
                  Cosigner
                </span>
                {needsCosignerForIncome && !hasCosigner && (
                  <div className="inline-flex items-center gap-2 mb-3 py-1.5 pr-3 pl-1.5 bg-amber-50 rounded-full">
                    <span className="w-[22px] h-[22px] rounded-full bg-amber-200 text-amber-900 text-[13px] font-bold italic flex items-center justify-center">
                      i
                    </span>
                    <span className="text-sm font-bold text-amber-900">May need a cosigner to be approved</span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="m-0 text-xl font-bold text-gray-900">7. Add a cosigner</h2>
                      <span className="text-xs font-bold text-gray-600 bg-gray-100 rounded-lg px-2 py-1">Optional</span>
                    </div>
                    <p className="mt-1.5 mb-0 text-[15px] leading-relaxed text-gray-600 max-w-[58ch]">
                      {formData.cosigner?.status === 'confirmed'
                        ? `Confirmed: ${formData.cosigner.fullName} (${formData.cosigner.relationship})`
                        : formData.cosigner?.status === 'pending'
                          ? `Awaiting confirmation from ${formData.cosigner.fullName}. We'll email them a short form of their own and your application keeps moving.`
                          : needsCosignerForIncome
                            ? `Your $${formatMoney(formData.monthlyIncome)}/mo income is ${incomeRatio.toFixed(1)}× the rent — just under the ${incomeMultiplier}× this landlord looks for. A cosigner covers the gap; we'll email them a short form of their own and your application keeps moving meanwhile.`
                            : 'Add a cosigner to strengthen your application. We will email them a short form of their own.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {formData.cosigner?.status === 'confirmed' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Confirmed
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
                          Pending
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
                        variant="outline"
                        size="sm"
                        className="!border-[#006AFF] !text-[#006AFF] hover:!bg-blue-50"
                        leftIcon={<UserPlus className="w-4 h-4" />}
                        onClick={handleToggleCosigner}
                      >
                        {cosignerOpen ? 'Cancel' : 'Invite a cosigner'}
                      </Button>
                    )}
                  </div>
                </div>
                {cosignerOpen && !hasCosigner && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                    <label className="block">
                      <span className={labelClass}>Cosigner&apos;s name</span>
                      <input
                        placeholder="Full legal name"
                        value={inlineCosigner.fullName}
                        onChange={(e) => setInlineCosigner((s) => ({ ...s, fullName: e.target.value }))}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className={labelClass}>Email</span>
                      <input
                        placeholder="name@email.com"
                        value={inlineCosigner.email}
                        onChange={(e) => setInlineCosigner((s) => ({ ...s, email: e.target.value }))}
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className={labelClass}>Relationship to you</span>
                      <input
                        placeholder="Parent, partner, friend"
                        value={inlineCosigner.relationship}
                        onChange={(e) => setInlineCosigner((s) => ({ ...s, relationship: e.target.value }))}
                        className={inputClass}
                      />
                    </label>
                    <div className="sm:col-span-3">
                      <Button type="button" variant="primary" size="sm" onClick={handleSendInlineCosigner}>
                        Continue invite
                      </Button>
                    </div>
                  </div>
                )}
              </section>

              <p className="mt-1 mb-0 text-[13px] leading-relaxed text-gray-600 max-w-[72ch]">
                Submitting shares this application and your screening report with the landlord of {listing.title}
                {listing.unit ? `, ${listing.unit}` : ''}. The application fee is charged once and covers all participating rentals
                for 30 days.
              </p>
            </main>

            <aside className="xl:sticky xl:top-[76px] flex flex-col gap-3.5">
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="h-[150px] bg-gray-100 relative">
                  {listingPhoto ? (
                    <img src={listingPhoto} alt={listing.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[repeating-linear-gradient(135deg,#ececf0_0_10px,#f6f6f8_10px_20px)]" />
                  )}
                </div>
                <div className="p-4">
                  <span className="inline-block text-xs font-bold text-gray-800 bg-gray-100 rounded-lg px-2 py-1 mb-2.5">
                    Accepts online applications
                  </span>
                  <div className="text-2xl font-bold tracking-tight">${formatMoney(listing.rent)}/mo</div>
                  <div className="text-[15px] text-gray-900 mt-1">
                    {listing.title}
                    {listing.unit ? `, ${listing.unit}` : ''}
                  </div>
                  <div className="text-sm text-gray-600">
                    {listing.address}, {listing.city}, {listing.state} {listing.zip}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 pt-3 border-t border-gray-100 text-sm text-gray-900">
                    <span>
                      <strong>{listing.beds}</strong> bd
                    </span>
                    <span>
                      <strong>{listing.baths}</strong> ba
                    </span>
                    <span>
                      <strong>{listing.sqft.toLocaleString()}</strong> sqft
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[15px] font-bold">Your progress</span>
                  <span className="text-sm text-gray-600">
                    {filledProgressCount} of {progressItems.length}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 my-2.5 mb-3.5 overflow-hidden">
                  <div className="h-full rounded-full bg-[#006AFF] transition-all" style={{ width: `${progressPct}%` }} />
                </div>
                <div className="flex flex-col gap-px">
                  {progressItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm no-underline hover:no-underline hover:bg-gray-50 ${
                        item.attention ? 'font-bold text-amber-900 bg-amber-50 hover:bg-amber-100' : 'text-gray-900'
                      }`}
                    >
                      {item.complete ? (
                        <span className="w-4 h-4 flex-none rounded-full bg-emerald-700 text-white text-[9px] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" strokeWidth={3} />
                        </span>
                      ) : item.attention ? (
                        <span className="w-4 h-4 flex-none rounded-full bg-amber-700 text-white text-[10px] flex items-center justify-center">
                          !
                        </span>
                      ) : item.recommended ? (
                        <span className="w-4 h-4 flex-none rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold italic flex items-center justify-center">
                          i
                        </span>
                      ) : (
                        <span className="w-4 h-4 flex-none rounded-full border border-gray-300 bg-white" />
                      )}
                      <span>{item.label}</span>
                      {item.recommended && <span className="text-xs font-bold text-amber-800">recommended</span>}
                    </a>
                  ))}
                </div>
                <Button
                  id="btn-continue-to-submit"
                  type="button"
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="mt-3.5"
                  disabled={!canProceed}
                  onClick={onContinueToSubmit}
                >
                  Review and submit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  fullWidth
                  className="mt-2 !border-[#006AFF] !text-[#006AFF] hover:!bg-blue-50"
                  onClick={handleSaveLater}
                >
                  Save and finish later
                </Button>
                <p className="mt-2.5 mb-0 text-[13px] leading-relaxed text-gray-600">
                  {formData.cosigner?.status === 'pending'
                    ? 'Cosigner invitation is pending confirmation. Your answers carry over to your next application.'
                    : 'Saved a moment ago. Your answers carry over to your next application.'}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};
