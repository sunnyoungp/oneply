export type AppStep =
  | 'step-1-listing'
  | 'step-2-tour'
  | 'step-3-message'
  | 'step-5-decision'
  | 'step-6-group'
  | 'step-7-profile'
  | 'step-8-cosigner-draft'
  | 'step-8-cosigner-preview'
  | 'step-9-submit'
  | 'step-10-group-status'
  | 'step-11-confirmation'
  | 'step-12-history';

export interface ListingDetails {
  id: string;
  listingId?: string;
  title: string;
  address: string;
  unit: string;
  neighborhood?: string;
  city: string;
  state: string;
  zip: string;
  rent: number;
  deposit: number;
  beds: number;
  baths: number;
  sqft: number;
  availableDate: string;
  propertyType: string;
  managementCompany: string;
  contactPerson: string;
  description: string;
  features: {
    category: string;
    items: string[];
  }[];
  photos: {
    url: string;
    caption: string;
  }[];
}

export type ApplicationType = 'solo' | 'group';

export interface Roommate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'invited' | 'in_progress' | 'completed';
  profileCompletion: number;
  avatarColor: string;
  cosignerStatus?: 'none' | 'pending' | 'confirmed';
}

export type CosignerState = 'none' | 'pending' | 'confirmed';

export interface CosignerData {
  fullName: string;
  relationship: string;
  email: string;
  phone: string;
  employer: string;
  monthlyIncome: number;
  hasDocs: boolean;
  status: CosignerState;
  signedAt?: string;
}

export interface ProfileFormData {
  // 1. Personal & ID
  fullName: string;
  dob: string;
  govIdNumber: string;
  ssnLastFour: string;
  creditCheckAuthSigned: boolean;

  // 2. Employment & Income
  employer: string;
  monthlyIncome: number;
  incomeDocAttached: boolean;

  // 3. Household
  occupantsCount: number;
  occupantsNames: string;
  hasPets: boolean;
  petDetails: string;
  desiredMoveIn: string;
  leaseTermMonths: number;

  // 4. Rental History
  pastAddress: string;
  pastLandlord: string;
  reasonForLeaving: string;

  // 5. Background Disclosures
  priorEviction: 'yes' | 'no';
  bankruptcy: 'yes' | 'no';
  criminalHistory: 'yes' | 'no';

  // 6. Emergency Contact
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;

  // 7. Cosigner
  cosigner: CosignerData | null;
}

export interface HistoricalApplication {
  id: string;
  propertyAddress: string;
  unit: string;
  rent: number;
  managementCompany: string;
  submittedAt: string;
  status: 'Under Review' | 'Approved' | 'Lease Offered' | 'Completed';
  applicants: string[];
  cosignerName?: string;
  matchScore: string;
  imageUrl?: string;
}
