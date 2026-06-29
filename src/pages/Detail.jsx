import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ProfileAvatar from "../components/ProfileAvatar";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [komentar, setKomentar] = useState([]);
  const [isiKomentar, setIsiKomentar] = useState("");
  const [rating, setRating] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [user, setUser] = useState({});
  const [showMenu, setShowMenu] = useState(false); // State untuk Sidebar Mobile

  useEffect(() => {
    api.get(`/my-rating/${id}`)
      .then((res) => {
        if (res.data.status) {
          setRating(res.data.star);
        }
      })
      .catch((err) => console.log(err));

    api.get('/my-likes')
      .then((res) => {
        const likedIds = res.data.map(item => item.food_id);
        if (likedIds.includes(Number(id))) {
          setLiked(true);
        }
      })
      .catch((err) => console.log(err));

    api.get('/profile')
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => console.log(err));

    api.get(`/resep/${id}`)
      .then((res) => {
        setFood(res.data.resep);
        setKomentar(res.data.komentar || []);
        
        api.get('/my-bookmarks')
          .then((bookmarkRes) => {
            const bookmarkIds = bookmarkRes.data.map(item => item.id);
            if (bookmarkIds.includes(Number(id))) {
              setBookmarked(true);
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));

  }, [id]);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;

  if (!food) {
    return <div style={{ textAlign: "center", padding: "50px", fontWeight: "bold", color: "#9F6822" }}>Memuat Resep...</div>;
  }

  const bahanArray = (() => {
    if (!food?.bahan) return [];
    try {
      return JSON.parse(food.bahan);
    } catch {
      return food.bahan.split('\n').filter(item => item.trim() !== '');
    }
  })();

  const langkahArray = (() => {
    if (!food?.langkah) return [];
    try {
      return JSON.parse(food.langkah);
    } catch {
      return food.langkah.split('\n').filter(item => item.trim() !== '');
    }
  })();

  const kirimKomentar = async () => {
    if (!isiKomentar) {
      return alert("Tulis komentar dulu");
    }
    try {
      const response = await api.post(`/komentar/${id}`, { komentar: isiKomentar });
      setKomentar([response.data.komentarBaru, ...komentar]);
      setIsiKomentar("");
    } catch (err) {
      console.log(err);
      alert("Gagal kirim komentar");
    }
  };

  const handleLike = async () => {
    try {
      const response = await api.post(`/like/${id}`);
      setLiked(response.data.liked);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBookmark = async () => {
    try {
      const response = await api.post(`/bookmark/${id}`);
      setBookmarked(response.data.bookmarked);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRating = async (value) => {
    try {
      setRating(value);
      const response = await api.post(`/rating/${id}`, { star: value });
      setFood({ ...food, rating: response.data.rating });
    } catch (err) {
      console.log(err);
    }
  };

  const formatWaktu = (tanggal) => {
    if (!tanggal) return "Baru saja";
    const now = new Date();
    const commentDate = new Date(tanggal);
    const diffMs = now - commentDate;
    const menit = Math.floor(diffMs / 60000);
    const jam = Math.floor(diffMs / 3600000);
    const hari = Math.floor(diffMs / 86400000);

    if (menit < 1) return "Baru saja";
    if (menit < 60) return `${menit} menit lalu`;
    if (jam < 24) return `${jam} jam lalu`;
    if (hari < 7) return `${hari} hari lalu`;
    return commentDate.toLocaleDateString("id-ID");
  };

  return (
    <div style={styles.page}>
      
      {/* NAVBAR */}
      {isMobile ? (
        // HEADER MOBILE (Sesuai Gambar Referensi)
        <div style={styles.mobileNavbar}>
          <span
            className="material-symbols-outlined"
            style={styles.mobileMenuIcon}
            onClick={() => setShowMenu(true)}
          >
            menu
          </span>

          <div style={styles.mobileHeaderTitle}>
            <span className="material-symbols-outlined" style={styles.mobileHeaderIcon}>
              menu_book
            </span>
            Detail Resep
          </div>

          <ProfileAvatar
            user={user}
            size={38}
            onClick={() => navigate("/profil")}
          />
        </div>
      ) : (
        // HEADER DESKTOP / TABLET
        <div style={styles.desktopNavbar}>
          <div style={styles.logoArea} onClick={() => navigate("/dashboardafterlogin")}>
            <img src="/logo_X.png" alt="logo" style={styles.logoImg} />
            <div style={styles.logoText}>pLorra</div>
          </div>

          <div style={styles.desktopHeaderTitle}>Detail Resep</div>

          <div style={styles.menuArea}>
            <div style={styles.menu}>
              <span style={styles.navItem} onClick={() => navigate("/dashboardafterlogin")}>Home</span>
              <span style={styles.navItem} onClick={() => navigate("/profil")}>Profile</span>
              <span style={styles.navItem} onClick={() => navigate("/notifikasi")}>Notifikasi</span>
            </div>
            <ProfileAvatar
              user={user}
              size={38}
              onClick={() => navigate("/profil")}
            />
          </div>
        </div>
      )}

      {/* SIDEBAR MOBILE */}
      {isMobile && showMenu && (
        <>
          <div style={styles.mobileOverlay} onClick={() => setShowMenu(false)} />
          <div style={styles.mobileSidebar}>
            
            {/* AREA LOGO & TOMBOL SILANG */}
            <div style={styles.mobileLogoSection}>
              <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <img src="/logo_X.png" alt="" style={{ width: "40px" }} />
                <span style={styles.mobileLogoText}>pLorra</span>
              </div>
              
              {/* ICON SILANG UNTUK MENUTUP MENU */}
              <span 
                className="material-symbols-outlined" 
                style={styles.mobileCloseIcon}
                onClick={() => setShowMenu(false)}
              >
                close
              </span>
            </div>
            
            <div style={styles.mobileMenuTitle}></div>
            <div style={styles.mobileMenuItem} onClick={() => { navigate("/dashboardafterlogin"); setShowMenu(false); }}>
              Dashboard
            </div>
            <div style={styles.mobileMenuItem} onClick={() => { navigate("/notifikasi"); setShowMenu(false); }}>
              Notifikasi
            </div>
            <div style={styles.mobileMenuItem} onClick={() => { navigate("/profil"); setShowMenu(false); }}>
              Profil
            </div>
          </div>
        </>
      )}

      {/* HERO IMAGE SECTION */}
      <div
        style={{
          ...styles.heroSection,
          height: isMobile ? "300px" : isTablet ? "450px" : "550px",
        }}
      >
        <img src={`https://xplorra-production.up.railway.app/uploads/${food.gambar}`} alt={food.nama} style={styles.heroImg} />
        <div
          style={{
            ...styles.heroOverlay,
            padding: isMobile ? "20px" : isTablet ? "40px" : "50px",
          }}
        >
          <div style={styles.heroTextContainer}>
           <h1
              style={{
                ...styles.heroTitle,
                fontSize: isMobile ? "32px" : isTablet ? "48px" : "58px",
              }}
            >
              {food.nama}
            </h1>
            <p
              style={{
                ...styles.heroSubtitle,
                fontSize: isMobile ? "16px" : isTablet ? "20px" : "24px",
                marginBottom: isMobile ? "15px" : "25px"
              }}
            >Berasal dari {food.daerah}</p>
            <div style={{ ...styles.heroActions, flexWrap: "wrap" }}>
              <button 
                title={liked ? "Batal menyukai" : "Suka resep ini"} 
                style={{
                  ...styles.actionBtn,
                  background: liked ? "#C86B3E" : "rgba(255,255,255,0.3)",
                  padding: isMobile ? "8px 16px" : "10px 22px",
                  fontSize: isMobile ? "13px" : "15px",
                }} 
                onClick={handleLike}
              >
                <span className="material-symbols-outlined" style={{...styles.btnIcon, fontSize: isMobile ? "16px" : "18px"}}>thumb_up</span>
                {liked ? "Suka" : "Suka"}
              </button>

              <button 
                title={bookmarked ? "Resep Tersimpan" : "Simpan Resep Ini"} 
                style={{
                  ...styles.actionBtn, 
                  background: bookmarked ? '#9F6822' : 'rgba(255,255,255,0.3)',
                  padding: isMobile ? "8px 16px" : "10px 22px",
                  fontSize: isMobile ? "13px" : "15px",
                }} 
                onClick={handleBookmark}
              >
                <span className="material-symbols-outlined" style={{...styles.btnIcon, fontSize: isMobile ? "16px" : "18px"}}>bookmark</span>
                {bookmarked ? "Simpan" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div
        style={{
          ...styles.mainGrid,
          gridTemplateColumns: isDesktop ? "1fr 2fr" : "1fr",
          gap: isMobile ? "20px" : isTablet ? "40px" : "90px",
          marginTop: isMobile ? "30px" : "50px",
          padding: isMobile ? "0 15px" : "0 20px",
          maxWidth: isDesktop ? "1450px" : "1200px",
        }}
      >
        {/* LEFT COLUMN */}
        <div style={styles.leftColumn}>
          {/* CREATOR CARD */}
          <div style={{ ...styles.card, padding: isMobile ? "20px" : "30px" }}>
            <div style={{...styles.creatorHeader, gap: isMobile ? "10px" : "15px"}}>
              <div style={{...styles.creatorAvatar, width: isMobile ? "50px" : "60px", height: isMobile ? "50px" : "60px"}}>
                {food.creator_foto ? (
                  <img src={`https://xplorra-production.up.railway.app/uploads/${food.creator_foto}`} alt="creator" style={styles.creatorImg} />
                ) : (
                  <span className="material-symbols-outlined">person</span>
                )}
              </div>
              <div>
                <h3 style={{...styles.creatorName, fontSize: isMobile ? "16px" : "18px"}}>{food.creator}</h3>
                <span style={styles.creatorRole}>Pembuat Resep Asli</span>
              </div>
            </div>
            <p style={{...styles.creatorDesc, fontSize: isMobile ? "12px" : "13px"}}>{food.deskripsi ? `"${food.deskripsi}"` : "Tidak ada deskripsi"}</p>
          </div>

          {/* INGREDIENTS CARD */}
          <div style={{ ...styles.card, padding: isMobile ? "20px" : "30px" }}>
            <h3 style={{...styles.cardTitle, fontSize: isMobile ? "18px" : "20px"}}>
              <span className="material-symbols-outlined" style={{...styles.titleIcon, fontSize: isMobile ? "20px" : "24px"}}>restaurant_menu</span>
              Bahan-bahan
            </h3>
            <div style={styles.ingredientList}>
              {bahanArray.map((item, index) => (
                <div key={index} style={styles.ingredientItem}>
                  <span className="material-symbols-outlined" style={styles.bulletIcon}>check_circle</span>
                  <span style={{
                    fontSize: isMobile ? "13px" : isDesktop ? "17px" : "14px" // Ditambah ke 17px di desktop
                  }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div 
          style={{
            ...styles.rightColumn, 
            gap: isMobile ? "25px" : "40px",
            paddingLeft: isDesktop ? "20px" : "0px" 
          }}
        >
          
          {/* STEPS CARD */}
          <div style={{...styles.card, backgroundColor: "#FFFFFF", padding: isMobile ? "20px" : "30px"}}>
            <h3 style={{...styles.cardTitle, fontSize: isMobile ? "18px" : isDesktop ? "24px" : "20px"}}>
              <span className="material-symbols-outlined" style={{...styles.titleIcon, fontSize: isMobile ? "20px" : "24px"}}>local_dining</span>
              Langkah-langkah Memasak
            </h3>
            <div style={styles.stepList}>
              {langkahArray.map((item, index) => (
                <div key={index} style={{...styles.stepItem, gap: isMobile ? "15px" : "20px"}}>
                  <div style={{
                    ...styles.stepNumber, 
                    minWidth: isMobile ? "30px" : isDesktop ? "40px" : "35px", // Wadah angka diperbesar sedikit
                    height: isMobile ? "30px" : isDesktop ? "40px" : "35px",
                    fontSize: isMobile ? "14px" : isDesktop ? "18px" : "16px"
                  }}>
                    {index + 1}
                  </div>
                  <div style={{
                    ...styles.stepText, 
                    fontSize: isMobile ? "13px" : isDesktop ? "17px" : "14px" // Isi teks ditambah ke 17px di desktop
                  }}>
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RATING CARD */}
          <div style={{...styles.card, textAlign: "center", padding: isMobile ? "25px 15px" : "40px 20px"}}>
            <h3 style={{...styles.cardTitle, justifyContent: "center", marginBottom: "15px", color: "#8E5E41", fontSize: isMobile ? "16px" : "20px"}}>
              Seberapa suka anda terhadap resep ini?
            </h3>
            <div style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleRating(star)}
                  style={{
                    ...styles.starIcon,
                    color: star <= rating ? '#E28E46' : '#C4A89A',
                    fontSize: isMobile ? "35px" : "45px"
                  }}
                >
                  {star <= rating ? '★' : '☆'}
                </span>
              ))}
            </div>
            <p style={styles.ratingSubtext}>Klik untuk memberikan nilai</p>
          </div>

          {/* COMMENTS SECTION */}
          <div style={styles.commentsContainer}>
            <h3 style={{...styles.commentHeader, fontSize: isMobile ? "16px" : "18px"}}>Komentar ({komentar.length})</h3>
            
            {/* INPUT CARD */}
            <div style={{...styles.inputCard, padding: isMobile ? "15px" : "20px"}}>
              <div style={styles.inputWrapper}>
                <div style={{...styles.commentUserAvatar, width: isMobile ? "35px" : "40px", height: isMobile ? "35px" : "40px"}}>
                  {user.foto ? (
                    <img src={`https://xplorra-production.up.railway.app/uploads/${user.foto}`} alt="user" style={styles.creatorImg} />
                  ) : (
                    <span className="material-symbols-outlined" style={{fontSize: isMobile ? "18px" : "24px"}}>person</span>
                  )}
                </div>
                <input 
                  type="text" 
                  placeholder="Tulis Komentar..." 
                  style={{...styles.commentInput, fontSize: isMobile ? "13px" : "14px"}} 
                  value={isiKomentar}
                  onChange={(e) => setIsiKomentar(e.target.value)}
                />
              </div>
              <div style={styles.sendBtnWrapper}>
                <button style={{...styles.sendBtn, padding: isMobile ? "6px 20px" : "8px 25px", fontSize: isMobile ? "13px" : "14px"}} onClick={kirimKomentar}>Kirim</button>
              </div>
            </div>

            {/* COMMENT LIST */}
            <div style={styles.commentList}>
              {komentar.map((item, index) => (
                <div key={index} style={{...styles.commentCard, padding: isMobile ? "15px" : "20px"}}>
                  <div style={{...styles.commentRow, gap: isMobile ? "10px" : "15px"}}>
                    <div style={{...styles.commentUserAvatar, width: isMobile ? "35px" : "40px", height: isMobile ? "35px" : "40px"}}>
                      {item.foto ? (
                        <img
                          src={`https://xplorra-production.up.railway.app/uploads/${item.foto}`}
                          alt="user"
                          style={styles.creatorImg}
                        />
                      ) : (
                        <span className="material-symbols-outlined" style={{fontSize: isMobile ? "18px" : "24px"}}>
                          person
                        </span>
                      )}
                    </div>
                    <div style={styles.commentContent}>
                      <div style={styles.commentTop}>
                        <span style={{...styles.commentName, fontSize: isMobile ? "14px" : "15px"}}>
                          {item.nama}
                        </span>
                        <span style={{...styles.commentDate, fontSize: isMobile ? "10px" : "12px"}}>
                          {formatWaktu(item.created_at)}
                        </span>
                      </div>
                      <p style={{...styles.commentTextContent, fontSize: isMobile ? "13px" : "14px"}}>
                        {item.komentar}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "rgba(193, 119, 84, 0.65)",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    paddingBottom: "80px",
    width: "100%",
    maxWidth: "100vw",
    overflowX: "hidden",
    boxSizing: "border-box",
  },

  /* --- HEADER MOBILE (Sesuai Gambar) --- */
  mobileNavbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: "12px 20px",
    position: "sticky",
    top: 0,
    zIndex: 999,
    width: "100%",
    boxSizing: "border-box",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  mobileMenuIcon: {
    fontSize: "30px",
    color: "#9F6822",
    cursor: "pointer",
  },
  mobileHeaderTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#9F6822",
    fontWeight: "700",
    fontSize: "20px",
  },
  mobileHeaderIcon: {
    fontSize: "24px",
  },

  /* --- HEADER DESKTOP --- */
  desktopNavbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: "12px 30px",
    position: "sticky",
    top: 0,
    zIndex: 999,
    width: "100%",
    boxSizing: "border-box",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  logoArea: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  logoImg: {
    width: "40px",
  },
  logoText: {
    color: "#E28B36",
    fontWeight: "bold",
    fontSize: "22px",
    marginLeft: "5px",
  },
  desktopHeaderTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#9F6822",
    textAlign: "center",
  },
  menuArea: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },
  menu: {
    display: "flex",
    gap: "25px",
  },
  navItem: {
    fontWeight: "bold",
    color: "#111",
    cursor: "pointer",
    fontSize: "15px",
  },
  
  /* --- PROFILE CIRCLE (Digunakan Desktop & Mobile) --- */
  profileCircle: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    backgroundColor: "#F2AB82",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFF",
    cursor: "pointer",
    overflow: "hidden",
  },
  profileImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    imageRendering: "high-quality",
  },

  /* --- SIDEBAR MOBILE --- */
  mobileOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 1001,
  },
  mobileSidebar: {
    position: "fixed",
    top: 0, left: 0,
    width: "260px",
    height: "100vh",
    background: "#F7F1EC",
    zIndex: 1002,
    padding: "20px",
    boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
    boxSizing: "border-box",
  },
  mobileLogoSection: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #ddd",
    paddingBottom: "12px",
  },
  mobileLogoText: {
    color: "#E28B36",
    fontSize: "24px",
    fontWeight: "700",
    marginLeft: "8px",
  },
  mobileMenuTitle: {
    marginTop: "20px",
    marginBottom: "15px",
    fontWeight: "700",
    fontSize: "18px",
    color: "#5E4637",
  },
  mobileMenuItem: {
    padding: "12px 10px",
    fontSize: "16px",
    cursor: "pointer",
    color: "#333",
    fontWeight: "500",
  },

  /* --- KONTEN HALAMAN --- */
  heroSection:{
    position:"relative",
    width:"100%",
    boxSizing: "border-box", 
  },
  heroImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    imageRendering: "high-quality",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)",
    display: "flex",
    alignItems: "flex-end",
    boxSizing: "border-box", 
  },
  heroTextContainer: {
    width: "100%",
    maxWidth: "100%",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    margin: "0",
    lineHeight: "1.2",
    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
    whiteSpace: "normal",
    wordBreak: "break-word",
    overflowWrap: "break-word",
  },
  heroSubtitle: {
    color: "#FFFFFF",
    marginTop: "8px",
    textShadow: "0 2px 8px rgba(0,0,0,0.5)",
  },
  heroActions: {
    display: "flex",
    gap: "10px",
  },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: "none",
    borderRadius: "25px",
    color: "#FFF",
    fontWeight: "600",
    cursor: "pointer",
    backdropFilter: "blur(5px)",
  },
  btnIcon: {},
  mainGrid:{
    display:"grid",
    maxWidth:"1200px",
    margin:"0 auto",
    width: "100%",
    boxSizing: "border-box", 
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    width: "100%",
    boxSizing: "border-box",
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    boxSizing: "border-box",
  },
  card: {
    backgroundColor: "#F7EBE2",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(159, 104, 34, 0.25)",
    width: "100%",
    boxSizing: "border-box", 
  },
  creatorHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  creatorAvatar: {
    borderRadius: "50%",
    backgroundColor: "#D9D9D9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  creatorImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  creatorName: {
    margin: 0,
    color: "#4A3222",
  },
  creatorRole: {
    fontSize: "12px",
    color: "#8E5E41",
  },
  creatorDesc: {
    color: "#5E4637",
    fontStyle: "italic",
    lineHeight: "1.5",
    margin: 0,
  },
  cardTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: "0 0 15px 0",
    color: "#4A3222",
  },
  titleIcon: {
    color: "#9F6822",
  },
  ingredientList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  ingredientItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    color: "#4A3222",
    lineHeight: "1.4",
  },
  bulletIcon: {
    fontSize: "16px",
    color: "#9F6822",
    marginTop: "2px",
  },
  stepList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  stepItem: {
    display: "flex",
    alignItems: "flex-start",
  },
  stepNumber: {
    backgroundColor: "#D98857",
    color: "#FFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "8px",
    fontWeight: "bold",
  },
  stepText: {
    color: "#4A3222",
    lineHeight: "1.5",
    marginTop: "2px",
  },
  starsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "8px",
  },
  starIcon: {
    cursor: "pointer",
    transition: "0.2s",
  },
  ratingSubtext: {
    fontSize: "12px",
    color: "#8E5E41",
    margin: 0,
  },
  commentsContainer: {
    marginTop: "10px",
  },
  commentHeader: {
    color: "#4A3222",
    marginBottom: "12px",
  },
  inputCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "15px",
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    width: "100%",
    boxSizing: "border-box", 
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  commentInput: {
    flex: 1,
    border: "none",
    outline: "none",
    color: "#4A3222",
    width: "100%",
  },
  sendBtnWrapper: {
    display: "flex",
    justifyContent: "flex-end",
  },
  sendBtn: {
    backgroundColor: "#9A5D20",
    color: "#FFF",
    border: "none",
    borderRadius: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
  commentList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxHeight: "400px",
    overflowY: "auto",
    paddingRight: "5px",
  },
  commentRow: {
    display: "flex",
    alignItems: "flex-start",
  },
  commentContent: {
    flex: 1,
  },
  commentTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
  },
  commentCard: {
    backgroundColor: "#F7EBE2",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    width: "100%",
    boxSizing: "border-box", 
  },
  commentUserAvatar: {
    borderRadius: "50%",
    backgroundColor: "#D9D9D9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    flexShrink: 0,
  },
  commentName: {
    fontWeight: "700",
    color: "#4A3222",
  },
  commentDate: {
    color: "#8E5E41",
  },
  commentTextContent: {
    marginTop: "4px",
    marginBottom: 0,
    color: "#5E4637",
    lineHeight: "1.4",
  },
  mobileCloseIcon: {
    fontSize: "28px",
    color: "#9F6822",
    cursor: "pointer",
    padding: "4px",
  },
};

export default Detail;