import AsyncStorage from '@react-native-async-storage/async-storage';

export type PageBookmark = {
  page: number;
  savedAt: number;
};

const KEY = '@al_muhadhara_page_bookmarks';

export async function getPageBookmarks(): Promise<PageBookmark[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw) as PageBookmark[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function isPageBookmarked(page: number): Promise<boolean> {
  const list = await getPageBookmarks();
  return list.some((item) => item.page === page);
}

export async function togglePageBookmark(page: number): Promise<boolean> {
  const list = await getPageBookmarks();
  const exists = list.some((item) => item.page === page);
  const next = exists
    ? list.filter((item) => item.page !== page)
    : [{ page, savedAt: Date.now() }, ...list];
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return !exists;
}

export async function removePageBookmark(page: number): Promise<void> {
  const list = await getPageBookmarks();
  await AsyncStorage.setItem(KEY, JSON.stringify(list.filter((item) => item.page !== page)));
}
