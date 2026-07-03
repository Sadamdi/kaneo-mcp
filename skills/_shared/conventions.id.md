# Konvensi Tiket (kartu Kaneo yang baik)

Disarikan dari praktik terbaik penulisan tiket engineering (norma Linear/Jira/GitHub). Setiap kartu
harus mengikuti ini agar board terbaca seperti dokumentasi tim, bukan stub satu baris.

## Judul
- **Kata kerja dulu**, imperatif: "Tambah rotasi refresh-token", "Perbaiki total keranjang".
- Maks ~10 kata. Spesifik ("Fix login" → "Fix 500 saat login jika email huруф besar").
- Prefix scope opsional: `[Auth] …`, `[Checkout] …`, `[Infra] …`.

## Struktur deskripsi (badan kartu kanonik)
```
## Konteks
Kenapa ini ada — masalah, pemicu, hasil yang diinginkan. 1–3 kalimat.

## Scope
- Termasuk: yang dicakup task ini
- Tidak: yang eksplisit TIDAK dicakup (cegah scope creep)

## Acceptance criteria
- [ ] Kondisi teruji & teramati 1
- [ ] Kondisi 2
(Maks ≤ 8. Tiap poin harus bisa diverifikasi.)

## Catatan teknis
Referensi terverifikasi saja (grounding §5): endpoint, file, tabel, komponen, config.

## Tautan
Spec / desain / PR / task terkait.

## Definition of Done
Merged + test lulus + docs diperbarui + kartu dipindah ke done.
```

## Taksonomi label (pasang dua)
- Satu **TIPE**: `feature` · `bug` · `chore` · `docs` · `refactor` · `security` · `perf`
- Satu **AREA**: `frontend` · `backend` · `mobile` · `infra` · `data` · `design`
Buat label bila belum ada (`create_label` butuh warna hex). Warna saran:
`bug`/`security` `#ef4444` · `feature` `#3b82f6` · `docs` `#eab308` · `design` `#a855f7` ·
`backend` `#22c55e` · `frontend` `#f97316` · `mobile` `#06b6d4` · `infra` `#6b7280` ·
`data` `#8b5cf6` · `chore`/`refactor` `#94a3b8` · `perf` `#facc15`.

## Semantik priority
- `urgent` — blocker, celah keamanan, kehilangan data, produksi mati.
- `high` — kerja inti sprint berjalan.
- `medium` — kerja normal (default).
- `low` — nice-to-have, cleanup, boleh mundur.

## Higiene status
- Status bergerak **bersama** pekerjaan: `to-do → in-progress → in-review → done`.
- Batas WIP: peringatkan bila satu orang punya **>3** task `in-progress`.
- Flag basi: task `in-progress` **>7 hari** tanpa update perlu ditindak.
- Pindah ke `in-review` harus menyebut APA yang direview (tautkan PR via `add_comment`).
- Pindah ke `done` harus acceptance criteria-nya terpenuhi (lihat `kaneo-done`).

## Satu task = satu deliverable
Bila butuh >8 acceptance criteria atau beberapa deliverable, pecah atau pakai checklist subtask.
