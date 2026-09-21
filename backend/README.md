# Todo App Backend - Express.js & TypeScript

Dokumentasi teknis RESTful API Todo menggunakan Express.js, TypeScript, MySQL, dan autentikasi JWT.

## Persyaratan Sistem
- Node.js (v18+)
- MySQL (Laragon / XAMPP)
- Postman (untuk pengujian endpoint)

---

## 1. Import Database MySQL
1. Pastikan service MySQL di **XAMPP** atau **Laragon** sudah aktif (running).
2. Buka **phpMyAdmin** (`http://localhost/phpmyadmin`) atau terminal MySQL.
3. Buat database baru bernama `todo_db` atau import langsung file [todo_db.sql](file:///d:/TUGAS/Pemrograman%20Web%20Framework/todo-app-68/backend/todo_db.sql).
4. Tabel yang akan terbentuk:
   - `users` (id, username, email, password, created_at)
   - `todos` (id, user_id, task, is_completed, created_at)

---

## 2. Setup Lingkungan (.env)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan konfigurasi database dan port:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=todo_db
JWT_SECRET=pwf_2026
```

---

## 3. Instalasi Dependensi & Menjalankan Server
Jalankan perintah berikut di direktori `backend`:

```bash
# Instalasi modul
npm install

# Menjalankan server dalam mode development
npm run dev
```
Server akan berjalan di `http://localhost:5000`.

---

## 4. Daftar Endpoint API

### Auth:
- **POST** `/api/auth/register` : Registrasi akun baru (body: `username`, `email`, `password`)
- **POST** `/api/auth/login` : Login user & mendapatkan token JWT (body: `username`, `password`)

### Todos (Memerlukan Header `Authorization: Bearer <token>`):
- **GET** `/api/todos` : Mengambil semua todo milik user yang sedang login
- **GET** `/api/todos/:id` : Mengambil detail satu todo berdasarkan ID
- **POST** `/api/todos` : Menambahkan todo baru (body: `task`)
- **PUT** `/api/todos/:id` : Memperbarui task atau status is_completed (body: `task`, `is_completed`)
- **DELETE** `/api/todos/:id` : Menghapus todo berdasarkan ID
