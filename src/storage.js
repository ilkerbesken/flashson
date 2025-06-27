/**
 * localStorage işlemleri ve uygulama state yönetimi
 */

export const state = {
    // DOM Elements (ilk yüklemede null, app.js başlatınca atanacak)
    cardsContainer: null,
    prevBtn: null,
    nextBtn: null,
    hamburgerIcon: null,
    menuContent: null,
    exportPdfBtn: null,
    goToSheetBtn: null,
    cardCounter: null,
    toggleSwitch: null,
    sheetSelector: null,
    searchInput: null,
    // App State
    currentCardIndex: 0,
    flashcardsData: [],
    isFlippedToTr: false,
    isFlippedByToggle: false,
    dbData: {},
    dbFileHandle: null,
    dbFileName: 'db.json',
    currentSheetName: '',
    searchTimeout: null,
    // Ekstra
    lastKnownTimestamp: '',
};

export function getLastSelectedSheet() {}
export function setLastSelectedSheet(sheetName) {}
export function getLastDbFileName() {}
export function setLastDbFileName(fileName) {}
