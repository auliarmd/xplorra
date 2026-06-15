-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 15, 2026 at 03:57 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

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
-- Table structure for table `bookmarks`
--

CREATE TABLE `bookmarks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `food_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookmarks`
--

INSERT INTO `bookmarks` (`id`, `user_id`, `food_id`) VALUES
(2, 9, 7),
(24, 8, 18),
(25, 14, 19),
(27, 15, 18),
(28, 16, 18),
(29, 15, 21),
(39, 1, 16),
(74, 1, 13);

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `kepuasan` varchar(20) DEFAULT NULL,
  `kategori` varchar(50) DEFAULT NULL,
  `pesan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `user_id`, `kepuasan`, `kategori`, `pesan`, `created_at`) VALUES
(1, 1, 'Sangat Puas', 'Saran', 'sangat bagus', '2026-05-29 02:32:10'),
(2, 1, 'Puas', 'Fitur', 'Testing Jest', '2026-06-14 19:19:00'),
(3, 1, 'Puas', 'Fitur', 'Testing Jest', '2026-06-14 19:20:04'),
(4, 1, 'Puas', 'Fitur', 'Testing Jest', '2026-06-14 19:26:08'),
(5, 1, 'Puas', 'Fitur', 'Testing Jest', '2026-06-14 19:30:31'),
(6, 1, 'Puas', 'Fitur', 'Testing Jest', '2026-06-14 19:32:30'),
(7, 1, 'Puas', 'Fitur', 'Testing Jest', '2026-06-14 19:32:48'),
(8, 1, 'Puas', 'Fitur', 'Testing Jest', '2026-06-14 19:46:35'),
(9, 1, 'Puas', 'Fitur', 'Testing Jest', '2026-06-14 19:49:21'),
(10, 1, 'Puas', 'Fitur', 'Testing Jest', '2026-06-14 20:04:19'),
(11, 1, 'Puas', 'Fitur', 'Testing Jest', '2026-06-14 20:20:00'),
(12, 1, 'Puas', 'Fitur', 'Testing Jest', '2026-06-14 20:23:20'),
(13, 1, 'Puas', 'Fitur', 'Testing Jest', '2026-06-14 20:27:40'),
(14, 1, 'Puas', 'Fitur', 'Testing Jest', '2026-06-14 20:31:57'),
(15, 1, 'Puas', 'Fitur', 'Testing Jest', '2026-06-14 20:36:56'),
(16, 1, 'Puas', 'Fitur', 'Testing Jest', '2026-06-14 20:41:34'),
(17, 1, 'Puas', 'Fitur', 'Testing Jest', '2026-06-14 20:41:53'),
(18, 1, 'Puas', 'Fitur', 'Testing Jest', '2026-06-14 20:42:43'),
(19, 1, 'Puas', 'Fitur', 'Testing Jest', '2026-06-14 20:48:21'),
(20, 1, 'Puas', 'Fitur', 'Testing Jest', '2026-06-14 20:53:15'),
(21, 1, 'Puas', 'Fitur', 'Testing Jest', '2026-06-14 20:56:44');

-- --------------------------------------------------------

--
-- Table structure for table `foods`
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
-- Dumping data for table `foods`
--

INSERT INTO `foods` (`id`, `nama`, `kategori`, `daerah`, `deskripsi`, `rating`, `trending`, `gambar`, `likes`, `bahan`, `langkah`, `creator`, `creator_desc`, `creator_id`, `views`, `search_count`) VALUES
(2, 'Sate Ayam', 'Makanan utama', 'Jawa', 'Sate bumbu kacang', 4.7, 1, 'sate.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 20),
(3, 'Pempek Palembang', 'Makanan utama', 'Sumatera', 'Pempek ikan khas Palembang', 4.6, 1, 'pempek.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 13),
(4, 'Soto Ayam', 'Makanan utama', 'Jawa', 'Kuah ayam gurih', 4.5, 0, 'soto.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 20),
(5, 'Nasi Padang', 'Makanan utama', 'Sumatera', 'Nasi dengan lauk khas Padang', 4.9, 1, 'nasipadang.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 32),
(6, 'Gado-gado', 'Makanan utama', 'Jawa', 'Sayur saus kacang', 4.4, 0, 'gado.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(7, 'Rendang Sapi', 'Makanan utama', 'Sumatera Barat', 'Masakan khas Padang', 4.9, 1, 'rendang.jpg', 120, 'Daging sapi 1 kg|Santan 1.5 liter|Cabe merah 250 gr|Bawang merah 150 gr|Bawang putih 75 gr|Jahe 1 ruas|Lengkuas 2 ruas|Daun kunyit 2 lembar', 'Potong daging sapi kecil-kecil. Haluskan bumbu lalu tumis hingga harum. Masukkan santan dan semua bumbu. Tambahkan daging. Masak dengan api kecil sambil diaduk hingga kuah mengering dan berwarna gelap.', 'Furab', 'Sangat baguss! admin mencoba buat rendang ini.', NULL, 0, 9),
(8, 'Sate Ayam', 'Makanan utama', 'Jawa', 'Sate bumbu kacang', 4.8, 1, 'sate.jpg', 95, 'Daging ayam 500 gr|Tusuk sate 20 batang|Kacang tanah 200 gr|Bawang putih 3 siung|Kecap manis', 'Potong ayam kotak kecil. Tusuk ke sate. Bakar setengah matang. Siram bumbu kacang lalu bakar lagi sampai matang.', 'Furab', 'Sate favorit semua orang.', NULL, 0, 20),
(9, 'Soto Ayam', 'Makanan utama', 'Jawa', 'Soto ayam gurih', 4.7, 1, 'soto.jpg', 88, 'Ayam 1 ekor|Bawang putih 4 siung|Jahe 1 ruas|Kunyit|Soun|Telur rebus', 'Rebus ayam hingga matang. Tumis bumbu halus. Masukkan ke kuah. Sajikan dengan soun dan telur.', 'Furab', 'Cocok dimakan pagi hari.', NULL, 0, 20),
(10, 'Pempek Palembang', 'Makanan utama', 'Sumatera Selatan', 'Pempek ikan khas Palembang', 4.6, 1, 'pempek.jpg', 75, 'Ikan tenggiri 500 gr|Tepung sagu 300 gr|Telur|Bawang putih|Cuko', 'Campur ikan dan tepung. Bentuk pempek. Rebus hingga mengapung. Sajikan dengan kuah cuko.', 'Furab', 'Makanan khas favorit.', NULL, 0, 13),
(11, 'Nasi Padang', 'Makanan utama', 'Sumatera Barat', 'Nasi dengan lauk lengkap', 4.9, 1, 'nasipadang.jpg', 140, 'Nasi putih|Rendang|Ayam pop|Daun singkong|Sambal hijau', 'Siapkan nasi hangat lalu sajikan dengan berbagai lauk khas Padang.', 'Furab', 'Nasi Padang terenak.', NULL, 0, 32),
(12, 'Gado-gado', 'Makanan utama', 'Jawa', 'Sayur saus kacang', 4.5, 0, 'gado.jpg', 50, 'Kangkung|Kol|Tauge|Telur|Kentang|Kacang tanah', 'Rebus semua sayur. Haluskan kacang. Siram ke sayur lalu sajikan.', 'Furab', 'Sehat dan enak.', NULL, 0, 0),
(13, 'Rendang Testing', 'Makanan Berat', 'Padang', 'Testing Edit', 3.9, 0, '1779273366091.png', 1, 'Daging', 'Masak', 'auliaaa', NULL, 1, 0, 1),
(14, 'jkkdfjn', 'Makanan Berat', 'Kalimantan', 'lknaskdhn', 4, 0, '1779306501750.png', 0, '[\",msnds\"]', '[\"m,snddn\"]', 'elsa', NULL, 6, 0, 1),
(15, 'jbjdf', 'Makanan Ringan', 'Sumatera', ',knjjndlifj', 2, 0, '1779306734100.png', 15, '[\"mdnfd\"]', '[\"kjbdfjdf\"]', 'elsa', NULL, 6, 0, 0),
(16, 'Coto Makassar', 'Makanan utama', 'Sulawesi', 'Coto Makassar adalah hidangan berkuah kental yang gurih dan kaya rempah, cocok disajikan dengan buras atau lontong.', 3, 0, '1779741805558.jpg', 1, '[\"Daging Sapi (potong dadu) - 500 gram\",\"Jeroan (babat, paru, usus) - sesuai selera\",\"Air - 1,5 liter (untuk kaldu)\",\"Kacang Tanah (sangrai dan haluskan) - 200 gram\",\"Bawang Merah - 5 siung\",\"Bawang Putih - 3 siung\",\"Jintan - 1 sdt\",\"Ketumbar - 1 sdt\",\"Jahe - 2 cm\",\"Lengkuas - 2 cm\"]', '[\"Rebus Daging dan Jeroan: Rebus daging sapi dan jeroan secara terpisah dalam air yang cukup. Tambahkan garam. Setelah empuk, angkat dan tiriskan. Simpan kaldu untuk kuah\",\"Potong Daging: Potong daging dan jeroan menjadi dadu berukuran sekitar 1,5 cm. Masukkan kembali ke dalam kaldu daging yang telah disiapkan.\",\"Tumis Bumbu Halus: Panaskan minyak dalam wajan, tumis bumbu halus hingga harum. Tambahkan serai, daun salam, dan aduk rata. Masukkan tumisan bumbu ke dalam panci berisi kaldu. \",\"Masak Kuah: Rebus kuah hingga menyusut dan bumbu meresap. Tambahkan kacang tanah yang telah dihaluskan dan aduk rata. Koreksi rasa dengan garam dan air jeruk nipis. \",\"Penyajian: Sajikan coto dalam mangkuk, tambahkan potongan daging, jeroan, irisan daun bawang, dan taburi bawang goreng. Hidangkan dengan buras atau lontong serta sambal tauco. \\n\"]', 'risna', NULL, 11, 0, 60),
(18, 'Klepon', 'Dessert', 'Jawa', 'nj', 4.7, 0, '1779766585313.jpg', 0, '[\"fhgj\"]', '[\"mhih\"]', 'ningsi', NULL, 8, 0, 1),
(19, 'babi kecap', 'Makanan utama', 'Sulawesi', 'babi kecap dimasak dengan menggunakan kecap dan bumbu khas Sulawesi khususnya di toraja', 3.5, 0, '1779773931763.webp', 0, '[\"babi\",\"kecap\",\"minyak\",\"bawang merah putih\",\"garam\"]', '[\"masukkan bawang merah dan putih lalu masukkan babi masak sampai alot dan masukkan kecapnya\"]', 'tami', NULL, 14, 0, 5),
(20, 'gadogado', 'Makanan utama', 'Sulawesi', 'kacang', 2, 0, '1779783074676.jpg', 1, '[\"lontong\"]', '[\"potong \"]', 'Dhea', NULL, 15, 0, 0),
(21, 'PISANG EPEK', 'Dessert', 'Sulawesi', 'LOKA', 3.5, 0, '1779783737068.webp', 0, '[\"KEJU\",\"COKLAT\"]', '[\"KUPAS\"]', '12345', NULL, 16, 0, 1),
(24, 'Test', 'Makanan', 'Parepare', 'Testing', 0, 0, 'test.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(25, 'Test', 'Makanan', 'Parepare', 'Testing', 0, 0, 'test.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(26, 'Test', 'Makanan', 'Parepare', 'Testing', 0, 0, 'test.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(27, 'Test', 'Makanan', 'Parepare', 'Testing', 0, 0, 'test.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(28, 'Test', 'Makanan', 'Parepare', 'Testing', 0, 0, 'test.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(29, 'Test', 'Makanan', 'Parepare', 'Testing', 0, 0, 'test.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(30, 'Test', 'Makanan', 'Parepare', 'Testing', 0, 0, 'test.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(31, 'Test', 'Makanan', 'Parepare', 'Testing', 0, 0, 'test.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(32, 'Test', 'Makanan', 'Parepare', 'Testing', 0, 0, 'test.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(33, 'Test', 'Makanan', 'Parepare', 'Testing', 0, 0, 'test.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(34, 'Test', 'Makanan', 'Parepare', 'Testing', 0, 0, 'test.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(35, 'Test', 'Makanan', 'Parepare', 'Testing', 0, 0, 'test.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(36, 'Test', 'Makanan', 'Parepare', 'Testing', 0, 0, 'test.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(37, 'Test', 'Makanan', 'Parepare', 'Testing', 0, 0, 'test.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(38, 'Test', 'Makanan', 'Parepare', 'Testing', 0, 0, 'test.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(39, 'Test', 'Makanan', 'Parepare', 'Testing', 0, 0, 'test.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(40, 'Test', 'Makanan', 'Parepare', 'Testing', 0, 0, 'test.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(41, 'Test', 'Makanan', 'Parepare', 'Testing', 0, 0, 'test.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(42, 'Test', 'Makanan', 'Parepare', 'Testing', 0, 0, 'test.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0),
(43, 'Test', 'Makanan', 'Parepare', 'Testing', 0, 0, 'test.jpg', 0, NULL, NULL, NULL, NULL, NULL, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `food_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `user_id`, `food_id`) VALUES
(1, 1, 15),
(8, 1, 20),
(12, 1, 16),
(44, 1, 999999),
(45, 1, 13);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `from_user` varchar(100) DEFAULT NULL,
  `food_id` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `foto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `from_user`, `food_id`, `message`, `is_read`, `created_at`, `foto`) VALUES
(1, 1, 'ningsi', 13, 'ningsi mengomentari resep jhkjhdfj', 0, '2026-05-29 01:58:22', NULL),
(2, 11, 'auliaaa', 16, 'auliaaa mengomentari resep Coto Makassar', 0, '2026-06-10 20:09:05', '1780507938472.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL,
  `food_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `star` int(11) DEFAULT NULL,
  `komentar` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`id`, `food_id`, `user_id`, `star`, `komentar`) VALUES
(1, 13, 1, 4, 'jbjh'),
(2, 13, 1, 4, 'gvhghvg'),
(3, 13, 1, 4, 'nmbj'),
(4, 13, 1, 4, 'mnkj'),
(5, 14, 6, 5, 'vcbcvb'),
(6, 15, 1, 2, 'jjbkjk'),
(7, 15, 1, 2, 'hbgudsjhbksd\n'),
(8, 15, 1, 2, 'm,n'),
(9, 15, 1, 2, ''),
(10, 15, 1, 2, ''),
(11, 15, 1, 2, ''),
(12, 14, 1, 3, ''),
(13, 16, 11, 5, ''),
(15, 18, 8, 4, ''),
(16, 19, 14, 5, ''),
(17, 18, 15, 5, ''),
(18, 18, 16, 5, ''),
(19, 21, 15, 5, ''),
(20, 21, 1, 2, ''),
(21, 13, 8, 2, 'nvbjh'),
(23, 20, 1, 2, ''),
(24, 19, 1, 2, ''),
(25, 16, 1, 2, ''),
(26, 16, 1, 2, 'lumayan'),
(27, 13, 1, 4, 'Komentar dari Jest'),
(28, 13, 1, 4, 'Komentar dari Jest'),
(29, 13, 1, 4, 'Komentar dari Jest'),
(30, 13, 1, 4, 'Komentar dari Jest'),
(31, 13, 1, 4, 'Komentar dari Jest'),
(32, 13, 1, 4, 'Komentar dari Jest'),
(33, 13, 1, 4, 'Komentar dari Jest'),
(34, 13, 1, 4, 'Komentar dari Jest'),
(35, 13, 1, 4, 'Komentar dari Jest'),
(36, 13, 1, 4, 'Komentar dari Jest'),
(37, 13, 1, 4, 'Komentar dari Jest'),
(38, 13, 1, 4, 'Komentar dari Jest'),
(40, 13, 1, 4, 'Komentar dari Jest'),
(42, 13, 1, 4, 'Komentar dari Jest'),
(44, 13, 1, 4, 'Komentar dari Jest'),
(46, 13, 1, 4, 'Komentar dari Jest'),
(48, 13, 1, 4, 'Komentar dari Jest'),
(50, 13, 1, 4, 'Komentar dari Jest');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `foto_profile` varchar(255) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`, `foto_profile`, `foto`) VALUES
(1, 'auliaaa', 'aulia@gmail.com', '123456', NULL, '1781470610574.jpg'),
(2, '', '', '', NULL, NULL),
(3, 'eda', 'Eda@gmail.com', '1234567', NULL, NULL),
(4, 'nana', 'nana@gmail.com', '1234567', NULL, NULL),
(5, 'elis', 'elis@gmail.com', '123456', NULL, NULL),
(6, 'elsa', 'elsa@gmail.com', '123456', NULL, NULL),
(7, 'testing', 'testing@gmail.com', '123456', NULL, NULL),
(8, 'ningsi', 'Ningsi@gmail.com', '123456', NULL, NULL),
(9, 'Nana', 'nana@123.com', '345678', NULL, NULL),
(10, 'aul', 'aul@gmail.com', '123456', NULL, NULL),
(11, 'risna', 'tes@gmail.com', 'tes123', NULL, NULL),
(12, 'risna', 'tes1@gmail.com', '123456', NULL, NULL),
(13, 'ningsi', 'swhyun34@gmail.com', '123456', NULL, NULL),
(14, 'tami', 'gradis@gmail.com', 'Tami12', NULL, NULL),
(15, 'Dhea', 'dhea@gmail.com', 'dea123', NULL, NULL),
(16, '12345', 'femy@gmail.com', '123456', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `foods`
--
ALTER TABLE `foods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookmarks`
--
ALTER TABLE `bookmarks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `foods`
--
ALTER TABLE `foods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
