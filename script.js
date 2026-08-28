// ==========================================
// 1. UPDATE SLOT OTOMATIS VIA GOOGLE SHEETS
// ==========================================
async function updateSlotKomisi() {
    // GANTI TAUTAN DI BAWAH INI dengan link CSV dari Google Sheets Anda
    const sheetURL = 'URL_CSV_ANDA_DI_SINI'; 
    const badgeElement = document.getElementById('slotBadge');
    if (!badgeElement) return;

    try {
        const response = await fetch(sheetURL);
        const data = await response.text();
        const [terisi, maksimal] = data.split(',');
        const sisaSlot = parseInt(maksimal) - parseInt(terisi);

        if (sisaSlot > 0) {
            badgeElement.innerHTML = `Open Commission: ${sisaSlot} Slots Available`;
            document.querySelector('.pulse-dot').style.background = 'var(--accent)';
            document.querySelector('.pulse-dot').style.boxShadow = '0 0 10px var(--accent)';
        } else {
            badgeElement.innerHTML = `Commissions Full (Closed)`;
            document.querySelector('.pulse-dot').style.background = '#EF4444';
            document.querySelector('.pulse-dot').style.boxShadow = '0 0 10px #EF4444';
        }
    } catch (error) {
        console.error("Gagal memuat slot, menggunakan nilai fallback", error);
        badgeElement.innerHTML = `Open Commission: 3/5 Slots Available`;
    }
}
window.addEventListener('load', updateSlotKomisi);

// ==========================================
// 2. MAGNETIC BUTTON, RIPPLE & HAPTIC FEEDBACK
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
        if (navigator.vibrate) { navigator.vibrate(50); } // Haptic feedback untuk HP
        const rect = e.target.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left; const y = clientY - rect.top;
        
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
// 3. KURSOR KUSTOM
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

// ==========================================
// 4. ANIMASI TEMA (VIEW TRANSITIONS API)
// ==========================================
const themeToggleBtn = document.getElementById('themeToggle');
const body = document.body;

function updateThemeUI() {
    if (body.classList.contains('light-mode')) { 
        localStorage.setItem('theme', 'light'); 
        if (themeToggleBtn) themeToggleBtn.innerHTML = '🌙 Gelap'; 
    } else { 
        localStorage.setItem('theme', 'dark'); 
        if (themeToggleBtn) themeToggleBtn.innerHTML = '☀️ Terang'; 
    }
}

if (localStorage.getItem('theme') === 'light') { body.classList.add('light-mode'); updateThemeUI(); }

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
        if (!document.startViewTransition) {
            body.classList.toggle('light-mode'); updateThemeUI(); return;
        }
        const x = e.clientX; const y = e.clientY;
        const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

        const transition = document.startViewTransition(() => {
            body.classList.toggle('light-mode'); updateThemeUI();
        });

        transition.ready.then(() => {
            document.documentElement.animate(
                { clipPath: [ `circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)` ] },
                { duration: 600, easing: 'ease-out', pseudoElement: '::view-transition-new(root)' }
            );
        });
    });
}

// ==========================================
// 5. CYBERPUNK TEXT SCRAMBLE
// ==========================================
class TextScramble {
    constructor(el) {
        this.el = el; this.chars = '!<>-_\\/[]{}—=+*^?#________'; this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || ''; const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0; this.update(); return promise;
    }
    update() {
        let output = ''; let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) { complete++; output += to; } 
            else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) { char = this.randomChar(); this.queue[i].char = char; }
                output += `<span style="opacity: 0.5;">${char}</span>`;
            } else { output += from; }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) { this.resolve(); } 
        else { this.frameRequest = requestAnimationFrame(this.update); this.frame++; }
    }
    randomChar() { return this.chars[Math.floor(Math.random() * this.chars.length)]; }
}

window.addEventListener('load', function() {
    const loader = document.getElementById('loading-screen');
    if (loader) { 
        setTimeout(() => { 
            loader.classList.add('fade-out'); 
            // Mulai text scramble setelah loading
            setTimeout(() => {
                const el = document.querySelector('.scramble-text');
                if (el) { const fx = new TextScramble(el); fx.setText(el.getAttribute('data-text')); }
            }, 300);
        }, 500); 
    }
});

// ==========================================
// 6. TILT EFFECT, MODAL & SCROLL REVEAL
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

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('active'); observer.unobserve(entry.target); } });
}, { root: null, threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
revealElements.forEach(el => { revealObserver.observe(el); });

const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        question.classList.toggle('active');
        const answer = question.nextElementSibling;
        if (question.classList.contains('active')) { answer.style.maxHeight = answer.scrollHeight + "px"; } 
        else { answer.style.maxHeight = 0; }
    });
});

function showToast(message) {
    const toast = document.getElementById('toastNotification');
    if(toast) { toast.innerText = message; toast.className = 'toast-show'; setTimeout(() => { toast.className = 'toast-hidden'; }, 3000); }
}

// ==========================================
// 7. FORM LOGIC & PAGE TRANSITION CURTAIN
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
if (pilihanPaketInput && jumlahBarangInput) { pilihanPaketInput.addEventListener('change', hitungTotal); jumlahBarangInput.addEventListener('input', hitungTotal); }

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

        submitBtn.innerText = "Memproses..."; submitBtn.style.opacity = "0.7"; submitBtn.disabled = true;

        // 1. Munculkan tirai transisi halaman
        const transitionCurtain = document.querySelector('.page-transition');
        if(transitionCurtain) transitionCurtain.classList.add('slide-in');

        // 2. Pindah ke invoice setelah tirai menutupi layar (0.8 detik)
        setTimeout(() => {
            const enc = encodeURIComponent;
            window.location.href = `invoice.html?nama=${enc(namaAman)}&paket=${enc(paketTeks)}&jumlah=${enc(jumlahBarangInput.value)}&total=${enc(totalHarga)}&link=${enc(linkAmanText)}`;
        }, 800);
    });
}
