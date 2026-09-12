import { ListingDetails } from './types';

export const mockListing: ListingDetails = {
  id: 'centre-4720-304',
  title: 'Centre Modern Lofts',
  address: '4720 Centre Ave',
  unit: 'Apt 304',
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
    'Sleek, sun-drenched corner 2-bedroom, 2-bathroom loft in the heart of Bloomfield/Shadyside corridor. Features dramatic 10ft exposed concrete ceilings, oversized floor-to-ceiling casement windows, chef-inspired kitchen with quartz countertops and stainless steel appliances, plus in-unit washer/dryer. Building amenities include a fitness studio, secure package locker system, and panoramic rooftop deck with grill stations. Cats and dogs warmly welcomed with no breed restrictions under 60 lbs.',
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
      url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80',
      caption: 'Sun-drenched living room with floor-to-ceiling windows',
    },
    {
      url: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1000&q=80',
      caption: 'Chef kitchen with quartz island and stainless appliances',
    },
    {
      url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1000&q=80',
      caption: 'Primary bedroom suite with custom closet',
    },
    {
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
      caption: 'Designer bathroom with walk-in glass shower',
    },
    {
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      caption: 'Building exterior on Centre Ave',
    },
  ],
};
