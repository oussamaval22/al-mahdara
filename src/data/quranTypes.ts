export type Verse = {
  number: number;
  text: { ar: string; [key: string]: unknown };
  juz?: number;
  page?: number;
  sajda?: boolean;
};

export type AudioItem = {
  id: number;
  reciter: { ar: string; [key: string]: unknown };
  rewaya: { ar: string; [key: string]: unknown };
  link: string;
  server?: string;
};

export type QuranSurah = {
  number: number;
  name: { ar: string; [key: string]: unknown };
  revelation_place: { ar: string; [key: string]: unknown };
  verses_count: number;
  words_count?: number;
  letters_count?: number;
  verses: Verse[];
  audio: AudioItem[];
};

export type Bookmark = { surahNumber: number; surahName: string; savedAt: number };
