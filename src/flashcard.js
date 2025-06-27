// flashcard.js
import { state } from './storage.js';

/**
 * Flashcard işlemleri: render, göster, ekle, ara, değiştir, çevir
 */

export function renderFlashcardsFromDb() {
    console.log('renderFlashcardsFromDb', state.dbData, state.currentSheetName);
    const { dbData, currentSheetName, cardsContainer, cardCounter, prevBtn, nextBtn, exportPdfBtn } = state;
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
    state.flashcardsData = dbData[currentSheetName];
    state.currentCardIndex = Math.min(state.currentCardIndex, state.flashcardsData.length - 1);
    if (state.currentCardIndex < 0 && state.flashcardsData.length > 0) state.currentCardIndex = 0;
    state.flashcardsData.forEach((data, index) => {
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
    if (state.flashcardsData.length > 0) {
        showCard(state.currentCardIndex);
    } else {
        updateCounter(-1);
    }
}

export function showCard(index) {
    document.querySelectorAll('.flashcard').forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });
    const activeCard = document.querySelector('.flashcard.active .card-inner');
    if (activeCard) {
        state.isFlippedToTr = state.toggleSwitch.checked;
        activeCard.style.transform = state.isFlippedToTr ? 'rotateY(180deg)' : 'rotateY(0deg)';
    }
    updateCounter(index);
}

export function flipCard(cardElement) {
    const innerCard = cardElement.querySelector('.card-inner');
    const isCurrentlyFlipped = innerCard.style.transform === 'rotateY(180deg)';
    innerCard.style.transform = isCurrentlyFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)';
    state.isFlippedToTr = !isCurrentlyFlipped;
    state.isFlippedByToggle = false;
}

export function toggleAllCardsLanguage() {
    state.isFlippedToTr = state.toggleSwitch.checked;
    state.isFlippedByToggle = true;
    const activeCardInner = document.querySelector('.flashcard.active .card-inner');
    if (activeCardInner) {
        activeCardInner.style.transform = state.isFlippedToTr ? 'rotateY(180deg)' : 'rotateY(0deg)';
    }
}

export function changeCard(direction) {
    if (state.flashcardsData.length === 0) return;
    state.currentCardIndex = (state.currentCardIndex + direction + state.flashcardsData.length) % state.flashcardsData.length;
    state.isFlippedToTr = state.toggleSwitch.checked;
    state.isFlippedByToggle = true;
    showCard(state.currentCardIndex);
}

export function updateCounter(index) {
    const { flashcardsData, cardCounter } = state;
    if (flashcardsData.length === 0 || index < 0) {
        cardCounter.textContent = `0 / 0`;
    } else {
        cardCounter.textContent = `${index + 1} / ${flashcardsData.length}`;
    }
}

export function searchCards(query) {
    if (!query.trim()) {
        // Arama sorgusu boşsa, mevcut kartı göster
        renderFlashcardsFromDb();
        showCard(state.currentCardIndex);
        return;
    }

    query = query.toLowerCase();
    const foundIndex = state.flashcardsData.findIndex(card => 
        card.bir_uc.toLowerCase().includes(query)
    );

    if (foundIndex !== -1) {
        state.currentCardIndex = foundIndex;
        showCard(state.currentCardIndex);
    } else {
        // Eşleşme bulunamadı mesajı göster
        state.cardsContainer.innerHTML = `<p>Arama sonucu bulunamadı: "${query}"</p>`;
        state.cardCounter.textContent = '0 / 0';
    }
}
