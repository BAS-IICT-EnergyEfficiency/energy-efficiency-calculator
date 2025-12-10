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

// Material Database with calibrated max thickness values
const materials = [
    { id: 'concrete', name_en: 'Concrete', name_bg: 'Бетон', lambda: 1.65, maxThickness: 40 },
    { id: 'brick', name_en: 'Brick wall', name_bg: 'Тухлена стена', lambda: 0.79, maxThickness: 40 },
    { id: 'bitumen', name_en: 'Bitumen insulation', name_bg: 'Битумна изолация', lambda: 0.27, maxThickness: 2 },
    { id: 'wood', name_en: 'Wood', name_bg: 'Дърво', lambda: 0.13, maxThickness: 15 },
    { id: 'glass_wool', name_en: 'Glass wool', name_bg: 'Стъклена вата', lambda: 0.04, maxThickness: 15 }
];

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
        select_material_placeholder: 'Choose material...',
        material_label: 'Material',
        thickness_label: 'Thickness (cm)',
        temp_in_label: 'Internal (°C)',
        temp_out_label: 'External (°C)',
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
        footer_description: 'Advanced energy efficiency calculations for sustainable building design.',
        footer_connect: 'Contacts',
        footer_location: 'BAS IV km., ul. "Akad. Georgi Bonchev" 2, Block 2, 1113 Sofia',
        footer_copyright: '© 2025 Energy Efficiency Project | Bulgarian Academy of Sciences'
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
        select_material_placeholder: 'Изберете материал...',
        material_label: 'Материал',
        thickness_label: 'Дебелина (cm)',
        temp_in_label: 'Вътрешна (°C)',
        temp_out_label: 'Външна (°C)',
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
        footer_description: 'Модерни изчисления за енергийна ефективност за устойчив дизайн на сгради.',
        footer_connect: 'Контакти',
        footer_location: 'БАН IV км., ул. "Акад. Георги Бончев" 2, Блок 2, 1113 София',
        footer_copyright: '© 2025 Проект Енергийна Ефективност | Българска Академия на Науките'
    }
};

// Load saved language from localStorage, default to Bulgarian
let currentLang = localStorage.getItem('selectedLang') || 'bg';

// DOM Elements
const materialSelect = document.getElementById('inputMaterial');
const langToggleBtn = document.getElementById('langToggle');
const themeToggleBtn = document.getElementById('themeToggle');
const calcForm = document.getElementById('calcForm');
const resultAlert = document.getElementById('resultAlert');
const resultValue = document.getElementById('resultValue');
const btnBackToTop = document.getElementById('btn-back-to-top');

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

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.log('Service Worker registration failed', err));
    }

    // Set Default Values
    document.getElementById('inputArea').value = 20;
    document.getElementById('inputMaterial').value = 'brick';
    document.getElementById('inputThickness').value = 25;
    document.getElementById('inputTempIn').value = 22;
    document.getElementById('inputTempOut').value = 0;

    // Trigger Calculation
    calculateHeatLoss();

    // Initialize Tooltips
    updateTooltips();
});

// Theme Toggle Event
themeToggleBtn.addEventListener('click', () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
});

// Event Listeners
langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'bg' : 'en';
    localStorage.setItem('selectedLang', currentLang);
    updateLanguage(currentLang);
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

    // Temperature validation
    const tempInWarning = document.getElementById('tempInWarning');
    const tempOutWarning = document.getElementById('tempOutWarning');
    let hasTemperatureError = false;

    // Clear previous warnings
    tempInWarning.classList.add('d-none');
    tempOutWarning.classList.add('d-none');

    // Internal temperature validation (10°C to 30°C)
    if (tempIn < 10) {
        tempInWarning.querySelector('span').textContent = translations[currentLang].temp_in_min_warning;
        tempInWarning.classList.remove('d-none');
        hasTemperatureError = true;
    } else if (tempIn > 30) {
        tempInWarning.querySelector('span').textContent = translations[currentLang].temp_in_max_warning;
        tempInWarning.classList.remove('d-none');
        hasTemperatureError = true;
    }

    // External temperature validation (-30°C to +50°C)
    if (tempOut < -30) {
        tempOutWarning.querySelector('span').textContent = translations[currentLang].temp_out_min_warning;
        tempOutWarning.classList.remove('d-none');
        hasTemperatureError = true;
    } else if (tempOut > 50) {
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
        const warningMsg = translations[currentLang].thickness_max_warning.replace('{max}', material.maxThickness);
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
    const deltaT = Math.abs(tempIn - tempOut); // Temperature Difference
    const heatLossWatts = U * area * deltaT; // Heat Loss in Watts
    const heatLossKW = heatLossWatts / 1000; // Convert to kilowatts

    // Output in kW
    resultValue.textContent = heatLossKW.toFixed(3);

    // Update Efficiency Bar (using kW values)
    updateEfficiencyBar(heatLossKW);

    // Save to Cloud
    saveCalculation({
        material: material.name_en, // Saving English name for consistency
        loss: parseFloat(heatLossKW.toFixed(3)),
        date: new Date()
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

function updateEfficiencyBar(heatLossKW) {
    const indicator = document.getElementById('efficiencyIndicator');
    let percentage = 0;

    // Logic: < 0.05 kW (50W) = 0% (Green), > 0.2 kW (200W) = 100% (Red)
    if (heatLossKW <= 0.05) {
        percentage = 0;
    } else if (heatLossKW >= 0.2) {
        percentage = 100;
    } else {
        // Interpolate between 0.05 and 0.2 kW
        percentage = ((heatLossKW - 0.05) / (0.2 - 0.05)) * 100;
    }

    indicator.style.left = `${percentage}%`;
}
