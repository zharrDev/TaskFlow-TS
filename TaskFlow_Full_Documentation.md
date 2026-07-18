# TaskFlow – Dokumentasi Lengkap Projek
### Sistem Manajemen Proyek dan Kolaborasi Tim

---

## 1. Gambaran Umum

TaskFlow adalah aplikasi fullstack berbasis web untuk membantu tim mengelola proyek, membagi tugas, memantau progres, dan berkolaborasi dalam satu platform terpusat.

**Latar Belakang:** Banyak tim masih menggunakan aplikasi terpisah untuk komunikasi, penyimpanan file, dan pencatatan progres. TaskFlow menyatukan seluruh aktivitas tersebut dalam satu platform.

**Tujuan:**
- Mengelola proyek dari awal hingga selesai
- Membagi tugas antar anggota tim
- Memantau progres secara real-time
- Mengelola deadline dan prioritas
- Menyimpan lampiran terkait tugas
- Meningkatkan kolaborasi tim melalui komentar dan notifikasi

**Target Pengguna:** Mahasiswa, Organisasi Kampus, Startup, UMKM, Event Organizer, Tim Marketing, Tim Desain, Tim IT, Perusahaan kecil.

---

## 2. Role & Hak Akses

| Role | Deskripsi | Hak Akses |
|---|---|---|
| **Admin** | Pengelola sistem secara keseluruhan | Kelola semua user, kelola role, lihat seluruh project, akses laporan sistem, hapus/nonaktifkan akun |
| **Project Leader** | Pemilik/pengelola sebuah project | Membuat project, mengelola anggota tim, membuat & assign task, memonitor progres, mengelola deadline |
| **Member** | Anggota tim pelaksana | Melihat project yang diikuti, mengerjakan task yang di-assign, update status task, upload lampiran, memberi komentar |

> Catatan penilaian: Ketentuan projek meminta minimal 2 role dengan hak akses berbeda — TaskFlow memiliki 3 role, ini menjadi nilai tambah untuk kompleksitas RBAC.

---

## 3. Modul Aplikasi

1. Authentication (Login, Register, Logout, Forgot/Reset Password)
2. Dashboard (statistik & aktivitas real-time)
3. User Management
4. Project Management
5. Team / Anggota Project
6. Task Management
7. Comment
8. Attachment (Upload File)
9. Notification
10. Activity Log

---

## 4. Struktur Database

### 4.1 Daftar Tabel Utama (9 tabel)

| Tabel | Keterangan |
|---|---|
| `roles` | Master data role (Admin, Project Leader, Member) |
| `users` | Data pengguna |
| `user_profiles` | Data profil tambahan tiap user (relasi 1-1) |
| `projects` | Data proyek |
| `project_members` | Tabel pivot user ↔ project (many-to-many) |
| `tasks` | Data tugas dalam sebuah project |
| `comments` | Komentar pada task |
| `attachments` | Lampiran file pada task |
| `notifications` | Notifikasi user |
| `activity_logs` | Riwayat aktivitas sistem |

> **Penyesuaian penting:** ditambahkan tabel `user_profiles` untuk memenuhi requirement relasi **One-to-One** yang belum ada di rancangan awal. Tanpa ini, seluruh relasi hanya berupa 1-M dan M-M, sehingga tidak memenuhi ketentuan "wajib terdapat One-to-One".

### 4.2 Pemetaan Jenis Relasi (memenuhi requirement 4 jenis relasi)

| Relasi | Tabel A | Tabel B | Jenis |
|---|---|---|---|
| 1 | `users` | `user_profiles` | **One to One** |
| 2 | `roles` | `users` | **One to Many** |
| 3 | `projects` | `tasks` | **One to Many** |
| 4 | `tasks` | `comments` | **One to Many** |
| 5 | `tasks` | `attachments` | **One to Many** |
| 6 | `users` | `projects` (via `project_members`) | **Many to Many** |
| 7 | `users` | `tasks` (assignee, Many to One dari sisi task) | **Many to One** |

Ini sudah lebih dari cukup memenuhi ketentuan minimal 5 relasi dengan keempat jenis relasi (1-1, 1-M, M-1, M-M).

### 4.3 Skema Detail Kolom

```
roles
- id (PK)
- name              // Admin, Project Leader, Member
- created_at
- updated_at

users
- id (PK)
- role_id (FK -> roles.id)
- name
- email (unique)
- password (hashed)
- is_active
- created_at
- updated_at
- deleted_at         // soft delete

user_profiles
- id (PK)
- user_id (FK -> users.id, unique)   // relasi 1-1
- phone_number
- avatar_url
- bio
- created_at
- updated_at

projects
- id (PK)
- leader_id (FK -> users.id)
- name
- description
- status              // planning, ongoing, completed, cancelled
- start_date
- end_date
- created_at
- updated_at
- deleted_at          // soft delete

project_members
- id (PK)
- project_id (FK -> projects.id)
- user_id (FK -> users.id)
- joined_at

tasks
- id (PK)
- project_id (FK -> projects.id)
- assignee_id (FK -> users.id, nullable)
- title
- description
- priority            // low, medium, high, urgent
- status              // todo, in_progress, review, done
- due_date
- created_at
- updated_at

comments
- id (PK)
- task_id (FK -> tasks.id)
- user_id (FK -> users.id)
- content
- created_at
- updated_at

attachments
- id (PK)
- task_id (FK -> tasks.id)
- uploaded_by (FK -> users.id)
- file_name
- file_url
- file_type          // image, pdf
- created_at

notifications
- id (PK)
- user_id (FK -> users.id)
- title
- message
- type               // success, error, warning, info
- is_read
- created_at

activity_logs
- id (PK)
- user_id (FK -> users.id)
- project_id (FK -> projects.id, nullable)
- action              // e.g. "created task", "updated status"
- description
- created_at
```

### 4.4 Normalisasi & Ketentuan Tambahan
- Seluruh tabel di atas sudah dirancang hingga **3NF** — tidak ada data berulang, setiap kolom bergantung penuh pada primary key.
- Timestamp `created_at`/`updated_at` diterapkan di semua tabel utama.
- **Soft delete** diterapkan minimal di `users` dan `projects` (2 tabel, sesuai ketentuan minimal).
- **Seed data** minimal 20 baris per tabel utama (`users`, `projects`, `tasks`, dst) untuk keperluan pengujian.

---

## 5. Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React.js, Tailwind CSS, Axios, React Router |
| Form & Validasi | React Hook Form + Zod |
| Notifikasi UI | react-hot-toast / sonner |
| Backend | Node.js, Express.js, Prisma ORM |
| Auth | JWT (access + refresh token), bcrypt |
| Upload File | Multer |
| Database | MySQL |
| Dokumentasi API | Swagger (OpenAPI) |

**Alasan pemilihan:**
- Satu bahasa (JavaScript) di frontend & backend → mempercepat development.
- Prisma memudahkan pendefinisian relasi kompleks (1-1, 1-M, M-M) dan mendukung migration serta seeding bawaan.
- bcrypt + JWT memenuhi requirement security wajib.
- Prisma otomatis menggunakan parameterized query sehingga aman dari SQL Injection.

---

## 6. Daftar Fitur Lengkap

### Frontend
- Login, Register, Logout, Forgot Password, Reset Password
- Layout responsif (mobile ≤768px, tablet 769–1024px, desktop >1024px)
- Public Route, Private Route, Role-based Route dengan redirect otomatis
- Dashboard dengan card summary, statistik, dan aktivitas terbaru (real-time)
- CRUD lengkap: Project, Task, User (khusus Admin)
- Search (keyword), Filter (status, kategori/prioritas, tanggal), Sorting (terbaru, terlama, A-Z, Z-A) — dapat dikombinasikan
- Pagination lengkap (previous, next, nomor halaman, info jumlah data, pilihan jumlah data per halaman)
- Upload lampiran (gambar/PDF) pada task
- Form validation realtime (required, min/max karakter, format email, no. telepon, konfirmasi password)
- Toast notification (success, error, warning, info)
- Halaman error: 401, 403, 404, 500 + fallback saat API gagal

### Backend
- REST API penuh (GET, POST, PUT, PATCH, DELETE) dengan status code sesuai
- Autentikasi & otorisasi lengkap + refresh token
- RBAC 3 role dengan middleware pengecekan akses
- CRUD penuh untuk 6+ entitas utama (bukan dummy): User, Project, Task, Comment, Attachment, Project Member
- Validasi server-side di semua endpoint POST/PUT (required, email, unique, min/max, enum, numeric, date)
- Global error handling konsisten (400, 401, 403, 404, 422, 500) dalam format JSON
- Soft delete pada `users` dan `projects`
- API documentation via Swagger
- Search, filter, sort, pagination di endpoint list (contoh: `GET /tasks?search=login&status=in_progress&sort=due_date&page=1&limit=10`)

---

## 7. Rancangan Desain (UI/UX)

### 7.1 Arah Desain
TaskFlow adalah **tools produktivitas berbasis data** (dashboard, tabel, kanban) yang dipakai berjam-jam, jadi arah desainnya diprioritaskan untuk **tenang, jelas, dan gak melelahkan mata** — bukan gaya landing page yang mencolok. Prinsip yang dipegang:
- Flat design, tanpa gradient/shadow berlebihan, supaya konsisten dan ringan saat render banyak data (tabel, kanban, dashboard)
- Warna aksen dipakai secukupnya (tombol utama, badge status, link), bukan mendominasi background
- Mendukung light mode dan dark mode, karena tools kerja idealnya nyaman dipakai lama di kondisi apa pun
- Card bersih dengan whitespace lega untuk struktur informasi seperti project card, task card, dan dashboard summary

### 7.2 Palet Warna yang Disarankan
- **Primary/Aksen:** **Teal** (`#0D9488`, hover `#0F766E`) — dipilih karena asosiasinya dengan fokus dan ketenangan (cocok dengan konsep "flow" di nama TaskFlow), sekaligus membedakan TaskFlow dari mayoritas aplikasi project management lain yang condong ke biru (Trello, Asana) atau ungu (Notion, Linear)
- **Background (light mode):** `#F8FAFC` (slate-50)
- **Background (dark mode):** `#0F172A` (slate-900)
- **Success:** `#22C55E` | **Warning:** `#F59E0B` | **Error:** `#EF4444` | **Info:** `#3B82F6`
- **Aksen hangat pendukung (opsional, untuk ilustrasi/mascot):** amber lembut (`#FAC775`) dan coral lembut (`#F0997B`) — dipakai terbatas di elemen dekoratif seperti mascot doodle, bukan di komponen fungsional
- **Font:** Inter atau Plus Jakarta Sans — bersih, mudah dibaca di ukuran kecil (tabel) maupun besar (heading)

> Teal dipakai secukupnya: logo, tombol utama (primary CTA), link, dan badge status aktif. Sisanya tetap netral (putih/abu-abu) supaya aksennya jadi pusat perhatian tanpa berlebihan.

### 7.3 Halaman Login & Register — Mekanisme Flip Card

Alih-alih dua halaman terpisah, Login dan Register dirancang sebagai **satu kartu yang bisa dibalik (flip card)**:

- Kartu depan (front) menampilkan form **Login**, kartu belakang (back) menampilkan form **Register**
- Ada teks/tombol kecil di bagian bawah kartu: *"Belum punya akun? Daftar"* — saat diklik, kartu melakukan animasi **flip 3D (rotateY 180°)** dan berganti tampilan ke form Register
- Dari form Register, ada tombol sebaliknya: *"Sudah punya akun? Masuk"* — kartu flip balik ke form Login
- Transisi menggunakan CSS 3D transform (`perspective` + `transform-style: preserve-3d` + `backface-visibility: hidden`), durasi sekitar 0.5–0.6 detik dengan easing halus, tanpa loncatan/flicker

**Kolom kata sandi** dilengkapi ikon mata (show/hide password) di ujung kanan input, standar UX pattern, agar user bisa mengecek input tanpa perlu mengetik ulang.

### 7.4 Mascot Doodle Animation (Pendamping Form Password)

Untuk memberi sentuhan playful tanpa mengganggu fungsi, form login/register didampingi **mascot doodle interaktif** yang bereaksi terhadap aktivitas mengetik password.

**Konsep karakter yang disarankan:** bukan kucing, tapi karakter yang lebih merepresentasikan identitas TaskFlow — sesuatu yang bernuansa **"mekanik/produktivitas"** dan tetap terkesan lucu, misalnya:
- **"TaskBot"** — mascot robot kecil sederhana (bentuk kotak/bulat, antena di kepala, layar wajah dengan dua "mata" bulat sederhana) yang menutup layar wajahnya dengan dua lengan mekanik saat password sedang diketik
- Alternatif lain: mascot **gear/roda gigi** dengan wajah simpel, atau mascot **checklist/clipboard** berkaki yang menutup "matanya" dengan clipboard saat sopan menunggu user selesai mengetik

Karakter ini dibuat dengan gaya **doodle flat** (garis outline sederhana, tanpa gradient, warna terbatas 2 tone) supaya konsisten dengan bahasa desain keseluruhan, dan tetap terasa ringan/tidak norak.

**Perilaku animasi:**
| State | Reaksi Mascot |
|---|---|
| Field password kosong / belum fokus | Mascot dalam posisi normal, "melihat" ke arah form |
| User sedang mengetik password (field fokus + ada isi, tipe input masih tersembunyi) | Kedua lengan/tangan mascot terangkat menutup bagian "mata"/layar wajah, sebagai gestur sopan tidak mengintip |
| User klik ikon mata (show password) | Mascot menurunkan tangan, kembali "melihat" karena teks sudah terlihat jelas oleh user sendiri |
| Field password di-blur / kosong lagi | Mascot kembali ke posisi normal |

**Aturan penempatan berdasarkan ukuran mascot:**

| Ukuran Mascot | Penempatan |
|---|---|
| **Besar** (mascot dengan detail lebih banyak, ukuran mendekati/melebihi tinggi kartu) | Ditaruh **di samping kartu login/register**, sejajar secara horizontal di area kosong layar (biasanya baru muncul di layar desktop/tablet yang lebar) |
| **Kecil** (kira-kira sebesar ikon besar/avatar, contoh: setinggi ±150px, seperti mascot kucing versi awal) | Ditaruh **di atas kartu**, sebagai elemen kecil pendamping sebelum form, tidak memakan banyak ruang horizontal |

Aturan ini penting terutama untuk memastikan **responsivitas** — mascot berukuran besar yang ditaruh di samping kartu butuh ruang horizontal lebar, sehingga di layar mobile (sesuai breakpoint pada requirement "Responsive Layout") otomatis disembunyikan atau dipindah ke atas kartu dalam ukuran lebih kecil, supaya layout tidak overflow atau rusak.

### 7.5 Homepage — Hero Section

Bagian hero di homepage menggunakan layout **dua kolom (kiri teks, kanan visual)**, bukan background foto penuh layar. Alasan: foto stok (misal foto orang meeting/kerja tim) cenderung generik dan tidak menjelaskan produk secara spesifik, sedangkan ilustrasi custom langsung menggambarkan fungsi TaskFlow tanpa perlu banyak kata.

**Kolom kiri — Teks:**
- Badge kecil di atas headline, contoh: *"Platform kolaborasi tim"*
- Headline besar (±34px, weight 500): **"Kelola proyek tanpa batas"**
- Deskripsi pendukung: *"TaskFlow menyatukan manajemen proyek, kolaborasi tim, dan pemantauan progres dalam satu platform yang powerful dan elegan."*
- Dua tombol CTA: satu **primary** (solid teal, contoh: "Mulai gratis") dan satu **secondary** (outline netral, contoh: "Lihat demo") — hanya satu tombol yang boleh solid/mencolok, sisanya netral, supaya perhatian user tidak terpecah

**Kolom kanan — Visual:**
- Bukan foto, melainkan **ilustrasi flat custom** berupa papan kanban mini yang merepresentasikan produk TaskFlow secara langsung: tiga kolom (**To do**, **Progress**, **Done**), masing-masing berisi kartu tugas dengan warna kategori berbeda (teal, coral, amber), progress bar kecil pada kartu yang sedang dikerjakan, dan tanda centang pada kartu yang sudah selesai
- Ditambah deretan avatar kecil (lingkaran berwarna dengan inisial) di bagian bawah ilustrasi untuk menunjukkan elemen kolaborasi tim
- Ilustrasi dibuat flat (tanpa gradient/shadow), sehingga konsisten dengan bahasa desain keseluruhan dan tetap ringan saat digabung dengan elemen dashboard lain

**Alasan pendekatan ini dibanding background foto penuh:**
| Foto stok | Ilustrasi flat kanban |
|---|---|
| Generik, sering dipakai landing page SaaS lain | Langsung menjelaskan "apa itu TaskFlow" tanpa kata tambahan |
| Berat untuk performa (resolusi tinggi) | Ringan (vector), scalable di semua ukuran layar |
| Sulit konsisten warna dengan tema teal | Bisa langsung disesuaikan palet warna produk |
| Sering butuh lisensi/hak cipta gambar | 100% custom milik TaskFlow, bebas dipakai |

**Opsi tambahan (opsional):** untuk mengisi ruang kosong di belakang hero section, bisa ditambahkan elemen dekoratif halus seperti pola dot/grid tipis warna abu-abu muda, atau bentuk blob teal dengan opacity rendah di pojok layar — tetap sebagai aksen sekunder, bukan elemen utama yang mengganggu keterbacaan teks.

### 7.6 Struktur Halaman
1. **Landing Page** — hero besar ala NamasteDev (boleh gradient mencolok, tipografi besar), CTA "Mulai Gratis"
2. **Login / Register / Forgot Password / Reset Password**
3. **Dashboard** — card summary (total project aktif, task selesai, task overdue), grafik progres, aktivitas terbaru
4. **Project List** — table/grid card, search, filter status, sort, pagination
5. **Project Detail** — info project, daftar anggota, daftar task dalam bentuk **Kanban Board** (Todo/In Progress/Review/Done)
6. **Task Detail** — deskripsi, assignee, prioritas, deadline, komentar, lampiran
7. **User Management** (khusus Admin) — CRUD user & role
8. **Notification Center**
9. **Halaman Error** — 401, 403, 404, 500

---

## 8. Alur Sistem (Flowchart Naratif)

```
[Start]
  → User membuka aplikasi
  → Sudah login?
      Tidak → Halaman Login/Register
        → Login berhasil? Tidak → tampilkan error → kembali ke form
        → Login berhasil? Ya → simpan JWT → redirect ke Dashboard
      Ya → langsung ke Dashboard
  → Dashboard menampilkan ringkasan project & task
  → User memilih menu:
      a. Project → Lihat daftar project → Buat/Edit/Hapus project (jika Leader/Admin)
                 → Masuk ke Project Detail → Kelola anggota → Kelola Task
      b. Task    → Lihat detail task → Update status → Upload lampiran → Tambah komentar
      c. Notifikasi → Lihat notifikasi terkait task/project
      d. User Management (Admin) → CRUD user & role
  → Setiap aksi CRUD memicu:
      → Validasi input (client & server)
      → Simpan ke database
      → Catat ke activity_logs
      → Kirim notifikasi ke user terkait
      → Tampilkan toast notification (success/error)
  → Logout → hapus token & data autentikasi → kembali ke Login
[End]
```

> Untuk dokumentasi resmi, flowchart ini sebaiknya digambar ulang dalam bentuk diagram visual (draw.io / Figma / Lucidchart) sesuai ketentuan pengumpulan projek.

---

## 9. Struktur Folder Projek

```text
taskflow/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/          // PublicRoute, PrivateRoute, RoleRoute
│   │   ├── hooks/
│   │   ├── services/         // axios instance & API calls
│   │   ├── context/           // auth context
│   │   └── utils/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/       // auth, role check, error handler
│   │   ├── validators/
│   │   ├── services/
│   │   └── utils/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── package.json
└── README.md
```

---

## 10. Rencana Pengembangan Selanjutnya
- Kanban Board interaktif (drag & drop status task)
- Kalender deadline (tampilan bulanan)
- Email notification
- Realtime notification (WebSocket/Socket.IO)
- Mobile App (React Native)

---

## 11. Catatan Kepatuhan terhadap Ketentuan Projek

| Ketentuan | Status |
|---|---|
| Minimal 6 entitas utama | ✅ 9 tabel (10 dengan `user_profiles`) |
| Minimal 5 relasi, mencakup 1-1, 1-M, M-1, M-M | ✅ Terpenuhi (lihat bagian 4.2) |
| Minimal 2 role dengan hak akses berbeda | ✅ 3 role |
| CRUD lengkap tanpa dummy | ✅ Semua entitas utama punya create/read/update/delete yang dipakai user secara nyata |
| Dashboard real-time | ✅ |
| Search, Filter, Sorting, Pagination | ✅ |
| Upload file gambar/PDF | ✅ |
| Soft delete minimal 2 tabel | ✅ `users`, `projects` |
| Normalisasi 3NF | ✅ |
| Timestamp di semua tabel utama | ✅ |
| Seed data minimal 20 per tabel utama | ✅ (perlu dibuat script seed) |
| Dokumentasi README.md | ⏳ Perlu dibuat terpisah sesuai template ketentuan |
| Flowchart perancangan sistem | ⏳ Naratif sudah ada di atas, perlu digambar visual |

---

*Dokumen ini disusun sebagai bahan perancangan awal projek TaskFlow. Detail teknis (skema Prisma lengkap, kontrak API, wireframe visual) dapat dikembangkan lebih lanjut sesuai kebutuhan tim.*