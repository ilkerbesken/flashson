/**
 * Uygulamanın giriş noktası ve başlatıcı fonksiyonlar
 * Tüm event listener'lar ve ana akış burada başlatılır
 */

console.log('app.js loaded!');

import { startApp } from './ui.js';
import { setupWelcomeModal, setupLastDbModal } from './modal.js';

// Uygulama başlatılırken welcome modalı kur
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired!');
    setupWelcomeModal();
    setupLastDbModal();
    startApp();
});
