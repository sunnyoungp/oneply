import React, { useState } from 'react';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Building,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { ListingDetails } from '../types';

interface ListingPageProps {
  listing: ListingDetails;
  onRequestTour: () => void;
  onMessageLandlord: () => void;
  onApplyNow: () => void;
  onNotify: (msg: string) => void;
}

export const ListingPage: React.FC<ListingPageProps> = ({
  listing,
  onRequestTour,
  onMessageLandlord,
  onApplyNow,
  onNotify,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);
  const [selectedTourDate, setSelectedTourDate] = useState('Tomorrow, 2:30 PM');

  const tourDates = [
    'Tomorrow, 2:30 PM',
    'Saturday, 11:00 AM',
    'Saturday, 3:00 PM',
    'Sunday, 1:00 PM',
  ];

  return (
    <div className="pb-24 sm:pb-16 bg-[#FAFAFB] min-h-screen text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Main Hero Photo */}
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-gray-900 shadow-md aspect-16/10 group">
            <img
              src={listing.photos[activePhotoIdx].url}
              alt={listing.photos[activePhotoIdx].caption}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-101"
            />
            {/* Overlay Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                Verified Listing
              </span>
              <span className="bg-white/95 text-gray-800 text-xs font-medium px-3 py-1 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Updated 4 hours ago
              </span>
            </div>

            {/* Photo caption & navigation counter */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <span className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-xs max-w-[80%] truncate">
                {listing.photos[activePhotoIdx].caption}
              </span>
              <span className="bg-black/70 text-white text-xs font-medium px-2.5 py-1 rounded-md backdrop-blur-xs">
                {activePhotoIdx + 1} / {listing.photos.length}
              </span>
            </div>

            {/* Next / Prev overlay buttons */}
            <button
              id="btn-prev-photo"
              onClick={() =>
                setActivePhotoIdx((prev) =>
                  prev === 0 ? listing.photos.length - 1 : prev - 1
                )
              }
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-gray-800 flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-80 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              id="btn-next-photo"
              onClick={() =>
                setActivePhotoIdx((prev) =>
                  prev === listing.photos.length - 1 ? 0 : prev + 1
                )
              }
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-gray-800 flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-80 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Secondary Thumbnail Grid */}
          <div className="hidden lg:grid grid-cols-2 gap-3 h-full">
            {listing.photos.slice(1, 5).map((photo, idx) => (
              <button
                key={photo.url}
                id={`btn-thumbnail-${idx + 1}`}
                onClick={() => setActivePhotoIdx(idx + 1)}
                className={`relative rounded-xl overflow-hidden aspect-4/3 text-left border-2 transition-all group ${
                  activePhotoIdx === idx + 1
                    ? 'border-blue-600 ring-2 ring-blue-100 shadow-sm'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <span className="text-white text-[11px] font-medium leading-tight truncate">
                    {photo.caption}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left 2 Columns: Listing Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header info */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                      ${listing.rent.toLocaleString()}
                    </span>
                    <span className="text-gray-500 font-medium text-lg">/mo</span>
                    <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      $2.05 / sq ft
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Deposit: ${listing.deposit.toLocaleString()} · Lease: 12 months
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold text-gray-900">{listing.beds}</span>
                    <span>beds</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1.5">
                    <Bath className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold text-gray-900">{listing.baths}</span>
                    <span>baths</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-900">{listing.sqft.toLocaleString()}</span>
                    <span>sqft</span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {listing.address}, {listing.unit}
                  </h1>
                  <p className="text-gray-600 text-sm flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      {listing.city}, {listing.state} {listing.zip} · Bloomfield / Shadyside
                    </span>
                  </p>
                </div>
                <button
                  id="btn-view-map"
                  onClick={() => onNotify('Simulating Google Maps transit & neighborhood view for Bloomfield, Pittsburgh')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View neighborhood map
                </button>
              </div>

              {/* Key Highlights Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-gray-100">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-xs text-gray-500">Availability</div>
                  <div className="text-sm font-bold text-gray-900 mt-0.5">{listing.availableDate}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-xs text-gray-500">Property Type</div>
                  <div className="text-sm font-bold text-gray-900 mt-0.5">{listing.propertyType}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-xs text-gray-500">Pet Policy</div>
                  <div className="text-sm font-bold text-emerald-700 mt-0.5">Cats & Dogs OK</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-xs text-gray-500">Laundry</div>
                  <div className="text-sm font-bold text-gray-900 mt-0.5">In-unit W/D</div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200 shadow-xs">
              <h2 className="text-lg font-bold text-gray-900 mb-3">About this rental</h2>
              <p
                className={`text-gray-700 leading-relaxed text-sm sm:text-base ${
                  !showFullDesc ? 'line-clamp-3' : ''
                }`}
              >
                {listing.description}
              </p>
              <button
                id="btn-toggle-description"
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>{showFullDesc ? 'Show less' : 'Read full description'}</span>
                {showFullDesc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Features & Amenities Tabs */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200 shadow-xs">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Amenities & Highlights</h2>
              
              <div className="flex border-b border-gray-200 mb-4 gap-2 overflow-x-auto">
                {listing.features.map((cat, idx) => (
                  <button
                    key={cat.category}
                    id={`btn-feature-tab-${idx}`}
                    onClick={() => setActiveFeatureTab(idx)}
                    className={`pb-2.5 px-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                      activeFeatureTab === idx
                        ? 'border-blue-600 text-blue-600 font-semibold'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {listing.features[activeFeatureTab].items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm text-gray-800">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Walk Score & transit snippet */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Getting Around Shadyside</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Walk Score: 94 (Walker's Paradise) · Transit Score: 78 · Bike Score: 85
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <span className="px-2.5 py-1 bg-gray-100 rounded-md">61C, 71B buses</span>
                <span className="px-2.5 py-1 bg-gray-100 rounded-md">CMU / Pitt shuttles</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Action Card (Sticky) */}
          <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl p-6 border-2 border-blue-100 shadow-lg relative">
              {/* Top Accent Tag */}
              <div className="absolute -top-3 left-6 bg-blue-600 text-white text-[11px] font-bold tracking-wider uppercase px-3 py-0.5 rounded-full shadow-xs">
                Ready for Application
              </div>

              <div className="mb-5 pt-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Offered by
                </div>
                <div className="text-base font-bold text-gray-900">
                  {listing.managementCompany}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Licensed Property Manager · Response time: &lt; 1 hr</span>
                </div>
              </div>

              {/* Tour Date Quick Selector for realism */}
              <div className="mb-4 bg-gray-50 p-3 rounded-xl border border-gray-200/80">
                <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    Preferred Tour Date:
                  </span>
                  <span className="text-[11px] text-blue-600 font-semibold">In-person</span>
                </label>
                <select
                  id="select-tour-date"
                  value={selectedTourDate}
                  onChange={(e) => {
                    setSelectedTourDate(e.target.value);
                    onNotify(`Selected preferred tour date: ${e.target.value}`);
                  }}
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {tourDates.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* ACTION BUTTONS (Explicit Step 1 Requirement) */}
              <div className="space-y-3">
                {/* 1. Request a tour (LARGEST / PRIMARY - matches real renter behavior) */}
                <button
                  id="btn-request-tour-primary"
                  onClick={onRequestTour}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Calendar className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span>Request a tour</span>
                </button>

                {/* 2. Message landlord (Secondary outline) */}
                <button
                  id="btn-message-landlord-secondary"
                  onClick={onMessageLandlord}
                  className="w-full py-2.5 px-4 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message landlord</span>
                </button>

                {/* 3. Apply now (Smaller / secondary action) */}
                <button
                  id="btn-apply-now-secondary"
                  onClick={onApplyNow}
                  className="w-full py-2 px-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200 font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Apply now with Rental Pass</span>
                </button>
              </div>

              {/* Quick confidence reassurance footer */}
              <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                <p className="text-[11px] text-gray-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                  <span>No hard credit pull without your review</span>
                </p>
                <div className="mt-2 text-[11px] text-gray-400 flex items-center justify-center gap-3">
                  <button
                    id="btn-report-listing"
                    onClick={() => onNotify('Listing verification report: Clean and active.')}
                    className="hover:text-gray-600 hover:underline"
                  >
                    Report listing
                  </button>
                  <span>•</span>
                  <button
                    id="btn-help-faq"
                    onClick={() => onNotify('Rental Pass FAQ: Learn how reusable profiles work.')}
                    className="hover:text-gray-600 hover:underline flex items-center gap-0.5"
                  >
                    <HelpCircle className="w-3 h-3" />
                    Help & FAQs
                  </button>
                </div>
              </div>
            </div>

            {/* Fast Stats card */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-xs text-gray-600 space-y-2">
              <div className="flex items-center justify-between">
                <span>Application activity</span>
                <span className="font-semibold text-gray-900">14 renters applied</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-2/3 rounded-full" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                <span>Application fee: $50</span>
                <span>Reusable for 30 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 z-20 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <button
            id="mobile-btn-request-tour"
            onClick={onRequestTour}
            className="flex-1 py-3 px-3 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Request a tour</span>
          </button>
          <button
            id="mobile-btn-message"
            onClick={onMessageLandlord}
            aria-label="Message landlord"
            className="p-3 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            id="mobile-btn-apply"
            onClick={onApplyNow}
            className="py-3 px-3 rounded-xl border border-gray-300 text-gray-800 text-xs font-semibold hover:bg-gray-50"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
