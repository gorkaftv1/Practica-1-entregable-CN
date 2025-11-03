// Configuration
let config = {
    apiUrl: localStorage.getItem('apiUrl') || 'http://localhost:8080',
    apiKey: localStorage.getItem('apiKey') || ''
};

// DOM Elements
const apiUrlInput = document.getElementById('apiUrl');
const apiKeyInput = document.getElementById('apiKey');
const toggleApiKeyBtn = document.getElementById('toggleApiKey');
const saveConfigBtn = document.getElementById('saveConfig');
const testConnectionBtn = document.getElementById('testConnection');
const connectionStatus = document.getElementById('connectionStatus');
const toggleConfigBtn = document.getElementById('toggleConfig');
const configPanel = document.getElementById('configPanel');
const refreshCarsBtn = document.getElementById('refreshCars');
const addCarBtn = document.getElementById('addCarBtn');
const carsContainer = document.getElementById('carsContainer');
const totalCarsElement = document.getElementById('totalCars');
const carModal = document.getElementById('carModal');
const modalTitle = document.getElementById('modalTitle');
const carForm = document.getElementById('carForm');
const closeModal = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');
const toast = document.getElementById('toast');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    setupEventListeners();
    loadCars();
});

// Load saved configuration
function loadConfig() {
    apiUrlInput.value = config.apiUrl;
    apiKeyInput.value = config.apiKey;
}

// Setup Event Listeners
function setupEventListeners() {
    toggleApiKeyBtn.addEventListener('click', toggleApiKeyVisibility);
    saveConfigBtn.addEventListener('click', saveConfiguration);
    testConnectionBtn.addEventListener('click', testConnection);
    toggleConfigBtn.addEventListener('click', toggleConfigPanel);
    refreshCarsBtn.addEventListener('click', loadCars);
    addCarBtn.addEventListener('click', openAddCarModal);
    closeModal.addEventListener('click', closeCarModal);
    cancelBtn.addEventListener('click', closeCarModal);
    carForm.addEventListener('submit', handleCarSubmit);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === carModal) {
            closeCarModal();
        }
    });
}

// Toggle API Key Visibility
function toggleApiKeyVisibility() {
    const type = apiKeyInput.type === 'password' ? 'text' : 'password';
    apiKeyInput.type = type;
    toggleApiKeyBtn.textContent = type === 'password' ? '👁️' : '🙈';
}

// Save Configuration
function saveConfiguration() {
    config.apiUrl = apiUrlInput.value.trim().replace(/\/$/, ''); // Remove trailing slash
    config.apiKey = apiKeyInput.value.trim();
    
    localStorage.setItem('apiUrl', config.apiUrl);
    localStorage.setItem('apiKey', config.apiKey);
    
    showStatus('success', '✅ Configuración guardada correctamente');
    showToast('Configuración guardada', 'success');
}

// Test Connection
async function testConnection() {
    if (!config.apiUrl) {
        showStatus('error', '❌ Por favor, configura la URL de la API primero');
        return;
    }

    showStatus('', 'Probando conexión...');
    
    try {
        const response = await fetch(`${config.apiUrl}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            showStatus('success', `✅ Conexión exitosa! Servidor: ${data.message || 'API funcionando'}`);
            showToast('Conexión exitosa', 'success');
        } else {
            showStatus('error', `❌ Error: ${response.status} - ${response.statusText}`);
            showToast('Error de conexión', 'error');
        }
    } catch (error) {
        showStatus('error', `❌ Error de conexión: ${error.message}`);
        showToast('No se puede conectar con la API', 'error');
    }
}

// Show Status Message
function showStatus(type, message) {
    connectionStatus.textContent = message;
    connectionStatus.className = 'status-message';
    if (type) {
        connectionStatus.classList.add(type);
    }
}

// Toggle Config Panel
function toggleConfigPanel() {
    configPanel.classList.toggle('collapsed');
}

// Load Cars
async function loadCars() {
    if (!config.apiUrl) {
        showToast('Por favor, configura la URL de la API', 'warning');
        return;
    }

    carsContainer.innerHTML = '<div class="loading">Cargando coches...</div>';

    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (config.apiKey) {
            headers['x-api-key'] = config.apiKey;
        }

        const response = await fetch(`${config.apiUrl}/cars`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            if (response.status === 403 || response.status === 401) {
                throw new Error('API Key inválida o faltante');
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.success && result.data) {
            displayCars(result.data);
            totalCarsElement.textContent = result.data.length || result.count || 0;
        } else {
            throw new Error(result.error || 'Error al cargar los coches');
        }
    } catch (error) {
        console.error('Error loading cars:', error);
        carsContainer.innerHTML = `
            <div class="empty-state">
                <h3>😞 Error</h3>
                <p>${error.message}</p>
                <button class="btn btn-primary" onclick="loadCars()">🔄 Reintentar</button>
            </div>
        `;
        showToast(error.message, 'error');
    }
}

// Display Cars
function displayCars(cars) {
    if (!cars || cars.length === 0) {
        carsContainer.innerHTML = `
            <div class="empty-state">
                <h3>🚗 No hay coches</h3>
                <p>Agrega tu primer coche usando el botón "Nuevo Coche"</p>
            </div>
        `;
        return;
    }

    carsContainer.innerHTML = cars.map(car => `
        <div class="car-card">
            <h3>🚗 ${car.make} ${car.model}</h3>
            <div class="car-info">
                <p><strong>Matrícula:</strong> ${car.plate || 'N/A'}</p>
                <p><strong>Año:</strong> ${car.year || 'N/A'}</p>
                <p><strong>Propietario:</strong> ${car.owner || 'N/A'}</p>
                <p><strong>ID:</strong> ${car.id}</p>
            </div>
            <div class="car-actions">
                <button class="btn btn-primary" onclick='editCar(${JSON.stringify(car)})'>✏️ Editar</button>
                <button class="btn btn-danger" onclick="deleteCar('${car.id}')">🗑️ Eliminar</button>
            </div>
        </div>
    `).join('');
}

// Open Add Car Modal
function openAddCarModal() {
    modalTitle.textContent = 'Nuevo Coche';
    carForm.reset();
    document.getElementById('carId').value = '';
    carModal.classList.add('show');
}

// Edit Car
function editCar(car) {
    modalTitle.textContent = 'Editar Coche';
    document.getElementById('carId').value = car.id;
    document.getElementById('plate').value = car.plate || '';
    document.getElementById('make').value = car.make || '';
    document.getElementById('model').value = car.model || '';
    document.getElementById('year').value = car.year || '';
    document.getElementById('owner').value = car.owner || '';
    carModal.classList.add('show');
}

// Close Car Modal
function closeCarModal() {
    carModal.classList.remove('show');
    carForm.reset();
}

// Handle Car Submit (Create or Update)
async function handleCarSubmit(e) {
    e.preventDefault();

    const carId = document.getElementById('carId').value;
    const carData = {
        plate: document.getElementById('plate').value.trim(),
        make: document.getElementById('make').value.trim(),
        model: document.getElementById('model').value.trim(),
        year: parseInt(document.getElementById('year').value),
        owner: document.getElementById('owner').value.trim()
    };

    const isEdit = !!carId;
    const url = isEdit ? `${config.apiUrl}/cars/${carId}` : `${config.apiUrl}/cars`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (config.apiKey) {
            headers['x-api-key'] = config.apiKey;
        }

        const response = await fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(carData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || `Error ${response.status}`);
        }

        if (result.success) {
            showToast(isEdit ? 'Coche actualizado correctamente' : 'Coche creado correctamente', 'success');
            closeCarModal();
            loadCars();
        } else {
            throw new Error(result.error || 'Error al guardar el coche');
        }
    } catch (error) {
        console.error('Error saving car:', error);
        showToast(error.message, 'error');
    }
}

// Delete Car
async function deleteCar(carId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este coche?')) {
        return;
    }

    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (config.apiKey) {
            headers['x-api-key'] = config.apiKey;
        }

        const response = await fetch(`${config.apiUrl}/cars/${carId}`, {
            method: 'DELETE',
            headers: headers
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || `Error ${response.status}`);
        }

        if (result.success) {
            showToast('Coche eliminado correctamente', 'success');
            loadCars();
        } else {
            throw new Error(result.error || 'Error al eliminar el coche');
        }
    } catch (error) {
        console.error('Error deleting car:', error);
        showToast(error.message, 'error');
    }
}

// Show Toast Notification
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
