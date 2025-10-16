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

// 🟢 Fungsi Normalisasi agar jawaban lebih toleran
const normalisasi = (teks) =>
  teks
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/alquran/g, "alquran")
    .replace(/ramadan/g, "ramadhan");

// 🟢 Kirim nama
btnKirim.onclick = () => {
  namaPemain = namaInput.value.trim();
  levelDipilih = levelSelect.value;
  if (namaPemain === "") return alert("Isi nama dulu!");

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
    daftarPemain.appendChild(li);
  });
});

// 🟢 Tampilkan soal
function tampilkanSoal() {
  const soal = data[levelDipilih];
  if (indexSoal < soal.length) {
    soalText.textContent = soal[indexSoal].q;
    jawabanInput.value = "";
    hasil.textContent = "";
  } else {
    soalText.textContent = `Kuis ${levelDipilih} selesai! Terima kasih, ${namaPemain}! 🎉`;
    jawabanInput.style.display = "none";
    btnJawab.style.display = "none";
  }
}

// 🟢 Efek animasi
function animasiEfek(warna) {
  document.body.style.transition = "background-color 0.4s";
  document.body.style.backgroundColor = warna;
  setTimeout(() => {
    document.body.style.backgroundColor = "#e8f6ff"; // kembali ke biru muda
  }, 500);
}

// 🟢 Saat kirim jawaban
btnJawab.onclick = () => {
  const soal = data[levelDipilih];
  const jawaban = jawabanInput.value.trim();
  const benar = normalisasi(soal[indexSoal].a);
  const user = normalisasi(jawaban);

  if (user === benar) {
    hasil.textContent = "✅ Benar!";
    hasil.style.color = "green";
    skor += 10;
    skorText.textContent = `Skor Kamu: ${skor}`;
    animasiEfek("#b2ffb2"); // hijau lembut
  } else {
    hasil.textContent = `❌ Salah! Jawaban: ${soal[indexSoal].a}`;
    hasil.style.color = "red";
    animasiEfek("#ffb2b2"); // merah lembut
  }

  indexSoal++;
  setTimeout(tampilkanSoal, 1000);
};
