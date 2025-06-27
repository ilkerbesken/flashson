// fileSystem.js
import { state } from './storage.js';
import { initializeAppForDb } from './ui.js';
import { hideLastDbModal } from './modal.js';

/**
 * File System Access API ile db.json dosyasını seçme, okuma ve kaydetme işlemleri
 */

export async function selectOrCreateDbJson() {
    if (state.dbFileHandle) return; // Zaten seçiliyse tekrar seçtirme
    try {
        let fileHandle;
        if ('showOpenFilePicker' in window && 'showSaveFilePicker' in window) {
            [fileHandle] = await window.showOpenFilePicker({
                types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }],
                excludeAcceptAllOption: false,
                multiple: false
            });
        } else {
            alert('Tarayıcınızda yerel dosya erişimi desteklenmiyor. Chrome veya Edge kullanın.');
            return;
        }
        state.dbFileHandle = fileHandle;
        localStorage.setItem('lastDbJsonFileName', state.dbFileHandle.name || state.dbFileName);
        await loadDbJson();
        if (state.welcomeModal) state.welcomeModal.style.display = 'none';
        initializeAppForDb();
    } catch (e) {
        alert('Dosya seçilmedi.');
    }
}

export async function loadDbJson() {
    if (!state.dbFileHandle) return;
    const file = await state.dbFileHandle.getFile();
    const text = await file.text();
    try {
        state.dbData = JSON.parse(text);
    } catch (e) {
        state.dbData = {};
        alert('db.json okunamadı veya bozuk.');
    }
}

export async function saveDbJson() {
    if (!state.dbFileHandle) return;
    const writable = await state.dbFileHandle.createWritable();
    await writable.write(JSON.stringify(state.dbData, null, 2));
    await writable.close();
}

export let dbFileHandle = null;
