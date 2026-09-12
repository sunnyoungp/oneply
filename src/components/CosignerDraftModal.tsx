import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  Paperclip,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  Upload,
  Info,
} from 'lucide-react';
import { CosignerData, ListingDetails } from '../types';
import { Button } from './ui/Button';
import { Input, Select } from './ui/Input';

interface CosignerDraftModalProps {
  listing: ListingDetails;
  initialData: CosignerData | null;
  applicantName: string;
  isOpen: boolean;
  onClose: () => void;
  onSendToCosigner: (cosigner: CosignerData) => void;
  onNotify: (msg: string) => void;
}

export const CosignerDraftModal: React.FC<CosignerDraftModalProps> = ({
  listing,
  initialData,
  applicantName,
  isOpen,
  onClose,
  onSendToCosigner,
  onNotify,
}) => {
  const [fullName, setFullName] = useState(initialData?.fullName || 'Elena Reed');
  const [relationship, setRelationship] = useState(initialData?.relationship || 'Mother');
  const [email, setEmail] = useState(initialData?.email || 'elena.reed@example.com');
  const [phone, setPhone] = useState(initialData?.phone || '(412) 555-4921');
  const [employer, setEmployer] = useState(initialData?.employer || 'UPMC Health System — Senior Director');
  const [monthlyIncome, setMonthlyIncome] = useState(initialData?.monthlyIncome || 11500);
  const [hasDocs, setHasDocs] = useState(initialData?.hasDocs ?? true);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      onNotify('Please enter your cosigner’s name and email.');
      return;
    }

    const draftedCosigner: CosignerData = {
      fullName: fullName.trim(),
      relationship: relationship.trim(),
      email: email.trim(),
      phone: phone.trim(),
      employer: employer.trim(),
      monthlyIncome: Number(monthlyIncome) || 0,
      hasDocs,
      status: 'pending',
    };

    onSendToCosigner(draftedCosigner);
    onNotify(`One-time link generated for ${draftedCosigner.fullName} (${draftedCosigner.email})!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200 font-sans">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-gray-200 relative my-8">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-5 right-5"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 bg-[#EFF6FF] text-[#1D4ED8] text-xs font-bold px-3 py-1 rounded-full mb-2 border border-[#BFDBFE]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Delegated Cosigner Flow · Core Differentiator</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            Pre-fill draft for your cosigner
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
            Instead of making your cosigner fill out an entire tedious application from scratch, you pre-fill the details on their behalf. They receive a 1-click link to review, verify, and sign.
          </p>
        </div>

        {/* The Draft Form */}
        <form onSubmit={handleSend} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Cosigner Full Name</label>
              <Input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Elena Reed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Relationship to You</label>
              <Select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
              >
                <option value="Mother">Parent / Mother</option>
                <option value="Father">Parent / Father</option>
                <option value="Guardian">Legal Guardian</option>
                <option value="Family Member">Other Family Member</option>
                <option value="Corporate / Other">Employer / Other</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Cosigner Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cosigner@email.com"
                  className="pl-9 pr-3"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(412) 555-0192"
                  className="pl-9 pr-3"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Cosigner Employer</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <Input
                  type="text"
                  value={employer}
                  onChange={(e) => setEmployer(e.target.value)}
                  placeholder="Employer Name & Title"
                  className="pl-9 pr-3"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Estimated Monthly Income ($)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <Input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  placeholder="10000"
                  className="pl-9 pr-3"
                />
              </div>
            </div>
          </div>

          {/* Mock Document Upload */}
          <div className="p-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-gray-500" />
              <div>
                <span className="font-semibold text-gray-800">Cosigner Proof of Income / W-2</span>
                <p className="text-[11px] text-gray-500">Optional: pre-attach doc on their behalf</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setHasDocs(true);
                onNotify('Simulated W-2 document attached (Elena_Reed_2025_W2.pdf)');
              }}
              className="px-2.5 py-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1 transition-colors"
            >
              {hasDocs ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{hasDocs ? 'Attached' : 'Attach doc'}</span>
            </button>
          </div>

          {/* Value Proposition Explainer Note */}
          <div className="bg-[#EFF6FF]/70 border border-[#BFDBFE] rounded-xl p-3 text-xs text-[#1D4ED8] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1D4ED8] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              When you click <strong>&quot;Send to {fullName || 'Cosigner'}&quot;</strong>, a secure one-time link is generated. Your cosigner will only need to verify this pre-filled draft and provide their legal signature.
            </p>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              id="btn-send-to-cosigner"
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
