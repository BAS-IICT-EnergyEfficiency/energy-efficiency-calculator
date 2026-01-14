import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Configuration (PLACEHOLDERS - Replace with actual keys)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Admin Storage Keys
const ADMIN_MATERIALS_KEY = 'adminMaterials';
const ADMIN_SETTINGS_KEY = 'adminSettings';
const FORMULA_SETTINGS_KEY = 'formulaSettings';

// Default Material Database (used when no admin config exists)
const DEFAULT_MATERIALS = [
    { id: 'concrete', name_en: 'Concrete', name_bg: 'Бетон', lambda: 1.65, maxThickness: 40 },
    { id: 'brick', name_en: 'Brick wall', name_bg: 'Тухлена стена', lambda: 0.79, maxThickness: 40 },
    { id: 'bitumen', name_en: 'Bitumen insulation', name_bg: 'Битумна изолация', lambda: 0.27, maxThickness: 2 },
    { id: 'wood', name_en: 'Wood', name_bg: 'Дърво', lambda: 0.13, maxThickness: 15 },
    { id: 'glass_wool', name_en: 'Glass wool', name_bg: 'Стъклена вата', lambda: 0.04, maxThickness: 15 }
];

// Default Settings (used when no admin config exists)
const DEFAULT_SETTINGS = {
    tempIn: { min: 10, max: 30 },
    tempOut: { min: -30, max: 50 },
    areaMax: 1000,
    decimals: 3
};

// Default Formula Settings
const DEFAULT_FORMULA_SETTINGS = {
    useAbsoluteValue: false
};

// Dynamic getters for admin-configured values
function getMaterials() {
    const stored = localStorage.getItem(ADMIN_MATERIALS_KEY);
    return stored ? JSON.parse(stored) : [...DEFAULT_MATERIALS];
}

function getSettings() {
    const stored = localStorage.getItem(ADMIN_SETTINGS_KEY);
    return stored ? JSON.parse(stored) : { ...DEFAULT_SETTINGS };
}

function getFormulaSettings() {
    const stored = localStorage.getItem(FORMULA_SETTINGS_KEY);
    return stored ? JSON.parse(stored) : { ...DEFAULT_FORMULA_SETTINGS };
}

// Translations
const translations = {
    en: {
        brand_name: 'EcoCalc',
        lang_toggle: 'EN / BG',
        hero_title_1: '',
        hero_title_2: 'Energy Analysis',
        hero_title_3: 'for Modern Buildings',
        hero_subtitle: 'Calculate heat loss, evaluate insulation efficiency, and optimize your building\'s energy performance with precision engineering tools.',
        start_calculating: 'Start Calculating',
        learn_more: 'Learn More',
        calculator_title: 'Energy Efficiency Calculator',
        calculator_subtitle: 'Enter your building parameters below',
        area_label: 'Area (m²)',
        area_hint: '(ex. 1 - 1000)',
        select_material_placeholder: 'Choose material...',
        material_label: 'Material',
        thickness_label: 'Thickness (cm)',
        thickness_hint: '(ex. 0.01 - {max})',
        temp_in_label: 'Internal (°C)',
        temp_in_hint: '(ex. 10 - 30)',
        temp_out_label: 'External (°C)',
        temp_out_hint: '(ex. -30 to 50)',
        calculate_btn: 'Calculate Heat Loss',
        result_heading: 'Result',
        heat_loss_label: 'Heat Loss:',
        watts_unit: 'kW',
        fill_all_fields: 'Please fill in all fields correctly.',
        thickness_max_warning: 'Maximum thickness for this material is {max} cm',
        thickness_exceeded_note: 'Value has been adjusted to the maximum.',
        thickness_warning: 'Thickness cannot be negative',
        decimal_places_warning: 'Maximum 2 digits after the decimal point allowed',
        temp_in_min_warning: 'Internal temperature cannot be lower than 10°C',
        temp_in_max_warning: 'Internal temperature cannot be higher than 30°C',
        temp_out_min_warning: 'External temperature cannot be lower than -30°C',
        temp_out_max_warning: 'External temperature cannot be higher than 50°C',
        area_max_warning: 'Maximum area is {max} m²',
        area_warning: 'Area must be greater than 0',
        conductivity_tooltip: 'The ability of a material to transfer heat. Lower values = better insulation.',
        heat_loss_tooltip: 'The amount of energy escaping through the wall in kilowatts (kW).',
        efficiency_rating: 'Energy Efficiency Rating',
        rating_good: 'Good',
        rating_poor: 'Poor',
        partner_text: 'Developed in partnership with',
        partner_link: 'Bulgarian Academy of Sciences',
        footer_heading: 'Team',
        footer_student: 'Student: Kristiyan Kirov',
        footer_mentor: 'Mentor: Dr. Veneta Yosifova',
        footer_institute: 'Institute: IICT - BAS',
        footer_description: 'Energy efficiency calculations for sustainable building design.',
        footer_connect: 'Contacts',
        footer_location: 'BAS IV km., ul. "Akad. Georgi Bonchev" 2, Block 2, 1113 Sofia',
        footer_copyright: '© 2026 Energy Efficiency Project | Bulgarian Academy of Sciences',
        history_title: 'Calculation History',
        history_empty: 'No calculations yet. Start calculating to see your history here.',
        clear_history: 'Clear',
        export_csv: 'Export',
        export_empty: 'No history to export.',
        clear_history_confirm: 'Are you sure you want to clear all calculation history?',
        delete_entry: 'Delete',
        result_disclaimer: 'This calculator uses a simplified heat loss model through thermal conductivity of a single material layer and does not include thermal bridges or surface resistances.',
        efficiency_note: 'The indicator shows normalized heat loss intensity (q = Q / A × ΔT) in W/m²K, independent of area and temperature.'
    },
    bg: {
        brand_name: 'ЕкоКалк',
        lang_toggle: 'EN / BG',
        hero_title_1: '',
        hero_title_2: 'Енергиен Анализ',
        hero_title_3: 'за Съвременни Сгради',
        hero_subtitle: 'Изчислете топлинните загуби, оценете ефективността на изолацията и оптимизирайте енергийната ефективност на вашата сграда.',
        start_calculating: 'Започни Изчисление',
        learn_more: 'Научи Повече',
        calculator_title: 'Калкулатор за Енергийна Ефективност',
        calculator_subtitle: 'Въведете параметрите на сградата по-долу',
        area_label: 'Площ (m²)',
        area_hint: '(пр. 1 - 1000)',
        select_material_placeholder: 'Изберете материал...',
        material_label: 'Материал',
        thickness_label: 'Дебелина (cm)',
        thickness_hint: '(пр. 0,01 - {max})',
        temp_in_label: 'Вътрешна (°C)',
        temp_in_hint: '(пр. 10 - 30)',
        temp_out_label: 'Външна (°C)',
        temp_out_hint: '(пр. -30 до 50)',
        calculate_btn: 'Изчисли Топлинни Загуби',
        result_heading: 'Резултат',
        heat_loss_label: 'Топлинни загуби:',
        watts_unit: 'kW',
        fill_all_fields: 'Моля, попълнете всички полета правилно.',
        thickness_max_warning: 'Максимална дебелина за избрания материал: {max} cm',
        thickness_exceeded_note: 'Стойността е коригирана до максимума.',
        thickness_warning: 'Дебелината не може да бъде отрицателна',
        decimal_places_warning: 'Максимум 2 цифри след десетичната запетая',
        temp_in_min_warning: 'Вътрешната температура не може да е по-ниска от 10°C',
        temp_in_max_warning: 'Вътрешната температура не може да е по-висока от 30°C',
        temp_out_min_warning: 'Външната температура не може да е по-ниска от -30°C',
        temp_out_max_warning: 'Външната температура не може да е по-висока от 50°C',
        area_max_warning: 'Максималната площ е {max} m²',
        area_warning: 'Площта трябва да е по-голяма от 0',
        conductivity_tooltip: 'Способността на материала да пренася топлина. По-ниски стойности = по-добра изолация.',
        heat_loss_tooltip: 'Количеството енергия, излизащо през стената в киловати (kW).',
        efficiency_rating: 'Рейтинг на Енергийна Ефективност',
        rating_good: 'Добър',
        rating_poor: 'Лош',
        partner_text: 'Разработено в партньорство с',
        partner_link: 'Българска Академия на Науките',
        footer_heading: 'Екип',
        footer_student: 'Студент: Кристиян Киров',
        footer_mentor: 'Ментор: д-р Венета Йосифова',
        footer_institute: 'Институт: ИИКТ - БАН',
        footer_description: 'Изчисления за енергийна ефективност за устойчив дизайн на сгради.',
        footer_connect: 'Контакти',
        footer_location: 'БАН IV км., ул. "Акад. Георги Бончев" 2, Блок 2, 1113 София',
        footer_copyright: '© 2026 Проект Енергийна Ефективност | Българска Академия на Науките',
        history_title: 'История на изчисленията',
        history_empty: 'Все още няма изчисления. Започнете да калкулирате, за да видите вашата история тук.',
        clear_history: 'Изчисти',
        export_csv: 'Експорт',
        export_empty: 'Няма история за експортиране.',
        clear_history_confirm: 'Сигурни ли сте, че искате да изчистите цялата история?',
        delete_entry: 'Изтрий',
        result_disclaimer: 'Калкулаторът и неговите изчисления са базирани на опростен модел за топлинни загуби чрез топлопроводимост през един слой материал и не включват топлинни мостове и повърхностни съпротивления.',
        efficiency_note: 'Индикаторът показва нормализирана интензивност на топлинните загуби (q = Q / A × ΔT) в W/m²K, независима от площта и температурата.'
    }
};

// Load saved language from localStorage, default to Bulgarian
let currentLang = localStorage.getItem('selectedLang') || 'bg';

// DOM Elements
const materialSelect = document.getElementById('inputMaterial');
const langBtnBG = document.getElementById('langBG');
const langBtnEN = document.getElementById('langEN');
const themeToggleBtn = document.getElementById('themeToggle');
const calcForm = document.getElementById('calcForm');
const resultAlert = document.getElementById('resultAlert');
const resultValue = document.getElementById('resultValue');
const btnBackToTop = document.getElementById('btn-back-to-top');
const historyList = document.getElementById('historyList');
const historyEmpty = document.getElementById('historyEmpty');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const exportHistoryBtn = document.getElementById('exportHistoryBtn');

// History constants
const MAX_HISTORY_ENTRIES = 20;
const HISTORY_STORAGE_KEY = 'calcHistory';

// Theme: default is dark (green), load from localStorage
let currentTheme = localStorage.getItem('calculatorTheme') || 'light';

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        themeToggleBtn.innerHTML = '<i class="bi bi-moon-fill"></i>';
    } else {
        document.body.classList.remove('light-theme');
        themeToggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
    }
    localStorage.setItem('calculatorTheme', theme);
    currentTheme = theme;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateLanguage(currentLang);
    applyTheme(currentTheme);

    // Set initial language button states
    updateLangButtonStates();

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.log('Service Worker registration failed', err));
    }

    // No default values - show empty form with placeholders

    // Initialize Tooltips
    updateTooltips();

    // Update thickness hint when material changes
    materialSelect.addEventListener('change', updateThicknessHint);

    // Real-time validation for thickness input
    const thicknessInput = document.getElementById('inputThickness');
    ['input', 'change', 'keyup', 'blur'].forEach(event => {
        thicknessInput.addEventListener(event, validateThicknessInput);
    });

    // Real-time validation for area input (limit to 2 decimal places)
    const areaInput = document.getElementById('inputArea');
    ['input', 'change', 'keyup', 'blur'].forEach(event => {
        areaInput.addEventListener(event, (e) => {
            limitDecimalPlaces(e.target, 2);
            validateAreaInput();
        });
    });

    // Real-time validation for external temperature (limit to 2 decimal places)
    const tempOutInput = document.getElementById('inputTempOut');
    ['input', 'change', 'keyup', 'blur'].forEach(event => {
        tempOutInput.addEventListener(event, (e) => {
            limitDecimalPlaces(e.target, 2);
            validateTempOutInput();
        });
    });

    // Real-time validation for internal temperature
    const tempInInput = document.getElementById('inputTempIn');
    ['input', 'change', 'keyup', 'blur'].forEach(event => {
        tempInInput.addEventListener(event, validateTempInInput);
    });

    // Render calculation history on page load
    renderHistory();

    // Clear history button
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm(translations[currentLang].clear_history_confirm)) {
            localStorage.removeItem(HISTORY_STORAGE_KEY);
            renderHistory();
        }
    });

    // Export history to Excel button
    exportHistoryBtn.addEventListener('click', () => {
        const entries = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY)) || [];

        if (entries.length === 0) {
            alert(translations[currentLang].export_empty);
            return;
        }

        // Headers based on current language
        const headers = currentLang === 'bg'
            ? ['Дата', 'Материал', 'Площ (m²)', 'Дебелина (cm)', 'T вътрешна (°C)', 'T външна (°C)', 'Топлинни загуби (kW)']
            : ['Date', 'Material', 'Area (m²)', 'Thickness (cm)', 'T internal (°C)', 'T external (°C)', 'Heat Loss (kW)'];

        // Build data array for SheetJS
        const data = [headers];

        entries.forEach(entry => {
            const date = new Date(entry.date).toLocaleString(currentLang === 'bg' ? 'bg-BG' : 'en-US');
            const material = currentLang === 'bg' ? entry.material_bg : entry.material_en;
            data.push([
                date,
                material,
                entry.area,
                entry.thickness,
                entry.tempIn,
                entry.tempOut,
                entry.result
            ]);
        });

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);

        // Set column widths for better readability
        ws['!cols'] = [
            { wch: 20 },  // Date
            { wch: 20 },  // Material
            { wch: 12 },  // Area
            { wch: 14 },  // Thickness
            { wch: 16 },  // T internal
            { wch: 16 },  // T external
            { wch: 18 }   // Heat Loss
        ];

        // Add worksheet to workbook
        const sheetName = currentLang === 'bg' ? 'История' : 'History';
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        // Generate and download file - Safari-compatible approach
        const filename = `ecocalc-history-${new Date().toISOString().split('T')[0]}.xlsx`;

        // Use XLSX.write to get array buffer for better Safari support
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Create download with Safari iOS fallback
        if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            // For iOS Safari, open in new tab as download may not work
            const reader = new FileReader();
            reader.onload = function () {
                const dataUrl = reader.result;
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = filename;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
            reader.readAsDataURL(blob);
        } else {
            // Standard approach for other browsers
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    });
});

// Theme Toggle Event
themeToggleBtn.addEventListener('click', () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
});

// Language Button Event Listeners
function updateLangButtonStates() {
    if (currentLang === 'bg') {
        langBtnBG.classList.add('active');
        langBtnEN.classList.remove('active');
    } else {
        langBtnEN.classList.add('active');
        langBtnBG.classList.remove('active');
    }
}

langBtnBG.addEventListener('click', () => {
    if (currentLang !== 'bg') {
        currentLang = 'bg';
        localStorage.setItem('selectedLang', currentLang);
        updateLanguage(currentLang);
        updateLangButtonStates();
    }
});

langBtnEN.addEventListener('click', () => {
    if (currentLang !== 'en') {
        currentLang = 'en';
        localStorage.setItem('selectedLang', currentLang);
        updateLanguage(currentLang);
        updateLangButtonStates();
    }
});

calcForm.addEventListener('submit', (e) => {
    e.preventDefault();
    calculateHeatLoss();
});

// Scroll to Top Logic
window.onscroll = function () {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        btnBackToTop.style.display = "block";
    } else {
        btnBackToTop.style.display = "none";
    }
};

btnBackToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Input Validation
const inputs = document.querySelectorAll('input[type="number"]');
inputs.forEach(input => {
    input.addEventListener('input', (e) => {
        // Prevent non-numeric input (already handled by type="number" but good to reinforce)
        // Check for negative thickness
        if (e.target.id === 'inputThickness') {
            const val = parseFloat(e.target.value);
            const warning = document.getElementById('thicknessWarning');
            if (val < 0) {
                e.target.value = 0;
                warning.classList.remove('d-none');
            } else {
                warning.classList.add('d-none');
            }
        }
    });
});

// Functions
function updateLanguage(lang) {
    // Update text content for elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Re-populate materials to update names
    populateMaterials();

    // Update tooltips
    updateTooltips();

    // Update thickness hint for current language
    updateThicknessHint();

    // Clear any visible warnings to avoid language mismatch
    clearVisibleWarnings();

    // Re-render history with new language
    renderHistory();
}

function clearVisibleWarnings() {
    // Hide all warning elements when language changes
    const thicknessWarning = document.getElementById('thicknessWarning');
    const tempInWarning = document.getElementById('tempInWarning');
    const tempOutWarning = document.getElementById('tempOutWarning');

    if (thicknessWarning) thicknessWarning.classList.add('d-none');
    if (tempInWarning) tempInWarning.classList.add('d-none');
    if (tempOutWarning) tempOutWarning.classList.add('d-none');
}

function updateThicknessHint() {
    const materialId = materialSelect.value;
    const thicknessHint = document.getElementById('thicknessHint');

    if (!materialId || !thicknessHint) return;

    const materials = getMaterials();
    const material = materials.find(m => m.id === materialId);
    if (!material) return;

    const hintText = translations[currentLang].thickness_hint.replace('{max}', material.maxThickness.toFixed(2));
    thicknessHint.textContent = hintText;
}

// Helper function to limit decimal places in input
function limitDecimalPlaces(input, maxDecimals) {
    let value = input.value;
    // Support both comma and dot as decimal separator
    value = value.replace(',', '.');

    const parts = value.split('.');
    if (parts.length > 1 && parts[1].length > maxDecimals) {
        input.value = parts[0] + '.' + parts[1].substring(0, maxDecimals);
    }
}

// Real-time thickness validation
function validateThicknessInput() {
    const materialId = materialSelect.value;
    if (!materialId) return;

    const materials = getMaterials();
    const material = materials.find(m => m.id === materialId);
    if (!material) return;

    const thicknessInput = document.getElementById('inputThickness').value.replace(',', '.');
    const thickness = parseFloat(thicknessInput);
    const warning = document.getElementById('thicknessWarning');

    if (isNaN(thickness) || thicknessInput === '') {
        warning.classList.add('d-none');
        return;
    }

    // Check for more than 2 decimal places
    const decimalMatch = thicknessInput.match(/[.,](\d+)/);
    if (decimalMatch && decimalMatch[1].length > 2) {
        warning.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${translations[currentLang].decimal_places_warning}`;
        warning.classList.remove('d-none');
        return;
    }

    if (thickness > material.maxThickness) {
        const warningMsg = translations[currentLang].thickness_max_warning.replace('{max}', material.maxThickness.toFixed(2));
        warning.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${warningMsg}`;
        warning.classList.remove('d-none');
    } else if (thickness <= 0) {
        warning.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${translations[currentLang].thickness_warning}`;
        warning.classList.remove('d-none');
    } else {
        warning.classList.add('d-none');
    }
}

// Real-time area validation
function validateAreaInput() {
    const areaInput = document.getElementById('inputArea');
    const area = parseFloat(areaInput.value);
    const settings = getSettings();

    // Create or get area warning element
    let warning = document.getElementById('areaWarning');
    if (!warning) {
        warning = document.createElement('div');
        warning.id = 'areaWarning';
        warning.className = 'form-warning d-none';
        areaInput.parentNode.appendChild(warning);
    }

    if (isNaN(area) || areaInput.value === '') {
        warning.classList.add('d-none');
        return;
    }

    if (area > settings.areaMax) {
        const warningMsg = translations[currentLang].area_max_warning.replace('{max}', settings.areaMax);
        warning.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${warningMsg}`;
        warning.classList.remove('d-none');
    } else if (area <= 0) {
        warning.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${translations[currentLang].area_warning}`;
        warning.classList.remove('d-none');
    } else {
        warning.classList.add('d-none');
    }
}

// Real-time internal temperature validation
function validateTempInInput() {
    const tempInput = document.getElementById('inputTempIn');
    const temp = parseFloat(tempInput.value);
    const settings = getSettings();
    const warning = document.getElementById('tempInWarning');

    if (isNaN(temp) || tempInput.value === '') {
        warning.classList.add('d-none');
        return;
    }

    if (temp < settings.tempIn.min || temp > settings.tempIn.max) {
        const warningMsg = translations[currentLang].temp_in_range_warning
            .replace('{min}', settings.tempIn.min)
            .replace('{max}', settings.tempIn.max);
        warning.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${warningMsg}`;
        warning.classList.remove('d-none');
    } else {
        warning.classList.add('d-none');
    }
}

// Real-time external temperature validation
function validateTempOutInput() {
    const tempInput = document.getElementById('inputTempOut');
    const temp = parseFloat(tempInput.value);
    const settings = getSettings();
    const warning = document.getElementById('tempOutWarning');

    if (isNaN(temp) || tempInput.value === '') {
        warning.classList.add('d-none');
        return;
    }

    if (temp < settings.tempOut.min || temp > settings.tempOut.max) {
        const warningMsg = translations[currentLang].temp_out_range_warning
            .replace('{min}', settings.tempOut.min)
            .replace('{max}', settings.tempOut.max);
        warning.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${warningMsg}`;
        warning.classList.remove('d-none');
    } else {
        warning.classList.add('d-none');
    }
}

function updateTooltips() {
    const materialTooltip = document.getElementById('materialTooltip');
    const heatLossTooltip = document.getElementById('heatLossTooltip');

    // Dispose existing tooltips to update title
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        const tooltip = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
        if (tooltip) {
            tooltip.dispose();
        }
    });

    // Set new titles
    materialTooltip.setAttribute('title', translations[currentLang].conductivity_tooltip);
    heatLossTooltip.setAttribute('title', translations[currentLang].heat_loss_tooltip);

    // Re-initialize tooltips
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function populateMaterials() {
    // Get materials from admin config or defaults
    const materials = getMaterials();

    // Save currently selected value
    const selectedValue = materialSelect.value;

    // Clear existing options except the first one (placeholder)
    while (materialSelect.options.length > 1) {
        materialSelect.remove(1);
    }

    // Update placeholder text
    const placeholderOption = materialSelect.options[0];
    placeholderOption.textContent = translations[currentLang].select_material_placeholder;

    materials.forEach(material => {
        const option = document.createElement('option');
        option.value = material.id;
        option.textContent = currentLang === 'en' ? material.name_en : material.name_bg;
        materialSelect.appendChild(option);
    });

    // Restore selected value if it exists
    if (selectedValue) {
        materialSelect.value = selectedValue;
    }
}

function calculateHeatLoss() {
    const area = parseFloat(document.getElementById('inputArea').value);
    const materialId = document.getElementById('inputMaterial').value;
    // Support both dot and comma as decimal separator
    const thicknessInput = document.getElementById('inputThickness').value.replace(',', '.');
    const thicknessCm = parseFloat(thicknessInput);
    const tempIn = parseFloat(document.getElementById('inputTempIn').value);
    const tempOut = parseFloat(document.getElementById('inputTempOut').value);

    // Validation
    if (isNaN(area) || !materialId || isNaN(thicknessCm) || isNaN(tempIn) || isNaN(tempOut)) {
        alert(translations[currentLang].fill_all_fields);
        return;
    }

    // Get dynamic settings from admin config
    const settings = getSettings();
    const materials = getMaterials();

    // Temperature validation
    const tempInWarning = document.getElementById('tempInWarning');
    const tempOutWarning = document.getElementById('tempOutWarning');
    let hasTemperatureError = false;

    // Clear previous warnings
    tempInWarning.classList.add('d-none');
    tempOutWarning.classList.add('d-none');

    // Internal temperature validation (using admin settings)
    if (tempIn < settings.tempIn.min) {
        tempInWarning.querySelector('span').textContent = translations[currentLang].temp_in_min_warning;
        tempInWarning.classList.remove('d-none');
        hasTemperatureError = true;
    } else if (tempIn > settings.tempIn.max) {
        tempInWarning.querySelector('span').textContent = translations[currentLang].temp_in_max_warning;
        tempInWarning.classList.remove('d-none');
        hasTemperatureError = true;
    }

    // External temperature validation (using admin settings)
    if (tempOut < settings.tempOut.min) {
        tempOutWarning.querySelector('span').textContent = translations[currentLang].temp_out_min_warning;
        tempOutWarning.classList.remove('d-none');
        hasTemperatureError = true;
    } else if (tempOut > settings.tempOut.max) {
        tempOutWarning.querySelector('span').textContent = translations[currentLang].temp_out_max_warning;
        tempOutWarning.classList.remove('d-none');
        hasTemperatureError = true;
    }

    if (hasTemperatureError) {
        return; // Block calculation until user fixes the temperature values
    }

    // Find material lambda
    const material = materials.find(m => m.id === materialId);
    if (!material) return;

    // Validate thickness against material-specific max
    const warning = document.getElementById('thicknessWarning');

    // Check for more than 2 decimal places
    const decimalMatch = thicknessInput.match(/[.,](\d+)/);
    if (decimalMatch && decimalMatch[1].length > 2) {
        warning.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${translations[currentLang].decimal_places_warning}`;
        warning.classList.remove('d-none');
        return; // Block calculation until user fixes the input
    }

    // Round to 2 decimal places
    const thicknessRounded = Math.round(thicknessCm * 100) / 100;
    let usedThickness = thicknessRounded;

    if (thicknessRounded > material.maxThickness) {
        const warningMsg = translations[currentLang].thickness_max_warning.replace('{max}', material.maxThickness.toFixed(2));
        warning.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${warningMsg}`;
        warning.classList.remove('d-none');
        return; // Block calculation until user adjusts the value
    } else if (thicknessRounded <= 0) {
        warning.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${translations[currentLang].thickness_warning}`;
        warning.classList.remove('d-none');
        return;
    } else {
        warning.classList.add('d-none');
    }

    // Formulas
    const thicknessM = usedThickness / 100; // Convert cm to m
    const R = thicknessM / material.lambda; // Resistance
    const U = 1 / R; // Transmittance

    // Get formula settings to determine if absolute value should be used
    const formulaSettings = getFormulaSettings();
    const deltaT = formulaSettings.useAbsoluteValue
        ? Math.abs(tempIn - tempOut)
        : (tempIn - tempOut); // Temperature Difference

    const heatLossWatts = U * area * deltaT; // Heat Loss in Watts
    const heatLossKW = heatLossWatts / 1000; // Convert to kilowatts

    // Calculate normalized heat loss intensity: q = Q / (A × ΔT) = U (W/m²K)
    // This equals the U-value and is independent of area and temperature
    // Use absolute deltaT for efficiency calculation to ensure proper indicator positioning
    const absDeltaT = Math.abs(deltaT);
    const normalizedQ = absDeltaT > 0 ? Math.abs(heatLossWatts) / (area * absDeltaT) : 0;

    // Output in kW
    resultValue.textContent = heatLossKW.toFixed(3);

    // Debug: verify normalized q calculation
    console.log('Efficiency Debug:', {
        Q_watts: heatLossWatts.toFixed(2),
        Q_kW: heatLossKW.toFixed(3),
        A: area,
        deltaT: deltaT,
        q_normalized: normalizedQ.toFixed(3),
        expected_percentage: normalizedQ <= 0.3 ? 0 : (normalizedQ >= 0.6 ? 100 : ((normalizedQ - 0.3) / 0.3 * 100).toFixed(1))
    });

    // Update Efficiency Bar (using normalized q value in W/m²K)
    updateEfficiencyBar(normalizedQ);

    // Save to Cloud
    saveCalculation({
        material: material.name_en, // Saving English name for consistency
        loss: parseFloat(heatLossKW.toFixed(3)),
        date: new Date()
    });

    // Save to local history
    saveToLocalHistory({
        id: Date.now(),
        material_en: material.name_en,
        material_bg: material.name_bg,
        area: area,
        thickness: usedThickness,
        tempIn: tempIn,
        tempOut: tempOut,
        result: parseFloat(heatLossKW.toFixed(3)),
        date: new Date().toISOString()
    });
}

async function saveCalculation(data) {
    try {
        await addDoc(collection(db, "history"), data);

        // Show Toast
        const toastEl = document.getElementById('saveToast');
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

function updateEfficiencyBar(normalizedQ) {
    const indicator = document.getElementById('efficiencyIndicator');
    let percentage = 0;

    // Logic based on normalized heat loss intensity q (W/m²K):
    // q ≤ 0.3 W/m²K = 0% (Green) - Good thermal performance
    // 0.3 < q ≤ 0.6 W/m²K = interpolated (Yellow/Orange) - Average
    // q > 0.6 W/m²K = 100% (Red) - Poor thermal performance
    if (normalizedQ <= 0.3) {
        percentage = 0;
    } else if (normalizedQ >= 0.6) {
        percentage = 100;
    } else {
        // Interpolate between 0.3 and 0.6 W/m²K
        percentage = ((normalizedQ - 0.3) / (0.6 - 0.3)) * 100;
    }

    indicator.style.left = `${percentage}%`;
}

// ==========================================
// Local History Functions
// ==========================================

function saveToLocalHistory(entry) {
    const existing = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY)) || [];
    existing.unshift(entry); // Add newest at the top

    // Limit to MAX_HISTORY_ENTRIES
    if (existing.length > MAX_HISTORY_ENTRIES) {
        existing.pop();
    }

    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(existing));
    renderHistory();
}

function renderHistory() {
    const entries = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY)) || [];

    // Show/hide empty state
    if (entries.length === 0) {
        historyEmpty.classList.remove('d-none');
        historyList.classList.add('d-none');
        clearHistoryBtn.style.display = 'none';
        exportHistoryBtn.style.display = 'none';
    } else {
        historyEmpty.classList.add('d-none');
        historyList.classList.remove('d-none');
        clearHistoryBtn.style.display = 'flex';
        exportHistoryBtn.style.display = 'flex';
    }

    // Clear existing items
    historyList.innerHTML = '';

    // Render each entry
    entries.forEach(entry => {
        const li = document.createElement('li');
        li.className = 'history-item';

        // Get material name based on current language
        const materialName = currentLang === 'en' ? entry.material_en : entry.material_bg;

        // Format date
        const date = new Date(entry.date);
        const formattedDate = formatDate(date);

        // Calculate delta T
        const deltaT = Math.abs(entry.tempIn - entry.tempOut);

        li.innerHTML = `
            <div class="history-item-content">
                <div class="history-item-result">
                    ${entry.result} <span class="unit">kW</span>
                </div>
                <div class="history-item-params">
                    <span><i class="bi bi-bricks"></i>${materialName}</span>
                    <span><i class="bi bi-aspect-ratio"></i>${entry.area} m²</span>
                    <span><i class="bi bi-rulers"></i>${entry.thickness} cm</span>
                    <span><i class="bi bi-thermometer-half"></i>ΔT: ${deltaT}°C</span>
                </div>
            </div>
            <div class="history-item-meta">
                <span class="history-item-date">${formattedDate}</span>
                <button class="btn-delete-history-item" onclick="deleteHistoryEntry(${entry.id})" title="${translations[currentLang].delete_entry}">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
        `;

        historyList.appendChild(li);
    });
}

function deleteHistoryEntry(id) {
    const existing = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY)) || [];
    const filtered = existing.filter(entry => entry.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
    renderHistory();
}

// Make deleteHistoryEntry available globally for onclick
window.deleteHistoryEntry = deleteHistoryEntry;

function formatDate(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
        return currentLang === 'en' ? 'Just now' : 'Току-що';
    } else if (diffMins < 60) {
        return currentLang === 'en' ? `${diffMins} min ago` : `преди ${diffMins} мин`;
    } else if (diffHours < 24) {
        return currentLang === 'en' ? `${diffHours}h ago` : `преди ${diffHours}ч`;
    } else if (diffDays < 7) {
        return currentLang === 'en' ? `${diffDays}d ago` : `преди ${diffDays}д`;
    } else {
        // Format as date
        const options = { day: 'numeric', month: 'short' };
        return date.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'bg-BG', options);
    }
}
