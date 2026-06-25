import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const BASE_URL = "https://xplorra-production.up.railway.app";

function Dashboard() {
  const navigate = useNavigate();
  const [notFound, setNotFound] = useState(false);
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("");
  const [daerah, setDaerah] = useState("");
  const [trendingFoods, setTrendingFoods] = useState([]);
  const trendingRef = useRef(null);

  // State Responsif & Menu Mobile
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showMenu, setShowMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Home");

  // Perubahan Ukuran Layar Listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  const goToRegister = () => {
    navigate("/Register");
  };

  const goToMasuk = () => {
    navigate("/Masuk");
  };

  const requireLogin = () => {
    navigate("/Masuk");
  };

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

  useEffect(() => {
    fetch(`${BASE_URL}/foods/trending`)
      .then((res) => res.json())
      .then((data) => {
        setTrendingFoods(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    fetch(
      `${BASE_URL}/foods?kategori=${kategori}&daerah=${daerah}&search=${search}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFoods(data);
        setNotFound(data.length === 0);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [kategori, daerah, search]);

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
          {/* Kiri: Tombol Menu */}
          <div style={styles.mobileNavbarLeft}>
            <span className="material-symbols-outlined" style={styles.mobileMenuIcon} onClick={() => setShowMenu(true)}>
              menu
            </span>
          </div>
          
          {/* Tengah: Ikon & Tulisan Dashboard */}
          <div style={styles.mobileHeaderTitleCenter}>
            <span className="material-symbols-outlined" style={styles.mobileHeaderIcon}>space_dashboard</span>
            <span>Dashboard</span>
          </div>
          
          {/* Kanan: Ikon profil yang akan mengarahkan ke halaman login saat diklik */}
          <div style={styles.mobileNavbarRight}>
            <div 
              style={{ ...styles.profileCircle, background: "#f0e6df", cursor: "pointer" }} 
              onClick={requireLogin}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#bc9c8c" }}>person_off</span>
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
            <span onClick={requireLogin} style={{ cursor: "pointer" }}>Profil</span>
          </div>

          <div>
            <button style={styles.btnPrimary} onClick={goToRegister}>Daftar</button>
            <button style={styles.btnSecondary} onClick={goToMasuk}>Masuk</button>
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
            <div style={styles.mobileMenuTitle}>MENU</div>
            <div className="hover-sidebar-item" style={activeMenu === "Home" ? styles.mobileMenuItemActive : styles.mobileMenuItem} onClick={() => { setActiveMenu("Home"); setShowMenu(false); }}>Home</div>
            <div className="hover-sidebar-item" style={activeMenu === "Profil" ? styles.mobileMenuItemActive : styles.mobileMenuItem} onClick={() => { setActiveMenu("Profil"); requireLogin(); setShowMenu(false); }}>Profil</div>
            <div style={{ position: "absolute", bottom: "30px", left: "20px", right: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <button style={{ ...styles.btnPrimary, width: "100%", margin: 0 }} onClick={goToRegister}>Daftar</button>
              <button style={{ ...styles.btnSecondary, width: "100%", margin: 0 }} onClick={goToMasuk}>Masuk</button>
            </div>
          </div>
        </>
      )}
      {/* SEARCH BOX & FILTER MOBILE */}
      {isMobile && (
        <div style={styles.mobileSearchWrapper}>
          <div style={styles.searchBoxMobile}>
            <span className="material-symbols-outlined" style={styles.searchIconMobile}>search</span>
            <input placeholder="Cari resep atau daerah asal..." style={styles.searchInputMobile} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={styles.scrollFilterContainer}>
            <button style={!kategori ? styles.filterBadgeActive : styles.filterBadge} onClick={() => setKategori("")}>Semua</button>
            {daftarKategori.map((kat) => (
              <button key={kat} style={kategori === kat ? styles.filterBadgeActive : styles.filterBadge} onClick={() => setKategori(kategori === kat ? "" : kat)}>{kat}</button>
            ))}
          </div>
          <div style={{ ...styles.scrollFilterContainer, paddingTop: "4px" }}>
            <button style={!daerah ? styles.filterBadgeActive : styles.filterBadge} onClick={() => setDaerah("")}>Semua Wilayah</button>
            {daftarDaerah.map((dae) => (
              <button key={dae} style={daerah === dae ? styles.filterBadgeActive : styles.filterBadge} onClick={() => setDaerah(daerah === dae ? "" : dae)}>{dae}</button>
            ))}
          </div>
        </div>
      )}

      {/* BACKGROUND PETA DESKTOP */}
      {!isMobile && <div style={styles.topBg}></div>}

      {/* ==== OUTER LAYOUT WRAPPER ==== */}
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: isMobile ? "0 15px" : "0 50px",
        marginTop: isMobile ? "0px" : "-460px", 
        position: "relative",
        zIndex: 10,
      }}>

        {/* 1. SECTION TRENDING */}
        <div style={{ marginBottom: "60px" }}>
          <div style={{ height: "25px" }}></div> 
          
          <div ref={trendingRef} style={isMobile ? styles.trendingMobileScroll : styles.trendingDesktopGrid}>
            {trendingFoods.map((item) => (
              <div 
                key={item.id} 
                style={{ ...styles.trendingCard, minWidth: isMobile ? "85vw" : "auto" }} 
                onClick={requireLogin}
              >
                <div style={styles.imageWrapper}>
                  <img
                    src={`https://xplorra-production.up.railway.app/uploads/${item.gambar}`}
                    style={{
                      ...styles.trendingImg,
                      height: "100%",
                    }}
                    alt={item.nama}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/600x250?text=No+Image"; }}
                  />
                  <div style={styles.overlay}>
                    <p style={styles.trendingText}>Trending Now</p>
                  </div>
                </div>

                <div style={styles.trendingOverlay}>
                  <h4 style={styles.trendingHeading}>{item.nama}</h4>
                  
                  <div style={styles.infoRow}>
                    <span style={styles.iconText}>
                      <span className="material-symbols-outlined" style={styles.materialIcon}>comment</span> {item.total_komentar}
                    </span>
                    <span style={styles.iconText}>
                      <span className="material-symbols-outlined" style={styles.materialIcon}>thumb_up</span> {item.rating}
                    </span>
                  </div>

                  <div style={styles.bottomRow}>
                    <span style={styles.rating}>
                      {item.rating}
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="material-symbols-outlined" style={star <= Math.round(item.rating) ? styles.star : styles.starEmpty}>star</span>
                      ))}
                    </span>
                    <button style={styles.btnLihat} onClick={requireLogin}>Lihat</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. TATA LETAK BAWAH: SIDEBAR & REKOMENDASI */}
        <div style={{ 
          display: "flex", 
          flexDirection: isMobile ? "column" : "row", 
          gap: isMobile ? "20px" : "110px",
          alignItems: "flex-start"
        }}>
          
          {/* SIDEBAR FILTER */}
          {!isMobile && (
            <div style={styles.sidebar}>
              {/* SEARCH BOX DESKTOP: Berada di paling atas sebelum judul kategori */}
              <div style={styles.searchBox}>
                <span className="material-symbols-outlined" style={styles.searchIcon}>search</span>
                <input placeholder="Search" style={styles.searchInput} value={search} onChange={(e) => setSearch(e.target.value)} />
                {(kategori || daerah) && (
                  <span className="material-symbols-outlined" style={styles.clearFilterIcon} onClick={() => { setKategori(""); setDaerah(""); }} title="Hapus Filter">
                    filter_alt_off
                  </span>
                )}
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
          <div style={{ flex: 1, width: "100%" }}>
            <h3 style={{ 
              fontSize: isMobile ? "18px" : "24px", 
              margin: "0 0 15px 0",
              display: isMobile ? "block" : "none",
              fontWeight: "800",
              color: "#333"
            }}>
              Rekomendasi Untukmu
            </h3>
            
            <div style={isMobile ? styles.cardContainerMobile : styles.cardContainer}>
              {notFound ? (
                <div style={styles.emptyResult}>
                  <h2 style={styles.emptyResultText}>Resep tidak ditemukan</h2>
                </div>
              ) : (
                <div style={isMobile ? styles.gridMobile : styles.grid}>
                  {foods.map((item) => (
                    <div key={item.id} style={isMobile ? styles.horizontalCardMobile : styles.card} onClick={requireLogin}>
                      
                      <div style={{ ...styles.cardImgWrapper, width: isMobile ? "110px" : "100%", height: isMobile ? "110px" : "150px" }}>
                        <img
                          src={`${BASE_URL}/uploads/${item.gambar}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: isMobile ? "15px" : "0" }}
                          alt=""
                        />
                      </div>

                      <div style={{ ...styles.cardBody, flex: 1, padding: isMobile ? "10px" : "0px 10px 8px 15px" }}>
                        <h4 style={isMobile ? { fontSize: "15px", margin: "0", fontWeight: "700", lineHeight: "1.2" } : styles.cardTitle}>{item.nama}</h4>

                        <div style={styles.infoRow}>
                          <span style={styles.iconText}><span className="material-symbols-outlined" style={styles.materialIcon}>comment</span> {item.total_komentar}</span>
                          <span style={styles.iconText}><span className="material-symbols-outlined" style={styles.materialIcon}>thumb_up</span> {item.likes}</span>
                        </div>

                        <div style={styles.bottomRow}>
                          <span style={styles.rating}>
                            {item.rating}
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className="material-symbols-outlined" style={star <= Math.round(item.rating) ? styles.star : styles.starEmpty}>star</span>
                            ))}
                          </span>
                          <button style={isMobile ? styles.btnLihatMobile : styles.btnLihat} onClick={(e) => { e.stopPropagation(); requireLogin(); }}>
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
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "sans-serif",
    background: "#f6f6f6",
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
  },
  logoContainer: { display: "flex", alignItems: "center", gap: "1px" },
  logoImg: { width: "40px" },
  logoText: { color: "#F28C28", fontWeight: "bold", fontSize: "24px", letterSpacing: "1px" },
  menu: { display: "flex", gap: "30px", fontSize: "18px", fontWeight: "700", cursor: "pointer", marginRight: "-90px" },
  active: { color: "#F28C28", fontWeight: "bold" },
  btnPrimary: { background: "#F28C28", color: "#ffffff", border: "none", padding: "8px 30px", borderRadius: "20px", marginRight: "10px", cursor: "pointer", fontWeight: "700" },
  btnSecondary: { background: "#fbdfd1", color: "#F28C28", border: "none", padding: "8px 30px", borderRadius: "20px", cursor: "pointer", fontWeight: "700" },
  topBg: {
    height: "500px",
    backgroundImage: "linear-gradient(to bottom, rgba(180, 113, 71, 0.9), rgba(245, 236, 222, 0.0)), url('/map.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  sidebar: { width: "260px", position: "sticky", top: "90px", alignSelf: "flex-start", height: "fit-content" },
  searchBox: { display: "flex", alignItems: "center", gap: "10px", border: "2px solid #C51313", borderRadius: "30px", padding: "8px 15px", width: "100%", margin: "0 0 20px -15px", background: "#fff", boxSizing: "border-box" },
  searchIcon: { fontSize: "18px", color: "#F28C28" },
  searchInput: { border: "none", outline: "none", fontSize: "14px", color: "#F28C28", width: "100%" },
  clearFilterIcon: { color: "#a4a4a4", cursor: "pointer", fontSize: "22px" },
  title: { fontSize: "28px", fontWeight: "800", marginBottom: "10px", marginTop: "10px" },
  sectionTitle: { color: "#e15b3c", fontWeight: "700", marginBottom: "10px", borderBottom: "3px solid #e15b3c", display: "inline-block", paddingBottom: "5px", fontSize: "19px" },
  optionRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", fontSize: "16px", cursor: "pointer" },
  radio: { width: "18px", height: "18px", borderRadius: "50%", border: "2px solid #e15b3c", boxSizing: "border-box" },
  radioActive: { width: "18px", height: "18px", borderRadius: "50%", border: "2px solid #e15b3c", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" },
  radioInner: { width: "8px", height: "8px", borderRadius: "50%", background: "#e15b3c" },
  divider: { height: "4px", background: "#e15b3c", margin: "10px 0 20px 0", width: "100%" },
  trendingDesktopGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "28px",
    width: "100%",
    alignItems: "stretch",
  },
  trendingMobileScroll: { display: "flex", gap: "25px", overflowX: "auto", paddingBottom: "10px", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" },
  trendingCard: {
    width: "100%",
    borderRadius: "22px",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
  },
  imageWrapper: {
    position: "relative",
    overflow: "hidden",
    height: "350px",
  },
  trendingImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  overlay: { position: "absolute", top: "20px", left: "20px" },
  trendingText: { color: " #000", fontSize: "24px", fontWeight: "900", lineHeight: "1", WebkitTextStroke: "0.7px white", margin: 0 },
  trendingOverlay: {
    padding: "18px 22px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  trendingHeading: {
    fontSize: "25px",
    fontWeight: "800",
    lineHeight: "1.2",
    margin: "0 0 16px 0",
    color: "#000",
  },
  cardContainer: { flex: 1, height: "640px", overflowY: "auto", paddingRight: "10px" },
  cardContainerMobile: { marginTop: "5px", width: "100%" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" },
  gridMobile: { display: "flex", flexDirection: "column", gap: "15px" },
  card: { background: "#fff", borderRadius: "18px", overflow: "hidden", boxShadow: "0 8px 20px rgba(0,0,0,0.08)", width: "100%", cursor: "pointer" },
  horizontalCardMobile: { display: "flex", background: "#fff", borderRadius: "18px", padding: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", alignItems: "center", gap: "12px", cursor: "pointer" },
  cardImgWrapper: { position: "relative", overflow: "hidden" },
  cardBody: { display: "flex", flexDirection: "column", gap: "8px", paddingTop: "20px" },
  cardTitle: { fontSize: "16px", margin: "0", lineHeight: "1.1" },
  infoRow: {
    display: "flex",
    gap: "18px",
    alignItems: "center",
    color: "#555",
    fontSize: "14px",
  },
  iconText: { display: "flex", alignItems: "center", gap: "4px" },
  materialIcon: { fontSize: "20px" },
  bottomRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "6px",
  },
  rating: { display: "flex", alignItems: "center", gap: "2px", fontSize: "14px" },
  star: { fontSize: "20px", color: "#FFC107" },
  starEmpty: { fontSize: "22px", color: "#ddd" },
  btnLihat: {
    background: "#d96f3d",
    color: "#fff",
    border: "none",
    padding: "10px 34px",
    borderRadius: "25px",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
  },
  btnLihatMobile: { background: "#d86936", color: "#fff", border: "none", padding: "6px 20px", borderRadius: "15px", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
  emptyResult: { width: "100%", height: "300px", display: "flex", justifyContent: "center", alignItems: "center" },
  emptyResultText: { color: "#393939", fontSize: "24px", fontWeight: "700", textAlign: "center" },
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
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)" 
  },
  mobileMenuIcon: { fontSize: "30px", color: "#9F6822", cursor: "pointer" },
  mobileHeaderTitle: { display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "20px" },
  btnPrimaryMobile: { background: "#F28C28", color: "#ffffff", border: "none", padding: "6px 18px", borderRadius: "15px", fontWeight: "700", fontSize: "14px" },
  mobileOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", zIndex: 1001 },
  mobileSidebar: { position: "fixed", top: 0, left: 0, width: "260px", height: "100vh", background: "#F7F1EC", zIndex: 1002, padding: "20px", boxShadow: "4px 0 20px rgba(0,0,0,0.15)", boxSizing: "border-box" },
  mobileLogoSection: { display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #ddd", paddingBottom: "12px" },
  mobileLogoText: { color: "#E28B36", fontSize: "24px", fontWeight: "700", marginLeft: "8px" },
  closeMenuIcon: { fontSize: "28px", color: "#5E4637", cursor: "pointer" },
  mobileMenuTitle: { marginTop: "20px", marginBottom: "15px", fontWeight: "700", fontSize: "18px", color: "#5E4637" },
  mobileMenuItem: { padding: "12px 14px", fontSize: "16px", cursor: "pointer", color: "#555", fontWeight: "500", borderRadius: "10px" },
  mobileMenuItemActive: { padding: "12px 14px", fontSize: "16px", cursor: "pointer", color: "#e15b3c", backgroundColor: "rgba(225, 91, 60, 0.12)", fontWeight: "700", borderRadius: "10px" },
  mobileSearchWrapper: { padding: "15px 15px 5px 15px", background: "transparent" },
  searchBoxMobile: { display: "flex", alignItems: "center", gap: "10px", border: "1px solid rgba(0, 0, 0, 0.1)", borderRadius: "25px", padding: "10px 15px", background: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(8px)" },
  searchIconMobile: { fontSize: "18px", color: "#F28C28" },
  searchInputMobile: { border: "none", outline: "none", fontSize: "14px", color: "#F28C28", width: "100%", background: "transparent" },
  scrollFilterContainer: { display: "flex", gap: "8px", overflowX: "auto", padding: "10px 0 5px 0", whiteSpace: "nowrap", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" },
  filterBadge: { background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", color: "#555", fontWeight: "600", cursor: "pointer" },
  filterBadgeActive: { background: "#e15b3c", border: "1px solid #e15b3c", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", color: "#fff", fontWeight: "600", cursor: "pointer" },
  mobileNavbarLeft: {      flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  mobileHeaderTitleCenter: { 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center",
    gap: "6px", 
    color: "#9F6822", 
    fontWeight: "700", 
    fontSize: "18px",
    whiteSpace: "nowrap"
  },
  mobileHeaderIcon: { 
    fontSize: "24px" 
  },
  mobileNavbarRight: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  profileCircle: { 
    width: "35px", 
    height: "35px", 
    borderRadius: "50%", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    overflow: "hidden" 
  },
};
export default Dashboard;