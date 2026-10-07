export interface SoftwareProject {
  id: string;
  name: string;
  tagline: string;
  category: "Desktop Application" | "Web Application" | "Developer Tool" | "Open Source";
  version?: string;
  status: "Released" | "Active Development" | "Maintained";
  featured: boolean;
  description: string;
  longDescription?: string;
  techStack: string[];
  features: string[];
  metrics?: { label: string; value: string }[];
  links: {
    download?: string;
    buy?: string;
    github?: string;
    demo?: string;
    docs?: string;
  };
}

export const softwareProjects: SoftwareProject[] = [
  {
    id: "astroplot-raw",
    name: "AstroPlot RAW",
    tagline: "Visual 2D Scatter-Plot Exposure Sorter & Culler",
    category: "Desktop Application",
    version: "v1.5.1",
    status: "Released",
    featured: true,
    description: "High-performance desktop utility engineered for the astrophotography community to organize, sort, and cull thousands of RAW exposures into Siril and DeepSkyStacker-ready calibration folders in seconds.",
    longDescription: `AstroPlot RAW solves one of the most tedious bottlenecks in astrophotography processing: sifting through hundreds of gigabytes of RAW frames (.CR2, .CR3, .NEF, .ARW, .FITS) to separate Light, Dark, Flat, and Bias frames.
    
By extracting EXIF metadata and plotting exposures on an interactive 2D graph (Mean Luminance vs. Capture Timestamp), distinct calibration clusters emerge immediately. Users can lasso-select or auto-classify batches and execute instantaneous move/copy routines with complete safety.`,
    techStack: ["Rust / C++ Core", "Electron / Node.js", "Canvas 2D Rendering", "LibRaw & CFITSIO", "SQLite Transaction Journal"],
    features: [
      "Interactive 2D Scatter-Plot: Real-time canvas rendering of thousands of exposures without UI lag",
      "Automatic Calibration Grouping: Direct mapping into /lights, /darks, /flats, and /biases",
      "100% Offline & Local-First: Runs on CPU with zero internet connection, zero tracking, and zero telemetry",
      "1-Click Non-Destructive Undo: Local filesystem rollback journal prevents accidental data loss",
      "Universal Camera RAW Support: Decodes Canon (.CR2, .CR3), Nikon (.NEF), Sony (.ARW), Fujifilm (.RAF), Olympus (.ORF), Adobe DNG, and astronomical FITS",
      "Stacking Pipeline Ready: Generates folders immediately compatible with Siril automated scripts, PixInsight, and DeepSkyStacker"
    ],
    metrics: [
      { label: "Processing Speed", value: "1,000+ RAWs / 10s" },
      { label: "Telemetry", value: "0 bytes transmitted" },
      { label: "Supported Formats", value: "9+ RAW & FITS" },
      { label: "Undo Protection", value: "1-Click Full Rollback" }
    ],
    links: {
      download: "https://github.com/ashtonsprunger/astroplot-releases/releases/download/v1.5.1/AstroPlot.RAW_1.5.1_x64-setup.exe",
      buy: "https://sprunger.lemonsqueezy.com/checkout/buy/f089d91b-6c23-4233-9bca-f18458a41368",
      docs: "https://ashtonsprunger.github.io/astroplot/"
    }
  },
  {
    id: "portfolio-master",
    name: "ashtonsprunger.com",
    tagline: "High-Craft Multidisciplinary Portfolio Platform",
    category: "Web Application",
    version: "v1.0.0",
    status: "Released",
    featured: false,
    description: "Modern, zero-JS-first master portfolio built with Astro, Tailwind CSS, and React islands. Engineered for 100/100 Core Web Vitals with automatic responsive image optimization and edge delivery.",
    techStack: ["Astro v5", "Tailwind CSS", "React 19", "TypeScript", "Sharp Image Pipeline"],
    features: [
      "Islands Architecture: Zero unnecessary client JavaScript sent to browser",
      "Darkroom Aesthetic: Custom Obsidian color tokens and hairline borders",
      "Edge Deployed: Global CDN distribution with instantaneous cache invalidation"
    ],
    links: {
      github: "https://github.com/ashtonsprunger"
    }
  }
];

export interface SoftwareSubItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface SoftwareDirectoryItem {
  id: string;
  name: string;
  href: string;
  isExternal?: boolean;
  subItems: SoftwareSubItem[];
}

export const softwareDirectory: SoftwareDirectoryItem[] = [
  {
    id: "astroplot",
    name: "AstroPlot RAW",
    href: "/software/astroplot",
    subItems: [
      { label: "Overview", href: "/software/astroplot" }
    ]
  },
  {
    id: "checkers",
    name: "Checkers AI (vs. Dave)",
    href: "/software/checkers",
    subItems: [
      { label: "Play", href: "/software/checkers" }
    ]
  },
  {
    id: "siteslips",
    name: "SiteSlips",
    href: "https://siteslips.com",
    isExternal: true,
    subItems: [
      { label: "siteslips.com", href: "https://siteslips.com", isExternal: true }
    ]
  },
  {
    id: "convertthings",
    name: "ConvertThings",
    href: "https://convertthings.com",
    isExternal: true,
    subItems: [
      { label: "convertthings.com", href: "https://convertthings.com", isExternal: true }
    ]
  },
  {
    id: "github",
    name: "GitHub",
    href: "https://github.com/ashtonsprunger",
    isExternal: true,
    subItems: [
      { label: "github.com/ashtonsprunger", href: "https://github.com/ashtonsprunger", isExternal: true }
    ]
  }
];

