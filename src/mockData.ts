import { ListingDetails } from './types';

export const mockListing: ListingDetails = {
  id: 'meyran-342-2',
  listingId: '#3928190',
  title: 'Meyran Modern Flats',
  address: '342 Meyran Ave',
  unit: 'Apt 2',
  neighborhood: 'Central Oakland',
  city: 'Pittsburgh',
  state: 'PA',
  zip: '15213',
  rent: 2150,
  deposit: 2150,
  beds: 2,
  baths: 2,
  sqft: 1050,
  availableDate: 'Available Now',
  propertyType: 'Apartment',
  managementCompany: 'Lobos Management',
  contactPerson: 'Sarah Jenkins (Property Mgr)',
  description:
    'Sleek, sun-drenched corner 2-bedroom, 2-bathroom residence on Meyran Avenue in the heart of Central Oakland. Features high ceilings, oversized casement windows, chef-inspired kitchen with quartz countertops and stainless steel appliances, plus in-unit washer/dryer. Walking distance to University of Pittsburgh, CMU, and UPMC hospitals. Building amenities include a fitness center, secure package room, and panoramic rooftop deck.',
  features: [
    {
      category: 'Unit Features',
      items: [
        'In-unit washer & dryer',
        'Quartz countertops & tile backsplash',
        'Stainless steel appliances & dishwasher',
        'Central AC & smart thermostat',
        'Hardwood floors throughout',
        'Walk-in closet in primary bedroom',
      ],
    },
    {
      category: 'Building Amenities',
      items: [
        'Rooftop lounge with skyline views',
        'State-of-the-art fitness center',
        'Keyless fob access & ButterflyMX intercom',
        'Secured Amazon Hub package room',
        'Covered parking garage available ($150/mo)',
        'Pet spa & wash station',
      ],
    },
    {
      category: 'Lease & Fees',
      items: [
        '12-month lease preferred',
        '$50 application fee per adult',
        'Security deposit: 1 month rent ($2,150)',
        'Resident pays electric & water sub-metered',
        'Trash and high-speed fiber internet included',
      ],
    },
  ],
  photos: [
    {
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80',
      caption: 'Bright open living room with dining area and natural sunlight',
    },
    {
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
      caption: 'Comfortable living space with plants and botanical greenery',
    },
    {
      url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
      caption: 'Lounge area with architectural floor-to-ceiling windows',
    },
    {
      url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Modern kitchen with custom cabinetry, island, and stainless appliances',
    },
    {
      url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      caption: 'Sunlit living room with natural hardwood floors',
    },
    {
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
      caption: 'Primary bedroom suite with custom storage',
    },
    {
      url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
      caption: 'Second bedroom or dedicated work-from-home office',
    },
    {
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
      caption: 'Designer en-suite bathroom with glass rain shower',
    },
    {
      url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
      caption: 'Guest full bathroom with subway tile finishes',
    },
    {
      url: 'https://images.unsplash.com/photo-1551298370-9d3d53740c72?auto=format&fit=crop&w=1000&q=80',
      caption: 'Spacious primary walk-in closet with custom shelving',
    },
    {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      caption: 'Private balcony overlooking Oakland neighborhood',
    },
    {
      url: 'https://images.unsplash.com/photo-1626885930974-4b69aa21bbf9?auto=format&fit=crop&w=1000&q=80',
      caption: 'In-unit stackable washer and dryer closet',
    },
    {
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      caption: 'Building exterior facade on Meyran Avenue',
    },
    {
      url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80',
      caption: 'Secured resident lobby & intercom entry system',
    },
    {
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
      caption: '24/7 fully equipped resident fitness center',
    },
    {
      url: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1000&q=80',
      caption: 'Panoramic rooftop skydeck with outdoor lounge seating',
    },
    {
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
      caption: 'Resident co-working hub with high-speed WiFi',
    },
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      caption: 'Architectural floor plan overview — 2 Bed, 2 Bath',
    },
  ],
  minIncomeMultiplier: 3.0,
  minCreditScore: 650,
  cosignerPolicy: 'accepted',
  defaultMatchTier: 'strong',
  cosignerIncomeMultiplier: 4.0,
};

export const mockLowMatchListing: ListingDetails = {
  id: 'walnut-highline-ph4b',
  listingId: '#8492014',
  title: 'The Highline Penthouse & Residences',
  address: '5820 Walnut St',
  unit: 'Apt PH-4B',
  neighborhood: 'Shadyside',
  city: 'Pittsburgh',
  state: 'PA',
  zip: '15232',
  rent: 3800,
  deposit: 3800,
  beds: 3,
  baths: 2.5,
  sqft: 1850,
  availableDate: 'Immediate Occupancy',
  propertyType: 'Luxury Penthouse',
  managementCompany: 'Walnut Capital Premier Living',
  contactPerson: 'Jonathan Vance (Senior Leasing Director)',
  description:
    'Ultra-luxury corner penthouse overlooking the historic Shadyside Walnut Street corridor. Highlights include direct private elevator key access, 11-foot floor-to-ceiling curtain wall glazing, custom Scavolini Italian cabinetry, waterfall marble kitchen island with Sub-Zero and Wolf commercial appliances, private wraparound 450 sqft terrace, and spa bathrooms with heated Carrera marble floors. Full white-glove concierge, valet parking, private wine cellar, and wellness spa on premise. Strict leasing requirements: 3.0x verifiable income ratio ($11,400/mo minimum) and 700+ credit tier, or verified guarantor/cosigner guarantee with 4x rent ratio.',
  features: [
    {
      category: 'Unit Features',
      items: [
        'Direct keyed elevator into private residence foyer',
        'Wraparound 450 sqft private cedar terrace',
        'Sub-Zero refrigerator & Wolf 6-burner gas range',
        'Heated Carrera marble bathroom floors & soaking tub',
        'Motorized Lutron solar shades throughout',
        'Custom California Closets dressing rooms',
      ],
    },
    {
      category: 'Building Amenities',
      items: [
        '24/7 White-glove concierge & door attendant',
        'Heated valet garage parking with EV rapid chargers',
        'Resident temperature-controlled sommelier wine cellar',
        'Heated rooftop hydrotherapy pool & Finnish sauna',
        'Private resident boardroom & dining banquet hall',
        'Private pet salon & grooming suite',
      ],
    },
    {
      category: 'Lease & Strict Criteria',
      items: [
        '12 to 24-month lease required',
        'Security deposit: 1 month ($3,800)',
        'Mandatory 3.0x monthly rent income ratio ($11,400/mo)',
        'Minimum credit score: 700+ (or qualified guarantor)',
        'Cosigners/guarantors accepted: requires 4.0x rent ($15,200/mo)',
        'Comprehensive background and residency check',
      ],
    },
  ],
  photos: [
    {
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
      caption: 'Penthouse great room with floor-to-ceiling panoramic glass walls',
    },
    {
      url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80',
      caption: 'Gourmet chef kitchen with waterfall marble island and Wolf appliances',
    },
    {
      url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Custom Scavolini Italian cabinetry and integrated wine cooler',
    },
    {
      url: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1000&q=80',
      caption: 'Wraparound outdoor terrace overlooking Walnut Street tree canopy',
    },
    {
      url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80',
      caption: 'Primary suite with private balcony access and city views',
    },
    {
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
      caption: 'En-suite primary bathroom with freestanding tub and heated stone floors',
    },
    {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      caption: 'Second bedroom configured as executive corner home office',
    },
    {
      url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80',
      caption: 'Full-service lobby with 24/7 concierge and secure parcel vault',
    },
  ],
  minIncomeMultiplier: 3.0,
  minCreditScore: 700,
  cosignerPolicy: 'required_if_under_income',
  defaultMatchTier: 'low',
  cosignerIncomeMultiplier: 4.0,
};

export const sampleListings: ListingDetails[] = [
  mockListing,
  mockLowMatchListing,
];

