// DOM Elements
const viewIntro = document.getElementById('view-intro');
const viewScanner = document.getElementById('view-scanner');
const viewLoading = document.getElementById('view-loading');
const viewWarning = document.getElementById('view-warning');
const viewResults = document.getElementById('view-results');

const btnStart = document.getElementById('btn-start');
const btnYesDoctor = document.getElementById('btn-yes-doctor');
const warningText = document.getElementById('warning-text');
const btnCapture = document.getElementById('btn-capture');
const btnCancelScan = document.getElementById('btn-cancel-scan');
const btnRestart = document.getElementById('btn-restart');
const btnUpload = document.getElementById('btn-upload');
const imageUpload = document.getElementById('image-upload');

const videoElement = document.getElementById('camera-feed');
const imagePreview = document.getElementById('image-preview');
const scanLine = document.querySelector('.scan-line');
const loadingText = document.getElementById('loading-text');

// Results Elements
const resSkinIcon = document.getElementById('res-skin-icon');
const resSkinType = document.getElementById('res-skin-type');
const resSkinDesc = document.getElementById('res-skin-desc');
const resIngredients = document.getElementById('res-ingredients');
const resMoisturizer = document.getElementById('res-moisturizer');
const resSunscreen = document.getElementById('res-sunscreen');
const resConsultation = document.getElementById('res-consultation');

let stream = null;

// Skin Type Database (Mock Data)
const skinProfiles = [
    {
        type: 'Kulit Berjerawat (Acne-Prone)',
        icon: '🦠',
        desc: 'Kulit Anda rentan terhadap produksi sebum berlebih yang dapat menyumbat pori-pori dan menyebabkan jerawat.',
        ingredients: ['Salicylic Acid', 'Centella Asiatica', 'Niacinamide', 'Tea Tree'],
        moisturizer: 'Pelembap bertekstur gel yang ringan atau lotion bebas minyak.',
        sunscreen: 'Mineral sunscreen atau chemical sunscreen berbasis gel yang bersifat non-comedogenic.',
        consultation: 'Jika jerawat membesar, meradang parah, terasa nyeri (cystic/nodular acne), atau tidak membaik dengan produk over-the-counter, segera konsultasikan ke dokter spesialis kulit (dermatolog) untuk mendapatkan resep medis.',
        isSevere: true
    },
    {
        type: 'Kulit Berminyak (Oily)',
        icon: '✨',
        desc: 'Kulit Anda memproduksi minyak berlebih, terutama di area T-Zone, membuat wajah tampak mengkilap.',
        ingredients: ['Niacinamide', 'Clay', 'BHA'],
        moisturizer: 'Pelembap gel bebas minyak yang cepat meresap.',
        sunscreen: 'Sunscreen cair yang ringan dengan hasil akhir bebas kilap (matte-finish).',
        consultation: 'Jika produksi minyak berlebih disertai ruam kemerahan, rasa gatal bersisik (dermatitis seboroik), atau pori-pori tersumbat parah, segera konsultasikan ke dokter spesialis kulit untuk pemeriksaan dan perawatan medis yang tepat.'
    },
    {
        type: 'Kulit Kering (Dry)',
        icon: '💧',
        desc: 'Kulit Anda kekurangan kelembapan dan sebum alami, sering terasa tertarik atau bersisik.',
        ingredients: ['Hyaluronic Acid', 'Ceramides', 'Glycerin', 'Squalane'],
        moisturizer: 'Pelembap bertekstur krim kaya nutrisi (rich cream) atau ointment untuk mengunci kelembapan.',
        sunscreen: 'Sunscreen bertekstur krim yang memberikan hidrasi ekstra.',
        consultation: 'Jika kulit mengalami mengelupas hebat, pecah-pecah, berdarah, atau terasa gatal parah yang tidak berkurang dengan pelembap biasa, segera konsultasikan ke dokter spesialis kulit untuk mendeteksi potensi eksim (dermatitis atopik) atau psoriasis.'
    },
    {
        type: 'Kulit Kombinasi (Combination)',
        icon: '☯️',
        desc: 'Kombinasi antara area berminyak (biasanya T-Zone) dan area normal/kering di bagian pipi.',
        ingredients: ['Hyaluronic Acid', 'Lactic Acid', 'Vitamin C'],
        moisturizer: 'Lotion ringan yang seimbang, tidak terlalu berat namun cukup melembapkan.',
        sunscreen: 'Sunscreen bertekstur lotion atau essence yang ringan.',
        consultation: 'Jika ada area wajah yang sangat meradang atau mengalami iritasi berulang yang tidak teratasi dengan rutinitas dasar, disarankan berkonsultasi ke dokter spesialis.'
    },
    {
        type: 'Kulit Sensitif (Sensitive)',
        icon: '🌸',
        desc: 'Kulit Anda mudah bereaksi terhadap produk tertentu, sering kemerahan, atau gatal.',
        ingredients: ['Hindari eksfoliasi', 'Pewangi (fragrance) Free', 'Alkohol Free', 'Ceramides/Cica'],
        moisturizer: 'Krim pelembap penenang benteng kulit (soothing barrier cream) dengan formula hipoalergenik.',
        sunscreen: 'Physical/mineral sunscreen berbahan dasar Zinc Oxide atau Titanium Dioxide.',
        consultation: 'Jika kulit mengalami reaksi alergi berat, sensasi terbakar yang menetap, atau ruam parah akibat ketidakcocokan produk, segera konsultasikan ke dokter spesialis kulit dan hentikan seluruh penggunaan bahan aktif sementara.',
        isSevere: true
    }
];

// Helper to switch views
function switchView(viewToShow) {
    [viewIntro, viewScanner, viewLoading, viewWarning, viewResults].forEach(view => {
        if (view) {
            view.classList.add('hidden');
            view.classList.remove('active');
        }
    });
    viewToShow.classList.remove('hidden');
    viewToShow.classList.add('active');
}

// Start Camera
async function startCamera() {
    try {
        videoElement.classList.remove('hidden');
        imagePreview.classList.add('hidden');
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' }, 
            audio: false 
        });
        videoElement.srcObject = stream;
        
        // Wait for video to be ready
        videoElement.onloadedmetadata = () => {
            btnCapture.disabled = false;
        };
        switchView(viewScanner);
    } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("Tidak dapat mengakses kamera. Pastikan Anda telah memberikan izin akses kamera pada browser Anda.");
    }
}

// Stop Camera
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    videoElement.srcObject = null;
}

// Start Scanning Animation
function startScanning() {
    btnCapture.classList.add('scanning');
    btnCapture.textContent = "Sedang Memindai...";
    scanLine.classList.add('scanning');
    
    // Simulate scan duration
    setTimeout(() => {
        btnCapture.classList.remove('scanning');
        scanLine.classList.remove('scanning');
        stopCamera();
        startAnalysis();
    }, 2500);
}

// Start Loading/Analysis Simulation
function startAnalysis() {
    switchView(viewLoading);
    
    const loadingTexts = [
        "Menganalisis tekstur kulit...",
        "Mengevaluasi tingkat sebum...",
        "Mengukur hidrasi kulit...",
        "Menyiapkan rekomendasi skincare..."
    ];
    
    let step = 0;
    const textInterval = setInterval(() => {
        step++;
        if(step < loadingTexts.length) {
            loadingText.textContent = loadingTexts[step];
        }
    }, 1200);
    
    // Simulate analysis completion after 5 seconds
    setTimeout(() => {
        clearInterval(textInterval);
        showResults();
    }, 5000);
}

// Show Results
function showResults() {
    // Pick a random skin profile for simulation
    const randomProfile = skinProfiles[Math.floor(Math.random() * skinProfiles.length)];
    
    // Populate UI
    resSkinIcon.textContent = randomProfile.icon;
    resSkinType.textContent = randomProfile.type;
    resSkinDesc.textContent = randomProfile.desc;
    
    resIngredients.innerHTML = randomProfile.ingredients.map(ing => `<li>${ing}</li>`).join('');
    resMoisturizer.textContent = randomProfile.moisturizer;
    resSunscreen.textContent = randomProfile.sunscreen;
    resConsultation.textContent = randomProfile.consultation;
    
    if (randomProfile.isSevere) {
        if(warningText) warningText.textContent = randomProfile.consultation;
        switchView(viewWarning);
    } else {
        switchView(viewResults);
    }
}

// Event Listeners
btnStart.addEventListener('click', startCamera);

if (btnYesDoctor) {
    btnYesDoctor.addEventListener('click', () => {
        switchView(viewResults);
    });
}

btnUpload.addEventListener('click', () => {
    imageUpload.click();
});

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            videoElement.classList.add('hidden');
            imagePreview.src = event.target.result;
            imagePreview.classList.remove('hidden');
            btnCapture.disabled = false;
            switchView(viewScanner);
            // Reset input so the same file can be selected again
            imageUpload.value = '';
        }
        reader.readAsDataURL(file);
    }
});

btnCapture.addEventListener('click', () => {
    btnCapture.disabled = true;
    startScanning();
});

btnCancelScan.addEventListener('click', () => {
    stopCamera();
    switchView(viewIntro);
});

btnRestart.addEventListener('click', () => {
    switchView(viewIntro);
});
