const orderForm = document.getElementById('orderForm');
const namaPembeliInput = document.getElementById('namaPembeli');
const pilihanPaketInput = document.getElementById('pilihanPaket');
const jumlahBarangInput = document.getElementById('jumlahBarang');
const totalHargaDisplay = document.getElementById('totalHarga');

function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

function hitungTotal() {
    const hargaPaket = parseInt(pilihanPaketInput.value);
    const jumlahBarang = parseInt(jumlahBarangInput.value);

    // Cek Keamanan: Mencegah input jumlah tidak valid
    if (jumlahBarang < 1 || isNaN(jumlahBarang)) {
        totalHargaDisplay.innerText = "Jumlah tidak valid";
        return;
    }

    const total = hargaPaket * jumlahBarang;
    totalHargaDisplay.innerText = formatRupiah(total);
}

pilihanPaketInput.addEventListener('change', hitungTotal);
jumlahBarangInput.addEventListener('input', hitungTotal);

// Ekosistem Checkout: Mengarahkan ke halaman Invoice
orderForm.addEventListener('submit', function(event) {
    event.preventDefault(); 

    // encodeURIComponent digunakan untuk mengamankan spasi/karakter khusus pada URL
    const nama = encodeURIComponent(namaPembeliInput.value.trim());
    const paketText = encodeURIComponent(pilihanPaketInput.options[pilihanPaketInput.selectedIndex].text);
    const jumlah = encodeURIComponent(jumlahBarangInput.value);
    const total = encodeURIComponent(parseInt(pilihanPaketInput.value) * parseInt(jumlah));

    // Pindah halaman ke invoice.html sambil membawa data pembeli
    window.location.href = `invoice.html?nama=${nama}&paket=${paketText}&jumlah=${jumlah}&total=${total}`;
});
