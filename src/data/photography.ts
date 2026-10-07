export interface PhotoItem {
  id: string;
  title: string;
  category: "Portraits & Seniors" | "Family & Heritage" | "Events & Community";
  description: string;
  location: string;
  date: string;
  exif: {
    camera: string;
    lens: string;
    shutter: string;
    aperture: string;
    iso: string;
  };
  aspectRatio: string;
}

export interface BookingPackage {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
  deliverables: string[];
  idealFor: string;
}

export const photoGallery: PhotoItem[] = [
  {
    id: "portrait-senior-golden",
    title: "Golden Hour Senior Session",
    category: "Portraits & Seniors",
    description: "Natural light senior portrait utilizing warm backlight through woodland canopy.",
    location: "Promenade Park, Fort Wayne, IN",
    date: "2024",
    exif: {
      camera: "Sony Alpha A7 IV",
      lens: "FE 85mm f/1.4 GM",
      shutter: "1/1250s",
      aperture: "f/1.8",
      iso: "100"
    },
    aspectRatio: "4/5"
  },
  {
    id: "portrait-family-autumn",
    title: "Heritage Family Gathering",
    category: "Family & Heritage",
    description: "Multi-generation family group portrait with crisp environmental depth.",
    location: "Foster Park, Fort Wayne, IN",
    date: "2024",
    exif: {
      camera: "Sony Alpha A7 IV",
      lens: "FE 35mm f/1.4 GM",
      shutter: "1/640s",
      aperture: "f/4.0",
      iso: "200"
    },
    aspectRatio: "3/2"
  },
  {
    id: "community-downtown-event",
    title: "Riverfront Evening Gathering",
    category: "Events & Community",
    description: "Documentary-style event coverage highlighting local connection and energy.",
    location: "Downtown Fort Wayne, IN",
    date: "2024",
    exif: {
      camera: "Sony Alpha A7 IV",
      lens: "FE 24-70mm f/2.8 GM II",
      shutter: "1/400s",
      aperture: "f/2.8",
      iso: "800"
    },
    aspectRatio: "3/2"
  }
];

export const bookingPackages: BookingPackage[] = [
  {
    id: "senior-portraits",
    name: "High School Seniors",
    price: "$350",
    category: "Graduates & Seniors",
    description: "Tailored outdoor sessions designed to capture authentic personality without rigid, staged poses.",
    deliverables: [
      "60 to 90-minute shoot at 1-2 Fort Wayne locations",
      "Multiple outfit changes",
      "35+ hand-retouched high-resolution images",
      "Online gallery with full-resolution downloads",
      "Full personal print release"
    ],
    idealFor: "Graduating seniors looking for natural portraits"
  },
  {
    id: "family-sessions",
    name: "Family & Milestones",
    price: "$300",
    category: "Family & Heritage",
    description: "Outdoor golden hour lifestyle photography highlighting connection, generations, and family milestones.",
    deliverables: [
      "60-minute outdoor session",
      "Full family and individual child portraits",
      "25+ finely retouched images",
      "Full personal print release"
    ],
    idealFor: "Families, couples, and generational portraits"
  }
];

export interface PhotographySubItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface PhotographyDirectoryItem {
  id: string;
  name: string;
  href: string;
  isExternal?: boolean;
  subItems: PhotographySubItem[];
}

export const photographyDirectory: PhotographyDirectoryItem[] = [
  {
    id: "portfolio",
    name: "My portfolio",
    href: "/photography/portfolio",
    subItems: [
      { label: "Overview", href: "/photography/portfolio" },
      { label: "High School Seniors", href: "/photography/portfolio#seniors" },
      { label: "Family & Portraits", href: "/photography/portfolio#portraits" },
      { label: "Pricing & Packages", href: "/photography/portfolio#investment" },
      { label: "Book a Session", href: "/photography/portfolio/contact" },
    ]
  },
  {
    id: "facebook",
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100086326337312",
    isExternal: true,
    subItems: [
      { label: "facebook.com", href: "https://www.facebook.com/profile.php?id=100086326337312", isExternal: true }
    ]
  }
];

