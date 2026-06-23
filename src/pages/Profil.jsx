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
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("");
  const [daerah, setDaerah] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [gambar, setGambar] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false); 
  const fileInputRef = useRef(null);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hoverPassword, setHoverPassword] = useState(false);
  const [hoverLogout, setHoverLogout] = useState(false);
  const handleImageChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const formData = new FormData();
    formData.append("foto", file);
    const res = await api.post(
      "/upload-profile",
      formData,
      {
        headers:{
          "Content-Type":"multipart/form-data"
        }
      }
    );
    if(res.data.status){
      setProfileImage(
        `http://localhost:5000/uploads/${res.data.foto}`
      );
      setUser({
        ...user,
        foto:res.data.foto
      });
    }
  } catch(err){
    console.log(err);
  }
};
  const handleChangePassword = async () => {
  if (newPassword !== confirmPassword) {
    alert("Konfirmasi password tidak cocok");
    return;
  }
  try {
    const res = await api.put(
      "/change-password",
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    alert(res.data.message || "Password berhasil diubah");

    setShowPasswordPopup(false);

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");

  } catch (err) {

    alert(
      err.response?.data?.message ||
      "Gagal mengubah password"
    );

  }

};

  const handleRemovePhoto = async (e) => {
    e.preventDefault(); 

    try {
      console.log("Klik hapus foto");

      const res = await api.delete("/profile-photo");
      console.log("Response:", res.data);

      setProfileImage(null);

      setUser({
        ...user,
        foto: null
      });

      setShowPhotoMenu(false);

    } catch(err){
      console.log("ERROR HAPUS FOTO:", err.response?.data || err);
      alert("Gagal menghapus foto: " + (err.response?.data?.message || "Cek console browser untuk detail error"));
    }
  };
  const handleUpdateName = async () => {

  try {

    const res = await api.put(
      "/update-name",
      {
        nama: newName
      },
      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    if(res.data.status){

      setUser({
        ...user,
        nama: newName
      });

      setIsEditingName(false);

      alert("Nama berhasil diubah");
    }

  } catch(err){

    console.log(err);

    alert("Gagal mengubah nama");
  }
};
  // State untuk Pop Up
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showRemoveBookmarkPopup, setShowRemoveBookmarkPopup] = useState(false);
  const [removeBookmarkTargetId, setRemoveBookmarkTargetId] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [hoverCancelLogout, setHoverCancelLogout] = useState(false);
  const [hoverConfirmLogout, setHoverConfirmLogout] = useState(false);
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
            setMyRecipes(
              Array.isArray(res.data) ? res.data : []
            );
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
  }, []);

  // Handler Hapus Resep
  const confirmDeleteRecipe = async () => {
    if (!deleteTargetId) return;
    try {
      await api.delete(`/delete-food/${deleteTargetId}`);
      setMyRecipes(
        myRecipes.filter((resep) => resep.id !== deleteTargetId)
      );
    } catch (err) {
      console.log(err);
    }
    setShowDeletePopup(false);
    setDeleteTargetId(null);
  };

  // Handler Hapus Bookmark
  const confirmRemoveBookmark = async () => {
    if (!removeBookmarkTargetId) return;
    try {
      await api.post(`/bookmark/${removeBookmarkTargetId}`);
      setMyBookmarks(
        myBookmarks.filter((resep) => resep.id !== removeBookmarkTargetId)
      );
    } catch (err) {
      console.log(err);
    }
    setShowRemoveBookmarkPopup(false);
    setRemoveBookmarkTargetId(null);
  };

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
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
        <div style={styles.rightMenu}>
        </div>
      </div>

      {/* CONTENT */}
      <div style={styles.container}>
        {/* SIDEBAR */}
        <div style={styles.leftSection}>

        <div style={styles.sidebar}>

          <h2 style={styles.sidebarTitle}>
            CHEF NUSANTARA
          </h2>

          {/* Profil */}
          <div
            style={
              activeTab === "profil"
                ? { ...styles.sidebarMenu, ...styles.activeMenu }
                : styles.sidebarMenu
            }
            onClick={()=>setActiveTab("profil")}
          >

            <div style={styles.menuLeft}>

              <span
                className="material-symbols-outlined"
                style={styles.menuIcon}
              >
                person
              </span>

              Profil

            </div>

          </div>

          <div style={styles.line}></div>

          {/* Resep Saya */}
          <div
            style={
              activeTab === "resep"
                ? { ...styles.sidebarMenu, ...styles.activeMenu }
                : styles.sidebarMenu
            }
            onClick={() => setActiveTab("resep")}
          >
            <div style={styles.menuLeft}>

            <span
              className="material-symbols-outlined"
              style={styles.menuIcon}
            >
              menu_book
            </span>

            Resep Saya

          </div>
          </div>

          <div style={styles.line}></div>
          

          {/* Favorit */}
          <div
            style={
              activeTab === "favorit"
                ? { ...styles.sidebarMenu, ...styles.activeMenu }
                : styles.sidebarMenu
            }
            onClick={() => setActiveTab("favorit")}
          >
            <div style={styles.menuLeft}>
              <span
                className="material-symbols-outlined"
                style={styles.menuIcon}
              >
                bookmark
              </span>

              Resep Tersimpan
            </div>

          </div>

         {activeTab === "favorit" && (
          <div
            style={styles.savedRecipeCard}
            onClick={() => navigate("/dashboardafterlogin")}
          >

            <div style={styles.savedRecipeIcon}>
              <span
                className="material-symbols-outlined"
                style={styles.savedRecipeMaterial}
              >
                explore
              </span>
            </div>

            <p style={styles.savedRecipeText}>
              Jelajahi resep lainnya untuk disimpan di sini.
            </p>

          </div>
        )} 

          <div style={styles.line}></div>
          </div>

          
        {activeTab === "resep" && (
          <div
            style={styles.addRecipeCard}
            onClick={() => navigate("/tambah")}
          >
            <div style={styles.addIcon}>
              <span className="material-symbols-outlined">
                add
              </span>
            </div>

            <h3 style={styles.addTitle}>
              Tambah Resep
            </h3>

            <p style={styles.addDesc}>
              Bagikan rahasia dapur keluarga Anda
              ke seluruh nusantara
            </p>

           
          </div>
        )}

         </div>

        {/* MAIN CONTENT */}
        {activeTab === "profil" && (

       <div style={styles.profileModern}>      

        {/* HEADER */}
        <div style={styles.profileBanner}></div>

        {/* FOTO */}
        <div style={styles.profilePhotoWrapper}>

          {(profileImage || (user?.foto && user.foto !== "null")) ? (
            <img
              src={
                profileImage
                  ? profileImage
                  : `http://localhost:5000/uploads/${user.foto}`
              }
              alt="profile"
              style={styles.profilePhoto}
            />
          ) : (
            <span
              className="material-symbols-outlined"
              style={styles.profilePlaceholder}
            >
              person
            </span>
          )}

          <div
            style={styles.cameraBtn}
            onClick={() => setShowPhotoMenu(true)}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "18px", color: "#fff" }}
            >
              photo_camera
            </span>

            <input
              type="file"
              hidden
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>

        </div>

        {/* CONTENT */}
        <div style={styles.profileContent}>

          <div style={styles.inputRow}>

            <div style={styles.inputGroupModern}>
              <label style={styles.labelModern}>
                NAMA
              </label>

              <div style={styles.inputModern}>

                {isEditingName ? (

                  <>
                    <input
                      value={newName}
                      onChange={(e)=>setNewName(e.target.value)}
                      style={styles.nameInput}
                    />

                    <span
                      className="material-symbols-outlined"
                      style={{
                        ...styles.editPencil,
                        color:"green"
                      }}
                      onClick={handleUpdateName}
                    >
                      check
                    </span>

                    <span
                      className="material-symbols-outlined"
                      style={{
                        ...styles.editPencil,
                        marginLeft:"8px",
                        color:"red"
                      }}
                      onClick={()=>{
                        setIsEditingName(false);
                        setNewName(user.nama);
                      }}
                    >
                      close
                    </span>
                  </>

                ) : (

                  <>
                    {user.nama}

                    <span
                      className="material-symbols-outlined"
                      style={styles.editPencil}
                      onClick={()=>{
                        setNewName(user.nama);
                        setIsEditingName(true);
                      }}
                    >
                      edit
                    </span>
                  </>

                )}

              </div>
            </div>

            <div style={styles.inputGroupModern}>
              <label style={styles.labelModern}>
                ALAMAT EMAIL
              </label>

              <div style={styles.inputModern}>
                {user.email}
              </div>

            </div>

          </div>

          <div style={styles.securityTitle}>
            KEAMANAN AKUN
          </div>

          <div style={styles.passwordCard}>

            <div style={styles.passwordLeft}>

              <span
                className="material-symbols-outlined"
                style={styles.lockIcon}
              >
                lock
              </span>

              <div>

                <div style={styles.passwordLabel}>
                  Kata Sandi
                </div>

                <div style={styles.passwordDots}>
                  ••••••••••••
                </div>

              </div>

            </div>

            <button
              style={{
                ...styles.menuButton,
                backgroundColor: hoverPassword ? "#f3f4f6" : "#fff",
                transform: hoverPassword ? "translateY(-2px)" : "translateY(0)",
                boxShadow: hoverPassword
                  ? "0 4px 12px rgba(0,0,0,0.15)"
                  : "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={() => setHoverPassword(true)}
              onMouseLeave={() => setHoverPassword(false)}
              onClick={() => setShowPasswordPopup(true)}
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
                boxShadow: hoverLogout
                  ? "0 4px 12px rgba(220,38,38,0.25)"
                  : "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={() => setHoverLogout(true)}
              onMouseLeave={() => setHoverLogout(false)}
              onClick={() => setShowLogoutPopup(true)}
            >
              Keluar
            </button>
        </div>
         </div>
          </div>
      )}

          {/* RECIPE SECTION */}
          {activeTab === "resep" && (

            <div style={styles.rightSection}>

              <h1 style={styles.pageTitle}>
                Resep Saya
              </h1>

            <div style={styles.recipeContainer}>

              {
                myRecipes.length === 0 ? (

                  <div style={styles.emptyContainer}>

                    <span
                      className="material-symbols-outlined"
                      style={styles.emptyIcon}
                    >
                      restaurant
                    </span>

                    <p>Belum ada resep yang dibuat</p>

                  </div>

                ) : (

                  <div style={styles.recipeGrid}>

                    {myRecipes.map((item) => (

                      <div
                        key={item.id}
                        style={{
                          ...styles.card,
                          cursor: "pointer"
                        }}
                        onClick={() => navigate(`/detail/${item.id}`)}
                      >
                       <div style={styles.cardImgWrapper}>
                        <img
                          src={`http://localhost:5000/uploads/${item.gambar}`}
                          style={styles.cardImg}
                          alt={item.nama}
                        />

                        <button
                          style={styles.deleteFloatingBtn}
                          onClick={() => {
                            setDeleteTargetId(item.id);
                            setShowDeletePopup(true);
                          }}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{
                              fontSize: "22px",
                              color: "#808080",
                              fontVariationSettings:
                                "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                            }}
                          >
                            delete
                          </span>
                        </button>
                      </div>

                        <div style={styles.cardBody}>

                          <h4 style={styles.cardTitle}>
                            {item.nama}
                          </h4>

                          <div style={styles.infoRow}>

                            <span style={styles.iconText}>
                              <span
                                className="material-symbols-outlined"
                                style={styles.materialIcon}
                              >
                                comment
                              </span>
                              {item.total_komentar}
                            </span>

                            <span style={styles.iconText}>
                              <span
                                className="material-symbols-outlined"
                                style={styles.materialIcon}
                              >
                                thumb_up
                              </span>
                              {item.likes}
                            </span>

                          </div>
                          <span style={styles.rating}>

                          <span style={styles.ratingNumber}>
                            {item.rating}
                          </span>

                          {[1,2,3,4,5].map((star) => (
                            <span
                              key={star}
                              className="material-symbols-outlined"
                              style={
                                star <= Math.round(item.rating)
                                ? styles.star
                                : styles.starEmpty
                              }
                            >
                              star
                            </span>
                          ))}
                          <div style={styles.editWrapper}>
                          <button
                            style={styles.editBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/edit/${item.id}`);
                            }}
                          >
                            Edit
                          </button>
                        </div>

                        </span>
 
                        </div>

                      </div>

                    ))}

                  </div>
                  

                )
              }

            </div>
            </div> 

          )}
  
        {/* FAVORIT SECTION */}
        {activeTab === "favorit" && (
          
          <div style={styles.recipeContainer}>
            {myBookmarks.length === 0 ? (
              <div style={styles.emptyContainer}>
                <span
                  className="material-symbols-outlined"
                  style={styles.bookmarkActive}
    
                >
                  bookmark
                </span>
                <p>Belum ada resep favorit</p>
              </div>
            ) : (
              <div style={styles.recipeGrid}>
                {myBookmarks.map((item) => (
                  <div key={item.id} style={styles.card}>
                    <div style={styles.cardImgWrapper}>
                      <img
                        src={`http://localhost:5000/uploads/${item.gambar}`}
                        style={styles.cardImg}
                        alt=""
                      />
                      {/* TAMPILKAN POP UP HAPUS BOOKMARK SAAT DIKLIK */}
                      <button
                        style={styles.bookmarkBtn}
                        title="Tersimpan"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRemoveBookmarkTargetId(item.id);
                          setShowRemoveBookmarkPopup(true);
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={styles.bookmarkActive}
                        >
                          bookmark
                        </span>
                      </button>
                    </div>

                    <div style={styles.cardBody}>
                      <h4 style={styles.cardTitle}>{item.nama}</h4>
                      <div style={styles.infoRow}>
                        <span style={styles.iconText}>
                          <span
                            className="material-symbols-outlined"
                            style={styles.materialIcon}
                          >
                            comment
                          </span>
                          {item.total_komentar}
                        </span>
                        <span style={styles.iconText}>
                          <span
                            className="material-symbols-outlined"
                            style={styles.materialIcon}
                          >
                            thumb_up
                          </span>
                          {item.likes}
                        </span>
                      </div>

                      <div style={styles.bottomRow}>
                        <span style={styles.rating}>
                          {item.rating}
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className="material-symbols-outlined"
                              style={
                                star <= Math.round(item.rating)
                                  ? styles.star
                                  : styles.starEmpty
                              }
                            >
                              star
                            </span>
                          ))}
                        </span>
                        <button
                          style={styles.btnLihat}
                          onClick={() => navigate(`/detail/${item.id}`)}
                        >
                          Lihat
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <input
        id="galleryInput"
        type="file"
        accept="image/*"
        hidden
        onChange={handleImageChange}
      />

      <input
        id="cameraInput"
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={handleImageChange}
      />

      {showPhotoMenu && (
        <div style={styles.modalOverlay}>

          <div style={styles.photoMenu}>

            <div style={styles.photoTitle}>
              Kelola Foto Profil
            </div>

            <div style={styles.photoSubtitle}>
              Pilih tindakan yang ingin Anda lakukan
            </div>

            {/* Kamera */}
            <div
              style={{
                ...styles.photoAction,
                border:
                  hoverPhoto === "camera"
                    ? "2px solid #E46B3C"
                    : "1px solid #e5e7eb",
                background:
                  hoverPhoto === "camera"
                    ? "#FFF7F3"
                    : "#fff",
              }}
              onMouseEnter={() => setHoverPhoto("camera")}
              onMouseLeave={() => setHoverPhoto("")}
              onClick={() => {
                document.getElementById("cameraInput").click();
                setShowPhotoMenu(false);
              }}
            >
              <div
                style={{
                  ...styles.photoIcon,
                  background: "#fff",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "28px",
                    color: "#808080",
                    fontVariationSettings:
                      "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                  }}
                >
                  photo_camera
                </span>
              </div>

              <div style={styles.photoTextWrapper}>
                <div style={styles.photoMainText}>
                  Ganti dengan Kamera
                </div>

                <div style={styles.photoSubText}>
                  Ambil foto baru menggunakan kamera
                </div>
              </div>
            </div>

            {/* Galeri */}
            <div
              style={{
                ...styles.photoAction,
                border:
                  hoverPhoto === "gallery"
                    ? "2px solid #E46B3C"
                    : "1px solid #e5e7eb",
                background:
                  hoverPhoto === "gallery"
                    ? "#FFF7F3"
                    : "#fff",
              }}
              onMouseEnter={() => setHoverPhoto("gallery")}
              onMouseLeave={() => setHoverPhoto("")}
              onClick={() => {
                document.getElementById("galleryInput").click();
                setShowPhotoMenu(false);
              }}
            >
              <div
                style={{
                  ...styles.photoIcon,
                  background: "#fff",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "28px",
                    color: "#808080",
                    fontVariationSettings:
                      "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                  }}
                >
                  image
                </span>
              </div>

              <div style={styles.photoTextWrapper}>
                <div style={styles.photoMainText}>
                  Ganti dari Galeri
                </div>

                <div style={styles.photoSubText}>
                  Pilih foto dari galeri perangkat
                </div>
              </div>
            </div>

            {/* Hapus Foto */}
            {(profileImage || user?.foto) && (
              <div
                style={{
                  ...styles.photoAction,
                  border:
                    hoverPhoto === "delete"
                      ? "2px solid #dc2626"
                      : "1px solid #e5e7eb",
                  background:
                    hoverPhoto === "delete"
                      ? "#fff1f2"
                      : "#fff",
                }}
                onMouseEnter={() => setHoverPhoto("delete")}
                onMouseLeave={() => setHoverPhoto("")}
                onClick={(e) => handleRemovePhoto(e)}
              >
                <div
                  style={{
                    ...styles.photoIcon,
                    background: "#fff",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "28px",
                      color: "#808080",
                      fontVariationSettings:
                        "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                    }}
                  >
                    delete
                  </span>
                </div>

                <div style={styles.photoTextWrapper}>
                  <div
                    style={{
                      ...styles.photoMainText,
                      color: "#000",
                    }}
                  >
                    Hapus Foto
                  </div>

                  <div style={styles.photoSubText}>
                    Hapus foto profil saat ini
                  </div>
                </div>
              </div>
            )}

            {/* Batal */}
            <div
              style={{
                ...styles.cancelAction,
                border:
                  hoverPhoto === "cancel"
                    ? "2px solid #E46B3C"
                    : "2px solid transparent",
                background:
                  hoverPhoto === "cancel"
                    ? "#FFF7F3"
                    : "#f3f4f6",
              }}
              onMouseEnter={() => setHoverPhoto("cancel")}
              onMouseLeave={() => setHoverPhoto("")}
              onClick={() => setShowPhotoMenu(false)}
            >
              <div
                style={{
                  ...styles.photoIcon,
                  background: "#fff",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "28px",
                    color: "#808080",
                    fontVariationSettings:
                      "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                  }}
                >
                  close
                </span>
              </div>

              <div style={styles.photoTextWrapper}>
                <div style={styles.photoMainText}>
                  Batal
                </div>

                <div style={styles.photoSubText}>
                  Tutup menu
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* POP UP LOGOUT */}
      {showLogoutPopup && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={styles.modalTitle}>Konfirmasi Keluar</h3>
            <p style={styles.modalText}>Apakah Anda yakin ingin keluar dari akun ini?</p>
            <div style={styles.modalActions}>
              <button
                style={{
                  ...styles.btnCancel,
                  backgroundColor: hoverCancelLogout ? "#cfcfcf" : "#ddd",
                  transform: hoverCancelLogout
                    ? "translateY(-2px)"
                    : "translateY(0)",
                  boxShadow: hoverCancelLogout
                    ? "0 4px 12px rgba(0,0,0,0.15)"
                    : "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={() => setHoverCancelLogout(true)}
                onMouseLeave={() => setHoverCancelLogout(false)}
                onClick={() => setShowLogoutPopup(false)}
              >
                Batal
              </button>
              <button
                style={{
                  ...styles.btnConfirm,
                  backgroundColor: hoverConfirmLogout
                    ? "#a63800"
                    : "#c54500",
                  transform: hoverConfirmLogout
                    ? "translateY(-2px)"
                    : "translateY(0)",
                  boxShadow: hoverConfirmLogout
                    ? "0 4px 12px rgba(197,69,0,0.35)"
                    : "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={() => setHoverConfirmLogout(true)}
                onMouseLeave={() => setHoverConfirmLogout(false)}
                onClick={() => {
                  localStorage.removeItem("token");
                  setShowLogoutPopup(false);
                  navigate("/Masuk");
                }}
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POP UP HAPUS RESEP SENDIRI */}
      {showDeletePopup && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={styles.modalTitle}>Hapus Resep</h3>
            <p style={styles.modalText}>Apakah Anda yakin ingin menghapus resep ini secara permanen?</p>
            <div style={styles.modalActions}>
              <button
                style={styles.btnCancel}
                onClick={() => {
                  setShowDeletePopup(false);
                  setDeleteTargetId(null);
                }}
              >
                Batal
              </button>
              <button
                style={styles.btnConfirm}
                onClick={confirmDeleteRecipe}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POP UP HAPUS BOOKMARK/FAVORIT */}
      {showRemoveBookmarkPopup && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={styles.modalTitle}>Hapus Favorit</h3>
            <p style={styles.modalText}>Apakah Anda yakin ingin menghapus resep ini dari daftar favorit?</p>
            <div style={styles.modalActions}>
              <button
                style={styles.btnCancel}
                onClick={() => {
                  setShowRemoveBookmarkPopup(false);
                  setRemoveBookmarkTargetId(null);
                }}
              >
                Batal
              </button>
              <button
                style={styles.btnConfirm}
                onClick={confirmRemoveBookmark}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordPopup && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={styles.modalTitle}>
              Ganti Password
            </h3>

            {/* Kata Sandi Lama */}
            <div style={styles.passwordWrapper}>
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Kata Sandi Lama"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                style={styles.passwordInput}
              />

              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                style={styles.eyeButton}
              >
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Kata Sandi Baru */}
            <div style={styles.passwordWrapper}>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Kata Sandi Baru"
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={styles.passwordInput}
              />

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeButton}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Konfirmasi Kata Sandi Baru */}
            <div style={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Konfirmasi Kata Sandi Baru"
                minLength={6}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                style={styles.passwordInput}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                style={styles.eyeButton}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div style={styles.buttonGroup}>
              <button
                style={styles.btnCancel}
                onClick={() => setShowPasswordPopup(false)}
              >
                Batal
              </button>

              <button
                style={styles.btnConfirm}
                onClick={handleChangePassword}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page:{
    minHeight:"100vh",

    backgroundImage: `
        linear-gradient(to bottom, rgba(180, 113, 71, 0.9), rgba(245,236,222,0.0)),
        url('/map.png')
    `,
    backgroundSize:"cover",
    backgroundPosition:"center",
    backgroundRepeat:"no-repeat",
    paddingTop:"40px",
  },
  /* NAVBAR */
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 15px",
    background: "#fff",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  emptyContainer: {
    width: "100%",
    minHeight: "350px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    color: "#c46a3d",
    fontSize: "22px",
    fontWeight: "700",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "70px",
    marginBottom: "15px",
    color: "#e46b3c",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1px",
  },
  logoImg: {
    width: "40px",
  },
  logoText: {
    color: "#F28C28",
    fontWeight: "bold",
    fontSize: "24px",
    letterSpacing: "1px",
  },
  menu: {
    display: "flex",
    gap: "30px",
    fontSize: "18px",
    fontWeight: "500",
    fontWeight: "bold",
  },
  active: {
    color: "#F28C28",
    fontWeight: "bold",
  },
  /* LAYOUT */
  container: {
    display:"flex",
    gap:"90px",
    alignItems:"flex-start",
    justifyContent:"center",
    marginTop:"120px",
  },

  /* SIDEBAR */
  sidebar:{
    width:"290px",
    background:"#fff",
    borderRadius:"12px",
    padding:"22px",
    boxShadow:"0 4px 15px rgba(0,0,0,0.12)",
    height:"300px",
    marginTop:"0px",
  },

  sidebarMenu:{
    display:"flex",
    alignItems:"center",
    padding:"10px 14px",
    marginBottom:"6px",
    cursor:"pointer",
    borderRadius:"8px",
    fontSize:"16px",
  },

  activeMenu:{
    background:"#d96a4f",
    color:"#fff",
  },
  orangeArrow: {
    color: "#e46b3c",
  },
  line: {
    width: "100%",
    height: "1px",
    background: "#ddd",
    margin: "2px 0 8px",
  },
  arrowIcon: {
    fontSize: "24px",
  },
  arrow: {
    fontSize: "16px",
    color: "#777",
  },
  /* MAIN */
  mainContent: {
    flex: 1,
    maxWidth: "850px",
  },
  /* PROFILE */
  profileCard: {
    width: "650px",
    background: "#f4ebe2",
    borderRadius: "25px",
    padding: "35px",
    border: "2px solid #e46b3c",
    boxShadow: `
      0 8px 20px rgba(0,0,0,0.18),
      0 0 15px rgba(228,107,60,0.35),
      0 0 35px rgba(228,107,60,0.18)
    `,
    transition: "0.3s",
    marginTop: "60px",
  },
  passwordBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  eyeIcon: {
    cursor: "pointer",
    color: "#e46b3c",
    fontSize: "22px",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#ddd",
    position: "relative",
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: "absolute",
    bottom: "-2px",
    left: "5px",
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "#fff",
    border: "1px solid #ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    cursor: "pointer",
  },
  smallText: {
    color: "gray",
  },
  profileField: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #ddd",
  },
  logoutBtn: {
    display: "block",
    margin: "25px auto 0",
    padding: "10px 30px",
    border: "none",
    borderRadius: "20px",
    background: "#e46b3c",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
  /* RECIPE */
  recipeContainer:{
    width:"800px",
    minHeight:"400px",

    display:"flex",
    flexWrap:"wrap",

    gap:"20px",

    alignContent:"flex-start",

    padding:"20px",

    background:"#f8efe8",
    borderRadius:"25px",
  },
  recipeSection: {
    marginTop: "60px",
    background: "#f4ebe2",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
  },
  recipeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 250px)",
    justifyContent: "center",
    gap: "25px",
    width: "100%",
  },
  editBtn: {
    border: "none",
    background: "#df6d4f",
    color: "#fff",
    padding: "10px 25px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
    marginLeft: "10px",
    height: "30px"
  },
  btnRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '10px',
    width: '100%',
  },
  deleteBtn: {
    flex: 1,
    background: '#c0392b',
    border: 'none',
    color: '#fff',
    padding: '10px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    fontSize: '42px',
    color: '#666',
  },
  deleteFloatingBtn: {
    position: "absolute",
    top: "12px",
    right: "12px",
    width: "38px",
    height: "38px",
    border: "none",
    borderRadius: "50%",
    background: "#fff",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transition: "all 0.2s ease",
  },
  card: {
    background: "#fff",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    width: "250px",
  },
  cardImg: {
    width: "100%",
    height: "120px",
    objectFit: "cover",
  },
  cardImgWrapper: {
    position: "relative",
  },
  cardBody: {
    padding: "12px 15px",
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    margin: "0 0 10px 0",
    lineHeight: "1.3",
    marginTop: "-5px",
  },
  infoRow: {
    display: "flex",
    gap: "8px",
    fontSize: "11px",
    color: "#555",
    margin: "0",
    marginTop: "0px",
  },
  bottomRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0",
    marginTop: "10px",
  },
  iconText: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
    color: "#555",
    fontWeight: "700",
  },
  materialIcon: {
    fontSize: "18px",
  },
  rating: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    fontSize: "14px",
  },
  star: {
    fontSize: "20px",
    color: "#FFC107", 
  },
  starEmpty: {
    fontSize: "22px",
    color: "#ddd", 
  },
  btnLihat: {
    background: "#d86936",
    color: "#fff",
    border: "none",
    padding: "6px 22px",
    borderRadius: "20px",
    cursor: "pointer",
  },
  bookmarkBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "none",
    background: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
  bookmark: {
    color: "#555",
  },
 bookmarkActive: {
  fontSize: "24px",
  color: "#E46B3C",
  fontVariationSettings:
    "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
},
  ratingNumber: {
    fontWeight: "700",
    fontSize: "15px",
    color: "#000",
    marginRight: "1px",
  },

  profileModern:{
    width:"700px",
    background:"#fff",
    borderRadius:"10px",
    overflow:"hidden",
    boxShadow:"0 4px 15px rgba(0,0,0,0.15)",
    position:"relative", // tambahkan ini
  },

  profileBanner:{
    height:"120px",
    background:"linear-gradient(90deg,#B26D00,#E2856E)",
  },

  profilePhotoWrapper:{
    position:"absolute",
    top:"70px",
    left:"30px",
    zIndex:"10",
  },

  profileContent:{
    padding:"55px 30px 30px",
  },

  inputRow:{
    display:"flex",
    gap:"20px",
    marginTop:"10px",
  },

  inputGroupModern:{
    flex:1,
  },

  labelModern:{
    display:"block",
    marginBottom:"10px",

    color:"#8d7a68",

    fontSize:"12px",
    fontWeight:"600",

    letterSpacing:"1px",
  },

  inputModern:{
    display: "flex", // Tambahkan flexbox
    alignItems: "center", // Pusatkan elemen secara vertikal
    justifyContent: "space-between", // Dorong ikon pensil ke ujung kanan
    width: "100%", // Ganti dari 90% menjadi 100%
    boxSizing: "border-box", // Pastikan padding tidak merusak lebar elemen
    height: "42px", // Sedikit dipertinggi agar lebih proporsional
    border: "1px solid #ead3c3",
    borderRadius: "8px",
    padding: "0 14px",
    fontSize: "14px",
    background: "#fffaf8",
    color: "#333",
  },

  editPencil:{
    color:"#d4b6a4",
    fontSize:"20px",
    cursor: "pointer",
  },

  securityTitle:{
    marginTop:"25px",

    color:"#8d7a68",

    fontSize:"12px",
    fontWeight:"600",

    letterSpacing:"1px",
  },

  passwordCard:{
    border:"1px solid #ead3c3",
    borderRadius:"8px",
    padding:"16px",
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    marginTop:"12px",
  },

  passwordLeft:{
    display:"flex",
    gap:"15px",
    alignItems:"center",
  },

  lockIcon:{
    color:"#a66b09",
    fontSize:"28px",
  },

  passwordLabel:{
    fontWeight:"500",
  },

  passwordDots:{
    color:"#c6b3a8",
    letterSpacing:"3px",
  },

  changeBtn:{
    border:"none",
    background:"transparent",

    color:"#a66b09",

    fontWeight:"700",

    cursor:"pointer",

    fontSize:"15px",
  },

  separator:{
    height:"1px",
    background:"#eee",
    marginTop:"25px",
  },

  logoutWrapper:{
    display:"flex",
    justifyContent:"flex-end",
    marginTop:"30px",
  },

  logoutModern:{
    background:
    "linear-gradient(90deg,#a66300,#c54500)",

    color:"#fff",
    border:"none",

    padding:"10px 30px",

    borderRadius:"25px",

    fontSize:"14px",
    fontWeight:"700",

    display:"flex",
    alignItems:"center",
    gap:"8px",

    cursor:"pointer",

    boxShadow:"0 4px 10px rgba(0,0,0,0.15)",
  },

  sidebarTitle:{
    fontSize:"26px",
    fontWeight:"700",
    color:"#9c5b00",
    marginBottom:"22px",
  },

  menuLeft:{
    display:"flex",
    alignItems:"center",
    gap:"10px",
  },

  menuIcon:{
    fontSize:"20px",
  },

  addRecipeCard:{
    width:"290px",
    background:"#fff",
    borderRadius:"14px",
    padding:"25px 20px",
    marginTop:"25px",

    textAlign:"center",

    cursor:"pointer",

    transition:"0.2s",

    boxShadow:"0 4px 12px rgba(0,0,0,0.08)",
  },

  addIcon:{
    width:"50px",
    height:"50px",

    margin:"0 auto 15px",

    borderRadius:"50%",

    background:"#f2e5dd",

    display:"flex",
    justifyContent:"center",
    alignItems:"center",

    color:"#6d5545",
  },

  addTitle:{
    fontSize:"18px",
    fontWeight:"700",

    color:"#4d4037",

    marginBottom:"10px",
  },

  addDesc:{
    fontSize:"14px",

    color:"#999",

    lineHeight:"1.6",
  },

  leftSection:{
    display:"flex",
    flexDirection:"column",
    width:"290px",
  },

  rightSection:{
    display:"flex",
    flexDirection:"column",
  },

  pageTitle:{
    fontSize:"42px",
    fontWeight:"700",
    color:"#1f1a17",

    textShadow:"0 2px 8px rgba(255,255,255,0.9)",

    marginBottom:"25px",
    marginTop:"-15px",
  },

  savedRecipeCard:{
    width:"330px",
    height:"220px",

    background:"#fff",

    borderRadius:"14px",

    marginTop:"120px",
    marginLeft:"-18px",

    display:"flex",
    flexDirection:"column",

    justifyContent:"center",
    alignItems:"center",

    textAlign:"center",

    boxShadow:"0 4px 12px rgba(0,0,0,0.08)",
  },

  savedRecipeIcon:{
    width:"52px",
    height:"52px",

    borderRadius:"50%",

    background:"#f2e5dd",

    display:"flex",
    justifyContent:"center",
    alignItems:"center",

    color:"#9d8878",

    marginBottom:"18px",
  },

  savedRecipeMaterial:{
    fontSize:"26px",
  },

  savedRecipeText:{
    width:"140px",

    color:"#a08b7c",

    fontSize:"15px",

    fontWeight:"500",

    lineHeight:"1.6",

    margin:0,
  },

  profilePhoto: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #fff",
    background: "#ddd",
  },

profilePlaceholder: {
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  background: "#ddd",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "50px",
},

cameraBtn:{
  position:"absolute",
  right:"-5px",
  bottom:"0px",
  width:"28px",
  height:"28px",
  borderRadius:"50%",
  background:"#b77700",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  cursor:"pointer",
  border:"2px solid white",
},
photoMenu: {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#fff",
  borderRadius: "20px",
  padding: "24px",
  width: "420px",
  zIndex: "99999",
  border: "2px solid #E46B3C",
  boxShadow: `
    0 10px 30px rgba(0,0,0,0.15),
    0 0 15px rgba(228,107,60,0.25)
  `,
},
photoTitle: {
  fontSize: "30px",
  fontWeight: "700",
  color: "#1f2937",
  marginBottom: "8px",
},

photoSubtitle: {
  fontSize: "15px",
  color: "#6b7280",
  marginBottom: "20px",
},

photoAction: {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "18px",
  border: "1px solid #e5e7eb",
  borderRadius: "16px",
  cursor: "pointer",
  marginBottom: "12px",
  transition: "all 0.25s ease",
},

photoIcon: {
  width: "52px",
  height: "52px",
  borderRadius: "50%",
  background: "#fff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  flexShrink: 0,
},

photoTextWrapper: {
  flex: 1,
},

photoMainText: {
  fontSize: "16px",
  fontWeight: "700",
  color: "#111827",
},

photoSubText: {
  fontSize: "14px",
  color: "#6b7280",
  marginTop: "4px",
},

cancelAction: {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "18px",
  borderRadius: "16px",
  background: "#f3f4f6",
  cursor: "pointer",
  marginTop: "10px",
},
photoOption:{
  border:"none",
  background:"#f5f5f5",
  padding:"12px",
  borderRadius:"8px",
  cursor:"pointer",
  textAlign:"left",
  fontSize:"14px",
  transition:"0.2s",
},
modalOverlay:{
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
},
modalBox:{
  background:"#fff",
  padding:"25px",
  borderRadius:"12px",
  width:"350px",
  textAlign:"center",
  boxShadow:"0 5px 20px rgba(0,0,0,0.2)",
},

modalTitle:{
  margin:"0 0 10px",
  color:"#333",
  fontSize:"22px",
},

modalText:{
  color:"#666",
  marginBottom:"20px",
},

modalActions:{
  display:"flex",
  justifyContent:"center",
  gap:"12px",
},

btnCancel:{
  padding:"10px 20px",
  border:"none",
  borderRadius:"8px",
  background:"#dddddd",
  cursor:"pointer",
},

btnConfirm:{
  padding:"10px 20px",
  border:"none",
  borderRadius:"8px",
  background:"#c54500",
  color:"#fff",
  cursor:"pointer",
},
nameInput:{
  border:"none",
  outline:"none",
  background:"transparent",
  width:"100%",
  fontSize:"14px",
},

passwordInput: {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  boxSizing: "border-box",
  outline: "none",
},
passwordWrapper: {
  position: "relative",
  width: "100%",
  marginBottom: "12px",
},

eyeButton: {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  color: "#666",
},
buttonGroup: {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  marginTop: "20px",
},
menuButton: {
  border: "1px solid #ddd",
  background: "#fff",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
},

logoutButton: {
  background: "#c54500",
  color: "#fff",
  border: "none",
  padding: "10px 24px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
},
};

export default Profil;