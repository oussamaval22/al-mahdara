export type QuranPage = {
  page: number;
  image: { url: string };
  start: { surah_number: number; verse: number; name: { ar: string } };
  end: { surah_number: number; verse: number; name: { ar: string } };
};
