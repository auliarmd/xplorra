import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axios";

function DashboardAfterLogin() {
  const navigate = useNavigate();
  const [notFound, setNotFound] = useState(false);
  const [foods, setFoods] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [trendingFoods, setTrendingFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("");
  const [user, setUser] = useState({});
  const [daerah, setDaerah] = useState("");
  const trendingRef = useRef(null);
  
  // State Responsive & Menu Mobile
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showMenu, setShowMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // Perubahan Ukuran Layar Listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  // CARA OTOMATIS RESPONSIF: Menyuntikkan meta viewport jika tidak ada index.html
  useEffect(() => {
    let metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      metaViewport = document.createElement('meta');
      metaViewport.name = 'viewport';
      document.head.appendChild(metaViewport);
    }
    metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  }, []);

  // Fungsi Filter Resep dengan useCallback
  const filterFoods = useCallback(async () => {
    try {
      const res = await api.get("/foods", {
        params: {
          kategori,
          daerah,
          search,
        },
      });

      setFoods(Array.isArray(res.data) ? res.data : []);
      setNotFound(res.data.length === 0);
    } catch (err) {
      console.log(err);
      setFoods([]);
      setNotFound(true);
    }
  }, [kategori, daerah, search]);

  // Auto-Scroll untuk Card Trending di Mobile
  useEffect(() => {
    if (windowWidth > 768) return;

    const interval = setInterval(() => {
      if (trendingRef.current) {
        const container = trendingRef.current;
        const cardWidth = container.clientWidth * 0.85 + 25;
        
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [windowWidth, trendingFoods]);

  // Pengambilan Data Awal
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/Masuk');
      return;
    }

    api.get('/profile')
      .then((res) => setUser(res.data.user))
      .catch((err) => console.log(err));

    api.get('/my-bookmarks')
      .then((res) => {
        const ids = res.data.map(item => item.id);
        setSavedRecipes(ids);
      })
      .catch((err) => console.log(err));

    api.get('/foods')
      .then((res) => setFoods(res.data))
      .catch((err) => console.log(err));

    api.get('/foods/trending')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTrendingFoods(res.data);
        } else {
          setTrendingFoods([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setTrendingFoods([]);
      });
  }, [navigate]);

  useEffect(() => {
    filterFoods();
  }, [filterFoods]);

  const toggleSave = async (id) => {
    try {
      const response = await api.post(`/bookmark/${id}`);
      if (response.data.bookmarked) {
        setSavedRecipes([...savedRecipes, id]);
      } else {
        setSavedRecipes(savedRecipes.filter(item => item !== id));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const daftarKategori = ["Makanan utama", "Minuman", "Dessert"];
  const daftarDaerah = ["Sumatera", "Kalimantan", "Sulawesi", "Maluku", "Irian Jaya", "Nusa Tenggara", "Jawa"];

  return (
    <div style={{
        ...styles.container,
        backgroundImage: isMobile 
          ? "linear-gradient(to bottom, rgba(247, 241, 236, 0.2), rgba(247, 241, 236, 0.95)), url('/bg_peta.jpg')" 
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundAttachment: "fixed",
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
      
      {/* NAVBAR / HEADER */}
      {isMobile ? (
        <div style={styles.mobileNavbar}>
          <div style={styles.mobileNavbarLeft}>
            <span className="material-symbols-outlined" style={styles.mobileMenuIcon} onClick={() => setShowMenu(true)}>
              menu
            </span>
          </div>
          
          <div style={styles.mobileHeaderTitleCenter}>
            <span className="material-symbols-outlined" style={styles.mobileHeaderIcon}>space_dashboard</span>
            <span>Dashboard</span>
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
            <span style={styles.active}>Home</span>
            <span onClick={() => navigate("/profil")} style={{ cursor: "pointer" }}>Profil</span>
            <span onClick={() => navigate("/notifikasi")} style={{ cursor: "pointer" }}>Notifikasi</span>
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

      {/* TAMPILAN SIDEBAR DRAWER MOBILE */}
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
            <div className="hover-sidebar-item" style={activeMenu === "Profil" ? styles.mobileMenuItemActive : styles.mobileMenuItem} onClick={() => { setActiveMenu("Profil"); navigate("/profil"); setShowMenu(false); }}>Profil</div>
            
            <div style={{ padding: "15px 14px", marginTop: "20px" }}>
              <button style={{ ...styles.btnTambah, width: "100%", background: "#e15b3c", color: "#fff" }} onClick={() => navigate("/tambah")}>+ Tambah resep</button>
            </div>
          </div>
        </>
      )}

      {/* BACKGROUND PETA DESKTOP */}
      {!isMobile && <div style={styles.topBg}></div>}

      {/* ==== OUTER LAYOUT WRAPPER ==== */}
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: isMobile ? "0px" : "0 50px", 
        marginTop: isMobile ? "0px" : "-460px", 
        position: "relative",
        zIndex: 10,
        width: "100%",
        boxSizing: "border-box"
      }}>

        {/* 1. SECTION TRENDING */}
        <div
          style={{
            marginBottom: isMobile ? "25px" : "70px",
          }}
        >
          <div style={{ height: "10px" }}></div> 
          
          <div ref={trendingRef} style={isMobile ? styles.trendingMobileScroll : styles.trendingDesktopGrid}>
            {Array.isArray(trendingFoods) && trendingFoods.map((item) => (
              <div 
                key={item.id} 
                style={{ ...styles.trendingCard, minWidth: isMobile ? "85vw" : "auto", cursor: "pointer" }} 
                onClick={() => navigate(`/detail/${item.id}`)}
              >
                <div style={styles.imageWrapper}>
                  <img
                    src={`https://xplorra-production.up.railway.app/uploads/${item.gambar}`}
                    style={{ ...styles.trendingImg, height: isMobile ? "230px" : "330px" }}
                    alt={item.nama}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/600x250?text=No+Image"; }}
                  />
                  <div style={styles.overlay}>
                    <span style={styles.trendingTextBlack}>Trending Now</span>
                    
                    {item.creator_id !== user.id && (
                      <button style={styles.bookmarkBtn} onClick={(e) => { e.stopPropagation(); toggleSave(item.id); }}>
                        <span className="material-symbols-outlined" style={savedRecipes.includes(item.id) ? styles.bookmarkActive : styles.bookmark}>
                          {savedRecipes.includes(item.id) ? "bookmark" : "bookmark_border"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                <div style={styles.trendingOverlay}>
                  <h4 style={styles.trendingHeading}>{item.nama}</h4>
                  
                  <div style={styles.infoRow}>
                    <span style={styles.iconText}>
                      <span className="material-symbols-outlined" style={styles.materialIcon}>comment</span> {item.total_komentar}
                    </span>
                    <span style={styles.iconText}>
                      <span className="material-symbols-outlined" style={styles.materialIcon}>thumb_up</span> {item.likes || 0}
                    </span>
                  </div>

                  <div style={styles.bottomRow}>
                    <span style={styles.rating}>
                      {item.rating}
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
        </div>

        {/* SEARCH BOX & FILTER MOBILE */}
        {isMobile && (
          <div style={styles.mobileSearchWrapper}>
            <div style={styles.mobileSearchContainer}>
              <div style={styles.searchBoxMobile}>
                <span className="material-symbols-outlined" style={styles.searchIconMobile}>search</span>
                <input placeholder="Cari resep atau daerah asal..." style={styles.searchInputMobile} value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div style={styles.scrollFilterContainer}>
              <button style={!kategori ? styles.filterBadgeActive : styles.filterBadge} onClick={() => setKategori("")}>Semua</button>
              {daftarKategori.map((kat) => (
                <button key={kat} style={kategori === kat ? styles.filterBadgeActive : styles.filterBadge} onClick={() => setKategori(kategori === kat ? "" : kat)}>{kat}</button>
              ))}
            </div>
            <div style={{ ...styles.scrollFilterContainer, paddingTop: "4px", marginBottom: "20px" }}>
              <button style={!daerah ? styles.filterBadgeActive : styles.filterBadge} onClick={() => setDaerah("")}>Semua Wilayah</button>
              {daftarDaerah.map((dae) => (
                <button key={dae} style={daerah === dae ? styles.filterBadgeActive : styles.filterBadge} onClick={() => setDaerah(daerah === dae ? "" : dae)}>{dae}</button>
              ))}
            </div>
          </div>
        )}

        {/* 2. TATA LETAK BAWAH: SIDEBAR & REKOMENDASI */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "20px" : "40px",
            alignItems: "flex-start",
            marginTop: isMobile ? "0px" : "35px",
          }}
        >
          
          {/* SIDEBAR FILTER DESKTOP */}
          {!isMobile && (
            <div style={styles.sidebar}>
              <div style={styles.searchBoxContainerSidebar}>
                <div style={styles.searchBox}>
                  <span className="material-symbols-outlined" style={styles.searchIcon}>search</span>
                  <input placeholder="Search" style={styles.searchInput} value={search} onChange={(e) => setSearch(e.target.value)} />
                  {(kategori || daerah) && (
                    <span className="material-symbols-outlined" style={styles.clearFilterIcon} onClick={() => { setKategori(""); setDaerah(""); }} title="Hapus Filter">
                      filter_alt_off
                    </span>
                  )}
                </div>
              </div>

              <h2 style={styles.title}>Kategori</h2>

              <p style={styles.sectionTitle}>Jenis hidangan</p>
              {daftarKategori.map((kat) => (
                <div key={kat} style={styles.optionRow} onClick={() => setKategori(kat)}>
                  <span>{kat}</span>
                  <div style={kategori === kat ? styles.radioActive : styles.radio}>
                    {kategori === kat && <div style={styles.radioInner}></div>}
                  </div>
                </div>
              ))}

              <div style={styles.divider}></div>

              <p style={styles.sectionTitle}>Daerah asal</p>
              {daftarDaerah.map((dae) => (
                <div key={dae} style={styles.optionRow} onClick={() => setDaerah(dae)}>
                  <span>{dae}</span>
                  <div style={daerah === dae ? styles.radioActive : styles.radio}>
                    {daerah === dae && <div style={styles.radioInner}></div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* REKOMENDASI UNTUKMU / MAIN LIST */}
          <div style={isMobile ? { flex: 1, width: "100%" } : styles.mainListContainer}>
            {isMobile && (
              <h3
                style={{
                  ...styles.mobileSectionHeading,
                  fontSize: "18px",
                  margin: "0 0 15px 0",
                }}
              >
                Rekomendasi Untukmu
              </h3>
            )}
            
            <div style={isMobile ? styles.cardContainerMobile : styles.cardContainer}>
              {notFound ? (
                <div style={styles.emptyResult}>
                  <h2 style={styles.emptyResultText}>Resep tidak ditemukan</h2>
                </div>
              ) : (
                <div style={{ ...styles.grid, gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))" }}>
                  {(Array.isArray(foods) ? foods : []).map((item) => (
                    <div key={item.id} style={isMobile ? styles.horizontalCardMobile : styles.card} onClick={() => navigate(`/detail/${item.id}`)}>
                      
                      <div style={{ ...styles.cardImgWrapper, width: isMobile ? "110px" : "100%", height: isMobile ? "110px" : "160px" }}>
                        <img
                          src={`${api.defaults.baseURL}/uploads/${item.gambar}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: isMobile ? "15px" : "0" }}
                          alt=""
                        />
                        {!isMobile && item.creator_id !== user.id && (
                          <button style={styles.bookmarkBtnCard} onClick={(e) => { e.stopPropagation(); toggleSave(item.id); }}>
                            <span className="material-symbols-outlined" style={savedRecipes.includes(item.id) ? styles.bookmarkActiveCard : styles.bookmarkCard}>
                              {savedRecipes.includes(item.id) ? "bookmark" : "bookmark_border"}
                            </span>
                          </button>
                        )}
                      </div>

                      <div style={{ ...styles.cardBody, flex: 1, padding: isMobile ? "10px" : "15px 15px 12px 15px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <h4 style={{ fontSize: isMobile ? "15px" : "17px", margin: "0", fontWeight: "700", lineHeight: "1.2" }}>{item.nama}</h4>
                          {isMobile && item.creator_id !== user.id && (
                            <span 
                              className="material-symbols-outlined" 
                              style={savedRecipes.includes(item.id) ? styles.bookmarkActiveCard : styles.bookmarkCard}
                              onClick={(e) => { e.stopPropagation(); toggleSave(item.id); }}
                            >
                              {savedRecipes.includes(item.id) ? "bookmark" : "bookmark_border"}
                            </span>
                          )}
                        </div>

                        <div style={{ ...styles.infoRow, marginTop: "5px" }}>
                          <span style={styles.iconText}><span className="material-symbols-outlined" style={styles.materialIcon}>comment</span> {item.total_komentar}</span>
                          <span style={styles.iconText}><span className="material-symbols-outlined" style={styles.materialIcon}>thumb_up</span> {item.likes || 0}</span>
                        </div>

                        <div style={styles.bottomRow}>
                          <span style={styles.rating}>
                            {item.rating}
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className="material-symbols-outlined" style={star <= Math.round(item.rating) ? styles.star : styles.starEmpty}>star</span>
                            ))}
                          </span>
                          <button style={isMobile ? styles.btnLihatMobile : styles.btnLihat} onClick={(e) => { e.stopPropagation(); navigate(`/detail/${item.id}`); }}>
                            Lihat
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* FEEDBACK BUTTON */}
      <div style={styles.feedbackBtn} onClick={() => navigate("/feedback")} title="Feedback">
        <span className="material-symbols-outlined">chat</span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "sans-serif",
    background: "#f7f1ec",
    minHeight: "100vh",
    fontWeight: "bold",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 50px",
    background: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 999,
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
  },
  logoContainer: { display: "flex", alignItems: "center", gap: "1px" },
  logoImg: { width: "40px" },
  logoText: { color: "#F28C28", fontWeight: "bold", fontSize: "24px", letterSpacing: "1px" },
  menu: { display: "flex", gap: "30px", fontSize: "18px", fontWeight: "700", cursor: "pointer", marginLeft: "100px" },
  active: { color: "#F28C28", fontWeight: "bold" },
  rightMenu: { display: "flex", alignItems: "center", gap: "15px" },
  btnTambah: { border: "1.5px solid #e15b3c", color: "#e15b3c", background: "transparent", padding: "6px 15px", borderRadius: "20px", cursor: "pointer", fontWeight: "600" },
  topBg: {
    height: "520px",
    backgroundImage: "linear-gradient(to bottom, rgba(180, 113, 71, 0.85), rgba(247, 241, 236, 0.1)), url('/map.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
  },
  searchBoxContainerSidebar: { width: "100%", marginBottom: "20px" },
  sidebar: {
    width: "260px",
    background: "transparent", 
    padding: "0px 10px 25px 0px", 
    position: "sticky",
    top: "90px",
    marginLeft: "-30px", 
    marginTop: "0px"
  },
  mainListContainer: {
    flex: 1,
    width: "100%",
    paddingTop: "50px",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #e15b3c", 
    borderRadius: "30px",
    padding: "10px 20px",
    background: "#fff8f6", 
    width: "105%", 
    boxSizing: "border-box",
  },
  // PERBAIKAN: Dikurangi ke 5px agar kotak search mobile naik proporsional mendekati navbar seperti image_84a637.png
  mobileSearchWrapper: { 
    padding: "5px 15px 5px 15px", 
    background: "transparent", 
    width: "100%", 
    boxSizing: "border-box" 
  },
  mobileSearchContainer: {
    display: "flex",
    justifyContent: "center", 
    width: "100%",
    marginBottom: "15px" 
  },
  searchBoxMobile: { 
    display: "flex", 
    alignItems: "center", 
    gap: "10px", 
    border: "1px solid rgba(0, 0, 0, 0.1)", 
    borderRadius: "25px", 
    padding: "12px 15px", 
    background: "rgba(255, 255, 255, 0.4)", 
    backdropFilter: "blur(8px)",
    width: "100%",
    boxSizing: "border-box"
  },
  searchIcon: { fontSize: "22px", color: "#e15b3c" },
  searchIconMobile: { fontSize: "18px", color: "#F28C28" },
  searchInput: { border: "none", outline: "none", fontSize: "16px", color: "#e15b3c", width: "100%", background: "transparent" },
  searchInputMobile: { border: "none", outline: "none", fontSize: "14px", color: "#F28C28", width: "100%", background: "transparent" },
  clearFilterIcon: { color: "#a4a4a4", cursor: "pointer", fontSize: "20px" },
  scrollFilterContainer: { display: "flex", gap: "8px", overflowX: "auto", padding: "10px 0 5px 0", whiteSpace: "nowrap", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" },
  filterBadge: { background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", color: "#555", fontWeight: "600", cursor: "pointer" },
  filterBadgeActive: { background: "#e15b3c", border: "1px solid #e15b3c", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", color: "#fff", fontWeight: "600", cursor: "pointer" },
  title: { fontSize: "26px", fontWeight: "800", marginBottom: "15px", marginTop: "10px", color: "#000" }, 
  sectionTitle: { color: "#e15b3c", fontWeight: "700", marginBottom: "14px", borderBottom: "3px solid #e15b3c", display: "inline-block", paddingBottom: "5px", fontSize: "18px" },
  optionRow: { display: "flex", alignItems: "center", marginBottom: "14px", fontSize: "16px", cursor: "pointer", justifyContent: "space-between", color: "#444" },
  radio: { width: "18px", height: "18px", borderRadius: "50%", border: "2px solid #e15b3c", background: "transparent" },
  radioActive: { width: "18px", height: "18px", borderRadius: "50%", border: "2px solid #e15b3c", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent" },
  radioInner: { width: "8px", height: "8px", borderRadius: "50%", background: "#e15b3c" },
  divider: { height: "2px", background: "rgba(0, 0, 0, 0.06)", margin: "20px 0" },
  mobileSectionHeading: { fontSize: "20px", fontWeight: "800", color: "#333", marginBottom: "15px" },
  trendingDesktopGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "45px", width: "100%" },
  trendingMobileScroll: { display: "flex", gap: "25px", overflowX: "auto", paddingBottom: "10px", scrollbarWidth: "none" },
  trendingCard: { width: "100%", borderRadius: "20px", overflow: "hidden", background: "#fff", boxShadow: "0 8px 25px rgba(0,0,0,0.1)" },
  imageWrapper: { position: "relative" },
  trendingImg: { width: "100%", objectFit: "cover" }, 
  overlay: { position: "absolute", top: "20px", left: "20px", right: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  trendingTextBlack: { 
    color: "#000000", fontSize: "24px", fontWeight: "900", fontFamily: "'Arial Black', sans-serif, system-ui", letterSpacing: "-0.5px",
    textShadow: `-3.5px -3.5px 0 #fff, 3.5px -3.5px 0 #fff, -3.5px 3.5px 0 #fff, 3.5px 3.5px 0 #fff, -3.5px 0px 0 #fff, 3.5px 0px 0 #fff, 0px -3.5px 0 #fff, 0px 3.5px 0 #fff`
  },
  trendingOverlay: { padding: "15px 24px", minHeight: "130px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box", gap: "10px" },
  trendingHeading: { fontSize: "24px", fontWeight: "800", margin: "0" },
  infoRow: { display: "flex", gap: "18px", fontSize: "14px", color: "#555" },
  bottomRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "5px" },
  iconText: { display: "flex", alignItems: "center", gap: "6px", fontSize: "15px" },
  materialIcon: { fontSize: "22px" },
  rating: { display: "flex", alignItems: "center", gap: "4px", fontSize: "16px", color: "#333", fontWeight: "700" },
  star: { fontSize: "22px", color: "#FFC107" },
  starEmpty: { fontSize: "22px", color: "#ddd" },
  btnLihat: { background: "#e15b3c", color: "#fff", border: "none", padding: "10px 34px", borderRadius: "25px", cursor: "pointer", fontWeight: "700", fontSize: "15px" },
  bookmarkBtn: { background: "#fff", border: "none", borderRadius: "50%", width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" },
  bookmark: { color: "#555", fontSize: "26px" },
  bookmarkActive: { color: "#e15b3c", fontVariationSettings: "'FILL' 1", fontSize: "26px" },
  bookmarkBtnCard: { position: "absolute", top: "10px", right: "10px", background: "#fff", border: "none", borderRadius: "50%", width: "38px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" },
  bookmarkCard: { color: "#555", fontSize: "24px" },
  bookmarkActiveCard: { color: "#e15b3c", fontVariationSettings: "'FILL' 1", fontSize: "24px" },
  cardContainer: { width: "100%" },
  cardContainerMobile: { marginTop: "5px", padding: "0 15px", boxSizing: "border-box" },
  grid: { display: "grid", gap: "25px" },
  card: { background: "#fff", borderRadius: "18px", overflow: "hidden", boxShadow: "0 6px 18 rgba(0,0,0,0.06)", cursor: "pointer", display: "flex", flexDirection: "column" },
  horizontalCardMobile: { display: "flex", background: "#fff", borderRadius: "18px", padding: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", alignItems: "center", gap: "12px", cursor: "pointer" },
  cardImgWrapper: { position: "relative", overflow: "hidden" },
  cardBody: { display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "8px" },
  btnLihatMobile: { background: "#e15b3c", color: "#fff", border: "none", padding: "6px 20px", borderRadius: "15px", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
  feedbackBtn: { position: "fixed", bottom: "20px", right: "20px", width: "52px", height: "52px", borderRadius: "50%", background: "#e15b3c", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", zIndex: 99 },
  mobileNavbar: { display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF", padding: "12px 20px", position: "sticky", top: 0, zIndex: 999, width: "100%", boxSizing: "border-box", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" },
  mobileMenuIcon: { fontSize: "30px", color: "#9F6822", cursor: "pointer" },
  mobileHeaderIcon: { fontSize: "24px" },
  profileCircle: { width: "35px", height: "35px", borderRadius: "50%", background: "#f4b8a3", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", cursor: "pointer", overflow: "hidden" },
  profileImg: { width: "100%", height: "100%", objectFit: "cover" },
  mobileOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", zIndex: 1001 },
  mobileSidebar: { position: "fixed", top: 0, left: 0, width: "260px", height: "100vh", background: "#F7F1EC", zIndex: 1002, padding: "20px", boxShadow: "4px 0 20px rgba(0,0,0,0.15)", boxSizing: "border-box" },
  mobileLogoSection: { display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #ddd", paddingBottom: "12px" },
  mobileLogoText: { color: "#E28B36", fontSize: "24px", fontWeight: "700", marginLeft: "8px" },
  closeMenuIcon: { fontSize: "28px", color: "#5E4637", cursor: "pointer", padding: "4px" },
  mobileMenuTitle: { marginTop: "20px", marginBottom: "15px", fontWeight: "700", fontSize: "18px", color: "#5E4637" },
  mobileMenuItem: { padding: "12px 14px", fontSize: "16px", cursor: "pointer", color: "#555", fontWeight: "500", borderRadius: "10px", backgroundColor: "transparent" },
  mobileMenuItemActive: { padding: "12px 14px", fontSize: "16px", cursor: "pointer", color: "#e15b3c", backgroundColor: "rgba(225, 91, 60, 0.12)", fontWeight: "700", borderRadius: "10px" },
  emptyResult: { padding: "40px 0", textAlign: "center" },
  emptyResultText: { color: "#a4a4a4", fontSize: "22px", fontWeight: "700" },
  mobileNavbarLeft: { flex: 1, display: "flex", justifyContent: "flex-start", alignItems: "center" },
  mobileHeaderTitleCenter: { display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "#9F6822", fontWeight: "700", fontSize: "18px", whiteSpace: "nowrap" },
  mobileNavbarRight: { flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center" }
};

export default DashboardAfterLogin;