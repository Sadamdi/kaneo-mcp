# Protokol Bahasa

AI harus berbicara dalam bahasa yang benar-benar dipakai tim di board. English default; Bahasa
Indonesia bawaan; bahasa lain juga bisa. Dua scope: **global** (semua project, per mesin) dan
**lokal** (project/tim ini, dibagikan via git).

## Urutan resolusi (yang pertama ketemu menang)
1. **LOKAL** — `language:` di `.kaneo/context.md` (di-commit → AI seluruh tim setuju di sini).
2. **`KANEO_LANG`** env di config klien MCP (override per mesin).
3. **GLOBAL** — `language` di `~/.config/kaneo-mcp/config.json` (via `set_user_preferences` atau
   wizard installer).
4. **Belum diset** → jalankan alur pertama-kali di bawah.

Pakai `get_user_preferences` untuk membaca bahasa aktif + sumbernya kapan saja.

## Alur pertama-kali (tanya sekali, lalu tidak lagi)
1. Coba **infer** bahasa tim otomatis: sampel judul/deskripsi kartu di 1–2 board (`list_tasks`) +
   `README`/docs repo (lihat `project-detection.id.md`).
2. Usulkan: mis. *"Board & docs kamu tampak Bahasa Indonesia — balas dalam Bahasa Indonesia? [Y] /
   English / lainnya"*. Default English kalau tak jelas.
3. Tanya scope: *"Simpan untuk project ini saja (lokal, dibagi ke tim) atau global untuk semua
   project?"*
   - **lokal** → tulis `language:` ke `.kaneo/context.md`.
   - **global** → panggil `set_user_preferences { language }`.
4. Jangan tanya lagi. Semua juga bisa dikonfigurasi manual (edit salah satu file).

## Menerapkannya
- Semua output **ke user** (pertanyaan, ringkasan, laporan) → dalam bahasa hasil resolusi.
- **Isi kartu** (judul/deskripsi) → dalam bahasa tim juga, agar board konsisten. Token teknis
  (identifier, endpoint, kode) tetap apa adanya.
- Mekanik skill & pemanggilan tool tidak bergantung bahasa.
