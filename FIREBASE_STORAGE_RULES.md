# Firebase Storage Rules Setup

## Masalah Upload Gambar

Jika upload gambar tidak berfungsi, pastikan Firebase Storage Rules sudah dikonfigurasi dengan benar.

## Langkah-langkah Setup:

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project Anda: **chatapp-90f4a**
3. Buka menu **Storage** di sidebar kiri
4. Klik tab **Rules**
5. Ganti rules dengan salah satu opsi berikut:

### Opsi 1: Allow untuk authenticated users (Recommended)
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Opsi 2: Allow untuk semua (hanya untuk testing)
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

6. Klik **Publish** untuk menyimpan perubahan

## Troubleshooting Lainnya:

### 1. Cek Metro Bundler Console
- Lihat output console di terminal yang menjalankan `npm start`
- Perhatikan error messages yang muncul saat upload

### 2. Cek React Native Debugger
- Tekan `Ctrl+M` (Android) atau `Cmd+D` (iOS) di simulator
- Pilih "Debug"
- Buka Chrome DevTools dan lihat console

### 3. Verifikasi Storage Bucket
- Pastikan storage bucket di `firebaseConfig.ts` sesuai dengan Firebase Console
- Current bucket: `chatapp-90f4a.firebasestorage.app`

### 4. Cek Permission
- Pastikan app memiliki permission untuk akses photo library
- Permission sudah diminta di fungsi `pickImage()`

### 5. Test dengan Gambar Kecil
- Coba upload gambar dengan size kecil (<1MB)
- Quality sudah diset ke 0.5 untuk mengurangi size

## Pesan Error yang Mungkin Muncul:

- **"Permission denied"** → Cek Firebase Storage Rules
- **"Network request failed"** → Cek koneksi internet
- **"Quota exceeded"** → Cek quota Firebase Storage (Free tier: 5GB)
- **"Invalid bucket"** → Cek storage bucket name di config

## Testing Upload:

Setelah setup rules, coba:
1. Restart aplikasi
2. Login
3. Klik icon camera (📷)
4. Pilih gambar
5. Tunggu hingga muncul alert "Success" atau error message
6. Cek console logs untuk detail debugging
