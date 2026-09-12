import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Send,
  Zap,
} from 'lucide-react';
import { ListingDetails, Roommate, CosignerData } from '../types';

interface GroupStatusDashboardProps {
  listing: ListingDetails;
  applicantName: string;
  applicantCosigner: CosignerData | null;
  roommates: Roommate[];
  onTransmitGroupApplication: () => void;
  onBackToSubmit: () => void;
  onNotify: (msg: string) => void;
}

export const GroupStatusDashboard: React.FC<GroupStatusDashboardProps> = ({
  listing,
  applicantName,
  applicantCosigner,
  roommates,
  onTransmitGroupApplication,
  onBackToSubmit,
  onNotify,
}) => {
  // Mock group state
  const [groupState, setGroupState] = useState([
    {
      id: 'primary',
      name: applicantName,
      role: 'Lead Applicant (You)',
      status: 'submitted' as 'submitted' | 'pending' | 'not_started',
      cosignerStatus: applicantCosigner ? applicantCosigner.status : 'none',
      cosignerName: applicantCosigner?.fullName,
      avatarBg: 'bg-blue-600',
    },
    {
      id: 'rm-priya',
      name: 'Priya Sharma',
      role: 'Co-applicant',
      status: 'submitted' as 'submitted' | 'pending' | 'not_started',
      cosignerStatus: 'pending' as 'none' | 'pending' | 'confirmed',
      cosignerName: 'Anil Sharma (Father)',
      avatarBg: 'bg-purple-600',
    },
    {
      id: 'rm-sam',
      name: 'Sam Chen',
      role: 'Co-applicant',
      status: 'not_started' as 'submitted' | 'pending' | 'not_started',
      cosignerStatus: 'none' as 'none' | 'pending' | 'confirmed',
      avatarBg: 'bg-emerald-600',
    },
  ]);

  const allCompleted = groupState.every(
    (member) => member.status === 'submitted' && (member.cosignerStatus === 'none' || member.cosignerStatus === 'confirmed')
  );

  // DEMO-ONLY TRIGGER to mark all complete (as requested in spec)
  const handleMarkAllComplete = () => {
    setGroupState((prev) =>
      prev.map((m) => ({
        ...m,
        status: 'submitted',
        cosignerStatus: m.cosignerStatus === 'pending' ? 'confirmed' : m.cosignerStatus,
      }))
    );
    onNotify('Demo action: Simulated Priya’s cosigner confirmed and Sam Chen submitted profile!');
  };

  const handleTransmit = () => {
    if (!allCompleted) {
      onNotify('Group application requires all members and cosigners to be complete.');
      return;
    }
    onNotify('All roommates complete! Transmitting joint group package to landlord.');
    onTransmitGroupApplication();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Top Bar */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between pb-4 border-b border-gray-200">
        <button
          id="btn-back-from-group-status"
          onClick={onBackToSubmit}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to review</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full font-medium">
          <Users className="w-3.5 h-3.5 text-indigo-600" />
          <span>Rental Pass · Group Status</span>
        </div>
      </div>

      {/* Main Dashboard Container */}
      <div className="max-w-2xl w-full mx-auto my-auto py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-4 border-b border-gray-100">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-indigo-100/80 text-indigo-800 text-xs font-semibold px-3 py-0.5 rounded-full mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>Group Status</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                Group application progress
              </h1>
              <p className="text-xs text-gray-600 mt-1 max-w-lg">
                Track your roommates&apos; applications. Once all are complete, you can submit the group packet to {listing.managementCompany}.
              </p>
            </div>

            {/* Quick Demo Accelerator (Spec requirement) */}
            <button
              id="btn-simulate-everyone-done"
              onClick={handleMarkAllComplete}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Click to simulate all roommates finishing without manual input"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Mark all complete</span>
            </button>
          </div>

          {/* Group Status Cards */}
          <div className="space-y-4 mb-6">
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Roommates ({groupState.length})
            </div>

            {groupState.map((member) => (
              <div
                key={member.id}
                className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-xs space-y-2.5 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${member.avatarBg} text-white font-bold flex items-center justify-center text-xs`}>
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{member.name}</div>
                      <div className="text-[11px] text-gray-500">{member.role}</div>
                    </div>
                  </div>

                  {/* Member status pill */}
                  <div>
                    {member.status === 'submitted' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Submitted</span>
                      </span>
                    ) : member.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                        <Clock className="w-3.5 h-3.5 text-[#1D4ED8]" />
                        <span>In progress</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        <AlertCircle className="w-3.5 h-3.5 text-gray-500" />
                        <span>Not started</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* NESTED COSIGNER STATUS (Must be nested under person, not top-level) */}
                {member.cosignerStatus !== 'none' && (
                  <div className="ml-12 p-2.5 bg-white rounded-xl border border-gray-200/80 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>
                        Cosigner: <strong>{member.cosignerName || 'Guarantor'}</strong>
                      </span>
                    </div>

                    {member.cosignerStatus === 'confirmed' ? (
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Confirmed</span>
                      </span>
                    ) : (
                      <span className="font-bold text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#1D4ED8]" />
                        <span>Pending sign-off</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Readiness Summary Banner */}
          <div
            className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
              allCompleted
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-[#EFF6FF] border-[#BFDBFE] text-blue-950'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {allCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <Clock className="w-5 h-5 text-[#1D4ED8] shrink-0" />
              )}
              <div>
                <span className="font-bold block">
                  {allCompleted
                    ? 'Everyone is ready!'
                    : 'Waiting on roommates'}
                </span>
                <span className="text-[11px] opacity-85">
                  {allCompleted
                    ? 'All roommates have completed their profiles and cosigners.'
                    : 'All group members must finish before submitting to the landlord.'}
                </span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBackToSubmit}
              className="w-full sm:w-auto text-xs text-gray-600 hover:text-gray-900 font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Back to review
            </button>

            <button
              id="btn-transmit-group-package"
              type="button"
              disabled={!allCompleted}
              onClick={handleTransmit}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#006AFF] hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Submit group application</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-3xl w-full mx-auto text-center text-xs text-gray-500 py-2">
        <span>Rental Pass · Group Application</span>
      </div>
    </div>
  );
};
