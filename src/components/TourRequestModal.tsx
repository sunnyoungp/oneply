import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  X,
  Building,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { ListingDetails } from '../types';
import { Button } from './ui/Button';

interface TourRequestModalProps {
  listing: ListingDetails;
  selectedDate?: string;
  isOpen: boolean;
  onClose: () => void;
  onStartProfile: () => void;
  onNotify: (msg: string) => void;
}

export const TourRequestModal: React.FC<TourRequestModalProps> = ({
  listing,
  selectedDate = 'Tomorrow, 2:30 PM',
  isOpen,
  onClose,
  onStartProfile,
  onNotify,
}) => {
  // Sub-state within Step 2: 'prompt' | 'tour-confirmed'
  const [viewState, setViewState] = useState<'prompt' | 'confirmed'>('prompt');

  if (!isOpen) return null;

  const handleNotNow = () => {
    setViewState('confirmed');
    onNotify('Tour requested without starting profile yet.');
  };

  const handleResetAndClose = () => {
    setViewState('prompt');
    onClose();
  };

  return (
    <div
      id="tour-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div
        id="tour-modal-container"
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden relative"
      >
        {/* Modal Header */}
        <div className="bg-[#006AFF] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/15 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Request a Tour</h3>
              <p className="text-xs text-white/80 mt-0.5">
                {listing.address}, {listing.unit}
              </p>
            </div>
          </div>
          <button
            id="btn-close-tour-modal"
            onClick={handleResetAndClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/15 transition-colors"
            aria-label="Close tour dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {viewState === 'prompt' ? (
            <div>
              {/* Tour Appointment Summary Pill */}
              <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-3.5 mb-5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#1D4ED8] shrink-0" />
                  <div>
                    <span className="text-gray-500 block">Requested time</span>
                    <span className="font-bold text-gray-900 text-sm">{selectedDate}</span>
                  </div>
                </div>
                <span className="bg-[#006AFF] text-white font-medium px-2.5 py-1 rounded-md text-[11px]">
                  Requested
                </span>
              </div>

              {/* Core Step 2 Requirement: Low-commitment prompt */}
              <div className="text-center py-2 mb-6">
                <div className="w-12 h-12 bg-[#EFF6FF] rounded-2xl mx-auto flex items-center justify-center mb-3">
                  <ShieldCheck className="w-6 h-6 text-[#006AFF]" />
                </div>
                <h4 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  Save time later
                </h4>
                <p className="text-sm text-gray-600 mt-1.5 max-w-sm mx-auto">
                  Set up your profile now so you can apply quickly after your tour.
                </p>
              </div>

              {/* Value props preview */}
              <div className="bg-gray-50 rounded-xl p-3.5 mb-6 border border-gray-200/70 text-xs text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Private until you submit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Soft credit check only</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Reusable across listings</span>
                </div>
              </div>

              {/* Actions: "Start profile" vs "Not now" */}
              <div className="space-y-2.5">
                <Button
                  id="btn-tour-start-profile"
                  variant="primary"
                  size="md"
                  fullWidth
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => {
                    handleResetAndClose();
                    onStartProfile();
                  }}
                >
                  Start profile
                </Button>

                <Button
                  id="btn-tour-not-now"
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={handleNotNow}
                >
                  Not now
                </Button>
              </div>
            </div>
          ) : (
            /* "Not now" branch: "Tour requested" confirmation with clear return button (Zero dead ends) */
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-full mx-auto flex items-center justify-center mb-4 text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h4 className="text-xl font-bold text-gray-900 mb-1">
                Tour requested!
              </h4>
              <p className="text-sm text-gray-600 max-w-sm mx-auto mb-6">
                Your request for <strong className="text-gray-900">{listing.address}, {listing.unit}</strong> was sent to {listing.managementCompany}. They will confirm by email.
              </p>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-6 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Date & Time</span>
                  <span className="font-semibold text-gray-800">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Host</span>
                  <span className="font-semibold text-gray-800">{listing.contactPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="font-semibold text-[#1D4ED8]">Awaiting confirmation</span>
                </div>
              </div>

              {/* No dead ends: Button back to the listing (Step 1) */}
              <div className="space-y-2">
                <Button
                  id="btn-return-to-listing-from-tour"
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleResetAndClose}
                >
                  Back
                </Button>

                {/* Also connected to setup modal if renter changes their mind */}
                <Button
                  id="btn-changed-mind-start-profile"
                  variant="ghost"
                  size="sm"
                  fullWidth
                  rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                  onClick={() => {
                    handleResetAndClose();
                    onStartProfile();
                  }}
                >
                  Start profile
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
