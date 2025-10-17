console.log("✅ main.js berhasil dijalankan");

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { data } from "./soal.js";

const firebaseConfig = {
  apiKey: "AIzaSyB35RYpFoHPFOFbQhr6rtbAWiWdGbta0I4",
  authDomain: "kuis-hamami.firebaseapp.com",
  databaseURL: "https://kuis-hamami-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kuis-hamami",
  storageBucket: "kuis-hamami.firebasestorage.app",
  messagingSenderId: "955115071133",
  appId: "1:955115071133:web:c42d2f365082c74bf39674"
};

// 🔹 Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔹 Ambil elemen DOM
const namaInput = document.getElementById("namaInput");
const btnKirim = document.getElementById("btnKirim");
const kuisContainer = document.getElementById("kuisContainer");
const soalText = document.getElementById("soalText");
const jawabanInput = document.getElementById("jawabanInput");
const btnJawab = document.getElementById("btnJawab");
const hasil = document.getElementById("hasil");
const levelSelect = document.getElementById("levelSelect");
const skorText = document.getElementById("skorText");
const donasiBtn = document.getElementById("donasiBtn");
const popupDonasi = document.getElementById("popupDonasi");
const tutupPopup = document.getElementById("tutupPopup");

let namaPemain = "";
let indexSoal = 0;
let levelDipilih = "agama";
let skor = 0;

// 🔹 Normalisasi teks
function normalisasi(teks) {
  return teks.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// 🔹 Animasi skor
function animasiSkor(nilaiBaru) {
  let nilaiSekarang = parseInt(skorText.textContent);
  const step = nilaiBaru > nilaiSekarang ? 1 : -1;
  const interval = setInterval(() => {
    nilaiSekarang += step;
    skorText.textContent = nilaiSekarang;
    if (nilaiSekarang === nilaiBaru) clearInterval(interval);
  }, 20);
}

// 🔹 Saat klik tombol "Mulai"
btnKirim.onclick = () => {
  namaPemain = namaInput.value.trim();
  levelDipilih = levelSelect.value;

  if (namaPemain === "") {
    alert("Isi nama dulu, ya! 🙏");
    return;
  }

  // Kirim data ke Firebase (nama dan pelajaran)
  push(ref(db, "pemain/"), {
    nama: namaPemain,
    level: levelDipilih,
    waktu: new Date().toLocaleString("id-ID")
  });

  // Sembunyikan form, tampilkan kuis
  document.getElementById("formNama").style.display = "none";
  kuisContainer.style.display = "block";

  // Reset progres
  indexSoal = 0;
  skor = 0;
  skorText.textContent = "0";

  tampilkanSoal();
};

// 🔹 Fungsi tampilkan soal
function tampilkanSoal() {
  const soal = data[levelDipilih];

  if (!soal || soal.length === 0) {
    soalText.textContent = "❌ Tidak ada soal untuk pelajaran ini.";
    return;
  }

  if (indexSoal >= soal.length) {
    soalText.textContent = `🎉 Kuis selesai! Terima kasih, ${namaPemain}!`;
    jawabanInput.style.display = "none";
    btnJawab.style.display = "none";
    return;
  }

  soalText.textContent = soal[indexSoal].q;
  hasil.textContent = "";
  jawabanInput.value = "";
}

// 🔹 Saat jawab soal
btnJawab.onclick = () => {
  const soal = data[levelDipilih];
  const jawaban = normalisasi(jawabanInput.value);
  const benar = normalisasi(soal[indexSoal].a);

  // Hapus class lama
hasil.classList.remove("benar", "salah");

if (jawaban === benar) {
  hasil.textContent = "✅ Benar!";
  hasil.classList.add("benar");  // tambahkan animasi
  skor += 10;
  animasiSkor(skor);
} else {
  hasil.textContent = `❌ Salah! Jawaban: ${soal[indexSoal].a}`;
  hasil.classList.add("salah");  // tambahkan animasi
}
  indexSoal++;
  setTimeout(tampilkanSoal, 900);
};

// 🔹 Tombol Donasi
donasiBtn.onclick = () => {
  popupDonasi.style.display = "flex";
};

// 🔹 Tutup popup
tutupPopup.onclick = () => {
  popupDonasi.style.display = "none";
};

// 🔹 Tutup popup kalau klik di luar kotak
window.onclick = (e) => {
  if (e.target === popupDonasi) popupDonasi.style.display = "none";
};

