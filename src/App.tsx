/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ZillowNavbar } from './components/ZillowNavbar';
import { ListingPage } from './components/ListingPage';
import { TourRequestModal } from './components/TourRequestModal';
import { MessageThread } from './components/MessageThread';
import { HandoffInterstitial } from './components/HandoffInterstitial';
import { ProfileDecisionStep } from './components/ProfileDecisionStep';
import { GroupShapeStep } from './components/GroupShapeStep';
import { ProfileStep } from './components/ProfileStep';
import { CosignerDraftModal } from './components/CosignerDraftModal';
import { CosignerReviewScreen } from './components/CosignerReviewScreen';
import { SubmissionStep } from './components/SubmissionStep';
import { GroupStatusDashboard } from './components/GroupStatusDashboard';
import { SubmissionConfirmation } from './components/SubmissionConfirmation';
import { ApplicationHistoryScreen } from './components/ApplicationHistoryScreen';
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
} from 'lucide-react';

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('step-1-listing');
  const [useSavedProfile, setUseSavedProfile] = useState<boolean>(true);
  const [applicationType, setApplicationType] = useState<ApplicationType>('solo');
  const [currentUser, setCurrentUser] = useState<string>('Jordan Reed');
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Step 1 -> Step 2: Request a tour clicked
  const handleRequestTour = () => {
    setIsTourModalOpen(true);
    triggerToast('Opened Step 2: In-Person Tour & Profile Prompt');
  };

  // Step 1 -> Step 3: Message landlord clicked
  const handleMessageLandlord = () => {
    setCurrentStep('step-3-message');
    triggerToast('Opened Step 3: Landlord Message Thread');
  };

  // Step 1, 2, or 3 -> Step 4 Handoff Transition
  const handleApplyNow = () => {
    setCurrentStep('step-4-handoff');
    triggerToast('Transitioning to Rental Pass (Step 4 Handoff)');
  };

  const handleStartProfileFromTour = () => {
    handleApplyNow();
  };

  // Step 5 Decision Handlers -> Route to Step 6
  const handleChooseSavedProfile = () => {
    setUseSavedProfile(true);
    setProfileFormData({ ...mockJordanSavedProfile });
    setCurrentStep('step-6-group');
    triggerToast('Saved profile loaded (with 2 flagged fields for verification).');
  };

  const handleChooseNewApplication = () => {
    setUseSavedProfile(false);
    setProfileFormData({ ...mockBlankProfile });
    setCurrentStep('step-6-group');
    triggerToast('Blank application started. Moving to Step 6.');
  };

  // Step 6 Handlers -> Route to Step 7
  const handleSelectSolo = () => {
    setApplicationType('solo');
    setCurrentStep('step-7-profile');
    triggerToast('Applying alone. Moving directly to Step 7 Unified Profile.');
  };

  const handleSelectGroup = (updatedRoommates: Roommate[]) => {
    setApplicationType('group');
    setRoommates(updatedRoommates);
    setCurrentStep('step-7-profile');
    triggerToast(`Group application with ${updatedRoommates.length} roommate(s). Moving to Step 7.`);
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
    triggerToast('Demo reset to Step 1 (Listing Page).');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-900">
      {/* Show Zillow Top Navigation only on Zillow listing view */}
      {currentStep === 'step-1-listing' && <ZillowNavbar onNotify={triggerToast} />}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* STEP 1: Listing Page */}
        {currentStep === 'step-1-listing' && (
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

        {/* STEP 4: Handoff Interstitial */}
        {currentStep === 'step-4-handoff' && (
          <HandoffInterstitial
            listing={mockListing}
            onContinue={() => {
              setCurrentStep('step-5-decision');
              triggerToast('Advanced to Step 5 (Profile Decision)');
            }}
            onCancel={() => {
              setCurrentStep('step-1-listing');
              triggerToast('Returned to listing page.');
            }}
            onNotify={triggerToast}
          />
        )}

        {/* STEP 5: Saved Profile Decision */}
        {currentStep === 'step-5-decision' && (
          <ProfileDecisionStep
            listing={mockListing}
            mockSavedDate="August 14, 2026"
            onSelectSavedProfile={handleChooseSavedProfile}
            onSelectNewApplication={handleChooseNewApplication}
            onBack={() => setCurrentStep('step-4-handoff')}
            onNotify={triggerToast}
          />
        )}

        {/* STEP 6: Who is Applying (Solo vs Roommates) */}
        {currentStep === 'step-6-group' && (
          <GroupShapeStep
            listing={mockListing}
            initialRoommates={roommates}
            onSelectSolo={handleSelectSolo}
            onSelectGroup={handleSelectGroup}
            onBack={() => setCurrentStep('step-5-decision')}
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
            onBack={() => setCurrentStep('step-6-group')}
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

      {/* Interactive Flow Navigation Control Bar (Audited Zero Dead Ends) */}
      <div className="bg-white border-t border-gray-200 py-2.5 px-4 shadow-sm sticky bottom-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>All 12 Steps Connected</span>
            </span>

            {/* Step jump selector for demo flexibility */}
            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
              <span className="text-gray-500 font-medium">Jump to step:</span>
              <select
                value={currentStep}
                onChange={(e) => {
                  const target = e.target.value as AppStep;
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
                className="bg-transparent font-bold text-gray-900 cursor-pointer focus:outline-none"
              >
                <option value="step-1-listing">Step 1: Listing Page</option>
                <option value="step-3-message">Step 3: Landlord Chat</option>
                <option value="step-4-handoff">Step 4: Handoff Interstitial</option>
                <option value="step-5-decision">Step 5: Saved Profile Decision</option>
                <option value="step-6-group">Step 6: Who is Applying?</option>
                <option value="step-7-profile">Step 7: Reusable Profile</option>
                <option value="step-8-cosigner-preview">Step 8: Cosigner Link Preview</option>
                <option value="step-9-submit">Step 9: Individual Submission</option>
                <option value="step-10-group-status">Step 10: Group Status View</option>
                <option value="step-11-confirmation">Step 11: Confirmation</option>
                <option value="step-12-history">Step 12: Application History</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-500 text-[11px]">
            <span>Active Path: <strong className="text-gray-800">{applicationType === 'solo' ? 'Solo (Skips Step 10)' : 'Group (Activates Step 10)'}</strong></span>
            <span>·</span>
            <span>Profile: <strong className="text-gray-800">{useSavedProfile ? 'Saved (Pre-filled)' : 'New (Blank)'}</strong></span>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-14 right-6 z-50 bg-gray-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl border border-gray-700 flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-gray-400 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

