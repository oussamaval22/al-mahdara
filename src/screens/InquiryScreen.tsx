import React, { useState, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Linking,
  Image,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadow } from '../theme/colors';

const PRIVATE_PASSWORD = '22240838';

const PRIVATE_TEXT = `أبي، شكرًا على كل تعب أخفيته عني، وعلى كل تضحية قدمتها دون أن تنتظر مقابلًا، وعلى كل لحظة جعلت فيها سعادتي قبل سعادتك. شكرًا لأنك علمتني أن الحياة ليست بالأماني، وإنما بالصبر والعمل والإصرار.

كنتَ لي مدرسةً قبل أن تكون أبًا؛ منك تعلمت معنى المسؤولية، والكرامة، والوفاء، واحترام الآخرين. وعندما كنت أبحث عن قدوة أقتدي بها، كنت أجدها أمامي فيك.

قد لا أقول لك دائمًا ما أشعر به، وقد تمر الأيام دون أن أعبّر عن امتناني، لكنني أريدك أن تعرف أن كل ما فعلته من أجلي محفور في قلبي، ولن أنساه ما حييت.

أبي، إن كان لي في هذه الحياة فخر، فأنت من أعظم أسباب فخري. وإن كان لي نجاح، فأنت من وضع أول خطوة في طريقه. وإن أصبحت يومًا شخصًا صالحًا نافعًا، فلك في ذلك فضل كبير.

فشكرًا لك يا أبي…

شكرًا لأنك كنت الأمان حين خفت، والقوة حين ضعفت، والنور حين أظلم الطريق.

أسأل الله أن يحفظك، ويطيل عمرك في طاعته، ويجزيك عني خير الجزاء، وأن أستطيع يومًا أن أرد لك ولو جزءًا صغيرًا من جميلك.

أبي، لن تكفيك كلمة «شكرًا»، ولكنها أصدق ما أملك أن أقوله لك: شكرًا لأنك أبي، وشكرًا لأنني كنت محظوظًا بأن أكون ابنك.`;

const PRIVATE_TEXTE = `أمي، يا أحنَّ قلبٍ عرفته في حياتي، ويا أجمل نعمةٍ وهبني الله إياها، كيف أصف حنانكِ، والكلمات مهما كثرت لا تستطيع أن تفيكِ حقكِ؟

كنتِ دائمًا ملجئي حين أخاف، وموطني حين أتعب، وابتسامتكِ كانت كفيلةً بأن تجعل أصعب الأيام أهون. كنتِ تمسحين دموعي قبل أن أطلب منكِ، وتعرفين حزني من نظرةٍ واحدة، وكأن قلبكِ خُلق ليشعر بي قبل أن أشعر بنفسي.

أمي، كم صبرتِ من أجلي! سهرتِ حين كنتُ مريضًا، وتعبتِ حين كنتُ صغيرًا، وتحملتِ من المشقة ما لم أكن أدركه. كنتِ تخفين تعبكِ خلف ابتسامة، وتخفين حزنكِ حتى لا أحزن، وتمنحينني من قوتكِ حين تكونين أنتِ في أشد الحاجة إلى الراحة.

كبرتُ، وكلما كبرتُ أدركتُ أكثر كم كنتِ عظيمة. أدركتُ أن يديكِ اللتين حملتاني صغيرًا كانتا تحملان معها أحلامي، وأن دعواتكِ في الليل كانت تحرس خطواتي في النهار.

أمي، إن كان في حياتي شيءٌ جميل، فأنتِ أولُ أسباب جماله. وإن كان في قلبي شيءٌ من الرحمة، فمن حنانكِ تعلمته. وإن استطعتُ أن أصبر على الحياة، فمن صبركِ تعلمتُ معنى الصبر.

سامحيني إن قصّرتُ في حقكِ، وإن مرّت أيامٌ لم أقل لكِ فيها كم أحبكِ. فاعلمي أن محبتكِ في قلبي أكبر من أن تحيط بها الكلمات.

أسأل الله أن يحفظكِ لي، ويمنحكِ الصحة والعافية، ويجزيكِ عن كل دمعةٍ ذرفتِها، وكل ليلةٍ سهرتِها، وكل تضحيةٍ قدمتِها من أجلي.

أمي، أنتِ الحنان حين أقسو، والأمان حين أخاف، والصبر حين أعجز، والدعاء الذي يرافقني أينما ذهبت. أحبكِ، وسيبقى حبكِ في قلبي ما حييت.`;

interface RowProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  onPress?: () => void;
}

const Row = memo(({ icon, label, value, onPress }: RowProps) => (
  <TouchableOpacity
    disabled={!onPress}
    onPress={onPress}
    style={s.row}
    activeOpacity={0.7}
  >
    <Ionicons name={icon} size={21} color={colors.green} />
    <View style={s.rowText}>
      <Text style={s.label}>{label}</Text>
      <Text style={s.value}>{value}</Text>
    </View>
  </TouchableOpacity>
));

export default function InquiryScreen() {
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);
  const [showPrivate, setShowPrivate] = useState(false);
  const [password, setPassword] = useState('');

  const checkPassword = () => {
    if (password === PRIVATE_PASSWORD) {
      setPassword('');
      setShowPassword(false);
      setShowPrivate(true);
      return;
    }

    Alert.alert('خطأ', 'الكلمة السرية غير صحيحة');
    setPassword('');
  };

  const handleClosePasswordModal = () => {
    setPassword('');
    setShowPassword(false);
  };

  return (
    <View style={s.safe}>
      <View style={s.hero}>
        <Ionicons
          name="information-circle-outline"
          size={34}
          color={colors.gold}
        />
        <Text style={s.title}>عن المحظرة</Text>
        <Text style={s.sub}>تطبيق قرآن عربي بسيط وهادئ</Text>
      </View>

      <View style={s.card}>
        <Row
          icon="person-outline"
          label="اسم المبرمج"
          value="إبراهيم فال محمد فال"
        />
        <Row
          icon="call-outline"
          label="رقم الهاتف"
          value="30534808"
          onPress={() => Linking.openURL('tel:30534808')}
        />
        <Row
          icon="mail-outline"
          label="البريد الإلكتروني"
          value="oussamaval22@gmail.com"
          onPress={() => Linking.openURL('mailto:oussamaval22@gmail.com')}
        />
      </View>

      <TouchableOpacity
        style={[s.private, { bottom: Math.max(18, insets.bottom + 10) }]}
        onPress={() => setShowPassword(true)}
        activeOpacity={0.7}
      >
        <Ionicons name="lock-closed-outline" size={16} color={colors.muted} />
        <Text style={s.privateText}>خاص</Text>
      </TouchableOpacity>

      {/* نافذة الكلمة السرية */}
      <Modal
        transparent
        visible={showPassword}
        animationType="fade"
        onRequestClose={handleClosePasswordModal}
      >
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>أدخل الكلمة السرية</Text>

            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              keyboardType="number-pad"
              maxLength={8}
              textAlign="right"
              placeholder="الكلمة السرية"
              placeholderTextColor={colors.muted}
              style={s.input}
            />

            <TouchableOpacity
              style={s.login}
              onPress={checkPassword}
              activeOpacity={0.85}
            >
              <Text style={s.loginText}>دخول</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleClosePasswordModal}>
              <Text style={s.cancel}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* المحتوى الخاص بعد الشفرة */}
      <Modal
        visible={showPrivate}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPrivate(false)}
      >
        <View style={s.privateScreen}>
          {/* زر الإغلاق العلوي */}
          <View style={s.modalHeaderBar}>
            <TouchableOpacity
              onPress={() => setShowPrivate(false)}
              style={s.closeButton}
            >
              <Ionicons name="close" size={26} color={colors.ink} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={s.privateContent}
            showsVerticalScrollIndicator={false}
          >
            {/* بطاقة الأب */}
            <View style={[s.contentCard]}>
              <Text style={[s.cardTitle, { color: '#1B7A42' }]}>
                قدوتي في الحياة: أبي
              </Text>
              <View style={[s.imageWrapper, { borderColor: '#1B7A42' }]}>
                <Image
                  source={require('../../assets/papa.jpg')}
                  style={s.privateImage}
                  resizeMode="cover"
                />
              </View>
              <View style={s.textContainer}>
                <Text style={s.privateTextBody}>{PRIVATE_TEXT}</Text>
              </View>
            </View>

            {/* بطاقة الأم */}
            <View style={[s.contentCard]}>
              <Text style={[s.cardTitle, { color: '#C0392B' }]}>
                حبي الأول والوحيد: أمي
              </Text>
              <View style={[s.imageWrapper, { borderColor: '#C0392B' }]}>
                <Image
                  source={require('../../assets/mama.png')}
                  style={s.privateImage}
                  resizeMode="cover"
                />
              </View>
              <View style={s.textContainer}>
                <Text style={s.privateTextBody}>{PRIVATE_TEXTE}</Text>
              </View>
            </View>

            {/* بطاقة الآية الكريمة */}
            <View style={s.verseCard}>
              <Text style={s.verseTitle}>
                وَفِي النِّهَايَةِ أَقُولُ كَمَا قَالَ اللهُ عَزَّ وَجَلَّ:
              </Text>
              <Text style={s.verseText}>
                ﴿وَقُلْ رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا﴾
              </Text>
            </View>

            
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 18,
  },
  hero: {
    backgroundColor: colors.greenDark,
    borderRadius: 28,
    padding: 26,
    alignItems: 'center',
    ...shadow.card,
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 8,
  },
  sub: {
    color: '#CDE0D7',
    fontSize: 12,
    marginTop: 4,
  },
  card: {
    marginTop: 16,
    borderRadius: 24,
    backgroundColor: colors.surface,
    padding: 20,
    ...shadow.soft,
  },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowText: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 12,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
  },
  value: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 3,
  },
  private: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  privateText: {
    color: colors.muted,
    fontSize: 13,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 22,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '900',
    color: colors.ink,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 13,
    color: colors.ink,
  },
  login: {
    marginTop: 12,
    borderRadius: 14,
    backgroundColor: colors.greenDark,
    padding: 14,
    alignItems: 'center',
  },
  loginText: {
    color: colors.white,
    fontWeight: '900',
  },
  cancel: {
    textAlign: 'center',
    color: colors.danger,
    marginTop: 14,
    fontWeight: '700',
  },
  privateScreen: {
    flex: 1,
    backgroundColor: '#F4F6F5',
  },
  modalHeaderBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    alignItems: 'flex-start',
  },
  closeButton: {
    padding: 8,
  },
  privateContent: {
    padding: 16,
    paddingBottom: 30,
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    ...shadow.soft,
  },
  
  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
  },
  imageWrapper: {
    borderRadius: 20,
    borderWidth: 3,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 18,
    width: '90%',
    height: 240,
  },
  privateImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
  },
  privateTextBody: {
    color: '#4A5568',
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'right',
  },
  verseCard: {
    backgroundColor: '#118A4E',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    marginBottom: 24,
  },
  verseTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 28,
  },
  verseText: {
    color: '#F1C40F',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 32,
  },
  footerBar: {
    backgroundColor: '#0E7541',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});