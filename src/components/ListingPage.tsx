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
  AlertTriangle,
  AlertCircle,
  UserPlus,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import { ListingDetails } from '../types';
import { Button } from './ui/Button';

interface ListingPageProps {
  listing: ListingDetails;
  availableListings?: ListingDetails[];
  onSelectListing?: (listing: ListingDetails) => void;
  onRequestTour: () => void;
  onMessageLandlord: () => void;
  onApplyNow: () => void;
  onApplyWithCosigner?: () => void;
  onNotify: (msg: string) => void;
}

export const ListingPage: React.FC<ListingPageProps> = ({
  listing,
  availableListings,
  onSelectListing,
  onRequestTour,
  onMessageLandlord,
  onApplyNow,
  onApplyWithCosigner,
  onNotify,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);
  const [selectedTourDate, setSelectedTourDate] = useState('SUN 13 Sep, 10:30 AM');
  const [isSaved, setIsSaved] = useState(false);
  const [activeMatchTier, setActiveMatchTier] = useState<'strong' | 'moderate' | 'low' | 'neutral'>(
    listing.defaultMatchTier || 'strong'
  );
  const [simulateWithCosigner, setSimulateWithCosigner] = useState(false);

  // Sync active match tier whenever listing changes
  useEffect(() => {
    setActiveMatchTier(listing.defaultMatchTier || 'strong');
    setSimulateWithCosigner(false);
  }, [listing.id, listing.defaultMatchTier]);

  // Tour sessions state matching the reference layout
  const [selectedSessionDateIdx, setSelectedSessionDateIdx] = useState(0);
  const [selectedSessionTime, setSelectedSessionTime] = useState('10:30 AM');
  const [timeSlotPage, setTimeSlotPage] = useState(0);
  const [isAllDatesModalOpen, setIsAllDatesModalOpen] = useState(false);

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
            SAMPLE LISTING SWITCHER (Compare High Match vs Low Match)
           ======================================================== */}
        {availableListings && availableListings.length > 1 && onSelectListing && (
          <div className="mb-5 bg-white rounded-2xl p-3 sm:p-3.5 border border-gray-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs">
                <Building className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-700">Sample Listing Demonstration</span>
                  {listing.defaultMatchTier === 'low' && (
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md border border-rose-200">
                      Not Good Match · Cosigner Needed
                    </span>
                  )}
                  {listing.defaultMatchTier === 'strong' && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                      High Match
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Explore how different rent pricing and landlord criteria impact your qualification score:
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs shrink-0 flex-wrap">
              {availableListings.map((l) => {
                const isSelected = l.id === listing.id;
                const isLow = l.defaultMatchTier === 'low';
                return (
                  <button
                    key={l.id}
                    type="button"
                    id={`btn-select-sample-${l.id}`}
                    onClick={() => {
                      onSelectListing(l);
                      onNotify(`Switched sample listing to: ${l.title}`);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-white text-gray-900 shadow-2xs ring-1 ring-black/5'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isLow ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                    />
                    <span>
                      {l.title.split(' ')[0]} ({l.unit}) · ${l.rent.toLocaleString()}/mo
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        isLow
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {isLow ? 'Low Match' : 'High Match'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

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
              <Button
                id="btn-listing-save"
                variant="secondary"
                size="sm"
                onClick={handleToggleHeart}
                leftIcon={<Heart className={`w-4 h-4 ${isSaved ? 'fill-red-600 text-red-600' : 'text-gray-600'}`} />}
                className={isSaved ? 'border-red-200 text-red-600 bg-red-50 hover:bg-red-100' : ''}
              >
                {isSaved ? 'Saved' : 'Save'}
              </Button>

              <Button
                id="btn-listing-share"
                variant="secondary"
                size="sm"
                onClick={handleShareClick}
                leftIcon={<Share2 className="w-4 h-4 text-gray-600" />}
              >
                Share
              </Button>
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
        <div className="hidden md:grid grid-cols-4 gap-3 h-[460px] lg:h-[520px] xl:h-[580px] mb-8 w-full overflow-hidden rounded-2xl">
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
          <div className="col-span-1 flex flex-col gap-3 h-full min-h-0">
            <div
              id="gallery-photo-1"
              onClick={() => openLightbox(1)}
              className="flex-1 min-h-0 relative rounded-2xl overflow-hidden cursor-pointer group bg-gray-900 shadow-2xs"
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
              className="flex-1 min-h-0 relative rounded-2xl overflow-hidden cursor-pointer group bg-gray-900 shadow-2xs"
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
          <div className="col-span-1 flex flex-col gap-3 h-full min-h-0">
            <div
              id="gallery-photo-3"
              onClick={() => openLightbox(3)}
              className="flex-1 min-h-0 relative rounded-2xl overflow-hidden cursor-pointer group bg-gray-900 shadow-2xs"
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
              className="flex-1 min-h-0 relative rounded-2xl overflow-hidden cursor-pointer group bg-gray-900 shadow-2xs"
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
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-2 relative z-0">
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
                    <span className="ml-2 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
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
                - Rose/Alert: #FFF1F2 bg, #9F1239 text
                - Neutral Gray: #F1F5F9 bg, #64748B text
                Verbatim disclaimer:
                "An estimate based on this listing's published criteria — not a guarantee and not the landlord's decision."
               ======================================================== */}
            {(() => {
              const userIncome = 6200; // Jordan Reed's verified monthly income
              const incomeMultiplier = listing.minIncomeMultiplier || 3.0;
              const requiredIncome = Math.round(listing.rent * incomeMultiplier);
              const cosignerIncomeMultiplier = listing.cosignerIncomeMultiplier || 4.0;
              const cosignerRequiredIncome = Math.round(listing.rent * cosignerIncomeMultiplier);
              const effectiveTier = simulateWithCosigner ? 'strong' : activeMatchTier;

              return (
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-900">Application Match Estimate</h3>
                        <p className="text-[11px] text-gray-500">Compatibility against published leasing requirements</p>
                      </div>
                    </div>

                    {/* Interactive Scenario Switcher for the Demo */}
                    <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs flex-wrap">
                      <button
                        onClick={() => {
                          setActiveMatchTier('strong');
                          setSimulateWithCosigner(false);
                        }}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                          activeMatchTier === 'strong' && !simulateWithCosigner
                            ? 'bg-white text-gray-900 shadow-2xs'
                            : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        Strong (94%)
                      </button>
                      <button
                        onClick={() => {
                          setActiveMatchTier('moderate');
                          setSimulateWithCosigner(false);
                        }}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                          activeMatchTier === 'moderate' && !simulateWithCosigner
                            ? 'bg-white text-gray-900 shadow-2xs'
                            : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        Moderate (76%)
                      </button>
                      <button
                        onClick={() => {
                          setActiveMatchTier('low');
                          setSimulateWithCosigner(false);
                        }}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                          activeMatchTier === 'low' && !simulateWithCosigner
                            ? 'bg-white text-rose-700 font-bold shadow-2xs'
                            : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        Low · Needs Cosigner (41%)
                      </button>
                      <button
                        onClick={() => {
                          setActiveMatchTier('neutral');
                          setSimulateWithCosigner(false);
                        }}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                          activeMatchTier === 'neutral' && !simulateWithCosigner
                            ? 'bg-white text-gray-900 shadow-2xs'
                            : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        Neutral
                      </button>
                    </div>
                  </div>

                  {/* Match Score Display with SPECIFIC COLOR BANDS */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 transition-colors ${
                      effectiveTier === 'strong'
                        ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#15803D]'
                        : effectiveTier === 'moderate'
                        ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]'
                        : effectiveTier === 'low'
                        ? 'bg-[#FFF1F2] border-[#FECDD3] text-[#9F1239]'
                        : 'bg-[#F1F5F9] border-[#CBD5E1] text-[#64748B]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`min-w-[58px] h-11 px-3 rounded-xl flex items-center justify-center font-black text-sm tracking-normal shadow-2xs shrink-0 ${
                          effectiveTier === 'strong'
                            ? 'bg-emerald-600 text-white'
                            : effectiveTier === 'moderate'
                            ? 'bg-amber-600 text-white'
                            : effectiveTier === 'low'
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-600 text-white'
                        }`}
                      >
                        {simulateWithCosigner
                          ? '95%'
                          : effectiveTier === 'strong'
                          ? '94%'
                          : effectiveTier === 'moderate'
                          ? '76%'
                          : effectiveTier === 'low'
                          ? '41%'
                          : '—'}
                      </div>
                      <div>
                        <span className="font-bold text-sm block leading-snug flex items-center gap-2 flex-wrap">
                          {simulateWithCosigner
                            ? 'High Compatibility Match (Guarantor-Backed)'
                            : effectiveTier === 'strong'
                            ? 'High Compatibility Match'
                            : effectiveTier === 'moderate'
                            ? 'Moderate Compatibility Match'
                            : effectiveTier === 'low'
                            ? 'Low Compatibility Match · Cosigner Recommended'
                            : 'Standard Review Profile'}
                          {effectiveTier === 'low' && !simulateWithCosigner && (
                            <span className="text-[10px] uppercase font-black bg-rose-200 text-rose-900 px-2 py-0.5 rounded">
                              Action Suggested
                            </span>
                          )}
                        </span>
                        <span className="text-xs opacity-90 block mt-1 leading-relaxed">
                          {simulateWithCosigner
                            ? `Combined income ($20,700/mo) meets 5.4x rent · Cosigner meets the ${cosignerIncomeMultiplier}x rule ($${cosignerRequiredIncome.toLocaleString()}/mo) and elevates approval likelihood`
                            : effectiveTier === 'strong'
                            ? `Income meets 3x rent ratio ($${requiredIncome.toLocaleString()}/mo required) · Excellent credit bracket · Preferred lease start`
                            : effectiveTier === 'moderate'
                            ? 'Income meets 2.6x rent ratio · Cosigner recommended to reach top candidate tier'
                            : effectiveTier === 'low'
                            ? `Applicant income ($6,200/mo) is under the 3.0x threshold ($${requiredIncome.toLocaleString()}/mo required) · Adding a qualified cosigner satisfies the financial requirement`
                            : 'Complete your profile to preview your personalized qualification likelihood'}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right self-end sm:self-center">
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider block opacity-75">Criteria Score</span>
                      <span className="font-extrabold text-xs sm:text-sm mt-0.5 block">
                        {simulateWithCosigner
                          ? '3 of 3 Met (Guarantor)'
                          : effectiveTier === 'strong'
                          ? '3 of 3 Met'
                          : effectiveTier === 'moderate'
                          ? '2 of 3 Met'
                          : effectiveTier === 'low'
                          ? '1 of 3 Met'
                          : 'Pending input'}
                      </span>
                    </div>
                  </div>

                  {/* Requirement Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    {/* Item 1: Income Ratio */}
                    <div
                      className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                        effectiveTier === 'low' && !simulateWithCosigner
                          ? 'bg-rose-50/70 border-rose-200'
                          : 'bg-gray-50 border-gray-100'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          effectiveTier === 'low' && !simulateWithCosigner
                            ? 'bg-rose-200 text-rose-800'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {effectiveTier === 'low' && !simulateWithCosigner ? (
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 truncate">
                          Income 3x Rent (${requiredIncome.toLocaleString()}/mo)
                        </div>
                        <div
                          className={`text-[11px] mt-0.5 ${
                            effectiveTier === 'low' && !simulateWithCosigner
                              ? 'text-rose-700 font-semibold'
                              : 'text-gray-500'
                          }`}
                        >
                          {effectiveTier === 'low' && !simulateWithCosigner
                            ? `Current: $6,200/mo (-$${(requiredIncome - userIncome).toLocaleString()}/mo)`
                            : simulateWithCosigner
                            ? 'Combined: $20,700/mo (Met)'
                            : `$${requiredIncome.toLocaleString()}/mo minimum · Met`}
                        </div>
                      </div>
                    </div>

                    {/* Item 2: Credit Score */}
                    <div
                      className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                        effectiveTier === 'low' && !simulateWithCosigner
                          ? 'bg-amber-50/70 border-amber-200'
                          : 'bg-gray-50 border-gray-100'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          effectiveTier === 'low' && !simulateWithCosigner
                            ? 'bg-amber-200 text-amber-800'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {effectiveTier === 'low' && !simulateWithCosigner ? (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 truncate">
                          Credit {listing.minCreditScore || 700}+ Minimum
                        </div>
                        <div
                          className={`text-[11px] mt-0.5 ${
                            effectiveTier === 'low' && !simulateWithCosigner
                              ? 'text-amber-800 font-semibold'
                              : 'text-gray-500'
                          }`}
                        >
                          {effectiveTier === 'low' && !simulateWithCosigner
                            ? 'Reported: 680 · Cosigner overrides'
                            : simulateWithCosigner
                            ? 'Guarantor: 780 score'
                            : 'Soft check only · Met'}
                        </div>
                      </div>
                    </div>

                    {/* Item 3: Rental History */}
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 truncate">Clean History</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">0 evictions · Verified</div>
                      </div>
                    </div>
                  </div>

                  {/* DEDICATED COSIGNER RECOMMENDATION CARD (Prominently shows why cosigner is needed) */}
                  {(effectiveTier === 'low' || simulateWithCosigner) && (
                    <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-3.5">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                          <UserPlus className="w-5 h-5 text-amber-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                              Cosigner Recommended
                            </span>
                            <span className="text-xs font-bold text-amber-800">
                              Landlord Policy: Cosigners accepted with {cosignerIncomeMultiplier}x rent (${cosignerRequiredIncome.toLocaleString()}/mo)
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-amber-950 mt-1">
                            Why you might need a cosigner for this apartment
                          </h4>
                          <p className="text-xs sm:text-sm text-amber-900 mt-1 leading-relaxed">
                            {listing.managementCompany} requires all applicants for {listing.title} to have a minimum gross income of <strong>${requiredIncome.toLocaleString()}/mo</strong> ({incomeMultiplier}x rent). Since your verified profile income is currently <strong>$6,200/mo (1.6x rent)</strong>, submitting solo does not meet published qualification thresholds. Adding a cosigner or guarantor will satisfy the financial requirement in full.
                          </p>
                        </div>
                      </div>

                      {/* Side-by-Side Comparison Box */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 bg-white/95 rounded-xl border border-amber-200 shadow-2xs">
                          <div className="flex items-center justify-between text-xs mb-1.5 pb-1 border-b border-gray-100">
                            <span className="font-bold text-gray-800">Solo Application (Current)</span>
                            <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              41% Match
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div className="flex justify-between">
                              <span>Applicant Income:</span>
                              <span className="font-semibold text-gray-900">$6,200/mo</span>
                            </div>
                            <div className="flex justify-between text-rose-700">
                              <span>Income Ratio:</span>
                              <span className="font-bold">1.63x (Needs {incomeMultiplier}.0x)</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                              <span>Approval Status:</span>
                              <span className="font-semibold text-rose-600">Likely Requires Guarantor</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-white/95 rounded-xl border border-emerald-300 shadow-2xs">
                          <div className="flex items-center justify-between text-xs mb-1.5 pb-1 border-b border-gray-100">
                            <span className="font-bold text-gray-800">With Cosigner / Guarantor</span>
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              95% Match
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div className="flex justify-between">
                              <span>Combined Income:</span>
                              <span className="font-semibold text-emerald-800">$20,700/mo</span>
                            </div>
                            <div className="flex justify-between text-emerald-700">
                              <span>Income Ratio:</span>
                              <span className="font-bold">5.45x (Exceeds {cosignerIncomeMultiplier}.0x)</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                              <span>Approval Status:</span>
                              <span className="font-semibold text-emerald-700">High Priority Tier</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Simulator Bar */}
                      <div className="pt-2 border-t border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-xs text-amber-900">
                          {simulateWithCosigner ? (
                            <span className="flex items-center gap-1.5 font-bold text-emerald-800">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>Simulated Guarantor: Anil Sharma ($14,500/mo · 780 Credit) — Score elevated to 95%!</span>
                            </span>
                          ) : (
                            <span>See how attaching a guarantor changes your compatibility score in real time:</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            id="btn-toggle-cosigner-sim"
                            onClick={() => {
                              setSimulateWithCosigner(!simulateWithCosigner);
                              onNotify(
                                !simulateWithCosigner
                                  ? 'Guarantor simulated! Match score elevated from 41% to 95%.'
                                  : 'Cosigner simulation reset.'
                              );
                            }}
                            className="px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-950 font-bold text-xs rounded-xl border border-amber-300 shadow-2xs transition-colors cursor-pointer"
                          >
                            {simulateWithCosigner ? 'Reset simulation' : 'Preview match with cosigner'}
                          </button>

                          <Button
                            id="btn-apply-with-cosigner-estimate"
                            variant="primary"
                            size="sm"
                            leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                            onClick={() => {
                              if (onApplyWithCosigner) {
                                onApplyWithCosigner();
                              } else {
                                onApplyNow();
                              }
                            }}
                          >
                            Apply with cosigner
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MANDATORY VERBATIM DISCLAIMER */}
                  <div className="pt-2 border-t border-gray-100 flex items-start gap-1.5 text-[11px] text-gray-500">
                    <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <p className="italic">
                      An estimate based on this listing&apos;s published criteria — not a guarantee and not the landlord&apos;s decision.
                    </p>
                  </div>
                </div>
              );
            })()}

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
                <span>{showFullDesc ? 'Show less' : 'Read more'}</span>
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
              - lg:sticky lg:top-[112px] self-start
              - "Powered by Rental Pass" badge
              - Usable tour date selector chips
              - Primary "Request a tour", Secondary "Message landlord", Tertiary "Apply now"
             ======================================================== */}
          <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-[112px] z-10 self-start w-full">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-sm relative">
              
              {/* Header section matching reference */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-gray-100">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1D4ED8]" />
                    <span>Verified Rental</span>
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

              {/* Date Options Row with "View all" button (Fit without overflowing text) */}
              <div className="w-full flex items-center justify-between gap-1 sm:gap-2 mb-5">
                {tourSessionDates.slice(0, 4).map((item, idx) => {
                  const isSelected = selectedSessionDateIdx === idx;
                  // If 4th item (idx === 3), show only on screens large enough to fit it (xl:flex), otherwise hide so 3 cards have ample space and zero text overflow
                  const isFourth = idx === 3;
                  return (
                    <button
                      key={item.date}
                      type="button"
                      id={`btn-session-date-${item.day.toLowerCase()}-${item.date.replace(/\s+/g, '')}`}
                      onClick={() => handleSelectDate(idx)}
                      className={`flex-1 min-w-0 ${
                        isFourth ? 'hidden xl:flex' : 'flex'
                      } flex-col items-center justify-center py-2.5 sm:py-3 px-1.5 sm:px-2 rounded-xl transition-all cursor-pointer ${
                        isSelected
                          ? 'border-2 border-gray-900 bg-white shadow-2xs'
                          : 'border border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider leading-none">
                        {item.day}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-gray-900 mt-1 whitespace-nowrap leading-tight">
                        {item.date}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#16A34A] mt-1 whitespace-nowrap leading-none">
                        {item.slots} slots
                      </span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  id="btn-toggle-all-dates"
                  onClick={() => {
                    setIsAllDatesModalOpen(true);
                    onNotify('Opened all available session dates');
                  }}
                  className="shrink-0 flex items-center gap-0.5 text-[#087F7B] hover:text-[#066562] font-bold text-xs sm:text-xs md:text-sm pl-1 sm:pl-2 pr-0.5 py-2 cursor-pointer select-none transition-colors"
                >
                  <span className="whitespace-nowrap text-xs font-bold">View all</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
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

              {/* Cosigner Callout if Low Match */}
              {activeMatchTier === 'low' && !simulateWithCosigner && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-950">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Cosigner Recommended</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    Monthly rent (${listing.rent.toLocaleString()}) requires ${Math.round(listing.rent * (listing.minIncomeMultiplier || 3)).toLocaleString()}/mo income. Adding a cosigner or guarantor satisfies landlord criteria.
                  </p>
                </div>
              )}

              {/* Main Action Buttons in sticky rail:
                  1. Book a tour (stands out the most - primary lg)
                  2. Message (secondary md)
                  3. Apply now (least dominant - outline md)
              */}
              <div className="space-y-2.5">
                {/* 1. Book a tour - Primary dominant action */}
                <Button
                  id="btn-book-session"
                  variant="primary"
                  size="lg"
                  fullWidth
                  leftIcon={<Calendar className="w-4 h-4" />}
                  onClick={handleBookSession}
                >
                  Book a tour
                </Button>

                {/* 2. Message landlord - Secondary action */}
                <Button
                  id="btn-message-landlord-secondary"
                  variant="secondary"
                  size="md"
                  fullWidth
                  leftIcon={<MessageSquare className="w-4 h-4 text-gray-700" />}
                  onClick={onMessageLandlord}
                >
                  Message
                </Button>

                {/* 3. Apply now - Least dominant action */}
                <Button
                  id="btn-apply-now-primary"
                  variant="outline"
                  size="md"
                  fullWidth
                  className="border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 font-medium"
                  onClick={onApplyNow}
                >
                  Apply now
                </Button>
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
                    onClick={() => onNotify('Application FAQ: Learn how the application process works.')}
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
          <Button
            id="mobile-btn-request-tour"
            variant="primary"
            size="md"
            className="flex-1"
            leftIcon={<Calendar className="w-4 h-4" />}
            onClick={onRequestTour}
          >
            Book a tour
          </Button>
          <Button
            id="mobile-btn-message"
            variant="secondary"
            size="md"
            leftIcon={<MessageSquare className="w-4 h-4 text-gray-700" />}
            onClick={onMessageLandlord}
          >
            Message
          </Button>
          <Button
            id="mobile-btn-apply"
            variant="outline"
            size="md"
            onClick={onApplyNow}
            className="border-gray-200 text-gray-600 font-medium"
          >
            Apply
          </Button>
        </div>
      </div>
      {/* All Available Sessions Modal Dialog */}
      {isAllDatesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-[#0F172A]">All Available Sessions</h3>
                <p className="text-xs text-gray-500 mt-0.5">Select a date to preview open time slots</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAllDatesModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 py-5">
              {tourSessionDates.map((item, idx) => {
                const isSelected = selectedSessionDateIdx === idx;
                return (
                  <button
                    key={item.date}
                    type="button"
                    onClick={() => {
                      handleSelectDate(idx);
                      setIsAllDatesModalOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'border-2 border-gray-900 bg-white shadow-xs'
                        : 'border border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      {item.day}
                    </span>
                    <span className="text-base font-black text-gray-900 mt-0.5">
                      {item.date}
                    </span>
                    <span className="text-xs font-bold text-[#16A34A] mt-1">
                      {item.slots} slots
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAllDatesModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

