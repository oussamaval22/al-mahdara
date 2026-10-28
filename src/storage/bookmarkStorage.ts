import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bookmark } from '../data/quranTypes';

const KEY = '@al_muhadhara_bookmarks';

export async function getBookmarks(): Promise<Bookmark[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw) as Bookmark[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function isBookmarked(surahNumber: number): Promise<boolean> {
  const list = await getBookmarks();
  return list.some((b) => b.surahNumber === surahNumber);
}

export async function toggleBookmark(surahNumber: number, surahName: string): Promise<boolean> {
  const list = await getBookmarks();
  const exists = list.some((b) => b.surahNumber === surahNumber);
  let next: Bookmark[];
  if (exists) {
    next = list.filter((b) => b.surahNumber !== surahNumber);
  } else {
    next = [{ surahNumber, surahName, savedAt: Date.now() }, ...list];
  }
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return !exists;
}

export async function removeBookmark(surahNumber: number): Promise<void> {
  const list = await getBookmarks();
  const next = list.filter((b) => b.surahNumber !== surahNumber);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}
