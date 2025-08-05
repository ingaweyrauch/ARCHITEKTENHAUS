# 🏡 Ferienhaus Gäste-App

Eine moderne, responsive Web-App für die digitale Gästebetreuung in Ferienhäusern.

## 🎯 Features

- **Digitale Hausführung** - Alle wichtigen Informationen übersichtlich strukturiert
- **Check-in System** - Automatisierte Datenerfassung mit Ausweis-Upload
- **Foto-Galerie** - Ansprechende Präsentation aller Hausbereiche
- **Garten-Monitoring** - Live-Zugang zu Außenkameras
- **Responsive Design** - Optimiert für Desktop, Tablet und Mobile
- **Firebase Integration** - Sichere Cloud-Speicherung

## 🛠️ Technologie-Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Custom CSS mit Inter-Font
- **Backend:** Firebase (Firestore + Storage)
- **Hosting:** Firebase Hosting
- **Design:** Industrial/Modern Style

## 📁 Projektstruktur

```
ferienhaus-app/
├── index.html              # Haupt-App
├── README.md               # Diese Datei
├── firebase.json           # Firebase-Konfiguration
├── images/                 # Haus-Fotos
└── docs/                   # Dokumentation
```

## 🚀 Quick Start

### 1. Projekt klonen/herunterladen
```bash
git clone [your-repo-url]
cd ferienhaus-app
```

### 2. Firebase-Setup
1. Firebase-Projekt erstellen: [console.firebase.google.com](https://console.firebase.google.com)
2. Firestore und Storage aktivieren
3. Firebase-Config in `index.html` einfügen

### 3. Lokal testen
```bash
# Einfacher HTTP-Server
python -m http.server 8000
# oder
npx serve .
```

### 4. Deployment
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## ⚙️ Konfiguration

### Firebase-Config einfügen
In `index.html` ersetzen Sie:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDRa7bc6HzxI7qx1cgF5EWlgn-cyCmLahQ",
            authDomain: "architektenhaus-am-wald.firebaseapp.com",
            projectId: "architektenhaus-am-wald",
            storageBucket: "architektenhaus-am-wald.firebasestorage.app",
            messagingSenderId: "703193723384",
            appId: "1:703193723384:web:e2f70ddda635e265e2e60d",
            measurementId: "G-YHREGR7KLH"
};
```

### Sicherheitsregeln

**Firestore (Produktion):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /gaeste/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

**Storage (Produktion):**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /ausweise/{fileName} {
      allow create: if resource.size < 5 * 1024 * 1024
                    && resource.contentType.matches('image/.*|application/pdf');
      allow read, delete: if false;
    }
  }
}
```

## 📸 Fotos hinzufügen

### Option 1: Firebase Console
1. Storage → house-photos/ erstellen
2. Bilder hochladen
3. URLs in Code ersetzen

### Option 2: Programmatisch
```javascript
const housePhotos = [
    { url: 'gs://ihr-bucket/house-photos/exterior.jpg', title: 'Außenansicht' },
    { url: 'gs://ihr-bucket/house-photos/bedroom.jpg', title: 'Schlafzimmer' }
];
```

## 🔧 Anpassungen

### Haus-Informationen ändern
Bearbeiten Sie die Karten in der `hausinfo`-Section:

```html
<div class="card-body">
    <ul>
        <li>Ihre eigenen Hinweise</li>
        <li>Spezifische Geräte-Anleitungen</li>
    </ul>
</div>
```

### Styling anpassen
Hauptfarben ändern:

```css
:root {
    --primary-color: #3498db;
    --secondary-color: #2c3e50;
    --background-color: #f8f9fa;
}
```

## 📱 Mobile Optimierung

- Responsive Grid-Layouts
- Touch-optimierte Buttons
- Sidebar-Navigation für mobile Geräte
- Optimierte Dateigröße

## 🔒 Datenschutz & Sicherheit

- DSGVO-konforme Datenverarbeitung
- Verschlüsselte Übertragung (HTTPS)
- Sichere Firebase-Regeln
- Minimale Datenerfassung

## 🐛 Troubleshooting

### Häufige Probleme

**Firebase-Verbindung fehlgeschlagen:**
- Config-Daten prüfen
- Browser-Konsole auf Fehler überprüfen
- CORS-Einstellungen kontrollieren

**Upload funktioniert nicht:**
- Dateigröße unter 5MB?
- Richtige Dateiformate? (JPG, PNG, PDF)
- Storage-Regeln korrekt?

**Mobile Navigation:**
- JavaScript aktiviert?
- Touch-Events funktional?

## 📞 Support

Bei Fragen oder Problemen:
1. Browser-Entwicklertools öffnen
2. Konsole auf Fehlermeldungen prüfen
3. Firebase-Logs kontrollieren

## 📄 Lizenz

Dieses Projekt ist für private und kommerzielle Nutzung freigegeben.

## 🚀 Roadmap

### Geplante Features
- [ ] E-Mail-Benachrichtigungen
- [ ] QR-Code für App-Zugang
- [ ] Admin-Dashboard
- [ ] Mehrsprachigkeit
- [ ] Push-Notifications
- [ ] Bewertungssystem

### Version 1.1
- Automatische E-Mails bei Check-in
- Verbesserte Foto-Galerie
- Video-Streaming Integration

---
as haben Sie jetzt:
📊 Vollständiges Dashboard

Live-Statistiken: Gesamtgäste, aktuelle Gäste, Monatsstatistik
Übersicht: Letzte Check-ins auf einen Blick
Automatische Updates alle 5 Minuten

👥 Professionelle Gäste-Verwaltung

Alle Gäste mit vollständigen Daten anzeigen
Suchen & Filtern nach Name, E-Mail, Ort
Details-Ansicht mit Modal-Popup
CSV-Export für Excel/Buchhaltung
Gäste löschen mit Sicherheitsabfrage

📁 Dateien-Management

Alle Ausweise übersichtlich anzeigen
Download & Vorschau von Dokumenten
Löschen nicht mehr benötigter Dateien
Upload-Datum automatisch erkannt

⚙️ Admin-Tools

Backup-Funktion: Komplette Datensicherung
Cleanup: Alte Daten automatisch löschen
Status-Monitoring: Firebase-Verbindung überwachen

🚀 So geht's weiter:

admin.html erstellen mit dem Code aus dem Artefakt
Firebase-Config einfügen (gleiche wie in index.html)
Deployen: firebase deploy
Zugriff: https://architektenhaus-am-wald.web.app/admin.html

🔐 Sicherheits-Tipp:
Für Produktion sollten Sie später ein Passwort hinzufügen oder Firebase Authentication nutzen.