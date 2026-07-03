# Protokol Grounding (anti-halusinasi)

Kaneo adalah **papan tim bersama**. Data salah atau karangan menyesatkan orang sungguhan. Setiap
skill Kaneo WAJIB mematuhi aturan ini.

## 1. Discovery dulu — jangan mengarang ID
Sebelum aksi apa pun, temukan ID asli:
- `list_workspaces` → ID workspace (kalau belum ada di `.kaneo/context.md`).
- `list_projects` → ID + nama project.
- `list_columns { projectId }` → slug status/kolom asli board itu.
- `list_workspace_members` → userId, nama, email (untuk `set_task_assignee`).

Jangan hardcode/tebak/pakai ID dari sesi lain. Kalau `.kaneo/context.md` mencatat ID, percayai tapi
validasi ulang saat error.

## 2. Search sebelum create — jangan duplikat
Sebelum `create_task`, jalankan `search { query: "<kata kunci judul>" }` (dan/atau `list_tasks`).
Kalau task serupa sudah ada, **update** (bukan bikin duplikat). Laporkan id task yang sudah ada.

## 3. Read sebelum write — pertahankan, jangan timpa
Sebelum `update_task`, panggil `get_task` dan baca deskripsi saat ini. Kartu Kaneo = dokumentasi
hidup:
- **Gabungkan** perubahan ke struktur yang ada; pertahankan setiap section.
- Jangan menimpa deskripsi kaya dengan yang pendek.
- Catatan progres/keputusan → `add_comment`, bukan menimpa deskripsi.
- `update_task` butuh `projectId` dan `position` task dipertahankan — baca dulu.

## 4. Verifikasi setelah write
Setelah membuat/mengubah, baca ulang (`get_task`/`list_tasks`) dan laporkan id/judul/status **asli**
ke user. Jangan klaim sukses hanya dari request.

## 5. Aturan bukti — dilarang fiksi yang masuk akal
Setiap klaim teknis di kartu — endpoint, path file, tabel/kolom DB, nama komponen, key config —
WAJIB diverifikasi ke codebase asli dulu (grep/baca file). Kalau tidak bisa diverifikasi, tulis
`TBD (verify)`, jangan mengarang sesuatu yang sekadar terlihat benar.

## 6. Konfirmasi sebelum aksi destruktif/massal
`delete_task`, `delete_project`, `delete_comment`, `delete_column`, `bulk_update_tasks` tak bisa
di-undo / berdampak luas. Selalu:
1. Tampilkan preview bernomor apa yang akan berubah.
2. Minta persetujuan eksplisit.
3. Eksekusi satu per satu, laporkan tiap hasil.
Untuk "cleanup/tutup sprint", utamakan pindah task belum selesai ke `to-do` daripada menghapus.

## 7. Respons besar
`export_tasks` dan `list_task_activity` bisa sangat besar. Analisis dengan Python/jq
(lihat `tools-reference.id.md`), jangan tempel mentah.
