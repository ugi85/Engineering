# Setup Vercel Blob Storage

File ini menjelaskan cara mengkonfigurasi Vercel Blob Storage agar logo dan konfigurasi dapat disimpan dan diakses oleh semua pengguna.

## 📋 Prerequisites

- Akun Vercel
- Project sudah di-deploy ke Vercel

## 🚀 Langkah Setup

### 1. Install Dependencies (Sudah Dilakukan)

```bash
npm install @vercel/blob
```

### 2. Buat Blob Storage di Vercel

1. Buka dashboard Vercel: https://vercel.com/dashboard
2. Pilih project Anda
3. Pergi ke tab **Storage**
4. Klik **Create Database** → Pilih **Blob**
5. Beri nama (misal: `engineering-blob`)
6. Klik **Create**

### 3. Dapatkan Token

1. Setelah Blob dibuat, klik **Connect**
2. Vercel akan otomatis menambahkan environment variable
3. Atau manual: Pergi ke **Settings** → **Environment Variables**
4. Tambahkan variable: `BLOB_READ_WRITE_TOKEN`
5. Nilai token bisa didapat dari:
   - Buka Blob yang sudah dibuat
   - Klik **Settings**
   - Copy token dari **API Tokens**

### 4. Deploy Ulang

```bash
git add .
git commit -m "feat: Add Vercel Blob Storage for config and logo"
git push
```

Atau deploy via Vercel CLI:

```bash
vercel --prod
```

### 5. Verifikasi

1. Buka aplikasi yang sudah di-deploy
2. Pergi ke halaman Settings → Konfigurasi
3. Upload logo baru
4. Simpan perubahan
5. Buka aplikasi di browser lain / incognito
6. Logo dan konfigurasi harus sudah muncul!

## 📁 Struktur File

```
engineering/
├── vercel/
│   └── api/
│       ├── config.js      # API endpoint untuk save/read konfigurasi
│       └── upload.js      # API endpoint untuk upload/delete logo
├── src/
│   ├── composables/
│   │   └── useConfig.js   # Composable untuk manage config
│   └── views/
│       └── Settings/
│           └── config.vue # Halaman konfigurasi
├── vercel.json            # Vercel configuration
└── package.json
```

## 🔧 Environment Variables

Pastikan environment variable ini ada di Vercel:

| Variable | Deskripsi |
|----------|-----------|
| `BLOB_READ_WRITE_TOKEN` | Token untuk akses Vercel Blob (otomatis ditambahkan saat connect Blob) |

## 🎯 Cara Kerja

### Upload Logo
```
User → Upload Logo → /api/upload → Vercel Blob Storage
                          ↓
                    Returns: logoUrl, faviconUrl
```

### Save Konfigurasi
```
User → Simpan Config → /api/config (POST) → Vercel Blob Storage (config/config.json)
```

### Load Konfigurasi
```
Aplikasi Load → /api/config (GET) ← Vercel Blob Storage (config/config.json)
```

## 🌐 URL Logo

Logo yang diupload akan memiliki URL publik seperti:
```
https://{random-id}.public.blob.vercel-storage.com/logos/logo-1234567890.png
```

URL ini dapat diakses oleh semua pengguna tanpa autentikasi.

## ⚠️ Troubleshooting

### Error: "Failed to upload logo"
- Pastikan `BLOB_READ_WRITE_TOKEN` sudah di-set di Vercel
- Cek ukuran file (max 100KB)
- Cek format file (PNG, JPG, SVG)

### Error: "Failed to save configuration"
- Pastikan Blob storage sudah terhubung
- Cek logs di Vercel Dashboard → Deployments → View Logs

### Logo tidak muncul di browser lain
- Pastikan deploy sudah berhasil
- Clear cache browser
- Cek console untuk error

## 💰 Pricing

Vercel Blob Storage gratis untuk:
- 10 GB storage
- 10 GB bandwidth per bulan

Untuk penggunaan normal, ini sudah lebih dari cukup!

## 📝 Notes

- File konfigurasi disimpan di `config/config.json` dalam Blob storage
- Logo disimpan di folder `logos/` dalam Blob storage
- Favicon disimpan di folder `favicons/` dalam Blob storage
- Setiap upload logo baru akan membuat file baru (file lama tidak otomatis terhapus)
