
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import HomeButton from '../components/HomeButton';
import { colors, shadow } from '../theme/colors';

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.greenDark, colors.green]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.hero}
        >
          <View style={s.logoRing}>
            <Image
              source={require('../../assets/icon.png')}
              style={s.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={s.brand}>المحظرة</Text>

          <Text style={s.tagline}>
            القرآن الكريم — قراءة، استماع، ذكر
          </Text>

          <View style={s.goldLine} />
        </LinearGradient>

        {/* Section */}
        <Text style={s.section}>ماذا تريد أن تفعل؟</Text>

        {/* Buttons */}
        <View style={s.grid}>
          <HomeButton
            title="فهرس القرآن"
            subtitle="114 سورة"
            icon="list-outline"
            onPress={() => navigation.navigate('Index')}
          />

          <HomeButton
            title="قراءة المصحف"
            subtitle="صفحات المصحف"
            icon="book-outline"
            onPress={() =>
              navigation.navigate('Reader', {
                pageNumber: 1,
              })
            }
            gold
          />

          <HomeButton
            title="الاستماع"
            subtitle="القارئ والرواية"
            icon="headset-outline"
            onPress={() => navigation.navigate('Audio')}
          />

          <HomeButton
            title="المحفوظات"
            subtitle="سورك المحفوظة"
            icon="bookmark-outline"
            onPress={() => navigation.navigate('Bookmarks')}
            gold
          />

          <HomeButton
            title="المسبحة"
            subtitle="عداد التسبيح"
            icon="radio-button-on-outline"
            onPress={() => navigation.navigate('Tasbih')}
          />

          <HomeButton
            title="الاستفسار"
            subtitle="معلومات التطبيق"
            icon="information-circle-outline"
            onPress={() => navigation.navigate('Inquiry')}
            gold
          />
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.bismillah}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  content: {
    padding: 16,
    paddingBottom: 32,
  },

  hero: {
    borderRadius: 32,
    paddingVertical: 26,
    alignItems: 'center',
    marginBottom: 20,
    ...shadow.card,
  },

  logoRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 2,
    borderColor: 'rgba(215,184,77,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },

  brand: {
    marginTop: 12,
    color: colors.white,
    fontSize: 34,
    fontWeight: '900',
  },

  tagline: {
    marginTop: 5,
    color: '#DDEDE6',
    fontSize: 13,
    textAlign: 'center',
  },

  goldLine: {
    width: 70,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.gold,
    marginTop: 14,
  },

  section: {
    textAlign: 'right',
    color: colors.ink,
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 8,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  footer: {
    alignItems: 'center',
    marginTop: 14,
  },

  bismillah: {
    color: colors.goldDark,
    fontSize: 15,
    fontWeight: '700',
  },
});

