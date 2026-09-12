import React, { useState } from 'react';
import {
  FileText,
  Building,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  Search,
  ExternalLink,
  Users,
  Eye,
  X,
  Sparkles,
} from 'lucide-react';
import { HistoricalApplication, ListingDetails } from '../types';
import { Button } from './ui/Button';

interface ApplicationHistoryScreenProps {
  listing: ListingDetails;
  currentSubmission: {
    address: string;
    unit: string;
    management: string;
    rent: number;
    applicants: string[];
    cosignerName?: string;
  };
  onReturnToListing: () => void;
  onResetDemo: () => void;
  onNotify: (msg: string) => void;
}

export const ApplicationHistoryScreen: React.FC<ApplicationHistoryScreenProps> = ({
  listing,
  currentSubmission,
  onReturnToListing,
  onResetDemo,
  onNotify,
}) => {
  const [selectedApp, setSelectedApp] = useState<HistoricalApplication | null>(null);

  // Past submissions list (historical records, not selectable versions)
  const historyList: HistoricalApplication[] = [
    {
      id: 'app-curr',
      propertyAddress: currentSubmission.address,
      unit: currentSubmission.unit,
      rent: currentSubmission.rent,
      managementCompany: currentSubmission.management,
      submittedAt: 'Today · Sept 12, 2026',
      status: 'Under Review',
      applicants: currentSubmission.applicants,
      cosignerName: currentSubmission.cosignerName,
      matchScore: '94% Match (Strong Fit)',
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'app-prev-1',
      propertyAddress: '5514 Ellsworth Ave',
      unit: 'Unit 4C',
      rent: 2150,
      managementCompany: 'Walnut Capital Living',
      submittedAt: 'Submitted Aug 7, 2026',
      status: 'Approved',
      applicants: ['Jordan Reed', 'Priya Sharma'],
      cosignerName: 'Elena Reed',
      matchScore: '91% Match',
      imageUrl: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'app-prev-2',
      propertyAddress: '6101 Penn Ave',
      unit: 'Apt 208',
      rent: 1850,
      managementCompany: 'Nexus Real Estate',
      submittedAt: 'Submitted July 14, 2026',
      status: 'Lease Offered',
      applicants: ['Jordan Reed'],
      matchScore: '88% Match',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'app-prev-3',
      propertyAddress: '5820 Forbes Ave',
      unit: 'Suite 12',
      rent: 2400,
      managementCompany: 'Forward Management Co.',
      submittedAt: 'Submitted May 22, 2026',
      status: 'Completed',
      applicants: ['Jordan Reed', 'Sam Chen'],
      matchScore: '96% Match',
      imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Top Bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-4 border-b border-gray-200">
        <Button
          id="btn-history-back-to-listing"
          variant="secondary"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={onReturnToListing}
        >
          Back
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetDemo}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Reset
          </Button>
          <div className="flex items-center gap-1.5 text-xs text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full font-medium">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Applications</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl w-full mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Application history
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Track your sent applications and review status updates.
          </p>
        </div>

        {/* History List */}
        <div className="space-y-3 mb-8">
          {historyList.map((app) => (
            <div
              key={app.id}
              onClick={() => {
                setSelectedApp(app);
                onNotify(`Viewing submission record for ${app.propertyAddress}`);
              }}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-3.5">
                {app.imageUrl ? (
                  <img
                    src={app.imageUrl}
                    alt={app.propertyAddress}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0 mt-0.5 shadow-2xs"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Building className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {app.managementCompany} — {app.propertyAddress} {app.unit}
                    </h3>
                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                        app.status === 'Approved' || app.status === 'Lease Offered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'Under Review'
                          ? 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {app.submittedAt}
                    </span>
                    <span>•</span>
                    <span>${app.rent.toLocaleString()}/mo</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      {app.applicants.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform hidden sm:inline">
                  View
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>

        {/* Reusability Callout Card */}
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-blue-950">
                Your application profile is active and ready for other listings
              </h4>
              <p className="text-xs text-blue-800 mt-0.5">
                No need to re-enter paystubs, credit authorizations, or cosigners for future applications.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onReturnToListing}
          >
            Explore listings
          </Button>
        </div>
      </div>

      {/* Static "Here's what was submitted" Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-200 relative my-8">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase mb-2">
              <FileText className="w-4 h-4" />
              <span>Immutable Submission Record</span>
            </div>

            <h2 className="text-xl font-black text-gray-900 mb-1">
              {selectedApp.managementCompany}
            </h2>
            <p className="text-xs text-gray-600 mb-3">
              {selectedApp.propertyAddress}, {selectedApp.unit} · {selectedApp.submittedAt}
            </p>

            {selectedApp.imageUrl && (
              <div className="mb-4 rounded-2xl overflow-hidden border border-gray-200 aspect-16/9">
                <img
                  src={selectedApp.imageUrl}
                  alt={selectedApp.propertyAddress}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-xs space-y-2.5 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Monthly Rent:</span>
                <span className="font-bold text-gray-900">${selectedApp.rent.toLocaleString()}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Applicants on Lease:</span>
                <span className="font-bold text-gray-900">{selectedApp.applicants.join(', ')}</span>
              </div>
              {selectedApp.cosignerName && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Cosigner:</span>
                  <span className="font-bold text-gray-900">{selectedApp.cosignerName} (Verified)</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Current Status:</span>
                <span className="font-bold text-emerald-700">{selectedApp.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Match Compatibility:</span>
                <span className="font-bold text-blue-700">{selectedApp.matchScore}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => setSelectedApp(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-gray-500 py-2 border-t border-gray-200">
        <span>Submitted Applications &amp; Immutable Records</span>
      </div>
    </div>
  );
};
