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

let namaPemain = "";
let indexSoal = 0;
let levelDipilih = "easy";
let skor = 0;

// 🟢 Normalisasi jawaban biar lebih toleran
function normalisasi(teks) {
  return teks.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// 🟢 Kirim nama
btnKirim.onclick = () => {
  namaPemain = namaInput.value.trim();
  levelDipilih = levelSelect.value;
  if (namaPemain === "") return alert("Isi nama dulu! yah Lur");

  push(ref(db, "pemain/"), { nama: namaPemain, level: levelDipilih });
  document.getElementById("formNama").style.display = "none";
  kuisContainer.style.display = "block";
  tampilkanSoal();
};

// 🟢 Daftar pemain realtime
onValue(ref(db, "pemain/"), (snapshot) => {
  daftarPemain.innerHTML = "";
  snapshot.forEach((child) => {
    const val = child.val();
    const li = document.createElement("li");
    li.textContent = `${val.nama} (${val.level})`;
    li.classList.add("pemain-item");
    daftarPemain.appendChild(li);
  });
});

// 🟢 Tampilkan soal
function tampilkanSoal() {
  const soal = data[levelDipilih];
  if (!soal || soal.length === 0) {
    soalText.textContent = "Tidak ada soal tersedia!";
    return;
  }

  if (indexSoal < soal.length) {
    soalText.textContent = soal[indexSoal].q;
    jawabanInput.value = "";
    hasil.textContent = "";
  } else {
    soalText.textContent = `🎉 Kuis ${levelDipilih} selesai! Terima kasih, ${namaPemain}!`;
    jawabanInput.style.display = "none";
    btnJawab.style.display = "none";
  }
}

// 🟢 Efek animasi warna background
function animasiEfek(warna) {
  document.body.style.transition = "background-color 0.3s ease";
  document.body.style.backgroundColor = warna;
  setTimeout(() => {
    document.body.style.backgroundColor = "#e8f6ff"; // warna awal
  }, 400);
}

// 🟢 Saat jawab
btnJawab.onclick = () => {
  const soal = data[levelDipilih];
  if (!soal || indexSoal >= soal.length) return;

  const jawabanUser = normalisasi(jawabanInput.value.trim());
  const jawabanBenar = normalisasi(soal[indexSoal].a);

  if (jawabanUser === jawabanBenar) {
    hasil.innerHTML = "✅ <b>Benar!</b>";
    hasil.style.color = "green";
    skor += 10;
    skorText.textContent = `Skor Kamu: ${skor}`;
    animasiEfek("#b7ffb7");
  } else {
    hasil.innerHTML = `❌ Salah! Jawaban: <b>${soal[indexSoal].a}</b>`;
    hasil.style.color = "red";
    animasiEfek("#ffb7b7");
  }

  indexSoal++;
  setTimeout(() => tampilkanSoal(), 1200);
};
