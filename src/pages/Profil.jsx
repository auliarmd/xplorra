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

  // Integrasi State Header Responsif & Menu Hamburger dari Dashboard
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showMenu, setShowMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Profil");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

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

    api.get('/profile')
      .then((res) => {
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

  return (
    <div style={{
        ...styles.page,
        backgroundImage: isMobile ? "none" : `linear-gradient(to bottom, rgba(180, 113, 71, 0.9), rgba(245,236,222,0.0)), url('/map.png')`
      }}>
      
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

      {/* NAVBAR / HEADER KONSISTEN DARI DASHBOARD */}
      {isMobile ? (
        <div style={styles.mobileNavbar}>
          <div style={styles.mobileNavbarLeft}>
            <span className="material-symbols-outlined" style={styles.mobileMenuIcon} onClick={() => setShowMenu(true)}>
              menu
            </span>
          </div>
          
          <div style={styles.mobileHeaderTitleCenter}>
            <span className="material-symbols-outlined" style={styles.mobileHeaderIcon}>person</span>
            <span>Profil</span>
          </div>
          
          <div style={styles.mobileNavbarRight}>
            <div style={styles.profileCircle} onClick={() => navigate("/profil")}>
              {user.foto ? (
                <img src={`https://xplorra-production.up.railway.app/uploads/${user.foto}`} alt="Profile" style={styles.profileImg} />
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
            <span style={styles.active}>Profile</span>
            <span onClick={() => navigate("/notifikasi")}>Notifikasi</span>
          </div>
          <div style={styles.rightMenu}>
            <button style={styles.btnTambah} onClick={() => navigate("/tambah")}>+ Tambah resep</button>
            <div style={styles.profileCircle} onClick={() => navigate("/profil")}>
              {user.foto ? (
                <img src={`https://xplorra-production.up.railway.app/uploads/${user.foto}`} alt="Profile" style={styles.profileImg} />
              ) : (
                <span className="material-symbols-outlined">person</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAMPILAN SIDEBAR DRAWER MOBILE DARI DASHBOARD */}
      {isMobile && showMenu && (
        <>
          <div style={styles.mobileOverlay} onClick={() => setShowMenu(false)} />
          <div style={styles.mobileSidebar}>
            <div style={styles.mobileLogoSection}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src="/logo_X.png" alt="" style={{ width: "40px" }} />
                <span style={styles.mobileLogoText}>pLorra</span>
              </div>
              <span className="material-symbols-outlined" style={styles.closeMenuIcon} onClick={() => setShowMenu(false)}>close</span>
            </div>
            <div style={styles.mobileMenuTitle}></div>
            <div className="hover-sidebar-item" style={activeMenu === "Dashboard" ? styles.mobileMenuItemActive : styles.mobileMenuItem} onClick={() => { setActiveMenu("Dashboard"); navigate("/dashboardafterlogin"); setShowMenu(false); }}>Dashboard</div>
            <div className="hover-sidebar-item" style={activeMenu === "Notifikasi" ? styles.mobileMenuItemActive : styles.mobileMenuItem} onClick={() => { setActiveMenu("Notifikasi"); navigate("/notifikasi"); setShowMenu(false); }}>Notifikasi</div>
            <div className="hover-sidebar-item" style={activeMenu === "Profil" ? styles.mobileMenuItemActive : styles.mobileMenuItem} onClick={() => { setActiveMenu("Profil"); setActiveTab("profil"); setShowMenu(false); }}>Profil</div>
          </div>
        </>
      )}

      {/* AREA KONTEN UTAMA */}
      <div style={isMobile ? styles.mobileContentContainer : styles.container}>
        
        {/* SIDEBAR INTERNAL HALAMAN PROFIL (UNTUK DESKTOP) */}
        {!isMobile && (
          <div style={styles.leftSection}>
            <div style={styles.profileSidebarLayout}>
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
        )}

        {/* TAMPILAN PROFIL UTAMA (KONDISIONAL MOBILE / DESKTOP) */}
        {activeTab === "profil" && (
          <div style={isMobile ? styles.mobileProfileModern : styles.profileModern}>      
            {!isMobile && <div style={styles.profileBanner}></div>}
            <div style={isMobile ? styles.mobilePhotoWrapper : styles.profilePhotoWrapper}>
              {(profileImage || (user?.foto && user.foto !== "null")) ? (
                <img src={profileImage ? profileImage : `https://xplorra-production.up.railway.app/uploads/${user.foto}`} alt="profile" style={isMobile ? styles.mobilePhoto : styles.profilePhoto} />
              ) : (
                <span className="material-symbols-outlined" style={isMobile ? styles.mobilePhotoPlaceholder : styles.profilePlaceholder}>person</span>
              )}
              <div style={isMobile ? styles.mobileCameraBtnAbsolute : styles.cameraBtn} onClick={() => setShowPhotoMenu(true)} title="Ubah foto profil">
                <span className="material-symbols-outlined" style={{ fontSize: isMobile ? "18px" : "18px", color: "#fff" }}>photo_camera</span>
              </div>
            </div>

            <div style={isMobile ? styles.mobileProfileContent : styles.profileContent}>
              {isMobile && <h1 style={styles.mobileNameHeader}>{user.nama}</h1>}
              
              {/* Menu Navigasi Tab Internal Khusus Mobile */}
              {isMobile && (
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
              )}

              <div style={isMobile ? styles.mobileFormGrid : styles.inputRow}>
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
                <div style={{ ...styles.inputGroupModern, marginTop: isMobile ? "15px" : "0" }}>
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
                  Ganti
                </button>
              </div>

              <div style={styles.separator}></div>
              <div style={isMobile ? styles.mobileLogoutWrapper : styles.logoutWrapper}>
                <button
                  style={{
                    ...styles.logoutButton,
                    width: isMobile ? "100%" : "auto",
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

        {/* TAB LIST DATA RESEP / FAVORIT (UNTUK DESKTOP & MOBILE) */}
        {(activeTab === "resep" || activeTab === "favorit") && (
          <div style={isMobile ? styles.mobileRightSection : styles.rightSection}>
            
            {isMobile && (
              <div style={styles.mobileSubMenuNavigationCard}>
                <div style={styles.mobileSubMenuItem} onClick={() => setActiveTab("profil")}>
                  <div style={styles.mobileMenuLeft}>
                    <span className="material-symbols-outlined" style={styles.mobileMenuItemIcon}>person</span>
                    <span style={styles.mobileMenuText}>Kembali ke Profil</span>
                  </div>
                  <span className="material-symbols-outlined" style={styles.mobileArrow}>chevron_right</span>
                </div>
                <div style={styles.mobileDivider}></div>
                <div style={styles.mobileSubMenuItem} onClick={() => setActiveTab(activeTab === "resep" ? "favorit" : "resep")}>
                  <div style={styles.mobileMenuLeft}>
                    <span className="material-symbols-outlined" style={styles.mobileMenuItemIcon}>{activeTab === "resep" ? "bookmark" : "menu_book"}</span>
                    <span style={styles.mobileMenuText}>{activeTab === "resep" ? "Resep Tersimpan" : "Resep Saya"}</span>
                  </div>
                  <span className="material-symbols-outlined" style={styles.mobileArrow}>chevron_right</span>
                </div>
              </div>
            )}

            {isMobile && activeTab === "resep" && (
              <div style={styles.mobileAddRecipeCard} onClick={() => navigate("/tambah")}>
                <div style={styles.mobileAddIconCircle}>
                  <span className="material-symbols-outlined">add</span>
                </div>
                <h3 style={styles.mobileAddCardTitle}>Tambah Resep</h3>
                <p style={styles.mobileAddCardDesc}>Bagikan rahasia dapur keluarga Anda ke seluruh nusantara</p>
              </div>
            )}

            <h1 style={isMobile ? styles.mobilePageTitle : styles.pageTitle}>{activeTab === "resep" ? "Resep Saya" : "Resep Tersimpan"}</h1>
            <div style={isMobile ? styles.mobileRecipeContainer : styles.recipeContainer}>
              {(activeTab === "resep" ? myRecipes : myBookmarks).length === 0 ? (
                <div style={styles.emptyContainer}>
                  <span className="material-symbols-outlined" style={styles.emptyIcon}>
                    {activeTab === "resep" ? "restaurant" : "bookmark"}
                  </span>
                  <p>{activeTab === "resep" ? "Belum ada resep yang dibuat" : "Belum ada resep favorit"}</p>
                </div>
              ) : (
                <div style={isMobile ? styles.mobileRecipesGrid : styles.recipeGrid}>
                  {(activeTab === "resep" ? myRecipes : myBookmarks).map((item) => (
                    <div key={item.id} style={isMobile ? styles.mobileRecipeCardItem : styles.card} onClick={() => navigate(`/detail/${item.id}`)}>
                      <div style={styles.cardImgWrapper}>
                        <img src={`https://xplorra-production.up.railway.app/uploads/${item.gambar}`} style={isMobile ? styles.mobileCardImg : styles.cardImg} alt={item.nama} />
                        
                        {activeTab === "resep" ? (
                          <div style={isMobile ? styles.mobileFloatingActionGroup : styles.desktopFloatingActionGroup}>
                            <button style={isMobile ? styles.mobileActionRoundBtn : styles.desktopActionRoundBtn} title="Edit Resep" onClick={(e) => { e.stopPropagation(); navigate(`/edit/${item.id}`); }}>
                              <span className="material-symbols-outlined" style={{ fontSize: "15px", color: "#E46B3C" }}>edit</span>
                            </button>
                            <button style={isMobile ? styles.mobileActionRoundBtn : styles.desktopActionRoundBtn} title="Hapus Resep" onClick={(e) => { e.stopPropagation(); setDeleteTargetId(item.id); setShowDeletePopup(true); }}>
                              <span className="material-symbols-outlined" style={{ fontSize: "15px", color: "#dc2626" }}>delete</span>
                            </button>
                          </div>
                        ) : (
                          <button style={isMobile ? styles.mobileBookmarkBtn : styles.bookmarkBtn} title="Hapus dari Favorit" onClick={(e) => { e.stopPropagation(); setRemoveBookmarkTargetId(item.id); setShowRemoveBookmarkPopup(true); }}>
                            <span className="material-symbols-outlined" style={styles.bookmarkActive}>bookmark</span>
                          </button>
                        )}
                      </div>
                      <div style={isMobile ? styles.mobileCardBody : styles.cardBody}>
                        <h4 style={isMobile ? styles.mobileCardTitle : styles.cardTitle}>{item.nama}</h4>
                        <div style={styles.infoRow}>
                          <span style={styles.iconText}><span className="material-symbols-outlined" style={isMobile ? styles.mobileMaterialIcon : styles.materialIcon}>comment</span>{item.total_komentar}</span>
                          <span style={styles.iconText}><span className="material-symbols-outlined" style={isMobile ? styles.mobileMaterialIcon : styles.materialIcon}>thumb_up</span>{item.likes || 0}</span>
                        </div>
                        <div style={isMobile ? styles.mobileBottomRowStyle : styles.bottomRow}>
                          <span style={styles.rating}>
                            <span style={styles.ratingNumber}>{item.rating}</span>
                            {!isMobile && [1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className="material-symbols-outlined" style={star <= Math.round(item.rating) ? styles.star : styles.starEmpty}>star</span>
                            ))}
                            {isMobile && <span className="material-symbols-outlined" style={styles.mobileStar}>star</span>}
                          </span>
                          <button style={isMobile ? styles.mobileBtnLihatStyle : styles.btnLihat} onClick={(e) => { e.stopPropagation(); navigate(`/detail/${item.id}`); }}>Lihat</button>
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
  page: { minHeight:"100vh", backgroundSize:"cover", backgroundPosition:"center", backgroundRepeat:"no-repeat", background: "#f7f1ec", paddingBottom: "40px", width: "100%", overflowX: "hidden" },
  
  // NAVBAR DESKTOP (Sama seperti Dashboard)
  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 50px", background: "#fff", position: "sticky", top: 0, zIndex: 999, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" },
  logoContainer: { display: "flex", alignItems: "center", gap: "1px" },
  logoImg: { width: "40px" },
  logoText: { color: "#F28C28", fontWeight: "bold", fontSize: "24px", letterSpacing: "1px" },
  menu: { display: "flex", gap: "30px", fontSize: "18px", fontWeight: "700", cursor: "pointer", marginLeft: "100px" },
  active: { color: "#F28C28", fontWeight: "bold" },
  rightMenu: { display: "flex", alignItems: "center", gap: "15px" },
  btnTambah: { border: "1.5px solid #e15b3c", color: "#e15b3c", background: "transparent", padding: "6px 15px", borderRadius: "20px", cursor: "pointer", fontWeight: "600" },
  profileCircle: { width: "35px", height: "35px", borderRadius: "50%", background: "#f4b8a3", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", cursor: "pointer", overflow: "hidden" },
  profileImg: { width: "100%", height: "100%", objectFit: "cover" },

  // NAVBAR MOBILE & DRAWER (Sama seperti Dashboard)
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
  mobileMenuItemActive: { padding: "12px 14px", fontSize: "16px", cursor: "pointer", color: "#e15b3c", backgroundColor: "rgba(225, 91, 60, 0.12)", fontWeight: "700", borderRadius: "10px" },

  // CONTAINERS LAYOUT
  container: { display:"flex", gap:"90px", alignItems:"flex-start", justifyContent:"center", marginTop:"40px" },
  mobileContentContainer: { padding: "20px 15px", display: "flex", flexDirection: "column", width: "100%", boxSizing: "border-box" },
  
  // PROFIL MODAL BOXES & LAYOUT INTERNAL
  leftSection:{ display:"flex", flexDirection:"column", width:"290px" },
  profileSidebarLayout:{ width:"290px", background:"#fff", borderRadius:"12px", padding:"22px", boxShadow:"0 4px 15px rgba(0,0,0,0.12)", height:"300px" },
  sidebarTitle:{ fontSize:"26px", fontWeight:"700", color:"#9c5b00", marginBottom:"22px" },
  sidebarMenu:{ display:"flex", alignItems:"center", padding:"10px 14px", marginBottom:"6px", cursor:"pointer", borderRadius:"8px", fontSize:"16px" },
  activeMenu:{ background:"#d96a4f", color:"#fff" },
  menuLeft:{ display:"flex", alignItems:"center", gap:"10px" },
  menuIcon:{ fontSize:"20px" },
  line: { width: "100%", height: "1px", background: "#ddd", margin: "2px 0 8px" },
  
  profileModern:{ width:"700px", background:"#fff", borderRadius:"10px", overflow:"hidden", boxShadow:"0 4px 15px rgba(0,0,0,0.15)", position:"relative" },
  mobileProfileModern: { width: "100%", background: "transparent", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" },
  profileBanner:{ height:"120px", background:"linear-gradient(90deg,#B26D00,#E2856E)" },
  
  profilePhotoWrapper:{ position:"absolute", top:"70px", left:"30px", zIndex:"10" },
  mobilePhotoWrapper: { position: "relative", display: "inline-block", marginTop: "10px" },
  profilePhoto: { width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover", border: "4px solid #fff", background: "#ddd" },
  mobilePhoto: { width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", border: "4px solid #fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
  profilePlaceholder: { width: "90px", height: "90px", borderRadius: "50%", background: "#ddd", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "50px" },
  mobilePhotoPlaceholder: { width: "120px", height: "120px", borderRadius: "50%", background: "#ddd", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "60px" },
  cameraBtn: { position: "absolute", right: "-5px", bottom: "0px", width: "28px", height: "28px", borderRadius: "50%", background: "#b77700", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", border: "2px solid white" },
  mobileCameraBtnAbsolute: { position: "absolute", bottom: "5px", right: "5px", width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "#b77700", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", cursor: "pointer", zIndex: 5 },

  profileContent:{ padding:"55px 30px 30px" },
  mobileProfileContent: { width: "100%", marginTop: "15px", display: "flex", flexDirection: "column", boxSizing: "border-box" },
  mobileNameHeader: { fontSize: "24px", fontWeight: "700", color: "#222", textAlign: "center", margin: "5px 0 20px 0" },
  
  inputRow:{ display:"flex", gap:"20px", marginTop:"10px" },
  mobileFormGrid: { display: "flex", flexDirection: "column", width: "100%", marginTop: "20px" },
  inputGroupModern:{ flex:1 },
  labelModern:{ display:"block", marginBottom:"10px", color:"#8d7a68", fontSize:"12px", fontWeight:"600", letterSpacing:"1px" },
  inputModern:{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", boxSizing: "border-box", height: "46px", border: "1px solid #ead3c3", borderRadius: "8px", padding: "0 14px", fontSize: "14px", background: "#fffaf8", color: "#333" },
  nameInput:{ border:"none", outline:"none", background:"transparent", width:"100%", fontSize:"14px" },
  editPencil:{ color:"#d4b6a4", fontSize:"20px", cursor: "pointer" },
  
  securityTitle:{ marginTop:"25px", color:"#8d7a68", fontSize:"12px", fontWeight:"600", letterSpacing:"1px" },
  passwordCard:{ border:"1px solid #ead3c3", borderRadius:"8px", padding:"16px", display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"12px", background: "#fff" },
  passwordLeft:{ display:"flex", gap:"15px", alignItems:"center" },
  lockIcon:{ color:"#a66b09", fontSize:"28px" },
  passwordLabel:{ fontWeight:"500" },
  passwordDots:{ color:"#c6b3a8", letterSpacing:"3px" },
  menuButton: { border: "1px solid #ddd", background: "#fff", padding: "8px 16px", borderRadius: "24px", cursor: "pointer", fontWeight: "700", color: "#C65A00", border: "2px solid #C65A00" },
  separator:{ height:"1px", background:"#eee", marginTop:"25px" },
  logoutWrapper:{ display:"flex", justifyContent:"flex-end", marginTop:"30px" },
  mobileLogoutWrapper: { display: "flex", width: "100%", marginTop: "25px" },
  logoutButton: { background: "#c54500", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "25px", cursor: "pointer", fontWeight: "600", fontSize: "16px" },
  
  // INTERNAL MOBILE TABS
  mobileMenuCard: { background: "#fff", borderRadius: "15px", border: "1px solid #EAD5C6", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,.05)", width: "100%", marginBottom: "10px" },
  mobileMenuItemList: { height: "55px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px", cursor: "pointer" },
  mobileMenuLeft: { display: "flex", alignItems: "center", gap: "12px" },
  mobileMenuItemIcon: { fontSize: "22px", color: "#5A4A3F" },
  mobileMenuText: { fontSize: "15px", fontWeight: "600", color: "#5A4A3F" },
  mobileArrow: { fontSize: "22px", color: "#5A4A3F" },
  mobileDivider: { height: "1px", background: "#EFE5DC", margin: "0 16px" },

  // DATA RECOVERY & CARDS DESKTOP / MOBILE
  rightSection:{ display:"flex", flexDirection:"column" },
  mobileRightSection: { display: "flex", flexDirection: "column", width: "100%" },
  pageTitle:{ fontSize:"42px", fontWeight:"700", color:"#1f1a17", marginBottom:"25px", marginTop:"-15px" },
  mobilePageTitle: { fontSize: "24px", fontWeight: "700", color: "#1f1a17", marginBottom: "15px", marginTop: "10px" },
  recipeContainer:{ width:"820px", minHeight:"450px", display:"flex", flexDirection: "column", padding:"25px", background:"#f8efe8", borderRadius:"25px", boxSizing: "border-box" },
  mobileRecipeContainer: { width: "100%", display: "flex", flexDirection: "column", boxSizing: "border-box" },
  recipeGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", width: "100%" },
  mobileRecipesGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", width: "100%" },
  
  card: { background: "#ffffff", borderRadius: "18px", overflow: "hidden", boxShadow: "0 8px 20px rgba(0,0,0,0.08)", width: "100%", maxWidth: "240px", display: "flex", flexDirection: "column" },
  mobileRecipeCardItem: { background: "#fff", borderRadius: "14px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", width: "100%" },
  cardImg: { width: "100%", height: "130px", objectFit: "cover" },
  mobileCardImg: { width: "100%", height: "110px", objectFit: "cover" },
  cardImgWrapper: { position: "relative" },
  cardBody: { padding: "12px 14px", display: "flex", flexDirection: "column", flexGrow: 1, gap: "6px" },
  mobileCardBody: { padding: "8px 10px", display: "flex", flexDirection: "column", gap: "4px" },
  cardTitle: { fontSize: "15px", fontWeight: "700", margin: "0", lineHeight: "1.3", color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  mobileCardTitle: { fontSize: "13px", fontWeight: "700", margin: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#111" },
  
  infoRow: { display: "flex", gap: "12px", fontSize: "12px", color: "#666", margin: "0" },
  iconText: { display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#555", fontWeight: "600" },
  materialIcon: { fontSize: "16px", color: "#888" },
  mobileMaterialIcon: { fontSize: "14px", color: "#888" },
  bottomRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px", width: "100%" },
  mobileBottomRowStyle: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px", width: "100%" },
  rating: { display: "flex", alignItems: "center", gap: "1px" },
  ratingNumber: { fontWeight: "700", fontSize: "13px", color: "#333", marginRight: "2px" },
  star: { fontSize: "16px", color: "#FFC107" },
  starEmpty: { fontSize: "16px", color: "#ddd" },
  mobileStar: { fontSize: "14px", color: "#FFC107" },
  btnLihat: { background: "#d86936", color: "#fff", border: "none", padding: "6px 16px", borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontWeight: "700" },
  mobileBtnLihatStyle: { backgroundColor: "#e15b3c", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600", cursor: "pointer" },
  
  bookmarkBtn: { position: "absolute", top: "10px", right: "10px", width: "34px", height: "34px", borderRadius: "50%", border: "none", background: "#fff", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" },
  mobileBookmarkBtn: { position: "absolute", top: "6px", right: "6px", width: "26px", height: "26px", borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.95)", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.15)" },
  bookmarkActive: { fontSize: "20px", color: "#E46B3C", fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" },
  
  desktopFloatingActionGroup: { position: "absolute", top: "10px", right: "10px", display: "flex", gap: "6px", zIndex: 10 },
  mobileFloatingActionGroup: { position: "absolute", top: "6px", right: "6px", display: "flex", gap: "4px", zIndex: 10 },
  desktopActionRoundBtn: { width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(255, 255, 255, 0.95)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" },
  mobileActionRoundBtn: { width: "26px", height: "26px", borderRadius: "50%", backgroundColor: "rgba(255, 255, 255, 0.95)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.15)" },
  
  addRecipeCard:{ width:"290px", background:"#fff", borderRadius:"14px", padding:"25px 20px", marginTop:"25px", textAlign:"center", cursor:"pointer", boxShadow:"0 4px 12px rgba(0,0,0,0.08)" },
  addIcon:{ width:"50px", height:"50px", margin:"0 auto 15px", borderRadius:"50%", background:"#f2e5dd", display:"flex", justifyContent:"center", alignItems:"center", color:"#6d5545" },
  addTitle:{ fontSize:"18px", fontWeight:"700", color:"#4d4037", marginBottom:"10px" },
  addDesc:{ fontSize:"14px", color:"#999", lineHeight:"1.6" },
  
  mobileSubMenuNavigationCard: { background: "#fff", borderRadius: "15px", border: "1px solid #EAD5C6", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,.05)", width: "100%", marginBottom: "20px" },
  mobileSubMenuItem: { height: "50px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px", cursor: "pointer" },
  mobileAddRecipeCard: { width: "100%", background: "#fff", borderRadius: "15px", padding: "20px 16px", border: "2px dashed #ab8262", textAlign: "center", cursor: "pointer", marginBottom: "20px", boxSizing: "border-box" },
  mobileAddIconCircle: { width: "46px", height: "46px", margin: "0 auto 10px", borderRadius: "50%", background: "#f2e5dd", display: "flex", justifyContent: "center", alignItems: "center", color: "#6d5545" },
  mobileAddCardTitle: { fontSize: "16px", fontWeight: "700", color: "#4d4037", margin: "0 0 4px 0" },
  mobileAddCardDesc: { fontSize: "12px", color: "#999", margin: 0, lineHeight: "1.4" },
  
  savedRecipeCard:{ width:"330px", height:"220px", background:"#fff", borderRadius:"14px", marginTop:"120px", marginLeft:"-18px", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", boxShadow:"0 4px 12px rgba(0,0,0,0.08)" },
  savedRecipeIcon:{ width:"52px", height:"52px", borderRadius:"50%", background:"#f2e5dd", display:"flex", justifyContent:"center", alignItems:"center", color:"#9d8878", marginBottom:"18px" },
  savedRecipeMaterial:{ fontSize:"26px" },
  savedRecipeText:{ width:"140px", color:"#a08b7c", fontSize:"15px", fontWeight:"500", lineHeight:"1.6", margin:0 },
  
  emptyContainer: { width: "100%", minHeight: "350px", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", color: "#c46a3d", fontSize: "22px", fontWeight: "700", textAlign: "center" },
  emptyIcon: { fontSize: "70px", marginBottom: "15px", color: "#e46b3c" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(5px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999 },
  photoMenu: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#fff", borderRadius: "20px", padding: "24px", width: "90%", maxWidth: "420px", zIndex: "99999", border: "2px solid #E46B3C", boxShadow: `0 10px 30px rgba(0,0,0,0.15), 0 0 15px rgba(228,107,60,0.25)`, boxSizing: "border-box" },
  photoTitle: { fontSize: "26px", fontWeight: "700", color: "#1f2937", marginBottom: "8px" },
  photoSubtitle: { fontSize: "14px", color: "#6b7280", marginBottom: "20px" },
  photoAction: { display: "flex", alignItems: "center", gap: "16px", padding: "14px", border: "1px solid #e5e7eb", borderRadius: "16px", cursor: "pointer", marginBottom: "12px", transition: "all 0.25s ease" },
  photoIcon: { width: "46px", height: "46px", borderRadius: "50%", background: "#fff", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", flexShrink: 0 },
  photoTextWrapper: { flex: 1 },
  photoMainText: { fontSize: "15px", fontWeight: "700", color: "#111827" },
  photoSubText: { fontSize: "13px", color: "#6b7280", marginTop: "2px" },
  cancelAction: { display: "flex", alignItems: "center", gap: "16px", padding: "14px", borderRadius: "16px", background: "#f3f4f6", cursor: "pointer", marginTop: "10px" },
  modalBox: { background: "#fff", padding: "25px", borderRadius: "16px", width: "95%", maxWidth: "380px", textAlign: "center", boxShadow: "0 5px 20px rgba(0,0,0,0.2)", boxSizing: "border-box" },  
  modalTitle: { fontSize: "20px", fontWeight: "700", margin: "0 0 15px 0" },
  modalText: { color:"#666", marginBottom:"20px", fontSize: "15px" },
  modalActions: { display:"flex", justifyContent:"center", gap:"12px", width: "100%" },
  btnCancel: { padding:"10px 20px", border:"none", borderRadius:"8px", background:"#dddddd", cursor:"pointer", flex: 1, fontWeight: "600" },
  btnConfirm: { padding:"10px 20px", border:"none", borderRadius:"8px", background:"#c54500", color:"#fff", cursor:"pointer", flex: 1, fontWeight: "600" },
  passwordWrapper: { position: "relative", width: "100%", marginBottom: "16px", display: "flex", alignItems: "center" },
  passwordInput: { width: "100%", padding: "14px 45px 14px 14px", border: "1px solid #ddd", borderRadius: "10px", boxSizing: "border-box", outline: "none", fontSize: "15px" },
  eyeButton: { position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#666", display: "flex", alignItems: "center", padding: 0, zIndex: 10 },
  buttonGroup: { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px", width: "100%" }
};

export default Profil;