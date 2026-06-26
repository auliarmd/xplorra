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

  // State untuk Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Monitor ukuran layar saat pertama kali dimuat & saat resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch profil user untuk foto avatar navbar
  useEffect(() => {
    api.get("/profile")
      .then((res) => {
        if (res.data.status) {
          setUser(res.data.user);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Fungsi Kirim / Simpan Resep ke Backend
  const handleSave = async () => {
    const bahanKosong = bahan.some((item) => item.trim() === "");
    const langkahKosong = langkah.some((item) => item.trim() === "");

    if (
      !nama ||
      !kategori ||
      !deskripsi ||
      !daerah ||
      !gambar ||
      bahanKosong ||
      langkahKosong
    ) {
      setPopupMessage("Semua form harus diisi!");
      setIsSuccess(false);
      setShowPopup(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("deskripsi", deskripsi);
      formData.append("daerah", daerah);
      formData.append("kategori", kategori);
      formData.append("bahan", JSON.stringify(bahan));
      formData.append("langkah", JSON.stringify(langkah));
      formData.append("gambar", gambar);

      await api.post('/add-food', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setPopupMessage("Resep berhasil ditambahkan!");
      setIsSuccess(true);
      setShowPopup(true);
    } catch (err) {
      console.log(err);
      setPopupMessage("Gagal menambahkan resep!");
      setIsSuccess(false);
      setShowPopup(true);
    }
  };

  // Fungsionalitas manajemen Bahan
  const tambahBahan = () => setBahan([...bahan, ""]);
  const hapusBahan = (index) => {
    if (bahan.length > 1) {
      setBahan(bahan.filter((_, i) => i !== index));
    } else {
      setBahan([""]);
    }
  };
  const ubahBahan = (index, value) => {
    const data = [...bahan];
    data[index] = value;
    setBahan(data);
  };

  // Fungsionalitas manajemen Langkah
  const tambahLangkah = () => setLangkah([...langkah, ""]);
  const hapusLangkah = (index) => {
    if (langkah.length > 1) {
      setLangkah(langkah.filter((_, i) => i !== index));
    } else {
      setLangkah([""]);
    }
  };
  const ubahLangkah = (index, value) => {
    const data = [...langkah];
    data[index] = value;
    setLangkah(data);
  };

  // Styles Responsif Terintegrasi
  const mobileStyles = {
    navbar: { padding: "10px 15px" },
    content: { padding: "20px 15px" },
    formContainer: { padding: "20px", gap: "10px" },
    uploadBox: { height: "250px" },
    dynamicRow: { display: "flex", gap: "8px", width: "100%", alignItems: "center" },
    footer: { flexDirection: "column", gap: "10px" },
    cancelBtn: { width: "100%" },
    saveBtn: { width: "100%" },
  };

  return (
    <div style={styles.page}>
      <div style={styles.mapBackground}></div>

      {/* ================= POPUP / MODAL NOTIFIKASI ================= */}
      {showPopup && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <span
              className="material-symbols-outlined"
              style={isSuccess ? styles.successIcon : styles.errorIcon}
            >
              {isSuccess ? "check_circle" : "error"}
            </span>
            <h3 style={styles.modalTitle}>Pemberitahuan</h3>
            <p style={styles.modalText}>{popupMessage}</p>
            <button
              autoFocus
              style={styles.btnConfirm}
              onClick={() => {
                setShowPopup(false);
                if (isSuccess) navigate("/dashboardafterlogin");
              }}
            >
              Oke
            </button>
          </div>
        </div>
      )}

      {/* ================= MOBILE OVERLAY & SIDEBAR DRAWER ================= */}
      {isMobile && showMobileMenu && (
        <>
          <div style={styles.drawerBackdrop} onClick={() => setShowMobileMenu(false)} />
          <div style={{ ...styles.mobileOverlay, left: "0" }}>
            <div style={styles.mobileMenuHeader}>
              <div style={styles.mobileLogoContainer}>
                <img src="/logo_X.png" alt="logo" style={styles.mobileLogo} />
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

            <div style={{ padding: "0 5px" }}>
              <div
                style={styles.mobileMenuItemActive}
                onClick={() => { navigate("/dashboardafterlogin"); setShowMobileMenu(false); }}
              >
                Dashboard
              </div>

              <div
                style={styles.mobileMenuItem}
                onClick={() => { navigate("/Notifikasi"); setShowMobileMenu(false); }}
              >
                Notifikasi
              </div>

              <div
                style={styles.mobileMenuItem}
                onClick={() => { navigate("/profil"); setShowMobileMenu(false); }}
              >
                Profil
              </div>
            </div>
          </div>
        </>
      )}

      {/* ================= NAVBAR ================= */}
      <div style={{ ...styles.navbar, ...(isMobile ? mobileStyles.navbar : {}) }}>
        {isMobile ? (
          <div style={styles.hamburgerBtn} onClick={() => setShowMobileMenu(true)}>
            <span className="material-symbols-outlined" style={styles.hamburgerIcon}>
              menu
            </span>
          </div>
        ) : (
          <div style={styles.logoContainer} onClick={() => navigate("/dashboardafterlogin")}>
            <img src="/logo_X.png" alt="logo" style={styles.logoImg} />
            <span style={styles.logoText}>pLorra</span>
          </div>
        )}

        <div style={isMobile ? styles.mobileHeaderCenter : styles.headerCenter}>
          <div style={isMobile ? styles.mobileHeaderTitle : styles.headerTitle}>
            Tambah Resep Baru
          </div>
          {!isMobile && (
            <div style={styles.headerSubtitle}>
              Bagikan kekayaan kuliner nusantara dengan komunitas.
            </div>
          )}
        </div>

        <div style={styles.rightSection}>
          {!isMobile && (
            <div style={styles.menu}>
              <span onClick={() => navigate("/dashboardafterlogin")}>Home</span>
              <span onClick={() => navigate("/profil")}>Profil</span>
              <span onClick={() => navigate("/Notifikasi")}>Notifikasi</span>
            </div>
          )}
          <div style={styles.profileCircle} onClick={() => navigate("/profil")}>
            {user?.foto ? (
              <img
                src={`${api.defaults.baseURL}/uploads/${user.foto}`}
                style={styles.profileImage}
                alt=""
              />
            ) : (
              <span className="material-symbols-outlined" style={{ color: "#8B5A2B" }}>person</span>
            )}
          </div>
        </div>
      </div>

      {/* ================= CONTENT CONTAINER ================= */}
      <div style={{ ...styles.content, ...(isMobile ? mobileStyles.content : {}) }}>
        <div style={{ ...styles.formContainer, ...(isMobile ? mobileStyles.formContainer : {}) }}>
          
          {/* SECTION: INFORMASI DASAR */}
          <div style={styles.sectionHeader}>Informasi Dasar</div>

          <label style={styles.label}>Judul Resep</label>
          <input
            type="text"
            placeholder="Contoh: Rendang Sapi Padang Asli"
            style={styles.input}
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />

          <label style={styles.label}>Deskripsi Hidangan</label>
          <textarea
            placeholder="Ceritakan sejarah singkat hidangan ini atau keunikannya..."
            style={styles.textarea}
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
          />

          <label style={styles.label}>Kategori Hidangan</label>
          <select
            style={styles.select}
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
          >
            <option value="">Pilih Kategori</option>
            <option value="Makanan utama">Makanan utama</option>
            <option value="Minuman">Minuman</option>
            <option value="Dessert">Dessert</option>
          </select>

          <label style={styles.label}>Daerah Asal</label>
          <select
            style={styles.select}
            value={daerah}
            onChange={(e) => setDaerah(e.target.value)}
          >
            <option value="">Pilih Daerah</option>
            <option value="Sumatera">Sumatera</option>
            <option value="Kalimantan">Kalimantan</option>
            <option value="Sulawesi">Sulawesi</option>
            <option value="Maluku">Maluku</option>
            <option value="Jawa">Jawa</option>
            <option value="Irian Jaya">Irian Jaya</option>
            <option value="Nusa Tenggara">Nusa Tenggara</option>
          </select>

          {/* SECTION: MEDIA */}
          <div style={styles.sectionHeader}>Media</div>
          <label style={styles.label}>Foto Hidangan</label>

          <div style={{ ...styles.uploadBox, ...(isMobile ? mobileStyles.uploadBox : {}) }}>
            {preview ? (
              <>
                <img src={preview} alt="preview" style={styles.uploadImage} />
                <button
                  type="button"
                  style={styles.removeImageBtn}
                  onClick={() => {
                    setPreview("");
                    setGambar(null);
                  }}
                >
                  ✕
                </button>
                <label style={styles.changeImageBtn}>
                  Ganti Gambar
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setGambar(file);
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              </>
            ) : (
              <label style={styles.uploadArea}>
                <span className="material-symbols-outlined" style={styles.cameraIcon}>
                  photo_camera
                </span>
                <div style={styles.uploadTitle}>Unggah file gambar</div>
                <div style={styles.uploadText}>Klik untuk memilih dari galeri</div>
                <div style={styles.uploadInfo}>PNG, JPG, JPEG maksimal 10MB</div>
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setGambar(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
            )}
          </div>

          {/* SECTION: DETAIL RESEP */}
          <div style={styles.sectionHeader}>Detail Resep</div>

          <label style={styles.label}>Bahan-bahan</label>
          {bahan.map((item, index) => (
            <div
              key={index}
              style={{ ...styles.dynamicRow, ...(isMobile ? mobileStyles.dynamicRow : {}) }}
            >
              <input
                type="text"
                style={styles.input}
                value={item}
                placeholder="Contoh: 500gr Daging Sapi Siap Pakai"
                onChange={(e) => ubahBahan(index, e.target.value)}
              />
              <button
                type="button"
                style={styles.deleteBtn}
                onClick={() => hapusBahan(index)}
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}

          <button type="button" style={styles.linkButton} onClick={tambahBahan}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add_circle</span> Tambah Bahan
          </button>

          <label style={styles.label} style={{ marginTop: "10px" }}>Langkah Memasak</label>
          {langkah.map((item, index) => (
            <div
              key={index}
              style={{ ...styles.dynamicRow, ...(isMobile ? mobileStyles.dynamicRow : {}) }}
            >
              <div style={styles.stepNumber}>{index + 1}</div>
              <input
                type="text"
                style={styles.input}
                value={item}
                placeholder={isMobile ? `Langkah ${index + 1}...` : "Jelaskan proses langkah pembuatan secara urut..."}
                onChange={(e) => ubahLangkah(index, e.target.value)}
              />
              <button
                type="button"
                style={styles.deleteBtn}
                onClick={() => hapusLangkah(index)}
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}

          <button type="button" style={styles.linkButton} onClick={tambahLangkah}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add_circle</span> Tambah Langkah
          </button>

          {/* SECTION: FOOTER BUTTONS */}
          <div style={{ ...styles.footer, ...(isMobile ? mobileStyles.footer : {}) }}>
            <button
              style={{
                ...styles.cancelBtn,
                ...(isMobile ? mobileStyles.cancelBtn : {}),
                transform: hoverCancel ? "translateY(-2px)" : "translateY(0)",
                boxShadow: hoverCancel
                  ? "0 10px 20px rgba(0,0,0,0.15)"
                  : "0 4px 10px rgba(0,0,0,0.08)"
              }}
              onMouseEnter={() => setHoverCancel(true)}
              onMouseLeave={() => setHoverCancel(false)}
              onClick={() => navigate(-1)}
            >
              Batal
            </button>

            <button
              style={{
                ...styles.saveBtn,
                ...(isMobile ? mobileStyles.saveBtn : {}),
                transform: hoverSave ? "translateY(-2px)" : "translateY(0)",
                boxShadow: hoverSave
                  ? "0 10px 20px rgba(228,107,92,0.45)"
                  : "0 6px 15px rgba(228,107,92,0.35)"
              }}
              onMouseEnter={() => setHoverSave(true)}
              onMouseLeave={() => setHoverSave(false)}
              onClick={handleSave}
            >
              Simpan Resep
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #F4E9DC, #D49A75)",
    position: "relative",
    overflowX: "hidden",
    fontFamily: "sans-serif",
    paddingTop: "75px",
    boxSizing: "border-box"
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "70px",
    padding: "0 50px",
    background: "#fff",
    borderBottom: "1px solid #ddd",
    zIndex: 9999,
    boxSizing: "border-box"
  },
  headerCenter: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  headerTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#8B5A2B",
    marginBottom: "3px"
  },
  headerSubtitle: {
    fontSize: "12px",
    color: "#666"
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer"
  },
  logoImg: {
    width: "40px"
  },
  logoText: {
    color: "#F28C28",
    fontWeight: "bold",
    fontSize: "26px",
    marginLeft: "2px"
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },
  profileCircle: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#f5f5f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    overflow: "hidden"
  },
  menu: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#555"
  },
  content: {
    display: "flex",
    justifyContent: "center",
    padding: "40px 50px",
    width: "100%",
    boxSizing: "border-box"
  },
  formContainer: {
    width: "100%",
    maxWidth: "850px",
    background: "rgba(255, 255, 255, 0.96)",
    borderRadius: "20px",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
    boxSizing: "border-box"
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #d89d73",
    borderRadius: "8px",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
    background: "#fff"
  },
  select: {
    width: "100%",
    height: "46px",
    border: "1px solid #d89d73",
    borderRadius: "8px",
    padding: "0 12px",
    outline: "none",
    fontSize: "15px",
    background: "#fff",
    boxSizing: "border-box"
  },
  uploadBox: {
    width: "100%",
    height: "350px",
    background: "#fafafa",
    border: "2px dashed #E7A27A",
    borderRadius: "12px",
    overflow: "hidden",
    position: "relative"
  },
  uploadImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  removeImageBtn: {
    position: "absolute",
    top: "12px",
    right: "12px",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "none",
    background: "#E74C3C",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    zIndex: 10
  },
  changeImageBtn: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "10px 24px",
    background: "#fff",
    color: "#8B5A2B",
    border: "1px solid #E7A27A",
    borderRadius: "25px",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    zIndex: 10
  },
  dynamicRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%"
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    color: "#E74C3C",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px"
  },
  mapBackground: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "url('/map.png')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    opacity: 0.05,
    zIndex: -1,
    pointerEvents: "none"
  },
  sectionHeader: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#8B5A2B",
    borderBottom: "2px solid #f0d5c1",
    paddingBottom: "6px",
    marginTop: "20px",
    marginBottom: "5px"
  },
  label: {
    fontSize: "14px",
    color: "#555",
    fontWeight: "700"
  },
  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "12px 16px",
    border: "1px solid #d89d73",
    borderRadius: "8px",
    resize: "none",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box"
  },
  uploadArea: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    padding: "20px",
    boxSizing: "border-box"
  },
  cameraIcon: {
    fontSize: "48px",
    color: "#E36B4E",
    marginBottom: "8px"
  },
  uploadTitle: {
    fontWeight: "700",
    color: "#E36B4E",
    fontSize: "16px"
  },
  uploadText: {
    color: "#666",
    fontSize: "13px",
    marginTop: "2px"
  },
  uploadInfo: {
    fontSize: "11px",
    color: "#aaa",
    marginTop: "6px"
  },
  stepNumber: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#D77A35",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: "14px",
    fontWeight: "700"
  },
  linkButton: {
    border: "none",
    background: "transparent",
    color: "#D77A35",
    cursor: "pointer",
    alignSelf: "flex-start",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 0",
    fontSize: "14px"
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "15px",
    borderTop: "1px solid #eee",
    marginTop: "30px",
    paddingTop: "20px"
  },
  cancelBtn: {
    minWidth: "120px",
    height: "46px",
    background: "#fff",
    border: "1px solid #b87944",
    color: "#b87944",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
    transition: "all 0.2s"
  },
  saveBtn: {
    minWidth: "150px",
    height: "46px",
    background: "#E46B5C",
    color: "#fff",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
    transition: "all 0.2s"
  },
  profileImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
  },
  modalBox: {
    backgroundColor: "#fff",
    width: "320px",
    padding: "30px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    boxSizing: "border-box"
  },
  successIcon: {
    fontSize: "55px",
    color: "#4CAF50",
    marginBottom: "10px",
  },
  errorIcon: {
    fontSize: "55px",
    color: "#E46B5C",
    marginBottom: "10px",
  },
  modalTitle: {
    margin: "0 0 10px",
    fontSize: "20px",
    fontWeight: "700",
    color: "#333"
  },
  modalText: {
    color: "#666",
    marginBottom: "25px",
    lineHeight: "1.5",
    fontSize: "14px"
  },
  btnConfirm: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "25px",
    backgroundColor: "#E46B5C",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    outline: "none",
  },
  hamburgerBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    minWidth: "42px"
  },
  hamburgerIcon: {
    fontSize: "30px",
    color: "#8B5A2B"
  },
  mobileHeaderCenter: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  mobileHeaderTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#8B5A2B"
  },
  drawerBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 99998
  },
  mobileOverlay: {
    position: "fixed",
    top: 0,
    width: "280px",
    height: "100vh",
    background: "#FDF8F5", // Mengikuti background cream di gambar
    transition: "0.3s ease-in-out",
    boxShadow: "4px 0 25px rgba(0,0,0,.1)",
    zIndex: 99999,
    display: "flex",
    flexDirection: "column",
    padding: "20px 15px",
    boxSizing: "border-box",
    borderTopRightRadius: "24px",
    borderBottomRightRadius: "24px"
  },
  mobileMenuHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "15px",
    borderBottom: "1px solid #F3E6DC",
    marginBottom: "15px"
  },
  mobileLogoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  mobileLogo: {
    width: "35px"
  },
  mobileLogoText: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#D77A35"
  },
  closeMenuIcon: {
    fontSize: "24px",
    cursor: "pointer",
    color: "#7D5A44",
    padding: "4px"
  },
  mobileMenuItemActive: {
    display: "flex",
    alignItems: "center",
    padding: "14px 20px",
    margin: "4px 0",
    backgroundColor: "#F7E5DE", // Highlight background orange muda
    color: "#E46B5C", // Text orange pekat
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer"
  },
  mobileMenuItem: {
    display: "flex",
    alignItems: "center",
    padding: "14px 20px",
    margin: "4px 0",
    cursor: "pointer",
    fontWeight: "500",
    color: "#555",
    fontSize: "16px"
  },
  mobileAddRecipeBtn: {
    display: "block",
    width: "100%",
    margin: "30px 0 0 0",
    padding: "12px 0",
    backgroundColor: "#E46B5C",
    color: "#fff",
    border: "none",
    borderRadius: "25px",
    fontWeight: "700",
    fontSize: "15px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(228,107,92,0.2)"
  }
};

export default TambahResep;