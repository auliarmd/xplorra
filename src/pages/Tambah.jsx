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


  // ... (di dalam komponen)
const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

useEffect(() => {
  // 1. Fungsi untuk cek ukuran layar
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  // 2. PENTING: Panggil fungsi ini SATU KALI saat komponen pertama kali dimuat
  handleResize();

  // 3. Tambahkan listener agar tetap responsif jika layar di-resize
  window.addEventListener("resize", handleResize);

  return () =>
    window.removeEventListener("resize", handleResize);
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

  // Listener untuk ukuran layar
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
  navbar: { padding: "10px 15px" },
  content: { padding: "20px 10px" },
  formContainer: { padding: "20px" },
  uploadBox: { height: "250px" },

  dynamicRow: {
    flexDirection: "column",
    alignItems: "stretch",
    position: "relative"
  },

  dynamicRowLangkah: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "8px"
  },

  deleteBtnMobile: {
    alignSelf: "flex-end",
    marginTop: "-5px"
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

      {/* ================= POPUP ================= */}
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

      {/* ================= MOBILE SIDEBAR ================= */}
      {isMobile && (
        <div
          style={{
            ...styles.mobileOverlay,
            left: showMobileMenu ? "0" : "-280px"
          }}
        >
          <div style={styles.mobileMenuHeader}>
            <div style={styles.mobileLogoContainer}>
              <img src="/logo_X.png" alt="logo" style={styles.mobileLogo} />
              <span style={styles.mobileLogoText}>pLorra</span>
            </div>
            <span
              className="material-symbols-outlined"
              style={styles.mobileHamburger}
              onClick={() => setShowMobileMenu(false)}
            >
              menu
            </span>
          </div>

          <div
            style={styles.mobileMenuItem}
            onClick={() => { navigate("/dashboardafterlogin"); setShowMobileMenu(false); }}
          >
            <span className="material-symbols-outlined">home</span>
            Home
          </div>

          <div
            style={styles.mobileMenuItem}
            onClick={() => { navigate("/profil"); setShowMobileMenu(false); }}
          >
            <span className="material-symbols-outlined">person</span>
            Profil
          </div>

          <div
            style={styles.mobileMenuItem}
            onClick={() => { navigate("/Notifikasi"); setShowMobileMenu(false); }}
          >
            <span className="material-symbols-outlined">notifications</span>
            Notifikasi
          </div>
        </div>
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
          <div style={styles.logoContainer}>
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
              <span className="material-symbols-outlined">person</span>
            )}
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
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
            <div
              key={index}
              style={{
  ...styles.dynamicRow,
  ...(isMobile ? mobileStyles.dynamicRowLangkah : {})
}}
            >
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
    style={{
      ...styles.deleteBtn,
      ...(isMobile ? mobileStyles.deleteBtnLangkah : {})
    }}
    onClick={() => hapusBahan(index)}
  >
    🗑
  </button>
)}
            </div>
          ))}

          <button type="button" style={styles.linkButton} onClick={tambahBahan}>
            + Tambah Bahan
          </button>

          <label style={styles.label}>Langkah Memasak</label>
          {langkah.map((item, index) => (
            <div
  key={index}
  style={{
    ...styles.dynamicRow,
    ...(isMobile ? mobileStyles.dynamicRowLangkah : {})
  }}
>
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
    style={{
      ...styles.deleteBtn,
      ...(isMobile ? mobileStyles.deleteBtnLangkah : {})
    }}
    onClick={() => hapusLangkah(index)}
  >
    🗑
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
                boxShadow: hoverCancel
                  ? "0 10px 20px rgba(0,0,0,0.18)"
                  : "0 6px 15px rgba(0,0,0,0.12)"
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
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom,#F4E9DC,#D49A75)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "Poppins, sans-serif",
    paddingTop: "80px",
    zIndex: 0
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
    padding: "0 18px",
    background: "#fff",
    borderBottom: "1px solid #ddd",
    zIndex: 9999
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
    alignItems: "center"
  },
  logoImg: {
    width: "50px"
  },
  logoText: {
    color: "#F28C28",
    fontWeight: "bold",
    fontSize: "28px"
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    minWidth: "45px",
    justifyContent: "flex-end"
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
    flexShrink: 0
  },
  menu: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
    fontWeight: "600",
    cursor: "pointer"
  },
  content: {
    display: "flex",
    justifyContent: "center",
    padding: "40px 30px",
    marginTop: "20px"
  },
  formContainer: {
    width: "100%",
    maxWidth: "1100px",
    background: "rgba(232,210,194,0.95)",
    borderRadius: "10px",
    padding: "35px",
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.12)"
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d89d73",
    borderRadius: "4px",
    outline: "none",
    boxSizing: "border-box"
  },
  select: {
    width: "100%",
    height: "42px",
    border: "1px solid #d89d73",
    borderRadius: "4px",
    padding: "0 12px",
    outline: "none"
  },
  uploadBox: {
    width: "100%",
    height: "400px",
    background: "#fff",
    border: "2px dashed #E7A27A",
    borderRadius: "8px",
    overflow: "hidden",
    position: "relative"
  },
  uploadImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block"
  },
  removeImageBtn: {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    border: "3px solid white",
    background: "#E74C3C",
    color: "white",
    fontSize: "24px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    zIndex: 10
  },
  changeImageBtn: {
    position: "absolute",
    bottom: "28px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "inline-block",
    padding: "10px 30px",
    background: "#fff",
    color: "#8B5A2B",
    border: "2px solid #E7A27A",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    zIndex: 10
  },
  dynamicRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    color: "red",
    fontSize: "18px",
    cursor: "pointer"
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
    backgroundSize: "100%",
    opacity: 0.12,
    zIndex: -999,
    pointerEvents: "none"
  },
  sectionHeader: {
    fontSize: "26px",
    color: "#3D2A20",
    borderBottom: "1px solid #c9a48b",
    paddingBottom: "10px",
    marginTop: "15px"
  },
  label: {
    fontSize: "14px",
    color: "#444"
  },
  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "12px",
    border: "1px solid #d89d73",
    borderRadius: "4px",
    resize: "none",
    outline: "none",
    boxSizing: "border-box"
  },
  uploadArea: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer"
  },
  cameraIcon: {
    fontSize: "48px",
    color: "#F26A3D",
    marginBottom: "10px",
    fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48"
  },
  uploadTitle: {
    fontWeight: "700",
    color: "#E36B4E"
  },
  uploadText: {
    color: "#777",
    fontSize: "14px"
  },
  uploadInfo: {
    fontSize: "12px",
    color: "#777"
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
    flexShrink: 0
  },
  linkButton: {
    border: "none",
    background: "transparent",
    color: "#9B5A2B",
    cursor: "pointer",
    alignSelf: "flex-start",
    fontWeight: "600"
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "12px",
    borderTop: "1px solid #c9a48b",
    marginTop: "25px",
    paddingTop: "20px"
  },
  cancelBtn: {
    minWidth: "120px",
    height: "46px",
    background: "#fff",
    border: "1px solid #b87944",
    color: "#b87944",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    transition: "0.2s"
  },
  saveBtn: {
    minWidth: "140px",
    height: "46px",
    background: "#E46B5C",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    boxShadow: "0 6px 15px rgba(228,107,92,0.35)",
    transition: "0.2s"
  },
  profileImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%"
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
    width: "350px",
    padding: "30px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
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
    fontSize: "22px",
    fontWeight: "700",
  },
  modalText: {
    color: "#666",
    marginBottom: "20px",
    lineHeight: "1.5",
  },
  btnConfirm: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "25px",
    backgroundColor: "#E46B5C",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    outline: "none",
  },
  hamburgerBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "42px",
    height: "42px",
    cursor: "pointer"
  },
  hamburgerIcon: {
    fontSize: "32px",
    color: "#8B5A2B"
  },
  mobileHeaderCenter: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  mobileHeaderTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#8B5A2B"
  },
  mobileOverlay: {
    position: "fixed",
    top: 0,
    width: "280px",
    height: "100vh",
    background: "#fff",
    transition: "0.3s ease-in-out",
    boxShadow: "3px 0 20px rgba(0,0,0,.18)",
    zIndex: 99999
  },
  mobileMenuHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px",
    borderBottom: "1px solid #eee"
  },
  mobileLogoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  mobileLogo: {
    width: "40px"
  },
  mobileLogoText: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#F28C28"
  },
  mobileHamburger: {
    fontSize: "30px",
    cursor: "pointer",
    color: "#8B5A2B"
  },
  mobileMenuItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "18px",
    cursor: "pointer",
    fontWeight: "600",
    borderBottom: "1px solid #eee"
  }
};

export default TambahResep;