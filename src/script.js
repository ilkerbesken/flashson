
    // ===== CONSTANTS & VARIABLES =====
        const SCRIPT_URL = '<?!= scriptUrl ?>';
        const LAST_SELECTED_SHEET_KEY = 'flashcards_lastSelectedSheet';

        // DOM Elements
        const cardsContainer = document.getElementById('flashcards');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const hamburgerIcon = document.getElementById('hamburgerIcon');
        const menuContent = document.getElementById('menuContent');
        const exportPdfBtn = document.getElementById('exportPdf');
        const goToSheetBtn = document.getElementById('goToSheetBtn');
        const cardCounter = document.getElementById('cardCounter');
        const toggleSwitch = document.getElementById('toggleSwitch');
        const sheetSelector = document.getElementById('sheetSelector');
        const searchInput = document.getElementById('searchInput');




        // Application State
        let currentCardIndex = 0;
        let flashcardsData = [];
        let isFlippedToTr = false;
        let isFlippedByToggle = false;
        let sheetGids = {};
        let searchTimeout = null;

        // ===== yenileme =====
        let lastKnownTimestamp = '';

        // ===== UTILITY FUNCTIONS =====
        const getCardDataCacheKey = () => `flashcardsData_${currentSheetName}`;
        const getCardFlipStateKey = (index) => `cardFlipState_${currentSheetName}_${index}`;



        // ===== DATA MANAGEMENT =====
        // Eski Google Sheets ve Apps Script fonksiyonları tamamen kaldırıldı.
        // Sadece db.json ile çalışan kodlar kullanılacak.

        // document.addEventListener('DOMContentLoaded', loadSheetNamesAndInitialize); // KALDIRILDI

        // checkForUpdates, handleRefresh, fetchData, initializeAppForSheet, handleSheetNamesSuccess, handleSheetNamesError gibi fonksiyonlar ve google.script.run ile ilgili tüm kodlar KALDIRILDI

        // ===== CARD RENDERING & INTERACTION =====
        function renderFlashcardsFromDb() {
            cardsContainer.innerHTML = '';
          if (!dbData[currentSheetName] || dbData[currentSheetName].length === 0) {
                cardCounter.textContent = '0 / 0';
                cardsContainer.innerHTML = `<p>Bu sayfada ('${currentSheetName || 'N/A'}') gösterilecek kart bulunamadı.</p>`;
                prevBtn.disabled = true;
                nextBtn.disabled = true;
                exportPdfBtn.disabled = true;
                return;
            }
            prevBtn.disabled = false;
            nextBtn.disabled = false;
            exportPdfBtn.disabled = false;
          flashcardsData = dbData[currentSheetName];
          currentCardIndex = Math.min(currentCardIndex, flashcardsData.length - 1);
          if (currentCardIndex < 0 && flashcardsData.length > 0) currentCardIndex = 0;
            flashcardsData.forEach((data, index) => {
                const flashcard = document.createElement('div');
                flashcard.className = 'flashcard';
                flashcard.dataset.index = index;
                flashcard.innerHTML = `
                    <div class="card-inner">
                        <div class="card-front">
                            <div class="bir">${data.bir || ''}</div>
                            <div class="bir_iki">${data.bir_iki || ''}</div>
                          <div class="bottom-content-area"> 
                            <div class="bir_uc_container">
                                <div class="bir_uc_artikel">${data.bir_uc_artikel || ''}</div>
                                <div class="bir_uc">${data.bir_uc || ''}</div>
                            </div>
                            <div class="bir_dort">${data.bir_dort || ''}</div>
                          </div>
                        </div>
                        <div class="card-back">
                            <div class="iki">${data.iki || ''}</div>
                            <div class="content-back">
                                <div class="iki_iki">${data.iki_iki || ''}</div>
                                <div class="iki_uc">${data.iki_uc || ''}</div>
                            </div>
                        </div>
                    </div>`;
                flashcard.addEventListener('click', () => flipCard(flashcard));
                cardsContainer.appendChild(flashcard);
            });
            if (flashcardsData.length > 0) {
                showCard(currentCardIndex);
            } else {
                updateCounter(-1);
            }
        }

        function showCard(index) {
            document.querySelectorAll('.flashcard').forEach((card, i) => {
                card.classList.toggle('active', i === index);
            });
            const activeCard = document.querySelector('.flashcard.active .card-inner');
            if (activeCard) {
            isFlippedToTr = toggleSwitch.checked;
                activeCard.style.transform = isFlippedToTr ? 'rotateY(180deg)' : 'rotateY(0deg)';
            }
            updateCounter(index);
        }

        function flipCard(cardElement) {
            const innerCard = cardElement.querySelector('.card-inner');
            const isCurrentlyFlipped = innerCard.style.transform === 'rotateY(180deg)';
            innerCard.style.transform = isCurrentlyFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)';
            isFlippedToTr = !isCurrentlyFlipped;
            isFlippedByToggle = false;
        }

        function toggleAllCardsLanguage() {
            isFlippedToTr = toggleSwitch.checked;
            isFlippedByToggle = true;
            const activeCardInner = document.querySelector('.flashcard.active .card-inner');
            if (activeCardInner) {
                activeCardInner.style.transform = isFlippedToTr ? 'rotateY(180deg)' : 'rotateY(0deg)';
            }
        }

        function changeCard(direction) {
            if (flashcardsData.length === 0) return;
            currentCardIndex = (currentCardIndex + direction + flashcardsData.length) % flashcardsData.length;
          isFlippedToTr = toggleSwitch.checked;
          isFlippedByToggle = true;
            showCard(currentCardIndex);
        }

        function updateCounter(index) {
            if (flashcardsData.length === 0 || index < 0) {
                cardCounter.textContent = `0 / 0`;
            } else {
                cardCounter.textContent = `${index + 1} / ${flashcardsData.length}`;
            }
        }

        // ===== PRINT/PDF FUNCTIONALITY =====
        async function exportToPrint() {
            const printArea = document.getElementById('print-area');
            const overlay = document.getElementById('print-overlay');
            if (!printArea || !overlay) {
                console.error('Gerekli HTML elementleri bulunamadı.');
                alert('Yazdırma için gerekli HTML elementleri bulunamadı.');
                return;
            }
            overlay.style.display = 'flex';
            printArea.innerHTML = '';
            const originalCardIndex = currentCardIndex;
            try {
                for (let i = 0; i < flashcardsData.length; i++) {
                    overlay.innerHTML = `Kart ${i + 1} / ${flashcardsData.length} hazırlanıyor...<br><small>Lütfen bekleyin.</small>`;
                    showCard(i);
                    await new Promise(resolve => setTimeout(resolve, 150));
                    const cardElement = document.querySelector(`.flashcard[data-index='${i}']`);
                    if (!cardElement) {
                        console.warn(`Dışa aktarma için kart [data-index='${i}'] bulunamadı.`);
                        continue;
                    }
                    const frontElement = cardElement.querySelector('.card-front');
                    const backElement = cardElement.querySelector('.card-back');
                    if (!frontElement || !backElement) {
                        console.warn(`Kart [data-index='${i}'] için ön veya arka yüz bulunamadı.`);
                        continue;
                    }
                    const frontCanvas = await html2canvas(frontElement, { scale: 3, useCORS: true, logging: false });
                    const frontImage = document.createElement('img');
                    frontImage.className = 'print-image';
                    frontImage.src = frontCanvas.toDataURL('image/png', 1.0);
                    const backCanvas = await html2canvas(backElement, { scale: 3, useCORS: true, logging: false });
                    const backImage = document.createElement('img');
                    backImage.className = 'print-image mirror-x';
                    backImage.src = backCanvas.toDataURL('image/png', 1.0);
                    printArea.appendChild(frontImage);
                    printArea.appendChild(backImage);
                }
                if (printArea.children.length === 0) {
                    throw new Error(flashcardsData.length > 0 ? 
                        "Kart resimleri oluşturulamadı, yazdırma alanı boş." : 
                        "Yazdırılacak kart bulunmuyor.");
                }
                overlay.innerHTML = "Yazdırma penceresi açılıyor...";
                await new Promise(res => setTimeout(res, 500));
                window.print();
            } catch (error) {
                console.error("Yazdırma hazırlığı sırasında kritik hata:", error);
                alert("Baskı hazırlanırken bir hata oluştu. Lütfen konsolu kontrol edin. Hata: " + error.message);
            } finally {
                overlay.style.display = 'none';
                if (flashcardsData.length > 0) {
                    showCard(originalCardIndex);
                } else {
                    updateCounter(-1);
                }
            }
        }

        function goToGoogleSheets() {
            const selectedSheetName = sheetSelector.value;
            const selectedSheetGid = sheetGids[selectedSheetName];

            if (!selectedSheetName) {
                alert("Lütfen önce bir sayfa seçin.");
                return;
            }

            if (typeof selectedSheetGid === 'undefined') {
                alert(`Seçili sayfa "${selectedSheetName}" için GID bulunamadı. Lütfen sayfayı yenileyin.`);
                console.error("GID bulunamadı:", selectedSheetName, sheetGids);
                return;
            }

          // google.script.run
          //     .withSuccessHandler(handleSheetUrlSuccess)
          //     .withFailureHandler(handleSheetUrlError)
          //     .getSpreadsheetPageUrlGs(selectedSheetGid);
        }

        function handleSheetUrlSuccess(response) {
            if (response.success && response.url) {
                window.open(response.url, '_blank');
            } else {
                alert("Google Sheets URL'i alınamadı." + (response.error ? " Hata: " + response.error : ""));
            }
        }

        function handleSheetUrlError(error) {
            console.error('Google Sheets URL\'i alınamadı:', error);
            alert("Google Sheets URL'i alınamadı. Lütfen sayfayı yenileyin.");
        }

        // ===== EVENT LISTENERS =====
        sheetSelector.addEventListener('change', function() {
            currentSheetName = this.value;
            localStorage.setItem('lastSelectedSheet', currentSheetName);
            renderFlashcardsFromDb();
            menuContent.classList.remove('show');
            hamburgerIcon.classList.remove('active');
        });

        prevBtn.addEventListener('click', () => changeCard(-1));
        nextBtn.addEventListener('click', () => changeCard(1));
        toggleSwitch.addEventListener('change', toggleAllCardsLanguage);

        hamburgerIcon.addEventListener('click', () => {
            menuContent.classList.toggle('show');
            hamburgerIcon.classList.toggle('active');
        });

        exportPdfBtn.addEventListener('click', async () => {
            if (flashcardsData.length === 0) {
                alert("Dışa aktarılacak kart bulunmamaktadır.");
                menuContent.classList.remove('show');
                hamburgerIcon.classList.remove('active');
                return;
            }
            const originalText = exportPdfBtn.textContent;
            exportPdfBtn.textContent = 'Hazırlanıyor...';
            exportPdfBtn.disabled = true;

            try {
                await exportToPrint();
            } catch (error) {
                console.error("exportPdfBtn tıklama hatası:", error);
                alert("PDF oluşturulurken bir hata oluştu. Konsolu kontrol edin.");
            } finally {
                exportPdfBtn.textContent = originalText;
                if (flashcardsData.length > 0) {
                    exportPdfBtn.disabled = false;
                }
                menuContent.classList.remove('show');
                hamburgerIcon.classList.remove('active');
            }
        });

        goToSheetBtn.addEventListener('click', () => {
          showAddCardModal();
            menuContent.classList.remove('show');
            hamburgerIcon.classList.remove('active');
        });

        document.addEventListener('click', (event) => {
            if (!menuContent.contains(event.target) && !hamburgerIcon.contains(event.target)) {
                menuContent.classList.remove('show');
                hamburgerIcon.classList.remove('active');
            }
        });

        // ===== SEARCH FUNCTIONALITY =====
        function searchCards(query) {
            if (!query.trim()) {
                // Arama sorgusu boşsa, mevcut kartı göster
            renderFlashcardsFromDb();
                showCard(currentCardIndex);
                return;
            }

            query = query.toLowerCase();
            const foundIndex = flashcardsData.findIndex(card => 
                card.bir_uc.toLowerCase().includes(query)
            );

            if (foundIndex !== -1) {
                currentCardIndex = foundIndex;
                showCard(currentCardIndex);
            } else {
                // Eşleşme bulunamadı mesajı göster
                cardsContainer.innerHTML = `<p>Arama sonucu bulunamadı: "${query}"</p>`;
                cardCounter.textContent = '0 / 0';
            }
        }

        // Arama input event listener
        searchInput.addEventListener('input', (e) => {
            // Önceki timeout'u temizle
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }

            // Yeni bir timeout başlat (300ms debounce)
            searchTimeout = setTimeout(() => {
                searchCards(e.target.value);
            }, 300);
        });

        // Enter tuşuna basıldığında aramayı tetikle
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchCards(e.target.value);
            }
        });

        // Arama çubuğuna tıklandığında içeriği temizle ve mevcut kartı göster
        searchInput.addEventListener('click', (e) => {
            e.target.value = '';
          renderFlashcardsFromDb();
            showCard(currentCardIndex);
        });



        

        // Initialize the application
        // document.addEventListener('DOMContentLoaded', loadSheetNamesAndInitialize);


       function checkForUpdates() {
    // google.script.run.withSuccessHandler(serverTimestamp => {
    //     if (serverTimestamp && serverTimestamp !== lastKnownTimestamp) {
    //         lastKnownTimestamp = serverTimestamp;
    //         if (currentSheetName) {
    //             localStorage.removeItem(getCardDataCacheKey());
    //             flashcardsData = [];
    //             currentCardIndex = 0;
    //             cardsContainer.innerHTML = `<p>Yeni veriler alınıyor (${currentSheetName})...</p>`;
    //             cardCounter.textContent = '0 / 0';
    //             fetchData();
    //         }
    //     }
    // }).getLastUpdateTimestamp();
}



function handleRefresh() {
    document.getElementById('updateAlert').style.display = 'none';

    // Yeni zaman damgasını güncelle
    // google.script.run.withSuccessHandler(ts => {
    //     lastKnownTimestamp = ts || '';
    // }).getLastUpdateTimestamp();

    if (currentSheetName) {
        // localStorage.removeItem(getCardDataCacheKey());
        flashcardsData = [];
        currentCardIndex = 0;
        cardsContainer.innerHTML = `<p>Veriler yenileniyor (${currentSheetName})...</p>`;
        cardCounter.textContent = '0 / 0';
        // fetchData();
    }
}


// Sayfa açıldıktan sonra periyodik kontrol başlat
// document.addEventListener('DOMContentLoaded', () => {
//     google.script.run.withSuccessHandler(ts => {
//         lastKnownTimestamp = ts || '';
//     }).getLastUpdateTimestamp();

//     setInterval(checkForUpdates, 10000); // 10 saniyede bir kontrol
// });

// 1. File System Access API ile db.json seçme/oluşturma
let dbFileHandle = null;
let dbData = {};
let dbFileName = 'db.json';
let currentSheetName = '';

const dbJsonSelectorContainer = document.getElementById('dbJsonSelectorContainer');
const selectDbJsonBtn = document.getElementById('selectDbJsonBtn');
const dbJsonSelectorInfo = document.getElementById('dbJsonSelectorInfo');
const addCardModal = document.getElementById('addCardModal');
const addCardForm = document.getElementById('addCardForm');
const cancelAddCardBtn = document.getElementById('cancelAddCardBtn');

// File System Access API destek kontrolü
const supportsFS = 'showOpenFilePicker' in window && 'showSaveFilePicker' in window;

function showDbJsonSelector(message = '') {
  dbJsonSelectorContainer.style.display = 'block';
  dbJsonSelectorInfo.textContent = message || 'Lütfen bir db.json dosyası seçin veya oluşturun.';
  const lastDbName = localStorage.getItem(LAST_DB_FILE_KEY);
  if (lastDbName) {
    lastDbFileInfo.textContent = `Son kullanılan dosya: ${lastDbName}`;
    lastDbFileInfo.style.display = 'block';
  } else if (lastDbFileInfo) {
    lastDbFileInfo.style.display = 'none';
  }
}

function hideDbJsonSelector() {
  dbJsonSelectorContainer.style.display = 'none';
}

// Son kullanılan dosya adını localStorage'da saklamak için anahtar
const LAST_DB_FILE_KEY = 'lastDbJsonFileName';

// Hoşgeldiniz modalı ekle
const welcomeModal = document.createElement('div');
welcomeModal.id = 'welcomeModal';
welcomeModal.style = `
  display: none;
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.65);
  z-index: 4000;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
welcomeModal.innerHTML = `
  <div style="background: #fff; padding: 44px 32px 36px 32px; border-radius: 22px; min-width: 320px; max-width: 90vw; box-shadow: 0 8px 32px rgba(0,0,0,0.25); display: flex; flex-direction: column; align-items: center;">
    <h2 style="font-size: 2rem; color: #222; margin-bottom: 18px; text-align:center;">Hoşgeldiniz!</h2>
    <div style="font-size: 1.1rem; color: #666; margin-bottom: 28px; text-align:center;">Başlamak için bir db.json dosyası seçin veya oluşturun.</div>
    <button id="welcomeSelectDbJsonBtn" style="font-size: 1.25rem; padding: 18px 40px; border-radius: 12px; border: none; background: #222; color: #fff; cursor: pointer; font-weight: 700; margin-bottom: 8px; width: 100%; max-width: 320px;">db.json seç / ekle</button>
  </div>
`;
document.body.appendChild(welcomeModal);
const welcomeSelectDbJsonBtn = document.getElementById('welcomeSelectDbJsonBtn');

// Uygulama başlatıcıda, supportsFS yoksa veya db.json seçilmemişse welcome modalı göster
async function startApp() {
  if (!supportsFS) {
    alert('Tarayıcınızda yerel dosya erişimi desteklenmiyor.');
    return;
  }
  // Eğer dbFileHandle zaten varsa, hiçbir modal açma
  if (dbFileHandle) {
    initializeAppForDb();
    return;
  }
  // Eğer daha önce dosya seçilmişse, sadece lastDbModal göster
  if (localStorage.getItem(LAST_DB_FILE_KEY)) {
    showLastDbModal();
    return;
  }
  // Hiç dosya seçilmemişse welcome modalı göster
  welcomeModal.style.display = 'flex';
  welcomeSelectDbJsonBtn.onclick = async function() {
    await selectOrCreateDbJson();
    welcomeModal.style.display = 'none';
  };
}

selectDbJsonBtn.addEventListener('click', selectOrCreateDbJson);

// Menü ve sayfa başlıklarını db.json'dan oluştur
function renderSheetNamesAndMenu(selectedSheet) {
  sheetSelector.innerHTML = '';
  sheetSelector.disabled = false;
  const sheetNames = Object.keys(dbData || {});
  if (sheetNames.length === 0) {
    sheetSelector.innerHTML = '<option>Sayfa yok</option>';
    currentSheetName = '';
    return;
  }
  sheetNames.forEach(sheetName => {
    const option = document.createElement('option');
    option.value = sheetName;
    option.textContent = sheetName;
    sheetSelector.appendChild(option);
  });
  // Öncelik: localStorage > parametre > ilk sayfa
  const lastSelected = localStorage.getItem('lastSelectedSheet');
  if (lastSelected && sheetNames.includes(lastSelected)) {
    sheetSelector.value = lastSelected;
    currentSheetName = lastSelected;
  } else if (selectedSheet && sheetNames.includes(selectedSheet)) {
    sheetSelector.value = selectedSheet;
    currentSheetName = selectedSheet;
  } else {
    sheetSelector.value = sheetNames[0];
    currentSheetName = sheetNames[0];
  }
}

// Kartları seçili sayfadan oku ve göster
function renderFlashcardsFromDb() {
  cardsContainer.innerHTML = '';
  if (!dbData[currentSheetName] || dbData[currentSheetName].length === 0) {
    cardCounter.textContent = '0 / 0';
    cardsContainer.innerHTML = `<p>Bu sayfada ('${currentSheetName || 'N/A'}') gösterilecek kart bulunamadı.</p>`;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    exportPdfBtn.disabled = true;
    return;
  }
  prevBtn.disabled = false;
  nextBtn.disabled = false;
  exportPdfBtn.disabled = false;
  flashcardsData = dbData[currentSheetName];
  currentCardIndex = Math.min(currentCardIndex, flashcardsData.length - 1);
  if (currentCardIndex < 0 && flashcardsData.length > 0) currentCardIndex = 0;
  flashcardsData.forEach((data, index) => {
    const flashcard = document.createElement('div');
    flashcard.className = 'flashcard';
    flashcard.dataset.index = index;
    flashcard.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <div class="bir">${data.bir || ''}</div>
          <div class="bir_iki">${data.bir_iki || ''}</div>
          <div class="bottom-content-area">
            <div class="bir_uc_container">
              <div class="bir_uc_artikel">${data.bir_uc_artikel || ''}</div>
              <div class="bir_uc">${data.bir_uc || ''}</div>
            </div>
            <div class="bir_dort">${data.bir_dort || ''}</div>
          </div>
        </div>
        <div class="card-back">
          <div class="iki">${data.iki || ''}</div>
          <div class="content-back">
            <div class="iki_iki">${data.iki_iki || ''}</div>
            <div class="iki_uc">${data.iki_uc || ''}</div>
          </div>
        </div>
      </div>`;
    flashcard.addEventListener('click', () => flipCard(flashcard));
    cardsContainer.appendChild(flashcard);
  });
  if (flashcardsData.length > 0) {
    showCard(currentCardIndex);
  } else {
    updateCounter(-1);
  }
}

// Ekle butonu ile yeni kart ekleme
function showAddCardModal() {
  addCardModal.style.display = 'flex';
  addCardForm.reset();
  // Set the bir_iki input value to current page name with #
  const birIkiInput = addCardForm.querySelector('input[name="bir_iki"]');
  if (birIkiInput && typeof currentSheetName === 'string' && currentSheetName.trim() !== '') {
    birIkiInput.value = `#${currentSheetName}`;
  }
}
function hideAddCardModal() {
  addCardModal.style.display = 'none';
}
goToSheetBtn.removeEventListener('click', goToGoogleSheets);
goToSheetBtn.addEventListener('click', () => {
  showAddCardModal();
  menuContent.classList.remove('show');
  hamburgerIcon.classList.remove('active');
});
cancelAddCardBtn.addEventListener('click', hideAddCardModal);
addCardForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const formData = new FormData(addCardForm);
  const newCard = {};
  for (const [key, value] of formData.entries()) {
    newCard[key] = value;
  }
  if (!dbData[currentSheetName]) dbData[currentSheetName] = [];
  dbData[currentSheetName].push(newCard);
  await saveDbJson();
  hideAddCardModal();
  renderSheetNamesAndMenu(currentSheetName);
  // Yeni eklenen kartı hemen göstermek için currentCardIndex'i son karta ayarla
  currentCardIndex = dbData[currentSheetName].length - 1;
  renderFlashcardsFromDb();
  // Welcome modalı asla görünmesin
  if (typeof welcomeModal !== 'undefined') welcomeModal.style.display = 'none';
});

// Uygulama başlat
window.addEventListener('DOMContentLoaded', startApp);

// db.json yüklendikten sonra uygulamayı başlat
function initializeAppForDb() {
  renderSheetNamesAndMenu(currentSheetName);
  renderFlashcardsFromDb();
}

// Tam ekran modal için HTML ekle
const lastDbModal = document.createElement('div');
lastDbModal.id = 'lastDbModal';
lastDbModal.style = `
  display: none;
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.65);
  z-index: 3000;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
lastDbModal.innerHTML = `
  <div style="background: #fff; padding: 36px 32px 32px 32px; border-radius: 18px; min-width: 320px; max-width: 90vw; box-shadow: 0 8px 32px rgba(0,0,0,0.25); display: flex; flex-direction: column; align-items: center;">
    <div style="font-size: 1rem; color: #666; margin-bottom: 24px; text-align:center;">Güvenlik nedeniyle dosya tekrar seçilmeli.</div>
    <button id="lastDbModalReselectBtn" style="font-size: 1.25rem; padding: 18px 40px; border-radius: 12px; border: none; background: #222; color: #fff; cursor: pointer; font-weight: 700; margin-bottom: 8px; width: 100%; max-width: 320px;">db.json dosyasını seç</button>
    <div id="lastDbModalFileName" style="font-size: 0.75rem; color: #222; margin-top: 30px; text-align:center;"></div>
  </div>
`;
document.body.appendChild(lastDbModal);
const lastDbModalFileName = document.getElementById('lastDbModalFileName');
const lastDbModalReselectBtn = document.getElementById('lastDbModalReselectBtn');

// Modalı göster
function showLastDbModal() {
  const lastDbName = localStorage.getItem(LAST_DB_FILE_KEY);
  if (lastDbName) {
    lastDbModalFileName.textContent = `Son kullanılan dosya: ${lastDbName}`;
    lastDbModal.style.display = 'flex';
  }
}
// Modalı gizle
function hideLastDbModal() {
  lastDbModal.style.display = 'none';
}
// Buton tıklanınca dosya seçtir ve modalı kapat
lastDbModalReselectBtn.onclick = async function() {
  await selectOrCreateDbJson();
  hideLastDbModal();
};

async function selectOrCreateDbJson() {
  if (dbFileHandle) return; // Zaten seçiliyse tekrar seçtirme
  try {
    let fileHandle;
    if (supportsFS) {
      [fileHandle] = await window.showOpenFilePicker({
        types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }],
        excludeAcceptAllOption: false,
        multiple: false
      });
    } else {
      alert('Tarayıcınızda yerel dosya erişimi desteklenmiyor. Chrome veya Edge kullanın.');
      return;
    }
    dbFileHandle = fileHandle;
    localStorage.setItem(LAST_DB_FILE_KEY, dbFileHandle.name || dbFileName);
    await loadDbJson();
    if (typeof welcomeModal !== 'undefined') welcomeModal.style.display = 'none';
    initializeAppForDb();
  } catch (e) {
    alert('Dosya seçilmedi.');
  }
}

async function loadDbJson() {
  if (!dbFileHandle) return;
  const file = await dbFileHandle.getFile();
  const text = await file.text();
  try {
    dbData = JSON.parse(text);
  } catch (e) {
    dbData = {};
    alert('db.json okunamadı veya bozuk.');
  }
}

async function saveDbJson() {
  if (!dbFileHandle) return;
  const writable = await dbFileHandle.createWritable();
  await writable.write(JSON.stringify(dbData, null, 2));
  await writable.close();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service-worker.js');
  });
}

const installBtn = document.getElementById('installPwaBtn');
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});
installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      installBtn.style.display = 'none';
    }
    deferredPrompt = null;
  }
});

const deleteCardBtn = document.getElementById('deleteCardBtn');
deleteCardBtn.addEventListener('click', async function() {
  if (!flashcardsData.length) return;
  const confirmDelete = confirm('Bu kartı silmek istediğinizden emin misiniz?');
  if (!confirmDelete) return;
  // Kartı sil
  dbData[currentSheetName].splice(currentCardIndex, 1);
  await saveDbJson();
  // Eğer son kart silindiyse bir önceki karta git, yoksa aynı indexte kal
  if (currentCardIndex >= dbData[currentSheetName].length) {
    currentCardIndex = dbData[currentSheetName].length - 1;
  }
  renderSheetNamesAndMenu(currentSheetName);
  renderFlashcardsFromDb();
});

// Add this script after the modal form definition
(function() {
  const birSelect = document.querySelector('#addCardForm select[name="bir"]');
  const ikiSelect = document.querySelector('#addCardForm select[name="iki"]');
  if (birSelect && ikiSelect) {
    const map = {
      'substantiv': 'isim',
      'verb': 'fiil',
      'adjektiv': 'sifat',
      'adverb': 'zarf'
    };
    birSelect.addEventListener('change', function() {
      const val = map[birSelect.value];
      if (val) {
        ikiSelect.value = val;
      }
    });
    // When modal opens, also sync iki to bir
    document.getElementById('addCardForm').addEventListener('reset', function() {
      setTimeout(function() {
        if (map[birSelect.value]) ikiSelect.value = map[birSelect.value];
      }, 0);
    });
  }
})();