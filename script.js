// ... [TETAP GUNAKAN KODE THEME, TILT, MODAL, DLL DARI SEBELUMNYA] ...

// 6. Form Logika & Sanitasi Keamanan (XSS Prevention)
const orderForm = document.getElementById('orderForm');
const namaPembeliInput = document.getElementById('namaPembeli');
const pilihanPaketInput = document.getElementById('pilihanPaket');
const jumlahBarangInput = document.getElementById('jumlahBarang');
const linkReferensiInput = document.getElementById('linkReferensi'); // INPUT BARU
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
        
        // MENGAMBIL LINK REFERENSI (Jika kosong, isi dengan 'Tidak ada')
        let refValue = linkReferensiInput.value.trim();
        let linkAman = refValue ? encodeURIComponent(refValue) : "Tidak+ada";
        
        // Passing Link ke halaman invoice
        window.location.href = `invoice.html?nama=${nama}&paket=${paketText}&jumlah=${jumlah}&total=${total}&link=${linkAman}`;
    });
}

// ... [TETAP GUNAKAN KODE INTERSECTION OBSERVER DARI SEBELUMNYA] ...
