import React, { useState } from 'react';
import {
  Home,
  Search,
  Heart,
  Share2,
  ChevronRight,
  Info,
  CheckCircle,
} from 'lucide-react';

interface ZillowNavbarProps {
  onNotify: (msg: string) => void;
}

export const ZillowNavbar: React.FC<ZillowNavbarProps> = ({ onNotify }) => {
  const [activeTab, setActiveTab] = useState('Rent');
  const [saved, setSaved] = useState(false);

  const handleNavClick = (name: string) => {
    setActiveTab(name);
    onNotify(`Navigated simulated category: ${name}`);
  };

  const handleSaveToggle = () => {
    setSaved(!saved);
    onNotify(!saved ? 'Saved listing to your mock Zillow favorites!' : 'Removed from saved favorites.');
  };

  const handleShare = () => {
    onNotify('Listing link copied to clipboard: zillow.com/homedetails/centre-4720-304');
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-30 shadow-xs">
      {/* Demo bar notice */}
      <div className="bg-blue-900 text-blue-100 text-xs py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold bg-blue-700 text-white px-1.5 py-0.5 rounded text-[11px] tracking-wide uppercase">
            Hackathon Demo
          </span>
          <span className="hidden sm:inline text-blue-200">
            Simulated Zillow listing entry — connected end-to-end into the Rental Pass application flow.
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-blue-300">
          <Info className="w-3.5 h-3.5" />
          <span>Step 1: Mock Zillow Listing</span>
        </div>
      </div>

      {/* Main Zillow Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left Nav items */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-blue-600 font-extrabold text-2xl tracking-tight cursor-pointer" onClick={() => onNotify('Zillow Home Page')}>
            <Home className="w-7 h-7 fill-blue-600 text-blue-600" />
            <span>Zillow</span>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-700">
            {['Buy', 'Rent', 'Sell', 'Home Loans', 'Agent finder'].map((tab) => (
              <button
                key={tab}
                id={`nav-tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleNavClick(tab)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 font-semibold bg-blue-50'
                    : 'hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Nav items */}
        <div className="flex items-center gap-3">
          <button
            id="btn-save-top"
            onClick={handleSaveToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${
              saved
                ? 'border-red-300 text-red-600 bg-red-50'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-red-600 text-red-600' : ''}`} />
            <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            id="btn-share-top"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            id="btn-sign-in-top"
            onClick={() => onNotify('Logged in as verified renter: Jordan Hayes (jordan.hayes@example.com)')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 px-2 py-1"
          >
            Sign in
          </button>
        </div>
      </div>

      {/* Breadcrumb row */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-2 text-xs text-gray-500 flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="hover:underline cursor-pointer" onClick={() => onNotify('Navigated: PA')}>PA</span>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="hover:underline cursor-pointer" onClick={() => onNotify('Navigated: Pittsburgh')}>Pittsburgh</span>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="hover:underline cursor-pointer" onClick={() => onNotify('Navigated: Bloomfield/Shadyside')}>Bloomfield / Shadyside</span>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-900 font-medium truncate max-w-[220px] sm:max-w-none">4720 Centre Ave Apt 304</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-700 font-medium">
          <CheckCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Verified Rental</span>
        </div>
      </div>
    </header>
  );
};
