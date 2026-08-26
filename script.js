// ==========================================
// 1. PENGATURAN TEMA (DARK/LIGHT MODE)
// ==========================================
const themeToggleBtn = document.getElementById('themeToggle');
const body = document.body;

// Mengecek preferensi tema yang disimpan sebelumnya
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    if (themeToggleBtn) themeToggleBtn.innerText = '🌙 Gelap';
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            themeToggleBtn.innerText = '🌙 Gelap';
        } else {
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerText = '☀️ Terang';
        }
    });
}

// 2. Menghilangkan Loading Screen
window.addEventListener('load', function() {
    const loader = document.getElementById('loading-screen');
    if (loader) { setTimeout(() => { loader.classList.add('fade-out'); }, 500); }
});

// 3. 3D Tilt Effect & Lightbox Modal
const portfolioCards = document.querySelectorAll('.portfolio-item');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeModalBtn = document.getElementById('closeModal');
const modalBackdrop = document.getElementById('modalBackdrop');

portfolioCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -12; 
        const rotateY = ((x - centerX) / centerX) * 12;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.5s ease-out';
    });
    
    card.addEventListener('mouseenter', () => { card.style.transition = 'none'; });

    card.addEventListener('click', () => {
        const imgSrc = card.querySelector('.portfolio-img').src;
        if(modalImg) {
            modalImg.src = imgSrc;
            modal.classList.add('modal-show');
        }
    });
});

function closeModal() {
    if(modal) {
        modal.classList.remove('modal-show');
        setTimeout(() => { modalImg.src = ""; }, 300);
    }
}
if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if(modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('modal-show')) closeModal();
});

// 4. FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        question.classList.toggle('active');
        const answer = question.nextElementSibling;
        if (question.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
            answer.style.maxHeight = 0;
        }
    });
});

// 5. Toast Notification
function showToast(message) {
    const toast = document.getElementById('toastNotification');
    if(toast) {
        toast.innerText = message;
        toast.className = 'toast-show';
        setTimeout(() => { toast.className = 'toast-hidden'; }, 3000);
    }
}

// 6. Form Logika & Sanitasi Keamanan (XSS Prevention)
const orderForm = document.getElementById('orderForm');
const namaPembeliInput = document.getElementById('namaPembeli');
const pilihanPaketInput = document.getElementById('pilihanPaket');
const jumlahBarangInput = document.getElementById('jumlahBarang');
const totalHargaDisplay = document.getElementById('totalHarga');

function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
}

function hitungTotal() {
    if (!pilihanPaketInput || !jumlahBarangInput || !totalHargaDisplay) return;
    const hargaPaket = parseInt(pilihanPaketInput.value);
    const jumlahBarang = parseInt(jumlahBarangInput.value);

    if (jumlahBarang < 1 || isNaN(jumlahBarang)) {
        totalHargaDisplay.innerText = "Tidak valid";
        return;
    }
    const total = hargaPaket * jumlahBarang;
    totalHargaDisplay.innerText = formatRupiah(total);
}

if (pilihanPaketInput && jumlahBarangInput) {
    pilihanPaketInput.addEventListener('change', hitungTotal);
    jumlahBarangInput.addEventListener('input', hitungTotal);
}

if (orderForm) {
    orderForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        let namaRaw = namaPembeliInput.value.trim();
        let namaAman = namaRaw.replace(/[^a-zA-Z0-9 ]/g, "");

        if (namaAman === "") {
            showToast("Sistem Keamanan: Masukkan nama tanpa karakter khusus (<, >, dll).");
            return;
        }

        const nama = encodeURIComponent(namaAman);
        const paketText = encodeURIComponent(pilihanPaketInput.options[pilihanPaketInput.selectedIndex].text);
        const jumlah = encodeURIComponent(jumlahBarangInput.value);
        const total = encodeURIComponent(parseInt(pilihanPaketInput.value) * parseInt(jumlahBarangInput.value));
        
        window.location.href = `invoice.html?nama=${nama}&paket=${paketText}&jumlah=${jumlah}&total=${total}`;
    });
}

// 7. SCROLL REVEAL ANIMATION
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, { root: null, threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

revealElements.forEach(el => { revealObserver.observe(el); });
