export interface MusicSubItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface MusicDirectoryItem {
  id: string;
  name: string;
  href: string;
  isExternal?: boolean;
  subItems: MusicSubItem[];
}

export const musicDirectory: MusicDirectoryItem[] = [
  {
    id: "hope-harmony",
    name: "Hope Harmony",
    href: "https://hopeharmony.net",
    isExternal: true,
    subItems: [
      { label: "hopeharmony.net", href: "https://hopeharmony.net", isExternal: true },
      { label: "Spotify", href: "https://open.spotify.com/artist/2iQK6elNRA4oChbZDM9ZMo?si=ha4-fnkARRqoS9N7KHDEPw", isExternal: true },
      { label: "Apple Music", href: "https://music.apple.com/us/artist/hope-harmony/1720316205", isExternal: true },
      { label: "YouTube", href: "https://www.youtube.com/@hopeharmony", isExternal: true },
    ]
  }
];
