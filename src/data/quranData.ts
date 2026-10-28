import raw from '../../data/mainDataQuran.json';
import pagesRaw from '../../data/pagesQuran.json';
import { QuranSurah } from './quranTypes';
import { QuranPage } from './pageTypes';
export const quran = raw as QuranSurah[];
export const quranPages = pagesRaw as QuranPage[];
