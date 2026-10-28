# إصلاحات النسخة

- إصلاح خطأ `Failed to activate lock screen controls - service binding failed` عند التشغيل داخل Expo Go.
- تشغيل background/lock-screen controls فقط في Standalone/Development Build، لأن Expo Go لا يطبق خدمة `AudioControlsService` الخاصة بـ expo-audio.
- إصلاح تحميل Ionicons عبر `@expo/vector-icons` مع preload بواسطة `useFonts` حتى لا تظهر الأيقونات فارغة في أول تشغيل.
- قارئ المصحف: الضغط على الصفحة يظهر/يخفي شريطًا سفليًا يحتوي على:
  - حفظ الصفحة
  - الذهاب إلى الفهرس
  - الذهاب إلى الاستماع
- حفظ الصفحات مستقل عن حفظ السور ويستمر بعد إغلاق التطبيق باستخدام AsyncStorage.

## التشغيل

npm install
npx expo start -c

للتشغيل مع background audio وlock screen الحقيقيين، استخدم Development Build أو EAS Build، وليس Expo Go.

## إضافات هذه النسخة

- إصلاح شريط أزرار قارئ المصحف ليحترم مساحة أزرار/إيماءات Android وHome Indicator في iPhone باستخدام `useSafeAreaInsets`.
- إضافة مساحة أسفل صورة المصحف حتى لا يغطيها الشريط السفلي.
- إصلاح أيقونة Android Adaptive Icon وإضافة `android.icon` و`ios.icon` بشكل صريح.
- إضافة fallback لصور المصحف من `cdn.myquran.com` إذا لم تكن صور `assets/quran_image/1.png ... 604.png` موجودة محليًا. عند وضع الصور المحلية وتشغيل `npm run generate:quran-images` تصبح الصور المحلية هي المصدر الأول.
