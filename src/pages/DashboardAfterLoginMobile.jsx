import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import api from "../api/axios";
import ProfileAvatar from "../components/ProfileAvatar";

export default function DashboardAfterLoginMobile() {
  const navigate = useNavigate();
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [user, setUser] = useState({});
  const [foods, setFoods] = useState([]);
  const [trendingFoods, setTrendingFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("");
  const [daerah, setDaerah] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const trendingRef = useRef(null);

  const filterFoods = useCallback(
    (newKategori, newDaerah, newSearch) => {

      const kategoriValue =
        newKategori ?? kategori;

      const daerahValue =
        newDaerah ?? daerah;

      const searchValue =
        newSearch ?? search;

        console.log(
        `/foods?kategori=${kategoriValue}&daerah=${daerahValue}&search=${searchValue}`
      );
      api.get(
        `/foods?kategori=${kategoriValue}&daerah=${daerahValue}&search=${searchValue}`
      )

      .then((res)=>{

        setFoods(res.data);

        setNotFound(res.data.length === 0);

      })

      .catch((err)=>{

        console.log(err);

      });

  },
    [kategori, daerah, search]
  );

  const openRecipe = (item) => {
    navigate(`/detail/${item.id}`);
  };

    useEffect(() => {

      const token = localStorage.getItem("token");

      if(!token){
        navigate('/Masuk');
        return;
      }

      api.get('/profile')
        .then((res) => {

          setUser(res.data.user);

        })
        .catch((err) => console.log(err));

      api.get('/my-bookmarks')
        .then((res)=>{

          const ids = res.data.map(
            item => item.id
          );

          setSavedRecipes(ids);

        })
        .catch((err)=>console.log(err));

      // semua makanan
      api.get('/foods')
        .then((res) => {
          setFoods(res.data);
        })
        .catch((err) => console.log(err));

      // trending
      api.get('/foods/trending')
        .then((res) => {

          console.log(res.data);

          if(Array.isArray(res.data)){

            setTrendingFoods(res.data);

          }else{

            setTrendingFoods([]);

          }

        })
        .catch((err) => {

          console.log(err);

          setTrendingFoods([]);

        }, []);

  }, [navigate]);

    useEffect(() => {

      filterFoods();

    }, [kategori, daerah, search, filterFoods]);

  const toggleSave = async (id) => {

    try{

      const response = await api.post(
        `/bookmark/${id}`
      );

      // jika tersimpan
      if(response.data.bookmarked){

        setSavedRecipes(prev => [...prev, id]);

      }else{

        setSavedRecipes(prev =>
          prev.filter(item => item !== id)
        );

      }

    }catch(err){

      console.log(err);

    }

  };

  useEffect(() => {
    if (trendingFoods.length <= 1) return;

    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % trendingFoods.length;

      if (trendingRef.current) {
        const cardWidth =
          trendingRef.current.children[0].offsetWidth + 15;

        trendingRef.current.scrollTo({
          left: index * cardWidth,
          behavior: "smooth",
        });
      }
    }, 3000);

    return () => clearInterval(interval);

  }, [trendingFoods]);

  return (
    <div style={styles.container}>

      {/* ================= NAVBAR ================= */}

      <div style={styles.navbar}>

        <span
        className="material-symbols-outlined"
        style={styles.menuIcon}
        onClick={() => setShowMenu(true)}
        >
        menu
        </span>

        <h2 style={styles.title}>
          Dashboard
        </h2>

       <ProfileAvatar
        user={user}
        size={38}
        onClick={() => navigate("/profil")}
      />

      </div>

      {/* ================= SIDEBAR ================= */}

        {showMenu && (
        <>
            <div
            style={styles.menuoverlay}
            onClick={() => setShowMenu(false)}
            />

            <div style={styles.mobileMenu}>

            <div style={styles.mobileHeader}>

              <div style={styles.logoContainer}>
                <img
                  src="/logo_X.png"
                  alt=""
                  style={styles.logo}
                />

                <span style={styles.logoText}>
                  XpLorra
                </span>
              </div>

              <span
                className="material-symbols-outlined"
                style={styles.closeIcon}
                onClick={() => setShowMenu(false)}
              >
                close
              </span>

            </div>

            <div
              style={styles.activeMenuItem}
              onClick={() => setShowMenu(false)}
            >
              <span className="material-symbols-outlined">
                home
              </span>

              Dashboard
            </div>

            <div
                style={styles.menuItem}
                onClick={() => navigate("/profil")}
            >
                <span className="material-symbols-outlined">
                person
                </span>

                Profil
            </div>

            <div
              style={styles.menuItem}
              onClick={() => navigate("/notifikasi")}
            >

              <span className="material-symbols-outlined">
                notifications
              </span>

              Notifikasi

            </div>

            <div
              style={styles.menuItem}
              onClick={() => navigate("/tambah")}
            >

              <span className="material-symbols-outlined">
                add_circle
              </span>

              Tambah Resep

            </div>

            <div
            style={styles.menuItem}
            onClick={() => {

              localStorage.removeItem("token");
              navigate("/Masuk");

            }}
          >

            <span className="material-symbols-outlined">
              logout
            </span>

            Keluar

          </div>

            </div>
        </>
        )}

        {/* ================= TRENDING ================= */}

        <div
          ref={trendingRef}
          className="trending-scroll"
          style={styles.trendingContainer}
        >

        {trendingFoods.slice(0,2).map((item)=>(
          <div
            key={item.id}
            style={styles.trendingCard}
            onClick={() => openRecipe(item)}
          >

            <div style={styles.imageWrapper}>

              <img
                src={`${api.defaults.baseURL}/uploads/${item.gambar}`}
                alt={item.nama}
                style={styles.trendingImage}
              />

              {item.user_id !== user.id && (
              <button
                style={styles.bookmarkButton}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave(item.id);
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={
                    savedRecipes.includes(item.id)
                      ? styles.bookmarkActive
                      : styles.bookmarkInactive
                  }
                >
                  {savedRecipes.includes(item.id)
                    ? "bookmark"
                    : "bookmark_border"}
                </span>
              </button>
            )}

              <div style={styles.trendingOverlay}>
                <p style={styles.trendingText}>
                  Trending Now
                </p>
              </div>

            </div>

            <div style={styles.trendingBody}>

              <h3 style={styles.trendingTitle}>
                {item.nama}
              </h3>

              <div style={styles.infoRow}>

                <span style={styles.infoItem}>

                  <span className="material-symbols-outlined">
                    comment
                  </span>

                  {item.total_komentar}

                </span>

                <span style={styles.infoItem}>

                  <span className="material-symbols-outlined">
                    thumb_up
                  </span>

                  {item.likes}

                </span>

              </div>

              <div style={styles.bottomRow}>

                <div style={styles.ratingRow}>

                  <span style={styles.ratingNumber}>
                    {item.rating}
                  </span>

                  {[1,2,3,4,5].map((star)=>(
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

                </div>

                <button
                  style={styles.trendingButton}
                  onClick={(e) => {
                    e.stopPropagation();

                    openRecipe(item);

                    navigate(`/detail/${item.id}`);

                  }}
                >
                  Lihat
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* ================= SEARCH ================= */}

      <div style={styles.searchContainer}>

        <span
          className="material-symbols-outlined"
          style={styles.searchIcon}
        >
          search
        </span>

        <input
          placeholder="Search"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          style={styles.searchInput}
        />

      </div>

            {/* ================= KATEGORI ================= */}

            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>
                Jenis Hidangan
                </h3>

                <div
                className="horizontal-scroll"
                style={styles.horizontalScroll}
                >

                <button
                    style={
                    kategori === ""
                        ? styles.filterButtonActive
                        : styles.filterButton
                    }
                    onClick={() => setKategori("")}
                >
                    Semua
                </button>

                <button
                    style={
                    kategori === "Makanan utama"
                        ? styles.filterButtonActive
                        : styles.filterButton
                    }
                    onClick={() => setKategori("Makanan utama")}
                >
                    Makanan Utama
                </button>

                <button
                    style={
                    kategori === "Dessert"
                        ? styles.filterButtonActive
                        : styles.filterButton
                    }
                    onClick={() => setKategori("Dessert")}
                >
                    Dessert
                </button>

                <button
                    style={
                    kategori === "Minuman"
                        ? styles.filterButtonActive
                        : styles.filterButton
                    }
                    onClick={() => setKategori("Minuman")}
                >
                    Minuman
                </button>

                </div>

            </div>

            {/* ================= DAERAH ================= */}

            <div style={styles.sectionDaerah}>

                <h3 style={styles.sectionTitle}>
                Daerah
                </h3>

                <div
                className="horizontal-scroll"
                style={styles.horizontalScroll}
                >

                <button
                    style={
                    daerah === ""
                        ? styles.filterButtonActive
                        : styles.filterButton
                    }
                    onClick={() => setDaerah("")}
                >
                    Semua
                </button>

                <button
                    style={
                    daerah === "Sumatera"
                        ? styles.filterButtonActive
                        : styles.filterButton
                    }
                    onClick={() => setDaerah("Sumatera")}
                >
                    Sumatera
                </button>

                <button
                    style={
                    daerah === "Jawa"
                        ? styles.filterButtonActive
                        : styles.filterButton
                    }
                    onClick={() => setDaerah("Jawa")}
                >
                    Jawa
                </button>

                <button
                    style={
                    daerah === "Kalimantan"
                        ? styles.filterButtonActive
                        : styles.filterButton
                    }
                    onClick={() => setDaerah("Kalimantan")}
                >
                    Kalimantan
                </button>

                <button
                    style={
                    daerah === "Sulawesi"
                        ? styles.filterButtonActive
                        : styles.filterButton
                    }
                    onClick={() => setDaerah("Sulawesi")}
                >
                    Sulawesi
                </button>

                <button
                    style={
                    daerah === "Maluku"
                        ? styles.filterButtonActive
                        : styles.filterButton
                    }
                    onClick={() => setDaerah("Maluku")}
                >
                    Maluku
                </button>

                <button
                    style={
                    daerah === "Nusa Tenggara"
                        ? styles.filterButtonActive
                        : styles.filterButton
                    }
                    onClick={() => setDaerah("Nusa Tenggara")}
                >
                    Nusa Tenggara
                </button>

                <button
                    style={
                    daerah === "Irian Jaya"
                        ? styles.filterButtonActive
                        : styles.filterButton
                    }
                    onClick={() => setDaerah("Irian Jaya")}
                >
                    Papua
                </button>

                </div>

            </div>

            {/* ================= LIST RESEP ================= */}

            <div style={styles.recipeContainer}>

                {notFound ? (

                <div style={styles.emptyContainer}>

                    <h3 style={styles.emptyText}>
                    Resep tidak ditemukan
                    </h3>

                </div>

                ) : (

                foods.map((item) => (

                    <div
                        key={item.id}
                        style={styles.recipeCard}
                        onClick={() => openRecipe(item)}
                      >

                    {/* FOTO */}

                    <div style={styles.recipeImageWrapper}>

                      <img
                        src={`${api.defaults.baseURL}/uploads/${item.gambar}`}
                        alt={item.nama}
                        style={styles.recipeImage}
                        onError={(e)=>{
                          e.target.src =
                          "https://via.placeholder.com/120x120?text=No+Image";
                        }}
                      />

                      {item.user_id !== user.id && (
                        <button
                          style={styles.recipeBookmark}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSave(item.id);
                          }}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={
                              savedRecipes.includes(item.id)
                                ? styles.bookmarkActive
                                : styles.bookmarkInactive
                            }
                          >
                            {savedRecipes.includes(item.id)
                              ? "bookmark"
                              : "bookmark_border"}
                          </span>
                        </button>
                      )}

                    </div>

                    {/* ISI */}

                    <div style={styles.recipeBody}>

                        <h3 style={styles.recipeTitle}>
                        {item.nama}
                        </h3>

                        <div style={styles.infoRow}>

                        <span style={styles.infoItem}>

                            <span className="material-symbols-outlined">
                            comment
                            </span>

                            {item.total_komentar}

                        </span>

                        <span style={styles.infoItem}>

                            <span className="material-symbols-outlined">
                            thumb_up
                            </span>

                            {item.likes}

                        </span>

                        </div>

                        <div style={styles.bottomRow}>

                        <div style={styles.ratingRow}>

                            <span style={styles.ratingNumber}>
                            {item.rating}
                            </span>

                            {[1,2,3,4,5].map((star)=>(

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

                        </div>

                        <button
                          style={styles.editButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/detail/${item.id}`);

                          }}
                        >
                          Lihat
                        </button>

                        </div>

                    </div>

                    </div>

                ))

                )}

            </div>

    </div>
  );
}

const styles = {
    container: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #b97555ac 0%, #FFFFFF 13%)",
    overflowY: "auto",
    fontFamily: "sans-serif",
    paddingBottom: "30px",
    },

  /* ================= NAVBAR ================= */

  navbar: {
    height: "60px",
    background: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 18px",
    position: "sticky",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    boxShadow: "0 2px 8px rgba(0,0,0,.08)",
  },

  menuIcon: {
    fontSize: "30px",
    color: "#D96E45",
    cursor: "pointer",
  },

  title: {
    margin: 0,
    fontSize: "22px",
    color: "#D96E45",
    fontWeight: "700",
  },

  profileIcon: {
    fontSize: "34px",
    color: "#D96E45",
    cursor: "pointer",
  },

  /* ================= TOP ================= */

  topBackground: {
    padding: "18px",
  },

  /* ================= TRENDING ================= */

  trendingCard: {
    width: "100%",
    minWidth: "100%",
    flexShrink: 0,
    background: "#fff",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 8px 20px rgba(0,0,0,.08)",
},

  imageWrapper: {
    position: "relative",
  },

  trendingImage: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    top: "0px",
    left: "0px",
  },

  trendingText: {
    position: "absolute",
    top: "10px",
    left: "15px",
    color: "#000",
    fontSize: "22px",
    fontWeight: "900",
    lineHeight: "1",
    WebkitTextStroke: "0.7px white",
    whiteSpace: "nowrap", 
    
  },

  trendingBody: {
    padding: "18px",
  },

  trendingTitle: {
    margin: "0 0 12px 0",
    fontSize: "20px",
    fontWeight: "700",
    color: "#222",
  },

  trendingContainer: {
    display: "flex",
    gap: "15px",
    overflowX: "auto",
    overflowY: "hidden",
    padding: "25px",
    scrollSnapType: "x mandatory",
    scrollbarWidth: "none",
    scrollBehavior: "smooth",
  },

  trendingOverlay: {
    position: "absolute",
    top: -10,
    left: 15,
  },

  trendingButton: {
      width: "110px",
      height: "35px",
      border: "none",
      background: "#D96E45",
      color: "#fff",
      borderRadius: "24px",
      fontSize: "16px",
      fontWeight: "700",
      cursor: "pointer",

      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },

    bookmarkButton: {
      position: "absolute",
      top: 15,
      right: 15,

      width: 42,
      height: 42,

      border: "none",
      borderRadius: "50%",

      background: "#fff",

      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      boxShadow: "0 3px 8px rgba(0,0,0,.15)",

      zIndex: 20,
      cursor: "pointer",
    },

  /* ================= SEARCH ================= */

  searchContainer: {
    display: "flex",
    alignItems: "center",
    background: "#FFFFFF",
    margin: "0 18px",
    borderRadius: "30px",
    padding: "12px 16px",
    boxShadow: "0 4px 12px rgba(0,0,0,.06)",
    marginBottom: "20px",
  },

  searchIcon: {
    color: "#D96E45",
    fontSize: "22px",
    marginRight: "10px",
  },

  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "15px",
    background: "transparent",
  },

  /* ================= SECTION ================= */

  section: {
    marginBottom: "2px",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#333",
    marginLeft: "18px",
    marginBottom: "12px",
  },

  sectionDaerah: {
    marginTop: "-15px",
    marginBottom: "20px",
  },

  /* ================= FILTER ================= */

  horizontalScroll: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    padding: "0 18px 6px",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },

  filterButton: {
    whiteSpace: "nowrap",
    border: "1px solid #D96E45",
    background: "#FFFFFF",
    color: "#D96E45",
    borderRadius: "30px",
    padding: "10px 18px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    flexShrink: 0,
  },

  filterButtonActive: {
    whiteSpace: "nowrap",
    border: "none",
    background: "#D96E45",
    color: "#FFFFFF",
    borderRadius: "30px",
    padding: "10px 18px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    flexShrink: 0,
  },

    /* ================= LIST RESEP ================= */

  recipeContainer: {
    padding: "0 18px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  recipeCard: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    background: "#fff",
    borderRadius: "20px",
    padding: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,.08)",
  },

  recipeImage: {
    width: "110px",
    height: "110px",
    borderRadius: "16px",
    objectFit: "cover",
    flexShrink: 0,
  },

  recipeImageWrapper:{
    position:"relative",
  },

  recipeBody: {
    flex: 1,
    marginLeft: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "110px",
  },

  recipeTitle: {
    margin: 0,
    fontSize: "17px",
    fontWeight: "700",
    color: "#222",
    lineHeight: "1.3",
  },

  /* ================= INFO ================= */

  infoRow: {
    display: "flex",
    gap: "16px",
    marginTop: "10px",
    marginBottom: "10px",
  },

  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "13px",
    color: "#666",
  },

  profileWrapper: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    overflow: "hidden",
    cursor: "pointer",
  },

  profileImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  /* ================= RATING ================= */

  bottomRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "6px",
  },

  ratingRow: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
  },

  ratingNumber: {
    fontWeight: "700",
    marginRight: "5px",
    color: "#444",
    fontSize: "14px",
  },

  star: {
    color: "#FFC107",
    fontSize: "18px",
  },

  starEmpty: {
    color: "#DDD",
    fontSize: "18px",
  },

  bookmarkActive: {
    color: "#D96E45",
    fontVariationSettings: "'FILL' 1",
    fontSize: "26px",
  },

  bookmarkInactive: {
    color: "#666",
    fontVariationSettings: "'FILL' 0",
    fontSize: "26px",
  },

  /* ================= BUTTON ================= */

  editButton: {
    border: "none",
    background: "#D96E45",
    color: "#FFFFFF",
    padding: "8px 18px",
    borderRadius: "20px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "13px",
  },

 recipeBookmark: {
    position: "absolute",
    top: 0,
    left: 290,

    width: 38,
    height: 38,

    border: "none",
    borderRadius: "50%",
    background: "#FFFFFF",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    boxShadow: "0 3px 8px rgba(0,0,0,.18)",
    cursor: "pointer",
    zIndex: 10,
  },

  /* ================= EMPTY ================= */

  emptyContainer: {
    height: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: "#666",
    fontSize: "18px",
    fontWeight: "600",
  },

  /* ================= MOBILE MENU ================= */

    menuoverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,.35)",
    zIndex: 998,
    },

    mobileMenu: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "260px",
    height: "100%",
    background: "#fff",
    zIndex: 999,
    boxShadow: "4px 0 20px rgba(0,0,0,.15)",
    paddingTop: "30px",
    },

    mobileHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 20px 20px",
      borderBottom: "1px solid #eee",
    },

    logo: {
    width: "38px",
    },

    logoText: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#D96E45",
    },

    menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "18px 20px",
    fontSize: "16px",
    cursor: "pointer",
    transition: ".2s",
    },

    logoContainer: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },

    closeIcon: {
      fontSize: "28px",
      color: "#D96E45",
      cursor: "pointer",
    },

    activeMenuItem: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      padding: "18px 20px",
      fontSize: "16px",
      fontWeight: "700",
      background: "#FCE7DE",
      color: "#D96E45",
      borderLeft: "5px solid #D96E45",
      cursor: "pointer",
      transition: ".2s",
    },
    
};
