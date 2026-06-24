import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

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

        console.log(res.data.komentar);
        setFood(res.data.resep);
        setKomentar(res.data.komentar);
        
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

  if (!food) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;
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
      const resepBaru = await api.get(`/resep/${id}`);
      setFood(resepBaru.data.resep);
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
      <div style={styles.navbar}>
        <div style={styles.logoArea} onClick={() => navigate("/dashboardafterlogin")}>
          <img src="/logo_X.png" alt="logo" style={styles.logoImg} />
          <div style={styles.logoText}>pLorra</div>
        </div>

        {/* JUDUL DI TENGAH */}
        <div style={styles.headerTitle}>Detail Resep</div>

        <div style={styles.menuArea}>
          <div style={styles.menu}>
            <span style={styles.navItem} onClick={() => navigate("/dashboardafterlogin")}>Home</span>
            <span style={styles.navItem} onClick={() => navigate("/profil")}>Profil</span>
            <span style={styles.navItem} onClick={() => navigate("/notifikasi")}>Notifikasi</span>
          </div>
          <div
            style={styles.profileCircle}
            onClick={() => navigate("/profil")}
          >
            {user.foto ? (
              <img src={`https://xplorra-production.up.railway.app/uploads/${user.foto}`} alt="Profile" style={styles.profileImg} />
            ) : (
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>person</span>
            )}
          </div>
        </div>
      </div>

      {/* HERO IMAGE SECTION */}
      <div style={styles.heroSection}>
        <img src={`https://xplorra-production.up.railway.app/uploads/${food.gambar}`} alt={food.nama} style={styles.heroImg} />
        <div style={styles.heroOverlay}>
          <div style={styles.heroTextContainer}>
            <h1 style={styles.heroTitle}>{food.nama}</h1>
            <p style={styles.heroSubtitle}>Berasal dari {food.daerah}</p>
            <div style={styles.heroActions}>
              {/* BUTTON SUKA */}
              <button 
                title={liked ? "Batal menyukai" : "Suka resep ini"} 
                style={{...styles.actionBtn, background: liked ? '#C86B3E' : 'rgba(255,255,255,0.3)'}} 
                onClick={handleLike}
              >
                <span className="material-symbols-outlined" style={styles.btnIcon}>thumb_up</span>
                {liked ? "Suka" : "Suka"}
              </button>

              {/* BUTTON SIMPAN */}
              <button 
                title={bookmarked ? "Resep Tersimpan" : "Simpan Resep Ini"} 
                style={{...styles.actionBtn, background: bookmarked ? '#9F6822' : 'rgba(255,255,255,0.3)'}} 
                onClick={handleBookmark}
              >
                <span className="material-symbols-outlined" style={styles.btnIcon}>bookmark</span>
                {bookmarked ? "Simpan" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div style={styles.mainGrid}>
        
        {/* LEFT COLUMN */}
        <div style={styles.leftColumn}>
          
          {/* CREATOR CARD */}
          <div style={styles.card}>
            <div style={styles.creatorHeader}>
              <div style={styles.creatorAvatar}>
                {food.creator_foto ? (
                  <img src={`https://xplorra-production.up.railway.app/uploads/${food.creator_foto}`} alt="creator" style={styles.creatorImg} />
                ) : (
                  <span className="material-symbols-outlined">person</span>
                )}
              </div>
              <div>
                <h3 style={styles.creatorName}>{food.creator}</h3>
                <span style={styles.creatorRole}>Pembuat Resep Asli</span>
              </div>
            </div>
            <p style={styles.creatorDesc}>"{food.deskripsi}"</p>
          </div>

          {/* INGREDIENTS CARD */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>
              <span className="material-symbols-outlined" style={styles.titleIcon}>restaurant_menu</span>
              Bahan-bahan
            </h3>
            <div style={styles.ingredientList}>
              {bahanArray.map((item, index) => (
                <div key={index} style={styles.ingredientItem}>
                  <span className="material-symbols-outlined" style={styles.bulletIcon}>check_circle</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div style={styles.rightColumn}>
          
          {/* STEPS CARD */}
          <div style={{...styles.card, backgroundColor: "#FFFFFF"}}>
            <h3 style={styles.cardTitle}>
              <span className="material-symbols-outlined" style={styles.titleIcon}>local_dining</span>
              Langkah-langkah Memasak
            </h3>
            <div style={styles.stepList}>
              {langkahArray.map((item, index) => (
                <div key={index} style={styles.stepItem}>
                  <div style={styles.stepNumber}>{index + 1}</div>
                  <div style={styles.stepText}>{item}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RATING CARD */}
          <div style={{...styles.card, textAlign: "center", padding: "40px 20px"}}>
            <h3 style={{...styles.cardTitle, justifyContent: "center", marginBottom: "15px", color: "#8E5E41"}}>
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
            <h3 style={styles.commentHeader}>Komentar ({komentar.length})</h3>
            
            {/* INPUT CARD */}
            <div style={styles.inputCard}>
              <div style={styles.inputWrapper}>
                <div style={styles.commentUserAvatar}>
                  {user.foto ? (
                    <img src={`https://xplorra-production.up.railway.app/uploads/${user.foto}`} alt="user" style={styles.creatorImg} />
                  ) : (
                    <span className="material-symbols-outlined">person</span>
                  )}
                </div>
                <input 
                  type="text" 
                  placeholder="Tulis Komentar..." 
                  style={styles.commentInput} 
                  value={isiKomentar}
                  onChange={(e) => setIsiKomentar(e.target.value)}
                />
              </div>
              <div style={styles.sendBtnWrapper}>
                <button style={styles.sendBtn} onClick={kirimKomentar}>Kirim</button>
              </div>
            </div>

            {/* COMMENT LIST */}
            <div style={styles.commentList}>
              {komentar.map((item, index) => (
                <div key={index} style={styles.commentCard}>
  <div style={styles.commentRow}>

    <div style={styles.commentUserAvatar}>
      {item.foto ? (
        <img
          src={`https://xplorra-production.up.railway.app/uploads/${item.foto}`}
          alt="user"
          style={styles.creatorImg}
        />
      ) : (
        <span className="material-symbols-outlined">
          person
        </span>
      )}
    </div>

    <div style={styles.commentContent}>

      <div style={styles.commentTop}>
        <span style={styles.commentName}>
          {item.nama}
        </span>

        <span style={styles.commentDate}>
          {formatWaktu(item.created_at)}
        </span>
      </div>

      <p style={styles.commentTextContent}>
        {item.komentar}
      </p>

    </div>

  </div>
</div>              ))}
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
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#FFFFFF",
    position: "sticky",
    top: 0,
    zIndex: 999,
    gap: "15px",
    flexWrap: "wrap",
  },
  logoArea: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    flex: 1,
  },
  logoImg: {
    width: "45px",
  },
  logoText: {
    color: "#E28B36",
    fontWeight: "bold",
    fontSize: "24px",
    marginLeft: "5px",
  },
  headerTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#9F6822",
    textAlign: "center",
    whiteSpace: "nowrap", // Warna cokelat/oranye menyesuaikan desain
  },
  menuArea: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "30px",
    flex: 1,
  },
  menu: {
    display: "flex",
    gap: "25px",
  },
  navItem: {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#111",
    cursor: "pointer",
  },
  profileCircle: {
    width: "38px",
    height: "38px",
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
  heroSection: {
    position: "relative",
    width: "100%",
    height: "600px", // Tinggi hero banner
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
  background:
    "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 100%)",
  display: "flex",
  alignItems: "flex-end",
  padding: "50px",
},
  heroTextContainer: {
    width: "100%",
  },

 heroTitle: {
  color: "#FFFFFF",
  fontSize: "58px",
  fontWeight: "700",
  margin: "0",
  lineHeight: "1.1",
  textShadow: "0 2px 10px rgba(0,0,0,0.4)",
},
heroSubtitle: {
  color: "#FFFFFF",
  fontSize: "24px",
  marginTop: "10px",
  marginBottom: "25px",
  textShadow: "0 2px 8px rgba(0,0,0,0.4)",
},
 heroActions: {
  display: "flex",
  gap: "12px",
},
actionBtn: {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  border: "none",
  padding: "10px 22px",
  borderRadius: "25px",
  color: "#FFF",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  backdropFilter: "blur(5px)",
},
  btnIcon: {
    fontSize: "18px",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr", // Kolom kiri lebih kecil
    gap: "80px",
    maxWidth: "1250px",
    margin: "100px auto 0 auto",
    padding: "0 20px",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "40px",
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "40px",
  },
 card: {
  backgroundColor: "#F7EBE2",
  borderRadius: "15px",
  padding: "30px",
  boxShadow: "0 16px 40px rgba(159, 104, 34, 0.35)",
},
  creatorHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px",
  },
  creatorAvatar: {
    width: "60px",
    height: "60px",
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
    imageRendering: "high-quality",
  },
  creatorName: {
    margin: 0,
    fontSize: "18px",
    color: "#4A3222",
  },
  creatorRole: {
    fontSize: "12px",
    color: "#8E5E41",
  },
  creatorDesc: {
    fontSize: "13px",
    color: "#5E4637",
    fontStyle: "italic",
    lineHeight: "1.6",
    margin: 0,
  },
  cardTitle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "0 0 20px 0",
    fontSize: "20px",
    color: "#4A3222",
  },
  titleIcon: {
    fontSize: "24px",
    color: "#9F6822",
  },
  ingredientList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  ingredientItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    fontSize: "14px",
    color: "#4A3222",
    lineHeight: "1.5",
  },
  bulletIcon: {
    fontSize: "16px",
    color: "#9F6822",
    marginTop: "2px",
  },
  stepList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  stepItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
  },
  stepNumber: {
    minWidth: "35px",
    height: "35px",
    backgroundColor: "#D98857",
    color: "#FFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "16px",
  },
  stepText: {
    fontSize: "14px",
    color: "#4A3222",
    lineHeight: "1.6",
    marginTop: "5px",
  },
  starsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "10px",
  },
  starIcon: {
    fontSize: "45px",
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
    fontSize: "18px",
    color: "#4A3222",
    marginBottom: "15px",
  },
 inputCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: "15px",
  padding: "20px",
  marginBottom: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
},
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  commentInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#4A3222",
  },
  sendBtnWrapper: {
    display: "flex",
    justifyContent: "flex-end",
  },
  sendBtn: {
    backgroundColor: "#9A5D20",
    color: "#FFF",
    border: "none",
    padding: "8px 25px",
    borderRadius: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
 commentList: {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  maxHeight: "500px",
  overflowY: "auto",
  paddingRight: "8px",
},

commentRow: {
  display: "flex",
  alignItems: "flex-start",
  gap: "15px",
},

commentContent: {
  flex: 1,
},
commentTop: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "6px",
},

 commentCard: {
  backgroundColor: "#F7EBE2",
  borderRadius: "15px",
  padding: "20px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
},
HeaderRow: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "10px",
  },
  commentUserAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#D9D9D9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  commentUserInfo: {
    display: "flex",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
  },
  commentName: {
  fontWeight: "700",
  color: "#4A3222",
  fontSize: "15px",
  },
  commentDate: {
    fontSize: "12px",
    color: "#8E5E41",
  },
  commentTextContent: {
  marginTop: "6px",
  marginBottom: 0,
  fontSize: "14px",
  color: "#5E4637",
  lineHeight: "1.5",
},
};

export default Detail;