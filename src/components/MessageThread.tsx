import React, { useState } from 'react';
import {
  ArrowLeft,
  Building,
  CheckCheck,
  Send,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  MapPin,
  Clock,
  Info,
} from 'lucide-react';
import { ListingDetails } from '../types';
import { Button } from './ui/Button';

interface MessageThreadProps {
  listing: ListingDetails;
  onBackToListing: () => void;
  onApplyNow: () => void;
  onNotify: (msg: string) => void;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  listing,
  onBackToListing,
  onApplyNow,
  onNotify,
}) => {
  const [inputText, setInputText] = useState('');
  const [customMessages, setCustomMessages] = useState<{ sender: 'renter'; text: string; time: string }[]>([]);

  const handleSendQuickMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setCustomMessages((prev) => [
      ...prev,
      {
        sender: 'renter',
        text: inputText.trim(),
        time: 'Just now',
      },
    ]);
    onNotify('Simulated message sent to Sarah Jenkins (Property Manager)');
    setInputText('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Top Bar for Message Thread with navigation back to listing */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              id="btn-back-to-listing-from-messages"
              onClick={onBackToListing}
              className="p-2 -ml-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="h-5 w-px bg-gray-300 hidden sm:block" />

            {/* Landlord Identity */}
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#006AFF] text-white font-bold flex items-center justify-center text-sm ring-2 ring-[#BFDBFE]">
                  SJ
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-bold text-gray-900 text-sm">{listing.contactPerson}</h2>
                  <span className="text-[11px] bg-[#EFF6FF] text-[#1D4ED8] font-semibold px-1.5 py-0.2 rounded border border-[#BFDBFE]">
                    Host
                  </span>
                </div>
                <p className="text-xs text-gray-500">{listing.managementCompany} · Active now</p>
              </div>
            </div>
          </div>

          <button
            id="btn-view-listing-summary"
            onClick={onBackToListing}
            className="hidden sm:flex items-center gap-1 text-xs text-[#006AFF] hover:text-blue-700 font-medium hover:underline cursor-pointer"
          >
            <span>View listing</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mini Listing Context Banner */}
        <div className="bg-gray-50 border-t border-gray-200/80 px-4 py-2">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-3 truncate">
              <img
                src={listing.photos[0].url}
                alt="Listing preview"
                referrerPolicy="no-referrer"
                className="w-10 h-8 rounded object-cover border border-gray-300 shrink-0"
              />
              <div className="truncate">
                <span className="font-semibold text-gray-900 truncate">
                  {listing.address}, {listing.unit}
                </span>
                <span className="text-gray-500 ml-1.5">
                  ${listing.rent.toLocaleString()}/mo · {listing.beds} beds / {listing.baths} baths
                </span>
              </div>
            </div>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0 hidden md:inline">
              Available Now
            </span>
          </div>
        </div>
      </div>

      {/* Message Stream Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-5">
        {/* Date separator */}
        <div className="flex items-center justify-center">
          <span className="text-[11px] text-gray-400 bg-gray-200/70 px-3 py-1 rounded-full font-medium">
            Wednesday, Sep 10
          </span>
        </div>

        {/* Message 1: Renter inquiry */}
        <div className="flex flex-col items-end">
          <div className="max-w-md bg-[#006AFF] text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-xs text-sm">
            <p>Hi Sarah! Is 4720 Centre Ave Apt 304 still available for move-in next month?</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1 mr-1">
            <span>2:15 PM</span>
            <CheckCheck className="w-3.5 h-3.5 text-[#006AFF]" />
          </div>
        </div>

        {/* Message 2: Landlord reply */}
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#006AFF] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
            SJ
          </div>
          <div>
            <div className="max-w-md bg-white text-gray-900 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs border border-gray-200/80 text-sm">
              <p>
                Yes! We have in-person showings tomorrow afternoon if you&apos;d like to tour the space and see the rooftop deck.
              </p>
            </div>
            <span className="text-[11px] text-gray-400 mt-1 ml-1 block">2:24 PM</span>
          </div>
        </div>

        {/* Date separator */}
        <div className="flex items-center justify-center pt-2">
          <span className="text-[11px] text-gray-400 bg-gray-200/70 px-3 py-1 rounded-full font-medium">
            Yesterday · After Tour
          </span>
        </div>

        {/* Message 3: Renter tour follow-up */}
        <div className="flex flex-col items-end">
          <div className="max-w-md bg-[#006AFF] text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-xs text-sm">
            <p>Just finished the tour with you, loved the natural lighting and the quiet street! Definitely interested.</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1 mr-1">
            <span>4:45 PM</span>
            <CheckCheck className="w-3.5 h-3.5 text-[#006AFF]" />
          </div>
        </div>

        {/* Message 4: Landlord final invite WITH EMBEDDED APPLY BUTTON (Step 3 Requirement) */}
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#006AFF] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
            SJ
          </div>
          <div className="max-w-lg w-full">
            <div className="bg-white text-gray-900 rounded-2xl rounded-tl-xs p-4 shadow-xs border border-gray-200 text-sm space-y-3">
              <p className="leading-relaxed">
                Great meeting you Jordan! Feel free to apply whenever you&apos;re ready. You can submit your application directly below:
              </p>

              {/* Embedded Apply Card directly under the message */}
              <div
                id="embedded-apply-card"
                className="bg-[#EFF6FF] border-2 border-[#BFDBFE] rounded-xl p-4 shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Direct Rental Application
                  </span>
                  <span className="text-xs font-semibold text-gray-600">
                    ${listing.rent.toLocaleString()}/mo
                  </span>
                </div>

                <div className="text-xs text-gray-700 font-medium mb-3">
                  {listing.address}, {listing.unit} · {listing.managementCompany}
                </div>

                {/* THE CORE EMBEDDED BUTTON: Clean standard primary action button */}
                <Button
                  id="btn-apply-from-message-thread"
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={onApplyNow}
                >
                  Apply now
                </Button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 mt-2.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Reusable profile · Instant landlord notification</span>
                </div>
              </div>
            </div>
            <span className="text-[11px] text-gray-400 mt-1 ml-1 block">5:02 PM</span>
          </div>
        </div>

        {/* Any live simulated messages added by user */}
        {customMessages.map((msg, index) => (
          <div key={index} className="flex flex-col items-end">
            <div className="max-w-md bg-[#006AFF] text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-xs text-sm">
              <p>{msg.text}</p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1 mr-1">
              <span>{msg.time}</span>
              <CheckCheck className="w-3.5 h-3.5 text-[#006AFF]" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Message Input Bar (Zero dead ends, fully responsive) */}
      <div className="bg-white border-t border-gray-200 p-3 sm:p-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendQuickMessage} className="flex items-center gap-2">
            <input
              id="input-chat-message"
              type="text"
              placeholder="Type a message to Sarah Jenkins..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-gray-100 border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <Button
              id="btn-send-chat-message"
              type="submit"
              size="icon"
              variant="primary"
              disabled={!inputText.trim()}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2 px-1">
            <span>Simulated conversation with Landlord</span>
            <button
              id="btn-quick-apply-link"
              onClick={onApplyNow}
              className="text-[#006AFF] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Apply now ➔</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
