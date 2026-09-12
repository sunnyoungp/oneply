import { ProfileFormData } from './types';

export const mockJordanSavedProfile: ProfileFormData = {
  // 1. Personal & ID
  fullName: 'Jordan Reed',
  dob: '1996-04-12',
  govIdNumber: 'PA-DL-84920412',
  ssnLastFour: '7291',
  creditCheckAuthSigned: true,

  // 2. Employment & Income (Flagged for update)
  employer: 'Acme Health Tech (Need to update to current)',
  monthlyIncome: 6200,
  incomeDocAttached: true, // flagged to verify latest

  // 3. Household
  occupantsCount: 1,
  occupantsNames: 'Jordan Reed',
  hasPets: true,
  petDetails: '1 Cat (Tabby, 9 lbs, neutered)',
  desiredMoveIn: '2026-10-01',
  leaseTermMonths: 12,

  // 4. Rental History
  pastAddress: '5514 Ellsworth Ave, Apt 2B, Pittsburgh, PA 15232',
  pastLandlord: 'Highland Park Rentals (412-555-0199)',
  reasonForLeaving: 'Lease expiring, seeking updated kitchen and in-unit laundry',

  // 5. Background Disclosures
  priorEviction: 'no',
  bankruptcy: 'no',
  criminalHistory: 'no',

  // 6. Emergency Contact
  emergencyName: 'Marcus Reed',
  emergencyPhone: '(412) 555-8831',
  emergencyRelation: 'Brother',

  // 7. Cosigner
  cosigner: null,
};

export const mockBlankProfile: ProfileFormData = {
  fullName: '',
  dob: '',
  govIdNumber: '',
  ssnLastFour: '',
  creditCheckAuthSigned: false,
  employer: '',
  monthlyIncome: 0,
  incomeDocAttached: false,
  occupantsCount: 1,
  occupantsNames: '',
  hasPets: false,
  petDetails: '',
  desiredMoveIn: '',
  leaseTermMonths: 12,
  pastAddress: '',
  pastLandlord: '',
  reasonForLeaving: '',
  priorEviction: 'no',
  bankruptcy: 'no',
  criminalHistory: 'no',
  emergencyName: '',
  emergencyPhone: '',
  emergencyRelation: '',
  cosigner: null,
};

export const mockPriyaProfile: ProfileFormData = {
  fullName: 'Priya Sharma',
  dob: '1997-09-24',
  govIdNumber: 'PA-DL-99120482',
  ssnLastFour: '4192',
  creditCheckAuthSigned: true,
  employer: 'Carnegie Robotics LLC',
  monthlyIncome: 7400,
  incomeDocAttached: true,
  occupantsCount: 1,
  occupantsNames: 'Priya Sharma',
  hasPets: false,
  petDetails: 'None',
  desiredMoveIn: '2026-10-01',
  leaseTermMonths: 12,
  pastAddress: '234 S Highland Ave, Pittsburgh, PA',
  pastLandlord: 'East End Living',
  reasonForLeaving: 'Relocating closer to workplace',
  priorEviction: 'no',
  bankruptcy: 'no',
  criminalHistory: 'no',
  emergencyName: 'Anil Sharma',
  emergencyPhone: '(412) 555-0144',
  emergencyRelation: 'Parent',
  cosigner: {
    fullName: 'Anil Sharma',
    relationship: 'Father',
    email: 'anil.sharma@example.com',
    phone: '(412) 555-0144',
    employer: 'Sharma Consulting Inc',
    monthlyIncome: 14500,
    hasDocs: true,
    status: 'pending',
  },
};

export const mockSamProfile: ProfileFormData = {
  fullName: 'Sam Chen',
  dob: '1998-11-05',
  govIdNumber: 'PA-DL-38192031',
  ssnLastFour: '6018',
  creditCheckAuthSigned: false,
  employer: 'CMU Graduate Research Lab',
  monthlyIncome: 3800,
  incomeDocAttached: false,
  occupantsCount: 1,
  occupantsNames: 'Sam Chen',
  hasPets: false,
  petDetails: 'None',
  desiredMoveIn: '2026-10-01',
  leaseTermMonths: 12,
  pastAddress: 'Oakland Campus Housing, Pittsburgh, PA',
  pastLandlord: 'University Properties',
  reasonForLeaving: 'Graduated, moving to off-campus private lease',
  priorEviction: 'no',
  bankruptcy: 'no',
  criminalHistory: 'no',
  emergencyName: 'Mei Chen',
  emergencyPhone: '(412) 555-9382',
  emergencyRelation: 'Mother',
  cosigner: null,
};
