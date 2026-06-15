# Xplorra - Regression Testing Project

## Deskripsi Proyek

Xplorra merupakan aplikasi berbagi resep makanan yang memungkinkan pengguna untuk menambahkan resep, melihat resep, memberikan rating, bookmark, like, komentar, serta mengelola profil pengguna.

Pengujian regresi dilakukan untuk memastikan bahwa perubahan pada kode program tidak menyebabkan kerusakan pada fitur yang sebelumnya telah berjalan dengan baik.

---

## Teknologi yang Digunakan

### Backend

* Node.js
* Express.js
* MySQL

### Testing

* Jest
* Supertest

### Continuous Integration

* GitHub Actions

---

## Cara Menjalankan Project

Install dependency:

```bash
npm install
```

Menjalankan server:

```bash
node server.js
```

---

## Menjalankan Pengujian

Menjalankan seluruh test:

```bash
npx jest
```

Menjalankan test dengan coverage:

```bash
npx jest --coverage
```

---

## Regression Testing

Regression testing dilakukan pada berbagai endpoint utama aplikasi, antara lain:

### Authentication

* Register user
* Login user

### Food Management

* Menampilkan daftar makanan
* Detail makanan
* Pencarian makanan
* Menambah makanan
* Mengubah makanan
* Menghapus makanan

### User Features

* Profile
* Bookmark
* Like
* Rating
* Notifications
* Feedback
* Upload profile picture

### Error Handling

* Token tidak valid
* Data kosong
* ID tidak ditemukan
* Endpoint yang membutuhkan autentikasi

---

## Hasil Pengujian

| Keterangan      | Hasil |
| --------------- | ----- |
| Total Test Case | 62    |
| Passed          | 62    |
| Failed          | 0     |

Seluruh test case berhasil dijalankan tanpa kegagalan.

---

## Hasil Code Coverage

| Metric     | Hasil  |
| ---------- | ------ |
| Statements | 74.35% |
| Branches   | 57.74% |
| Functions  | 90.27% |
| Lines      | 76.25% |

Target minimum line coverage sebesar 75% berhasil tercapai.

---

## Simulasi Regression Testing

Untuk membuktikan kemampuan regression testing dalam mendeteksi bug, dilakukan perubahan pada validasi endpoint register.

Hasil pengujian menunjukkan bahwa test case yang telah dibuat berhasil mendeteksi perubahan tersebut dan menghasilkan failing test. Setelah kode dikembalikan ke kondisi semula, seluruh test kembali berhasil dijalankan.

---

## Continuous Integration

GitHub Actions digunakan untuk menjalankan test suite secara otomatis setiap kali terjadi push ke repository.

Workflow yang digunakan berada pada:

```text
.github/workflows/test.yml
```

---

## Screenshot
1. Hasil seluruh test PASS
   
   <img width="457" height="107" alt="image" src="https://github.com/user-attachments/assets/ef1dbb17-432b-40fa-8889-1c3fb829881b" />
   
2. Hasil code coverage
   
   <img width="723" height="204" alt="Screenshot 2026-06-15 100533" src="https://github.com/user-attachments/assets/50861210-c3ee-4b36-8515-b7d356acf045" />
   
3. Simulasi regression testing (FAIL)
   
   <img width="866" height="408" alt="Screenshot 2026-06-15 025532" src="https://github.com/user-attachments/assets/55727269-7a00-4731-be52-27db0e6002fe" />
   
4. Simulasi regression testing (PASS)
   
   #### Auth Test
   
   <img width="689" height="472" alt="Screenshot 2026-06-15 045213" src="https://github.com/user-attachments/assets/940340f9-f2f2-45c2-b20a-65e12b4161ad" />
   
   #### Foods Test
   
   <img width="616" height="626" alt="Screenshot 2026-06-15 102029" src="https://github.com/user-attachments/assets/5cf054f6-0fb8-4edf-b016-22b610dba5b5" />

    #### Profile Test
   
   <img width="609" height="680" alt="Screenshot 2026-06-15 045325" src="https://github.com/user-attachments/assets/84d41254-80c2-4063-a087-b96c66379465" />

    #### Advanced Test
   
   <img width="596" height="448" alt="Screenshot 2026-06-15 045357" src="https://github.com/user-attachments/assets/56245bbe-49fc-482b-9c84-db4d4cb50de6" />

    #### Owner Test

   <img width="601" height="513" alt="Screenshot 2026-06-15 045428" src="https://github.com/user-attachments/assets/40678be8-800d-4b2b-b900-2302c84c0f26" />

   #### Error-Path Test

    <img width="606" height="535" alt="Screenshot 2026-06-15 045504" src="https://github.com/user-attachments/assets/c8e3274a-aca5-41fd-b274-ab7f533ae456" />
    
5. GitHub Actions Workflow

    <img width="1919" height="944" alt="Screenshot 2026-06-15 101030" src="https://github.com/user-attachments/assets/4fdc50fa-3da8-47ab-a384-4dc3d8311098" />
