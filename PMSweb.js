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
    if (phoneInput.value.length === 10 && /^\d+$/.test(phoneInput.value)) {
        phoneNumber = phoneInput.value;
        showPage(2);
    } else {
        alert("Please enter a valid 10-digit phone number");
    }
}

function selectVehicle(type) {
    vehicleType = type;
    generateQR();
    showPage(3);
    
    // Simulate backend response
    setTimeout(() => { // Replace with actual backend call
        if(defaultBackendResponse) showPage(4);
    }, 2000);
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
        case 6: 
            document.getElementById('finalQrPage').classList.add('active');
            generateFinalQR();
            break;
        case 7: 
            document.getElementById('thankyouPage').classList.add('active');
            setTimeout(() => showPage(1), 60000); // Redirect after 1 minute
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
    document.getElementById('costDisplay span').textContent = cost;
    showPage(5);
}

function payNow() {
    showPage(6);
    
    // Simulate backend response
    setTimeout(() => { // Replace with actual backend call
        if(defaultBackendResponse) showPage(7);
    }, 2000);
}

function generateFinalQR() {
    const finalCode = Math.floor(1000 + Math.random() * 9000); // 4-digit code
    document.getElementById('finalQrContainer').innerHTML = "";
    new QRCode(document.getElementById('finalQrContainer'), {
        text: finalCode.toString(),
        width: 200,
        height: 200
    });
    
    // Here you would send the code to backend
    // sendToBackend(finalCode);
}