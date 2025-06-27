# 🎯 Flashson - Modern Flashcard PWA

[![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen)](https://web.dev/progressive-web-apps/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

**Almanca-Türkçe Flashcard Uygulaması** - Tamamen tarayıcıda çalışan, modern ve kullanıcı dostu bir PWA (Progressive Web App).

## ✨ Özellikler

### 🎴 Flashcard İşlemleri
- **Kart Görüntüleme**: Ön/arka yüz çevirme animasyonu
- **Kart Ekleme**: Yeni kart ekleme modalı
- **Kart Silme**: Tek tıkla kart silme
- **Sayfa Yönetimi**: LF sayfaları arasında geçiş
- **Arama**: Anlık kart arama özelliği

### 📱 PWA Özellikleri
- **Ana Ekrana Ekleme**: Masaüstü uygulaması gibi kullanım
- **Offline Çalışma**: İnternet olmadan da kullanım
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- **Service Worker**: Arka plan senkronizasyonu

### 💾 Veri Yönetimi
- **Yerel Depolama**: db.json dosyası ile veri saklama
- **File System Access API**: Modern dosya erişimi
- **Otomatik Kaydetme**: Değişikliklerin anında kaydedilmesi

### 🖨️ Dışa Aktarma
- **PDF/Print**: Kartları yazdırma ve PDF olarak dışa aktarma
- **Yüksek Kalite**: 3x scale ile net görüntü

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Modern tarayıcı (Chrome 86+, Edge 86+, Firefox 85+)
- File System Access API desteği
- Yerel web sunucusu (geliştirme için)

### Kurulum

1. **Projeyi klonlayın**
   ```bash
   git clone https://github.com/kullaniciadi/flashson.git
   cd flashson
   ```

2. **Yerel sunucu başlatın**
   ```bash
   # Python 3 ile
   python3 -m http.server 8000
   
   # veya Node.js ile
   npx serve -l 8000
   
   # veya Live Server (VSCode) kullanın
   ```

3. **Tarayıcıda açın**
   ```
   http://localhost:8000/public/index.html
   ```

4. **db.json dosyası seçin**
   - İlk açılışta "db.json seç / ekle" butonuna tıklayın
   - Mevcut db.json dosyanızı seçin veya yeni oluşturun

## 📁 Proje Yapısı

```
flashson/
├── public/                 # Statik dosyalar
│   ├── index.html         # Ana HTML dosyası
│   ├── manifest.json      # PWA manifest
│   ├── favicon.ico        # Site ikonu
│   └── icons/             # PWA ikonları
├── src/                   # Kaynak kodlar
│   ├── app.js            # Uygulama giriş noktası
│   ├── ui.js             # UI ve event handler'lar
│   ├── flashcard.js      # Kart işlemleri
│   ├── fileSystem.js     # Dosya sistemi işlemleri
│   ├── modal.js          # Modal yönetimi
│   ├── storage.js        # State yönetimi
│   └── style.css         # Stil dosyası
├── locales/              # Dil dosyaları (gelecek)
├── db.json              # Örnek veri dosyası
└── README.md            # Bu dosya
```

## 🎮 Kullanım

### İlk Kurulum
1. Uygulamayı açın
2. "db.json seç / ekle" butonuna tıklayın
3. Mevcut db.json dosyanızı seçin veya yeni oluşturun
4. LF sayfalarınız otomatik olarak yüklenecek

### Kart Yönetimi
- **Kart Ekleme**: Hamburger menü → "Ekle" butonu
- **Kart Silme**: Kart üzerindeki silme butonu (çöp kutusu)
- **Kart Gezme**: İleri/geri butonları veya kart tıklama
- **Sayfa Değiştirme**: Dropdown menüden sayfa seçimi

### Arama
- Arama kutusuna Almanca kelime yazın
- Eşleşen kart otomatik olarak gösterilir
- Arama kutusunu temizleyerek tüm kartlara dönün

### Dışa Aktarma
- Hamburger menü → "PDF Dışa Aktar"
- Kartlar hazırlanır ve yazdırma penceresi açılır
- PDF olarak kaydedebilir veya yazdırabilirsiniz

## 🔧 Geliştirme

### Modüler Yapı
Proje ES6 modülleri kullanarak organize edilmiştir:
- **app.js**: Uygulama başlatıcı
- **ui.js**: UI event handler'ları
- **flashcard.js**: Kart işlemleri
- **fileSystem.js**: Dosya sistemi API
- **modal.js**: Modal yönetimi
- **storage.js**: State yönetimi

### Yeni Özellik Ekleme
1. İlgili modül dosyasını düzenleyin
2. State güncellemelerini `storage.js`'de yapın
3. Event handler'ları `ui.js`'de bağlayın
4. Test edin ve dokümantasyonu güncelleyin

## 🌐 GitHub Pages Deployment

GitHub Pages'te yayınlamak için:

1. **Repository ayarlarına gidin**
   - Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main` veya `master`
   - Folder: `/ (root)`

2. **public/index.html otomatik olarak ana sayfa olacak**

3. **URL formatı:**
   ```
   https://kullaniciadi.github.io/flashson/
   ```

### ⚠️ GitHub Pages Kısıtlamaları

**File System Access API** GitHub Pages'te çalışmayabilir. Bu durumda:

- **Yerel geliştirme** için Live Server kullanın
- **Production** için Netlify, Vercel gibi modern hosting servisleri önerilir
- **Demo amaçlı** kullanım için alternatif çözümler geliştirilebilir

### 🚀 Alternatif Hosting

#### Netlify ile Deploy
```bash
# Netlify CLI kurulumu
npm install -g netlify-cli

# Deploy
netlify deploy --dir=public --prod
```

#### Vercel ile Deploy
```bash
# Vercel CLI kurulumu
npm install -g vercel

# Deploy
vercel --prod
```

## 📋 db.json Formatı

```json
{
  "LF1": [
    {
      "bir": "substantiv",
      "bir_iki": "#LF1",
      "bir_uc_artikel": "die",
      "bir_uc": "Gestaltung",
      "bir_dort": "Gestaltung des Materialflusses",
      "iki": "isim",
      "iki_iki": "biçimlendirme, şekil verme",
      "iki_uc": "Malzeme akışının tasarımı"
    }
  ],
  "LF2": [
    // Diğer kartlar...
  ]
}
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)
- [html2canvas](https://html2canvas.hertzen.com/) - PDF dışa aktarma için
- [Material Icons](https://fonts.google.com/icons) - İkonlar için

## 📞 İletişim

- **GitHub**: [@kullaniciadi](https://github.com/kullaniciadi)
- **Proje Linki**: [https://github.com/kullaniciadi/flashson](https://github.com/kullaniciadi/flashson)

---

⭐ **Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**
