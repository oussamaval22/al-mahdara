
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { quran } from '../data/quranData';
import { colors, shadow } from '../theme/colors';
import {
  getBookmarks,
  toggleBookmark,
} from '../storage/bookmarkStorage';

export default function IndexScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<Set<number>>(new Set());

  const refresh = useCallback(async () => {
    try {
      const bookmarks = await getBookmarks();

      setSaved(
        new Set(
          bookmarks.map((x) => x.surahNumber)
        )
      );
    } catch (error) {
      console.warn('Error loading bookmarks:', error);
      setSaved(new Set());
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const searchText = query.trim();

  const data = quran.filter(
    (s) =>
      !searchText ||
      s.name.ar.includes(searchText) ||
      String(s.number) === searchText
  );

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      {/* البحث */}
      <View style={s.search}>
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.muted}
        />

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="ابحث باسم السورة أو رقمها"
          placeholderTextColor={colors.muted}
          style={s.input}
          textAlign="right"
        />
      </View>

      {/* قائمة السور */}
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.number)}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const isSaved = saved.has(item.number);

          return (
            <TouchableOpacity
              style={s.card}
              activeOpacity={0.84}
              onPress={() =>
                navigation.navigate('Reader', {
                  pageNumber: item.verses[0]?.page ?? 1,
                })
              }
            >
              {/* رقم السورة */}
              <View style={s.number}>
                <Text style={s.numberText}>
                  {item.number}
                </Text>
              </View>

              {/* معلومات السورة */}
              <View style={s.info}>
                <Text
                  style={s.name}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name.ar}
                </Text>

                <Text
                  style={s.meta}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.revelation_place.ar} • {item.verses_count} آية
                </Text>
              </View>

              {/* الحفظ */}
              <TouchableOpacity
                style={s.bookmark}
                activeOpacity={0.7}
                onPress={async (event) => {
                  event.stopPropagation();

                  try {
                    await toggleBookmark(
                      item.number,
                      item.name.ar
                    );

                    await refresh();
                  } catch (error) {
                    console.warn(
                      'Error updating bookmark:',
                      error
                    );
                  }
                }}
              >
                <Ionicons
                  name={
                    isSaved
                      ? 'bookmark'
                      : 'bookmark-outline'
                  }
                  size={22}
                  color={
                    isSaved
                      ? colors.goldDark
                      : colors.muted
                  }
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  search: {
    margin: 14,
    marginBottom: 6,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    ...shadow.soft,
  },

  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
    marginLeft: 8,
    textAlign: 'right',
  },

  list: {
    padding: 14,
    paddingTop: 6,
    paddingBottom: 24,
  },

  card: {
    minHeight: 78,
    borderRadius: 20,
    backgroundColor: colors.surface,
    marginBottom: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow.soft,
  },

  number: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  numberText: {
    color: colors.green,
    fontWeight: '900',
    fontSize: 16,
  },

  info: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: 12,
    alignItems: 'stretch',
  },

  name: {
    width: '100%',
    color: colors.ink,
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'right',
    flexShrink: 1,
  },

  meta: {
    width: '100%',
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
    flexShrink: 1,
  },

  bookmark: {
    padding: 5,
    flexShrink: 0,
  },
});

