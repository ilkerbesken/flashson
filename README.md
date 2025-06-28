# Flashson - Almanca Türkçe Kelime Kartları

Modern, profesyonel ve kullanıcı dostu bir PWA (Progressive Web App) flashcard uygulaması. Almanca-Türkçe kelime kartları oluşturun, çalışın ve PDF olarak dışa aktarın.

## 🌟 Özellikler

### 📚 Temel Özellikler
- **Yerel Dosya Sistemi**: File System Access API ile JSON dosyaları ile çalışma
- **Responsive Design**: Tüm cihazlarda mükemmel görünüm
- **PWA Desteği**: Masaüstüne ekleme, offline çalışma
- **Modern UI/UX**: Material Design ilkeleri ile tasarlanmış arayüz

### 🎯 Flashcard Özellikleri
- **Çift Yönlü Çalışma**: Almanca → Türkçe / Türkçe → Almanca
- **Akıllı Arama**: Anlık filtreleme ve arama
- **Kart Çevirme**: Tıklama ile kart çevirme
- **Navigasyon**: Klavye ve fare ile kolay gezinme
- **PDF Export**: Yüksek kaliteli PDF çıktısı
- **Deste Yönetimi**: Yeni desteler oluşturma ve yönetme

### 📁 Veri Yönetimi
- **JSON Formatı**: Standart JSON dosya formatı
- **Otomatik Kaydetme**: Değişikliklerin otomatik kaydedilmesi
- **Dosya Hatırlama**: Son kullanılan dosyanın hatırlanması
- **Çoklu Deste**: deste1, deste2, deste3... gibi deste organizasyonu

### 🔧 Gelişmiş Özellikler
- **Hata Yönetimi**: Kapsamlı hata yakalama ve kullanıcı bildirimleri
- **Keyboard Shortcuts**: Klavye kısayolları
- **Accessibility**: Erişilebilirlik desteği

## 🚀 Kurulum

### Gereksinimler
- Modern tarayıcı (Chrome 86+, Edge 86+, Opera 72+)
- File System Access API desteği
- HTTPS (PWA özellikleri için)

### Yerel Geliştirme
```bash
# Projeyi klonlayın
git clone https://github.com/ilkerbesken/flashson.git
cd flashson

# Basit HTTP sunucusu başlatın
python -m http.server 8000
# veya
npx serve .

# Tarayıcıda açın
open http://localhost:8000
```

### GitHub Pages
Proje GitHub Pages ile otomatik olarak yayınlanabilir:
1. Repository'yi GitHub'a push edin
2. Settings > Pages > Source: Deploy from a branch
3. Branch: main, folder: / (root)
4. Save

## 📖 Kullanım

### İlk Kullanım
1. Uygulamayı açın
2. "db.json seç / ekle" butonuna tıklayın
3. Mevcut JSON dosyası seçin veya yeni dosya oluşturun
4. Deste seçin (deste1, deste2, vb.)

### Kart Ekleme
1. Menüden "Kart Ekle" butonuna tıklayın
2. Formu doldurun:
   - **Almanca Tarafı**: Kelime türü, kelime, artikel, örnek cümle
   - **Türkçe Tarafı**: Kelime türü, anlam, örnek cümle
3. "Ekle" butonuna tıklayın

### Deste Ekleme
1. Menüden "Deste Ekle" butonuna tıklayın
2. Yeni deste adını girin
3. "Ekle" butonuna tıklayın
4. Eğer aynı isimde deste varsa uyarı alırsınız

### Kart Çalışma
- **Çevirme**: Karta tıklayarak çevirin
- **Dil Değiştirme**: Toggle ile varsayılan dili değiştirin
- **Navigasyon**: Ok tuşları veya butonlarla gezinin
- **Arama**: Arama kutusuna yazarak filtreleyin

### PDF Dışa Aktarma
1. Menüden "PDF Dışa Aktar" butonuna tıklayın
2. Kartlar hazırlanırken bekleyin
3. Yazdırma penceresi açılacak
4. PDF olarak kaydedin

## 🏗️ Proje Yapısı

```
flashson/
├── index.html              # Ana HTML dosyası
├── style.css               # Ana CSS dosyası
├── script.js               # Ana JavaScript dosyası
├── manifest.json           # PWA manifest
├── service-worker.js       # Service Worker
├── db.json                 # Örnek veritabanı
├── icon-*.png              # PWA ikonları
├── favicon.ico             # Favicon
└── README.md
```

## 🔧 Teknik Detaylar

### PWA Özellikleri
- **Service Worker**: Offline çalışma ve cache yönetimi
- **Web App Manifest**: Masaüstü uygulama deneyimi
- **Install Prompt**: Masaüstüne ekleme

### File System Access API
- **Yerel Dosya Erişimi**: Güvenli dosya sistemi erişimi
- **JSON Formatı**: Standart veri formatı
- **Otomatik Kaydetme**: Değişikliklerin anında kaydedilmesi

### Performans
- **Lazy Loading**: Gerektiğinde yükleme
- **Memory Management**: Bellek sızıntısı önleme
- **Optimized Rendering**: Optimize edilmiş kart render etme

## 🛠️ Geliştirme

### Kod Standartları
- **Modern JavaScript**: ES6+ özellikleri
- **Clean Code**: Temiz ve okunabilir kod
- **Comments**: Açıklayıcı yorumlar

### Deployment
- **GitHub Pages**: Otomatik deployment
- **Static Hosting**: Statik dosya dağıtımı
- **Versioning**: Semantic versioning

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

### Geliştirme Kuralları
- Kod standartlarına uyun
- Test yazın
- Dokümantasyon güncelleyin
- Commit mesajları açıklayıcı olsun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- [Material Icons](https://fonts.google.com/icons) - İkonlar
- [jsPDF](https://github.com/parallax/jsPDF) - PDF oluşturma
- [html2canvas](https://github.com/niklasvh/html2canvas) - HTML to Canvas
- [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) - Dosya sistemi erişimi

## 📞 İletişim

- **GitHub**: [@ilkerbesken](https://github.com/ilkerbesken)
- **Email**: ilkerbesken@gmail.com

## 🔄 Changelog

### v2.1.0 (2024-01-XX)
- ✨ Deste ekleme özelliği eklendi
- ✨ Yerel dosya sistemi entegrasyonu
- ✨ Modern UI/UX tasarımı
- ✨ Gelişmiş hata yönetimi
- ✨ Performance optimizasyonları

### v2.0.0 (2024-01-XX)
- ✨ PWA özellikleri eklendi
- ✨ File System Access API entegrasyonu
- ✨ JSON tabanlı veri yönetimi
- ✨ Modern arayüz tasarımı

### v1.0.0 (2025-06-28)
- 🎉 İlk sürüm
- ✨ Temel flashcard işlevselliği
- ✨ Google Sheets entegrasyonu

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
