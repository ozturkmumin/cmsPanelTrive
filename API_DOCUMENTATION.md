# Translation Manager API Documentation

Bu dokümantasyon, Translation Manager API endpoint'lerini açıklar. Tüm endpoint'ler CORS desteği ile çalışır ve JSON formatında veri döndürür.

## Base URL

```
http://localhost:3000/api/translations
```

Production için:
```
https://your-domain.com/api/translations
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
// Türkçe çevirileri getir
fetch('http://localhost:3000/api/translations/tr')
  .then(res => res.json())
  .then(data => console.log(data))

// İngilizce çevirileri getir
fetch('http://localhost:3000/api/translations/en')
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
// Sadece Türkçe
fetch('http://localhost:3000/api/translations/page/home?lang=tr')
  .then(res => res.json())
  .then(data => console.log(data))

// Tüm diller
fetch('http://localhost:3000/api/translations/page/home')
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
function useTranslations(lang: string) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch(`/api/translations/${lang}`)
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
async function getTranslations(lang) {
  try {
    const response = await fetch(`http://localhost:3000/api/translations/${lang}`)
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
  baseURL: 'http://localhost:3000/api/translations'
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
# Tüm dilleri listele
curl http://localhost:3000/api/translations

# Türkçe çevirileri getir
curl http://localhost:3000/api/translations/tr

# Tüm çevirileri getir
curl http://localhost:3000/api/translations/all

# Belirli sayfa için çeviriler
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

