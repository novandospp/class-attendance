// --- 1. PENGATURAN TANGGAL & NAVIGASI TAB ---
const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const sekarang = new Date();
const hariIni = namaHari[sekarang.getDay()];

const tanggalEl = document.getElementById("tanggal-hari-ini");
if (tanggalEl) {
    tanggalEl.textContent = `${hariIni}, ${sekarang.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}`;
}

function bukaTab(idTab, elemenTombol) {
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

    const targetTab = document.getElementById(idTab);
    if (targetTab) targetTab.classList.add("active");
    if (elemenTombol) elemenTombol.classList.add("active");
}

// --- 2. PENYIMPANAN LOKAL (LOCALSTORAGE) ---
let daftarSiswa = JSON.parse(localStorage.getItem("data_siswa")) || [];
let daftarTugas = JSON.parse(localStorage.getItem("data_tugas")) || [];
let riwayatAbsensi = JSON.parse(localStorage.getItem("data_absensi")) || [];

function simpanKeMemori() {
    localStorage.setItem("data_siswa", JSON.stringify(daftarSiswa));
    localStorage.setItem("data_tugas", JSON.stringify(daftarTugas));
    localStorage.setItem("data_absensi", JSON.stringify(riwayatAbsensi));
}

// --- 3. FITUR JADWAL PELAJARAN (TAMBAHAN MANUAL) ---
const formJadwal = document.getElementById("form-jadwal");
const listJadwalEl = document.getElementById("daftar-jadwal");
const pilihJadwalEl = document.getElementById("pilih-jadwal");

if (formJadwal) {
    formJadwal.addEventListener("submit", function(e) {
        e.preventDefault();
        const hari = document.getElementById("hari-jadwal").value;
        const jam = document.getElementById("jam-jadwal").value;
        const mapel = document.getElementById("mapel-jadwal").value.trim();

        if (listJadwalEl) {
            const li = document.createElement("li");
            li.className = "list-item";
            li.innerHTML = `<div><strong>${hari} (${jam})</strong><br><span>${mapel}</span></div>`;
            listJadwalEl.appendChild(li);
        }

        if (pilihJadwalEl) {
            const option = document.createElement("option");
            option.value = `${hari} - ${mapel} (${jam})`;
            option.textContent = `${hari} | ${jam} - ${mapel}`;
            pilihJadwalEl.appendChild(option);
        }

        formJadwal.reset();
        alert("Jadwal tambahan berhasil dimasukkan!");
    });
}

// --- 4. FITUR ABSENSI HARIAN ---
const inputNamaSiswa = document.getElementById("input-nama-siswa");
const btnTambahSiswa = document.getElementById("btn-tambah-siswa");
const listAbsensiEl = document.getElementById("daftar-absensi-siswa");
const btnSimpanAbsensi = document.getElementById("btn-simpan-absensi");

if (btnTambahSiswa) {
    btnTambahSiswa.addEventListener("click", function() {
        const nama = inputNamaSiswa.value.trim();
        if (!nama) return;

        daftarSiswa.push({ id: Date.now(), nama });
        simpanKeMemori();
        inputNamaSiswa.value = "";
        tampilkanDaftarSiswa();
    });
}

function hapusSiswa(id) {
    daftarSiswa = daftarSiswa.filter(s => s.id !== id);
    simpanKeMemori();
    tampilkanDaftarSiswa();
}

function tampilkanDaftarSiswa() {
    if (!listAbsensiEl) return;
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

if (btnSimpanAbsensi) {
    btnSimpanAbsensi.addEventListener("click", function() {
        const jadwalDipilih = pilihJadwalEl.value;
        if (!jadwalDipilih) {
            alert("Pilih mata pelajaran terlebih dahulu!");
            return;
        }

        if (daftarSiswa.length === 0) {
            alert("Tambahkan minimal satu nama siswa terlebih dahulu!");
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
        tampilkanRiwayatAbsensi();
        alert(`Absensi untuk ${jadwalDipilih} berhasil disimpan!`);
    });
}

// --- 5. FUNGSI MENAMPILKAN REKAP RIWAYAT ABSENSI ---
const listRiwayatEl = document.getElementById("daftar-riwayat-absensi");

function hapusRiwayat(index) {
    riwayatAbsensi.splice(index, 1);
    simpanKeMemori();
    tampilkanRiwayatAbsensi();
}

function tampilkanRiwayatAbsensi() {
    if (!listRiwayatEl) return;
    listRiwayatEl.innerHTML = "";

    if (riwayatAbsensi.length === 0) {
        listRiwayatEl.innerHTML = "<p style='font-size: 0.85rem; color: #6b7280;'>Belum ada absensi yang disimpan.</p>";
        return;
    }

    [...riwayatAbsensi].reverse().forEach((riwayat, idx) => {
        const indexAsli = riwayatAbsensi.length - 1 - idx;
        
        const ringkasanSiswa = riwayat.data
            .map(s => `${s.nama} (<strong>${s.status}</strong>)`)
            .join(", ");

        const li = document.createElement("li");
        li.className = "list-item";
        li.innerHTML = `
            <div>
                <strong>${riwayat.jadwal}</strong><br>
                <small style="color: #6b7280;">Tanggal: ${riwayat.tanggal}</small><br>
                <p style="font-size: 0.85rem; margin-top: 4px;">${ringkasanSiswa}</p>
            </div>
            <button class="btn-hapus" onclick="hapusRiwayat(${indexAsli})">Hapus</button>
        `;
        listRiwayatEl.appendChild(li);
    });
}

// --- 6. FITUR PENGINGAT TUGAS ---
const formTugas = document.getElementById("form-tugas");
const listTugasEl = document.getElementById("daftar-tugas");

if (formTugas) {
    formTugas.addEventListener("submit", function(e) {
        e.preventDefault();
        const nama = document.getElementById("nama-tugas").value.trim();
        const deadline = document.getElementById("deadline-tugas").value;

        daftarTugas.push({ id: Date.now(), nama, deadline });
        simpanKeMemori();
        formTugas.reset();
        tampilkanTugas();
    });
}

function hapusTugas(id) {
    daftarTugas = daftarTugas.filter(t => t.id !== id);
    simpanKeMemori();
    tampilkanTugas();
}

function tampilkanTugas() {
    if (!listTugasEl) return;
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
tampilkanDaftarSiswa();
tampilkanTugas();
tampilkanRiwayatAbsensi();

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .catch(err => console.log("Gagal memuat mode offline:", err));
}
