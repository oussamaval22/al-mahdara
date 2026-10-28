# المحظرة — تطبيق القرآن الكريم

## التقنية
- Expo SDK 57
- React Native 0.86
- React 19.2
- TypeScript
- React Navigation 7
- expo-audio 57
- react-native-safe-area-context

## أهم الإصلاحات في هذه النسخة
- إصلاح الشريط السفلي في قارئ المصحف حتى لا يدخل تحت أزرار Android أو Home Indicator في iPhone.
- إضافة مساحة للمحتوى حتى لا تغطي أزرار الحفظ والفهرس والاستماع آخر صورة من المصحف.
- إصلاح إعدادات أيقونة التطبيق لـ Android وiOS، بما فيها Android Adaptive Icon وMonochrome Icon.
- إبقاء أيقونة التطبيق 1024×1024 PNG كمصدر أساسي للبناء.
- تحميل Ionicons قبل إظهار الواجهة حتى لا تظهر الأيقونات فارغة عند بداية التشغيل.
- استمرار حفظ المسبحة والصفحات المحفوظة محليًا.
- صور المصحف المحلية لها الأولوية. وإذا لم تكن ملفات الصور موجودة في المشروع، يستخدم القارئ رابط صور صفحات عام كحل احتياطي بدل عرض شاشة فارغة.

## التشغيل
```bash
npm install
npm run generate:quran-images
npx expo start -c
```

## صور المصحف
ضع صور المصحف داخل:
`assets/quran_image/`

بالأسماء:
`1.png` إلى `604.png`

ثم نفّذ:
```bash
npm run generate:quran-images
```

إذا لم تكن الصور المحلية موجودة، يستطيع القارئ استخدام الصور الاحتياطية عبر الإنترنت. للحصول على عمل كامل دون إنترنت، يجب توفير ملفات `1.png` إلى `604.png` داخل `assets/quran_image/`.

## البيانات
يستخدم التطبيق:
- `data/mainDataQuran.json`
- `data/pagesQuran.json`

ومن `mainDataQuran.json` يتم استخدام:
- `number`
- `name.ar`
- `revelation_place.ar`
- `verses[].text.ar`
- `verses[].page`
- `audio[].reciter.ar`
- `audio[].rewaya.ar`
- `audio[].link`

## الأيقونة
الأيقونة الأساسية:
`assets/icon.png`

وأيقونة Android التكيفية:
`assets/adaptive-icon-foreground.png`

بعد تغيير الأيقونة يجب إعادة بناء التطبيق؛ تحديث Metro/Hot Reload وحده لا يغيّر أيقونة التطبيق المثبتة على الهاتف.

## البناء
لـ Android/iOS باستخدام EAS:
```bash
npx eas build --platform android --profile production
npx eas build --platform ios --profile production
```

هذه النسخة تستهدف الأجهزة الحديثة ضمن متطلبات Expo SDK 57، لكن لا يمكن ضمان كل جهاز أو نظام تشغيل فعليًا من دون بناء وتشغيل على أجهزة الاختبار نفسها.
