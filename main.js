console.log("✅ main.js dijalankan dengan animasi & suara aktif");

// 🔹 Import Firebase & Soal
import { initializeApp } from "[https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js](https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js)";
import { getDatabase, ref, push } from "[https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js](https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js)";
import { data } from "./soal.js";

// 🔹 Konfigurasi Firebase
const firebaseConfig = {
apiKey: "AIzaSyB35RYpFoHPFOFbQhr6rtbAWiWdGbta0I4",
authDomain: "kuis-hamami.firebaseapp.com",
databaseURL: "[https://kuis-hamami-default-rtdb.asia-southeast1.firebasedatabase.app](https://kuis-hamami-default-rtdb.asia-southeast1.firebasedatabase.app)",
projectId: "kuis-hamami",
storageBucket: "kuis-hamami.firebasestorage.app",
messagingSenderId: "955115071133",
appId: "1:955115071133:web:c42d2f365082c74bf39674"
};

// 🔹 Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔹 Elemen DOM
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

// 🔊 Efek Suara
const sfxBenar = new Audio("[https://cdn.pixabay.com/download/audio/2022/03/15/audio_0b4de22b13.mp3?filename=correct-2-46134.mp3](https://cdn.pixabay.com/download/audio/2022/03/15/audio_0b4de22b13.mp3?filename=correct-2-46134.mp3)");
const sfxSalah = new Audio("[https://cdn.pixabay.com/download/audio/2021/08/04/audio_3c6617335c.mp3?filename=wrong-buzzer-6268.mp3](https://cdn.pixabay.com/download/audio/2021/08/04/audio_3c6617335c.mp3?filename=wrong-buzzer-6268.mp3)");
const sfxKlik = new Audio("[https://cdn.pixabay.com/download/audio/2022/03/15/audio_09b9d85b8b.mp3?filename=button-press-46710.mp3](https://cdn.pixabay.com/download/audio/2022/03/15/audio_09b9d85b8b.mp3?filename=button-press-46710.mp3)");

// 🔹 Normalisasi teks
function normalisasi(teks) {
return teks.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// 🔹 Animasi skor halus
function animasiSkor(nilaiBaru) {
let nilaiSekarang = parseInt(skorText.textContent);
const step = nilaiBaru > nilaiSekarang ? 1 : -1;
const interval = setInterval(() => {
nilaiSekarang += step;
skorText.textContent = nilaiSekarang;
if (nilaiSekarang === nilaiBaru) clearInterval(interval);
}, 15);
}

// 🔹 Efek animasi benar/salah
function animasiEfek(status) {
soalText.style.transition = "transform 0.2s ease, color 0.2s ease";
soalText.style.transform = status === "benar" ? "scale(1.1)" : "rotate(2deg)";
soalText.style.color = status === "benar" ? "#0b8457" : "#ff4d4d";

setTimeout(() => {
soalText.style.transform = "scale(1)";
soalText.style.color = "#333";
}, 500);
}

// 🔹 Klik "Mulai"
btnKirim.onclick = () => {
sfxKlik.play();
namaPemain = namaInput.value.trim();
levelDipilih = levelSelect.value;

if (namaPemain === "" || levelDipilih === "none") {
alert("Isi nama dan pilih mata pelajaran dulu, ya! 🙏");
return;
}

push(ref(db, "pemain/"), {
nama: namaPemain,
level: levelDipilih,
waktu: new Date().toLocaleString("id-ID")
});

document.getElementById("formNama").style.display = "none";
kuisContainer.style.display = "block";

indexSoal = 0;
skor = 0;
skorText.textContent = "0";

tampilkanSoal();
};

// 🔹 Menampilkan soal
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

// 🔹 Klik Jawab
btnJawab.onclick = () => {
sfxKlik.play();
const soal = data[levelDipilih];
const jawaban = normalisasi(jawabanInput.value);
const benar = normalisasi(soal[indexSoal].a);

if (jawaban === benar) {
hasil.textContent = "✅ Benar!";
skor += 10;
sfxBenar.play();
animasiEfek("benar");
animasiSkor(skor);
} else {
hasil.textContent = `❌ Salah! Jawaban: ${soal[indexSoal].a}`;
sfxSalah.play();
animasiEfek("salah");
}

indexSoal++;
setTimeout(tampilkanSoal, 900);
};

// 🔹 Donasi
donasiBtn.onclick = () => {
sfxKlik.play();
popupDonasi.style.display = "flex";
};

// 🔹 Tutup Popup
tutupPopup.onclick = () => {
sfxKlik.play();
popupDonasi.style.display = "none";
};

// 🔹 Klik di luar popup
window.onclick = (e) => {
if (e.target === popupDonasi) popupDonasi.style.display = "none";
};
