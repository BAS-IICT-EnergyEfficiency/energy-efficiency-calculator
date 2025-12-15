// Admin Panel JavaScript
// Password for admin access (can be changed)
const ADMIN_PASSWORD = 'mentor2025';

// Storage keys
const MATERIALS_KEY = 'adminMaterials';
const SETTINGS_KEY = 'adminSettings';
const ADMIN_SESSION_KEY = 'adminSession';

// Default materials (same as main calculator)
const DEFAULT_MATERIALS = [
    { id: 'concrete', name_en: 'Concrete', name_bg: 'Бетон', lambda: 1.65, maxThickness: 40 },
    { id: 'brick', name_en: 'Brick wall', name_bg: 'Тухлена стена', lambda: 0.79, maxThickness: 40 },
    { id: 'bitumen', name_en: 'Bitumen insulation', name_bg: 'Битумна изолация', lambda: 0.27, maxThickness: 2 },
    { id: 'wood', name_en: 'Wood', name_bg: 'Дърво', lambda: 0.13, maxThickness: 15 },
    { id: 'glass_wool', name_en: 'Glass wool', name_bg: 'Стъклена вата', lambda: 0.04, maxThickness: 15 }
];

// Default settings
const DEFAULT_SETTINGS = {
    tempIn: { min: 10, max: 30 },
    tempOut: { min: -30, max: 50 },
    areaMax: 1000,
    decimals: 3
};

// Translations
const translations = {
    en: {
        admin_login_title: 'Admin Access',
        admin_password_label: 'Password',
        admin_login_error: 'Incorrect password',
        admin_login_btn: 'Access Panel',
        admin_back_to_calc: 'Back to Calculator',
        admin_panel_title: 'Control Panel',
        admin_panel_subtitle: 'Manage calculator settings, materials, and formulas',
        admin_tab_formula: 'Formula',
        admin_tab_materials: 'Materials',
        admin_tab_settings: 'Settings',
        admin_tab_export: 'Export/Import',
        admin_formula_title: 'Heat Loss Formula',
        formula_q_desc: 'Heat loss (Watts)',
        formula_u_desc: 'Thermal transmittance (W/m²K)',
        formula_lambda_desc: 'Thermal conductivity (W/mK)',
        formula_d_desc: 'Material thickness (m)',
        formula_a_desc: 'Wall area (m²)',
        formula_dt_desc: 'Temperature difference (°C)',
        formula_note: 'The formula is based on steady-state heat transfer through a single-layer wall.',
        admin_materials_title: 'Materials Database',
        admin_add_material: 'Add Material',
        admin_edit_material: 'Edit Material',
        admin_th_name_en: 'Name (EN)',
        admin_th_name_bg: 'Name (BG)',
        admin_th_lambda: 'λ (W/mK)',
        admin_th_max_thickness: 'Max Thickness (cm)',
        admin_th_actions: 'Actions',
        admin_settings_title: 'Calculator Settings',
        admin_temp_settings: 'Temperature Limits',
        admin_temp_in_min: 'Internal Min (°C)',
        admin_temp_in_max: 'Internal Max (°C)',
        admin_temp_out_min: 'External Min (°C)',
        admin_temp_out_max: 'External Max (°C)',
        admin_other_settings: 'Other Settings',
        admin_area_max: 'Max Area (m²)',
        admin_decimals: 'Decimal Precision',
        admin_save_settings: 'Save Settings',
        admin_reset_settings: 'Reset to Defaults',
        admin_export_title: 'Configuration Backup',
        admin_export_heading: 'Export Configuration',
        admin_export_desc: 'Download current settings and materials as a JSON file.',
        admin_export_btn: 'Export to JSON',
        admin_import_heading: 'Import Configuration',
        admin_import_desc: 'Upload a previously exported JSON file to restore settings.',
        admin_import_btn: 'Import from JSON',
        admin_reset_heading: 'Reset All',
        admin_reset_desc: 'Clear all custom settings and restore factory defaults.',
        admin_reset_btn: 'Reset to Factory Defaults',
        admin_cancel: 'Cancel',
        admin_save: 'Save',
        admin_delete_confirm: 'Are you sure you want to delete this material?',
        admin_reset_confirm: 'Are you sure you want to reset all settings to factory defaults? This cannot be undone.',
        admin_settings_saved: 'Settings saved successfully!',
        admin_material_saved: 'Material saved successfully!',
        admin_material_deleted: 'Material deleted successfully!',
        admin_config_exported: 'Configuration exported!',
        admin_config_imported: 'Configuration imported successfully!',
        admin_config_reset: 'All settings reset to defaults!',
        admin_import_error: 'Error importing file. Please check the format.',
        lang_toggle: 'EN / BG'
    },
    bg: {
        admin_login_title: 'Администраторски Достъп',
        admin_password_label: 'Парола',
        admin_login_error: 'Грешна парола',
        admin_login_btn: 'Влез в Панела',
        admin_back_to_calc: 'Назад към Калкулатора',
        admin_panel_title: 'Контролен Панел',
        admin_panel_subtitle: 'Управлявай настройки, материали и формули',
        admin_tab_formula: 'Формула',
        admin_tab_materials: 'Материали',
        admin_tab_settings: 'Настройки',
        admin_tab_export: 'Експорт/Импорт',
        admin_formula_title: 'Формула за Топлинни Загуби',
        formula_q_desc: 'Топлинна загуба (Вата)',
        formula_u_desc: 'Термично съпротивление (W/m²K)',
        formula_lambda_desc: 'Топлопроводимост (W/mK)',
        formula_d_desc: 'Дебелина на материала (m)',
        formula_a_desc: 'Площ на стената (m²)',
        formula_dt_desc: 'Температурна разлика (°C)',
        formula_note: 'Формулата се базира на стационарен топлообмен през еднослойна стена.',
        admin_materials_title: 'База Данни с Материали',
        admin_add_material: 'Добави Материал',
        admin_edit_material: 'Редактирай Материал',
        admin_th_name_en: 'Име (EN)',
        admin_th_name_bg: 'Име (BG)',
        admin_th_lambda: 'λ (W/mK)',
        admin_th_max_thickness: 'Макс. Дебелина (cm)',
        admin_th_actions: 'Действия',
        admin_settings_title: 'Настройки на Калкулатора',
        admin_temp_settings: 'Температурни Граници',
        admin_temp_in_min: 'Вътрешна Мин. (°C)',
        admin_temp_in_max: 'Вътрешна Макс. (°C)',
        admin_temp_out_min: 'Външна Мин. (°C)',
        admin_temp_out_max: 'Външна Макс. (°C)',
        admin_other_settings: 'Други Настройки',
        admin_area_max: 'Макс. Площ (m²)',
        admin_decimals: 'Десетични Знаци',
        admin_save_settings: 'Запази Настройки',
        admin_reset_settings: 'Нулирай до Стойности по Подразбиране',
        admin_export_title: 'Резервно Копие на Конфигурация',
        admin_export_heading: 'Експорт на Конфигурация',
        admin_export_desc: 'Изтегли текущите настройки и материали като JSON файл.',
        admin_export_btn: 'Експорт като JSON',
        admin_import_heading: 'Импорт на Конфигурация',
        admin_import_desc: 'Качи предишно експортиран JSON файл за възстановяване.',
        admin_import_btn: 'Импорт от JSON',
        admin_reset_heading: 'Нулиране',
        admin_reset_desc: 'Изчисти всички персонализирани настройки и възстанови фабричните.',
        admin_reset_btn: 'Нулирай Всичко',
        admin_cancel: 'Отказ',
        admin_save: 'Запази',
        admin_delete_confirm: 'Сигурни ли сте, че искате да изтриете този материал?',
        admin_reset_confirm: 'Сигурни ли сте, че искате да нулирате всички настройки? Това не може да бъде отменено.',
        admin_settings_saved: 'Настройките са запазени успешно!',
        admin_material_saved: 'Материалът е запазен успешно!',
        admin_material_deleted: 'Материалът е изтрит успешно!',
        admin_config_exported: 'Конфигурацията е експортирана!',
        admin_config_imported: 'Конфигурацията е импортирана успешно!',
        admin_config_reset: 'Всички настройки са нулирани!',
        admin_import_error: 'Грешка при импортиране. Проверете формата на файла.',
        lang_toggle: 'EN / BG'
    }
};

// Current language
let currentLang = localStorage.getItem('selectedLang') || 'bg';
let currentTheme = localStorage.getItem('calculatorTheme') || 'light';

// DOM Elements
const loginOverlay = document.getElementById('loginOverlay');
const adminPanel = document.getElementById('adminPanel');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const adminPassword = document.getElementById('adminPassword');
const logoutBtn = document.getElementById('logoutBtn');
const langToggleBtn = document.getElementById('langToggle');
const themeToggleBtn = document.getElementById('themeToggle');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    if (sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true') {
        showAdminPanel();
    }

    // Apply theme
    applyTheme(currentTheme);

    // Apply language
    updateLanguage(currentLang);

    // Initialize tabs
    initTabs();

    // Initialize materials
    renderMaterials();

    // Load settings
    loadSettings();

    // Initialize modal
    initModal();

    // Initialize export/import
    initExportImport();
});

// Login form handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (adminPassword.value === ADMIN_PASSWORD) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
        showAdminPanel();
        loginError.classList.add('d-none');
    } else {
        loginError.classList.remove('d-none');
        adminPassword.value = '';
        adminPassword.focus();
    }
});

// Logout handler
logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    location.reload();
});

// Theme toggle
themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
    localStorage.setItem('calculatorTheme', currentTheme);
});

// Language toggle
langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'bg' : 'en';
    localStorage.setItem('selectedLang', currentLang);
    updateLanguage(currentLang);
    renderMaterials();
});

function showAdminPanel() {
    loginOverlay.classList.add('d-none');
    adminPanel.classList.remove('d-none');
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        themeToggleBtn.innerHTML = '<i class="bi bi-moon-fill"></i>';
    } else {
        document.body.classList.remove('light-theme');
        themeToggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
    }
}

function updateLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

// Tab functionality
function initTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Hide all tab contents
            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));

            // Activate clicked tab
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab') + 'Tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Materials CRUD
function getMaterials() {
    const stored = localStorage.getItem(MATERIALS_KEY);
    return stored ? JSON.parse(stored) : [...DEFAULT_MATERIALS];
}

function saveMaterials(materials) {
    localStorage.setItem(MATERIALS_KEY, JSON.stringify(materials));
}

function renderMaterials() {
    const materials = getMaterials();
    const tbody = document.getElementById('materialsTableBody');
    tbody.innerHTML = '';

    materials.forEach(material => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${material.name_en}</td>
            <td>${material.name_bg}</td>
            <td>${material.lambda}</td>
            <td>${material.maxThickness}</td>
            <td class="actions-cell">
                <button type="button" class="btn-edit" data-id="${material.id}" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="btn-delete" data-id="${material.id}" title="Delete">
                    <i class="bi bi-trash3"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Add event listeners using delegation
    tbody.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            editMaterial(id);
        });
    });

    tbody.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            deleteMaterial(id);
        });
    });
}

// Modal functionality
function initModal() {
    const modal = document.getElementById('materialModal');
    const addBtn = document.getElementById('addMaterialBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelModalBtn');
    const form = document.getElementById('materialForm');

    addBtn.addEventListener('click', () => {
        openModal();
    });

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveMaterial();
    });
}

function openModal(material = null) {
    const modal = document.getElementById('materialModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('materialForm');

    form.reset();

    if (material) {
        title.textContent = translations[currentLang].admin_edit_material;
        document.getElementById('materialId').value = material.id;
        document.getElementById('materialNameEn').value = material.name_en;
        document.getElementById('materialNameBg').value = material.name_bg;
        document.getElementById('materialLambda').value = material.lambda;
        document.getElementById('materialMaxThickness').value = material.maxThickness;
    } else {
        title.textContent = translations[currentLang].admin_add_material;
        document.getElementById('materialId').value = '';
    }

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('materialModal').classList.remove('active');
}

function saveMaterial() {
    const id = document.getElementById('materialId').value;
    const materials = getMaterials();

    const newMaterial = {
        id: id || 'material_' + Date.now(),
        name_en: document.getElementById('materialNameEn').value,
        name_bg: document.getElementById('materialNameBg').value,
        lambda: parseFloat(document.getElementById('materialLambda').value),
        maxThickness: parseInt(document.getElementById('materialMaxThickness').value)
    };

    if (id) {
        // Edit existing
        const index = materials.findIndex(m => m.id === id);
        if (index !== -1) {
            materials[index] = newMaterial;
        }
    } else {
        // Add new
        materials.push(newMaterial);
    }

    saveMaterials(materials);
    renderMaterials();
    closeModal();
    showToast(translations[currentLang].admin_material_saved);
}

// Material CRUD functions
function editMaterial(id) {
    const materials = getMaterials();
    // Convert to string for comparison (data-id attribute is always a string)
    const material = materials.find(m => String(m.id) === String(id));
    if (material) {
        openModal(material);
    }
}

function deleteMaterial(id) {
    if (confirm(translations[currentLang].admin_delete_confirm)) {
        // Convert to string for comparison (data-id attribute is always a string)
        const materials = getMaterials().filter(m => String(m.id) !== String(id));
        saveMaterials(materials);
        renderMaterials();
        showToast(translations[currentLang].admin_material_deleted);
    }
}

// Settings management
function getSettings() {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : { ...DEFAULT_SETTINGS };
}

function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function loadSettings() {
    const settings = getSettings();

    document.getElementById('tempInMin').value = settings.tempIn.min;
    document.getElementById('tempInMax').value = settings.tempIn.max;
    document.getElementById('tempOutMin').value = settings.tempOut.min;
    document.getElementById('tempOutMax').value = settings.tempOut.max;
    document.getElementById('areaMax').value = settings.areaMax;
    document.getElementById('decimals').value = settings.decimals;
}

// Settings form handler
document.getElementById('settingsForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const settings = {
        tempIn: {
            min: parseInt(document.getElementById('tempInMin').value),
            max: parseInt(document.getElementById('tempInMax').value)
        },
        tempOut: {
            min: parseInt(document.getElementById('tempOutMin').value),
            max: parseInt(document.getElementById('tempOutMax').value)
        },
        areaMax: parseInt(document.getElementById('areaMax').value),
        decimals: parseInt(document.getElementById('decimals').value)
    };

    saveSettings(settings);
    showToast(translations[currentLang].admin_settings_saved);
});

// Reset settings button
document.getElementById('resetSettingsBtn').addEventListener('click', () => {
    loadSettings(); // Just reload current values (visual reset)
});

// Export/Import functionality
function initExportImport() {
    document.getElementById('exportBtn').addEventListener('click', exportConfig);
    document.getElementById('importFile').addEventListener('change', importConfig);
    document.getElementById('resetAllBtn').addEventListener('click', resetAll);
}

function exportConfig() {
    const config = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        materials: getMaterials(),
        settings: getSettings()
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecocalc-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast(translations[currentLang].admin_config_exported);
}

function importConfig(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const config = JSON.parse(event.target.result);

            if (config.materials && Array.isArray(config.materials)) {
                saveMaterials(config.materials);
                renderMaterials();
            }

            if (config.settings) {
                saveSettings(config.settings);
                loadSettings();
            }

            showToast(translations[currentLang].admin_config_imported);
        } catch (error) {
            showToast(translations[currentLang].admin_import_error);
            console.error('Import error:', error);
        }
    };
    reader.readAsText(file);

    // Reset input
    e.target.value = '';
}

function resetAll() {
    if (confirm(translations[currentLang].admin_reset_confirm)) {
        localStorage.removeItem(MATERIALS_KEY);
        localStorage.removeItem(SETTINGS_KEY);
        renderMaterials();
        loadSettings();
        showToast(translations[currentLang].admin_config_reset);
    }
}

// Toast notification
function showToast(message) {
    const toastEl = document.getElementById('adminToast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.innerHTML = `<i class="bi bi-check-circle-fill me-2" style="color: var(--accent-green);"></i>${message}`;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}
