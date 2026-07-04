# 💳 Bayar Dong

**Bayar Dong** adalah aplikasi simulasi pembayaran tagihan & isi pulsa berbasis web, dibangun murni dengan **HTML, CSS, dan Vanilla JavaScript** (tanpa framework, tanpa backend). Semua data transaksi disimpan lokal di browser lewat `localStorage`.

Konsep visualnya terinspirasi dari **"loket pembayaran"** — kertas kraft, papan antrian, cap stempel tinta, formulir isian, dan struk kertas dot-matrix berlubang.

> ⚠️ Ini adalah proyek simulasi/demo untuk keperluan pembelajaran. Tidak ada transaksi nyata, tidak ada koneksi ke server pembayaran manapun.

---

## ✨ Fitur

- **Login (simulasi)** — masuk pakai nama & kata sandi bebas, status login tersimpan di perangkat
- **Bayar Tagihan** — Listrik PLN, PDAM/Air, Internet & TV Kabel, BPJS Kesehatan
- **Isi Ulang** — Pulsa & Paket Data dengan deteksi provider otomatis dari nomor HP
- **4 Metode Pembayaran** — Saldo Bayar Dong, Kartu Debit/Kredit, Transfer Bank (Virtual Account), QRIS
- **Isi Saldo** — top up saldo simulasi kapan saja
- **Riwayat Transaksi** — dengan filter (Semua/Berhasil/Gagal) dan pencarian
- **Struk Digital** — bisa dicetak/diunduh, bisa dibuka ulang lewat riwayat
- **Mode Terang/Gelap** — tema otomatis mengikuti preferensi sistem, bisa diganti manual
- **Simulasi gangguan sistem** — ±8% transaksi random gagal, untuk mensimulasikan skenario dunia nyata

---

## 📁 Struktur Proyek

```
bayar-dong/
├── index.html      # Struktur halaman & seluruh view/modal
├── style.css       # Design tokens & seluruh styling (tema loket pembayaran)
├── script.js       # Seluruh logic aplikasi (vanilla JS, IIFE)
└── README.md        # Dokumentasi ini
```

---

## 🚀 Cara Menjalankan

Karena semuanya frontend murni, cukup jalankan lewat local web server (disarankan, agar font & path relatif ter-load dengan benar):

```bash
# Python
python3 -m http.server 8080

# atau Node (http-server)
npx http-server -p 8080
```

Lalu buka `http://localhost:8080` di browser.

> Membuka `index.html` langsung lewat `file://` biasanya tetap bisa jalan, tapi disarankan pakai local server untuk pengalaman yang konsisten.

---

## 🔐 Login

Login bersifat simulasi — isi nama (min. 2 karakter) dan kata sandi (min. 4 karakter) apa saja, lalu klik **Masuk**. Status login disimpan di `localStorage` sehingga tidak perlu login ulang setiap refresh. Klik ikon **logout** di topbar untuk keluar.

## 💰 Saldo & Metode Pembayaran

- Saldo awal demo: **Rp750.000** (bisa top up kapan saja lewat tombol **Isi Saldo**)
- Saat konfirmasi pembayaran, kamu bisa memilih salah satu dari 4 metode:
  | Metode | Efek ke Saldo |
  |---|---|
  | Saldo Bayar Dong | Memotong saldo langsung, ada pengecekan kecukupan saldo |
  | Kartu Debit/Kredit | Simulasi bayar eksternal, saldo tidak berkurang |
  | Transfer Bank (VA) | Simulasi bayar eksternal, saldo tidak berkurang |
  | QRIS | Simulasi bayar eksternal, saldo tidak berkurang |
- Kalau saldo tidak cukup untuk metode **Saldo Bayar Dong**, modal konfirmasi akan menampilkan pesan kekurangan saldo dan kamu bisa langsung ganti ke metode lain tanpa mengulang dari awal.

## 🌗 Mode Terang/Gelap

Klik ikon matahari/bulan di topbar untuk beralih tema. Preferensi otomatis tersimpan dan mengikuti preferensi sistem operasi saat pertama kali dibuka.

---

## 🗄️ Data & Penyimpanan Lokal

Semua data disimpan di `localStorage` browser dengan key berikut:

| Key | Isi |
|---|---|
| `bayarDong_saldo` | Saldo akun saat ini |
| `bayarDong_riwayat` | Daftar riwayat transaksi |
| `bayarDong_theme` | Preferensi tema (`light`/`dark`) |
| `bayarDong_auth` | Status login (nama pengguna) |

Untuk mereset aplikasi ke kondisi awal (saldo default, tanpa riwayat, logout), hapus key-key di atas lewat DevTools browser:

```js
localStorage.removeItem("bayarDong_saldo");
localStorage.removeItem("bayarDong_riwayat");
localStorage.removeItem("bayarDong_theme");
localStorage.removeItem("bayarDong_auth");
```

atau jalankan `localStorage.clear()` untuk menghapus semuanya sekaligus.

---

## 🛠️ Teknologi

- HTML5 semantik
- CSS3 — custom properties (CSS variables) untuk theming, tanpa dependency eksternal selain Google Fonts
- Vanilla JavaScript (ES6+) — tanpa library, tanpa build step
- Font: `Big Shoulders Text`, `Work Sans`, `Courier Prime` (Google Fonts)

---

## 📌 Catatan Pengembangan

- Semua kategori tagihan, provider, dan nominal pulsa/paket data dikonfigurasi di bagian **DATA CONFIG** pada `script.js` — mudah ditambah/diubah.
- Nomor pelanggan & nomor HP divalidasi sesuai format masing-masing kategori sebelum tagihan/provider bisa dicek.
- Desain sudah responsif untuk layar sempit, namun prioritas utama tetap tampilan desktop.
