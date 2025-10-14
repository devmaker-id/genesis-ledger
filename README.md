# 🧱 Genesis Ledger

> Eksperimen blockchain minimalis — dibuat untuk eksplorasi teknis dan belajar dari filosofi Genesis Block Bitcoin.

---

## 📜 Deskripsi Singkat

**Genesis Ledger** adalah prototipe blockchain sederhana yang dirancang untuk memahami konsep dasar seperti pembuatan *genesis block*, struktur blok, hashing, dan *proof-of-work*.  
Tujuannya **edukasi dan riset**, bukan proyek spekulatif atau token komersial.

---

## 🚀 Fitur MVP

- ✅ Generate **Genesis Block**
- ✅ Struktur `Block` dengan hash SHA-256 & `nonce`
- ✅ Simulasi *mining* (proof-of-work sederhana, difficulty bisa diatur)
- ✅ Validasi rantai (chain integrity)
- 🔜 Modularisasi untuk pengembangan ke arah wallet & node jaringan

---

## 🧩 Struktur Proyek

genesis-ledger/
├── src/
│ ├── core/
│ │ ├── block.js # Class Block & hashing logic
│ │ ├── chain.js # Blockchain management (create, add, validate)
│ │ └── wallet.js # (TBD) wallet generation & signing
│ ├── network/
│ │ └── node.js # (TBD) Peer-to-peer node basic
│ └── utils/
│ └── crypto.js # Helper crypto utilities
├── tests/
│ └── chain.test.js
├── package.json
├── README.md
└── .gitignore


---

## ⚙️ Prasyarat

- Node.js **v16+** (direkomendasikan v18 atau v24)
- NPM atau Yarn
- Terminal / shell aktif
- Koneksi internet (untuk dependency install)

---

## 🧠 Cara Menjalankan (Quick Start)

1. Clone repo ini:

   ```bash
   git clone https://github.com/devmaker-id/genesis-ledger.git
   cd genesis-ledger

