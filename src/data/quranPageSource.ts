import type { ImageSourcePropType } from 'react-native';
import { quranImages } from './quranImages';

// The project prefers local assets. When a local page is missing, use the
// public Quran page CDN as a fallback. This keeps the reader usable with the
// current project archive, which may not contain all 604 PNG files.
export function getQuranPageSource(page: number): ImageSourcePropType {
  return quranImages[page] ?? {
    uri: `https://cdn.myquran.com/img/page/${page}.png`,
  };
}
