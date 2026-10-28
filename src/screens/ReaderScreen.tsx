import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useFocusEffect,
} from '@react-navigation/native';

import * as NavigationBar from 'expo-navigation-bar';

import Ionicons from '@expo/vector-icons/Ionicons';

import { quranPages } from '../data/quranData';

import {
  getQuranPageSource,
} from '../data/quranPageSource';

import {
  colors,
  shadow,
} from '../theme/colors';

import {
  isPageBookmarked,
  togglePageBookmark,
} from '../storage/pageBookmarkStorage';


const {
  width,
  height,
} = Dimensions.get('window');


const PAGE_COUNT = quranPages.length;


export default function ReaderScreen({
  route,
  navigation,
}: any) {

  /*
   * الصفحة المطلوبة عند فتح القارئ.
   */
  const requested = Number(
    route?.params?.pageNumber ?? 1
  );


  /*
   * التأكد من أن الصفحة
   * داخل نطاق صفحات القرآن.
   */
  const initial = Math.min(
    PAGE_COUNT,
    Math.max(
      1,
      requested
    )
  );


  /*
   * الصفحة الحالية.
   */
  const [
    page,
    setPage,
  ] = useState<number>(
    initial
  );


  /*
   * حالة حفظ الصفحة.
   */
  const [
    saved,
    setSaved,
  ] = useState<boolean>(
    false
  );


  /*
   * إظهار أو إخفاء
   * أزرار التحكم.
   */
  const [
    controlsVisible,
    setControlsVisible,
  ] = useState<boolean>(
    true
  );


  /*
   * مرجع FlatList.
   */
  const listRef =
    useRef<FlatList<number>>(
      null
    );


  /*
   * نحصل على أرقام الصفحات فقط.
   */
  const data = useMemo(
    () =>
      quranPages.map(
        (item: any) =>
          item.page
      ),
    []
  );


  /*
   * جلب معلومات الصفحة الحالية (الحزب وغيره)
   */
  const currentPageData: Record<string, any> = useMemo(() => {
    const found = quranPages.find(
      (item: any) => item.page === page
    );
    return found || {};
  }, [page]);


  /*
   * إخفاء شريط التنقل في Android أثناء القراءة.
   */
  useFocusEffect(
    React.useCallback(
      () => {

        if (
          Platform.OS !== 'android'
        ) {
          return undefined;
        }


        const hideNavigationBar =
          async () => {

            try {

              await NavigationBar
                .setVisibilityAsync(
                  'hidden'
                );

            } catch (
              error
            ) {

              console.warn(
                'Navigation bar could not be hidden:',
                error
              );

            }

          };


        hideNavigationBar();

        setControlsVisible(true);


        return () => {

          NavigationBar
            .setVisibilityAsync(
              'visible'
            )
            .catch(
              () => {}
            );

        };

      },
      []
    )
  );


  /*
   * عند فتح القارئ على صفحة معينة.
   */
  useEffect(() => {

    const targetPage =
      Math.min(
        PAGE_COUNT,
        Math.max(
          1,
          requested
        )
      );


    setPage(
      targetPage
    );


    setControlsVisible(
      true
    );


    /*
     * التحقق من الحفظ.
     */
    isPageBookmarked(
      targetPage
    )
      .then(
        (value) => {

          setSaved(
            Boolean(value)
          );

        }
      )
      .catch(() => {

        setSaved(false);

      });


    /*
     * الانتقال إلى الصفحة المطلوبة بعد تجهيز FlatList.
     */
    const timer =
      setTimeout(
        () => {

          if (
            !listRef.current
          ) {
            return;
          }


          try {

            listRef.current.scrollToIndex({
              index:
                targetPage - 1,

              animated:
                false,
            });

          } catch (
            error
          ) {

            console.warn(
              'Could not scroll to page:',
              error
            );

          }

        },
        100
      );


    return () => {

      clearTimeout(
        timer
      );

    };

  }, [requested]);


  /*
   * تحديث حالة الحفظ عند تغيير الصفحة.
   */
  useEffect(() => {

    let mounted = true;


    isPageBookmarked(
      page
    )
      .then(
        (value) => {

          if (
            mounted
          ) {

            setSaved(
              Boolean(value)
            );

          }

        }
      )
      .catch(() => {

        if (
          mounted
        ) {

          setSaved(false);

        }

      });


    return () => {

      mounted = false;

    };

  }, [page]);


  /*
   * حفظ / إلغاء حفظ الصفحة.
   */
  const toggleSave =
    async () => {

      try {

        const value =
          await togglePageBookmark(
            page
          );


        setSaved(
          Boolean(value)
        );

      } catch (
        error
      ) {

        console.warn(
          'Bookmark error:',
          error
        );

      }

    };


  /*
   * الذهاب إلى صفحة الاستماع
   */
  const openAudio =
    () => {

      navigation.navigate(
        'Audio',
        {
          pageNumber:
            page,
        }
      );

    };


  /*
   * إظهار / إخفاء الأزرار ورقم الصفحة.
   */
  const toggleControls =
    () => {

      setControlsVisible(
        (current) =>
          !current
      );

    };


  return (
    <SafeAreaView
      style={styles.safe}
      edges={[]}
    >

      <FlatList
        ref={listRef}

        data={data}

        horizontal

        pagingEnabled

        inverted

        initialScrollIndex={
          initial - 1
        }

        showsHorizontalScrollIndicator={
          false
        }

        bounces={false}

        keyExtractor={(item) =>
          String(item)
        }

        getItemLayout={(
          _data,
          index
        ) => ({
          length:
            width,

          offset:
            width * index,

          index,
        })}


        onMomentumScrollEnd={(
          event
        ) => {

          const offset =
            event.nativeEvent
              .contentOffset.x;


          const index =
            Math.round(
              offset / width
            );


          const newPage =
            Math.min(
              PAGE_COUNT,
              Math.max(
                1,
                index + 1
              )
            );


          setPage(
            newPage
          );

        }}


        renderItem={({
          item,
        }) => (

          <Pressable
            style={styles.page}
            onPress={
              toggleControls
            }
          >

            {/*
             * صورة القرآن تملأ الشاشة بالكامل
             */}
            <Image
              source={
                getQuranPageSource(
                  item
                )
              }

              style={
                styles.quranImage
              }

              resizeMode="stretch"
            />


            {/*
             * أدوات التحكم تظهر فوق القرآن
             */}
            {controlsVisible && (
              <>

                {/*
                 * الشريط العلوي
                 */}
                <View
                  pointerEvents="box-none"
                  style={
                    styles.topControls
                  }
                >

                  <TouchableOpacity
                    style={styles.topIconBtn}
                    onPress={() => navigation.goBack()}
                  >
                    <Ionicons name="arrow-back" size={20} color="#2C3A2E" />
                  </TouchableOpacity>

                  <View style={styles.topBadge}>
                    <Text style={styles.pageNumber}>
                      {currentPageData.hizb ? `الحزب ${currentPageData.hizb} • صفحة ${item}` : `صفحة ${item}`}
                    </Text>
                  </View>

                 
                </View>


                {/*
                 * الشريط السفلي
                 */}
                <View
                  pointerEvents="box-none"
                  style={
                    styles.bottomControls
                  }
                >

                  <View
                    style={
                      styles.bottomBar
                    }
                  >

                    <ActionButton
                      icon={
                        saved
                          ? 'bookmark'
                          : 'bookmark-outline'
                      }

                      label={
                        saved
                          ? 'محفوظة'
                          : 'حفظ الصفحة'
                      }

                      active={
                        saved
                      }

                      onPress={
                        toggleSave
                      }
                    />


                    <ActionButton
                      icon="list-outline"

                      label="الفهرس"

                      onPress={() =>
                        navigation.navigate(
                          'Index'
                        )
                      }
                    />


                    <ActionButton
                      icon="headset-outline"

                      label="الاستماع"

                      onPress={
                        openAudio
                      }
                    />

                  </View>

                </View>

              </>
            )}

          </Pressable>

        )}
      />

    </SafeAreaView>
  );
}


/*
 * =========================
 * Action Button
 * =========================
 */
function ActionButton({
  icon,
  label,
  onPress,
  active = false,
}: {
  icon: React.ComponentProps<
    typeof Ionicons
  >['name'];

  label: string;

  onPress: () => void;

  active?: boolean;
}) {

  return (

    <TouchableOpacity
      style={
        styles.action
      }

      onPress={
        onPress
      }

      activeOpacity={
        0.8
      }
    >

      <View
        style={[
          styles.actionIcon,

          active &&
            styles.actionIconActive,
        ]}
      >

        <Ionicons
          name={icon}
          size={22}

          color={
            active ? '#8B5A2B' : '#2C3A2E'
          }
        />

      </View>


      <Text
        style={[
          styles.actionLabel,
          active && styles.actionLabelActive
        ]}
      >
        {label}
      </Text>

    </TouchableOpacity>

  );
}


/*
 * =========================
 * Styles
 * =========================
 */
const styles =
  StyleSheet.create({

    safe: {

      flex: 1,

      backgroundColor:
        '#FBF9F5',

    },


    page: {

      width:
        width,

      height:
        height,

      position:
        'relative',

      backgroundColor:
        '#FBF9F5',

      alignItems:
        'center',

      justifyContent:
        'center',

    },


    quranImage: {

      position:
        'absolute',

      top: 0,

      left: 0,

      right: 0,

      bottom: 0,

      width:
        width,

      height:
        height,

    },


    topControls: {

      position:
        'absolute',

      top: Platform.OS === 'android' ? 35 : 15,

      left: 16,

      right: 16,

      flexDirection:
        'row-reverse',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      zIndex: 10,

    },


    topBadge: {

      backgroundColor:
        'rgba(251, 249, 245, 0.92)',

      paddingHorizontal: 16,

      paddingVertical: 7,

      borderRadius: 20,

      borderWidth: 1,

      borderColor: 'rgba(218, 203, 178, 0.6)',

    },


    topIconBtn: {

      backgroundColor:
        'rgba(251, 249, 245, 0.92)',

      padding: 8,

      borderRadius: 20,

      borderWidth: 1,

      borderColor: 'rgba(218, 203, 178, 0.6)',

    },


    pageNumber: {

      color:
        '#2C3A2E',

      fontSize:
        13,

      fontWeight:
        '700',

      textAlign:
        'center',

      backgroundColor:
        'transparent',

    },


    bottomControls: {

      position:
        'absolute',

      left: 12,

      right: 12,

      bottom: Platform.OS === 'ios' ? 25 : 15,

      height: 91,

      justifyContent:
        'center',

      zIndex: 20,

    },


    bottomBar: {

      height: 78,

      borderRadius: 24,

      backgroundColor:
        'rgba(251, 249, 245, 0.94)',

      borderWidth: 1,

      borderColor: 'rgba(218, 203, 178, 0.65)',

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-around',

      paddingHorizontal: 8,

      shadowColor: '#000',

      shadowOffset: { width: 0, height: 2 },

      shadowOpacity: 0.08,

      shadowRadius: 8,

      elevation: 3,

    },


    action: {

      flex: 1,

      height:
        '100%',

      alignItems:
        'center',

      justifyContent:
        'center',

    },


    actionIcon: {

      width: 42,

      height: 42,

      borderRadius: 14,

      backgroundColor:
        'rgba(238, 230, 215, 0.6)',

      alignItems:
        'center',

      justifyContent:
        'center',

    },


    actionIconActive: {

      backgroundColor:
        'rgba(218, 185, 145, 0.35)',

    },


    actionLabel: {

      color:
        '#2C3A2E',

      fontSize:
        11,

      fontWeight:
        '800',

      marginTop:
        4,

      textAlign:
        'center',

      backgroundColor:
        'transparent',

    },


    actionLabelActive: {

      color:
        '#8B5A2B',

    },

  });