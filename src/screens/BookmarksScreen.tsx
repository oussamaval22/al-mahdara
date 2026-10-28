import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, shadow } from '../theme/colors';
import { Bookmark } from '../data/quranTypes';
import { quranPages } from '../data/quranData';
import { getBookmarks, removeBookmark } from '../storage/bookmarkStorage';
import { getPageBookmarks, removePageBookmark, PageBookmark } from '../storage/pageBookmarkStorage';

export default function BookmarksScreen({ navigation }: any) {
  const [surahs, setSurahs] = useState<Bookmark[]>([]);
  const [pages, setPages] = useState<PageBookmark[]>([]);

  const load = useCallback(async () => {
    const [savedSurahs, savedPages] = await Promise.all([getBookmarks(), getPageBookmarks()]);
    setSurahs(savedSurahs.sort((a, b) => b.savedAt - a.savedAt));
    setPages(savedPages.sort((a, b) => b.savedAt - a.savedAt));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRemoveSurah = (num: number, name: string) => {
    Alert.alert('حذف المحفوظة', `هل تريد حذف سورة "${name}" من المحفوظات؟`, [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: async () => { await removeBookmark(num); load(); } },
    ]);
  };

  const onRemovePage = (page: number) => {
    Alert.alert('حذف الصفحة', `حذف الصفحة ${page} من المحفوظات؟`, [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: async () => { await removePageBookmark(page); load(); } },
    ]);
  };

  // البحث عن رقم الصفحة الأولى الخاصة بالسورة اعتماداً على ملف JSON الصفحات (pagesQuran.json)
  const getSurahStartPage = (surahNumber: number): number => {
    const found = quranPages.find((p) => p.start && p.start.surah_number === surahNumber);
    return found ? found.page : 1;
  };

  const hasAny = pages.length > 0 || surahs.length > 0;

  if (!hasAny) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.empty}>
          <View style={s.emptyIcon}><Ionicons name="bookmark-outline" size={46} color={colors.muted} /></View>
          <Text style={s.emptyTitle}>لا توجد محفوظات</Text>
          <Text style={s.emptySub}>من صفحة المصحف اضغط على الشاشة ثم اختر «حفظ الصفحة».</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <FlatList
        data={pages}
        keyExtractor={(x) => `page-${x.page}`}
        contentContainerStyle={s.list}
        ListHeaderComponent={pages.length > 0 ? <Text style={s.sectionTitle}>الصفحات المحفوظة</Text> : null}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.card}
            onPress={() => navigation.navigate('Reader', { pageNumber: item.page })}
            activeOpacity={0.8}
          >
            <View style={s.iconWrap}><Ionicons name="bookmark" size={20} color={colors.goldDark} /></View>
            <View style={s.info}>
              <Text style={s.name}>صفحة {item.page}</Text>
              <Text style={s.meta}>فتح الصفحة في المصحف</Text>
            </View>
            <TouchableOpacity
              style={s.removeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => onRemovePage(item.page)}
            >
              <Ionicons name="trash-outline" size={19} color={colors.danger} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListFooterComponent={surahs.length > 0 ? (
          <View>
            <Text style={s.sectionTitle}>السور المحفوظة</Text>
            {surahs.map((item) => (
              <TouchableOpacity
                key={item.surahNumber}
                style={s.card}
                onPress={() => navigation.navigate('Reader', { pageNumber: getSurahStartPage(item.surahNumber) })}
                activeOpacity={0.8}
              >
                <View style={s.iconWrap}><Ionicons name="star" size={20} color={colors.gold} /></View>
                <View style={s.info}>
                  <Text style={s.name}>{item.surahName}</Text>
                  <Text style={s.meta}>سورة رقم {item.surahNumber}</Text>
                </View>
                <TouchableOpacity
                  style={s.removeBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPress={() => onRemoveSurah(item.surahNumber, item.surahName)}
                >
                  <Ionicons name="trash-outline" size={19} color={colors.danger} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  list: { padding: 12, paddingBottom: 28 },
  sectionTitle: { color: colors.ink, fontSize: 19, fontWeight: '900', textAlign: 'right', marginTop: 8, marginBottom: 10, marginHorizontal: 4 },
  card: { minHeight: 72, backgroundColor: colors.surface, borderRadius: 18, marginBottom: 9, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', ...shadow.soft },
  iconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FBF1DC', alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, alignItems: 'flex-end', marginHorizontal: 12 },
  name: { fontSize: 18, fontWeight: '800', color: colors.ink },
  meta: { fontSize: 12, color: colors.muted, marginTop: 3 },
  removeBtn: { padding: 6 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 36 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.ink, marginBottom: 8 },
  emptySub: { fontSize: 13, color: colors.muted, textAlign: 'center', lineHeight: 22 },
});