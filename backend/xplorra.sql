-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 19 Bulan Mei 2026 pada 06.35
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `xplorra`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `bookmarks`
--

CREATE TABLE `bookmarks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `food_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `foods`
--

CREATE TABLE `foods` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `kategori` varchar(50) DEFAULT NULL,
  `daerah` varchar(50) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `rating` float DEFAULT NULL,
  `trending` int(11) DEFAULT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `likes` int(11) DEFAULT 0,
  `bahan` text DEFAULT NULL,
  `langkah` longtext DEFAULT NULL,
  `creator` varchar(100) DEFAULT NULL,
  `creator_desc` text DEFAULT NULL,
  `creator_id` int(11) DEFAULT NULL,
  `views` int(11) DEFAULT 0,
  `search_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `foods`
--

INSERT INTO `foods` (`id`, `nama`, `kategori`, `daerah`, `deskripsi`, `rating`, `trending`, `gambar`, `likes`, `bahan`, `langkah`, `creator`, `creator_desc`, `creator_id`, `views`, `search_count`) VALUES
(1, 'Rendang Sapi', 'Makanan utama', 'Sumatera', 'Masakan khas Padang', 4.8, 1, 'rendang.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 8),
(2, 'Sate Ayam', 'Makanan utama', 'Jawa', 'Sate bumbu kacang', 4.7, 1, 'sate.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(3, 'Pempek Palembang', 'Makanan utama', 'Sumatera', 'Pempek ikan khas Palembang', 4.6, 1, 'pempek.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 11),
(4, 'Soto Ayam', 'Makanan utama', 'Jawa', 'Kuah ayam gurih', 4.5, 0, 'soto.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(5, 'Nasi Padang', 'Makanan utama', 'Sumatera', 'Nasi dengan lauk khas Padang', 4.9, 1, 'nasipadang.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 21),
(6, 'Gado-gado', 'Makanan utama', 'Jawa', 'Sayur saus kacang', 4.4, 0, 'gado.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(7, 'Rendang Sapi', 'Makanan utama', 'Sumatera Barat', 'Masakan khas Padang', 4.9, 1, 'rendang.jpg', 120, 'Daging sapi 1 kg|Santan 1.5 liter|Cabe merah 250 gr|Bawang merah 150 gr|Bawang putih 75 gr|Jahe 1 ruas|Lengkuas 2 ruas|Daun kunyit 2 lembar', 'Potong daging sapi kecil-kecil. Haluskan bumbu lalu tumis hingga harum. Masukkan santan dan semua bumbu. Tambahkan daging. Masak dengan api kecil sambil diaduk hingga kuah mengering dan berwarna gelap.', 'Furab', 'Sangat baguss! admin mencoba buat rendang ini.', NULL, 0, 8),
(8, 'Sate Ayam', 'Makanan utama', 'Jawa', 'Sate bumbu kacang', 4.8, 1, 'sate.jpg', 95, 'Daging ayam 500 gr|Tusuk sate 20 batang|Kacang tanah 200 gr|Bawang putih 3 siung|Kecap manis', 'Potong ayam kotak kecil. Tusuk ke sate. Bakar setengah matang. Siram bumbu kacang lalu bakar lagi sampai matang.', 'Furab', 'Sate favorit semua orang.', NULL, 0, 0),
(9, 'Soto Ayam', 'Makanan utama', 'Jawa', 'Soto ayam gurih', 4.7, 1, 'soto.jpg', 88, 'Ayam 1 ekor|Bawang putih 4 siung|Jahe 1 ruas|Kunyit|Soun|Telur rebus', 'Rebus ayam hingga matang. Tumis bumbu halus. Masukkan ke kuah. Sajikan dengan soun dan telur.', 'Furab', 'Cocok dimakan pagi hari.', NULL, 0, 0),
(10, 'Pempek Palembang', 'Makanan utama', 'Sumatera Selatan', 'Pempek ikan khas Palembang', 4.6, 1, 'pempek.jpg', 75, 'Ikan tenggiri 500 gr|Tepung sagu 300 gr|Telur|Bawang putih|Cuko', 'Campur ikan dan tepung. Bentuk pempek. Rebus hingga mengapung. Sajikan dengan kuah cuko.', 'Furab', 'Makanan khas favorit.', NULL, 0, 11),
(11, 'Nasi Padang', 'Makanan utama', 'Sumatera Barat', 'Nasi dengan lauk lengkap', 4.9, 1, 'nasipadang.jpg', 140, 'Nasi putih|Rendang|Ayam pop|Daun singkong|Sambal hijau', 'Siapkan nasi hangat lalu sajikan dengan berbagai lauk khas Padang.', 'Furab', 'Nasi Padang terenak.', NULL, 0, 21),
(12, 'Gado-gado', 'Makanan utama', 'Jawa', 'Sayur saus kacang', 4.5, 0, 'gado.jpg', 50, 'Kangkung|Kol|Tauge|Telur|Kentang|Kacang tanah', 'Rebus semua sayur. Haluskan kacang. Siram ke sayur lalu sajikan.', 'Furab', 'Sehat dan enak.', NULL, 0, 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `ratings`
--

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL,
  `food_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `star` int(11) DEFAULT NULL,
  `komentar` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `foto_profile` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`, `foto_profile`) VALUES
(1, 'auliaaa', 'aulia@gmail.com', '123456', NULL),
(2, '', '', '', NULL),
(3, 'eda', 'Eda@gmail.com', '1234567', NULL),
(4, 'nana', 'nana@gmail.com', '1234567', NULL),
(5, 'elis', 'elis@gmail.com', '123456', NULL),
(6, 'elsa', 'elsa@gmail.com', '123456', NULL),
(7, 'testing', 'testing@gmail.com', '123456', NULL);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `foods`
--
ALTER TABLE `foods`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `bookmarks`
--
ALTER TABLE `bookmarks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `foods`
--
ALTER TABLE `foods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
