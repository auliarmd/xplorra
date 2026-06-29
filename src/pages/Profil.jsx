import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";


function Profil() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profil");
  const [myRecipes, setMyRecipes] = useState([]);
  const [myBookmarks, setMyBookmarks] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  
  const [showPhotoMenu, setShowPhotoMenu] = useState(false); 
  const galleryInputRef = useRef(null);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  
  // State baru untuk popup sukses ubah kata sandi & ubah nama
  const [showSuccessPasswordPopup, setShowSuccessPasswordPopup] = useState(false);
  const [showSuccessNamePopup, setShowSuccessNamePopup] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // State visibility password
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [hoverPassword, setHoverPassword] = useState(false);
  const [hoverLogout, setHoverLogout] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("foto", file);

      const res = await api.post("/upload-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status) {
        setProfileImage(`https://xplorra-production.up.railway.app/uploads/${res.data.foto}`);
        setUser((prev) => ({ ...prev, foto: res.data.foto }));
        setShowPhotoMenu(false);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah foto.");
    } finally {
      event.target.value = "";
    }
  };

  const handleChangePassword = async () => {
  if (newPassword !== confirmPassword) {
    alert("Konfirmasi password tidak cocok");
    return;
  }

  try {
    await api.put(
      "/change-password",
      { oldPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setShowPasswordPopup(false);
    setShowSuccessPasswordPopup(true);

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (err) {
    alert(err.response?.data?.message || "Gagal mengubah password");
  }
};

  const handleRemovePhoto = async (e) => {
    e.preventDefault(); 
    try {
      await api.delete("/profile-photo");
      setProfileImage(null);
      setUser((prev) => ({ ...prev, foto: null }));
      setShowPhotoMenu(false);
    } catch (err) {
      console.log("ERROR HAPUS FOTO:", err.response?.data || err);
      alert("Gagal menghapus foto");
    }
  };

  const handleUpdateName = async () => {
    const trimmedName = newName.trim();
    if (!trimmedName) {
      alert("Nama tidak boleh kosong");
      return;
    }
    if (trimmedName === user.nama) {
      setIsEditingName(false);
      return;
    }

    try {
      const res = await api.put(
        "/update-name",
        { nama: trimmedName },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (res.data.status) {
        setUser((prev) => ({ ...prev, nama: trimmedName }));
        setNewName(trimmedName);
        setIsEditingName(false);
        setShowSuccessNamePopup(true);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal mengubah nama");
    }
  };

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showRemoveBookmarkPopup, setShowRemoveBookmarkPopup] = useState(false);
  const [removeBookmarkTargetId, setRemoveBookmarkTargetId] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  
  // State hover untuk tombol popup
  const [hoverCancelLogout, setHoverCancelLogout] = useState(false);
  const [hoverConfirmLogout, setHoverConfirmLogout] = useState(false);
  const [hoverConfirmName, setHoverConfirmName] = useState(false);
  const [hoverSuccessPassword, setHoverSuccessPassword] = useState(false);
  const [hoverPhoto, setHoverPhoto] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/Masuk');
      return;
    }

    api.get("/profile")
      .then((res) => {
        console.log("PROFILE =", res.data);

        if (res.data.status) {
          setUser(res.data.user);
        }
        api.get('/my-recipes')
          .then((res) => {
            setMyRecipes(Array.isArray(res.data) ? res.data : []);
          })
          .catch((err) => console.log(err));

        api.get('/my-bookmarks')
          .then((res) => {
            setMyBookmarks(res.data);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem("token");
        navigate('/Masuk');
      });
  }, [navigate]);

  const confirmDeleteRecipe = async () => {
    if (!deleteTargetId) return;
    try {
      await api.delete(`/delete-food/${deleteTargetId}`);
      setMyRecipes(myRecipes.filter((resep) => resep.id !== deleteTargetId));
    } catch (err) {
      console.log(err);
    }
    setShowDeletePopup(false);
    setDeleteTargetId(null);
  };

  const confirmRemoveBookmark = async () => {
    if (!removeBookmarkTargetId) return;
    try {
      await api.post(`/bookmark/${removeBookmarkTargetId}`);
      setMyBookmarks(myBookmarks.filter((resep) => resep.id !== removeBookmarkTargetId));
    } catch (err) {
      console.log(err);
    }
    setShowRemoveBookmarkPopup(false);
    setRemoveBookmarkTargetId(null);
  };

  if (!user) {
    return <h2>Loading...</h2>;
  }

  const renderModals = () => (
    <>
      <input ref={galleryInputRef} type="file" accept="image/*" hidden onChange={handleImageChange} />

      {showPhotoMenu && (
        <div style={styles.modalOverlay} onClick={() => setShowPhotoMenu(false)}>
          <div style={styles.photoMenu} onClick={(e) => e.stopPropagation()}>
            <div style={styles.photoTitle}>Kelola Foto Profil</div>
            <div style={styles.photoSubtitle}>Pilih tindakan yang ingin Anda lakukan</div>
            <div 
              style={{ 
                ...styles.photoAction, 
                border: hoverPhoto === "gallery" ? "2px solid #E46B3C" : "1px solid #e5e7eb", 
                background: hoverPhoto === "gallery" ? "#FFF7F3" : "#fff" 
              }} 
              onMouseEnter={() => setHoverPhoto("gallery")} 
              onMouseLeave={() => setHoverPhoto("")} 
              onClick={() => { 
                if (galleryInputRef.current) galleryInputRef.current.click();
                setShowPhotoMenu(false); 
              }}
            >
              <div style={styles.photoIcon}>
                <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#808080" }}>image</span>
              </div>
              <div style={styles.photoTextWrapper}>
                <div style={styles.photoMainText}>Ganti dari Galeri</div>
                <div style={styles.photoSubText}>Pilih foto dari galeri perangkat</div>
              </div>
            </div>
            {(profileImage || user?.foto) && (
              <div 
                style={{ 
                  ...styles.photoAction, 
                  border: hoverPhoto === "delete" ? "2px solid #dc2626" : "1px solid #e5e7eb", 
                  background: hoverPhoto === "delete" ? "#fff1f2" : "#fff" 
                }} 
                onMouseEnter={() => setHoverPhoto("delete")} 
                onMouseLeave={() => setHoverPhoto("")} 
                onClick={(e) => handleRemovePhoto(e)}
              >
                <div style={styles.photoIcon}>
                  <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#808080" }}>delete</span>
                </div>
                <div style={styles.photoTextWrapper}>
                  <div style={{ ...styles.photoMainText, color: "#000" }}>Hapus Foto</div>
                  <div style={styles.photoSubText}>Hapus foto profil saat ini</div>
                </div>
              </div>
            )}
            <div 
              style={{ 
                ...styles.cancelAction, 
                border: hoverPhoto === "cancel" ? "2px solid #E46B3C" : "2px solid transparent", 
                background: hoverPhoto === "cancel" ? "#FFF7F3" : "#f3f4f6" 
              }} 
              onMouseEnter={() => setHoverPhoto("cancel")} 
              onMouseLeave={() => setHoverPhoto("")} 
              onClick={() => setShowPhotoMenu(false)}
            >
              <div style={styles.photoIcon}>
                <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#808080" }}>close</span>
              </div>
              <div style={styles.photoTextWrapper}>
                <div style={styles.photoMainText}>Batal</div>
                <div style={styles.photoSubText}>Tutup menu</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLogoutPopup && (
        <div style={styles.modalOverlay} onClick={() => setShowLogoutPopup(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Konfirmasi Keluar</h3>
            <p style={styles.modalText}>Apakah Anda yakin ingin keluar dari akun ini?</p>
            <div style={styles.modalActions}>
              <button style={{ ...styles.btnCancel, backgroundColor: hoverCancelLogout ? "#cfcfcf" : "#ddd" }} onMouseEnter={() => setHoverCancelLogout(true)} onMouseLeave={() => setHoverCancelLogout(false)} onClick={() => setShowLogoutPopup(false)}>Batal</button>
              <button style={{ ...styles.btnConfirm, backgroundColor: hoverConfirmLogout ? "#a63800" : "#c54500" }} onMouseEnter={() => setHoverConfirmLogout(true)} onMouseLeave={() => setHoverConfirmLogout(false)} onClick={() => { localStorage.removeItem("token"); setShowLogoutPopup(false); navigate("/Masuk"); }}>Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}

      {showDeletePopup && (
        <div style={styles.modalOverlay} onClick={() => { setShowDeletePopup(false); setDeleteTargetId(null); }}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Hapus Resep</h3>
            <p style={styles.modalText}>Apakah Anda yakin ingin menghapus resep ini secara permanen?</p>
            <div style={styles.modalActions}>
              <button style={styles.btnCancel} onClick={() => { setShowDeletePopup(false); setDeleteTargetId(null); }}>Batal</button>
              <button style={styles.btnConfirm} onClick={confirmDeleteRecipe}>Hapus</button>
            </div>
          </div>
        </div>
      )}

      {showRemoveBookmarkPopup && (
        <div style={styles.modalOverlay} onClick={() => { setShowRemoveBookmarkPopup(false); setRemoveBookmarkTargetId(null); }}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Hapus Favorit</h3>
            <p style={styles.modalText}>Apakah Anda yakin ingin menghapus resep ini dari daftar favorit?</p>
            <div style={styles.modalActions}>
              <button style={styles.btnCancel} onClick={() => { setShowRemoveBookmarkPopup(false); setRemoveBookmarkTargetId(null); }}>Batal</button>
              <button style={styles.btnConfirm} onClick={confirmRemoveBookmark}>Hapus</button>
            </div>
          </div>
        </div>
      )}

      {showPasswordPopup && (
        <div style={styles.modalOverlay} onClick={() => setShowPasswordPopup(false)}>
          <div style={{ ...styles.modalBox, width: isMobile ? "90%" : "380px", padding: isMobile ? "20px" : "25px" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Ganti Password</h3>
            
            <div style={styles.passwordWrapper}>
              <input type={showOldPassword ? "text" : "password"} placeholder="Kata Sandi Lama" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} style={styles.passwordInput} />
              <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} style={styles.eyeButton} title={showOldPassword ? "Sembunyikan password" : "Tampilkan password"}>
                {showOldPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            
            <div style={styles.passwordWrapper}>
              <input type={showNewPassword ? "text" : "password"} placeholder="Kata Sandi Baru" minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={styles.passwordInput} />
              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} style={styles.eyeButton} title={showNewPassword ? "Sembunyikan password" : "Tampilkan password"}>
                {showNewPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            
            <div style={styles.passwordWrapper}>
              <input type={showConfirmPassword ? "text" : "password"} placeholder="Konfirmasi Kata Sandi Baru" minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={styles.passwordInput} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton} title={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}>
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            
            <div style={styles.buttonGroup}>
              <button style={styles.btnCancel} onClick={() => setShowPasswordPopup(false)}>Batal</button>
              <button style={styles.btnConfirm} onClick={handleChangePassword}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP BERHASIL UBAH KATA SANDI - WARNA HIJAU SUDAH DISERAGAMKAN MENJADI ORANGE */}
      {showSuccessPasswordPopup && (
        <div style={styles.modalOverlay} onClick={() => setShowSuccessPasswordPopup(false)}>
          <div style={{ ...styles.modalBox, width: isMobile ? "85%" : "360px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ margin: "10px auto 15px auto", width: "60px", height: "60px", borderRadius: "50%", background: "#FFF7F3", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "36px", color: "#c54500" }}>check_circle</span>
            </div>
            <h3 style={{ ...styles.modalTitle, color: "#c54500", marginBottom: "8px" }}>Berhasil!</h3>
            <p style={{ ...styles.modalText, margin: "0 0 20px 0", fontSize: "14px" }}>Kata sandi akun Anda telah sukses diperbarui.</p>
            <button 
              style={{ 
                ...styles.btnConfirm, 
                backgroundColor: hoverSuccessPassword ? "#a63800" : "#c54500", 
                color: "#fff", 
                width: "100%", 
                flex: "none", 
                padding: "12px" 
              }} 
              onMouseEnter={() => setHoverSuccessPassword(true)}
              onMouseLeave={() => setHoverSuccessPassword(false)}
              onClick={() => setShowSuccessPasswordPopup(false)}
            >
              Selesai
            </button>
          </div>
        </div>
      )}

      {/* POPUP BERHASIL UBAH NAMA - MODEL DISAMAKAN DENGAN POPUP LOGOUT */}
      {showSuccessNamePopup && (
        <div style={styles.modalOverlay} onClick={() => setShowSuccessNamePopup(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Nama Diperbarui!</h3>
            <p style={styles.modalText}>Nama profil Anda berhasil diubah menjadi <strong>{user?.nama}</strong>.</p>
            <div style={styles.modalActions}>
              <button 
                style={{ 
                  ...styles.btnConfirm, 
                  backgroundColor: hoverConfirmName ? "#a63800" : "#c54500",
                  width: "100%" 
                }} 
                onMouseEnter={() => setHoverConfirmName(true)} 
                onMouseLeave={() => setHoverConfirmName(false)} 
                onClick={() => setShowSuccessNamePopup(false)}
              >
                Oke, Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (isMobile) {
    return (
      <div style={styles.mobilePage}>
        <div style={styles.mobileHeader}>
          <span className="material-symbols-outlined" style={styles.mobileMenuIcon} onClick={() => setIsDrawerOpen(true)} title="Buka menu navigasi">menu</span>
        </div>

        {isDrawerOpen && (
          <div style={styles.drawerOverlay} onClick={() => setIsDrawerOpen(false)}>
            <div style={styles.drawerContainer} onClick={(e) => e.stopPropagation()}>
              <div style={styles.drawerHeader}>
                <div style={styles.logoContainer}>
                  <img src="/logo_X.png" alt="logo" style={styles.logoImg} />
                  <span style={styles.logoText}>pLorra</span>
                </div>
                <span className="material-symbols-outlined" style={{ cursor: "pointer", color: "#9C5B00" }} onClick={() => setIsDrawerOpen(false)} title="Tutup menu">close</span>
              </div>
              <div style={styles.drawerMenuContent}>
                <div style={styles.drawerMenuItem} onClick={() => { navigate("/dashboardafterlogin"); setIsDrawerOpen(false); }}>Home</div>
                <div style={{ ...styles.drawerMenuItem, ...styles.drawerMenuActive }} onClick={() => { setActiveTab("profil"); setIsDrawerOpen(false); }}>Profil</div>
                <div style={styles.drawerMenuItem} onClick={() => { navigate("/Notifikasi"); setIsDrawerOpen(false); }}>Notifikasi</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "profil" ? (
          <div style={styles.mobilePhotoSection}>
            <div style={styles.mobilePhotoWrapper}>
              {(profileImage || (user?.foto && user.foto !== "null")) ? (
                <img src={profileImage ? profileImage : `https://xplorra-production.up.railway.app/uploads/${user.foto}`} alt="" style={styles.mobilePhoto} />
              ) : (
                <span className="material-symbols-outlined" style={styles.mobilePhotoPlaceholder}>person</span>
              )}
              <div style={styles.mobileCameraBtnAbsolute} onClick={() => setShowPhotoMenu(true)} title="Ubah foto profil">
                <span className="material-symbols-outlined" style={{ color:"#fff", fontSize:"18px" }}>photo_camera</span>
              </div>
            </div>

            <h1 style={styles.mobileName}>{user.nama}</h1>

            <div style={styles.mobileMenuCard}>
              <div style={styles.mobileMenuItemList} onClick={() => setActiveTab("resep")}>
                <div style={styles.mobileMenuLeft}>
                  <span className="material-symbols-outlined" style={styles.mobileMenuItemIcon}>menu_book</span>
                  <span style={styles.mobileMenuText}>Resep Saya</span>
                </div>
                <span className="material-symbols-outlined" style={styles.mobileArrow}>chevron_right</span>
              </div>
              <div style={styles.mobileDivider}></div>
              <div style={styles.mobileMenuItemList} onClick={() => setActiveTab("favorit")}>
                <div style={styles.mobileMenuLeft}>
                  <span className="material-symbols-outlined" style={styles.mobileMenuItemIcon}>bookmark</span>
                  <span style={styles.mobileMenuText}>Resep yang Disimpan</span>
                </div>
                <span className="material-symbols-outlined" style={styles.mobileArrow}>chevron_right</span>
              </div>
            </div>

            <div style={styles.mobileFormSection}>
              <div style={styles.mobileLabel}>NAMA</div>
              <div style={styles.mobileInputBox}>
                <input type="text" value={isEditingName ? newName : user?.nama} onChange={(e) => setNewName(e.target.value)} readOnly={!isEditingName} style={styles.mobileInput} />
                <span className="material-symbols-outlined" style={styles.mobileEditIcon} title={isEditingName ? "Simpan nama" : "Ubah nama"} onClick={() => { if (isEditingName) { handleUpdateName(); } else { setNewName(user.nama); setIsEditingName(true); } }}>
                  {isEditingName ? "check" : "edit"}
                </span>
              </div>

              <div style={{ ...styles.mobileLabel, marginTop: "20px" }}>ALAMAT EMAIL</div>
              <div style={styles.mobileInputBox}>
                <input type="text" value={user.email} readOnly style={styles.mobileInput} />
              </div>

              <div style={styles.mobileSecuritySection}>
                <div style={styles.mobileSecurityTitle}>
                  <span className="material-symbols-outlined" style={styles.mobileShieldIcon}>shield</span>
                  <span>KEAMANAN AKUN</span>
                </div>
                <div style={styles.mobileSecurityCard}>
                  <div style={styles.mobilePasswordContainer}>
                    <div style={styles.mobilePasswordLabel}>Perbarui kata sandi</div>
                    <div style={styles.mobilePasswordDots}>•••••••••••</div>
                  </div>
                  <button style={styles.mobileChangePasswordBtn} onClick={() => { setShowPasswordPopup(true); setIsDrawerOpen(false); }} title="Ganti password">Ganti</button>
                </div>
              </div>

              <div style={styles.mobileLogoutSection}>
                <button style={styles.mobileLogoutBtn} onClick={() => setShowLogoutPopup(true)} title="Keluar akun">
                  <span className="material-symbols-outlined" style={styles.mobileLogoutIcon}>logout</span>Keluar
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === "resep" ? (
          <div style={styles.mobileListContainer}>
            <h1 style={styles.mobileSectionTitle}>Resep Saya</h1>
            
            <div style={styles.mobileSubMenuNavigationCard}>
              <div style={styles.mobileSubMenuItem} onClick={() => setActiveTab("profil")}>
                <div style={styles.mobileMenuLeft}>
                  <span className="material-symbols-outlined" style={styles.mobileMenuItemIcon}>person</span>
                  <span style={styles.mobileMenuText}>Kembali ke Profil</span>
                </div>
                <span className="material-symbols-outlined" style={styles.mobileArrow}>chevron_right</span>
              </div>
              <div style={styles.mobileDivider}></div>
              <div style={styles.mobileSubMenuItem} onClick={() => setActiveTab("favorit")}>
                <div style={styles.mobileMenuLeft}>
                  <span className="material-symbols-outlined" style={styles.mobileMenuItemIcon}>bookmark</span>
                  <span style={styles.mobileMenuText}>Resep yang Disimpan</span>
                </div>
                <span className="material-symbols-outlined" style={styles.mobileArrow}>chevron_right</span>
              </div>
            </div>

            <div style={styles.mobileAddRecipeCard} onClick={() => navigate("/tambah")}>
              <div style={styles.mobileAddIconCircle}>
                <span className="material-symbols-outlined">add</span>
              </div>
              <h3 style={styles.mobileAddCardTitle}>Tambah Resep</h3>
              <p style={styles.mobileAddCardDesc}>Bagikan rahasia dapur keluarga anda ke nusantara</p>
            </div>

            <div style={styles.mobileRecipesGrid}>
              {myRecipes.map((item) => (
                <div key={item.id} style={styles.mobileRecipeCardItem} onClick={() => navigate(`/detail/${item.id}`)}>
                  <div style={styles.cardImgWrapper}>
                    <img src={`https://xplorra-production.up.railway.app/uploads/${item.gambar}`} style={styles.mobileCardImg} alt={item.nama} />
                    <div style={styles.mobileFloatingActionGroup}>
                      <button style={styles.mobileActionRoundBtn} title="Edit Resep" onClick={(e) => { e.stopPropagation(); navigate(`/edit/${item.id}`); }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "15px", color: "#E46B3C" }}>edit</span>
                      </button>
                      <button style={styles.mobileActionRoundBtn} title="Hapus Resep" onClick={(e) => { e.stopPropagation(); setDeleteTargetId(item.id); setShowDeletePopup(true); }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "15px", color: "#dc2626" }}>delete</span>
                      </button>
                    </div>
                  </div>
                  <div style={styles.mobileCardBody}>
                    <h4 style={styles.mobileCardTitle}>{item.nama}</h4>
                    <div style={styles.infoRow}>
                      <span style={styles.iconText}><span className="material-symbols-outlined" style={styles.mobileMaterialIcon}>comment</span>{item.total_komentar}</span>
                      <span style={styles.iconText}><span className="material-symbols-outlined" style={styles.mobileMaterialIcon}>thumb_up</span>{item.likes}</span>
                    </div>
                    <div style={styles.mobileBottomRowStyle}>
                      <span style={styles.mobileRating}>
                        <span style={styles.mobileRatingNumber}>{item.rating}</span>
                        <span className="material-symbols-outlined" style={styles.mobileStar}>star</span>
                      </span>
                      <button style={styles.mobileBtnLihatStyle} onClick={(e) => { e.stopPropagation(); navigate(`/detail/${item.id}`); }}>Lihat</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={styles.mobileListContainer}>
            <h1 style={styles.mobileSectionTitle}>Resep Tersimpan</h1>
            
            <div style={styles.mobileSubMenuNavigationCard}>
              <div style={styles.mobileSubMenuItem} onClick={() => setActiveTab("profil")}>
                <div style={styles.mobileMenuLeft}>
                  <span className="material-symbols-outlined" style={styles.mobileMenuItemIcon}>person</span>
                  <span style={styles.mobileMenuText}>Kembali ke Profil</span>
                </div>
                <span className="material-symbols-outlined" style={styles.mobileArrow}>chevron_right</span>
              </div>
              <div style={styles.mobileDivider}></div>
              <div style={styles.mobileSubMenuItem} onClick={() => setActiveTab("resep")}>
                <div style={styles.mobileMenuLeft}>
                  <span className="material-symbols-outlined" style={styles.mobileMenuItemIcon}>menu_book</span>
                  <span style={styles.mobileMenuText}>Resep Saya</span>
                </div>
                <span className="material-symbols-outlined" style={styles.mobileArrow}>chevron_right</span>
              </div>
            </div>

            <div style={styles.mobileAddRecipeCard} onClick={() => navigate("/dashboardafterlogin")}>
              <div style={styles.mobileAddIconCircle}>
                <span className="material-symbols-outlined">explore</span>
              </div>
              <h3 style={styles.mobileAddCardTitle}>Eksplorasi Resep</h3>
              <p style={styles.mobileAddCardDesc}>Jelajahi resep lainnya untuk disimpan di sini.</p>
            </div>

            <div style={styles.mobileRecipesGrid}>
              {myBookmarks.map((item) => (
                <div key={item.id} style={styles.mobileRecipeCardItem} onClick={() => navigate(`/detail/${item.id}`)}>
                  <div style={styles.cardImgWrapper}>
                    <img src={`https://xplorra-production.up.railway.app/uploads/${item.gambar}`} style={styles.mobileCardImg} alt="" />
                    <button style={styles.mobileBookmarkBtn} title="Hapus dari Favorit" onClick={(e) => { e.stopPropagation(); setRemoveBookmarkTargetId(item.id); setShowRemoveBookmarkPopup(true); }}>
                      <span className="material-symbols-outlined" style={styles.mobileBookmarkActive}>bookmark</span>
                    </button>
                  </div>
                  <div style={styles.mobileCardBody}>
                    <h4 style={styles.mobileCardTitle}>{item.nama}</h4>
                    <div style={styles.infoRow}>
                      <span style={styles.iconText}><span className="material-symbols-outlined" style={styles.mobileMaterialIcon}>comment</span>{item.total_komentar}</span>
                      <span style={styles.iconText}><span className="material-symbols-outlined" style={styles.mobileMaterialIcon}>thumb_up</span>{item.likes}</span>
                    </div>
                    <div style={styles.mobileBottomRowStyle}>
                      <span style={styles.mobileRating}>
                        <span style={styles.mobileRatingNumber}>{item.rating}</span>
                        <span className="material-symbols-outlined" style={styles.mobileStar}>star</span>
                      </span>
                      <button style={styles.mobileBtnLihatStyle} onClick={(e) => { e.stopPropagation(); navigate(`/detail/${item.id}`); }}>Lihat</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {renderModals()}
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <div style={styles.logoContainer}>
          <img src="/logo_X.png" alt="logo" style={styles.logoImg} />
          <span style={styles.logoText}>pLorra</span>
        </div>
        <div style={styles.menu}>
          <span onClick={() => navigate("/dashboardafterlogin")} style={{ cursor: "pointer" }}>Home</span>
          <span style={styles.active}>Profil</span>
          <span onClick={() => navigate("/Notifikasi")} style={{ cursor: "pointer" }}>Notifikasi</span>
        </div>
        <div style={styles.rightMenu}></div>
      </div>

      <div style={styles.container}>
        <div style={styles.leftSection}>
          <div style={styles.sidebar}>
            <h2 style={styles.sidebarTitle}>CHEF NUSANTARA</h2>
            <div style={activeTab === "profil" ? { ...styles.sidebarMenu, ...styles.activeMenu } : styles.sidebarMenu} onClick={()=>setActiveTab("profil")}>
              <div style={styles.menuLeft}>
                <span className="material-symbols-outlined" style={styles.menuIcon}>person</span>Profil
              </div>
            </div>
            <div style={styles.line}></div>
            <div style={activeTab === "resep" ? { ...styles.sidebarMenu, ...styles.activeMenu } : styles.sidebarMenu} onClick={() => setActiveTab("resep")}>
              <div style={styles.menuLeft}>
                <span className="material-symbols-outlined" style={styles.menuIcon}>menu_book</span>Resep Saya
              </div>
            </div>
            <div style={styles.line}></div>
            <div style={activeTab === "favorit" ? { ...styles.sidebarMenu, ...styles.activeMenu } : styles.sidebarMenu} onClick={() => setActiveTab("favorit")}>
              <div style={styles.menuLeft}>
                <span className="material-symbols-outlined" style={styles.menuIcon}>bookmark</span>Resep Tersimpan
              </div>
            </div>
            {activeTab === "favorit" && (
              <div style={styles.savedRecipeCard} onClick={() => navigate("/dashboardafterlogin")}>
                <div style={styles.savedRecipeIcon}>
                  <span className="material-symbols-outlined" style={styles.savedRecipeMaterial}>explore</span>
                </div>
                <p style={styles.savedRecipeText}>Jelajahi resep lainnya untuk disimpan di sini.</p>
              </div>
            )} 
            <div style={styles.line}></div>
          </div>

          {activeTab === "resep" && (
            <div style={styles.addRecipeCard} onClick={() => navigate("/tambah")}>
              <div style={styles.addIcon}>
                <span className="material-symbols-outlined">add</span>
              </div>
              <h3 style={styles.addTitle}>Tambah Resep</h3>
              <p style={styles.addDesc}>Bagikan rahasia dapur keluarga Anda ke seluruh nusantara</p>
            </div>
          )}
        </div>

        {activeTab === "profil" && (
          <div style={styles.profileModern}>      
            <div style={styles.profileBanner}></div>
            <div style={styles.profilePhotoWrapper}>
              {(profileImage || (user?.foto && user.foto !== "null")) ? (
                <img src={profileImage ? profileImage : `https://xplorra-production.up.railway.app/uploads/${user.foto}`} alt="profile" style={styles.profilePhoto} />
              ) : (
                <span className="material-symbols-outlined" style={styles.profilePlaceholder}>person</span>
              )}
              <div style={styles.cameraBtn} onClick={() => setShowPhotoMenu(true)} title="Ubah foto profil">
                <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#fff" }}>photo_camera</span>
              </div>
            </div>

            <div style={styles.profileContent}>
              <div style={styles.inputRow}>
                <div style={styles.inputGroupModern}>
                  <label style={styles.labelModern}>NAMA</label>
                  <div style={styles.inputModern}>
                    {isEditingName ? (
                      <>
                        <input value={newName} onChange={(e)=>setNewName(e.target.value)} style={styles.nameInput} />
                        <span className="material-symbols-outlined" style={{ ...styles.editPencil, color:"green" }} onClick={handleUpdateName} title="Simpan">check</span>
                        <span className="material-symbols-outlined" style={{ ...styles.editPencil, marginLeft:"8px", color:"red" }} onClick={()=>{ setIsEditingName(false); setNewName(user.nama); }} title="Batal">close</span>
                      </>
                    ) : (
                      <>
                        {user.nama}
                        <span className="material-symbols-outlined" style={styles.editPencil} onClick={()=>{ setNewName(user.nama); setIsEditingName(true); }} title="Ubah Nama">edit</span>
                      </>
                    )}
                  </div>
                </div>
                <div style={styles.inputGroupModern}>
                  <label style={styles.labelModern}>ALAMAT EMAIL</label>
                  <div style={styles.inputModern}>{user.email}</div>
                </div>
              </div>

              <div style={styles.securityTitle}>KEAMANAN AKUN</div>
              <div style={styles.passwordCard}>
                <div style={styles.passwordLeft}>
                  <span className="material-symbols-outlined" style={styles.lockIcon}>lock</span>
                  <div>
                    <div style={styles.passwordLabel}>Kata Sandi</div>
                    <div style={styles.passwordDots}>••••••••••••</div>
                  </div>
                </div>
                <button
                  style={{
                    ...styles.menuButton,
                    backgroundColor: hoverPassword ? "#f3f4f6" : "#fff",
                    transform: hoverPassword ? "translateY(-2px)" : "translateY(0)",
                    boxShadow: hoverPassword ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={() => setHoverPassword(true)}
                  onMouseLeave={() => setHoverPassword(false)}
                  onClick={() => setShowPasswordPopup(true)}
                  title="Ganti kata sandi"
                >
                  Perbarui Kata Sandi
                </button>
              </div>

              <div style={styles.separator}></div>
              <div style={styles.logoutWrapper}>
                <button
                  style={{
                    ...styles.logoutButton,
                    transform: hoverLogout ? "translateY(-2px)" : "translateY(0)",
                    boxShadow: hoverLogout ? "0 4px 12px rgba(220,38,38,0.25)" : "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={() => setHoverLogout(true)}
                  onMouseLeave={() => setHoverLogout(false)}
                  onClick={() => setShowLogoutPopup(true)}
                  title="Keluar dari akun"
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>
        )}

        {(activeTab === "resep" || activeTab === "favorit") && (
          <div style={styles.rightSection}>
            <h1 style={styles.pageTitle}>{activeTab === "resep" ? "Resep Saya" : "Resep Tersimpan"}</h1>
            <div style={styles.recipeContainer}>
              {(activeTab === "resep" ? myRecipes : myBookmarks).length === 0 ? (
                <div style={styles.emptyContainer}>
                  <span className="material-symbols-outlined" style={styles.emptyIcon}>
                    {activeTab === "resep" ? "restaurant" : "bookmark"}
                  </span>
                  <p>{activeTab === "resep" ? "Belum ada resep yang dibuat" : "Belum ada resep favorit"}</p>
                </div>
              ) : (
                <div style={styles.recipeGrid}>
                  {(activeTab === "resep" ? myRecipes : myBookmarks).map((item) => (
                    <div key={item.id} style={styles.card} onClick={() => navigate(`/detail/${item.id}`)}>
                      <div style={styles.cardImgWrapper}>
                        <img src={`https://xplorra-production.up.railway.app/uploads/${item.gambar}`} style={styles.cardImg} alt={item.nama} />
                        
                        {activeTab === "resep" ? (
                          <div style={styles.desktopFloatingActionGroup}>
                            <button style={styles.desktopActionRoundBtn} title="Edit Resep" onClick={(e) => { e.stopPropagation(); navigate(`/edit/${item.id}`); }}>
                              <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#E46B3C" }}>edit</span>
                            </button>
                            <button style={styles.desktopActionRoundBtn} title="Hapus Resep" onClick={(e) => { e.stopPropagation(); setDeleteTargetId(item.id); setShowDeletePopup(true); }}>
                              <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#dc2626" }}>delete</span>
                            </button>
                          </div>
                        ) : (
                          <button style={styles.bookmarkBtn} title="Hapus dari Favorit" onClick={(e) => { e.stopPropagation(); setRemoveBookmarkTargetId(item.id); setShowRemoveBookmarkPopup(true); }}>
                            <span className="material-symbols-outlined" style={styles.bookmarkActive}>bookmark</span>
                          </button>
                        )}
                      </div>
                      <div style={styles.cardBody}>
                        <h4 style={styles.cardTitle}>{item.nama}</h4>
                        <div style={styles.infoRow}>
                          <span style={styles.iconText}><span className="material-symbols-outlined" style={styles.materialIcon}>comment</span>{item.total_komentar}</span>
                          <span style={styles.iconText}><span className="material-symbols-outlined" style={styles.materialIcon}>thumb_up</span>{item.likes}</span>
                        </div>
                        <div style={styles.bottomRow}>
                          <span style={styles.rating}>
                            <span style={styles.ratingNumber}>{item.rating}</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className="material-symbols-outlined" style={star <= Math.round(item.rating) ? styles.star : styles.starEmpty}>star</span>
                            ))}
                          </span>
                          <button style={styles.btnLihat} onClick={(e) => { e.stopPropagation(); navigate(`/detail/${item.id}`); }}>Lihat</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {renderModals()}
    </div>
  );
}

const styles = {
  page:{ minHeight:"100vh",backgroundImage: `linear-gradient(to bottom, rgba(180, 113, 71, 0.9), rgba(245,236,222,0.0)), url('/map.png')`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",paddingTop:"40px",},
  navbar: {display: "flex",justifyContent: "space-between",alignItems: "center", padding: "15px 15px", background: "#fff", position: "fixed", top: 0,  left: 0,  right: 0,  zIndex: 9999, },
  emptyContainer: { width: "100%", minHeight: "350px", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", color: "#c46a3d", fontSize: "22px",fontWeight: "700", textAlign: "center",},
  emptyIcon: {fontSize: "70px",marginBottom: "15px", color: "#e46b3c" },
  logoContainer: { display: "flex",alignItems: "center", gap: "1px" },
  logoImg: { width: "40px" },
  logoText: {color: "#F28C28",fontWeight: "bold",fontSize: "24px",letterSpacing: "1px",},
  menu: { display: "flex",gap: "30px",fontSize: "18px",fontWeight: "700",},
  active: {color: "#F28C28",fontWeight: "bold",},
  container: { display:"flex",gap:"90px",alignItems:"flex-start",justifyContent:"center",marginTop:"120px",},
  sidebar:{ width:"290px", background:"#fff", borderRadius:"12px", padding:"22px",boxShadow:"0 4px 15px rgba(0,0,0,0.12)", height:"300px", marginTop:"0px",},
  sidebarMenu:{ display:"flex",alignItems:"center", padding:"10px 14px", marginBottom:"6px", cursor:"pointer", borderRadius:"8px",fontSize:"16px", },
  activeMenu:{ background:"#d96a4f", color:"#fff",},
  line: { width: "100%", height: "1px",background: "#ddd", margin: "2px 0 8px", },
  card: { background: "#ffffff", borderRadius: "18px", overflow: "hidden", boxShadow: "0 8px 20px rgba(0,0,0,0.08)", width: "100%", maxWidth: "240px", display: "flex", flexDirection: "column" },
  cardImg: { width: "100%", height: "130px", objectFit: "cover", },
  cardImgWrapper: { position: "relative", },
  cardBody: { padding: "12px 14px", display: "flex", flexDirection: "column", flexGrow: 1, gap: "6px" },
  cardTitle: { fontSize: "15px", fontWeight: "700", margin: "0", lineHeight: "1.3", color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  infoRow: { display: "flex", gap: "12px", fontSize: "12px", color: "#666", margin: "0" },
  bottomRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px", width: "100%" },
  iconText: { display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#555", fontWeight: "600", },
  materialIcon: { fontSize: "16px", color: "#888" },
  rating: { display: "flex", alignItems: "center", gap: "1px" },
  star: { fontSize: "16px", color: "#FFC107", },
  starEmpty: { fontSize: "16px", color: "#ddd", },
  btnLihat: { background: "#d86936", color: "#fff", border: "none", padding: "6px 16px", borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontWeight: "700" },
  bookmarkBtn: { position: "absolute", top: "10px", right: "10px", width: "34px", height: "34px", borderRadius: "50%", border: "none", background: "#fff", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", },
  bookmarkActive: { fontSize: "20px", color: "#E46B3C", fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24", },
  ratingNumber: { fontWeight: "700", fontSize: "13px", color: "#333", marginRight: "2px", },
  recipeContainer:{ width:"820px", minHeight:"450px", display:"flex", flexDirection: "column", padding:"25px", background:"#f8efe8", borderRadius:"25px", boxSizing: "border-box" },
  recipeGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", width: "100%" },
  profileModern:{ width:"700px", background:"#fff", borderRadius:"10px", overflow:"hidden", boxShadow:"0 4px 15px rgba(0,0,0,0.15)", position:"relative", },
  profileBanner:{ height:"120px", background:"linear-gradient(90deg,#B26D00,#E2856E)", },
  profilePhotoWrapper:{ position:"absolute", top:"70px", left:"30px", zIndex:"10", },
  profileContent:{ padding:"55px 30px 30px", },
  inputRow:{ display:"flex", gap:"20px", marginTop:"10px", },
  inputGroupModern:{ flex:1, },
  labelModern:{ display:"block", marginBottom:"10px", color:"#8d7a68", fontSize:"12px", fontWeight:"600", letterSpacing:"1px", },
  inputModern:{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", boxSizing: "border-box", height: "42px", border: "1px solid #ead3c3", borderRadius: "8px", padding: "0 14px", fontSize: "14px", background: "#fffaf8", color: "#333", },
  editPencil:{ color:"#d4b6a4", fontSize:"20px", cursor: "pointer", },
  securityTitle:{ marginTop:"25px", color:"#8d7a68", fontSize:"12px", fontWeight:"600", letterSpacing:"1px", },
  passwordCard:{ border:"1px solid #ead3c3", borderRadius:"8px", padding:"16px", display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"12px", },
  passwordLeft:{ display:"flex", gap:"15px", alignItems:"center", },
  lockIcon:{ color:"#a66b09", fontSize:"28px", },
  passwordLabel:{ fontWeight:"500", },
  passwordDots:{ color:"#c6b3a8", letterSpacing:"3px", },
  separator:{ height:"1px", background:"#eee", marginTop:"25px", },
  logoutWrapper:{ display:"flex", justifyContent:"flex-end", marginTop:"30px", },
  sidebarTitle:{ fontSize:"26px", fontWeight:"700", color:"#9c5b00", marginBottom:"22px", },
  menuLeft:{ display:"flex", alignItems:"center", gap:"10px", },
  menuIcon:{ fontSize:"20px", },
  addRecipeCard:{ width:"290px", background:"#fff", borderRadius:"14px", padding:"25px 20px", marginTop:"25px", textAlign:"center", cursor:"pointer", boxShadow:"0 4px 12px rgba(0,0,0,0.08)", },
  addIcon:{ width:"50px", height:"50px", margin:"0 auto 15px", borderRadius:"50%", background:"#f2e5dd", display:"flex", justifyContent:"center", alignItems:"center", color:"#6d5545", },
  addTitle:{ fontSize:"18px", fontWeight:"700", color:"#4d4037", marginBottom:"10px", },
  addDesc:{ fontSize:"14px", color:"#999", lineHeight:"1.6", },
  leftSection:{ display:"flex", flexDirection:"column", width:"290px", },
  rightSection:{ display:"flex", flexDirection:"column", },
  pageTitle:{ fontSize:"42px", fontWeight:"700", color:"#1f1a17", textShadow:"0 2px 8px rgba(255,255,255,0.9)", marginBottom:"25px", marginTop:"-15px", },
  savedRecipeCard:{ width:"330px", height:"220px", background:"#fff", borderRadius:"14px", marginTop:"120px", marginLeft:"-18px", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", boxShadow:"0 4px 12px rgba(0,0,0,0.08)", },
  savedRecipeIcon:{ width:"52px", height:"52px", borderRadius:"50%", background:"#f2e5dd", display:"flex", justifyContent:"center", alignItems:"center", color:"#9d8878", marginBottom:"18px", },
  savedRecipeMaterial:{ fontSize:"26px", },
  savedRecipeText:{ width:"140px", color:"#a08b7c", fontSize:"15px", fontWeight:"500", lineHeight:"1.6", margin:0, },
  profilePhoto: { width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover", border: "4px solid #fff", background: "#ddd", },
  profilePlaceholder: { width: "90px", height: "90px", borderRadius: "50%", background: "#ddd", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "50px", },
  cameraBtn:{ position:"absolute", right:"-5px", bottom:"0px", width:"28px", height:"28px", borderRadius:"50%", background:"#b77700", display:"flex", justifyContent:"center", alignItems:"center", cursor:"pointer", border:"2px solid white", },
  photoMenu: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#fff", borderRadius: "20px", padding: "24px", width: "90%", maxWidth: "420px", zIndex: "99999", border: "2px solid #E46B3C", boxShadow: `0 10px 30px rgba(0,0,0,0.15), 0 0 15px rgba(228,107,60,0.25)`, boxSizing: "border-box" },
  photoTitle: { fontSize: "26px", fontWeight: "700", color: "#1f2937", marginBottom: "8px", },
  photoSubtitle: { fontSize: "14px", color: "#6b7280", marginBottom: "20px", },
  photoAction: { display: "flex", alignItems: "center", gap: "16px", padding: "14px", border: "1px solid #e5e7eb", borderRadius: "16px", cursor: "pointer", marginBottom: "12px", transition: "all 0.25s ease", },
  photoIcon: { width: "46px", height: "46px", borderRadius: "50%", background: "#fff", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", flexShrink: 0, },
  photoTextWrapper: { flex: 1, },
  photoMainText: { fontSize: "15px", fontWeight: "700", color: "#111827", },
  photoSubText: { fontSize: "13px", color: "#6b7280", marginTop: "2px", },
  cancelAction: { display: "flex", alignItems: "center", gap: "16px", padding: "14px", borderRadius: "16px", background: "#f3f4f6", cursor: "pointer", marginTop: "10px", },
  modalBox: { background: "#fff", padding: "25px", borderRadius: "16px", width: "95%", maxWidth: "380px", textAlign: "center", boxShadow: "0 5px 20px rgba(0,0,0,0.2)", boxSizing: "border-box" },  
  modalTitle: { fontSize: "20px", fontWeight: "700", margin: "0 0 15px 0" },
  modalText:{ color:"#666", marginBottom:"20px", fontSize: "15px" },
  modalActions:{ display:"flex", justifyContent:"center", gap:"12px", width: "100%" },
  btnCancel:{ padding:"10px 20px", border:"none", borderRadius:"8px", background:"#dddddd", cursor:"pointer", flex: 1, fontWeight: "600" },
  btnConfirm:{ padding:"10px 20px", border:"none", borderRadius:"8px", background:"#c54500", color:"#fff", cursor:"pointer", flex: 1, fontWeight: "600" },
  nameInput:{ border:"none", outline:"none", background:"transparent", width:"100%", fontSize:"14px", },
  
  passwordWrapper: { position: "relative", width: "100%", marginBottom: "16px", display: "flex", alignItems: "center" },
  passwordInput: { width: "100%", padding: "14px 45px 14px 14px", border: "1px solid #ddd", borderRadius: "10px", boxSizing: "border-box", outline: "none", fontSize: "15px" },
  eyeButton: { position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#666", display: "flex", alignItems: "center", padding: 0, zIndex: 10 },
  
  buttonGroup: { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px", width: "100%" },
  menuButton: { border: "1px solid #ddd", background: "#fff", padding: "10px 18px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", },
  logoutButton: { background: "#c54500", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", },
  
  desktopFloatingActionGroup: { position: "absolute", top: "10px", right: "10px", display: "flex", gap: "6px", zIndex: 10 },
  desktopActionRoundBtn: { width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(255, 255, 255, 0.95)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" },

  /* MOBILE LAYOUT STRUCTURE */
  mobilePage:{ minHeight:"100vh", background:"#FBF8F4", paddingBottom: "40px", width: "100%", overflowX: "hidden" },
  mobileHeader:{ height:"54px", background:"#fff", display:"flex", alignItems:"center", padding:"0 20px", boxShadow:"0 3px 12px rgba(0,0,0,.08)", position:"sticky", top:0, zIndex: 100 },
  mobileMenuIcon:{ fontSize:"26px", color:"#9C5B00", cursor:"pointer", },
  mobilePhotoSection:{ display:"flex", flexDirection:"column", alignItems:"center", marginTop:"25px", padding: "0 20px" },
  mobilePhotoWrapper:{ position:"relative", display: "inline-block" },
  mobilePhoto:{ width:"130px", height:"130px", borderRadius:"50%", objectFit:"cover", border:"5px solid #fff", boxShadow:"0 4px 12px rgba(0,0,0,.12)", },
  mobilePhotoPlaceholder:{ width:"130px", height:"130px", borderRadius:"50%", background:"#ddd", display:"flex", justifyContent:"center", alignItems:"center", fontSize:"60px", },
  mobileName:{ marginTop:"18px", fontSize:"26px", fontWeight:"700", color:"#222", marginBottom:"-5px", textAlign: "center" },
  mobileMenuCard:{ marginTop:"30px", background:"#fff", borderRadius:"15px", border:"1px solid #EAD5C6", overflow:"hidden", boxShadow:"0 4px 12px rgba(0,0,0,.05)", width: "100%", maxWidth: "360px" },
  mobileMenuItemList:{ height:"60px", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0 20px", cursor:"pointer", },
  mobileMenuLeft:{ display:"flex", alignItems:"center", gap:"15px", },
  mobileMenuItemIcon:{ fontSize:"24px", color:"#5A4A3F", },
  mobileMenuText:{ fontSize:"16px", fontWeight:"600", color:"#5A4A3F", },
  mobileArrow:{ fontSize:"24px", color:"#5A4A3F", },
  mobileDivider:{ height:"1px", background:"#EFE5DC", margin:"0 20px", },
  mobileFormSection:{ marginTop:"28px", width:"100%", display: "flex", flexDirection:"column", alignItems: "center" },
  mobileLabel: { color: "#706156", fontSize: "14px", fontWeight: "600", letterSpacing: "0.5px", marginBottom: "8px", alignSelf: "flex-start", maxWidth: "360px", width: "100%", margin: "0 auto 8px auto" },
  mobileInputBox: { width: "100%", maxWidth: "360px", height: "50px", background: "#F5EFE9", border: "1px solid #ab8262", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", boxSizing: "border-box", marginBottom: "15px" },
  mobileInput: { flex: 1, border: "none", outline: "none", background: "transparent", color: "#2E2E2E", fontSize: "16px", fontWeight: "500", },
  mobileEditIcon: { color: "#B46B0D", fontSize: "20px", cursor: "pointer", },
  mobileSecuritySection:{ marginTop:"20px", width: "100%", maxWidth: "360px" },
  mobileSecurityTitle:{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px", color:"#5A4A3F", fontSize:"16px", fontWeight:"600", },
  mobileShieldIcon:{ fontSize:"24px", color:"#5A4A3F", },
  mobileSecurityCard:{ width:"100%", height:"90px", background:"#F5EFE9", border:"1px solid #D9C2B0", borderRadius:"10px", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0 18px", boxSizing:"border-box", },
  mobilePasswordContainer:{ display:"flex", flexDirection:"column", justifyContent:"center", },
  mobilePasswordLabel:{ color:"#8A7565", fontSize:"14px", fontWeight:"500", marginBottom:"4px", },
  mobilePasswordDots:{ fontSize:"18px", fontWeight:"700", letterSpacing:"3px", color:"#222", },
  mobileChangePasswordBtn:{ width:"80px", height:"38px", background:"#FFFFFF", border:"2px solid #C65A00", borderRadius:"24px", color:"#C65A00", fontSize:"14px", fontWeight:"700", cursor:"pointer", },
  mobileLogoutSection:{ marginTop:"30px", width: "100%", maxWidth: "360px" },
  mobileLogoutBtn:{ width:"100%", height:"50px", background:"#925b03", border:"none", borderRadius:"32px", display:"flex", justifyContent:"center", alignItems:"center", gap:"12px", color:"#fff", fontSize:"18px", fontWeight:"600", cursor:"pointer", },
  mobileLogoutIcon:{ fontSize:"24px", color:"#fff", },
  mobileListContainer: { padding: "20px 14px", display: "flex", flexDirection: "column", alignItems: "center", width: "100%", boxSizing: "border-box" },
  mobileSectionTitle: { fontSize: "28px", fontWeight: "700", color: "#1f1a17", alignSelf: "flex-start", marginBottom: "16px" },
  mobileSubMenuNavigationCard: { background: "#fff", borderRadius: "15px", border: "1px solid #EAD5C6", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,.05)", width: "100%", maxWidth: "400px", marginBottom: "20px" },
  mobileSubMenuItem: { height: "50px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px", cursor: "pointer" },
  mobileAddRecipeCard: { width: "100%", maxWidth: "400px", background: "#fff", borderRadius: "15px", padding: "20px 16px", border: "2px dashed #ab8262", textAlign: "center", cursor: "pointer", marginBottom: "20px", boxSizing: "border-box" },
  mobileAddIconCircle: { width: "46px", height: "46px", margin: "0 auto 10px", borderRadius: "50%", background: "#f2e5dd", display: "flex", justifyContent: "center", alignItems: "center", color: "#6d5545" },
  mobileAddCardTitle: { fontSize: "16px", fontWeight: "700", color: "#4d4037", margin: "0 0 4px 0" },
  mobileAddCardDesc: { fontSize: "12px", color: "#999", margin: 0, lineHeight: "1.4" },
  
  mobileRecipesGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", width: "100%", maxWidth: "400px" },
  mobileRecipeCardItem: { background: "#fff", borderRadius: "14px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", width: "100%" },
  mobileCardImg: { width: "100%", height: "105px", objectFit: "cover" },
  mobileCardBody: { padding: "8px 10px", display: "flex", flexDirection: "column", gap: "4px" },
  mobileCardTitle: { fontSize: "13px", fontWeight: "700", margin: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#111" },
  mobileMaterialIcon: { fontSize: "14px", color: "#888" },
  mobileStar: { fontSize: "14px", color: "#FFC107" },
  mobileRating: { display: "flex", alignItems: "center", gap: "2px" },
  mobileRatingNumber: { fontSize: "11px", fontWeight: "700", color: "#333" },

  drawerOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", zIndex: 10000 },
  drawerContainer: { position: "fixed", top: 0, left: 0, bottom: 0, width: "280px", background: "#fff", zIndex: 10001, padding: "20px", display: "flex", flexDirection: "column", boxShadow: "4px 0 15px rgba(0,0,0,0.1)", boxSizing: "border-box" },
  drawerHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "1px solid #eee", paddingBottom: "15px" },
  drawerMenuContent: { display: "flex", flexDirection: "column", gap: "15px" },
  drawerMenuItem: { fontSize: "18px", fontWeight: "600", color: "#5A4A3F", padding: "10px 15px", borderRadius: "8px", cursor: "pointer" },
  drawerMenuActive: { background: "#F5EFE9", color: "#F28C28" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(5px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999, },

  mobileCameraBtnAbsolute: { position: "absolute", bottom: "5px", right: "5px", width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#b77700", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", cursor: "pointer", zIndex: 5 },
  mobileFloatingActionGroup: { position: "absolute", top: "6px", right: "6px", display: "flex", gap: "4px", zIndex: 10 },
  mobileActionRoundBtn: { width: "26px", height: "26px", borderRadius: "50%", backgroundColor: "rgba(255, 255, 255, 0.95)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.15)" },
  mobileBottomRowStyle: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px", width: "100%" },
  mobileBtnLihatStyle: { backgroundColor: "#E46B3C", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600", cursor: "pointer" },
  mobileBookmarkBtn: { position: "absolute", top: "6px", right: "6px", width: "26px", height: "26px", borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.95)", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.15)" },
  mobileBookmarkActive: { fontSize: "16px", color: "#E46B3C", fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
};

export default Profil;