import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function TambahResep() {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [daerah, setDaerah] = useState("");
  const [kategori, setKategori] = useState("");
  const [gambar, setGambar] = useState(null);
  const [preview, setPreview] = useState("");
  const [bahan, setBahan] = useState([""]);
  const [langkah, setLangkah] = useState([""]);
  const [hoverSave, setHoverSave] = useState(false);
  const [hoverCancel, setHoverCancel] = useState(false);
  const [user, setUser] = useState(null);
  
  // State untuk Mobile Menu & Layar
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // State untuk Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success"); // 'success' atau 'error'

  // Ambil data profil untuk validasi token & header
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Masuk");
      return;
    }
    api
      .get("/profile")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.log(err);
        navigate("/Masuk");
      });
  }, [navigate]);

  // Daftar Kategori & Daerah disamakan dengan Dashboard
  const daftarKategori = ["Makanan utama", "Minuman", "Dessert"];
  const daftarDaerah = [
    "Sumatera",
    "Kalimantan",
    "Sulawesi",
    "Maluku",
    "Irian Jaya",
    "Nusa Tenggara",
    "Jawa"
  ];

  const handleGambarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleBahanChange = (index, value) => {
    const newBahan = [...bahan];
    newBahan[index] = value;
    setBahan(newBahan);
  };

  const tambahBahan = () => setBahan([...bahan, ""]);
  const hapusBahan = (index) => {
    if (bahan.length > 1) {
      setBahan(bahan.filter((_, i) => i !== index));
    }
  };

  const handleLangkahChange = (index, value) => {
    const newLangkah = [...langkah];
    newLangkah[index] = value;
    setLangkah(newLangkah);
  };

  const tambahLangkah = () => setLangkah([...langkah, ""]);
  const hapusLangkah = (index) => {
    if (langkah.length > 1) {
      setLangkah(langkah.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nama || !deskripsi || !daerah || !kategori || !gambar) {
      setPopupMessage("Semua kolom dan gambar wajib diisi!");
      setPopupType("error");
      setShowPopup(true);
      return;
    }

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("deskripsi", deskripsi);
    formData.append("daerah", daerah);
    formData.append("kategori", kategori);
    formData.append("gambar", gambar);
    formData.append("bahan", JSON.stringify(bahan.filter((b) => b.trim() !== "")));
    formData.append("langkah", JSON.stringify(langkah.filter((l) => l.trim() !== "")));

    try {
      await api.post("/foods", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPopupMessage("Resep berhasil ditambahkan!");
      setPopupType("success");
      setShowPopup(true);
      setTimeout(() => {
        navigate("/dashboardafterlogin");
      }, 2000);
    } catch (err) {
      console.error(err);
      setPopupMessage(err.response?.data?.message || "Gagal menambahkan resep.");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      {isMobile ? (
        <div style={styles.mobileNavbar}>
          <div style={styles.mobileNavbarLeft}>
            <span
              className="material-symbols-outlined"
              style={styles.mobileMenuIcon}
              onClick={() => setShowMobileMenu(true)}
            >
              menu
            </span>
          </div>
          <div style={styles.mobileHeaderTitleCenter}>
            <span className="material-symbols-outlined" style={styles.mobileHeaderIcon}>
              add_circle
            </span>
            <span>Tambah Resep</span>
          </div>
          <div style={styles.mobileNavbarRight}>
            <div style={styles.profileCircle} onClick={() => navigate("/profil")}>
              {user?.foto ? (
                <img
                  src={`https://xplorra-production.up.railway.app/uploads/${user.foto}`}
                  alt="Profile"
                  style={styles.profileImg}
                />
              ) : (
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                  person
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.navbar}>
          <div style={styles.logoContainer} onClick={() => navigate("/dashboardafterlogin")}>
            <img src="/logo_X.png" alt="logo" style={styles.logoImg} />
            <span style={styles.logoText}>pLorra</span>
          </div>
          <div style={styles.menu}>
            <span onClick={() => navigate("/dashboardafterlogin")} style={{ cursor: "pointer" }}>
              Home
            </span>
            <span onClick={() => navigate("/profil")} style={{ cursor: "pointer" }}>
              Profil
            </span>
            <span onClick={() => navigate("/notifikasi")} style={{ cursor: "pointer" }}>
              Notifikasi
            </span>
          </div>
          <div style={styles.rightMenu}>
            <button style={styles.btnTambahActive}>+ Tambah resep</button>
            <div style={styles.profileCircle} onClick={() => navigate("/profil")}>
              {user?.foto ? (
                <img
                  src={`https://xplorra-production.up.railway.app/uploads/${user.foto}`}
                  alt="Profile"
                  style={styles.profileImg}
                />
              ) : (
                <span className="material-symbols-outlined">person</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE SIDEBAR DRAWER */}
      {isMobile && showMobileMenu && (
        <>
          <div style={styles.mobileOverlay} onClick={() => setShowMobileMenu(false)} />
          <div style={styles.mobileSidebar}>
            <div style={styles.mobileLogoSection}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src="/logo_X.png" alt="" style={{ width: "40px" }} />
                <span style={styles.mobileLogoText}>pLorra</span>
              </div>
              <span
                className="material-symbols-outlined"
                style={styles.closeMenuIcon}
                onClick={() => setShowMobileMenu(false)}
              >
                close
              </span>
            </div>
            <div style={{ marginTop: "20px" }}>
              <div style={styles.mobileMenuItem} onClick={() => navigate("/dashboardafterlogin")}>
                Dashboard
              </div>
              <div style={styles.mobileMenuItem} onClick={() => navigate("/notifikasi")}>
                Notifikasi
              </div>
              <div style={styles.mobileMenuItem} onClick={() => navigate("/profil")}>
                Profil
              </div>
              <div
                style={{ ...styles.mobileMenuItem, color: "#e15b3c", fontWeight: "700" }}
                onClick={() => setShowMobileMenu(false)}
              >
                + Tambah Resep
              </div>
            </div>
          </div>
        </>
      )}

      {/* FORM CONTENT */}
      <div style={isMobile ? styles.cardMobile : styles.card}>
        <h2 style={styles.title}>Tambah Resep Kuliner</h2>
        <form onSubmit={handleSubmit} style={styles.formGrid}>
          {/* SISI KIRI (TEXT INPUTS) */}
          <div style={styles.leftColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nama Olahan Kuliner</label>
              <input
                type="text"
                placeholder="Masukkan nama makanan/minuman..."
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Deskripsi Singkat</label>
              <textarea
                placeholder="Ceritakan sedikit tentang kuliner ini..."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                style={{ ...styles.input, height: "100px", resize: "none" }}
              />
            </div>

            {/* SELEKSI DROPDOWN DAERAH (DISAMAKAN) */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Daerah Asal</label>
              <select
                value={daerah}
                onChange={(e) => setDaerah(e.target.value)}
                style={styles.selectInput}
              >
                <option value="" disabled>-- Pilih Wilayah Daerah --</option>
                {daftarDaerah.map((dae) => (
                  <option key={dae} value={dae}>
                    {dae}
                  </option>
                ))}
              </select>
            </div>

            {/* SELEKSI DROPDOWN KATEGORI (DISAMAKAN) */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Kategori Hidangan</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                style={styles.selectInput}
              >
                <option value="" disabled>-- Pilih Jenis Hidangan --</option>
                {daftarKategori.map((kat) => (
                  <option key={kat} value={kat}>
                    {kat}
                  </option>
                ))}
              </select>
            </div>

            {/* INPUT DINAMIS BAHAN */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Bahan - Bahan</label>
              {bahan.map((b, index) => (
                <div key={index} style={styles.dynamicRow}>
                  <input
                    type="text"
                    placeholder={`Bahan ke-${index + 1}`}
                    value={b}
                    onChange={(e) => handleBahanChange(index, e.target.value)}
                    style={styles.inputDynamic}
                  />
                  {bahan.length > 1 && (
                    <button
                      type="button"
                      onClick={() => hapusBahan(index)}
                      style={styles.btnDeleteDynamic}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={tambahBahan} style={styles.btnAddDynamic}>
                + Tambah Bahan
              </button>
            </div>

            {/* INPUT DINAMIS LANGKAH */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Langkah Pembuatan</label>
              {langkah.map((l, index) => (
                <div key={index} style={styles.dynamicRow}>
                  <textarea
                    placeholder={`Langkah ke-${index + 1}`}
                    value={l}
                    onChange={(e) => handleLangkahChange(index, e.target.value)}
                    style={{ ...styles.inputDynamic, height: "60px", resize: "none" }}
                  />
                  {langkah.length > 1 && (
                    <button
                      type="button"
                      onClick={() => hapusLangkah(index)}
                      style={styles.btnDeleteDynamic}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={tambahLangkah} style={styles.btnAddDynamic}>
                + Tambah Langkah
              </button>
            </div>
          </div>

          {/* SISI KANAN (MEDIA UPLOAD & SUBMIT BUTTONS) */}
          <div style={styles.rightColumn}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Foto Kuliner</label>
              <div style={styles.uploadBox}>
                {preview ? (
                  <div style={styles.previewContainer}>
                    <img src={preview} alt="Preview" style={styles.previewImg} />
                    <label htmlFor="file-upload" style={styles.changeImgOverlay}>
                      <span className="material-symbols-outlined">photo_camera</span>
                      Ganti Foto
                    </label>
                  </div>
                ) : (
                  <label htmlFor="file-upload" style={styles.uploadLabel}>
                    <span className="material-symbols-outlined" style={styles.uploadIcon}>
                      cloud_upload
                    </span>
                    <span style={{ fontSize: "14px", color: "#555" }}>Unggah Gambar Kuliner</span>
                    <span style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
                      Format: JPG, JPEG, PNG
                    </span>
                  </label>
                )}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleGambarChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            {/* CONTAINER TOMBOL AKSI */}
            <div style={styles.actionContainer}>
              <button
                type="submit"
                onMouseEnter={() => setHoverSave(true)}
                onMouseLeave={() => setHoverSave(false)}
                style={hoverSave ? styles.btnSaveHover : styles.btnSave}
              >
                Simpan Resep
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboardafterlogin")}
                onMouseEnter={() => setHoverCancel(true)}
                onMouseLeave={() => setHoverCancel(false)}
                style={hoverCancel ? styles.btnCancelHover : styles.btnCancel}
              >
                Batalkan
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* POPUP NOTIFIKASI */}
      {showPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupCard}>
            <span
              className="material-symbols-outlined"
              style={popupType === "success" ? styles.popupIconSuccess : styles.popupIconError}
            >
              {popupType === "success" ? "check_circle" : "error"}
            </span>
            <p style={styles.popupText}>{popupMessage}</p>
            {popupType === "error" && (
              <button onClick={() => setShowPopup(false)} style={styles.btnPopupClose}>
                Tutup
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { fontFamily: "sans-serif", background: "#f7f1ec", minHeight: "100vh", paddingBottom: "40px" },
  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 50px", background: "#fff", position: "sticky", top: 0, zIndex: 999, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" },
  logoContainer: { display: "flex", alignItems: "center", gap: "1px", cursor: "pointer" },
  logoImg: { width: "40px" },
  logoText: { color: "#F28C28", fontWeight: "bold", fontSize: "24px", letterSpacing: "1px" },
  menu: { display: "flex", gap: "30px", fontSize: "18px", fontWeight: "700", marginRight: "30px" },
  rightMenu: { display: "flex", alignItems: "center", gap: "15px" },
  btnTambahActive: { background: "#e15b3c", color: "#fff", border: "none", padding: "8px 18px", borderRadius: "20px", fontWeight: "600", cursor: "default" },
  profileCircle: { width: "35px", height: "35px", borderRadius: "50%", background: "#f4b8a3", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", cursor: "pointer", overflow: "hidden" },
  profileImg: { width: "100%", height: "100%", objectFit: "cover" },
  
  // Mobile Navbar & Menu Drawer
  mobileNavbar: { display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF", padding: "12px 20px", position: "sticky", top: 0, zIndex: 999, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" },
  mobileNavbarLeft: { flex: 1, display: "flex", justifyContent: "flex-start" },
  mobileMenuIcon: { fontSize: "30px", color: "#9F6822", cursor: "pointer" },
  mobileHeaderTitleCenter: { display: "flex", alignItems: "center", gap: "6px", color: "#9F6822", fontWeight: "700", fontSize: "17px" },
  mobileHeaderIcon: { fontSize: "22px" },
  mobileNavbarRight: { flex: 1, display: "flex", justifyContent: "flex-end" },
  mobileOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", zIndex: 1001 },
  mobileSidebar: { position: "fixed", top: 0, left: 0, width: "260px", height: "100vh", background: "#F7F1EC", zIndex: 1002, padding: "20px", boxShadow: "4px 0 20px rgba(0,0,0,0.15)", boxSizing: "border-box" },
  mobileLogoSection: { display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #ddd", paddingBottom: "12px" },
  mobileLogoText: { color: "#E28B36", fontSize: "24px", fontWeight: "700", marginLeft: "8px" },
  closeMenuIcon: { fontSize: "28px", color: "#5E4637", cursor: "pointer" },
  mobileMenuItem: { padding: "12px 14px", fontSize: "16px", cursor: "pointer", color: "#555", fontWeight: "500", borderRadius: "10px" },

  // Form Card Layouts
  card: { maxWidth: "900px", margin: "40px auto", background: "#fff", padding: "35px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" },
  cardMobile: { margin: "15px", background: "#fff", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" },
  title: { fontSize: "24px", fontWeight: "800", color: "#333", marginBottom: "30px", textAlign: "center" },
  formGrid: { display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "30px" },
  leftColumn: { flex: "2 1 450px", display: "flex", flexDirection: "column", gap: "18px" },
  rightColumn: { flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "14px", color: "#444", fontWeight: "700" },
  input: { padding: "12px 16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "14px", outline: "none", transition: "all 0.2s" },
  selectInput: { padding: "12px 16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "14px", outline: "none", background: "#fff", fontWeight: "600", color: "#444", cursor: "pointer" },
  
  // Dynamic Inputs Layout
  dynamicRow: { display: "flex", gap: "10px", marginBottom: "8px", alignItems: "center" },
  inputDynamic: { flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "13px", outline: "none" },
  btnDeleteDynamic: { background: "#fff2f0", color: "#e15b3c", border: "1px solid #ffccc7", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center" },
  btnAddDynamic: { width: "fit-content", background: "transparent", color: "#e15b3c", border: "none", fontSize: "13px", fontWeight: "700", cursor: "pointer", padding: "4px 0" },
  
  // Upload Component Layout
  uploadBox: { border: "2px dashed #ccc", borderRadius: "15px", height: "240px", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa", overflow: "hidden", position: "relative" },
  uploadLabel: { display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", padding: "20px", textAlign: "center" },
  uploadIcon: { fontSize: "42px", color: "#e15b3c", marginBottom: "10px" },
  previewContainer: { width: "100%", height: "100%", position: "relative" },
  previewImg: { width: "100%", height: "100%", objectFit: "cover" },
  changeImgOverlay: { position: "absolute", bottom: "12px", right: "12px", background: "rgba(0,0,0,0.7)", color: "#fff", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" },
  
  // Action Buttons
  actionContainer: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" },
  btnSave: { background: "#e15b3c", color: "#fff", border: "none", padding: "14px", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" },
  btnSaveHover: { background: "#c84a2d", color: "#fff", border: "none", padding: "14px", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(225,91,60,0.2)" },
  btnCancel: { background: "transparent", color: "#777", border: "1px solid #ccc", padding: "12px", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" },
  btnCancelHover: { background: "#f0f0f0", color: "#333", border: "1px solid #999", padding: "12px", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
  
  // Popup Notification Box
  popupOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 },
  popupCard: { background: "#fff", padding: "30px", borderRadius: "16px", width: "320px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" },
  popupIconSuccess: { fontSize: "56px", color: "#52c41a", marginBottom: "15px" },
  popupIconError: { fontSize: "56px", color: "#f5222d", marginBottom: "15px" },
  popupText: { fontSize: "15px", color: "#333", fontWeight: "600", margin: "0 0 20px 0", lineHeight: "1.4" },
  btnPopupClose: { background: "#333", color: "#fff", border: "none", padding: "8px 24px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }
};

export default TambahResep;