import React, { useState } from 'react';
import {
  User,
  Users,
  ArrowRight,
  ArrowLeft,
  Mail,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Share2,
  Copy,
  Info,
} from 'lucide-react';
import { ListingDetails, Roommate } from '../types';

interface GroupShapeStepProps {
  listing: ListingDetails;
  initialRoommates?: Roommate[];
  onSelectSolo: () => void;
  onSelectGroup: (roommates: Roommate[]) => void;
  onBack: () => void;
  onNotify: (msg: string) => void;
}

export const GroupShapeStep: React.FC<GroupShapeStepProps> = ({
  listing,
  initialRoommates = [
    {
      id: 'rm-1',
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      status: 'invited',
      profileCompletion: 85,
      avatarColor: 'bg-purple-600',
    },
    {
      id: 'rm-2',
      name: 'Sam Chen',
      email: 'sam.chen@cmu.edu',
      status: 'invited',
      profileCompletion: 70,
      avatarColor: 'bg-emerald-600',
    },
  ],
  onSelectSolo,
  onSelectGroup,
  onBack,
  onNotify,
}) => {
  const [view, setView] = useState<'choice' | 'invite'>('choice');
  const [roommates, setRoommates] = useState<Roommate[]>(initialRoommates);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleAddRoommate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      onNotify('Please enter both name and email for the roommate.');
      return;
    }

    const colors = ['bg-amber-600', 'bg-rose-600', 'bg-cyan-600', 'bg-indigo-600'];
    const randomColor = colors[roommates.length % colors.length];

    const newMember: Roommate = {
      id: `rm-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      status: 'invited',
      profileCompletion: 0,
      avatarColor: randomColor,
    };

    setRoommates((prev) => [...prev, newMember]);
    setNewName('');
    setNewEmail('');
    onNotify(`Added ${newMember.name} to your roommate group.`);
  };

  const handleRemoveRoommate = (id: string, name: string) => {
    setRoommates((prev) => prev.filter((r) => r.id !== id));
    onNotify(`Removed ${name} from the application group.`);
  };

  const handleCopyInviteLink = () => {
    setCopiedLink(true);
    onNotify('Simulated roommate invite link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSendInvitesAndContinue = () => {
    if (roommates.length === 0) {
      onNotify('Please add at least one roommate or choose "Applying alone".');
      return;
    }
    onNotify(`Simulated invites dispatched to ${roommates.length} roommate(s)!`);
    onSelectGroup(roommates);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Top Bar Navigation (Zero Dead Ends) */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between">
        <button
          id="btn-back-from-group-shape"
          onClick={() => {
            if (view === 'invite') {
              setView('choice');
            } else {
              onBack();
            }
          }}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{view === 'invite' ? 'Back to applicant type' : 'Back to Step 5'}</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Rental Pass · Step 6 of 12</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl w-full mx-auto my-auto py-8">
        {view === 'choice' ? (
          /* SUB-VIEW 1: CHOICE (Solo vs Roommates) */
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Application Configuration</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Who will be living with you?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-lg mx-auto">
                Select your group structure for{' '}
                <strong className="text-gray-900">{listing.address}</strong>. This determines whether roommate invitation links and group tracking are enabled.
              </p>
            </div>

            {/* The Two Choice Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
              {/* Option A: Applying alone */}
              <div
                id="card-applying-alone"
                onClick={() => {
                  onNotify('Selected: Applying alone. Skipping roommate invite screen ➔ proceeding to Step 7.');
                  onSelectSolo();
                }}
                className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Applying alone</h3>
                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                    You are the sole applicant. No other tenant profiles or roommate coordination required.
                  </p>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs space-y-1 text-gray-600">
                    <div className="flex items-center gap-1.5 font-medium text-gray-900">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Single leaseholder</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Skips roommate invite flow and routes directly to your profile.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">Fast track</span>
                  <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Continue alone</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Option B: Applying with roommates */}
              <div
                id="card-applying-with-roommates"
                onClick={() => {
                  setView('invite');
                  onNotify('Selected: Applying with roommates. Opening roommate invite setup screen.');
                }}
                className="bg-white rounded-2xl p-6 border-2 border-indigo-300 hover:border-indigo-600 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group relative ring-2 ring-indigo-50"
              >
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-bl-lg">
                  Multi-Tenant
                </div>

                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Applying with roommates</h3>
                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                    Split rent with roommates. Everyone submits a verified profile and you can track real-time group readiness.
                  </p>

                  <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 text-xs space-y-1 text-indigo-950">
                    <div className="flex items-center gap-1.5 font-semibold text-indigo-900">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Includes Step 10 Group Status Dashboard</span>
                    </div>
                    <p className="text-[11px] text-indigo-700">
                      Sync profiles into a joint package before final landlord submission.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-indigo-600 font-medium">Invite screen next</span>
                  <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Configure roommates</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500">
              Note: This branch determines whether the <strong>Step 10 Group Status Dashboard</strong> is enabled.
            </div>
          </div>
        ) : (
          /* SUB-VIEW 2: ROOMMATE INVITE SCREEN */
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5 mb-1">
                <Users className="w-4 h-4" />
                Step 6: Roommate Invitations
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                Invite your roommates
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Enter your roommates&apos; details so they receive an invitation link to attach their verified Rental Pass to this lease at {listing.address}.
              </p>
            </div>

            {/* List of current roommates */}
            <div className="space-y-3 mb-6">
              <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Group Members ({roommates.length + 1} Total including you)
              </div>

              {/* Primary User (Current applicant) */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    You
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Jordan Reed (Primary Applicant)</div>
                    <div className="text-gray-500 text-[11px]">jordan.reed@example.com · Initiator</div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  Lead Renter
                </span>
              </div>

              {/* Invited Roommates */}
              {roommates.map((rm) => (
                <div
                  key={rm.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full ${rm.avatarColor} text-white font-bold flex items-center justify-center text-xs`}
                    >
                      {rm.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{rm.name}</div>
                      <div className="text-gray-500 text-[11px]">{rm.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      Ready to invite
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRoommate(rm.id, rm.name)}
                      className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Remove roommate"
                      aria-label={`Remove ${rm.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Form to add another roommate */}
            <form
              onSubmit={handleAddRoommate}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6"
            >
              <div className="text-xs font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                <span>Add another roommate</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Roommate Full Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Roommate Email Address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to group</span>
              </button>
            </form>

            {/* Quick Share Link */}
            <div className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 mb-6 text-xs">
              <div className="flex items-center gap-2 text-indigo-900">
                <Share2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">Shareable link: rentalpass.app/join/lease-4720-centre</span>
              </div>
              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors shrink-0 cursor-pointer"
              >
                {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy link'}</span>
              </button>
            </div>

            {/* Bottom Primary Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setView('choice')}
                className="w-full sm:w-auto text-xs text-gray-600 hover:text-gray-900 font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Change to solo application
              </button>

              <button
                id="btn-send-invites-and-continue"
                type="button"
                onClick={handleSendInvitesAndContinue}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Send invites &amp; continue to profile</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="max-w-3xl w-full mx-auto text-center text-xs text-gray-500 py-2 border-t border-gray-200/80">
        <span>Target Listing: {listing.address}, {listing.unit} ({listing.managementCompany})</span>
      </div>
    </div>
  );
};
