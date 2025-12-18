import property1 from '@/assets/property-1.jpg';
import property2 from '@/assets/property-2.jpg';
import property3 from '@/assets/property-3.jpg';
import property4 from '@/assets/property-4.jpg';
import property5 from '@/assets/property-5.jpg';
import property6 from '@/assets/property-6.jpg';
import property7 from '@/assets/property-7.jpg';
import property8 from '@/assets/property-8.jpg';
import property9 from '@/assets/property-9.jpg';
import property10 from '@/assets/property-10.jpg';
import property11 from '@/assets/property-11.jpg';
import property12 from '@/assets/property-12.jpg';
import property13 from '@/assets/property-13.jpg';
import property14 from '@/assets/property-14.jpg';
import property15 from '@/assets/property-15.jpg';
import property16 from '@/assets/property-16.jpg';
import property17 from '@/assets/property-17.jpg';
import property18 from '@/assets/property-18.jpg';
import property19 from '@/assets/property-19.jpg';
import property20 from '@/assets/property-20.jpg';

export interface Listing {
  id: string;
  title: string;
  city: string;
  price: number;
  per: 'month' | 'night';
  rating?: number;
  verifiedOwner?: boolean;
  promoted?: boolean;
  image: string;
  amenities?: string[];
  type?: string;
}

export const featuredListings: Listing[] = [
  {
    id: 'house_001',
    title: 'Sunny 2BHK near Central Park',
    city: 'Hyderabad',
    price: 25000,
    per: 'month',
    rating: 4.8,
    verifiedOwner: true,
    image: property1,
    amenities: ['WiFi', 'AC', 'Parking', 'Furnished'],
    type: '2BHK'
  },
  {
    id: 'house_002',
    title: 'Modern Penthouse with Skyline View',
    city: 'Mumbai',
    price: 45000,
    per: 'month',
    rating: 4.9,
    verifiedOwner: true,
    promoted: true,
    image: property2,
    amenities: ['WiFi', 'AC', 'Gym', 'Pool'],
    type: '3BHK'
  },
  {
    id: 'house_003',
    title: 'Cozy Studio with Home Office',
    city: 'Bangalore',
    price: 18000,
    per: 'month',
    rating: 4.6,
    verifiedOwner: true,
    image: property3,
    amenities: ['WiFi', 'AC', 'Furnished', 'Workspace'],
    type: '1BHK'
  },
  {
    id: 'house_004',
    title: 'Luxury Apartment in Tech Park',
    city: 'Pune',
    price: 32000,
    per: 'month',
    rating: 4.7,
    verifiedOwner: true,
    image: property4,
    amenities: ['WiFi', 'AC', 'Security', 'Parking'],
    type: '2BHK'
  },
  {
    id: 'house_005',
    title: 'Spacious Family Home',
    city: 'Delhi',
    price: 38000,
    per: 'month',
    rating: 4.8,
    verifiedOwner: false,
    image: property5,
    amenities: ['WiFi', 'AC', 'Garden', 'Parking'],
    type: '3BHK'
  },
  {
    id: 'house_006',
    title: 'Modern Studio Near Metro',
    city: 'Chennai',
    price: 15000,
    per: 'month',
    rating: 4.5,
    verifiedOwner: true,
    image: property6,
    amenities: ['WiFi', 'AC', 'Furnished'],
    type: 'Studio'
  },
  // Additional properties for Mumbai
  {
    id: 'house_007',
    title: 'Sea-Facing 3BHK in Bandra',
    city: 'Mumbai',
    price: 55000,
    per: 'month',
    rating: 4.9,
    verifiedOwner: true,
    promoted: true,
    image: property7,
    amenities: ['WiFi', 'AC', 'Security', 'Parking', 'Sea View'],
    type: '3BHK'
  },
  {
    id: 'house_008',
    title: 'Luxury 2BHK in Powai',
    city: 'Mumbai',
    price: 42000,
    per: 'month',
    rating: 4.7,
    verifiedOwner: true,
    image: property8,
    amenities: ['WiFi', 'AC', 'Gym', 'Pool', 'Parking'],
    type: '2BHK'
  },
  // Delhi properties
  {
    id: 'house_009',
    title: 'Premium Flat in South Delhi',
    city: 'Delhi',
    price: 48000,
    per: 'month',
    rating: 4.8,
    verifiedOwner: true,
    image: property9,
    amenities: ['WiFi', 'AC', 'Parking', 'Security', 'Garden'],
    type: '3BHK'
  },
  {
    id: 'house_010',
    title: 'Modern 1BHK Near Metro',
    city: 'Delhi',
    price: 22000,
    per: 'month',
    rating: 4.6,
    verifiedOwner: true,
    image: property10,
    amenities: ['WiFi', 'AC', 'Furnished'],
    type: '1BHK'
  },
  // Bangalore properties
  {
    id: 'house_011',
    title: 'Tech Park Apartment in Whitefield',
    city: 'Bangalore',
    price: 28000,
    per: 'month',
    rating: 4.7,
    verifiedOwner: true,
    image: property11,
    amenities: ['WiFi', 'AC', 'Gym', 'Parking'],
    type: '2BHK'
  },
  {
    id: 'house_012',
    title: 'Garden Villa in Koramangala',
    city: 'Bangalore',
    price: 65000,
    per: 'month',
    rating: 4.9,
    verifiedOwner: true,
    image: property12,
    amenities: ['WiFi', 'AC', 'Garden', 'Parking', 'Security'],
    type: '3BHK'
  },
  // Hyderabad properties
  {
    id: 'house_013',
    title: 'Spacious 2BHK in HITEC City',
    city: 'Hyderabad',
    price: 30000,
    per: 'month',
    rating: 4.8,
    verifiedOwner: true,
    image: property13,
    amenities: ['WiFi', 'AC', 'Parking', 'Gym'],
    type: '2BHK'
  },
  {
    id: 'house_014',
    title: 'Luxury Villa in Jubilee Hills',
    city: 'Hyderabad',
    price: 75000,
    per: 'month',
    rating: 4.9,
    verifiedOwner: true,
    image: property14,
    amenities: ['WiFi', 'AC', 'Pool', 'Garden', 'Parking', 'Security'],
    type: '3BHK'
  },
  // Chennai properties
  {
    id: 'house_015',
    title: 'Beach View Apartment in ECR',
    city: 'Chennai',
    price: 35000,
    per: 'month',
    rating: 4.8,
    verifiedOwner: true,
    image: property15,
    amenities: ['WiFi', 'AC', 'Sea View', 'Parking'],
    type: '2BHK'
  },
  {
    id: 'house_016',
    title: 'Premium 3BHK in Anna Nagar',
    city: 'Chennai',
    price: 40000,
    per: 'month',
    rating: 4.7,
    verifiedOwner: true,
    image: property16,
    amenities: ['WiFi', 'AC', 'Parking', 'Security', 'Gym'],
    type: '3BHK'
  },
  // Pune properties
  {
    id: 'house_017',
    title: 'Modern 2BHK in Hinjewadi',
    city: 'Pune',
    price: 26000,
    per: 'month',
    rating: 4.6,
    verifiedOwner: true,
    image: property17,
    amenities: ['WiFi', 'AC', 'Parking', 'Gym'],
    type: '2BHK'
  },
  {
    id: 'house_018',
    title: 'Penthouse in Koregaon Park',
    city: 'Pune',
    price: 52000,
    per: 'month',
    rating: 4.9,
    verifiedOwner: true,
    image: property18,
    amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Parking', 'Security'],
    type: '3BHK'
  },
  // Kolkata properties
  {
    id: 'house_019',
    title: 'Heritage Apartment in Salt Lake',
    city: 'Kolkata',
    price: 22000,
    per: 'month',
    rating: 4.5,
    verifiedOwner: true,
    image: property19,
    amenities: ['WiFi', 'AC', 'Parking'],
    type: '2BHK'
  },
  {
    id: 'house_020',
    title: 'Luxury Flat in Park Street',
    city: 'Kolkata',
    price: 38000,
    per: 'month',
    rating: 4.7,
    verifiedOwner: true,
    image: property20,
    amenities: ['WiFi', 'AC', 'Security', 'Parking', 'Gym'],
    type: '3BHK'
  }
];
