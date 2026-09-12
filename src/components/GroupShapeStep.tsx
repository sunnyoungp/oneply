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
  // Phase 3: Two-tap pattern for Group Shape selection
  const [selectedShape, setSelectedShape] = useState<'solo' | 'roommates'>('roommates');
  const [roommates, setRoommates] = useState<Roommate[]>(initialRoommates);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSelectShape = (shape: 'solo' | 'roommates') => {
    setSelectedShape(shape);
    onNotify(
      shape === 'solo'
        ? 'Selected: Applying alone. Click Continue below to proceed to your profile.'
        : 'Selected: Applying with roommates. Click Continue below to setup roommate invitations.'
    );
  };

  const handleContinueChoice = () => {
    if (selectedShape === 'solo') {
      onSelectSolo();
    } else {
      setView('invite');
    }
  };

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
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Rental Pass · Roommate Setup</span>
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
                <span>Application Type</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Who will be living with you?
              </h2>
              <p className="text-sm text-gray-600 mt-2 max-w-lg mx-auto">
                Choose whether you&apos;re applying alone or with roommates for{' '}
                <strong className="text-gray-900">{listing.address}</strong>.
              </p>
            </div>

            {/* The Two Choice Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
              {/* Option A: Applying alone */}
              <div
                id="card-applying-alone"
                onClick={() => handleSelectShape('solo')}
                className={`rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between group ${
                  selectedShape === 'solo'
                    ? 'bg-white border-2 border-[#006AFF] ring-4 ring-blue-100 shadow-lg'
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#006AFF] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <User className="w-6 h-6" />
                    </div>
                    {/* Radio Indicator */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                        selectedShape === 'solo'
                          ? 'border-[#006AFF] bg-[#006AFF] text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {selectedShape === 'solo' && <CheckCircle2 className="w-4 h-4 fill-white text-[#006AFF]" />}
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 mb-1">Applying alone</h3>
                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                    You are the only person on this lease. No roommate invites needed.
                  </p>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs space-y-1 text-gray-600">
                    <div className="flex items-center gap-1.5 font-bold text-gray-900">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Single leaseholder</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Direct route to your profile.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Fast track</span>
                  <span className={`font-bold ${selectedShape === 'solo' ? 'text-[#006AFF]' : 'text-gray-500'}`}>
                    {selectedShape === 'solo' ? 'Selected' : 'Select'}
                  </span>
                </div>
              </div>

              {/* Option B: Applying with roommates */}
              <div
                id="card-applying-with-roommates"
                onClick={() => handleSelectShape('roommates')}
                className={`rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between group relative ${
                  selectedShape === 'roommates'
                    ? 'bg-white border-2 border-[#006AFF] ring-4 ring-blue-100 shadow-lg'
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300 shadow-xs'
                }`}
              >
                <div className="absolute top-0 right-0 flex items-center">
                  <span className="bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-bl-lg">
                    Multi-Tenant
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Users className="w-6 h-6" />
                    </div>
                    {/* Radio Indicator */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                        selectedShape === 'roommates'
                          ? 'border-[#006AFF] bg-[#006AFF] text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {selectedShape === 'roommates' && <CheckCircle2 className="w-4 h-4 fill-white text-[#006AFF]" />}
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 mb-1">Applying with roommates</h3>
                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                    Apply together and track everyone&apos;s progress in one place.
                  </p>

                  <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 text-xs space-y-1 text-indigo-950">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Group coordination</span>
                    </div>
                    <p className="text-[11px] text-indigo-700 leading-normal">
                      We&apos;ll bundle everyone&apos;s applications together for the landlord.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-indigo-600 font-medium">Group dashboard</span>
                  <span className={`font-bold ${selectedShape === 'roommates' ? 'text-[#006AFF]' : 'text-gray-500'}`}>
                    {selectedShape === 'roommates' ? 'Selected' : 'Select'}
                  </span>
                </div>
              </div>
            </div>

            {/* Phase 3 Explicit Two-Tap Continue Action */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
              <button
                id="btn-continue-group-choice"
                onClick={handleContinueChoice}
                className="w-full sm:w-auto min-w-[280px] py-3.5 px-8 rounded-xl bg-[#006AFF] hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        ) : (
          /* SUB-VIEW 2: ROOMMATE INVITE SCREEN */
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5 mb-1">
                <Users className="w-4 h-4" />
                Roommate Invitations
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                Invite your roommates
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Add roommates so they can join your application for {listing.address}.
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
                <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-lg">
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
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
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
                <span>Add</span>
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
                Back
              </button>

              <button
                id="btn-send-invites-and-continue"
                type="button"
                onClick={handleSendInvitesAndContinue}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="max-w-3xl w-full mx-auto text-center text-xs text-gray-500 py-2 border-t border-gray-200/80">
        <span>Applying to: {listing.address}, {listing.unit}</span>
      </div>
    </div>
  );
};
