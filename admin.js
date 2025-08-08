/****************************
 * Adminbereich – Architektenhaus am Wald
 * Funktionen:
 *  - Preisverwaltung (settings/prices)
 *  - Holidu-Import (bookings)
 *  - Bilderverwaltung (Firebase Storage)
 ****************************/

// 1. Firebase initialisieren
// >>> Hier deine bestehende Config einfügen <<<
const firebaseConfig = {
  apiKey: "AIzaSyDRa7bc6HzxI7qx1cgF5EWlgn-cyCmLahQ",
  authDomain: "architektenhaus-am-wald.firebaseapp.com",
  projectId: "architektenhaus-am-wald",
  storageBucket: "architektenhaus-am-wald.firebasestorage.app",
  messagingSenderId: "703193723384",
  appId: "1:703193723384:web:e2f70ddda635e265e2e60d",
  measurementId: "G-YHREGR7KLH"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

/* ========================
   Preisverwaltung
======================== */
const priceForm = document.getElementById("priceForm");
const priceTableBody = document.querySelector("#priceTable tbody");

async function loadPrices() {
  priceTableBody.innerHTML = "";
  const docRef = db.collection("settings").doc("prices");
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    const data = docSnap.data();
    (data.prices || []).forEach((p, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.start}</td>
        <td>${p.end}</td>
        <td>${p.pricePerNight}</td>
        <td><button class="btn" onclick="deletePrice(${index})">Löschen</button></td>
      `;
      priceTableBody.appendChild(tr);
    });
  }
}

async function savePrices(prices) {
  await db.collection("settings").doc("prices").set({ prices });
  loadPrices();
}

priceForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const start = document.getElementById("priceStart").value;
  const end = document.getElementById("priceEnd").value;
  const price = parseFloat(document.getElementById("priceValue").value);

  const docRef = db.collection("settings").doc("prices");
  const docSnap = await docRef.get();
  let prices = [];
  if (docSnap.exists) prices = docSnap.data().prices || [];
  prices.push({ start, end, pricePerNight: price });

  await savePrices(prices);
  priceForm.reset();
});

window.deletePrice = async function(index) {
  const docRef = db.collection("settings").doc("prices");
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    let prices = docSnap.data().prices || [];
    prices.splice(index, 1);
    await savePrices(prices);
  }
};

/* ========================
   Holidu-Import
======================== */
const holiduButton = document.getElementById("importHolidu");
const holiduStatus = document.getElementById("holiduStatus");
const HOLIDU_URL = "https://api.host.holidu.com/pmc/rest/apartments/58160636/ical.ics?key=f25161ebf2860821684b733f8eab4a1d";

holiduButton.addEventListener("click", async () => {
  holiduStatus.textContent = "Import läuft...";
  try {
    const response = await fetch(HOLIDU_URL);
    const icalData = await response.text();
    const bookings = parseICal(icalData);

    // Alte Holidu-Buchungen löschen
    const snapshot = await db.collection("bookings").where("source", "==", "holidu").get();
    const batch = db.batch();
    snapshot.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    // Neue Buchungen speichern
    const batch2 = db.batch();
    bookings.forEach(b => {
      const ref = db.collection("bookings").doc();
      batch2.set(ref, b);
    });
    await batch2.commit();

    holiduStatus.textContent = `Import abgeschlossen: ${bookings.length} Buchungen gespeichert.`;
  } catch (err) {
    console.error(err);
    holiduStatus.textContent = "Fehler beim Import.";
  }
});

function parseICal(icalText) {
  const lines = icalText.split(/\r?\n/);
  const events = [];
  let current = {};
  lines.forEach(line => {
    if (line.startsWith("BEGIN:VEVENT")) {
      current = {};
    } else if (line.startsWith("DTSTART")) {
      current.start = parseICalDate(line.split(":")[1]);
    } else if (line.startsWith("DTEND")) {
      current.end = parseICalDate(line.split(":")[1]);
    } else if (line.startsWith("SUMMARY")) {
      current.title = line.split(":")[1];
    } else if (line.startsWith("END:VEVENT")) {
      if (current.start && current.end) {
        events.push({
          start: current.start,
          end: current.end,
          title: current.title || "",
          source: "holidu"
        });
      }
    }
  });
  return events;
}

function parseICalDate(dateStr) {
  const y = dateStr.substring(0,4);
  const m = dateStr.substring(4,6);
  const d = dateStr.substring(6,8);
  return `${y}-${m}-${d}`;
}

/* ========================
   Bilderverwaltung
======================== */
const imageForm = document.getElementById("imageForm");
const imageUpload = document.getElementById("imageUpload");
const imageGallery = document.getElementById("imageGallery");

async function loadImages() {
  imageGallery.innerHTML = "";
  const listRef = storage.ref().child("hausbilder");
  const res = await listRef.listAll();
  for (const itemRef of res.items) {
    const url = await itemRef.getDownloadURL();
    const img = document.createElement("img");
    img.src = url;
    img.className = "preview";
    const delBtn = document.createElement("button");
    delBtn.textContent = "Löschen";
    delBtn.className = "btn";
    delBtn.onclick = () => deleteImage(itemRef.fullPath);
    const container = document.createElement("div");
    container.appendChild(img);
    container.appendChild(delBtn);
    imageGallery.appendChild(container);
  }
}

imageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = imageUpload.files[0];
  if (!file) return;
  const fileRef = storage.ref().child(`hausbilder/${file.name}`);
  await fileRef.put(file);
  imageForm.reset();
  loadImages();
});

async function deleteImage(path) {
  await storage.ref().child(path).delete();
  loadImages();
}

/* ========================
   Initial laden
======================== */
document.addEventListener("DOMContentLoaded", () => {
  loadPrices();
  loadImages();
});
