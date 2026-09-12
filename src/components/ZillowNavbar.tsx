import React from 'react';
import {
  Menu,
  Building2,
  Users,
  ChevronRight,
} from 'lucide-react';

interface ZillowNavbarProps {
  onNotify: (msg: string) => void;
  onOpenGroupFlow?: () => void;
}

export const ZillowNavbar: React.FC<ZillowNavbarProps> = ({ onNotify, onOpenGroupFlow }) => {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-30">
      {/* Main Zillow Rentals Nav */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-[60px] flex items-center justify-between">
        {/* Left: Hamburger & Zillow Rentals Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNotify('Opened main menu')}
            className="p-1.5 -ml-1.5 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Main menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => onNotify('Zillow Rentals Home')}
          >
            <div className="w-8 h-8 rounded-xl bg-[#006AFF] text-white flex items-center justify-center font-bold text-xl">
              Z
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#006AFF] tracking-tight">zillow</span>
              <span className="text-sm font-semibold text-gray-600">Rentals</span>
            </div>
          </div>
        </div>

        {/* Right: Landlord Portal, Group Application, User Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Landlord Portal (Rental Manager) */}
          <button
            id="btn-landlord-portal"
            onClick={() => onNotify('Rental Manager simulated')}
            className="hidden md:flex items-center gap-2 border border-gray-300 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-gray-800 bg-white hover:bg-gray-50 transition-colors cursor-pointer shadow-2xs"
          >
            <Building2 className="w-4 h-4 text-gray-600" />
            <span>Rental Manager</span>
            <span className="bg-[#006AFF] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
              NEW
            </span>
          </button>

          {/* Group Application */}
          <button
            id="btn-nav-group-app"
            onClick={() => {
              if (onOpenGroupFlow) {
                onOpenGroupFlow();
              } else {
                onNotify('Group Application mode active');
              }
            }}
            className="flex items-center gap-2 border border-blue-200 bg-blue-50/70 text-[#006AFF] hover:bg-blue-100 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <Users className="w-4 h-4 text-[#006AFF]" />
            <span>Group Application</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          {/* User Avatar */}
          <div
            onClick={() => onNotify('User Profile: MP (Morgan Price)')}
            className="w-9 h-9 rounded-full bg-[#006AFF] text-white font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all select-none"
            title="Signed in as MP"
          >
            MP
          </div>
        </div>
      </div>

      {/* Breadcrumbs Sub-bar */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-2 text-xs text-gray-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="hover:underline cursor-pointer font-medium text-gray-700"
            onClick={() => onNotify('Navigated to PA')}
          >
            PA
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span
            className="hover:underline cursor-pointer font-medium text-gray-700"
            onClick={() => onNotify('Navigated to Pittsburgh')}
          >
            Pittsburgh
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span
            className="hover:underline cursor-pointer font-medium text-gray-700"
            onClick={() => onNotify('Navigated to Apartments For Rent')}
          >
            Apartments For Rent
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>Listing ID: #3928190 · Updated 3 hours ago</span>
          <span className="hidden sm:inline text-gray-300">•</span>
          <span className="flex items-center gap-1.5 font-medium text-[#006AFF]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
            <span>Participating Zillow Application Rental</span>
          </span>
        </div>
      </div>
    </header>
  );
};
