# Kustomisasi Codday996 (Kantor Startup Indonesia)

Dokumen ini mencatat kustomisasi di fork ini: file apa saja yang berubah, cara
mengganti branding, cara menarik update dari upstream, dan area yang rawan
konflik. Upstream tetap `iamlukethedev/Hermes3D` (MIT). LICENSE, README, dan
atribusi penulis asli tidak diubah.

## Ringkasan perubahan

Semua visual baru dibuat secara prosedural (geometri Three.js dan tekstur canvas).
Tidak ada dependency npm baru, tidak ada aset gambar atau font eksternal, dan tidak
ada simbol negara sebagai dekorasi. Bendera Merah Putih hanya dipakai di tiang
bendera kantor lokal.

### File baru

| File | Isi |
|---|---|
| `src/features/retro-office/core/theme.ts` | Token warna `OFFICE_THEME` |
| `src/features/retro-office/scene/indonesiaArt.tsx` | Bendera Indonesia (`IndonesiaFlagArt`) dan poster prosedural (`PosterArt`, `getPosterTexture`) |
| `src/features/retro-office/objects/indonesia.tsx` | Model furnitur baru (bean bag, tikar lesehan, meja pendek, kursi rotan, galon, monstera, lidah mertua) dan registry `INDONESIA_ITEM_MODELS` |
| `src/features/retro-office/scene/cityDecor.tsx` | Skyline gedung (`CitySkyline`) dan parkiran motor (`MotorbikeParking`) |
| `tests/unit/indonesiaFurnitureLayout.test.ts` | Tes registrasi dan penempatan furnitur baru |
| `public/brand/codday-logo.png` | Logo Codday, dipasang di dinding selatan kantor lokal (`BrandLogoArt`) |
| `CUSTOMIZATION.md` | Dokumen ini |

### File yang diubah

| File | Perubahan | Ukuran |
|---|---|---|
| `core/constants.ts` | `STORAGE_KEY` ke `hermes-office-furniture-v11-id` | 1 baris |
| `core/furnitureDefaults.ts` | Penempatan default lounge, pantry, dan tanaman | 11 baris ditambah |
| `core/geometry.ts` | Footprint dan `ITEM_METADATA` untuk 8 tipe baru | 17 baris ditambah |
| `core/proceduralTextures.ts` | `getBatikTextures()` (motif kawung) | 48 baris ditambah |
| `objects/furniture.tsx` | `FurnitureModel` merender model Indonesia lewat registry | 6 baris |
| `objects/kitchen.tsx` | `CoffeeJarModel` (dekor pantry) | 28 baris ditambah |
| `objects/agents.tsx` | Kemeja batik untuk sebagian agent berbaju tee (dipilih dari hash `agentId`) | 59 baris |
| `scene/environment.tsx` | `FloorAndWalls`, `PerimeterWall`, `FramedPicture`, `WallPictures` memakai `OFFICE_THEME`. Bendera kantor lokal diganti. Empat poster ditambahkan. Skyline dan parkiran dipasang. `UsaFlagArt` dihapus. | ±130 baris |
| `RetroOffice3D.tsx` | Palet "ADD" berisi 8 item baru | 18 baris ditambah |

## Token tema

Semua nilai ada di `src/features/retro-office/core/theme.ts`.

| Token | Nilai default | Dipakai untuk |
|---|---|---|
| `floorWood` | `#e8d5b8` | Lantai kantor lokal |
| `floorWoodDark` | `#b8946a` | Cadangan (belum dipakai) |
| `wallBase` | `#e9dfd0` | Dinding plester, background poster |
| `wallAccent` | `#d9c9a8` | Latar poster "Ship it, Bos" |
| `trim` | `#2b2f33` | Cap dinding, bingkai poster |
| `woodWarm` | `#8b5e3c` | Bingkai lukisan cokelat, meja pendek, motif batik |
| `rattan` | `#c8a86b` | Kursi rotan, motif batik |
| `plantGreen` | `#5f8f38` | Daun monstera |
| `accentRed` | `#CE1126` | Bendera (merah), poster "Gas Terus!" |
| `accentWhite` | `#FFFFFF` | Bendera (putih) |
| `textDark` | `#2b2118` | Teks gelap di poster |
| `textLight` | `#fbf7f0` | Teks terang di poster |

Warna area lain (server room, gym, QA lab, luar kota, lukisan abstrak) belum
memakai token. Itu disengaja agar perubahan tetap kecil.

## Cara mengganti branding

- **Teks logo dan poster:** ubah `POSTER_SPECS` di `scene/indonesiaArt.tsx`.
  Poster "Codday996" ada di `logo`.
- **Warna:** ubah nilai di `core/theme.ts`. Jangan mengedit hex langsung di komponen.
- **Logo:** ganti file `public/brand/codday-logo.png` dengan file baru (persegi, misalnya 1080 x 1080). Nama file juga bisa diubah di `BRAND_LOGO_PATH` di `scene/indonesiaArt.tsx`.
- **Bendera:** `IndonesiaFlagArt` di `scene/indonesiaArt.tsx`. Ukuran rasio 2:3 ada di
  `FLAG_WIDTH` dan `FLAG_HEIGHT`.
- **Setelah mengubah penempatan default:** naikkan `STORAGE_KEY` di
  `core/constants.ts`. Browser yang sudah menyimpan layout lama tidak akan melihat
  perubahan sampai key di-bump.

## Keamanan dependency

Hasil `npm audit` saat ini: 5 temuan, dari 21 sebelumnya. Semuanya tingkat high dan
berasal dari satu rantai dependency lint (`eslint-config-next` → `@next/eslint-plugin-next`
→ `fast-glob` → `micromatch` → `braces`). Rantai ini hanya dipakai saat lint, tidak ikut ke
build produksi. Untuk `braces` belum ada versi patch di npm. Satu-satunya saran dari npm
adalah `npm audit fix --force`, yaitu downgrade `eslint-config-next` ke 14.x. Itu breaking,
jadi tidak dilakukan.

Yang sudah diperbaiki:
- `next` 16.1.7 → 16.4.2 (menutup critical).
- `vitest` 4.0.18 → 4.1.12 (menutup critical dan moderate).
- `vite`, `ws`, `js-yaml`, `source-map-js`, `fflate`, `@humanfs/node`, `browserslist`,
  `baseline-browser-mapping`, `@babel/core`, dan `brace-expansion` dikunci lewat `overrides` di `package.json`.
- `postprocessing` dan `@testing-library/dom` sekarang dipasang eksplisit. Sebelumnya keduanya
  hanya ikut sebagai peer dependency.
- `eslint-plugin-react-hooks` dikunci ke 7.0.1. Versi 7.1.1 menambah aturan React Compiler yang
  membuat 48 error lint pada kode yang sudah ada.

Catatan saat upgrade: `npm audit fix` bawaan gagal dengan error internal npm
(`Cannot read properties of null (reading edgesOut)`), jadi upgrade dilakukan manual.

## Cara merge update upstream

```bash
git fetch upstream
git merge upstream/main
```

Sebelum merge, jalankan `npm run lint`, `npm run typecheck`, dan `npm run test`
untuk catatan baseline. Setelah merge, cek ulang keempatnya.

## File yang rawan konflik

Urutkan dari yang paling mungkin konflik:

1. **`RetroOffice3D.tsx`** (sekitar 7.900 baris). Upstream sering menambah tipe furnitur
   dan palet di sini. Blok palet "ADD" adalah titik konflik utama.
2. **`scene/environment.tsx`** (sekitar 1.150 baris). Upstream aktif mengubah
   `FloorAndWalls` dan `WallPictures`. Jika konflik, ambil versi upstream untuk
   bagian lantai dan dinding lalu terapkan ulang token `OFFICE_THEME`.
3. **`core/constants.ts`.** Upstream sering menambah migration key di sekitar
   `STORAGE_KEY`. Pertahankan key migrasi upstream dan naikkan `STORAGE_KEY` sendiri.
4. **`core/furnitureDefaults.ts`.** Penempatan baru ada di akhir `DEFAULT_FURNITURE`.
5. **`core/geometry.ts`.** Blok tipe baru ada di `ITEM_FOOTPRINT` dan `ITEM_METADATA`.
6. **`objects/agents.tsx`.** Hanya tiga hunk kecil: helper hash, `batikShirtMap`, dan
   `map` pada material torso.

## Status fase

| Fase | Status | Catatan |
|---|---|---|
| 1.1 Token tema | Selesai | |
| 1.2 Lantai dan dinding dari token | Selesai | Lantai dan tanah distrik luar sengaja tidak diubah |
| 1.3 Bendera Indonesia | Selesai | `UsaFlagArt` dihapus karena tidak terpakai |
| 1.4 Poster dinding | Selesai | Ditempatkan di dinding kosong. Lukisan abstrak yang ada tidak diganti |
| 1.5 Signage ruangan | Dilewati | Tidak ada label ruangan di scene. Sistem label baru tidak dibuat |
| 1.6 Bump key v10 | Selesai | Diganti ke v11 di Fase 2 |
| 2.1 Furnitur baru | Selesai | Model prosedural dengan registry |
| 2.2 Pantry | Selesai | `CoffeeJarModel` di `kitchen.tsx`. Galon ada di `indonesia.tsx` |
| 2.3 Batik | Sebagian | Tekstur `getBatikTextures()` dibuat dan dipakai di tikar lesehan. Dinding aksen belum dibuat (lihat di bawah) |
| 2.4 Penempatan default | Selesai | Dicek otomatis oleh tes |
| 2.5 Bump key v11 | Selesai | |
| 2.6 Bisa dipilih dan digeser | Selesai | Terdaftar di palet "ADD" dan memakai `FurnitureModel` |
| 3.1 Skyline dan parkiran motor | Selesai | Skyline di utara kantor lokal, parkiran di jalur kota |
| 3.2 Variasi baju | Selesai | Batik untuk sebagian agent berbaju tee. Hoodie dan jaket tidak berubah |
| 3.3 Musholla | **Menunggu persetujuan** | Hanya usulan. Tidak ada kode yang diubah |
| 3.4 Musholla (implementasi) | Belum | Menunggu 3.3. Bump key ke v12 ikut di sini |

## Yang belum selesai

- **Dinding aksen batik di lounge.** Tidak ada dinding di area lounge dalam
  layout default, jadi belum ada tempat yang jelas. Tekstur sudah siap. Perlu
  keputusan lokasi dinding (koordinat) sebelum dipasang.
- **Musholla (3.3 dan 3.4).** Menunggu persetujuan. Usulan ada di bagian bawah.
- **Mode 2D pixel.** Di luar cakupan. Mode 2D tetap memakai tampilan lama dan
  itu juga mode default di build upstream ini.
- **Verifikasi visual 3D.** Di sandbox pengembangan, scene 3D tidak selesai dimuat
  (loader terus tampil dan error yang sama muncul juga di upstream tanpa perubahan).
  Karena itu hasil visual 3D belum diverifikasi dengan screenshot. Yang sudah
  diverifikasi: typecheck, lint, tes unit, dan layout default lewat tes.

## Usulan musholla (3.3, belum diimplementasikan)

- **Lokasi:** ruangan kecil di sayap timur, di sebelah QA lab (koordinat belum saya cek di layout). Ukuran sekitar 176 x 200
  unit canvas. Ruangan ini cukup untuk satu sajadah deret dan satu rak.
- **Isi:** dua sajadah (tikar prosedural), satu rak sepatu, satu partisi setengah tinggi
  sebagai pemisah, dan papan kiblat kecil di dinding.
- **Navigasi:** modul baru `core/navigation/mushollaRoute.ts` dengan pola yang sama
  seperti `gymRoute.ts`. Tambah satu tahap `musholla` di `AgentStage` dan satu
  `interactionTarget`. Pintu ditambahkan sebagai `door` di `furnitureDefaults`.
- **Perubahan ke `core/navigation/`:** satu file baru, plus pendaftaran di
  `navigation.ts`. Ini perlu persetujuan Anda sesuai aturan.
- **Risiko:** ruangan ini memotong jalur sayap timur. Tes penempatan yang sudah ada akan
  memeriksa ulang tabrakan dengan pintu dan furnitur.

Jika disetujui, implementasi akan mengikuti pola di atas dan menaikkan
`STORAGE_KEY` ke `hermes-office-furniture-v12-id`.
