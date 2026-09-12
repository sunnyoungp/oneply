import React, { useState } from 'react';
import {
  User,
  Users,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Check,
  ShieldCheck,
  Copy,
  Mail,
  Home,
  Briefcase,
  Building2,
} from 'lucide-react';
import { ListingDetails, Roommate, ApplicationType, ProfileFormData } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface ApplicationSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: ListingDetails;
  initialStep?: 1 | 2;
  applicationType: ApplicationType;
  onUpdateApplicationType: (type: ApplicationType) => void;
  roommates: Roommate[];
  onUpdateRoommates: (roommates: Roommate[]) => void;
  useSavedProfile: boolean;
  onUpdateUseSavedProfile: (useSaved: boolean) => void;
  savedProfileData: ProfileFormData;
  mockSavedDate?: string;
  onCompleteSetup: () => void;
  onNotify: (msg: string) => void;
}

export const ApplicationSetupModal: React.FC<ApplicationSetupModalProps> = ({
  isOpen,
  onClose,
  listing,
  initialStep = 1,
  applicationType,
  onUpdateApplicationType,
  roommates,
  onUpdateRoommates,
  useSavedProfile,
  onUpdateUseSavedProfile,
  savedProfileData,
  mockSavedDate = 'August 14, 2026',
  onCompleteSetup,
  onNotify,
}) => {
  const [modalStep, setModalStep] = useState<1 | 2>(initialStep);

  // Local state for Step 1
  const [selectedShape, setSelectedShape] = useState<ApplicationType>(applicationType);
  const [newRoommateName, setNewRoommateName] = useState('');
  const [newRoommateEmail, setNewRoommateEmail] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Local state for Step 2
  const [selectedProfileMode, setSelectedProfileMode] = useState<'saved' | 'new'>(
    useSavedProfile ? 'saved' : 'new'
  );

  if (!isOpen) return null;

  // STEP 1 HANDLERS
  const handleAddRoommate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoommateName.trim() || !newRoommateEmail.trim()) {
      onNotify('Please enter both name and email for the roommate.');
      return;
    }

    const colors = ['bg-indigo-600', 'bg-emerald-600', 'bg-purple-600', 'bg-amber-600', 'bg-rose-600'];
    const newMember: Roommate = {
      id: `rm-${Date.now()}`,
      name: newRoommateName.trim(),
      email: newRoommateEmail.trim(),
      status: 'invited',
      profileCompletion: 0,
      avatarColor: colors[roommates.length % colors.length],
      cosignerStatus: 'none',
    };

    const updated = [...roommates, newMember];
    onUpdateRoommates(updated);
    setNewRoommateName('');
    setNewRoommateEmail('');
    onNotify(`Added ${newMember.name} to your roommate group.`);
  };

  const handleRemoveRoommate = (id: string, name: string) => {
    const updated = roommates.filter((r) => r.id !== id);
    onUpdateRoommates(updated);
    onNotify(`Removed ${name} from the roommate list.`);
  };

  const handleCopyInviteLink = () => {
    setCopiedLink(true);
    onNotify('Roommate group invite link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleStep1Continue = () => {
    onUpdateApplicationType(selectedShape);
    if (selectedShape === 'group' && roommates.length === 0) {
      onNotify('Please add at least one roommate or choose "Applying alone".');
      return;
    }
    setModalStep(2);
    onNotify(
      selectedShape === 'solo'
        ? 'Applying alone. Now select your profile source.'
        : `Applying with ${roommates.length} roommate(s). Now select your profile source.`
    );
  };

  // STEP 2 HANDLERS
  const handleStep2Continue = () => {
    const isSaved = selectedProfileMode === 'saved';
    onUpdateUseSavedProfile(isSaved);
    onCompleteSetup();
  };

  return (
    <div
      id="modal-application-setup-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        id="modal-application-setup-container"
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden relative my-auto max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Top Progress & Navigation Bar */}
        <div className="bg-slate-50 border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {modalStep === 2 ? (
              <Button
                id="btn-modal-step2-back"
                variant="ghost"
                size="sm"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => setModalStep(1)}
              >
                Back
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                <Building2 className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate max-w-[200px] sm:max-w-xs">{listing.address}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Step Counter Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-bold">
              <span>Step {modalStep} of 2</span>
              <span className="text-[#BFDBFE]">·</span>
              <span className="hidden sm:inline">
                {modalStep === 1 ? 'Living arrangements' : 'Profile source'}
              </span>
            </div>

            {/* Close Button */}
            <Button
              id="btn-close-application-modal"
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              title="Close setup modal"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* ============================================================== */}
          {/* STEP 1: Application Type & Roommates */}
          {/* ============================================================== */}
          {modalStep === 1 && (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  Who will be living with you?
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Choose whether you are applying as a solo tenant or co-applying with roommates for{' '}
                  <strong className="text-gray-900">{listing.address}</strong>.
                </p>
              </div>

              {/* Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Option: Applying alone */}
                <div
                  id="card-choice-solo"
                  onClick={() => {
                    setSelectedShape('solo');
                    onNotify('Selected: Applying alone.');
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group relative ${
                    selectedShape === 'solo'
                      ? 'border-[#006AFF] bg-[#EFF6FF]/40 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          selectedShape === 'solo'
                            ? 'bg-[#006AFF] text-white'
                            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                        }`}
                      >
                        <User className="w-5 h-5" />
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedShape === 'solo'
                            ? 'border-[#006AFF] bg-[#006AFF] text-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {selectedShape === 'solo' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                    <h3 className="text-base font-black text-gray-900 mb-1">Applying alone</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Just you on the lease. Only your income and background checks will be evaluated.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-[11px] font-semibold text-gray-500">
                    <span>Individual lease</span>
                  </div>
                </div>

                {/* Option: Applying with roommates */}
                <div
                  id="card-choice-group"
                  onClick={() => {
                    setSelectedShape('group');
                    onNotify('Selected: Applying with roommates.');
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group relative ${
                    selectedShape === 'group'
                      ? 'border-[#006AFF] bg-[#EFF6FF]/40 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          selectedShape === 'group'
                            ? 'bg-[#006AFF] text-white'
                            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                        }`}
                      >
                        <Users className="w-5 h-5" />
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedShape === 'group'
                            ? 'border-[#006AFF] bg-[#006AFF] text-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {selectedShape === 'group' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                    <h3 className="text-base font-black text-gray-900 mb-1">Applying with roommates</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Group application. Each co-tenant submits their verified credentials into one combined package.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-[11px] font-semibold text-gray-500">
                    <span>Shared household</span>
                  </div>
                </div>
              </div>

              {/* Roommate invitations sub-section if "Applying with roommates" is selected */}
              {selectedShape === 'group' && (
                <div className="bg-slate-50 border border-gray-200 rounded-2xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#006AFF]" />
                        <span>Roommate group ({roommates.length})</span>
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        Add the people who will live in the apartment with you.
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Copy className="w-3.5 h-3.5" />}
                      onClick={handleCopyInviteLink}
                    >
                      {copiedLink ? 'Link copied' : 'Copy link'}
                    </Button>
                  </div>

                  {/* Roommate list */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {roommates.map((rm) => (
                      <div
                        key={rm.id}
                        className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full ${rm.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                          >
                            {rm.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-900">{rm.name}</div>
                            <div className="text-[11px] text-gray-500 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span>{rm.email}</span>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-rose-600 p-1.5 min-h-[30px]"
                          onClick={() => handleRemoveRoommate(rm.id, rm.name)}
                          title={`Remove ${rm.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}

                    {roommates.length === 0 && (
                      <div className="text-center py-4 text-xs text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                        No roommates added yet. Add at least one co-tenant below.
                      </div>
                    )}
                  </div>

                  {/* Add Roommate Form */}
                  <form onSubmit={handleAddRoommate} className="pt-2 border-t border-gray-200/80">
                    <div className="text-xs font-bold text-gray-700 mb-2">Add a co-tenant:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      <Input
                        type="text"
                        placeholder="Full name"
                        value={newRoommateName}
                        onChange={(e) => setNewRoommateName(e.target.value)}
                        className="sm:col-span-2"
                      />
                      <Input
                        type="email"
                        placeholder="Email address"
                        value={newRoommateEmail}
                        onChange={(e) => setNewRoommateEmail(e.target.value)}
                        className="sm:col-span-2"
                      />
                      <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        leftIcon={<Plus className="w-3.5 h-3.5" />}
                        className="sm:col-span-1"
                      >
                        Add
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 2: Saved Profile / Data Source Selection */}
          {/* ============================================================== */}
          {modalStep === 2 && (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 bg-[#EFF6FF] text-[#1D4ED8] text-xs font-bold px-2.5 py-1 rounded-full mb-2 border border-[#BFDBFE]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1D4ED8]" />
                  <span>Verified Profile Available</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  Choose your profile source
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  We located your saved application profile from {mockSavedDate}. Select how you would like to apply.
                </p>
              </div>

              {/* The Two Choices */}
              <div className="space-y-4">
                {/* Choice A: Use Saved Profile (Detailed Preview Card) */}
                <div
                  id="card-modal-saved-profile"
                  onClick={() => {
                    setSelectedProfileMode('saved');
                    onNotify('Selected saved profile.');
                  }}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    selectedProfileMode === 'saved'
                      ? 'border-[#006AFF] bg-white ring-4 ring-[#EFF6FF] shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#006AFF] flex items-center justify-center shrink-0 font-bold">
                        <FileText className="w-5 h-5 text-[#006AFF]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-gray-900">Use my saved profile</h3>
                          <span className="bg-[#006AFF] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                            Recommended
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Instant pre-fill with verified credentials from your account.
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        selectedProfileMode === 'saved'
                          ? 'border-[#006AFF] bg-[#006AFF] text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {selectedProfileMode === 'saved' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* PREVIEW CARD OF SAVED PROFILE INFORMATION */}
                  <div className="bg-slate-50 border border-gray-200 rounded-xl p-3.5 text-xs space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                      <span className="font-bold text-gray-800">Saved Applicant Record</span>
                      <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>8 of 10 sections complete</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="font-bold text-gray-900 truncate">
                          {savedProfileData.fullName || 'Jordan Reed'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">jordan.reed@example.com</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">5514 Ellsworth Ave, Pittsburgh</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">Acme Health Tech · $6,200/mo</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200/70 flex items-center justify-between text-[11px]">
                      <span className="text-[#1D4ED8] flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 text-[#1D4ED8]" />
                        <span>2 fields flagged for quick verification</span>
                      </span>
                      <span className="text-gray-500 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>~2 minutes</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Choice B: Start Fresh Blank Form */}
                <div
                  id="card-modal-blank-profile"
                  onClick={() => {
                    setSelectedProfileMode('new');
                    onNotify('Selected: Start with a blank form.');
                  }}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    selectedProfileMode === 'new'
                      ? 'border-[#006AFF] bg-white ring-4 ring-[#EFF6FF] shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 flex items-center justify-center shrink-0 font-bold">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-gray-900">
                          Start a new application with a blank form
                        </h3>
                        <p className="text-xs text-gray-500">
                          Start with empty fields. No previous profile data or documents will be imported.
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        selectedProfileMode === 'new'
                          ? 'border-[#006AFF] bg-[#006AFF] text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {selectedProfileMode === 'new' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>Manual entry for all sections</span>
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>~10 minutes</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          {modalStep === 1 ? (
            <>
              <Button id="btn-modal-cancel" variant="ghost" onClick={onClose}>
                Cancel
              </Button>

              <Button
                id="btn-modal-step1-continue"
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={handleStep1Continue}
              >
                Continue
              </Button>
            </>
          ) : (
            <>
              <Button
                id="btn-modal-step2-back-bottom"
                variant="outline"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => setModalStep(1)}
              >
                Back
              </Button>

              <Button
                id="btn-modal-complete-setup"
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={handleStep2Continue}
              >
                Continue
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
