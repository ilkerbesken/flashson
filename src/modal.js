// modal.js
import { state } from './storage.js';
import { selectOrCreateDbJson } from './fileSystem.js';

/**
 * Modal açma/kapama işlemleri
 */

export function showAddCardModal() {
    state.addCardModal.style.display = 'flex';
    state.addCardForm.reset();
    const birIkiInput = state.addCardForm.querySelector('input[name="bir_iki"]');
    if (birIkiInput && typeof state.currentSheetName === 'string' && state.currentSheetName.trim() !== '') {
        birIkiInput.value = `#${state.currentSheetName}`;
    }
}

export function hideAddCardModal() {
    state.addCardModal.style.display = 'none';
}

export function showDbJsonSelector(message = '') {
    state.dbJsonSelectorContainer.style.display = 'block';
    state.dbJsonSelectorInfo.textContent = message || 'Lütfen bir db.json dosyası seçin veya oluşturun.';
    const lastDbName = localStorage.getItem('lastDbJsonFileName');
    if (lastDbName) {
        state.lastDbFileInfo.textContent = `Son kullanılan dosya: ${lastDbName}`;
        state.lastDbFileInfo.style.display = 'block';
    } else if (state.lastDbFileInfo) {
        state.lastDbFileInfo.style.display = 'none';
    }
}

export function hideDbJsonSelector() {
    state.dbJsonSelectorContainer.style.display = 'none';
}

export function showLastDbModal() {
    const lastDbName = localStorage.getItem('lastDbJsonFileName');
    if (lastDbName) {
        if (state.lastDbModalFileName) {
            state.lastDbModalFileName.textContent = `Son kullanılan dosya: ${lastDbName}`;
        }
        if (state.lastDbModal) {
            state.lastDbModal.style.display = 'flex';
        } else {
            console.error('lastDbModal not found!');
        }
    }
}

export function hideLastDbModal() {
    state.lastDbModal.style.display = 'none';
}

export function setupWelcomeModal() {
    console.log('setupWelcomeModal called');
    // Eğer zaten varsa tekrar oluşturma
    if (document.getElementById('welcomeModal')) {
        console.log('Welcome modal already exists');
        return;
    }
    
    // Welcome modalı oluştur ve state'e ata
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
      flex-direction: column;`;
    welcomeModal.innerHTML = `
      <div style="background: #fff; padding: 44px 32px 36px 32px; border-radius: 22px; min-width: 320px; max-width: 90vw; box-shadow: 0 8px 32px rgba(0,0,0,0.25); display: flex; flex-direction: column; align-items: center;">
        <h2 style="font-size: 2rem; color: #222; margin-bottom: 18px; text-align:center;">Hoşgeldiniz!</h2>
        <div style="font-size: 1.1rem; color: #666; margin-bottom: 28px; text-align:center;">Başlamak için bir db.json dosyası seçin veya oluşturun.</div>
        <button id="welcomeSelectDbJsonBtn" style="font-size: 1.25rem; padding: 18px 40px; border-radius: 12px; border: none; background: #222; color: #fff; cursor: pointer; font-weight: 700; margin-bottom: 8px; width: 100%; max-width: 320px;">db.json seç / ekle</button>
      </div>
    `;
    document.body.appendChild(welcomeModal);
    state.welcomeModal = welcomeModal;
    state.welcomeSelectDbJsonBtn = document.getElementById('welcomeSelectDbJsonBtn');
    
    // Buton event handler'ını ekle
    if (state.welcomeSelectDbJsonBtn) {
        console.log('Adding event handler to welcome button');
        state.welcomeSelectDbJsonBtn.addEventListener('click', async function() {
            console.log('Welcome button clicked!');
            await selectOrCreateDbJson();
            state.welcomeModal.style.display = 'none';
        });
    } else {
        console.error('Welcome button not found!');
    }
}

export function setupLastDbModal() {
    console.log('setupLastDbModal called');
    // Eğer zaten varsa tekrar oluşturma
    if (document.getElementById('lastDbModal')) {
        console.log('LastDbModal already exists');
        return;
    }
    
    // lastDbModal'ı oluştur ve state'e ata
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
      flex-direction: column;`;
    lastDbModal.innerHTML = `
      <div style="background: #fff; padding: 36px 32px 32px 32px; border-radius: 18px; min-width: 320px; max-width: 90vw; box-shadow: 0 8px 32px rgba(0,0,0,0.25); display: flex; flex-direction: column; align-items: center;">
        <div style="font-size: 1rem; color: #666; margin-bottom: 24px; text-align:center;">Güvenlik nedeniyle dosya tekrar seçilmeli.</div>
        <button id="lastDbModalReselectBtn" style="font-size: 1.25rem; padding: 18px 40px; border-radius: 12px; border: none; background: #222; color: #fff; cursor: pointer; font-weight: 700; margin-bottom: 8px; width: 100%; max-width: 320px;">db.json dosyasını seç</button>
        <div id="lastDbModalFileName" style="font-size: 0.75rem; color: #222; margin-top: 30px; text-align:center;"></div>
      </div>
    `;
    document.body.appendChild(lastDbModal);
    state.lastDbModal = lastDbModal;
    state.lastDbModalFileName = document.getElementById('lastDbModalFileName');
    state.lastDbModalReselectBtn = document.getElementById('lastDbModalReselectBtn');
    
    // Buton event handler'ını ekle
    if (state.lastDbModalReselectBtn) {
        console.log('Adding event handler to lastDbModal button');
        state.lastDbModalReselectBtn.addEventListener('click', async function() {
            console.log('LastDbModal button clicked!');
            await selectOrCreateDbJson();
            hideLastDbModal();
        });
    } else {
        console.error('LastDbModal button not found!');
    }
}
