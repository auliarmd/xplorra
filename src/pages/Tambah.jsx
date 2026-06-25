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
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
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

      setLoading(false);
      setPopupMessage("Resep berhasil ditambahkan!");
      setIsSuccess(true);
      setShowPopup(true);
    } 
    catch (err) {
      setLoading(false);
      console.log("Status :", err.response?.status);
      console.log("Data :", err.response?.data);
      console.log("Error :", err);

      setPopupMessage(
        err.response?.data?.message || "Gagal menambahkan resep!"
      );
      setIsSuccess(false);
      setShowPopup(true);
    }
  };

  const tambahBahan = () => setBahan([...bahan, ""]);
  const hapusBahan = (index) => setBahan(bahan.filter((_, i) => i !== index));
  const ubahBahan = (index, value) => {
    const data = [...bahan];
    data[index] = value;
    setBahan(data);
  };

  const tambahLangkah = () => setLangkah([...langkah, ""]);
  const hapusLangkah = (index) => setLangkah(langkah.filter((_, i) => i !== index));
  const ubahLangkah = (index, value) => {
    const data = [...langkah];
    data[index] = value;
    setLangkah(data);
  };

  const mobileStyles = {
    content: { padding: "20px 15px", marginTop: "0px" },
    formContainer: { padding: "20px" },
    uploadBox: { height: "250px" },
    dynamicRowLangkah: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "8px"
    },
    deleteBtnLangkah: {
      marginTop: "0",
      alignSelf: "center",
      flexShrink: 0
    },
    footer: { flexDirection: "column" },
    cancelBtn: { width: "100%" },
    saveBtn: { width: "100%" }
  };

  return (
    <div style={styles.page}>
      <div style={styles.mapBackground}></div>

      <style>{`
        .hover-sidebar-item {
          transition: all 0.2s ease-in-out;
        }
        .hover-sidebar-item:hover {
          background-color: rgba(225, 91, 60, 0.08) !important;
          color: #e15b3c !important;
          padding-left: 18px !important;
        }
      `}</style>

      {/* ================= POPUP ================= */}
      {showPopup && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <span className="material-symbols-outlined" style={isSuccess ? styles.successIcon : styles.errorIcon}>
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

      {/* ================= NAVBAR & HEADER SERAGAM ================= */}
      {isMobile ? (
        <div style={styles.mobileNavbar}>
          <div style={styles.mobileNavbarLeft}>
            <span className="material-symbols-outlined" style={styles.mobileMenuIcon} onClick={() => setShowMobileMenu(true)}>
              menu
            </span>
          </div>
          
          <div style={styles.mobileHeaderTitleCenter}>
            <span className="material-symbols-outlined" style={styles.mobileHeaderIcon}>note_add</span>
            <span>Tambah Resep</span>
          </div>
          
          <div style={styles.mobileNavbarRight}>
            <div style={styles.profileCircle} onClick={() => navigate("/profil")}>
              {user?.foto ? (
                <img src={`${api.defaults.baseURL}/uploads/${user.foto}`} alt="Profile" style={styles.profileImg} />
              ) : (
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>person</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.navbar}>
          <div style={styles.logoContainer}>
            <img src="/logo_X.png" alt="logo" style={styles.logoImg} />
            <span style={styles.logoText}>pLorra</span>
          </div>
          <div style={styles.menu}>
            <span onClick={() => navigate("/dashboardafterlogin")}>Home</span>
            <span onClick={() => navigate("/profil")}>Profil</span>
            <span onClick={() => navigate("/Notifikasi")}>Notifikasi</span>
          </div>
          <div style={styles.rightMenu}>
            <button style={styles.activeBtnTambah}>+ Tambah resep</button>
            <div style={styles.profileCircle} onClick={() => navigate("/profil")}>
              {user?.foto ? (
                <img src={`${api.defaults.baseURL}/uploads/${user.foto}`} alt="Profile" style={styles.profileImg} />
              ) : (
                <span className="material-symbols-outlined">person</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MOBILE SIDEBAR DRAWER SERAGAM ================= */}
      {isMobile && showMobileMenu && (
        <>
          <div style={styles.mobileOverlay} onClick={() => setShowMobileMenu(false)} />
          <div style={styles.mobileSidebar}>
            <div style={styles.mobileLogoSection}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src="/logo_X.png" alt="" style={{ width: "40px" }} />
                <span style={styles.mobileLogoText}>pLorra</span>
              </div>
              <span className="material-symbols-outlined" style={styles.closeMenuIcon} onClick={() => setShowMobileMenu(false)}>close</span>
            </div>
            <div style={styles.mobileMenuTitle}>MENU</div>
            <div className="hover-sidebar-item" style={styles.mobileMenuItem} onClick={() => { navigate("/dashboardafterlogin"); setShowMobileMenu(false); }}>Dashboard</div>
            <div className="hover-sidebar-item" style={styles.mobileMenuItemActive} onClick={() => { setShowMobileMenu(false); }}>Tambah Resep</div>
            <div className="hover-sidebar-item" style={styles.mobileMenuItem} onClick={() => { navigate("/Notifikasi"); setShowMobileMenu(false); }}>Notifikasi</div>
            <div className="hover-sidebar-item" style={styles.mobileMenuItem} onClick={() => { navigate("/profil"); setShowMobileMenu(false); }}>Profil</div>
          </div>
        </>
      )}

      {/* ================= CONTENT FORM ================= */}
      <div style={{ ...styles.content, ...(isMobile ? mobileStyles.content : {}) }}>
        <div style={{ ...styles.formContainer, ...(isMobile ? mobileStyles.formContainer : {}) }}>
          
          {/* INFORMASI DASAR */}
          <div style={styles.sectionHeader}>Informasi Dasar</div>

          <label style={styles.label}>Judul Resep</label>
          <input
            type="text"
            placeholder="Contoh: Rendang Sapi Padang Asli"
            style={styles.input}
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />

          <textarea
            placeholder="Tambahkan deskripsi"
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
          </select>

          {/* MEDIA */}
          <div style={styles.sectionHeader}>Media</div>

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
                <div style={styles.uploadTitle}>Unggah file</div>
                <div style={styles.uploadText}>atau tarik dan lepas</div>
                <div style={styles.uploadInfo}>PNG, JPG, GIF up to 10MB</div>
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setGambar(file);
                    if (file) {
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
            )}
          </div>

          {/* DETAIL RESEP */}
          <div style={styles.sectionHeader}>Detail Resep</div>

          <label style={styles.label}>Bahan-bahan</label>
          {bahan.map((item, index) => (
            <div key={index} style={isMobile ? mobileStyles.dynamicRowLangkah : styles.dynamicRow}>
              <input
                type="text"
                style={styles.input}
                value={item}
                placeholder="Contoh: 500gr Daging Sapi"
                onChange={(e) => ubahBahan(index, e.target.value)}
              />
              {item.trim() !== "" && (
                <button
                  type="button"
                  style={{ ...styles.deleteBtn, ...(isMobile ? mobileStyles.deleteBtnLangkah : {}) }}
                  onClick={() => hapusBahan(index)}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              )}
            </div>
          ))}

          <button type="button" style={styles.linkButton} onClick={tambahBahan}>
            + Tambah Bahan
          </button>

          <label style={styles.label}>Langkah Memasak</label>
          {langkah.map((item, index) => (
            <div key={index} style={isMobile ? mobileStyles.dynamicRowLangkah : styles.dynamicRow}>
              {!isMobile && <div style={styles.stepNumber}>{index + 1}</div>}
              <input
                type="text"
                style={styles.input}
                value={item}
                placeholder={isMobile ? `Langkah ${index + 1}...` : "Jelaskan langkah pembuatan..."}
                onChange={(e) => ubahLangkah(index, e.target.value)}
              />
              {item.trim() !== "" && (
                <button
                  type="button"
                  style={{ ...styles.deleteBtn, ...(isMobile ? mobileStyles.deleteBtnLangkah : {}) }}
                  onClick={() => hapusLangkah(index)}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              )}
            </div>
          ))}

          <button type="button" style={styles.linkButton} onClick={tambahLangkah}>
            + Tambah Langkah
          </button>

          {/* FOOTER BUTTONS */}
          <div style={{ ...styles.footer, ...(isMobile ? mobileStyles.footer : {}) }}>
            <button
              style={{
                ...styles.cancelBtn,
                ...(isMobile ? mobileStyles.cancelBtn : {}),
                transform: hoverCancel ? "translateY(-2px)" : "translateY(0)",
                boxShadow: hoverCancel ? "0 10px 20px rgba(0,0,0,0.18)" : "0 6px 15px rgba(0,0,0,0.12)"
              }}
              onMouseEnter={() => setHoverCancel(true)}
              onMouseLeave={() => setHoverCancel(false)}
              onClick={() => navigate(-1)}
            >
              Batal
            </button>

            <button
              disabled={loading}
              style={{
                ...styles.saveBtn,
                ...(isMobile ? mobileStyles.saveBtn : {}),
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer"
              }}
              onClick={handleSave}
            >
              {loading ? "Menyimpan..." : "Simpan Resep"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f7f1ec", position: "relative", fontFamily: "sans-serif", paddingBottom: "40px" },
  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 50px", background: "#fff", position: "sticky", top: 0, zIndex: 999, boxShadow: "0 2px 10px rgba(0,0,0,0.03)", height: "auto", borderBottom: "none" },
  logoContainer: { display: "flex", alignItems: "center", gap: "1px" },
  logoImg: { width: "40px" },
  logoText: { color: "#F28C28", fontWeight: "bold", fontSize: "24px", letterSpacing: "1px" },
  menu: { display: "flex", gap: "30px", fontSize: "18px", fontWeight: "700", cursor: "pointer", marginLeft: "100px" },
  rightMenu: { display: "flex", alignItems: "center", gap: "15px" },
  activeBtnTambah: { border: "1.5px solid #e15b3c", color: "#fff", background: "#e15b3c", padding: "6px 15px", borderRadius: "20px", cursor: "default", fontWeight: "600" },
  profileCircle: { width: "35px", height: "35px", borderRadius: "50%", background: "#f4b8a3", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", cursor: "pointer", overflow: "hidden" },
  profileImg: { width: "100%", height: "100%", objectFit: "cover" },
  content: { display: "flex", justifyContent: "center", padding: "40px 50px", position: "relative", zIndex: 10 },
  formContainer: { width: "100%", maxWidth: "1400px", background: "#fff", borderRadius: "18px", padding: "35px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "0 6px 18px rgba(0,0,0,0.06)" },
  input: { width: "100%", padding: "12px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", outline: "none", boxSizing: "border-box" },
  select: { width: "100%", height: "42px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", padding: "0 12px", outline: "none" },
  uploadBox: { width: "100%", height: "400px", background: "#fff", border: "2px dashed #E7A27A", borderRadius: "8px", overflow: "hidden", position: "relative" },
  uploadImage: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  removeImageBtn: { position: "absolute", top: "8px", right: "8px", width: "30px", height: "30px", borderRadius: "50%", border: "3px solid white", background: "#E74C3C", color: "white", fontSize: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", zIndex: 10 },
  changeImageBtn: { position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", display: "inline-block", padding: "10px 30px", background: "#fff", color: "#8B5A2B", border: "2px solid #E7A27A", borderRadius: "6px", fontWeight: "600", fontSize: "14px", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.15)", zIndex: 10 },
  dynamicRow: { display: "flex", alignItems: "center", gap: "10px", width: "100%" },
  deleteBtn: { background: "transparent", border: "none", color: "#e15b3c", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px" },
  mapBackground: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/map.png')", backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "cover", opacity: 0.05, zIndex: 1, pointerEvents: "none" },
  sectionHeader: { fontSize: "22px", color: "#e15b3c", fontWeight: "700", borderBottom: "2px solid rgba(0,0,0,0.06)", paddingBottom: "8px", marginTop: "15px", marginBottom: "5px" },
  label: { fontSize: "14px", color: "#444", fontWeight: "700" },
  textarea: { width: "100%", minHeight: "100px", padding: "12px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", resize: "none", outline: "none", boxSizing: "border-box" },
  uploadArea: { width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", cursor: "pointer" },
  cameraIcon: { fontSize: "48px", color: "#e15b3c", marginBottom: "10px" },
  uploadTitle: { fontWeight: "700", color: "#e15b3c" },
  uploadText: { color: "#777", fontSize: "14px" },
  uploadInfo: { fontSize: "12px", color: "#777" },
  stepNumber: { width: "28px", height: "28px", borderRadius: "50%", background: "#e15b3c", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  linkButton: { border: "none", background: "transparent", color: "#e15b3c", cursor: "pointer", alignSelf: "flex-start", fontWeight: "700" },
  footer: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "12px", borderTop: "1px solid rgba(0,0,0,0.06)", marginTop: "25px", paddingTop: "20px" },
  cancelBtn: { minWidth: "120px", height: "46px", background: "#fff", border: "1px solid #e15b3c", color: "#e15b3c", borderRadius: "25px", cursor: "pointer", fontSize: "15px", fontWeight: "700", transition: "0.2s" },
  saveBtn: { minWidth: "140px", height: "46px", background: "#e15b3c", color: "#fff", border: "none", borderRadius: "25px", cursor: "pointer", fontSize: "15px", fontWeight: "700", transition: "0.2s" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999 },
  modalBox: { backgroundColor: "#fff", width: "350px", padding: "30px", borderRadius: "20px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" },
  successIcon: { fontSize: "55px", color: "#4CAF50", marginBottom: "10px" },
  errorIcon: { fontSize: "55px", color: "#e15b3c", marginBottom: "10px" },
  modalTitle: { margin: "0 0 10px", fontSize: "22px", fontWeight: "700" },
  modalText: { color: "#666", marginBottom: "20px", lineHeight: "1.5" },
  btnConfirm: { width: "100%", padding: "12px", border: "none", borderRadius: "25px", backgroundColor: "#e15b3c", color: "#fff", fontWeight: "600", cursor: "pointer", outline: "none" },
  
  // Gaya Khusus Mobile (Menyamakan dengan Dashboard)
  mobileNavbar: { display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF", padding: "12px 20px", position: "sticky", top: 0, zIndex: 999, width: "100%", boxSizing: "border-box", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" },
  mobileNavbarLeft: { flex: 1, display: "flex", justifyContent: "flex-start", alignItems: "center" },
  mobileMenuIcon: { fontSize: "30px", color: "#9F6822", cursor: "pointer" },
  mobileHeaderTitleCenter: { display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "#9F6822", fontWeight: "700", fontSize: "18px", whiteSpace: "nowrap" },
  mobileHeaderIcon: { fontSize: "24px" },
  mobileNavbarRight: { flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center" },
  mobileOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", zIndex: 1001 },
  mobileSidebar: { position: "fixed", top: 0, left: 0, width: "260px", height: "100vh", background: "#F7F1EC", zIndex: 1002, padding: "20px", boxShadow: "4px 0 20px rgba(0,0,0,0.15)", boxSizing: "border-box" },
  mobileLogoSection: { display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #ddd", paddingBottom: "12px" },
  mobileLogoText: { color: "#E28B36", fontSize: "24px", fontWeight: "700", marginLeft: "8px" },
  closeMenuIcon: { fontSize: "28px", color: "#5E4637", cursor: "pointer", padding: "4px" },
  mobileMenuTitle: { marginTop: "20px", marginBottom: "15px", fontWeight: "700", fontSize: "18px", color: "#5E4637" },
  mobileMenuItem: { padding: "12px 14px", fontSize: "16px", cursor: "pointer", color: "#555", fontWeight: "500", borderRadius: "10px", backgroundColor: "transparent" },
  mobileMenuItemActive: { padding: "12px 14px", fontSize: "16px", cursor: "pointer", color: "#e15b3c", backgroundColor: "rgba(225, 91, 60, 0.12)", fontWeight: "700", borderRadius: "10px" }
};

export default TambahResep;