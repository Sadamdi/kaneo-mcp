# /kaneo-create — Buat Task Baru di Kaneo

Skill untuk membuat task baru lengkap: judul, deskripsi, label, priority, dan assignee — semua dalam satu alur.

## Alur Kerja

### Step 1: Pilih Project

```
mcp__kaneo__list_projects
```

Tampilkan daftar project, tanya user: **"Mau buat task di project mana?"**

### Step 2: Kumpulkan Semua Info Sekaligus

Setelah project dipilih, ambil data yang dibutuhkan untuk pertanyaan:

```
mcp__kaneo__list_workspace_labels
mcp__kaneo__get_project { "projectId": "<id>" }
```

Lalu tanya user dalam **satu pesan**, semua sekaligus:

---

> **Lengkapi detail task baru:**
>
> 1. **Judul** — apa nama task-nya?
> 2. **Deskripsi** — (opsional) detail atau acceptance criteria
> 3. **Priority** — `low` / `medium` / `high` / `urgent`
> 4. **Assign ke** — siapa yang mengerjakan? (dari daftar members: [tampilkan nama members])
> 5. **Label** — pilih yang ada: [tampilkan label yang ada], atau sebutkan nama label baru jika mau buat baru, atau kosongkan
> 6. **Due date** — (opsional) format: DD MMM YYYY

---

Jika user sudah menyebutkan semua info dalam perintah awal, skip pertanyaan dan langsung proses.

### Step 3: Buat Label Baru (jika diminta)

Jika user minta label baru yang belum ada:

```
mcp__kaneo__create_label {
  "name": "<nama-label>",
  "color": "<hex-color>"
}
```

Pilih warna yang masuk akal berdasarkan nama label:
- `bug` / `error` → merah `#ef4444`
- `feature` / `enhancement` → biru `#3b82f6`
- `docs` / `dokumentasi` → kuning `#eab308`
- `design` / `ui` → ungu `#a855f7`
- `backend` / `api` → hijau `#22c55e`
- `frontend` → oranye `#f97316`
- Label lain → abu-abu `#6b7280`

### Step 4: Buat Task

```
mcp__kaneo__create_task {
  "projectId": "<id>",
  "title": "<judul>",
  "description": "<deskripsi>",
  "status": "to-do"
}
```

### Step 5: Set Semua Atribut (paralel jika bisa)

Jalankan setelah task berhasil dibuat, gunakan task ID dari response:

**Priority:**
```
mcp__kaneo__set_task_priority {
  "taskId": "<id>",
  "priority": "<low|medium|high|urgent>"
}
```

**Assignee:**
```
mcp__kaneo__set_task_assignee {
  "taskId": "<id>",
  "userId": "<user-id>"
}
```

**Label:**
```
mcp__kaneo__attach_label_to_task {
  "taskId": "<id>",
  "labelId": "<label-id>"
}
```

**Due date (jika ada):**
```
mcp__kaneo__set_task_due_date {
  "taskId": "<id>",
  "dueDate": "YYYY-MM-DD"
}
```

### Step 6: Konfirmasi ke User

Tampilkan ringkasan lengkap task yang baru dibuat:

```
✅ Task berhasil dibuat!

📋 [Judul Task]
   Project  : [Nama Project]
   Priority : 🔴 urgent / 🟠 high / 🟡 medium / ⚪ low
   Assign   : @[nama assignee]
   Label    : [nama label]
   Due      : [tanggal] (jika ada)
   ID       : [task-id]
```

---

## Contoh Perintah User

> "buatkan task baru di E-Commerce"
> *(AI tanya semua detail dalam satu pesan)*

> "buat task: implementasi halaman checkout, priority high, assign ke Imam, label frontend"

> "tambah task di Simpan Pinjam: buat form pengajuan pinjaman, urgent, assign ke saya, label baru: 'MVP'"

---

## Tips

- Jika user bilang "assign ke saya/aku" — ambil user ID dari data member yang sudah di-load di Step 2
- Jika label belum ada di workspace, buat dulu sebelum attach
- Jika user tidak sebut priority, default ke `medium`
- Jika user tidak sebut assignee, biarkan unassigned — jangan tebak
- Selalu tampilkan task ID di konfirmasi akhir (berguna untuk `/kaneo-move` dan `/kaneo-done`)
