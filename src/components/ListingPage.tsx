import React, { useState, useEffect } from 'react';
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
  X,
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);
  const [selectedTourDate, setSelectedTourDate] = useState('SUN 13 Sep, 10:30 AM');
  const [isSaved, setIsSaved] = useState(false);
  const [activeMatchTier, setActiveMatchTier] = useState<'strong' | 'moderate' | 'neutral'>('strong');

  // Tour sessions state matching the reference layout
  const [selectedSessionDateIdx, setSelectedSessionDateIdx] = useState(0);
  const [selectedSessionTime, setSelectedSessionTime] = useState('10:30 AM');
  const [timeSlotPage, setTimeSlotPage] = useState(0);
  const [showAllDates, setShowAllDates] = useState(false);

  const openLightbox = (index: number) => {
    setLightboxIdx(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const handleNextLightbox = () => {
    setLightboxIdx((prev) => (prev === listing.photos.length - 1 ? 0 : prev + 1));
  };

  const handlePrevLightbox = () => {
    setLightboxIdx((prev) => (prev === 0 ? listing.photos.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') handleNextLightbox();
      if (e.key === 'ArrowLeft') handlePrevLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, listing.photos.length]);

  const tourSessionDates = [
    {
      day: 'SUN',
      date: '13 Sep',
      fullDate: '13 Sep 2026',
      slots: 12,
      times: [
        '10:30 AM', '10:45 AM', '11:00 AM',
        '11:15 AM', '11:30 AM', '11:45 AM',
        '1:00 PM', '1:15 PM', '1:30 PM',
        '2:00 PM', '2:30 PM', '3:00 PM',
      ],
    },
    {
      day: 'SAT',
      date: '19 Sep',
      fullDate: '19 Sep 2026',
      slots: 40,
      times: [
        '10:00 AM', '10:15 AM', '10:30 AM',
        '10:45 AM', '11:00 AM', '11:30 AM',
        '12:00 PM', '12:30 PM', '1:00 PM',
        '1:30 PM', '2:00 PM', '2:30 PM',
      ],
    },
    {
      day: 'SUN',
      date: '20 Sep',
      fullDate: '20 Sep 2026',
      slots: 54,
      times: [
        '10:30 AM', '10:45 AM', '11:00 AM',
        '11:15 AM', '11:30 AM', '11:45 AM',
        '1:00 PM', '1:30 PM', '2:00 PM',
        '2:30 PM', '3:00 PM', '3:30 PM',
      ],
    },
    {
      day: 'SAT',
      date: '26 Sep',
      fullDate: '26 Sep 2026',
      slots: 40,
      times: [
        '10:30 AM', '10:45 AM', '11:00 AM',
        '11:15 AM', '11:30 AM', '11:45 AM',
        '1:00 PM', '1:30 PM', '2:00 PM',
        '2:30 PM', '3:00 PM', '3:30 PM',
      ],
    },
    {
      day: 'SUN',
      date: '27 Sep',
      fullDate: '27 Sep 2026',
      slots: 36,
      times: [
        '10:00 AM', '10:30 AM', '11:00 AM',
        '11:30 AM', '12:00 PM', '1:00 PM',
        '1:30 PM', '2:00 PM', '2:30 PM',
        '3:00 PM', '3:30 PM', '4:00 PM',
      ],
    },
    {
      day: 'SAT',
      date: '3 Oct',
      fullDate: '3 Oct 2026',
      slots: 28,
      times: [
        '10:30 AM', '11:00 AM', '11:30 AM',
        '12:00 PM', '1:00 PM', '1:30 PM',
        '2:00 PM', '2:30 PM', '3:00 PM',
        '3:30 PM', '4:00 PM', '4:30 PM',
      ],
    },
  ];

  const currentSessionDate = tourSessionDates[selectedSessionDateIdx] || tourSessionDates[0];
  const SLOTS_PER_PAGE = 6;
  const totalTimePages = Math.ceil(currentSessionDate.times.length / SLOTS_PER_PAGE);
  const visibleTimeSlots = currentSessionDate.times.slice(
    timeSlotPage * SLOTS_PER_PAGE,
    (timeSlotPage + 1) * SLOTS_PER_PAGE
  );

  const handleSelectDate = (idx: number) => {
    setSelectedSessionDateIdx(idx);
    setTimeSlotPage(0);
    const newDate = tourSessionDates[idx];
    if (!newDate.times.includes(selectedSessionTime)) {
      setSelectedSessionTime(newDate.times[0] || '10:30 AM');
    }
    onNotify(`Selected date: ${newDate.day}, ${newDate.date}`);
  };

  const handlePrevTimePage = () => {
    if (timeSlotPage > 0) {
      setTimeSlotPage((prev) => prev - 1);
    }
  };

  const handleNextTimePage = () => {
    if (timeSlotPage < totalTimePages - 1) {
      setTimeSlotPage((prev) => prev + 1);
    }
  };

  const handleSelectTime = (time: string) => {
    setSelectedSessionTime(time);
    onNotify(`Selected time: ${time}`);
  };

  const handleBookSession = () => {
    const fullScheduleStr = `${currentSessionDate.day} ${currentSessionDate.date}, ${selectedSessionTime}`;
    setSelectedTourDate(fullScheduleStr);
    onRequestTour();
  };

  const handleToggleHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    onNotify(!isSaved ? 'Saved to your favorite homes' : 'Removed from saved homes');
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNotify(`Listing link copied to clipboard: zillow.com/homedetails/${listing.id}`);
  };

  return (
    <div className="pb-24 sm:pb-16 bg-[#FAFAFB] min-h-screen text-gray-900 font-sans">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        
        {/* ========================================================
            TOP TITLE & ACTIONS BAR (Matching Reference Image)
           ======================================================== */}
        <div className="mb-4">
          {/* Status Badges */}
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#DCFCE7] text-[#15803D] font-extrabold text-xs px-2.5 py-0.5 rounded-md tracking-wider uppercase">
              FOR RENT
            </span>
            <span className="text-gray-500 text-xs font-medium">
              Verified Zillow Rental
            </span>
          </div>

          {/* Title & Save/Share Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                {listing.address}, {listing.unit}
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm flex items-center gap-1.5 mt-1 font-medium">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <span>
                  {listing.neighborhood || 'Central Oakland'}, {listing.city}, {listing.state} {listing.zip}
                </span>
              </p>
            </div>

            {/* Save & Share Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
              <button
                id="btn-listing-save"
                onClick={handleToggleHeart}
                className={`flex items-center gap-2 border rounded-xl px-4 py-2 text-sm font-semibold transition-colors cursor-pointer shadow-2xs ${
                  isSaved
                    ? 'border-red-300 text-red-600 bg-red-50'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-600 text-red-600' : 'text-gray-600'}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                id="btn-listing-share"
                onClick={handleShareClick}
                className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-gray-600" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            PHOTO GALLERY: 3-Column Layout (Matching Reference Image)
            Left: Main large photo (50% width / 2 cols)
            Middle: 2 stacked photos (25% width / 1 col)
            Right: 2 stacked photos (25% width / 1 col with 'View all 18 photos')
           ======================================================== */}

        {/* --- MOBILE GALLERY (< 768px / md:hidden) --- */}
        <div className="md:hidden mb-6">
          <div
            onClick={() => openLightbox(0)}
            className="relative aspect-16/10 rounded-2xl overflow-hidden bg-gray-900 shadow-2xs cursor-pointer group"
          >
            <img
              src={listing.photos[0].url}
              alt={listing.photos[0].caption}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80';
              }}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Bottom Overlays */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="text-xs font-medium bg-black/75 text-white px-3 py-1.5 rounded-lg backdrop-blur-xs">
                Photo 1 of {listing.photos.length}
              </span>
              <span className="text-xs font-bold bg-black/75 text-white px-3.5 py-1.5 rounded-lg backdrop-blur-xs">
                View all {listing.photos.length} photos
              </span>
            </div>
          </div>
        </div>

        {/* --- DESKTOP GALLERY (md:grid) --- */}
        <div className="hidden md:grid grid-cols-4 gap-3 h-[460px] lg:h-[520px] xl:h-[580px] mb-8 w-full">
          {/* Column 1: Main Large Photo (col-span-2) */}
          <div
            id="gallery-main-photo"
            onClick={() => openLightbox(0)}
            className="col-span-2 relative h-full rounded-2xl overflow-hidden cursor-pointer group bg-gray-900 shadow-2xs"
          >
            <img
              src={listing.photos[0].url}
              alt={listing.photos[0].caption}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80';
              }}
              className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-300"
            />
            {/* Bottom-left Pill: Photo 1 of 18 */}
            <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-xs text-white text-xs font-medium px-3.5 py-1.5 rounded-lg shadow-sm pointer-events-none">
              Photo 1 of {listing.photos.length}
            </div>
          </div>

          {/* Column 2: 2 Stacked Photos (col-span-1) */}
          <div className="col-span-1 flex flex-col gap-3 h-full">
            <div
              id="gallery-photo-1"
              onClick={() => openLightbox(1)}
              className="flex-1 relative rounded-2xl overflow-hidden cursor-pointer group bg-gray-900 shadow-2xs"
            >
              <img
                src={listing.photos[1]?.url || listing.photos[0].url}
                alt={listing.photos[1]?.caption}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-300"
              />
            </div>
            <div
              id="gallery-photo-2"
              onClick={() => openLightbox(2)}
              className="flex-1 relative rounded-2xl overflow-hidden cursor-pointer group bg-gray-900 shadow-2xs"
            >
              <img
                src={listing.photos[2]?.url || listing.photos[0].url}
                alt={listing.photos[2]?.caption}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-300"
              />
            </div>
          </div>

          {/* Column 3: 2 Stacked Photos (col-span-1) */}
          <div className="col-span-1 flex flex-col gap-3 h-full">
            <div
              id="gallery-photo-3"
              onClick={() => openLightbox(3)}
              className="flex-1 relative rounded-2xl overflow-hidden cursor-pointer group bg-gray-900 shadow-2xs"
            >
              <img
                src={listing.photos[3]?.url || listing.photos[0].url}
                alt={listing.photos[3]?.caption}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-300"
              />
            </div>
            <div
              id="gallery-photo-4"
              onClick={() => openLightbox(4)}
              className="flex-1 relative rounded-2xl overflow-hidden cursor-pointer group bg-gray-900 shadow-2xs"
            >
              <img
                src={listing.photos[4]?.url || listing.photos[0].url}
                alt={listing.photos[4]?.caption}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-300"
              />
              {/* Dark overlay with centered "View all 18 photos" */}
              <div className="absolute inset-0 bg-black/55 group-hover:bg-black/65 transition-colors flex items-center justify-center p-4 text-center">
                <span className="text-white font-bold text-base lg:text-lg drop-shadow-md">
                  View all {listing.photos.length} photos
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- FULLSCREEN PHOTO LIGHTBOX MODAL --- */}
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 backdrop-blur-xs">
            {/* Header */}
            <div className="flex items-center justify-between text-white py-2 px-2 sm:px-6">
              <div>
                <div className="text-base font-bold">
                  {listing.address}, {listing.unit}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Photo {lightboxIdx + 1} of {listing.photos.length} · {listing.photos[lightboxIdx].caption}
                </div>
              </div>
              <button
                onClick={closeLightbox}
                className="p-2.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                aria-label="Close photo gallery"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Image Area with Previous / Next Arrows */}
            <div className="flex-1 relative flex items-center justify-center min-h-0 py-4">
              <button
                onClick={handlePrevLightbox}
                className="absolute left-2 sm:left-6 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer z-10 shadow-lg"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>

              <img
                src={listing.photos[lightboxIdx].url}
                alt={listing.photos[lightboxIdx].caption}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain rounded-xl select-none shadow-2xl"
              />

              <button
                onClick={handleNextLightbox}
                className="absolute right-2 sm:right-6 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer z-10 shadow-lg"
                aria-label="Next photo"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div className="h-16 flex items-center gap-2 overflow-x-auto py-1 px-4 max-w-5xl mx-auto scrollbar-thin">
              {listing.photos.map((photo, idx) => (
                <button
                  key={photo.url + idx}
                  onClick={() => setLightboxIdx(idx)}
                  className={`h-14 w-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    lightboxIdx === idx
                      ? 'border-[#006AFF] ring-2 ring-blue-400 scale-105 opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  title={photo.caption}
                >
                  <img src={photo.url} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
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

              {/* Address & Neighborhood */}
              <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                    {listing.address}, {listing.unit}
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      {listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.city}, {listing.state} {listing.zip}
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
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-sm relative">
              
              {/* Header section matching reference */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-gray-100">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1D4ED8]" />
                    <span>Powered by Rental Pass</span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium truncate max-w-[150px]">
                    {listing.managementCompany}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                  Available sessions
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 font-normal mt-1 leading-relaxed">
                  Book 1:1 sessions from the options based on your needs
                </p>
              </div>

              {/* Date Options Row with "View all" link */}
              <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 scrollbar-none mb-5">
                {(showAllDates ? tourSessionDates : tourSessionDates.slice(0, 4)).map((item, idx) => {
                  const isSelected = selectedSessionDateIdx === idx;
                  return (
                    <button
                      key={item.date}
                      type="button"
                      id={`btn-session-date-${item.day.toLowerCase()}-${item.date.replace(/\s+/g, '')}`}
                      onClick={() => handleSelectDate(idx)}
                      className={`flex flex-col items-center justify-center py-2.5 px-2.5 sm:px-3 rounded-xl min-w-[70px] sm:min-w-[74px] transition-all cursor-pointer ${
                        isSelected
                          ? 'border-2 border-gray-900 bg-white shadow-xs'
                          : 'border border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        {item.day}
                      </span>
                      <span className="text-sm sm:text-base font-black text-gray-900 mt-0.5 whitespace-nowrap">
                        {item.date}
                      </span>
                      <span className="text-[11px] font-bold text-[#16A34A] mt-1 whitespace-nowrap">
                        {item.slots} slots
                      </span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  id="btn-toggle-all-dates"
                  onClick={() => {
                    setShowAllDates(!showAllDates);
                    onNotify(!showAllDates ? 'Viewing all available session dates' : 'Showing standard session dates');
                  }}
                  className="text-[#087F7B] hover:text-[#066562] font-bold text-xs sm:text-sm flex items-center gap-0.5 shrink-0 ml-1 cursor-pointer select-none transition-colors"
                >
                  <span>{showAllDates ? 'Show less' : 'View all'}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAllDates ? 'rotate-90' : ''}`} />
                </button>
              </div>

              {/* Available Time Slots Header & Pagination */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-[#0F172A]">Available time slots</h3>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    id="btn-time-slots-prev"
                    onClick={handlePrevTimePage}
                    disabled={timeSlotPage === 0}
                    className="p-1 rounded text-gray-400 hover:text-gray-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous time slots"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    id="btn-time-slots-next"
                    onClick={handleNextTimePage}
                    disabled={timeSlotPage >= totalTimePages - 1}
                    className="p-1 rounded text-gray-400 hover:text-gray-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    aria-label="Next time slots"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Divider line */}
              <div className="border-t border-gray-100 mb-4" />

              {/* Time Slots Grid (3 columns x 2 rows) */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-5">
                {visibleTimeSlots.map((time) => {
                  const isSelected = selectedSessionTime === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      id={`btn-time-slot-${time.replace(/[:\s]/g, '')}`}
                      onClick={() => handleSelectTime(time)}
                      className={`py-3 px-1 sm:px-2 rounded-xl text-center text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                        isSelected
                          ? 'border-2 border-gray-900 bg-white text-gray-900 shadow-2xs'
                          : 'border border-gray-200 bg-white text-gray-900 hover:border-gray-400'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>

              {/* Primary Booking Button matching reference image */}
              <button
                type="button"
                id="btn-book-session"
                onClick={handleBookSession}
                className="w-full py-3.5 sm:py-4 px-4 rounded-xl bg-[#087F7B] hover:bg-[#066562] active:bg-[#05504E] text-white font-bold text-sm sm:text-base shadow-sm shadow-[#087F7B]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Session for {currentSessionDate.date} 2026</span>
              </button>

              {/* Secondary actions */}
              <div className="mt-4 pt-3.5 border-t border-gray-100 space-y-2">
                <button
                  id="btn-message-landlord-secondary"
                  onClick={onMessageLandlord}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-gray-500" />
                  <span>Message property manager</span>
                </button>

                <button
                  id="btn-apply-now-secondary"
                  onClick={onApplyNow}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#006AFF] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#006AFF]" />
                  <span>Apply with Rental Pass</span>
                </button>
              </div>

              {/* Trust badges footer */}
              <div className="mt-3.5 pt-3 border-t border-gray-100 text-center space-y-1">
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

