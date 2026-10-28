# التعديل الأخير - صفحة الاستفسار وشريط Android

- في صفحة الاستفسار، الضغط على «خاص» يفتح خانة كلمة السر.
- كلمة السر المطلوبة هي: `22240838`.
- عند إدخالها بشكل صحيح تظهر نافذة خاصة تحتوي على الصورة الموجودة حاليًا في `assets/icon.png` ثم النص المطلوب أسفلها.
- إذا كنت تقصد صورة أخرى غير `assets/icon.png`، ضع الصورة المطلوبة في مجلد `assets` وغيّر سطر `require('../../assets/icon.png')` في `src/screens/InquiryScreen.tsx` إلى اسم الصورة الجديدة.
- شريط تنقل Android يبدأ مخفيًا، ومع `overlay-swipe` يستطيع المستخدم إظهاره مؤقتًا بالسحب من أسفل الشاشة إلى أعلى، دون أن يعيد التطبيق تحريك محتواه.
- هذا الإعداد عالمي في `App.tsx`، مع إعداد `expo-navigation-bar` في `app.json`.

## التشغيل

```bash
npm install
npx expo start -c
```

ثم افتح المشروع في Expo Go وامسح QR، أو استخدم:

```bash
npx expo start --android
```

ولإنشاء نسخة Android أصلية بعد تغييرات `app.json`:

```bash
npx expo prebuild --clean
npx expo run:android
```
