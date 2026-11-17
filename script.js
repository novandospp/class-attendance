// --- 1. PENGATURAN TANGGAL & NAVIGASI TAB ---
const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const sekarang = new Date();
const hariIni = namaHari[sekarang.getDay()];

document.getElementById("tanggal-hari-ini").textContent = 
    `${hariIni}, ${sekarang.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}`;

function bukaTab(idTab) {
    // Sembunyikan semua tab & hapus status aktif pada tombol
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

    // Tampilkan tab yang dipilih
    document.getElementById(idTab).classList.add("active");
    event.currentTarget.classList.add("active");
}

// --- 2. PENYIMPANAN LOKAL (LOCALSTORAGE) ---
let daftarSiswa = JSON.parse(localStorage.getItem("data_siswa")) || [];
let daftarJadwal = JSON.parse(localStorage.getItem("data_jadwal")) || [];
let daftarTugas = JSON.parse(localStorage.getItem("data_tugas")) || [];
let riwayatAbsensi = JSON.parse(localStorage.getItem("data_absensi")) || [];

function simpanKeMemori() {
    localStorage.setItem("data_siswa", JSON.stringify(daftarSiswa));
    localStorage.setItem("data_jadwal", JSON.stringify(daftarJadwal));
    localStorage.setItem("data_tugas", JSON.stringify(daftarTugas));
    localStorage.setItem("data_absensi", JSON.stringify(riwayatAbsensi));
}

// --- 3. FITUR JADWAL PELAJARAN ---
const formJadwal = document.getElementById("form-jadwal");
const listJadwalEl = document.getElementById("daftar-jadwal");
const pilihJadwalEl = document.getElementById("pilih-jadwal");

formJadwal.addEventListener("submit", function(e) {
    e.preventDefault();
    const hari = document.getElementById("hari-jadwal").value;
    const jam = document.getElementById("jam-jadwal").value;
    const mapel = document.getElementById("mapel-jadwal").value.trim();

    daftarJadwal.push({ id: Date.now(), hari, jam, mapel });
    simpanKeMemori();
    formJadwal.reset();
    tampilkanJadwal();
});

function hapusJadwal(id) {
    daftarJadwal = daftarJadwal.filter(item => item.id !== id);
    simpanKeMemori();
    tampilkanJadwal();
}

function tampilkanJadwal() {
    listJadwalEl.innerHTML = "";
    pilihJadwalEl.innerHTML = '<option value="">-- Pilih Jadwal Hari Ini --</option>';

    daftarJadwal.forEach(jadwal => {
        // Tampilkan di Tab Jadwal
        const li = document.createElement("li");
        li.className = "list-item";
        li.innerHTML = `
            <div>
                <strong>${jadwal.hari} (${jadwal.jam})</strong><br>
                <span>${jadwal.mapel}</span>
            </div>
            <button class="btn-hapus" onclick="hapusJadwal(${jadwal.id})">Hapus</button>
        `;
        listJadwalEl.appendChild(li);

        // Masukkan ke pilihan dropdown Absensi jika harinya cocok dengan hari ini
        if (jadwal.hari === hariIni) {
            const option = document.createElement("option");
            option.value = `${jadwal.mapel} (${jadwal.jam})`;
            option.textContent = `${jadwal.jam} - ${jadwal.mapel}`;
            pilihJadwalEl.appendChild(option);
        }
    });
}

// --- 4. FITUR ABSENSI HARIAN ---
const inputNamaSiswa = document.getElementById("input-nama-siswa");
const btnTambahSiswa = document.getElementById("btn-tambah-siswa");
const listAbsensiEl = document.getElementById("daftar-absensi-siswa");
const btnSimpanAbsensi = document.getElementById("btn-simpan-absensi");

btnTambahSiswa.addEventListener("click", function() {
    const nama = inputNamaSiswa.value.trim();
    if (!nama) return;

    daftarSiswa.push({ id: Date.now(), nama });
    simpanKeMemori();
    inputNamaSiswa.value = "";
    tampilkanDaftarSiswa();
});

function hapusSiswa(id) {
    daftarSiswa = daftarSiswa.filter(s => s.id !== id);
    simpanKeMemori();
    tampilkanDaftarSiswa();
}

function tampilkanDaftarSiswa() {
    listAbsensiEl.innerHTML = "";
    daftarSiswa.forEach(siswa => {
        const li = document.createElement("li");
        li.className = "list-item";
        li.innerHTML = `
            <span>${siswa.nama}</span>
            <div class="absensi-opsi">
                <select class="status-siswa" data-nama="${siswa.nama}">
                    <option value="Hadir">Hadir</option>
                    <option value="Izin">Izin</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Alpha">Alpha</option>
                </select>
                <button class="btn-hapus" onclick="hapusSiswa(${siswa.id})">X</button>
            </div>
        `;
        listAbsensiEl.appendChild(li);
    });
}

btnSimpanAbsensi.addEventListener("click", function() {
    const jadwalDipilih = pilihJadwalEl.value;
    if (!jadwalDipilih) {
        alert("Pilih mata pelajaran / sesi jadwal terlebih dahulu!");
        return;
    }

    const catatan = [];
    document.querySelectorAll(".status-siswa").forEach(select => {
        catatan.push({
            nama: select.getAttribute("data-nama"),
            status: select.value
        });
    });

    riwayatAbsensi.push({
        tanggal: new Date().toLocaleDateString("id-ID"),
        jadwal: jadwalDipilih,
        data: catatan
    });

    simpanKeMemori();
    alert(`Absensi untuk ${jadwalDipilih} berhasil disimpan di memori HP!`);
});

// --- 5. FITUR PENGINGAT TUGAS (URUT TENGGAT WAKTU) ---
const formTugas = document.getElementById("form-tugas");
const listTugasEl = document.getElementById("daftar-tugas");

formTugas.addEventListener("submit", function(e) {
    e.preventDefault();
    const nama = document.getElementById("nama-tugas").value.trim();
    const deadline = document.getElementById("deadline-tugas").value;

    daftarTugas.push({ id: Date.now(), nama, deadline });
    simpanKeMemori();
    formTugas.reset();
    tampilkanTugas();
});

function hapusTugas(id) {
    daftarTugas = daftarTugas.filter(t => t.id !== id);
    simpanKeMemori();
    tampilkanTugas();
}

function tampilkanTugas() {
    listTugasEl.innerHTML = "";

    // Urutkan tugas berdasarkan tanggal deadline paling dekat
    const tugasTerurut = [...daftarTugas].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    tugasTerurut.forEach(tugas => {
        const tglDeadline = new Date(tugas.deadline);
        const selisihHari = Math.ceil((tglDeadline - sekarang) / (1000 * 60 * 60 * 24));
        
        // Beri warna merah jika deadline <= 1 hari lagi, hijau jika masih lama
        const kelasWarna = selisihHari <= 1 ? "tugas-mendesak" : "tugas-aman";

        const li = document.createElement("li");
        li.className = `list-item ${kelasWarna}`;
        li.innerHTML = `
            <div>
                <strong>${tugas.nama}</strong><br>
                <small>Deadline: ${tglDeadline.toLocaleDateString("id-ID")}</small>
            </div>
            <button class="btn-hapus" onclick="hapusTugas(${tugas.id})">Selesai</button>
        `;
        listTugasEl.appendChild(li);
    });
}

// --- 6. JALANKAN SAAT HALAMAN PERTAMA DIBUKA ---
tampilkanJadwal();
tampilkanDaftarSiswa();
tampilkanTugas();

// Daftarkan Service Worker agar bisa jalan Offline
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .then(() => console.log("Mode offline siap digunakan!"))
        .catch(err => console.log("Gagal memuat mode offline:", err));
}
