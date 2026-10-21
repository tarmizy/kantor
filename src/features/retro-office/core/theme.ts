// Warm office palette for the retro 3D office. Components read these tokens
// instead of hardcoding hex values so the look can be retuned in one place.
// Tuned for a bright, warm Jakarta startup office: light oak floors, cream
// walls, and red-and-white accents used sparingly.

export type OfficeTheme = {
  floorWood: string;
  floorWoodDark: string;
  wallBase: string;
  wallAccent: string;
  trim: string;
  woodWarm: string;
  rattan: string;
  plantGreen: string;
  accentRed: string;
  accentWhite: string;
  textDark: string;
  textLight: string;
};

export const OFFICE_THEME: OfficeTheme = {
  floorWood: "#e8d5b8",
  floorWoodDark: "#b8946a",
  wallBase: "#e9dfd0",
  wallAccent: "#d9c9a8",
  trim: "#2b2f33",
  woodWarm: "#8b5e3c",
  rattan: "#c8a86b",
  plantGreen: "#5f8f38",
  accentRed: "#CE1126",
  accentWhite: "#FFFFFF",
  textDark: "#2b2118",
  textLight: "#fbf7f0",
};
