// --- 1. PENGATURAN TANGGAL & NAVIGASI TAB ---
const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const sekarang = new Date();
const hariIni = namaHari[sekarang.getDay()];

document.getElementById("tanggal-hari-ini").textContent = 
    `${hariIni}, ${sekarang.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}`;

function bukaTab(idTab) {
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

    document.getElementById(idTab).classList.add("active");
    event.currentTarget.classList.add("active");
}

// --- 2. DATA JADWAL BAWAAN KELAS XI - B ---
const jadwalBawaan = [
    // SENIN
    { id: 101, hari: "Senin", jam: "07:30 - 09:30", mapel: "B ING (Laily Fadiyah Kahar, S.Pd.)" },
    { id: 102, hari: "Senin", jam: "10:00 - 13:50", mapel: "FIS (Reni Anjarwati, S.Pd)" },
    { id: 103, hari: "Senin", jam: "13:50 - 15:10", mapel: "SNBD (Yuda Eli Riyanto, S.Pd)" },

    // SELASA
    { id: 201, hari: "Selasa", jam: "07:30 - 09:30", mapel: "INFT (Yopy Adiantoro, S.Pd.)" },
    { id: 202, hari: "Selasa", jam: "10:00 - 12:00", mapel: "B INDO (Nurhuda, S.Pd.)" },
    { id: 203, hari: "Selasa", jam: "12:30 - 13:50", mapel: "MAT UM (Lutvi Mahfudiyah, S.Si.)" },
    { id: 204, hari: "Selasa", jam: "13:50 - 15:10", mapel: "B JAWA (Titis Reka Anggraini, S.Pd.)" },

    // RABU
    { id: 301, hari: "Rabu", jam: "07:30 - 09:30", mapel: "PJOK (Indriana Puspitasari, S.Pd)" },
    { id: 302, hari: "Rabu", jam: "10:00 - 12:00", mapel: "P AGM (Dr. M. Nur Alam Fajar Syam, M.Pd)" },
    { id: 303, hari: "Rabu", jam: "12:30 - 13:50", mapel: "SJRH (Defri Murain Palupiyana, S.Pd.)" },
    { id: 304, hari: "Rabu", jam: "13:50 - 15:10", mapel: "INFT (Yopy Adiantoro, S.Pd.)" },

    // KAMIS
    { id: 401, hari: "Kamis", jam: "07:30 - 11:20", mapel: "KIM (Syaikul Anam, S.Pd.)" },
    { id: 402, hari: "Kamis", jam: "11:20 - 13:50", mapel: "BIO (Nindia Ayutrisna, S.Pd)" },
    { id: 403, hari: "Kamis", jam: "13:50 - 15:10", mapel: "PPKN (Wiwin Nardianto, S.Pd)" },

    // JUMAT
    { id: 501, hari: "Jumat", jam: "07:00 - 08:20", mapel: "BIO (Nindia Ayutrisna, S.Pd)" },
    { id: 502, hari: "Jumat", jam: "08:20 - 09:55", mapel: "MAT UM (Lutvi Mahfudiyah, S.Si.)" },
    { id: 503, hari: "Jumat", jam: "09:55 - 11:15", mapel: "PKWU (Dian Fatma Budianda, S.Pd.)" }
];

// --- 3. PENYIMPANAN LOKAL (LOCALSTORAGE) ---
let daftarSiswa = JSON.parse(localStorage.getItem("data_siswa")) || [];
let daftarTugas = JSON.parse(localStorage.getItem("data_tugas")) || [];
let riwayatAbsensi = JSON.parse(localStorage.getItem("data_absensi")) || [];

// Jika memori jadwal masih kosong, otomatis isi dengan jadwalBawaan XI - B
let daftarJadwal = JSON.parse(localStorage.getItem("data_jadwal"));
if (!daftarJadwal || daftarJadwal.length === 0) {
    daftarJadwal = jadwalBawaan;
    localStorage.setItem("data_jadwal", JSON.stringify(daftarJadwal));
}

function simpanKeMemori() {
    localStorage.setItem("data_siswa", JSON.stringify(daftarSiswa));
    localStorage.setItem("data_jadwal", JSON.stringify(daftarJadwal));
    localStorage.setItem("data_tugas", JSON.stringify(daftarTugas));
    localStorage.setItem("data_absensi", JSON.stringify(riwayatAbsensi));
}

// --- 4. FITUR JADWAL PELAJARAN ---
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
    pilihJadwalEl.innerHTML = '<option value="">-- Pilih Mata Pelajaran --</option>';

    daftarJadwal.forEach(jadwal => {
        // Tampilkan semua jadwal di Tab Jadwal
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

        // Masukkan ke pilihan dropdown Absensi
        const option = document.createElement("option");
        option.value = `${jadwal.hari} - ${jadwal.mapel} (${jadwal.jam})`;
        
        // Tandai jika jadwal sesuai hari ini agar mudah ditemukan
        if (jadwal.hari === hariIni) {
            option.textContent = `⭐ [HARI INI] ${jadwal.jam} - ${jadwal.mapel}`;
        } else {
            option.textContent = `${jadwal.hari} (${jadwal.jam}) - ${jadwal.mapel}`;
        }
        pilihJadwalEl.appendChild(option);
    });
}

// --- 5. FITUR ABSENSI HARIAN ---
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
        alert("Pilih mata pelajaran terlebih dahulu!");
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
    alert(`Absensi untuk ${jadwalDipilih} berhasil disimpan!`);
});

// --- 6. FITUR PENGINGAT TUGAS (URUT TENGGAT WAKTU) ---
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
    const tugasTerurut = [...daftarTugas].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    tugasTerurut.forEach(tugas => {
        const tglDeadline = new Date(tugas.deadline);
        const selisihHari = Math.ceil((tglDeadline - sekarang) / (1000 * 60 * 60 * 24));
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

// --- 7. JALANKAN SAAT HALAMAN PERTAMA DIBUKA ---
tampilkanJadwal();
tampilkanDaftarSiswa();
tampilkanTugas();

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .then(() => console.log("Mode offline siap digunakan!"))
        .catch(err => console.log("Gagal memuat mode offline:", err));
}
