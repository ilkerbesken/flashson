import { state } from './storage.js';
import { renderFlashcardsFromDb, showCard, changeCard, toggleAllCardsLanguage, updateCounter, searchCards } from './flashcard.js';
import { showAddCardModal, showLastDbModal, hideAddCardModal } from './modal.js';
import { selectOrCreateDbJson, saveDbJson } from './fileSystem.js';

/**
 * Genel UI işlemleri, menü, responsive davranışlar, print/export, event handler'lar
 */

export function startApp() {
    console.log('startApp called!');
    
    // DOM elementlerini state'e ata
    state.cardsContainer = document.getElementById('flashcards');
    state.prevBtn = document.getElementById('prevBtn');
    state.nextBtn = document.getElementById('nextBtn');
    state.hamburgerIcon = document.getElementById('hamburgerIcon');
    state.menuContent = document.getElementById('menuContent');
    state.exportPdfBtn = document.getElementById('exportPdf');
    state.goToSheetBtn = document.getElementById('goToSheetBtn');
    state.cardCounter = document.getElementById('cardCounter');
    state.toggleSwitch = document.getElementById('toggleSwitch');
    state.sheetSelector = document.getElementById('sheetSelector');
    state.searchInput = document.getElementById('searchInput');
    state.addCardModal = document.getElementById('addCardModal');
    state.addCardForm = document.getElementById('addCardForm');
    state.dbJsonSelectorContainer = document.getElementById('dbJsonSelectorContainer');
    state.dbJsonSelectorInfo = document.getElementById('dbJsonSelectorInfo');
    state.lastDbModal = document.getElementById('lastDbModal');
    state.lastDbModalFileName = document.getElementById('lastDbModalFileName');
    state.lastDbFileInfo = document.getElementById('lastDbFileInfo');

    console.log('DOM elements assigned to state');

    // File System Access API destek kontrolü
    if (!('showOpenFilePicker' in window && 'showSaveFilePicker' in window)) {
        alert('Tarayıcınızda yerel dosya erişimi desteklenmiyor.');
        return;
    }
    
    console.log('File System API supported');
    console.log('state.dbFileHandle:', state.dbFileHandle);
    
    // Eğer db.json seçilmemişse, kart render ve ana UI başlatma işlemlerini atla
    if (!state.dbFileHandle) {
        console.log('No dbFileHandle, showing modal');
        if (localStorage.getItem('lastDbJsonFileName')) {
            console.log('Showing lastDbModal');
            showLastDbModal();
        } else {
            console.log('Showing welcome modal');
            // Welcome modal'ı göster
            if (state.welcomeModal) {
                console.log('Welcome modal found, showing it');
                state.welcomeModal.style.display = 'flex';
            } else {
                console.error('Welcome modal not found!');
                // Manuel olarak modal oluştur ve göster
                const welcomeModal = document.createElement('div');
                welcomeModal.id = 'welcomeModal';
                welcomeModal.style = `
                  display: flex;
                  position: fixed;
                  top: 0; left: 0; width: 100vw; height: 100vh;
                  background: rgba(0,0,0,0.65);
                  z-index: 4000;
                  align-items: center;
                  justify-content: center;
                  flex-direction: column;`;
                welcomeModal.innerHTML = `
                  <div style="background: #fff; padding: 44px 32px 36px 32px; border-radius: 22px; min-width: 320px; max-width: 90vw; box-shadow: 0 8px 32px rgba(0,0,0,0.25); display: flex; flex-direction: column; align-items: center;">
                    <h2 style="font-size: 2rem; color: #222; margin-bottom: 18px; text-align:center;">Hoşgeldiniz!</h2>
                    <div style="font-size: 1.1rem; color: #666; margin-bottom: 28px; text-align:center;">Başlamak için bir db.json dosyası seçin veya oluşturun.</div>
                    <button id="welcomeSelectDbJsonBtn" style="font-size: 1.25rem; padding: 18px 40px; border-radius: 12px; border: none; background: #222; color: #fff; cursor: pointer; font-weight: 700; margin-bottom: 8px; width: 100%; max-width: 320px;">db.json seç / ekle</button>
                  </div>
                `;
                document.body.appendChild(welcomeModal);
                
                // Buton event handler'ını ekle
                const welcomeBtn = document.getElementById('welcomeSelectDbJsonBtn');
                if (welcomeBtn) {
                    welcomeBtn.addEventListener('click', async function() {
                        console.log('Welcome button clicked!');
                        await selectOrCreateDbJson();
                        welcomeModal.style.display = 'none';
                    });
                }
            }
        }
        // Sadece modal gösterilecek, ana UI başlatılmayacak
        return;
    }
    
    console.log('dbFileHandle exists, initializing app');
    // Sadece dbFileHandle varsa initializeAppForDb çağır
    initializeAppForDb();
}

export function initializeAppForDb() {
    console.log('initializeAppForDb - dbData:', state.dbData);
    console.log('initializeAppForDb - currentSheetName:', state.currentSheetName);
    
    // Event handler'ları bağla
    setupEventHandlers();
    
    renderSheetNamesAndMenu(state.currentSheetName);
    renderFlashcardsFromDb();
}

function setupEventHandlers() {
    console.log('Setting up event handlers');
    
    // Sayfa seçimi
    state.sheetSelector.addEventListener('change', function() {
        state.currentSheetName = this.value;
        localStorage.setItem('lastSelectedSheet', state.currentSheetName);
        renderFlashcardsFromDb();
        state.menuContent.classList.remove('show');
        state.hamburgerIcon.classList.remove('active');
    });
    
    // Kart navigasyonu
    state.prevBtn.addEventListener('click', () => changeCard(-1));
    state.nextBtn.addEventListener('click', () => changeCard(1));
    state.toggleSwitch.addEventListener('change', toggleAllCardsLanguage);
    
    // Menü
    state.hamburgerIcon.addEventListener('click', () => {
        state.menuContent.classList.toggle('show');
        state.hamburgerIcon.classList.toggle('active');
    });
    
    // PDF export
    state.exportPdfBtn.addEventListener('click', async () => {
        if (state.flashcardsData.length === 0) {
            alert('Dışa aktarılacak kart bulunmamaktadır.');
            state.menuContent.classList.remove('show');
            state.hamburgerIcon.classList.remove('active');
            return;
        }
        const originalText = state.exportPdfBtn.textContent;
        state.exportPdfBtn.textContent = 'Hazırlanıyor...';
        state.exportPdfBtn.disabled = true;
        try {
            await exportToPrint();
        } catch (error) {
            console.error('exportPdfBtn tıklama hatası:', error);
            alert('PDF oluşturulurken bir hata oluştu. Konsolu kontrol edin.');
        } finally {
            state.exportPdfBtn.textContent = originalText;
            if (state.flashcardsData.length > 0) {
                state.exportPdfBtn.disabled = false;
            }
            state.menuContent.classList.remove('show');
            state.hamburgerIcon.classList.remove('active');
        }
    });
    
    // Kart ekleme
    state.goToSheetBtn.addEventListener('click', () => {
        showAddCardModal();
        state.menuContent.classList.remove('show');
        state.hamburgerIcon.classList.remove('active');
    });
    
    // Menü dışı tıklama
    document.addEventListener('click', (event) => {
        if (!state.menuContent.contains(event.target) && !state.hamburgerIcon.contains(event.target)) {
            state.menuContent.classList.remove('show');
            state.hamburgerIcon.classList.remove('active');
        }
    });
    
    // Arama
    state.searchInput.addEventListener('input', (e) => {
        if (state.searchTimeout) {
            clearTimeout(state.searchTimeout);
        }
        state.searchTimeout = setTimeout(() => {
            searchCards(e.target.value);
        }, 300);
    });
    state.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchCards(e.target.value);
        }
    });
    state.searchInput.addEventListener('click', (e) => {
        e.target.value = '';
        renderFlashcardsFromDb();
        showCard(state.currentCardIndex);
    });
    
    // Diğer handler'ları da bağla
    setupAddCardFormHandlers();
    setupDeleteCardHandler();
    setupPwaHandlers();
    setupAddCardFormSelectSync();
}

export function renderSheetNamesAndMenu(selectedSheet) {
    const { dbData, sheetSelector } = state;
    sheetSelector.innerHTML = '';
    sheetSelector.disabled = false;
    const sheetNames = Object.keys(dbData || {});
    if (sheetNames.length === 0) {
        sheetSelector.innerHTML = '<option>Sayfa yok</option>';
        state.currentSheetName = '';
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
        state.currentSheetName = lastSelected;
    } else if (selectedSheet && sheetNames.includes(selectedSheet)) {
        sheetSelector.value = selectedSheet;
        state.currentSheetName = selectedSheet;
    } else {
        sheetSelector.value = sheetNames[0];
        state.currentSheetName = sheetNames[0];
    }
}

export async function exportToPrint() {
    const printArea = document.getElementById('print-area');
    const overlay = document.getElementById('print-overlay');
    if (!printArea || !overlay) {
        console.error('Gerekli HTML elementleri bulunamadı.');
        alert('Yazdırma için gerekli HTML elementleri bulunamadı.');
        return;
    }
    overlay.style.display = 'flex';
    printArea.innerHTML = '';
    const originalCardIndex = state.currentCardIndex;
    try {
        for (let i = 0; i < state.flashcardsData.length; i++) {
            overlay.innerHTML = `Kart ${i + 1} / ${state.flashcardsData.length} hazırlanıyor...<br><small>Lütfen bekleyin.</small>`;
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
            throw new Error(state.flashcardsData.length > 0 ? 
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
        if (state.flashcardsData.length > 0) {
            showCard(originalCardIndex);
        } else {
            updateCounter(-1);
        }
    }
}


// Kart ekleme (addCardForm submit)
export function setupAddCardFormHandlers() {
    const { addCardForm } = state;
    if (!addCardForm) return;
    
    // Cancel butonu event handler'ı
    const cancelAddCardBtn = document.getElementById('cancelAddCardBtn');
    if (cancelAddCardBtn) {
        cancelAddCardBtn.addEventListener('click', hideAddCardModal);
    }
    
    addCardForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(addCardForm);
        const newCard = {};
        for (const [key, value] of formData.entries()) {
            newCard[key] = value;
        }
        if (!state.dbData[state.currentSheetName]) state.dbData[state.currentSheetName] = [];
        state.dbData[state.currentSheetName].push(newCard);
        await saveDbJson();
        hideAddCardModal();
        
        // State'i güncelle ve sayfayı yenile
        console.log('Card added, updating state and refreshing page');
        renderSheetNamesAndMenu(state.currentSheetName);
        // Yeni eklenen kartı hemen göstermek için currentCardIndex'i son karta ayarla
        state.currentCardIndex = state.dbData[state.currentSheetName].length - 1;
        renderFlashcardsFromDb();
        if (state.welcomeModal) state.welcomeModal.style.display = 'none';
    });
}

// Kart silme (deleteCardBtn click)
export function setupDeleteCardHandler() {
    const deleteCardBtn = document.getElementById('deleteCardBtn');
    if (!deleteCardBtn) return;
    deleteCardBtn.addEventListener('click', async function() {
        if (!state.flashcardsData.length) return;
        const confirmDelete = confirm('Bu kartı silmek istediğinizden emin misiniz?');
        if (!confirmDelete) return;
        state.dbData[state.currentSheetName].splice(state.currentCardIndex, 1);
        await saveDbJson();
        
        // State'i güncelle ve sayfayı yenile
        console.log('Card deleted, updating state and refreshing page');
        if (state.currentCardIndex >= state.dbData[state.currentSheetName].length) {
            state.currentCardIndex = state.dbData[state.currentSheetName].length - 1;
        }
        renderSheetNamesAndMenu(state.currentSheetName);
        renderFlashcardsFromDb();
    });
}

// PWA install ve service worker
export function setupPwaHandlers() {
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
        if (installBtn) installBtn.style.display = 'block';
    });
    if (installBtn) {
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
    }
}

// addCardForm select senkronizasyonu
export function setupAddCardFormSelectSync() {
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
        document.getElementById('addCardForm').addEventListener('reset', function() {
            setTimeout(function() {
                if (map[birSelect.value]) ikiSelect.value = map[birSelect.value];
            }, 0);
        });
    }
}
