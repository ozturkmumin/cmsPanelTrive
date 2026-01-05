# Translation Manager API Documentation

Bu dokümantasyon, Translation Manager API endpoint'lerini açıklar. Tüm endpoint'ler CORS desteği ile çalışır ve JSON formatında veri döndürür.

## Base URL

**Production:**
```
https://cms-panel-trive.vercel.app/api/translations
```

**Development (Local):**
```
http://localhost:3000/api/translations
```

## Endpoints

### 1. Tüm Dilleri Listele

Tüm mevcut dilleri listeler.

**Endpoint:** `GET /api/translations`

**Response:**
```json
{
  "languages": ["en", "tr", "fr"]
}
```

**Örnek Kullanım:**
```javascript
// Production
fetch('https://cms-panel-trive.vercel.app/api/translations')
  .then(res => res.json())
  .then(data => console.log(data.languages))

// Development
fetch('http://localhost:3000/api/translations')
  .then(res => res.json())
  .then(data => console.log(data.languages))
```

---

### 2. Belirli Bir Dil İçin Tüm Çevirileri Getir

Belirtilen dil için tüm sayfaların çevirilerini döndürür.

**Endpoint:** `GET /api/translations/[lang]`

**Parametreler:**
- `lang` (path parameter): Dil kodu (örn: `en`, `tr`)

**Response:**
```json
{
  "home": {
    "title": "Welcome",
    "description": "Welcome to our site"
  },
  "about": {
    "title": "About Us"
  }
}
```

**Örnek Kullanım:**
```javascript
// Production - Türkçe çevirileri getir
fetch('https://cms-panel-trive.vercel.app/api/translations/tr')
  .then(res => res.json())
  .then(data => console.log(data))

// Production - İngilizce çevirileri getir
fetch('https://cms-panel-trive.vercel.app/api/translations/en')
  .then(res => res.json())
  .then(data => console.log(data))

// Development
fetch('http://localhost:3000/api/translations/tr')
  .then(res => res.json())
  .then(data => console.log(data))
```

**Hata Durumları:**
- `404`: Dil bulunamadı
- `500`: Sunucu hatası

---

### 3. Tüm Diller İçin Tüm Çevirileri Getir

Tüm diller için tüm çevirileri tek seferde getirir.

**Endpoint:** `GET /api/translations/all`

**Response:**
```json
{
  "en": {
    "home": {
      "title": "Welcome",
      "description": "Welcome to our site"
    }
  },
  "tr": {
    "home": {
      "title": "Hoş Geldiniz",
      "description": "Sitemize hoş geldiniz"
    }
  }
}
```

**Örnek Kullanım:**
```javascript
// Production
fetch('https://cms-panel-trive.vercel.app/api/translations/all')
  .then(res => res.json())
  .then(data => {
    console.log(data.en) // İngilizce çeviriler
    console.log(data.tr) // Türkçe çeviriler
  })

// Development
fetch('http://localhost:3000/api/translations/all')
  .then(res => res.json())
  .then(data => {
    console.log(data.en) // İngilizce çeviriler
    console.log(data.tr) // Türkçe çeviriler
  })
```

---

### 4. Belirli Bir Sayfa İçin Çevirileri Getir

Belirtilen sayfa için çevirileri getirir. Dil parametresi opsiyoneldir.

**Endpoint:** `GET /api/translations/page/[pageKey]`

**Parametreler:**
- `pageKey` (path parameter): Sayfa anahtarı (örn: `home`, `about`)
- `lang` (query parameter, opsiyonel): Dil kodu

**Örnek 1: Belirli bir dil için sayfa çevirileri**
```
GET /api/translations/page/home?lang=tr
```

**Response:**
```json
{
  "title": "Hoş Geldiniz",
  "description": "Sitemize hoş geldiniz"
}
```

**Örnek 2: Tüm diller için sayfa çevirileri**
```
GET /api/translations/page/home
```

**Response:**
```json
{
  "en": {
    "title": "Welcome",
    "description": "Welcome to our site"
  },
  "tr": {
    "title": "Hoş Geldiniz",
    "description": "Sitemize hoş geldiniz"
  }
}
```

**Örnek Kullanım:**
```javascript
// Production - Sadece Türkçe
fetch('https://cms-panel-trive.vercel.app/api/translations/page/home?lang=tr')
  .then(res => res.json())
  .then(data => console.log(data))

// Production - Tüm diller
fetch('https://cms-panel-trive.vercel.app/api/translations/page/home')
  .then(res => res.json())
  .then(data => console.log(data))

// Development
fetch('http://localhost:3000/api/translations/page/home?lang=tr')
  .then(res => res.json())
  .then(data => console.log(data))
```

**Hata Durumları:**
- `404`: Sayfa veya dil bulunamadı
- `500`: Sunucu hatası

---

## CORS Desteği

Tüm endpoint'ler CORS (Cross-Origin Resource Sharing) desteği ile çalışır. Herhangi bir domain'den istek yapabilirsiniz.

## Kullanım Örnekleri

### React/Next.js ile Kullanım

```typescript
// Hook olarak kullanım
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://cms-panel-trive.vercel.app/api/translations'
  : '/api/translations'

function useTranslations(lang: string) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch(`${API_BASE_URL}/${lang}`)
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
  }, [lang])
  
  return { data, loading }
}
```

### Vanilla JavaScript ile Kullanım

```javascript
const API_BASE_URL = 'https://cms-panel-trive.vercel.app/api/translations'

async function getTranslations(lang) {
  try {
    const response = await fetch(`${API_BASE_URL}/${lang}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching translations:', error)
    return null
  }
}

// Kullanım
const trTranslations = await getTranslations('tr')
console.log(trTranslations)
```

### Axios ile Kullanım

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://cms-panel-trive.vercel.app/api/translations'
})

// Türkçe çevirileri getir
const trData = await api.get('/tr')
console.log(trData.data)

// Tüm dilleri listele
const languages = await api.get('/')
console.log(languages.data.languages)
```

### cURL ile Test

```bash
# Production - Tüm dilleri listele
curl https://cms-panel-trive.vercel.app/api/translations

# Production - Türkçe çevirileri getir
curl https://cms-panel-trive.vercel.app/api/translations/tr

# Production - Tüm çevirileri getir
curl https://cms-panel-trive.vercel.app/api/translations/all

# Production - Belirli sayfa için çeviriler
curl https://cms-panel-trive.vercel.app/api/translations/page/home?lang=tr

# Development
curl http://localhost:3000/api/translations
curl http://localhost:3000/api/translations/tr
curl http://localhost:3000/api/translations/all
curl http://localhost:3000/api/translations/page/home?lang=tr
```

## Hata Yönetimi

Tüm endpoint'ler standart HTTP status kodları kullanır:

- `200`: Başarılı
- `404`: Kaynak bulunamadı (dil veya sayfa)
- `500`: Sunucu hatası

Hata durumlarında response formatı:
```json
{
  "error": "Error message",
  "message": "Detailed error message"
}
```

## Notlar

- Tüm dil kodları küçük harfe dönüştürülür
- Array'ler ve nested objeler desteklenir
- Tüm endpoint'ler GET metodunu kullanır
- CORS headers otomatik olarak eklenir
- Production URL: `https://cms-panel-trive.vercel.app`
- Tüm endpoint'ler herhangi bir domain'den erişilebilir (CORS: `*`)

## Hızlı Başlangıç

Production API'yi kullanmak için:

```javascript
const API_URL = 'https://cms-panel-trive.vercel.app/api/translations'

// Tüm dilleri listele
const languages = await fetch(`${API_URL}`).then(r => r.json())

// Türkçe çevirileri getir
const trTranslations = await fetch(`${API_URL}/tr`).then(r => r.json())

// Tüm çevirileri getir
const allTranslations = await fetch(`${API_URL}/all`).then(r => r.json())

// Belirli sayfa için çeviriler
const homePage = await fetch(`${API_URL}/page/home?lang=tr`).then(r => r.json())
```

## Canlı Test

Aşağıdaki linklerle API'yi doğrudan test edebilirsiniz:

- [Tüm Diller](https://cms-panel-trive.vercel.app/api/translations)
- [Türkçe Çeviriler](https://cms-panel-trive.vercel.app/api/translations/tr)
- [Tüm Çeviriler](https://cms-panel-trive.vercel.app/api/translations/all)
- [Home Sayfası - Türkçe](https://cms-panel-trive.vercel.app/api/translations/page/home?lang=tr)

