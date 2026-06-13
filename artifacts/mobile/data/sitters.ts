export interface Sitter {
  id: string;
  name: string;
  firstName: string;
  university: string;
  rating: number;
  reviewCount: number;
  ratePerHour: number;
  distance: number;
  bio: string;
  certifications: string[];
  backgroundCheck: "pending" | "verified" | "top_pro";
  isPlus: boolean;
  communityVouched: boolean;
  coordinate: { latitude: number; longitude: number };
  initials: string;
  avatarColor: string;
  yearsExp: number;
}

export interface Review {
  id: string;
  sitterId: string;
  parentName: string;
  rating: number;
  text: string;
  date: string;
}

export interface BookingRecord {
  id: string;
  sitterId: string;
  sitterName: string;
  sitterInitials: string;
  sitterAvatarColor: string;
  date: string;
  startTime: string;
  hours: number;
  rate: number;
  totalCost: number;
  status: "upcoming" | "active" | "completed" | "cancelled";
  children: string[];
}

export const SITTERS: Sitter[] = [
  {
    id: "s1",
    name: "Maya Chen",
    firstName: "Maya",
    university: "Harvard University",
    rating: 4.9,
    reviewCount: 87,
    ratePerHour: 22,
    distance: 0.8,
    bio: "Child development major with 4+ years of babysitting experience. I specialize in creative play, homework help, and building confidence in kids. Fully vaccinated, first-aid certified, and background checked.",
    certifications: ["First Aid & CPR", "Child Development", "Swimming Instructor"],
    backgroundCheck: "top_pro",
    isPlus: true,
    communityVouched: true,
    coordinate: { latitude: 43.658, longitude: -79.385 },
    initials: "MC",
    avatarColor: "#2563EB",
    yearsExp: 4,
  },
  {
    id: "s2",
    name: "Jordan Patel",
    firstName: "Jordan",
    university: "MIT",
    rating: 4.8,
    reviewCount: 62,
    ratePerHour: 24,
    distance: 1.2,
    bio: "Computer science student who loves teaching kids through play and coding. Patient, creative, and safety-focused. I hold an active first-aid certification and have a clean background check.",
    certifications: ["First Aid & CPR", "Coding for Kids"],
    backgroundCheck: "verified",
    isPlus: false,
    communityVouched: false,
    coordinate: { latitude: 43.651, longitude: -79.377 },
    initials: "JP",
    avatarColor: "#7C3AED",
    yearsExp: 3,
  },
  {
    id: "s3",
    name: "Sofia Nguyen",
    firstName: "Sofia",
    university: "University of Toronto",
    rating: 4.9,
    reviewCount: 114,
    ratePerHour: 20,
    distance: 1.7,
    bio: "Education student and former preschool teacher's aide. I bring structured activities, lots of patience, and genuine warmth to every session. Kids absolutely love our arts & crafts sessions!",
    certifications: ["First Aid & CPR", "Early Childhood Ed.", "Arts & Crafts"],
    backgroundCheck: "top_pro",
    isPlus: true,
    communityVouched: true,
    coordinate: { latitude: 43.662, longitude: -79.391 },
    initials: "SN",
    avatarColor: "#059669",
    yearsExp: 5,
  },
  {
    id: "s4",
    name: "Alex Rivera",
    firstName: "Alex",
    university: "McGill University",
    rating: 4.7,
    reviewCount: 45,
    ratePerHour: 21,
    distance: 2.1,
    bio: "Kinesiology student and youth soccer coach. I love keeping kids active through sports and outdoor play. Bilingual in English and Spanish. Background checked and certified.",
    certifications: ["First Aid & CPR", "Sports Coaching", "Bilingual EN/ES"],
    backgroundCheck: "verified",
    isPlus: false,
    communityVouched: true,
    coordinate: { latitude: 43.645, longitude: -79.388 },
    initials: "AR",
    avatarColor: "#DC2626",
    yearsExp: 2,
  },
  {
    id: "s5",
    name: "Priya Sharma",
    firstName: "Priya",
    university: "Queens University",
    rating: 4.8,
    reviewCount: 73,
    ratePerHour: 23,
    distance: 2.8,
    bio: "Nursing student with pediatric care experience. I handle medical situations calmly and always put child safety first. Experienced with special needs children and infants.",
    certifications: ["First Aid & CPR", "Pediatric Care", "Infant Specialist"],
    backgroundCheck: "top_pro",
    isPlus: true,
    communityVouched: false,
    coordinate: { latitude: 43.668, longitude: -79.38 },
    initials: "PS",
    avatarColor: "#D97706",
    yearsExp: 3,
  },
];

export const REVIEWS: Review[] = [
  {
    id: "r1",
    sitterId: "s1",
    parentName: "Sarah M.",
    rating: 5,
    text: "Maya is absolutely incredible with our kids. She kept them engaged the entire time and even tidied up before leaving. Highly recommend!",
    date: "Jun 8, 2026",
  },
  {
    id: "r2",
    sitterId: "s1",
    parentName: "David K.",
    rating: 5,
    text: "Arrived on time, communicated well, and my daughter was so happy. Will definitely book again.",
    date: "Jun 1, 2026",
  },
  {
    id: "r3",
    sitterId: "s1",
    parentName: "Jen L.",
    rating: 4,
    text: "Great with the little ones. Very responsible and caring.",
    date: "May 25, 2026",
  },
  {
    id: "r4",
    sitterId: "s2",
    parentName: "Amir T.",
    rating: 5,
    text: "Jordan was fantastic. My son actually asked when Jordan is coming back!",
    date: "Jun 5, 2026",
  },
  {
    id: "r5",
    sitterId: "s2",
    parentName: "Lisa P.",
    rating: 5,
    text: "Professional, punctual, and great energy. Our kids loved him.",
    date: "May 30, 2026",
  },
];

export const MOCK_BOOKINGS: BookingRecord[] = [
  {
    id: "b1",
    sitterId: "s1",
    sitterName: "Maya Chen",
    sitterInitials: "MC",
    sitterAvatarColor: "#2563EB",
    date: "Jun 15, 2026",
    startTime: "7:00 PM",
    hours: 3,
    rate: 22,
    totalCost: 82.1,
    status: "upcoming",
    children: ["Emma", "Liam"],
  },
  {
    id: "b2",
    sitterId: "s3",
    sitterName: "Sofia Nguyen",
    sitterInitials: "SN",
    sitterAvatarColor: "#059669",
    date: "Jun 8, 2026",
    startTime: "6:00 PM",
    hours: 4,
    rate: 20,
    totalCost: 104.8,
    status: "completed",
    children: ["Emma"],
  },
  {
    id: "b3",
    sitterId: "s2",
    sitterName: "Jordan Patel",
    sitterInitials: "JP",
    sitterAvatarColor: "#7C3AED",
    date: "May 30, 2026",
    startTime: "5:00 PM",
    hours: 2,
    rate: 24,
    totalCost: 57.6,
    status: "completed",
    children: ["Liam"],
  },
];

export const INCOMING_REQUESTS = [
  {
    id: "req1",
    parentName: "Sarah M.",
    parentInitials: "SM",
    date: "Today, Jun 13",
    startTime: "7:00 PM",
    hours: 3,
    children: ["Emma (6)", "Liam (3)"],
    notes: "Bedtime at 8:30 PM for Liam, Emma can stay up until 9.",
    totalEarning: 66,
  },
  {
    id: "req2",
    parentName: "David K.",
    parentInitials: "DK",
    date: "Jun 15, 2026",
    startTime: "2:00 PM",
    hours: 4,
    children: ["Mia (8)"],
    notes: "Homework help appreciated.",
    totalEarning: 88,
  },
];
