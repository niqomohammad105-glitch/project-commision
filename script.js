// ==========================================
// 1. MAGNETIC BUTTON, RIPPLE & SPOTLIGHT CARD
// ==========================================
const magneticBtns = document.querySelectorAll('.magnetic-btn');
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3; 
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        btn.style.transition = 'transform 0.1s ease-out';
        btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        btn.style.transform = `translate(0px, 0px)`;
    });

    btn.addEventListener('click', function(e) {
        const x = e.clientX - e.target.getBoundingClientRect().left;
        const y = e.clientY - e.target.getBoundingClientRect().top;
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.left = `${x}px`; ripple.style.top = `${y}px`;
        const size = Math.max(this.clientWidth, this.clientHeight);
        ripple.style.width = ripple.style.height = `${size}px`;
        this.appendChild(ripple);
        setTimeout(() => { ripple.remove(); }, 600); 
    });
});

const spotlightCards = document.querySelectorAll('.spotlight-card');
spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ==========================================
// 2. KURSOR KUSTOM & THEME LOGIC
// ==========================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const hoverTargets = document.querySelectorAll('.hover-target, a, button, input, select');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX; const posY = e.clientY;
    if(cursorDot) { cursorDot.style.left = `${posX}px`; cursorDot.style.top = `${posY}px`; }
    if(cursorOutline) { cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" }); }
});

hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => { if(cursorOutline) cursorOutline.classList.add('hovered'); });
    target.addEventListener('mouseleave', () => { if(cursorOutline) cursorOutline.classList.remove('hovered'); });
});

const themeToggleBtn = document.getElementById('themeToggle');
const body = document.body;

if (localStorage.getItem('theme') === 'light') { body.classList.add('light-mode'); if (themeToggleBtn) themeToggleBtn.innerText = '🌙 Gelap'; }
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        if (body.classList.contains('light-mode')) { localStorage.setItem('theme', 'light'); themeToggleBtn.innerText = '🌙 Gelap'; } 
        else { localStorage.setItem('theme', 'dark'); themeToggleBtn.innerText = '☀️ Terang'; }
    });
}

window.addEventListener('load', function() {
    const loader = document.getElementById('loading-screen');
    if (loader) { setTimeout(() => { loader.classList.add('fade-out'); }, 500); }
});

// ==========================================
// 3. TILT EFFECT & MODAL
// ==========================================
const portfolioCards = document.querySelectorAll('.portfolio-item');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeModalBtn = document.getElementById('closeModal');

portfolioCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        const centerX = rect.width / 2; const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10; const rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
    card.addEventListener('mouseenter', () => { card.style.transition = 'none'; });
    card.addEventListener('click', () => {
        const imgSrc = card.querySelector('.portfolio-img').src;
        if(modalImg) { modalImg.src = imgSrc; modal.classList.add('modal-show'); }
    });
});

if(closeModalBtn) closeModalBtn.addEventListener('click', () => modal.classList.remove('modal-show'));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal) modal.classList.remove('modal-show'); });

function showToast(message) {
    const toast = document.getElementById('toastNotification');
    if(toast) { toast.innerText = message; toast.className = 'toast-show'; setTimeout(() => { toast.className = 'toast-hidden'; }, 3000); }
}

// ==========================================
// 4. FORM LOGIC, KALKULATOR & KEAMANAN
// ==========================================
const orderForm = document.getElementById('orderForm');
const namaPembeliInput = document.getElementById('namaPembeli');
const pilihanPaketInput = document.getElementById('pilihanPaket');
const jumlahBarangInput = document.getElementById('jumlahBarang');
const linkReferensiInput = document.getElementById('linkReferensi');
const tosCheckbox = document.getElementById('tos');
const totalHargaDisplay = document.getElementById('totalHarga');
const submitBtn = document.querySelector('.btn-action');

function hitungTotal() {
    if (!pilihanPaketInput || !jumlahBarangInput || !totalHargaDisplay) return;
    const total = parseInt(pilihanPaketInput.value) * parseInt(jumlahBarangInput.value);
    if (total < 1 || isNaN(total)) { totalHargaDisplay.innerText = "Tidak valid"; return; }
    totalHargaDisplay.innerText = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(total);
}

if (pilihanPaketInput && jumlahBarangInput) {
    pilihanPaketInput.addEventListener('change', hitungTotal);
    jumlahBarangInput.addEventListener('input', hitungTotal);
}

if (orderForm) {
    orderForm.setAttribute('novalidate', true); 
    
    orderForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        if (tosCheckbox && !tosCheckbox.checked) { showToast("Sistem: Harap centang persetujuan ToS."); return; }

        let namaAman = namaPembeliInput.value.trim().replace(/[^a-zA-Z0-9 ]/g, "");
        if (namaAman === "") { showToast("Sistem: Masukkan nama tanpa karakter khusus."); return; }

        const paketTeks = pilihanPaketInput.options[pilihanPaketInput.selectedIndex].text;
        const totalHarga = parseInt(pilihanPaketInput.value) * parseInt(jumlahBarangInput.value);
        let linkAmanText = linkReferensiInput.value.trim() ? linkReferensiInput.value.trim() : "Tidak ada";

        // Animasi UI tombol saat diklik
        const teksAsli = submitBtn.innerText;
        submitBtn.innerText = "Memproses..."; 
        submitBtn.style.opacity = "0.7"; 
        submitBtn.disabled = true;

        // Simulasi loading 0.8 detik agar terkesan sistem sedang bekerja
        setTimeout(() => {
            const enc = encodeURIComponent;
            window.location.href = `invoice.html?nama=${enc(namaAman)}&paket=${enc(paketTeks)}&jumlah=${enc(jumlahBarangInput.value)}&total=${enc(totalHarga)}&link=${enc(linkAmanText)}`;
        }, 800);
    });
}

// ==========================================
// 5. CINEMATIC SCROLL REVEAL
// ==========================================
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('active'); observer.unobserve(entry.target); } });
}, { root: null, threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
revealElements.forEach(el => { revealObserver.observe(el); });
