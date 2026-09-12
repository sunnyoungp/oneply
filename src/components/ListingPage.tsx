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
  Heart,
  Share2,
  ArrowLeft,
  Info,
  Check,
  Images,
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
  const [isSaved, setIsSaved] = useState(false);
  const [activeMatchTier, setActiveMatchTier] = useState<'strong' | 'moderate' | 'neutral'>('strong');

  const tourDateOptions = [
    { label: 'Tomorrow', time: '2:30 PM' },
    { label: 'Saturday', time: '11:00 AM' },
    { label: 'Saturday', time: '3:00 PM' },
    { label: 'Sunday', time: '1:00 PM' },
  ];

  const handleNextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActivePhotoIdx((prev) => (prev === listing.photos.length - 1 ? 0 : prev + 1));
  };

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActivePhotoIdx((prev) => (prev === 0 ? listing.photos.length - 1 : prev - 1));
  };

  const handleToggleHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    onNotify(!isSaved ? 'Saved to your favorite homes' : 'Removed from saved homes');
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNotify('Listing link copied to clipboard: zillow.com/homedetails/centre-4720-304');
  };

  return (
    <div className="pb-24 sm:pb-16 bg-[#FAFAFB] min-h-screen text-gray-900 font-sans">
      <div className="w-full max-w-[1600px] mx-auto px-0 sm:px-4 lg:px-6 pt-0 sm:pt-4">
        
        {/* ========================================================
            PHOTO GALLERY: Responsive Split
            Mobile: <768px Full-bleed 16:10 hero with tap-to-cycle & overlays
            Desktop: ≥768px Large Image Left + Vertical Gallery Preview Right
           ======================================================== */}

        {/* --- MOBILE GALLERY (< 768px / md:hidden) --- */}
        <div className="md:hidden relative aspect-16/10 bg-gray-900 w-full overflow-hidden select-none cursor-pointer" onClick={() => handleNextPhoto()}>
          <img
            key={activePhotoIdx}
            src={listing.photos[activePhotoIdx].url}
            alt={listing.photos[activePhotoIdx].caption}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80';
            }}
            className="w-full h-full object-cover transition-opacity duration-200"
          />

          {/* Top Overlays: Back, Heart, Share */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNotify('Navigated back');
              }}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center drop-shadow-md"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleHeart}
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center drop-shadow-md"
                aria-label="Save"
              >
                <Heart className={`w-5 h-5 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </button>
              <button
                onClick={handleShareClick}
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center drop-shadow-md"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Bottom Overlays: Verified Tag & Spec 1/12 Count Badge */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="text-[11px] font-semibold bg-black/60 text-white px-2.5 py-1 rounded-full backdrop-blur-xs">
              Verified Rental
            </span>
            {/* Mobile spec: 1 / 12 count badge bottom-right, 12px white text, black 60% overlay, 999px radius, 8px padding */}
            <span className="text-[12px] font-medium text-white bg-black/60 backdrop-blur-xs rounded-full px-3 py-1 shadow-sm">
              {activePhotoIdx + 1} / {listing.photos.length}
            </span>
          </div>
        </div>

        {/* --- DESKTOP GALLERY (md:flex) --- */}
        <div className="hidden md:flex gap-3 mb-6 h-[460px] lg:h-[520px] xl:h-[580px] w-full items-stretch">
          {/* Large Main Image on Left (fills horizontal space) */}
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-gray-950 shadow-md group h-full">
            <img
              key={activePhotoIdx}
              src={listing.photos[activePhotoIdx].url}
              alt={listing.photos[activePhotoIdx].caption}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80';
              }}
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.008]"
            />

            {/* Badges Top Left & Save/Share Top Right */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto">
                <span className="bg-[#006AFF] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  Verified Listing
                </span>
                <span className="bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-300" />
                  Updated 4 hours ago
                </span>
              </div>

              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  id="btn-desktop-save"
                  onClick={handleToggleHeart}
                  className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white transition-all shadow-md cursor-pointer"
                  title={isSaved ? 'Saved' : 'Save listing'}
                >
                  <Heart className={`w-4 h-4 transition-colors ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                </button>
                <button
                  id="btn-desktop-share"
                  onClick={handleShareClick}
                  className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white transition-all shadow-md cursor-pointer"
                  title="Share listing"
                >
                  <Share2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Bottom Bar: Caption & 1/12 Count Badge */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <span className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-xs max-w-[70%] truncate shadow-sm">
                {listing.photos[activePhotoIdx].caption}
              </span>
              <span className="text-[12px] font-medium text-white bg-black/60 backdrop-blur-xs rounded-full px-3 py-1 shadow-sm">
                {activePhotoIdx + 1} / {listing.photos.length}
              </span>
            </div>

            {/* Hover ‹ › Arrows */}
            <button
              id="btn-desktop-prev-photo"
              onClick={handlePrevPhoto}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-900 flex items-center justify-center shadow-lg transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              id="btn-desktop-next-photo"
              onClick={handleNextPhoto}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-900 flex items-center justify-center shadow-lg transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Gallery Preview Vertically on Right */}
          <div className="w-64 lg:w-72 xl:w-80 shrink-0 h-full bg-white rounded-2xl border border-gray-200 shadow-xs p-3 flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <Images className="w-4 h-4 text-[#006AFF]" />
                <span className="text-xs font-bold text-gray-900">Gallery Preview</span>
              </div>
              <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {activePhotoIdx + 1} of {listing.photos.length}
              </span>
            </div>

            {/* Vertical Scrollable Preview Grid */}
            <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin">
              <div className="grid grid-cols-2 gap-2">
                {listing.photos.map((photo, idx) => {
                  const isActive = activePhotoIdx === idx;
                  return (
                    <button
                      key={photo.url + idx}
                      id={`btn-thumb-vertical-${idx}`}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`group relative rounded-xl overflow-hidden aspect-16/10 cursor-pointer transition-all ${
                        isActive
                          ? 'border-2 border-[#006AFF] ring-2 ring-blue-100 shadow-sm opacity-100'
                          : 'border border-gray-200 opacity-75 hover:opacity-100 hover:border-gray-400'
                      }`}
                      title={photo.caption}
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=300&q=80';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <span
                        className={`absolute bottom-1 right-1 text-[10px] font-bold px-1.5 py-0.2 rounded backdrop-blur-xs ${
                          isActive ? 'bg-[#006AFF] text-white' : 'bg-black/60 text-white'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom active caption info */}
            <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span className="truncate max-w-[190px] font-medium text-gray-700">
                {listing.photos[activePhotoIdx].caption}
              </span>
              <span className="text-[#006AFF] font-bold shrink-0">
                {activePhotoIdx + 1}/{listing.photos.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ========================================================
            MAIN CONTENT LAYOUT:
            Left (lg:col-span-2): Property Info, Description, MATCH ESTIMATE CARD, Features
            Right (lg:col-span-1): STICKY Container with Tour/Apply & Powered by Rental Pass
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left 2 Columns */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header info card */}
            <div className="bg-white rounded-2xl p-5 sm:p-7 border border-gray-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                      ${listing.rent.toLocaleString()}
                    </span>
                    <span className="text-gray-500 font-medium text-lg">/mo</span>
                    <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      $2.05 / sq ft
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Deposit: ${listing.deposit.toLocaleString()} · Lease: 12 months · Available: {listing.availableDate}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-gray-900">{listing.beds}</span>
                    <span className="text-xs text-gray-500">beds</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-gray-900">{listing.baths}</span>
                    <span className="text-xs text-gray-500">baths</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-gray-900">{listing.sqft.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">sqft</span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                    {listing.address}, {listing.unit}
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      {listing.city}, {listing.state} {listing.zip} · Bloomfield / Shadyside Corridor
                    </span>
                  </p>
                </div>
                <button
                  id="btn-view-map"
                  onClick={() => onNotify('Simulating neighborhood map for Pittsburgh, PA')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View neighborhood map</span>
                </button>
              </div>

              {/* Micro-Data Chips Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-5 border-t border-gray-100">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-[11px] text-gray-500 font-medium">Availability</div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">{listing.availableDate}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-[11px] text-gray-500 font-medium">Property Type</div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">{listing.propertyType}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-[11px] text-gray-500 font-medium">Pet Policy</div>
                  <div className="text-xs sm:text-sm font-bold text-emerald-700 mt-0.5">Cats & Dogs OK</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-[11px] text-gray-500 font-medium">Laundry</div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">In-unit W/D</div>
                </div>
              </div>
            </div>

            {/* ========================================================
                MATCH ESTIMATE CARD (Spec Requirement)
                Specific color bands:
                - Green: #DCFCE7 bg, #15803D text
                - Amber: #FEF3C7 bg, #B45309 text
                - Neutral Gray: #F1F5F9 bg, #64748B text
                Verbatim disclaimer:
                "An estimate based on this listing's published criteria — not a guarantee and not the landlord's decision."
               ======================================================== */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Rental Pass Match Estimate</h3>
                    <p className="text-[11px] text-gray-500">Compatibility against published leasing requirements</p>
                  </div>
                </div>

                {/* Interactive Scenario Switcher for the Demo */}
                <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-[11px]">
                  <button
                    onClick={() => setActiveMatchTier('strong')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                      activeMatchTier === 'strong' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Strong (94%)
                  </button>
                  <button
                    onClick={() => setActiveMatchTier('moderate')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                      activeMatchTier === 'moderate' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Moderate (76%)
                  </button>
                  <button
                    onClick={() => setActiveMatchTier('neutral')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                      activeMatchTier === 'neutral' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Neutral
                  </button>
                </div>
              </div>

              {/* Match Score Display with SPECIFIC COLOR BANDS */}
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  activeMatchTier === 'strong'
                    ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#15803D]'
                    : activeMatchTier === 'moderate'
                    ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]'
                    : 'bg-[#F1F5F9] border-[#CBD5E1] text-[#64748B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                      activeMatchTier === 'strong'
                        ? 'bg-emerald-600 text-white'
                        : activeMatchTier === 'moderate'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-600 text-white'
                    }`}
                  >
                    {activeMatchTier === 'strong' ? '94%' : activeMatchTier === 'moderate' ? '76%' : '—'}
                  </div>
                  <div>
                    <span className="font-bold text-sm block">
                      {activeMatchTier === 'strong'
                        ? 'High Compatibility Match'
                        : activeMatchTier === 'moderate'
                        ? 'Moderate Compatibility Match'
                        : 'Standard Review Profile'}
                    </span>
                    <span className="text-xs opacity-90 block mt-0.5">
                      {activeMatchTier === 'strong'
                        ? 'Income meets 3x rent ratio ($6,450/mo required) · Excellent credit bracket · Preferred lease start'
                        : activeMatchTier === 'moderate'
                        ? 'Income meets 2.6x rent ratio · Cosigner recommended to reach top candidate tier'
                        : 'Complete your profile to preview your personalized qualification likelihood'}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[11px] font-semibold uppercase tracking-wider block opacity-75">Criteria Score</span>
                  <span className="font-extrabold text-xs">
                    {activeMatchTier === 'strong' ? '3 of 3 Met' : activeMatchTier === 'moderate' ? '2 of 3 Met' : 'Pending input'}
                  </span>
                </div>
              </div>

              {/* Requirement Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Income 3x Rent</div>
                    <div className="text-[11px] text-gray-500">$6,450/mo minimum</div>
                  </div>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Credit 650+</div>
                    <div className="text-[11px] text-gray-500">Soft check only</div>
                  </div>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Clean History</div>
                    <div className="text-[11px] text-gray-500">No recent evictions</div>
                  </div>
                </div>
              </div>

              {/* MANDATORY VERBATIM DISCLAIMER */}
              <div className="pt-2 border-t border-gray-100 flex items-start gap-1.5 text-[11px] text-gray-500">
                <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                <p className="italic">
                  An estimate based on this listing&apos;s published criteria — not a guarantee and not the landlord&apos;s decision.
                </p>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-2xl p-5 sm:p-7 border border-gray-200 shadow-xs">
              <h2 className="text-lg font-black text-gray-900 mb-3">About this rental</h2>
              <p
                className={`text-gray-700 leading-relaxed text-xs sm:text-sm ${
                  !showFullDesc ? 'line-clamp-3' : ''
                }`}
              >
                {listing.description}
              </p>
              <button
                id="btn-toggle-description"
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="mt-3 text-xs sm:text-sm font-semibold text-[#006AFF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{showFullDesc ? 'Show less' : 'Read full description'}</span>
                {showFullDesc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Features & Amenities Tabs */}
            <div className="bg-white rounded-2xl p-5 sm:p-7 border border-gray-200 shadow-xs">
              <h2 className="text-lg font-black text-gray-900 mb-4">Amenities & Highlights</h2>
              
              <div className="flex border-b border-gray-200 mb-4 gap-2 overflow-x-auto">
                {listing.features.map((cat, idx) => (
                  <button
                    key={cat.category}
                    id={`btn-feature-tab-${idx}`}
                    onClick={() => setActiveFeatureTab(idx)}
                    className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                      activeFeatureTab === idx
                        ? 'border-[#006AFF] text-[#006AFF]'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {listing.features[activeFeatureTab].items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-800">
                    <CheckCircle2 className="w-4 h-4 text-[#006AFF] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Neighborhood Transit Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Getting Around Bloomfield & Shadyside</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Walk Score: 94 (Walker&apos;s Paradise) · Transit Score: 78 · Bike Score: 85
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <span className="px-2.5 py-1 bg-gray-100 rounded-md border border-gray-200">61C, 71B buses</span>
                <span className="px-2.5 py-1 bg-gray-100 rounded-md border border-gray-200">CMU / Pitt shuttles</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: FIXED STICKY CONTAINER WITH ACTION RAIL
              - lg:sticky lg:top-6 self-start
              - "Powered by Rental Pass" badge
              - Usable tour date selector chips
              - Primary "Request a tour", Secondary "Message landlord", Tertiary "Apply now"
             ======================================================== */}
          <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-6 self-start w-full">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-blue-100 shadow-xl relative">
              
              {/* "Powered by Rental Pass" Top Badge */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1D4ED8]" />
                  <span>Powered by Rental Pass</span>
                </div>
                <span className="text-[11px] text-gray-500 font-medium">Verified Property</span>
              </div>

              {/* Landlord Info */}
              <div className="mb-4">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  Offered by
                </div>
                <div className="text-base font-black text-gray-900">
                  {listing.managementCompany}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Direct landlord response · Avg. reply &lt; 1 hr</span>
                </div>
              </div>

              {/* Usable Tour Date Selector Chips */}
              <div className="mb-5 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between text-xs font-bold text-gray-800 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#006AFF]" />
                    <span>Select In-Person Tour Time:</span>
                  </span>
                  <span className="text-[11px] font-semibold text-blue-600">Free</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {tourDateOptions.map((opt) => {
                    const fullDateStr = `${opt.label}, ${opt.time}`;
                    const isSelected = selectedTourDate === fullDateStr;
                    return (
                      <button
                        key={fullDateStr}
                        type="button"
                        id={`btn-tour-slot-${opt.label.toLowerCase()}-${opt.time.replace(/[:\s]/g, '')}`}
                        onClick={() => {
                          setSelectedTourDate(fullDateStr);
                          onNotify(`Selected tour date: ${fullDateStr}`);
                        }}
                        className={`p-2 rounded-lg text-left transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#EFF6FF] border-[#1D4ED8] text-[#1D4ED8] shadow-2xs'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-[11px] font-bold">{opt.label}</div>
                        <div className="text-[11px] opacity-80">{opt.time}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-2.5">
                {/* 1. Request a tour (PRIMARY) */}
                <button
                  id="btn-request-tour-primary"
                  onClick={onRequestTour}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#006AFF] hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Calendar className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>Request a tour ({selectedTourDate.split(',')[0]})</span>
                </button>

                {/* 2. Message landlord (Secondary outline) */}
                <button
                  id="btn-message-landlord-secondary"
                  onClick={onMessageLandlord}
                  className="w-full py-2.5 px-4 rounded-xl border-2 border-[#006AFF] text-[#006AFF] hover:bg-blue-50 active:bg-blue-100 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message property manager</span>
                </button>

                {/* 3. Direct Apply now with Rental Pass */}
                <button
                  id="btn-apply-now-secondary"
                  onClick={onApplyNow}
                  className="w-full py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Apply with Rental Pass</span>
                </button>
              </div>

              {/* Trust badges footer */}
              <div className="mt-4 pt-3.5 border-t border-gray-100 text-center space-y-1.5">
                <p className="text-[11px] text-gray-500 flex items-center justify-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Soft credit inquiry only · Reusable for 30 days</span>
                </p>
                <div className="text-[11px] text-gray-400 flex items-center justify-center gap-3">
                  <button
                    id="btn-report-listing"
                    onClick={() => onNotify('Listing verification report: Clean and active.')}
                    className="hover:text-gray-600 hover:underline cursor-pointer"
                  >
                    Report listing
                  </button>
                  <span>•</span>
                  <button
                    id="btn-help-faq"
                    onClick={() => onNotify('Rental Pass FAQ: Learn how reusable profiles work.')}
                    className="hover:text-gray-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3" />
                    Help & FAQs
                  </button>
                </div>
              </div>
            </div>

            {/* Fast Stats Card */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-xs text-gray-600 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Application activity</span>
                <span className="font-bold text-gray-900">14 renters applied</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#006AFF] h-full w-2/3 rounded-full" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
                <span>Application fee: $50</span>
                <span className="font-semibold text-emerald-700">Valid on any participating home</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar (< lg) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 z-20 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <button
            id="mobile-btn-request-tour"
            onClick={onRequestTour}
            className="flex-1 py-3 px-3 rounded-xl bg-[#006AFF] active:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Request a tour</span>
          </button>
          <button
            id="mobile-btn-message"
            onClick={onMessageLandlord}
            aria-label="Message landlord"
            className="p-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </button>
          <button
            id="mobile-btn-apply"
            onClick={onApplyNow}
            className="py-3 px-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-bold hover:bg-blue-100"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

