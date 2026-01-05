# Translation Manager - Next.js + Firebase

Modern bir çeviri yönetim uygulaması. Next.js 14, React, TypeScript, Tailwind CSS ve Firebase ile geliştirilmiştir.

## Özellikler

- ✅ Sayfa, Space ve Translation yönetimi
- ✅ Çoklu dil desteği
- ✅ JSON import/export
- ✅ Gerçek zamanlı arama
- ✅ Firebase Firestore entegrasyonu
- ✅ Firebase Authentication (Email/Password ve Google)
- ✅ Gerçek zamanlı veri senkronizasyonu
- ✅ Responsive tasarım

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Firebase yapılandırması:
   - Firebase Console'da projenizi oluşturun
   - Firestore Database'i etkinleştirin
   - Authentication'ı etkinleştirin (Email/Password ve Google)
   - `firestore.rules` dosyasını Firebase Console'a yükleyin

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## Firebase Kurulumu

### 1. Firestore Database
- Firebase Console > Firestore Database > Create Database
- Test mode veya Production mode seçin
- `firestore.rules` dosyasındaki kuralları kopyalayın

### 2. Authentication
- Firebase Console > Authentication > Get Started
- Sign-in method'ları etkinleştirin:
  - Email/Password
  - Google

### 3. Security Rules
Firestore Security Rules'ı Firebase Console'dan güncelleyin:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /settings/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Proje Yapısı

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Ana sayfa
│   └── globals.css         # Global stiller
├── components/
│   ├── AuthGuard.tsx       # Authentication guard
│   ├── Header.tsx          # Header bileşeni
│   ├── LoginModal.tsx      # Giriş modalı
│   ├── TranslationManager.tsx  # Ana yönetici
│   ├── TranslationTable.tsx    # Tablo bileşeni
│   └── modals/             # Modal bileşenleri
├── contexts/
│   └── TranslationContext.tsx  # State yönetimi
├── lib/
│   ├── firebase.ts         # Firebase yapılandırması
│   ├── firestore.ts        # Firestore servisleri
│   └── auth.ts             # Authentication servisleri
└── package.json
```

## Kullanım

1. **İlk Giriş**: Uygulama açıldığında giriş yapmanız istenir
2. **Dil Ekleme**: "Languages" butonundan dil ekleyin
3. **Sayfa Ekleme**: "+ Add Page" ile yeni sayfa oluşturun
4. **Translation Ekleme**: Her sayfa/space içinde "+ Add Translation" ile çeviri ekleyin
5. **JSON Export**: "Get JSON" ile çevirileri JSON formatında indirin
6. **JSON Import**: "Import JSON" ile mevcut çevirileri içe aktarın

## Veri Yapısı

Firestore'da veriler `settings/data` dokümanında saklanır:
```json
{
  "translations": {
    "pageKey": {
      "translations": {
        "key": {
          "en": "value",
          "tr": "değer"
        }
      },
      "spaces": {
        "spaceKey": { ... }
      }
    }
  },
  "languages": ["en", "tr"]
}
```

## Güvenlik

- Tüm Firestore işlemleri authentication gerektirir
- Kullanıcılar sadece kendi verilerine erişebilir (gelecekte multi-tenant desteği eklenebilir)
- Security Rules ile erişim kontrolü

## Geliştirme

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint
```

## Lisans

MIT

