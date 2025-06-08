let currentPage = 1;
let phoneNumber = "";
let vehicleType = 0;
let startTime = null;
let timerInterval = null;

// Temporary default values
const defaultCostPer30Min = 0; // From backend (replace with actual value)
const defaultBackendResponse = true; // From backend (replace with actual check)

function validatePhone() {
    const phoneInput = document.getElementById('phone');
    const phoneValue = phoneInput.value;
    
    if (/^[1-9]{10}$/.test(phoneValue)) {
        phoneNumber = phoneValue;
        showPage(2);
    } else {
        alert("Please enter a valid 10-digit number (digits 1-9 only)");
    }
}

// Input validation for phone number
document.getElementById('phone').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^1-9]/g, '');
});

document.getElementById('phone').addEventListener('keypress', function(e) {
    if (e.key < '1' || e.key > '9') {
        e.preventDefault();
    }
});

function selectVehicle(type) {
    vehicleType = type;
    generateQR();
    showPage(3);
}

function simulateBackend() {
    // Bypass backend check for testing
    if(defaultBackendResponse) showPage(4);
}

function generateQR() {
    const qrData = vehicleType + phoneNumber;
    document.getElementById('qrContainer').innerHTML = "";
    new QRCode(document.getElementById('qrContainer'), {
        text: qrData,
        width: 200,
        height: 200
    });
}

function showPage(pageNumber) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    switch(pageNumber) {
        case 1: document.getElementById('loginPage').classList.add('active'); break;
        case 2: document.getElementById('vehiclePage').classList.add('active'); break;
        case 3: document.getElementById('qrPage').classList.add('active'); break;
        case 4: 
            document.getElementById('timerPage').classList.add('active');
            startTimer();
            break;
        case 5: document.getElementById('paymentPage').classList.add('active'); break;
        case 6: document.getElementById('finalQrPage').classList.add('active'); break;
        case 7: 
            document.getElementById('thankyouPage').classList.add('active');
            setTimeout(() => showPage(1), 60000);
            break;
    }
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        document.getElementById('timer').textContent = `${minutes}:${seconds}`;
    }, 1000);
}

function checkout() {
    clearInterval(timerInterval);
    const elapsedMinutes = Math.ceil((Date.now() - startTime) / (1000 * 60));
    const cost = Math.ceil(elapsedMinutes / 30) * defaultCostPer30Min;
    document.getElementById('costAmount').textContent = cost;
    showPage(5);
}

function payNow() {
    generateFinalQR();
    showPage(6);
}

function generateFinalQR() {
    const finalCode = Math.floor(1000 + Math.random() * 9000);
    document.getElementById('finalQrContainer').innerHTML = "";
    new QRCode(document.getElementById('finalQrContainer'), {
        text: finalCode.toString(),
        width: 200,
        height: 200
    });
    
    // Here you would send the code to backend
    // sendToBackend(finalCode);
}