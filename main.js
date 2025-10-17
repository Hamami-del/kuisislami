import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Elemen
const namaInput = document.getElementById("namaInput");
const btnKirim = document.getElementById("btnKirim");
const daftarPemain = document.getElementById("daftarPemain");
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

// Normalisasi teks jawaban
function normalisasi(teks) {
  return teks.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Animasi angka skor
function animasiSkor(nilaiBaru) {
  let nilaiSekarang = parseInt(skorText.textContent);
  const step = nilaiBaru > nilaiSekarang ? 1 : -1;
  const interval = setInterval(() => {
    nilaiSekarang += step;
    skorText.textContent = nilaiSekarang;
    if (nilaiSekarang === nilaiBaru) clearInterval(interval);
  }, 30);
}

// Kirim nama
btnKirim.onclick = () => {
  namaPemain = namaInput.value.trim();
  levelDipilih = levelSelect.value;
  if (namaPemain === "") return alert("Isi nama dulu! 🙏");

  push(ref(db, "pemain/"), { nama: namaPemain, level: levelDipilih });
  document.getElementById("formNama").style.display = "none";
  kuisContainer.style.display = "block";
  tampilkanSoal();
};

// Daftar pemain realtime
onValue(ref(db, "pemain/"), (snapshot) => {
  daftarPemain.innerHTML = "";
  snapshot.forEach((child) => {
    const val = child.val();
    const li = document.createElement("li");
    li.textContent = `${val.nama} (${val.level})`;
    daftarPemain.appendChild(li);
  });
});

// Tampilkan soal
function tampilkanSoal() {
  const soal = data[levelDipilih].easy;
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

// Periksa jawaban
btnJawab.onclick = () => {
  const soal = data[levelDipilih].easy;
  const jawaban = normalisasi(jawabanInput.value);
  const benar = normalisasi(soal[indexSoal].a);

  if (jawaban === benar) {
    hasil.textContent = "✅ Benar!";
    skor += 10;
    animasiSkor(skor);
  } else {
    hasil.textContent = `❌ Salah! Jawaban: ${soal[indexSoal].a}`;
  }

  indexSoal++;
  setTimeout(tampilkanSoal, 800);
};

// Popup donasi
donasiBtn.onclick = () => {
  popupDonasi.style.display = "flex";
};
tutupPopup.onclick = () => {
  popupDonasi.style.display = "none";
};
window.onclick = (e) => {
  if (e.target === popupDonasi) popupDonasi.style.display = "none";
};
