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

---

## 12. Kontrak API (REST Endpoints)

Base URL: `http://localhost:5000/api`

Semua response mengikuti format konsisten:
- **Success:** `{ success: true, message: string, data: any, pagination?: { page, limit, total, totalPages, hasNext, hasPrev } }`
- **Error:** `{ success: false, message: string, errors?: any }`

### 12.1 Auth Routes (`/api/auth`)

| Method | Path | Auth? | Validator | Deskripsi |
|---|---|---|---|---|
| POST | `/auth/register` | ❌ | registerSchema (Zod) | Registrasi user baru, default role: Member |
| POST | `/auth/login` | ❌ | loginSchema | Login, return access+refresh token |
| POST | `/auth/refresh-token` | ❌ | refreshTokenSchema | Refresh access token (token rotation) |
| GET | `/auth/profile` | ✅ | — | Ambil profil user yang sedang login |
| PUT | `/auth/profile` | ✅ | updateProfileSchema | Update profil user |
| PUT | `/auth/change-password` | ✅ | changePasswordSchema | Ganti password (verifikasi password lama) |
| POST | `/auth/forgot-password` | ❌ | forgotPasswordSchema | Request reset token (1 jam expiry) |
| POST | `/auth/reset-password` | ❌ | resetPasswordSchema | Reset password dengan token |

### 12.2 User Routes (`/api/users`) — Khusus Admin

| Method | Path | Auth? | Authorization | Validator | Deskripsi |
|---|---|---|---|---|---|
| GET | `/users` | ✅ | Admin | — | List user (search, role, isActive, sort, order, page, limit) |
| GET | `/users/roles` | ✅ | Admin | — | List semua role |
| GET | `/users/:id` | ✅ | Admin | — | Detail user berdasarkan ID |
| POST | `/users` | ✅ | Admin | createUserSchema | Buat user baru |
| PUT | `/users/:id` | ✅ | Admin | updateUserSchema | Update user |
| DELETE | `/users/:id` | ✅ | Admin | — | Soft-delete user |

### 12.3 Project Routes (`/api/projects`)

| Method | Path | Auth? | Authorization | Deskripsi |
|---|---|---|---|---|
| GET | `/projects` | ✅ | — | List project (non-admin hanya lihat project sendiri) |
| GET | `/projects/:id` | ✅ | — | Detail project (tasks, members, leader) |
| POST | `/projects` | ✅ | Admin, Project Leader | Buat project (creator = leader + member pertama) |
| PUT | `/projects/:id` | ✅ | Admin, Project Leader | Update project (hanya leader/admin) |
| DELETE | `/projects/:id` | ✅ | Admin, Project Leader | Soft-delete project |

### 12.4 Project Member Routes (`/api/members`)

| Method | Path | Auth? | Deskripsi |
|---|---|---|---|
| GET | `/members/project/:projectId` | ✅ | List anggota project |
| POST | `/members/project/:projectId` | ✅ | Tambah anggota + kirim notifikasi |
| DELETE | `/members/project/:projectId/user/:userId` | ✅ | Hapus anggota dari project |

### 12.5 Task Routes (`/api/tasks`)

| Method | Path | Auth? | Deskripsi |
|---|---|---|---|
| GET | `/tasks` | ✅ | List task (search, status, priority, projectId, assigneeId, sort, page, limit) |
| GET | `/tasks/:id` | ✅ | Detail task (comments, attachments, assignee) |
| GET | `/tasks/project/:projectId` | ✅ | List task per project |
| POST | `/tasks` | ✅ | Buat task baru (notifikasi ke assignee) |
| PUT | `/tasks/:id` | ✅ | Update task |
| PATCH | `/tasks/:id/status` | ✅ | Update status task saja |
| DELETE | `/tasks/:id` | ✅ | Hard-delete task |

### 12.6 Comment Routes (`/api/comments`)

| Method | Path | Auth? | Deskripsi |
|---|---|---|---|
| GET | `/comments/task/:taskId` | ✅ | List komentar pada task |
| POST | `/comments/task/:taskId` | ✅ | Tambah komentar |
| PUT | `/comments/:id` | ✅ | Update komentar |
| DELETE | `/comments/:id` | ✅ | Hapus komentar (hanya pemilik/admin) |

### 12.7 Attachment Routes (`/api/attachments`)

| Method | Path | Auth? | Deskripsi |
|---|---|---|---|
| GET | `/attachments/task/:taskId` | ✅ | List lampiran pada task |
| POST | `/attachments/task/:taskId` | ✅ | Upload lampiran (multipart/form-data, max 5MB) |
| DELETE | `/attachments/:id` | ✅ | Hapus lampiran (hanya uploader/admin) |

### 12.8 Notification Routes (`/api/notifications`)

| Method | Path | Auth? | Deskripsi |
|---|---|---|---|
| GET | `/notifications` | ✅ | List notifikasi user |
| PATCH | `/notifications/:id/read` | ✅ | Tandai dibaca |
| PATCH | `/notifications/read-all` | ✅ | Tandai semua dibaca |

### 12.9 Dashboard & Lainnya

| Method | Path | Auth? | Deskripsi |
|---|---|---|---|
| GET | `/dashboard/stats` | ✅ | Statistik: total project, task, completed, overdue, members |
| GET | `/activity-logs` | ✅ | Log aktivitas (admin: semua, user: scope project sendiri) |
| GET | `/activity-logs/project/:projectId` | ✅ | Log aktivitas per project |
| GET | `/health` | ❌ | Health check `{ status: 'OK', timestamp }` |

**Total: ~37 endpoint aktif**

---

## 13. Middleware

### 13.1 Authentication & Authorization (`auth.middleware.ts`)

| Middleware | Fungsi |
|---|---|
| `authenticate` | Validasi JWT dari header `Authorization: Bearer <token>`, cek user aktif & tidak soft-deleted, attach `req.user` |
| `authorize(...roles)` | Higher-order middleware, cek `req.user.roleName` terhadap daftar role yang diizinkan. Return 403 jika tidak cocok |

### 13.2 Validation (`validate.middleware.ts`)

- Middleware generik: `validate(schema, source='body')`
- Menggunakan **Zod** untuk parsing & validasi
- Error Zod diformat menjadi `{ [field]: [messages] }` dengan status 422

### 13.3 File Upload (`upload.middleware.ts`)

- **Multer** dengan disk storage ke folder `uploads/`
- Filename: `${fieldname}-${timestamp}-${random}${ext}`
- Filter: JPEG, PNG, GIF, WebP, PDF
- Max size: **5MB**

### 13.4 Error Handler (`error.middleware.ts`)

**Custom Error Classes:**

| Class | HTTP Status |
|---|---|
| `AppError` (base) | configurable |
| `BadRequestError` | 400 |
| `UnauthorizedError` | 401 |
| `ForbiddenError` | 403 |
| `NotFoundError` | 404 |
| `ValidationError` | 422 |

**Penanganan error spesifik:**
- Prisma `P2002` → 409 Conflict (unique constraint)
- Prisma `P2025` → 404 Not Found
- `JsonWebTokenError` → 401 Invalid token
- `TokenExpiredError` → 401 Token expired
- Multer `LIMIT_FILE_SIZE` → 400 File too large
- Default → 500 Internal Server Error

---

## 14. Validator (Zod Schemas)

### 14.1 Auth Validators

```
registerSchema: name (2-100), email (valid), password (min 8), confirmPassword (harus cocok)
loginSchema: email (valid), password (min 1)
forgotPasswordSchema: email (valid)
resetPasswordSchema: token (min 1), password (min 8), confirmPassword (harus cocok)
refreshTokenSchema: refreshToken (min 1)
```

### 14.2 User Validators

```
createUserSchema: name (2-100), email (valid), password (min 8), roleId (int positif), phoneNumber? (max 20), bio? (max 500)
updateUserSchema: semua opsional — name, email, roleId, isActive (boolean), phoneNumber, bio
updateProfileSchema: name? (2-100), phoneNumber? (max 20, nullable), bio? (max 500, nullable)
changePasswordSchema: currentPassword (min 1), password (min 8)
```

### 14.3 Project Validators

```
createProjectSchema: name (2-200), description? (max 2000), status? (enum), startDate? (ISO8601), endDate? (ISO8601)
updateProjectSchema: semua opsional/nullable
```

### 14.4 Task & Comment Validators

```
createTaskSchema: projectId (int, required), assigneeId? (nullable), title (2-300), description? (max 5000), priority? (enum), status? (enum), dueDate? (nullable)
updateTaskSchema: semua opsional/nullable
updateTaskStatusSchema: status (required enum)
createCommentSchema: content (1-5000)
updateCommentSchema: content (1-5000)
```

---

## 15. Skema Prisma Lengkap (Implementasi)

Model Prisma menggunakan MySQL dengan snake_case mapping.

### 15.1 Enum

```prisma
enum ProjectStatus { PLANNING, ONGOING, COMPLETED, CANCELLED }
enum TaskPriority { LOW, MEDIUM, HIGH, URGENT }
enum TaskStatus { TODO, IN_PROGRESS, REVIEW, DONE }
enum NotificationType { SUCCESS, ERROR, WARNING, INFO }
```

### 15.2 Index & Constraint Tambahan

- `ProjectMember`: **unique constraint** pada `[projectId, userId]` — mencegah duplikasi keanggotaan
- `UserProfile`: `userId` bersifat **unique** — menjamin relasi 1:1
- Database-level index pada: foreign key, status, priority, dueDate, email, deletedAt, isRead, createdAt
- Cascade delete pada: ProjectMember (dari Project dan User), Comment dan Attachment (dari Task), Notification dan ActivityLog (dari User)
- Soft delete: User dan Project menggunakan nullable `deletedAt` field
- Task assignee: `onDelete: SetNull` — jika user dihapus, task tetap ada tanpa assignee

---

## 16. Alur Autentikasi (Detail Implementasi)

### 16.1 Registrasi

```
1. Client POST /auth/register { name, email, password, confirmPassword }
2. Server validasi Zod → cek email unik → cari role "Member"
3. Hash password (bcrypt, 10 rounds)
4. Buat User + UserProfile kosong dalam 1 transaksi
5. Generate access token (15 menit) + refresh token (7 hari)
6. Return { user, accessToken, refreshToken }
7. Client simpan ke localStorage, set Axios header
```

### 16.2 Login

```
1. Client POST /auth/login { email, password }
2. Server cari user (where: email, deletedAt: null), cek isActive
3. Compare bcrypt → jika cocok, generate token pair
4. Buat ActivityLog "User logged in"
5. Return { user, accessToken, refreshToken }
```

### 16.3 Token Refresh

```
1. Client POST /auth/refresh-token { refreshToken }
2. Server verify refresh token → cari user → cek aktif & tidak soft-deleted
3. Generate access + refresh token baru (token rotation)
4. Return { accessToken, refreshToken }
```

### 16.4 Frontend Auto-Refresh

Axios interceptor pada frontend:
- Jika response 401 → otomatis coba refresh token
- Jika refresh berhasil → retry request original
- Jika refresh gagal → clear localStorage → redirect ke `/login`
- Flag `_retry` mencegah infinite loop

### 16.5 Password Reset Flow

```
1. POST /auth/forgot-password { email }
   → Generate crypto.randomBytes(32) hex token
   → Simpan resetToken + resetTokenExpiry (1 jam) ke user
   → Return token (catatan: email belum diimplementasikan)

2. POST /auth/reset-password { token, password, confirmPassword }
   → Validasi token cocok dan belum expired
   → Hash password baru, clear resetToken
```

### 16.6 JWT Payload

```typescript
{ userId: number, email: string, roleId: number, roleName: string }
```

---

## 17. Arsitektur Frontend (Detail Implementasi)

### 17.1 Context

**AuthContext** menyimpan:
- `user`, `isLoading`, `isAuthenticated` (derived `!!user`)
- Method: `login()`, `register()`, `logout()`, `updateUser()`
- Auto-fetch profil pada mount jika ada `accessToken` di localStorage

**ThemeContext** menyimpan:
- `isDark`, `toggleTheme()`
- Inisialisasi dari localStorage atau `prefers-color-scheme: dark`
- Toggle class `dark` pada `document.documentElement`

### 17.2 Routing & Guards

| Guard | Logika |
|---|---|
| `PublicRoute` | Jika sudah login → redirect `/dashboard`. Tampilkan loading spinner saat cek auth |
| `PrivateRoute` | Jika belum login → redirect `/login`. Tampilkan loading spinner saat cek auth |
| `RoleRoute` | Extends PrivateRoute + cek `user.role` terhadap `allowedRoles[]`. Jika tidak cocok → redirect `/403` |

**Peta Route Lengkap:**

| Route | Guard | Layout | Halaman |
|---|---|---|---|
| `/` | PublicRoute | ❌ | LandingPage |
| `/login` | PublicRoute | ❌ | AuthPage |
| `/register` | PublicRoute | ❌ | AuthPage |
| `/forgot-password` | PublicRoute | ❌ | ForgotPasswordPage |
| `/reset-password` | PublicRoute | ❌ | ResetPasswordPage |
| `/dashboard` | PrivateRoute | ✅ | DashboardPage |
| `/projects` | PrivateRoute | ✅ | ProjectListPage |
| `/projects/new` | PrivateRoute | ✅ | ProjectFormPage |
| `/projects/:id` | PrivateRoute | ✅ | ProjectDetailPage |
| `/projects/:id/edit` | PrivateRoute | ✅ | ProjectFormPage |
| `/tasks` | PrivateRoute | ✅ | TaskListPage |
| `/tasks/new` | PrivateRoute | ✅ | TaskFormPage |
| `/tasks/:id` | PrivateRoute | ✅ | TaskDetailPage |
| `/tasks/:id/edit` | PrivateRoute | ✅ | TaskFormPage |
| `/notifications` | PrivateRoute | ✅ | NotificationPage |
| `/activity-log` | PrivateRoute | ✅ | ActivityLogPage |
| `/profile` | PrivateRoute | ✅ | ProfilePage |
| `/users` | RoleRoute [Admin] | ✅ | UserListPage |
| `/users/new` | RoleRoute [Admin] | ✅ | UserFormPage |
| `/users/:id/edit` | RoleRoute [Admin] | ✅ | UserFormPage |
| `/401, /403, /404, /500` | — | ❌ | Error Page |
| `*` | — | ❌ | Navigate → /404 |

### 17.3 Layout

- **Desktop (≥lg):** Sidebar kiri (264px) + topbar + konten
  - Sidebar: logo, "New Project" CTA, navigasi, profil, logout
  - Topbar: welcome message, theme toggle, notification bell (polling 30 detik) dengan unread badge, avatar
- **Mobile:** Hamburger menu → sidebar overlay slide-in
- Deteksi link aktif: `pathname === path || pathname.startsWith(path + '/')`

### 17.4 Komponen Reusable (UI.tsx)

| Komponen | Fungsi |
|---|---|
| `Pagination` | Prev/next, nomor halaman, ellipsis, info "Showing X-Y of Z", limit selector (5/10/20/50) |
| `Badge` | Pill badge dengan 7 varian warna (default, success, warning, danger, info, purple, teal) + dark mode |
| `getStatusBadge()` | Map status project/task ke Badge variant |
| `getPriorityBadge()` | Map prioritas task ke Badge variant |
| `Modal` | Backdrop blur overlay, glass-card, size sm/md/lg, close button, click-outside-to-close |
| `ConfirmDialog` | Modal konfirmasi dengan confirm/cancel button, variant danger/primary |
| `LoadingSpinner` | Spinner centered, 3 ukuran (sm/md/lg) |
| `EmptyState` | Ikon + judul + deskripsi + optional action button |

### 17.5 Custom Hooks

| Hook | Fungsi |
|---|---|
| `useDebounce<T>(value, delay=300)` | Debounce standard untuk search input |

### 17.6 Service Layer (api.ts)

- Axios instance dengan `baseURL: '/api'` (relatif, melalui Vite proxy)
- Request interceptor: attach `Bearer ${accessToken}` dari localStorage
- Response interceptor: auto-refresh token pada 401

---

## 18. Detail 20 Halaman Frontend

### 18.1 Halaman Publik

| # | Halaman | Baris | Fitur Utama |
|---|---|---|---|
| 1 | **LandingPage** | 143 | Hero section dark-themed, animated gradient blobs, mock dashboard preview, 4 feature cards, CTA section, footer |
| 2 | **AuthPage** | 437 | Split-screen, flip card 3D, TaskBot mascot interaktif (head + full-body), form login/register, demo accounts |
| 3 | **ForgotPasswordPage** | 106 | Split-screen, email input, tampilan "Check Your Email" setelah sukses |
| 4 | **ResetPasswordPage** | 127 | Baca `?token=` dari URL, password + confirm, redirect ke login |

### 18.2 Halaman Dashboard & Utama

| # | Halaman | Baris | Fitur Utama |
|---|---|---|---|
| 5 | **DashboardPage** | 122 | 6 stat cards (grid 3 kolom), task distribution bar chart, recent activity list |
| 6 | **ProjectListPage** | 119 | Search debounce, filter status, sort (A-Z/Z-A/newest/oldest), grid card view, pagination |
| 7 | **ProjectDetailPage** | 201 | Info project, team members chips, **Kanban board** (4 kolom: Todo/In Progress/Review/Done), inline status change, delete confirm |
| 8 | **ProjectFormPage** | 112 | Shared create/edit, fields: name, description, status, start/end date |

### 18.3 Halaman Task

| # | Halaman | Baris | Fitur Utama |
|---|---|---|---|
| 9 | **TaskListPage** | 138 | Search, filter status+priority, sort, table view, pagination |
| 10 | **TaskDetailPage** | 188 | Info task, status change dropdown, upload attachment (FormData), komentar thread, assignee info |
| 11 | **TaskFormPage** | 137 | Dynamic dependency (pilih project → load members), support `?projectId=` param |

### 18.4 Halaman Admin & User

| # | Halaman | Baris | Fitur Utama |
|---|---|---|---|
| 12 | **UserListPage** | 141 | Admin only, search, filter role, table view, inline delete |
| 13 | **UserFormPage** | 142 | Admin only, create/edit, load roles dari API |
| 14 | **ProfilePage** | 170 | Tab profil (name, phone, bio) + tab change password, avatar initial |

### 18.5 Halaman Notifikasi & Log

| # | Halaman | Baris | Fitur Utama |
|---|---|---|---|
| 15 | **NotificationPage** | 112 | Unread count, mark all read, type-colored icon, unread indicator (left border accent) |
| 16 | **ActivityLogPage** | 77 | Color-coded action icons, user info, project link, timestamp, pagination fixed 20/page |

### 18.6 Halaman Error

| # | Halaman | Baris | Fitur Utama |
|---|---|---|---|
| 17 | **Error401Page** | — | Lock icon, link ke /login |
| 18 | **Error403Page** | — | Shield icon, link ke /dashboard |
| 19 | **Error404Page** | — | Question icon, link ke /dashboard |
| 20 | **Error500Page** | — | Warning icon, link + "Try Again" (reload) |

---

## 19. Seed Data (Detail)

File seed (`prisma/seed.ts`) melakukan **full wipe + recreate** dalam urutan:

### 19.1 Jumlah Data per Tabel

| Tabel | Jumlah | Detail |
|---|---|---|
| `roles` | 3 | Admin, Project Leader, Member |
| `users` | 25 | 2 Admin, 5 Project Leader, 18 Member |
| `user_profiles` | 25 | Satu per user, dengan phone/bio/avatar |
| `projects` | 22 | Berbagai status (PLANNING, ONGOING, COMPLETED, CANCELLED) |
| `project_members` | ~46 | Leader otomatis + member tambahan |
| `tasks` | 30 | Berbagai prioritas & status, beberapa dengan due_date |
| `comments` | 25 | Konten realistis (code review, status update, saran) |
| `attachments` | 22 | Mockup, PDF, screenshot (URL saja, bukan file fisik) |
| `notifications` | 25 | Semua tipe (INFO, SUCCESS, WARNING, ERROR), campuran read/unread |
| `activity_logs` | 30 | project_created, task_status_changed, member_added, dll |

> Seluruh tabel memiliki **≥20 baris**, memenuhi ketentuan projek.

### 19.2 Akun Demo

| Role | Email | Password |
|---|---|---|
| Admin | `admin@taskflow.com` | `password123` |
| Project Leader | `andi@taskflow.com` | `password123` |
| Member | `farhan@taskflow.com` | `password123` |

---

## 20. Keamanan & Best Practices

| Aspek | Implementasi |
|---|---|
| **Password Hashing** | bcrypt, 10 rounds |
| **JWT Access Token** | 15 menit expiry |
| **JWT Refresh Token** | 7 hari expiry, token rotation |
| **SQL Injection** | Aman — Prisma menggunakan parameterized query |
| **File Upload** | Tipe whitelist (JPEG, PNG, GIF, WebP, PDF) + max 5MB |
| **CORS** | Dikonfigurasi untuk frontend URL |
| **Soft Delete** | User dan Project — data tidak benar-benar dihapus |
| **Role-Based Access** | Middleware `authorize()` pada endpoint sensitif |
| **Input Validation** | Zod schema pada setiap endpoint POST/PUT |
| **Error Handling** | Global error handler, format konsisten, tidak leak stack trace |
| **Auto-Refresh** | Frontend Axios interceptor, transparent token refresh |

---

## 21. TaskBot Mascot — Animasi Interaktif (Detail Implementasi)

### 21.1 Konsep

TaskBot adalah mascot robot interaktif yang menghiasi halaman login/register, memberikan sentuhan playful tanpa mengganggu fungsi. Ada **dua varian** yang ditempatkan di lokasi berbeda:

### 21.2 TaskBot Head (Di Atas Card Login/Register)

- **Lokasi:** Centered di atas glass-card form, visible di semua ukuran layar
- **Ukuran:** ~120×95px, hanya kepala robot (tanpa badan/tangan/kaki)
- **Elemen desain:**
  - Rounded-rect "kotak kepala" dengan outline teal
  - Antena di atas dengan bola LED yang glow
  - "Layar wajah" di dalam kepala (persegi panjang rounded, warna `#CCFBF1`)
  - Dua mata bulat + titik highlight putih (pupil)
  - Mulut senyum kecil (path lengkung)
  - Ear-like protrusions di kedua sisi

**Perilaku animasi:**

| State | Reaksi |
|---|---|
| Idle (tidak ada field fokus) | Floating animation (bob atas-bawah), mata berkedip setiap ~4 detik |
| Focus pada email | Pupil bergeser ke bawah-kanan (tracking input) |
| Focus pada name | Pupil bergeser ke atas-kanan (tracking input) |
| Mengetik password (hidden) | Mata menutup (garis horizontal menggantikan lingkaran), LED antena meredup |
| Show password (klik ikon mata) | Mata terbuka kembali, LED antena kembali terang |
| Blur / kosong | Kembali ke posisi normal |

### 21.3 Full-Body TaskBot (Di Panel Samping Kiri)

- **Lokasi:** Di bawah teks "Selamat Datang Kembali" / "Siap Mulai?", hanya visible pada desktop (≥lg breakpoint)
- **Ukuran:** ~260×300px, robot utuh (kepala + badan + tangan + kaki)
- **Elemen desain:**
  - Kepala: sama dengan versi kecil (antena, layar wajah, mata)
  - Badan: persegi panjang rounded dengan badge "T" (TaskFlow) di dada
  - Dua lengan: rounded-rect yang berayun (swing animation)
  - Dua kaki: rounded-rect + telapak kaki
  - Leher: connector antara kepala dan badan

**Perilaku animasi:**

| State | Reaksi |
|---|---|
| Idle | Body bobbing (naik-turun halus), lengan berayun bergantian, mata berkedip periodik |
| Focus pada input apapun | Kepala menoleh ke kanan (ke arah form), mata bergeser ke kanan (tracking) |
| Mengetik password (hidden) | Kepala menoleh ke kiri (memalingkan pandangan), mata menutup — gestur "tidak mengintip" |
| Show password | Kepala kembali menghadap form, mata terbuka |
| Blur | Kembali ke posisi idle |

### 21.4 Implementasi Teknis

- SVG inline murni (tanpa file eksternal)
- Animasi menggunakan kombinasi:
  - Tailwind keyframes: `blink`, `swingArmL`, `swingArmR`, `bodyBob`, `float`
  - CSS transitions: `transform`, `fill`, `opacity` dengan `ease` 0.2-0.4 detik
  - Inline style `transform-origin` untuk rotasi natural
- State management: `focusedField` ('none' | 'email' | 'name' | 'password') + `isMascotHiding` (boolean)
- Responsif: Full-body tersembunyi di mobile (panel kiri hidden), head-only tetap muncul

---

## 22. Cara Menjalankan Projek

### 22.1 Prasyarat

- Node.js ≥ 18
- MySQL ≥ 8.0
- npm atau yarn

### 22.2 Setup Database

```bash
# Buat database MySQL
mysql -u root -e "CREATE DATABASE taskflow;"
```

### 22.3 Setup Backend

```bash
cd backend
npm install

# Sesuaikan file .env jika perlu (DATABASE_URL, JWT_SECRET, dll)

# Jalankan migrasi Prisma
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Jalankan seed data
npm run prisma:seed

# Jalankan server development
npm run dev
# Server berjalan di http://localhost:5000
# API docs di http://localhost:5000/api-docs
```

### 22.4 Setup Frontend

```bash
cd frontend
npm install

# Jalankan development server
npm run dev
# Frontend berjalan di http://localhost:5173
```

### 22.5 Build Produksi

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Output di folder dist/, siap di-serve oleh web server
```

---

## 23. Catatan Kepatuhan terhadap Ketentuan Projek (Update)

| Ketentuan | Status | Bukti |
|---|---|---|
| Minimal 6 entitas utama | ✅ | 10 model Prisma |
| Minimal 5 relasi, mencakup 1-1, 1-M, M-1, M-M | ✅ | 7 relasi terdokumentasi (bagian 4.2) |
| Minimal 2 role dengan hak akses berbeda | ✅ | 3 role (Admin, Project Leader, Member) |
| CRUD lengkap tanpa dummy | ✅ | 37 endpoint REST aktif |
| Dashboard real-time | ✅ | DashboardPage dengan statistik live |
| Search, Filter, Sorting, Pagination | ✅ | Semua halaman list (Project, Task, User, Activity, Notification) |
| Upload file gambar/PDF | ✅ | Multer, max 5MB, whitelist tipe |
| Soft delete minimal 2 tabel | ✅ | `users` dan `projects` (field `deletedAt`) |
| Normalisasi 3NF | ✅ | Tidak ada data berulang |
| Timestamp di semua tabel utama | ✅ | `created_at`/`updated_at` di semua model |
| Seed data minimal 20 per tabel utama | ✅ | 25 users, 22 projects, 30 tasks, 25 comments, dll |
| Validasi frontend & backend | ✅ | Zod (backend), manual validation (frontend) |
| Responsive layout | ✅ | Mobile (≤768px), tablet (769–1024px), desktop (>1024px) |
| Dark mode | ✅ | ThemeContext + Tailwind `dark:` classes |
| Error handling lengkap | ✅ | 4 halaman error (401, 403, 404, 500) + global error handler backend |
| Dokumentasi README.md | ⏳ | Perlu dibuat terpisah sesuai template |
| Flowchart perancangan sistem | ⏳ | Naratif sudah ada, perlu digambar visual |

---

*Dokumen ini merupakan dokumentasi lengkap projek TaskFlow yang mencakup perancangan, arsitektur, implementasi teknis, dan panduan deployment. Terakhir diperbarui: Juli 2026.*