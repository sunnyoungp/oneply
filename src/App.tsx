/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { ZillowNavbar } from './components/ZillowNavbar';
import { ListingPage } from './components/ListingPage';
import { TourRequestModal } from './components/TourRequestModal';
import { MessageThread } from './components/MessageThread';
import { ProfileDecisionStep } from './components/ProfileDecisionStep';
import { GroupShapeStep } from './components/GroupShapeStep';
import { ProfileStep } from './components/ProfileStep';
import { CosignerDraftModal } from './components/CosignerDraftModal';
import { CosignerReviewScreen } from './components/CosignerReviewScreen';
import { SubmissionStep } from './components/SubmissionStep';
import { GroupStatusDashboard } from './components/GroupStatusDashboard';
import { SubmissionConfirmation } from './components/SubmissionConfirmation';
import { ApplicationHistoryScreen } from './components/ApplicationHistoryScreen';
import { ApplicationSetupModal } from './components/ApplicationSetupModal';
import { Button } from './components/ui/Button';
import { mockListing } from './mockData';
import {
  mockJordanSavedProfile,
  mockBlankProfile,
  mockPriyaProfile,
  mockSamProfile,
} from './mockProfiles';
import {
  AppStep,
  ApplicationType,
  Roommate,
  ProfileFormData,
  CosignerData,
} from './types';
import {
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Layers,
  ChevronRight,
  ArrowLeft,
  FileText,
  Users,
  User,
  ShieldCheck,
  RotateCcw,
  Sliders,
} from 'lucide-react';

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('step-1-listing');
  const [useSavedProfile, setUseSavedProfile] = useState<boolean>(true);
  const [applicationType, setApplicationType] = useState<ApplicationType>('solo');
  const [currentUser, setCurrentUser] = useState<string>('Jordan Reed');
  const [isDebuggerOpen, setIsDebuggerOpen] = useState<boolean>(false);
  const [profileFormData, setProfileFormData] = useState<ProfileFormData>({
    ...mockJordanSavedProfile,
  });

  const [isCosignerDraftOpen, setIsCosignerDraftOpen] = useState(false);

  const [roommates, setRoommates] = useState<Roommate[]>([
    {
      id: 'rm-1',
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      status: 'invited',
      profileCompletion: 85,
      avatarColor: 'bg-purple-600',
      cosignerStatus: 'pending',
    },
    {
      id: 'rm-2',
      name: 'Sam Chen',
      email: 'sam.chen@cmu.edu',
      status: 'invited',
      profileCompletion: 70,
      avatarColor: 'bg-emerald-600',
      cosignerStatus: 'none',
    },
  ]);

  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [isApplicationSetupModalOpen, setIsApplicationSetupModalOpen] = useState(false);
  const [setupModalInitialStep, setSetupModalInitialStep] = useState<1 | 2>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Global scroll restoration on step changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, [currentStep]);

  // Tour request clicked
  const handleRequestTour = () => {
    setIsTourModalOpen(true);
    triggerToast('Opened Tour Request & Profile Prompt');
  };

  // Message landlord clicked
  const handleMessageLandlord = () => {
    setCurrentStep('step-3-message');
    triggerToast('Opened Landlord Message Thread');
  };

  // Flow Step 1: Living Arrangements -> Step 2: Profile Selection inside modal over listing background
  const handleApplyNow = () => {
    setCurrentStep('step-1-listing');
    setSetupModalInitialStep(1);
    setIsApplicationSetupModalOpen(true);
    triggerToast('Starting application setup: living arrangements');
  };

  const handleStartProfileFromTour = () => {
    setIsTourModalOpen(false);
    setCurrentStep('step-1-listing');
    setSetupModalInitialStep(1);
    setIsApplicationSetupModalOpen(true);
    triggerToast('Starting application setup: living arrangements');
  };

  // When completing step 2 in setup modal -> transition to full-page profile form
  const handleCompleteSetup = () => {
    setIsApplicationSetupModalOpen(false);
    setCurrentStep('step-7-profile');
    if (useSavedProfile) {
      setProfileFormData({ ...mockJordanSavedProfile });
      triggerToast('Saved profile loaded. Continuing to rental application.');
    } else {
      setProfileFormData({ ...mockBlankProfile });
      triggerToast('Blank application started. Continuing to rental application.');
    }
  };

  // Legacy/fallback Decision Handlers
  const handleChooseSavedProfile = () => {
    setUseSavedProfile(true);
    setProfileFormData({ ...mockJordanSavedProfile });
    setCurrentStep('step-7-profile');
    triggerToast('Saved profile loaded (with 2 flagged fields for verification).');
  };

  const handleChooseNewApplication = () => {
    setUseSavedProfile(false);
    setProfileFormData({ ...mockBlankProfile });
    setCurrentStep('step-7-profile');
    triggerToast('Blank application started.');
  };

  // Handlers -> Route to Profile
  const handleSelectSolo = () => {
    setApplicationType('solo');
    setCurrentStep('step-7-profile');
    triggerToast('Applying alone. Continuing to Unified Profile.');
  };

  const handleSelectGroup = (updatedRoommates: Roommate[]) => {
    setApplicationType('group');
    setRoommates(updatedRoommates);
    setCurrentStep('step-7-profile');
    triggerToast(`Group application with ${updatedRoommates.length} roommate(s). Continuing to Unified Profile.`);
  };

  // Switch simulated user in Step 7 for group testing
  const handleSwitchUser = (userName: string) => {
    setCurrentUser(userName);
    if (userName === 'Jordan Reed') {
      setProfileFormData(useSavedProfile ? { ...mockJordanSavedProfile } : { ...mockBlankProfile });
    } else if (userName === 'Priya Sharma') {
      setProfileFormData({ ...mockPriyaProfile });
    } else if (userName === 'Sam Chen') {
      setProfileFormData({ ...mockSamProfile });
    }
    triggerToast(`Switched view to roommate session: ${userName}`);
  };

  // Step 8 Cosigner Handlers
  const handleSendDraftToCosigner = (cosignerData: CosignerData) => {
    setProfileFormData((prev) => ({
      ...prev,
      cosigner: cosignerData,
    }));
    setIsCosignerDraftOpen(false);
    triggerToast(`Draft sent to ${cosignerData.fullName}. Status is now "Pending Link".`);
  };

  const handleConfirmCosignerGuarantee = (confirmedData: CosignerData) => {
    setProfileFormData((prev) => ({
      ...prev,
      cosigner: confirmedData,
    }));
    setCurrentStep('step-7-profile');
    triggerToast(`Cosigner signed! Profile updated to: Confirmed ✓`);
  };

  // Step 9 Submission Handlers
  const handleSubmitFromStep9 = () => {
    if (applicationType === 'solo') {
      setCurrentStep('step-11-confirmation');
    } else {
      setCurrentStep('step-10-group-status');
    }
  };

  // Step 10 Transmit Handlers
  const handleTransmitGroupFromStep10 = () => {
    setCurrentStep('step-11-confirmation');
  };

  // Reset demo
  const handleResetDemo = () => {
    setCurrentStep('step-1-listing');
    setUseSavedProfile(true);
    setApplicationType('solo');
    setCurrentUser('Jordan Reed');
    setProfileFormData({ ...mockJordanSavedProfile });
    triggerToast('Demo reset to listing page.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-900">
      {/* Show Zillow Top Navigation only on Zillow listing view */}
      {currentStep === 'step-1-listing' && <ZillowNavbar onNotify={triggerToast} />}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* STEP 1: Listing Page (and background for Application Setup Modal) */}
        {(currentStep === 'step-1-listing' || currentStep === 'step-5-decision' || currentStep === 'step-6-group') && (
          <ListingPage
            listing={mockListing}
            onRequestTour={handleRequestTour}
            onMessageLandlord={handleMessageLandlord}
            onApplyNow={handleApplyNow}
            onNotify={triggerToast}
          />
        )}

        {/* STEP 3: Landlord Message Thread */}
        {currentStep === 'step-3-message' && (
          <MessageThread
            listing={mockListing}
            onBackToListing={() => setCurrentStep('step-1-listing')}
            onApplyNow={handleApplyNow}
            onNotify={triggerToast}
          />
        )}

        {/* STEP 7: Full Reusable Profile */}
        {currentStep === 'step-7-profile' && (
          <ProfileStep
            listing={mockListing}
            isSavedProfile={useSavedProfile}
            formData={profileFormData}
            onChangeFormData={setProfileFormData}
            applicationType={applicationType}
            roommates={roommates}
            currentUser={currentUser}
            onSwitchUser={handleSwitchUser}
            onOpenCosignerDraft={() => setIsCosignerDraftOpen(true)}
            onOpenCosignerPreview={() => setCurrentStep('step-8-cosigner-preview')}
            onContinueToSubmit={() => setCurrentStep('step-9-submit')}
            onBack={() => {
              setCurrentStep('step-1-listing');
              setSetupModalInitialStep(2);
              setIsApplicationSetupModalOpen(true);
            }}
            onNotify={triggerToast}
          />
        )}

        {/* STEP 8: Cosigner Preview View (Minimal Recipient Screen) */}
        {currentStep === 'step-8-cosigner-preview' && profileFormData.cosigner && (
          <CosignerReviewScreen
            listing={mockListing}
            applicantName={currentUser}
            cosignerData={profileFormData.cosigner}
            onConfirmAndSign={handleConfirmCosignerGuarantee}
            onReturnToApplicantProfile={() => setCurrentStep('step-7-profile')}
            onNotify={triggerToast}
          />
        )}

        {/* STEP 9: Individual Review & Submit */}
        {currentStep === 'step-9-submit' && (
          <SubmissionStep
            listing={mockListing}
            formData={profileFormData}
            applicationType={applicationType}
            roommates={roommates}
            currentUser={currentUser}
            onSubmit={handleSubmitFromStep9}
            onBackToProfile={() => setCurrentStep('step-7-profile')}
            onNotify={triggerToast}
          />
        )}

        {/* STEP 10: Group Status Dashboard (Group path only) */}
        {currentStep === 'step-10-group-status' && (
          <GroupStatusDashboard
            listing={mockListing}
            applicantName={currentUser}
            applicantCosigner={profileFormData.cosigner}
            roommates={roommates}
            onTransmitGroupApplication={handleTransmitGroupFromStep10}
            onBackToSubmit={() => setCurrentStep('step-9-submit')}
            onNotify={triggerToast}
          />
        )}

        {/* STEP 11: Submission Confirmation & Match Likelihood */}
        {currentStep === 'step-11-confirmation' && (
          <SubmissionConfirmation
            listing={mockListing}
            applicationType={applicationType}
            formData={profileFormData}
            onViewApplications={() => setCurrentStep('step-12-history')}
            onReturnToListing={() => setCurrentStep('step-1-listing')}
            onNotify={triggerToast}
          />
        )}

        {/* STEP 12: Application History Screen */}
        {currentStep === 'step-12-history' && (
          <ApplicationHistoryScreen
            listing={mockListing}
            currentSubmission={{
              address: mockListing.address,
              unit: mockListing.unit,
              management: mockListing.managementCompany,
              rent: mockListing.rent,
              applicants:
                applicationType === 'solo'
                  ? [currentUser]
                  : [currentUser, ...roommates.map((r) => r.name)],
              cosignerName: profileFormData.cosigner?.fullName,
            }}
            onReturnToListing={() => setCurrentStep('step-1-listing')}
            onResetDemo={handleResetDemo}
            onNotify={triggerToast}
          />
        )}
      </main>

      {/* Step 2: Tour Request Modal with "Start profile" vs "Not now" */}
      <TourRequestModal
        listing={mockListing}
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
        onStartProfile={handleStartProfileFromTour}
        onNotify={triggerToast}
      />

      {/* Step 1 & Step 2 Application Setup Flow (Living Arrangements -> Profile Selection Modal) */}
      <ApplicationSetupModal
        isOpen={isApplicationSetupModalOpen}
        onClose={() => setIsApplicationSetupModalOpen(false)}
        listing={mockListing}
        initialStep={setupModalInitialStep}
        applicationType={applicationType}
        onUpdateApplicationType={setApplicationType}
        roommates={roommates}
        onUpdateRoommates={setRoommates}
        useSavedProfile={useSavedProfile}
        onUpdateUseSavedProfile={setUseSavedProfile}
        savedProfileData={mockJordanSavedProfile}
        mockSavedDate="August 14, 2026"
        onCompleteSetup={handleCompleteSetup}
        onNotify={triggerToast}
      />

      {/* Step 8: Cosigner Draft Modal */}
      <CosignerDraftModal
        listing={mockListing}
        initialData={profileFormData.cosigner}
        applicantName={currentUser}
        isOpen={isCosignerDraftOpen}
        onClose={() => setIsCosignerDraftOpen(false)}
        onSendToCosigner={handleSendDraftToCosigner}
        onNotify={triggerToast}
      />

      {/* Phase 4: Collapsible Floating Action Button (FAB) & Flow Debugger Modal */}
      <div className={`fixed ${currentStep === 'step-1-listing' ? 'bottom-20 lg:bottom-4' : 'bottom-4'} left-4 z-40`}>
        {!isDebuggerOpen ? (
          <button
            id="btn-open-flow-debugger"
            onClick={() => setIsDebuggerOpen(true)}
            className="bg-gray-900/95 hover:bg-gray-900 text-white shadow-xl hover:shadow-2xl border border-gray-700/80 px-3.5 py-2 rounded-full flex items-center gap-2.5 text-xs font-semibold cursor-pointer transition-all hover:scale-105 backdrop-blur-md group"
            title="Open Demo Flow Navigator & State Inspector"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Layers className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline font-bold">Navigator</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-5 w-[92vw] sm:w-96 text-xs text-gray-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-[#006AFF] rounded-lg">
                  <Sliders className="w-4 h-4 text-[#006AFF]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Flow Navigator</h4>
                  <p className="text-[11px] text-gray-500">Zero dead ends state manager</p>
                </div>
              </div>
              <button
                id="btn-close-flow-debugger"
                onClick={() => setIsDebuggerOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                title="Collapse Navigator"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Jump To Screen */}
            <div className="space-y-1.5 mb-3.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                Jump to Screen:
              </label>
              <select
                id="select-jump-step"
                value={currentStep}
                onChange={(e) => {
                  const target = e.target.value as AppStep;
                  if (target === 'step-6-group') {
                    setCurrentStep('step-1-listing');
                    setSetupModalInitialStep(1);
                    setIsApplicationSetupModalOpen(true);
                    triggerToast('Opened Setup Modal: Step 1 (Living Arrangements)');
                    return;
                  }
                  if (target === 'step-5-decision') {
                    setCurrentStep('step-1-listing');
                    setSetupModalInitialStep(2);
                    setIsApplicationSetupModalOpen(true);
                    triggerToast('Opened Setup Modal: Step 2 (Profile Selection)');
                    return;
                  }
                  if (target === 'step-8-cosigner-preview' && !profileFormData.cosigner) {
                    setProfileFormData((prev) => ({
                      ...prev,
                      cosigner: {
                        fullName: 'Elena Reed',
                        relationship: 'Mother',
                        email: 'elena.reed@example.com',
                        phone: '(412) 555-4921',
                        employer: 'UPMC Health System — Senior Director',
                        monthlyIncome: 11500,
                        hasDocs: true,
                        status: 'pending',
                      },
                    }));
                  }
                  setCurrentStep(target);
                  triggerToast(`Navigated to ${target}`);
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="step-1-listing">Listing Page</option>
                <option value="step-6-group">Setup Modal: Step 1 (Roommates)</option>
                <option value="step-5-decision">Setup Modal: Step 2 (Profile Source)</option>
                <option value="step-7-profile">Rental Profile (Full Form)</option>
                <option value="step-8-cosigner-preview">Cosigner Review</option>
                <option value="step-9-submit">Review &amp; Submit</option>
                <option value="step-10-group-status">Group Status Dashboard</option>
                <option value="step-11-confirmation">Submission Confirmation</option>
                <option value="step-12-history">Application History</option>
                <option value="step-3-message">Landlord Chat</option>
              </select>
            </div>

            {/* State Inspector / Switchers */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2 mb-3.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-500 font-medium">Application Path:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setApplicationType('solo');
                      triggerToast('Switched path to: Solo');
                    }}
                    className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                      applicationType === 'solo' ? 'bg-[#006AFF] text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Solo
                  </button>
                  <button
                    onClick={() => {
                      setApplicationType('group');
                      triggerToast('Switched path to: Group (Enables Group Dashboard)');
                    }}
                    className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                      applicationType === 'group' ? 'bg-[#006AFF] text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Group
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-500 font-medium">Profile Data:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setUseSavedProfile(true);
                      setProfileFormData({ ...mockJordanSavedProfile });
                      triggerToast('Switched to pre-filled Jordan Reed saved profile');
                    }}
                    className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                      useSavedProfile ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Saved
                  </button>
                  <button
                    onClick={() => {
                      setUseSavedProfile(false);
                      setProfileFormData({ ...mockBlankProfile });
                      triggerToast('Switched to blank application template');
                    }}
                    className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                      !useSavedProfile ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Blank
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                id="btn-reset-demo"
                onClick={() => {
                  handleResetDemo();
                  setIsDebuggerOpen(false);
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={() => setIsDebuggerOpen(false)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-700 transition-colors cursor-pointer"
              >
                Collapse
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 sm:right-6 z-50 bg-gray-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl border border-gray-700 flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-gray-400 hover:text-white p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

