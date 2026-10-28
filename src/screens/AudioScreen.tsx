
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  Alert,
  Platform,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';

import Ionicons from '@expo/vector-icons/Ionicons';

import * as NavigationBar from 'expo-navigation-bar';

import {
  StatusBar,
} from 'expo-status-bar';

import NetInfo from '@react-native-community/netinfo';

import {
  quran,
} from '../data/quranData';

import {
  AudioItem,
} from '../data/quranTypes';

import {
  colors,
  shadow,
} from '../theme/colors';

function PickerModal({
  visible,
  items,
  selected,
  onSelect,
  onClose,
  title,
}: {
  visible: boolean;
  items: string[];
  selected: string;
  onSelect: (
    value: string
  ) => void;
  onClose: () => void;
  title: string;
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={
        onClose
      }
    >
      <Pressable
        style={m.overlay}
        onPress={onClose}
      />

      <View style={m.sheet}>
        <View
          style={m.handle}
        />

        <Text
          style={m.title}
        >
          {title}
        </Text>

        <FlatList
          data={items}
          keyExtractor={(
            item,
            index
          ) =>
            `${item}-${index}`
          }
          renderItem={({
            item,
          }) => (
            <TouchableOpacity
              style={[
                m.item,
                item ===
                  selected &&
                  m.selected,
              ]}
              onPress={() => {
                onSelect(
                  item
                );

                onClose();
              }}
            >
              <Text
                style={[
                  m.itemText,
                  item ===
                    selected &&
                    m.selectedText,
                ]}
              >
                {item}
              </Text>

              {item ===
                selected && (
                <Ionicons
                  name="checkmark"
                  size={20}
                  color={
                    colors.green
                  }
                />
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}

export default function AudioScreen({
  route,
}: any) {
  /*
   * =====================================================
   * البيانات القادمة من صفحة القراءة
   * =====================================================
   */
  const requestedSurah =
    Number(
      route?.params
        ?.surahNumber ?? 0
    );

  const requestedPage =
    Number(
      route?.params
        ?.pageNumber ?? 0
    );

  /*
   * =====================================================
   * البحث عن السورة من رقم الصفحة
   * =====================================================
   */
  const findSurahIndexByPage =
    (
      pageNumber: number
    ): number => {
      if (
        !pageNumber ||
        pageNumber < 1
      ) {
        return 0;
      }

      for (
        let i = 0;
        i < quran.length;
        i++
      ) {
        const surah: any =
          quran[i];

        if (
          !Array.isArray(
            surah?.verses
          )
        ) {
          continue;
        }

        const found =
          surah.verses.some(
            (
              verse: any
            ) =>
              Number(
                verse?.page
              ) ===
              Number(
                pageNumber
              )
          );

        if (found) {
          return i;
        }
      }

      return 0;
    };

  /*
   * إذا جاء رقم السورة من Reader
   * نستخدمه مباشرة.
   *
   * وإلا نستخدم رقم الصفحة.
   */
  const getInitialSurahIndex =
    () => {
      if (
        requestedSurah >= 1 &&
        requestedSurah <=
          quran.length
      ) {
        return (
          requestedSurah - 1
        );
      }

      return findSurahIndexByPage(
        requestedPage
      );
    };

  const [
    surahIdx,
    setSurahIdx,
  ] = useState(
    getInitialSurahIndex
  );

  const [
    reciter,
    setReciter,
  ] = useState('');

  const [
    rewaya,
    setRewaya,
  ] = useState('');

  const [
    modal,
    setModal,
  ] = useState<
    | 'surah'
    | 'reciter'
    | 'rewaya'
    | null
  >(null);

  const [
    isConnected,
    setIsConnected,
  ] = useState<
    boolean | null
  >(true);

  const surah =
    quran[surahIdx];

  const audios =
    surah?.audio ?? [];

  /*
   * القارئون الموجودون
   * في السورة الحالية
   */
  const reciters =
    useMemo(
      () =>
        Array.from(
          new Set(
            audios.map(
              (audio) =>
                audio
                  .reciter
                  .ar
            )
          )
        ),
      [audios]
    );

  /*
   * الروايات الموجودة
   * للقارئ الحالي
   */
  const rewayas =
    useMemo(
      () =>
        Array.from(
          new Set(
            audios
              .filter(
                (audio) =>
                  !reciter ||
                  audio
                    .reciter
                    .ar ===
                    reciter
              )
              .map(
                (audio) =>
                  audio
                    .rewaya
                    .ar
              )
          )
        ),
      [
        audios,
        reciter,
      ]
    );

  /*
   * الصوت الحالي
   */
  const selected =
    useMemo<AudioItem | null>(
      () => {
        if (
          audios.length ===
          0
        ) {
          return null;
        }

        /*
         * إذا اختار المستخدم قارئًا
         * ورواية، نحافظ عليهما.
         */
        const exact =
          audios.find(
            (audio) =>
              audio
                .reciter
                .ar ===
                reciter &&
              audio
                .rewaya
                .ar ===
                rewaya
          );

        if (exact) {
          return exact;
        }

        /*
         * إذا لم نجد الاختيار
         * الحالي، استخدم أول صوت
         * مؤقتًا.
         */
        return (
          audios[0] ??
          null
        );
      },
      [
        audios,
        reciter,
        rewaya,
      ]
    );

  /*
   * =====================================================
   * مشغل الصوت
   *
   * لا يوجد هنا:
   * Background Playback
   * Lock Screen
   * setActiveForLockScreen
   *
   * حتى يعمل بدون مشكلة في Expo Go.
   * =====================================================
   */
  const player =
    useAudioPlayer(
      selected?.link ??
        null,
      {
        updateInterval: 500,
      }
    );

  const status =
    useAudioPlayerStatus(
      player
    );

  /*
   * =====================================================
   * إخفاء Navigation Bar
   * =====================================================
   */
  useEffect(() => {
    if (
      Platform.OS !==
      'android'
    ) {
      return;
    }

    const hide =
      async () => {
        try {
          await NavigationBar.setVisibilityAsync(
            'hidden'
          );
        } catch {}
      };

    hide();

    return () => {
      NavigationBar
        .setVisibilityAsync(
          'visible'
        )
        .catch(
          () => {}
        );
    };
  }, []);

  /*
   * =====================================================
   * الإنترنت
   * =====================================================
   */
  useEffect(() => {
    const unsubscribe =
      NetInfo.addEventListener(
        (state) => {
          setIsConnected(
            state.isConnected
          );
        }
      );

    return () =>
      unsubscribe();
  }, []);

  /*
   * =====================================================
   * Audio Mode آمن
   *
   * لا نطلب Background Playback.
   * =====================================================
   */
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode:
        true,
      interruptionMode:
        'doNotMix',
    }).catch(
      () => {}
    );
  }, []);

  /*
   * =====================================================
   * القارئ الافتراضي
   *
   * نضع أول قارئ فقط إذا لم يكن
   * هناك قارئ مختار مسبقًا.
   *
   * لا نعيده إلى الأول عند
   * تغيير السورة.
   * =====================================================
   */
  useEffect(() => {
    if (
      reciter ||
      audios.length ===
        0
    ) {
      return;
    }

    const first =
      audios[0];

    if (!first) {
      return;
    }

    setReciter(
      first.reciter.ar
    );

    setRewaya(
      first.rewaya.ar
    );
  }, [
    audios,
    reciter,
  ]);

  /*
   * =====================================================
   * التأكد من الرواية
   * =====================================================
   */
  useEffect(() => {
    if (
      !reciter ||
      rewayas.length ===
        0
    ) {
      return;
    }

    if (
      !rewayas.includes(
        rewaya
      )
    ) {
      setRewaya(
        rewayas[0]
      );
    }
  }, [
    reciter,
    rewayas,
    rewaya,
  ]);

  /*
   * =====================================================
   * استقبال السورة القادمة من ReaderScreen
   * =====================================================
   */
  useEffect(() => {
    const newIndex =
      getInitialSurahIndex();

    if (
      newIndex >= 0 &&
      newIndex <
        quran.length
    ) {
      setSurahIdx(
        newIndex
      );
    }
  }, [
    requestedSurah,
    requestedPage,
  ]);

  /*
   * =====================================================
   * التشغيل
   * =====================================================
   */
  const playAudio =
    async () => {
      if (
        isConnected ===
        false
      ) {
        Alert.alert(
          'تنبيه',
          'يرجى الاتصال بالإنترنت لتشغيل التلاوة.'
        );

        return;
      }

      if (
        !selected?.link
      ) {
        Alert.alert(
          'تنبيه',
          'لا يوجد صوت متاح لهذه السورة.'
        );

        return;
      }

      try {
        player.play();
      } catch (error) {
        console.warn(
          'Audio play error:',
          error
        );

        Alert.alert(
          'خطأ',
          'تعذر تشغيل الصوت.'
        );
      }
    };

  const togglePlayPause =
    async () => {
      if (
        status.playing
      ) {
        player.pause();
      } else {
        await playAudio();
      }
    };

  /*
   * =====================================================
   * تقديم / تأخير 10 ثوان
   * =====================================================
   */
  const seekBy =
    (seconds: number) => {
      try {
        const duration =
          Number(
            status.duration ||
              0
          );

        const current =
          Number(
            status.currentTime ||
              0
          );

        const nextTime =
          Math.max(
            0,
            Math.min(
              duration,
              current +
                seconds
            )
          );

        player.seekTo(
          nextTime
        );
      } catch (error) {
        console.warn(
          'Seek error:',
          error
        );
      }
    };

  /*
   * =====================================================
   * الصفحة / السورة السابقة
   * =====================================================
   */
  const previousSurah =
    () => {
      setSurahIdx(
        (current) =>
          Math.max(
            0,
            current - 1
          )
      );
    };

  /*
   * =====================================================
   * الصفحة / السورة التالية
   * =====================================================
   */
  const nextSurah =
    () => {
      setSurahIdx(
        (current) =>
          Math.min(
            quran.length -
              1,
            current + 1
          )
      );
    };

  const formatTime =
    (
      value: number
    ) => {
      const safe =
        Number.isFinite(
          value
        )
          ? Math.max(
              0,
              value
            )
          : 0;

      const minutes =
        Math.floor(
          safe / 60
        );

      const seconds =
        Math.floor(
          safe % 60
        )
          .toString()
          .padStart(
            2,
            '0'
          );

      return `${minutes}:${seconds}`;
    };

  const progress =
    status.duration >
    0
      ? Math.min(
          1,
          status.currentTime /
            status.duration
        )
      : 0;

  const items =
    modal ===
    'surah'
      ? quran.map(
          (item: any) =>
            `${item.number}. ${item.name.ar}`
        )
      : modal ===
        'reciter'
      ? reciters
      : rewayas;

  const selectedItem =
    modal ===
    'surah'
      ? `${surah?.number}. ${surah?.name.ar}`
      : modal ===
        'reciter'
      ? reciter
      : rewaya;

  return (
    <SafeAreaView
      style={s.safe}
      edges={['bottom']}
    >
      <StatusBar hidden />

      {isConnected ===
        false && (
        <View
          style={
            s.offlineBanner
          }
        >
          <Ionicons
            name="wifi-outline"
            size={18}
            color="#FFF"
          />

          <Text
            style={
              s.offlineText
            }
          >
            يرجى الاتصال بالإنترنت
          </Text>
        </View>
      )}

      <View
        style={s.content}
      >
        <View
          style={
            s.selectRow
          }
        >
          <Select
            title="السورة"
            value={
              surah?.name
                .ar ??
              '—'
            }
            onPress={() =>
              setModal(
                'surah'
              )
            }
          />

          <Select
            title="القارئ"
            value={
              reciter ||
              '—'
            }
            onPress={() =>
              setModal(
                'reciter'
              )
            }
          />

          <Select
            title="الرواية"
            value={
              rewaya ||
              '—'
            }
            onPress={() =>
              setModal(
                'rewaya'
              )
            }
          />
        </View>

        <LinearGradient
          colors={[
            colors.greenDark,
            colors.green,
          ]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={
            s.player
          }
        >
          <View
            style={
              s.headphone
            }
          >
            <Ionicons
              name="headset-outline"
              size={30}
              color={
                colors.gold
              }
            />
          </View>

          <Text
            style={s.surah}
          >
            {
              surah?.name
                .ar
            }
          </Text>

          <Text
            style={
              s.reciter
            }
          >
            {
              selected
                ?.reciter
                .ar ||
              '—'
            }
          </Text>

          <Text
            style={
              s.rewaya
            }
          >
            {
              selected
                ?.rewaya
                .ar ||
              '—'
            }
          </Text>

          <View
            style={
              s.progress
            }
          >
            <View
              style={
                s.track
              }
            >
              <View
                style={[
                  s.fill,
                  {
                    width: `${
                      progress *
                      100
                    }%`,
                  },
                ]}
              />
            </View>

            <View
              style={
                s.times
              }
            >
              <Text
                style={
                  s.time
                }
              >
                {formatTime(
                  status.currentTime
                )}
              </Text>

              <Text
                style={
                  s.time
                }
              >
                {formatTime(
                  status.duration
                )}
              </Text>
            </View>
          </View>

          <View
            style={
              s.controls
            }
          >
            <TouchableOpacity
              style={
                s.control
              }
              onPress={() =>
                seekBy(-10)
              }
            >
              <Ionicons
                name="refresh"
                size={22}
                color={
                  colors.white
                }
              />

              <Text
                style={
                  s.seconds
                }
              >
                10
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                s.control
              }
              onPress={
                previousSurah
              }
            >
              <Ionicons
                name="play-skip-back"
                size={22}
                color={
                  colors.white
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={
                s.play
              }
              onPress={
                togglePlayPause
              }
            >
              <Ionicons
                name={
                  status.playing
                    ? 'pause'
                    : 'play'
                }
                size={30}
                color={
                  colors.greenDark
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={
                s.control
              }
              onPress={
                nextSurah
              }
            >
              <Ionicons
                name="play-skip-forward"
                size={22}
                color={
                  colors.white
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={
                s.control
              }
              onPress={() =>
                seekBy(10)
              }
            >
              <Ionicons
                name="refresh"
                size={22}
                color={
                  colors.white
                }
              />

              <Text
                style={
                  s.seconds
                }
              >
                10
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View
          style={s.info}
        >
          <Text
            style={
              s.infoText
            }
          >
            {
              surah
                ?.revelation_place
                ?.ar ??
              ''
            }
          </Text>

          <Text
            style={
              s.infoText
            }
          >
            {
              surah
                ?.verses_count ??
              0
            }{' '}
            آية
          </Text>
        </View>
      </View>

      <PickerModal
        visible={
          modal !== null
        }
        items={items}
        selected={
          selectedItem
        }
        onSelect={(value) => {
          if (
            modal ===
            'surah'
          ) {
            const index =
              items.indexOf(
                value
              );

            if (
              index >= 0
            ) {
              setSurahIdx(
                index
              );
            }
          } else if (
            modal ===
            'reciter'
          ) {
            setReciter(
              value
            );
          } else {
            setRewaya(
              value
            );
          }
        }}
        onClose={() =>
          setModal(null)
        }
        title={
          modal ===
          'surah'
            ? 'اختر السورة'
            : modal ===
              'reciter'
            ? 'اختر القارئ'
            : 'اختر الرواية'
        }
      />
    </SafeAreaView>
  );
}

function Select({
  title,
  value,
  onPress,
}: {
  title: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={s.select}
      onPress={onPress}
    >
      <Text
        style={
          s.selectTitle
        }
      >
        {title}
      </Text>

      <Text
        style={
          s.selectValue
        }
        numberOfLines={1}
      >
        {value}
      </Text>

      <Ionicons
        name="chevron-down"
        size={16}
        color={
          colors.muted
        }
      />
    </TouchableOpacity>
  );
}

const s =
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor:
        colors.bg,
    },

    offlineBanner: {
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'center',
      gap: 8,
      backgroundColor:
        '#E53935',
      paddingVertical: 10,
      paddingHorizontal: 16,
    },

    offlineText: {
      color: '#FFF',
      fontSize: 13,
      fontWeight: '700',
    },

    content: {
      padding: 16,
    },

    selectRow: {
      gap: 9,
    },

    select: {
      minHeight: 60,
      borderRadius: 17,
      backgroundColor:
        colors.surface,
      paddingHorizontal: 14,
      paddingVertical: 10,
      ...shadow.soft,
    },

    selectTitle: {
      fontSize: 11,
      color:
        colors.muted,
      textAlign:
        'right',
    },

    selectValue: {
      fontSize: 15,
      fontWeight: '800',
      color:
        colors.ink,
      textAlign:
        'right',
      marginTop: 3,
      paddingRight: 22,
    },

    player: {
      marginTop: 14,
      borderRadius: 30,
      padding: 24,
      alignItems:
        'center',
      ...shadow.card,
    },

    headphone: {
      width: 62,
      height: 62,
      borderRadius: 31,
      backgroundColor:
        'rgba(255,255,255,.1)',
      alignItems:
        'center',
      justifyContent:
        'center',
      marginBottom: 10,
    },

    surah: {
      fontSize: 29,
      fontWeight: '900',
      color:
        colors.white,
    },

    reciter: {
      fontSize: 15,
      color:
        '#DCEDE5',
      marginTop: 5,
    },

    rewaya: {
      fontSize: 12,
      color:
        '#AFC8BD',
      marginTop: 2,
    },

    progress: {
      width: '100%',
      marginTop: 22,
    },

    track: {
      height: 5,
      borderRadius: 3,
      backgroundColor:
        'rgba(255,255,255,.22)',
      overflow:
        'hidden',
    },

    fill: {
      height: 5,
      borderRadius: 3,
      backgroundColor:
        colors.gold,
    },

    times: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      marginTop: 6,
    },

    time: {
      fontSize: 11,
      color:
        '#BFD2C9',
    },

    controls: {
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'center',
      gap: 10,
      marginTop: 20,
    },

    control: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor:
        'rgba(255,255,255,.11)',
      alignItems:
        'center',
      justifyContent:
        'center',
    },

    play: {
      width: 66,
      height: 66,
      borderRadius: 33,
      backgroundColor:
        colors.gold,
      alignItems:
        'center',
      justifyContent:
        'center',
    },

    seconds: {
      position:
        'absolute',
      bottom: 4,
      fontSize: 8,
      color:
        colors.white,
      fontWeight: '800',
    },

    info: {
      flexDirection:
        'row',
      justifyContent:
        'center',
      gap: 10,
      marginTop: 12,
    },

    infoText: {
      backgroundColor:
        colors.surface,
      color:
        colors.ink,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 8,
      fontSize: 12,
      fontWeight: '800',
      overflow:
        'hidden',
    },
  });

const m =
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor:
        'rgba(0,0,0,.45)',
    },

    sheet: {
      position:
        'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      maxHeight:
        '75%',
      backgroundColor:
        colors.surface,
      borderTopLeftRadius:
        28,
      borderTopRightRadius:
        28,
      paddingBottom: 24,
    },

    handle: {
      width: 42,
      height: 4,
      borderRadius: 2,
      backgroundColor:
        colors.border,
      alignSelf:
        'center',
      marginTop: 10,
    },

    title: {
      fontSize: 19,
      fontWeight: '900',
      color:
        colors.ink,
      textAlign:
        'right',
      padding: 18,
    },

    item: {
      minHeight: 52,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'space-between',
      paddingHorizontal: 20,
      borderTopWidth: 1,
      borderTopColor:
        colors.border,
    },

    selected: {
      backgroundColor:
        colors.greenSoft,
    },

    itemText: {
      flex: 1,
      textAlign:
        'right',
      fontSize: 15,
      color:
        colors.ink,
    },

    selectedText: {
      color:
        colors.green,
      fontWeight:
        '900',
    },
  });

