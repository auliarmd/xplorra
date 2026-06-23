import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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

  const filterFoods = (
    newKategori,
    newDaerah,
    newSearch
  ) => {

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

  }, []);

  useEffect(() => {

        filterFoods();
        console.log(
          "FILTER",
          kategori,
          daerah,
          search
        );

      }, [kategori, daerah, search]);

const toggleSave = async (id) => {

  try{

    const response = await api.post(
      `/bookmark/${id}`
    );

    // jika tersimpan
    if(response.data.bookmarked){

      setSavedRecipes([
        ...savedRecipes,
        id
      ]);

    }

    // jika dibatalkan
    else{

      setSavedRecipes(

        savedRecipes.filter(
          item => item !== id
        )

      );

    }

  }catch(err){

    console.log(err);

  }

};

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <div style={styles.logoContainer}>
        <img src="/logo_X.png" alt="logo" style={styles.logoImg} />
        <span style={styles.logoText}>pLorra</span>
        </div>
        <div style={styles.menu}>
          <span style={styles.active}>Home</span>
          <span onClick={() => navigate("/profil")}>Profil</span>
          <span onClick={() => navigate("/notifikasi")}>Notifikasi</span>
        </div>

        <div style={styles.rightMenu}>
          <button
            style={styles.btnTambah}
            onClick={() => navigate("/tambah")}
          >
            + Tambah resep
          </button>

          <div
            style={styles.profileCircle}
            onClick={() => navigate("/profil")}
          >

            {
              user.foto ? (
                <img
                  src={`http://localhost:5000/uploads/${user.foto}`}
                  alt="Profile"
                  style={styles.profileImg}
                />
              ) : (
                <span className="material-symbols-outlined">
                  person
                </span>
              )
            }

          </div>
        </div>
      </div>

      {/* TOP BACKGROUND */}
      <div style={styles.topBg}></div>

      {/* TRENDING */}
      <div style={styles.wrapper}>
        <div style={styles.trending}>
            {Array.isArray(trendingFoods) &&
            trendingFoods.map((item) => (
            <div key={item.id} style={styles.trendingCard} onClick={() => navigate(`/detail/${item.id}`)}>
                <div style={styles.imageWrapper}>
                <img
                  src={`http://localhost:5000/uploads/${item.gambar}`}
                  style={styles.trendingImg}
                  alt={item.nama}
                  onError={(e) => {
                    console.log("Trending gagal:", item.gambar);

                    e.target.src =
                      "https://via.placeholder.com/600x250?text=No+Image";
                  }}
                />

                {/* INI YANG BARU */}
                <div style={styles.overlay}>
                    <p style={styles.trendingText}>Trending Now</p>

                    {/* TOMBOL SIMPAN */}
                    <button
                      style={styles.bookmarkBtn}
                      onClick={(e)=>{

                        e.stopPropagation();

                        toggleSave(item.id);

                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={
                          savedRecipes.includes(item.id)
                          ? styles.bookmarkActive
                          : styles.bookmark
                        }
                      >
                        {
                          savedRecipes.includes(item.id)
                          ? "bookmark"
                          : "bookmark_border"
                        }
                      </span>
                    </button>
                    </div>
                </div>

                <div style={styles.trendingOverlay}>
                <h4 style={styles.trendingHeading}>
                  {item.nama}
                </h4>

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

                      </span>

                    <button
                      style={styles.btnLihat}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/detail/${item.id}`)
                      }}
                    >
                      Lihat
                    </button>
                </div>
                </div>
            </div>
            ))}
            </div>
        </div>

      <div style={styles.content}>
        {/* SIDEBAR */}
        <div style={styles.sidebar}>

          {/* SEARCH */}
          <div style={styles.searchBox}>
            <span
              className="material-symbols-outlined"
              style={styles.searchIcon}
            >
              search
            </span>

            <input
              placeholder="Search"
              style={styles.searchInput}
              value={search}
              onChange={(e) => {

                const keyword = e.target.value;

                setSearch(keyword);

              }}
            />

            {(kategori || daerah) && (
              <span
                className="material-symbols-outlined"
                style={styles.clearFilterIcon}
                onClick={() => {
                  setKategori("");
                  setDaerah("");
                }}
                title="Hapus Filter"
              >
                filter_alt_off
              </span>
            )}
          </div>

          

          {/* TITLE */}
          <h2 style={styles.title}>Kategori</h2>

          {/* JENIS HIDANGAN */}
          <p style={styles.sectionTitle}>Jenis hidangan</p>

          <div
            style={styles.optionRow}
            onClick={() => {
              setKategori("Makanan utama");
            }}
          >
            <span>Makanan utama</span>

            <div style={kategori === "Makanan utama"
              ? styles.radioActive
              : styles.radio}
            >

              {kategori === "Makanan utama" && (
                <div style={styles.radioInner}></div>
              )}

            </div>
          </div>

          <div
            style={styles.optionRow}
            onClick={() => {
              setKategori("Minuman");
            }}
          >
            <span>Minuman</span>

            <div style={kategori === "Minuman"
              ? styles.radioActive
              : styles.radio}
            >

              {kategori === "Minuman" && (
                <div style={styles.radioInner}></div>
              )}

            </div>
          </div>

          <div
            style={styles.optionRow}
            onClick={() => {
              setKategori("Dessert");
            }}
          >
            <span>Dessert</span>

            <div style={kategori === "Dessert"
              ? styles.radioActive
              : styles.radio}
            >

              {kategori === "Dessert" && (
                <div style={styles.radioInner}></div>
              )}

            </div>
          </div>

          <div style={styles.divider}></div>

          {/* DAERAH */}
          <p style={styles.sectionTitle}>Daerah asal</p>
          <div
            style={styles.optionRow}
            onClick={() => {
              setDaerah("Sumatera");
            }}
          >
            <span>Sumatera</span>

            <div style={daerah === "Sumatera"
              ? styles.radioActive
              : styles.radio}
            >

              {daerah === "Sumatera" && (
                <div style={styles.radioInner}></div>
              )}

            </div>
          </div>

          <div
            style={styles.optionRow}
            onClick={() => {
              setDaerah("Kalimantan");
            }}
          >
            <span>Kalimantan</span>

            <div style={daerah === "Kalimantan"
              ? styles.radioActive
              : styles.radio}
            >

              {daerah === "Kalimantan" && (
                <div style={styles.radioInner}></div>
              )}

            </div>
          </div>

          <div
            style={styles.optionRow}
            onClick={() => {
              setDaerah("Sulawesi");
            }}
          >
            <span>Sulawesi</span>

            <div style={daerah === "Sulawesi"
              ? styles.radioActive
              : styles.radio}
            >

              {daerah === "Sulawesi" && (
                <div style={styles.radioInner}></div>
              )}

            </div>
          </div>
          <div
            style={styles.optionRow}
            onClick={() => {
              setDaerah("Maluku");
            }}
          >
            <span>Maluku</span>

            <div style={daerah === "Maluku"
              ? styles.radioActive
              : styles.radio}
            >

              {daerah === "Maluku" && (
                <div style={styles.radioInner}></div>
              )}

            </div>
          </div>

          <div
            style={styles.optionRow}
            onClick={() => {
              setDaerah("Irian Jaya");
            }}
          >
            <span>Irian jaya</span>

            <div style={daerah === "Irian Jaya"
              ? styles.radioActive
              : styles.radio}
            >

              {daerah === "Irian Jaya" && (
                <div style={styles.radioInner}></div>
              )}

            </div>
          </div>

         <div
            style={styles.optionRow}
            onClick={() => {
              setDaerah("Nusa Tenggara");
            }}
          >
            <span>Nusa Tenggara</span>

            <div style={daerah === "Nusa Tenggara"
              ? styles.radioActive
              : styles.radio}
            >

              {daerah === "Nusa Tenggara" && (
                <div style={styles.radioInner}></div>
              )}

            </div>
          </div>

          <div
            style={styles.optionRow}
            onClick={() => {
              setDaerah("Jawa");
            }}
          >
            <span>Jawa</span>

            <div style={daerah === "Jawa"
              ? styles.radioActive
              : styles.radio}
            >

              {daerah === "Jawa" && (
                <div style={styles.radioInner}></div>
              )}

            </div>
          </div>
        </div>

        {/* PESAN JIKA RESEP KOSONG */}
        <div style={styles.cardContainer}>

          {notFound ? (

            <div style={styles.emptyResult}>
              <h2 style={styles.emptyResultText}>
                Resep tidak ditemukan
              </h2>
            </div>

          ) : (

            <div style={styles.grid}>

              {(Array.isArray(foods) ? foods : []).map((item) => (

            <div
              key={item.id}
              style={styles.card}
              onClick={() => navigate(`/detail/${item.id}`)}
            >

  {/* WRAPPER GAMBAR */}
  <div style={styles.cardImgWrapper}>
        {console.log(item.gambar)}
        {console.log(`${api.defaults.baseURL}/uploads/${item.gambar}`)}
        <img
          src={`${api.defaults.baseURL}/uploads/${item.gambar}`}
          style={styles.cardImg}
          alt=""
        />

        {/* TOMBOL SIMPAN */}
        <button
          style={styles.bookmarkBtn}
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
              : styles.bookmark
            }
          >
            {
              savedRecipes.includes(item.id)
              ? "bookmark"
              : "bookmark_border"
            }
          </span>
        </button>

      </div>

              <div style={styles.cardBody}>
                <h4>{item.nama}</h4>

                {/* LIKE & COMMENT */}
                <div style={styles.infoRow}>
                  <span style={styles.iconText}>
                    <span className="material-symbols-outlined" style={styles.materialIcon}>comment</span> {item.total_komentar}
                  </span>

                  <span style={styles.iconText}>
                    <span className="material-symbols-outlined" style={styles.materialIcon}>thumb_up</span> {item.likes}
                  </span>
                </div>

                <div style={styles.bottomRow}>
                  <span style={styles.rating}>

                    {item.rating}

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

                  </span>                  
                  <button
                    style={styles.btnLihat}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/detail/${item.id}`)
                    }}
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
        {/* GRID */}
        

      
      <div
        style={styles.feedbackBtn}
        onClick={() => navigate("/feedback")}
      >
        <span className="material-symbols-outlined">chat</span>
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
    padding: "15px 15px",
    background: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 999,
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

  topBg: {
    height: "500px",
    backgroundImage: `
        linear-gradient(to bottom, rgba(180, 113, 71, 0.9), rgba(245,236,222,0.0)),
        url('/map.png')
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    },

  wrapper: {
    maxWidth: "2100px",
    margin: "0 auto",
    },

  trending: {
    display: "flex",
    justifyContent: "center", // biar ke tengah
    gap: "clamp(16px, 5vw, 130px)",
    //gap: "130px",
    padding: "0 50px",
    marginTop: "-420px",
    position: "relative",
    //zIndex: 2,
    },

  trendingCard: {
    width: "100%",
    maxWidth: "600px",
    minWidth: "100px",
    borderRadius: "20px",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  },

  trendingImg: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
  },

  trendingOverlay: {
    padding: "20px",
  },

  trendingHeading: { //nama resep card trending
    fontSize: "22px",
    fontWeight: "700",
    lineHeight: "1.3",
    margin: "20px 0",
    marginTop: "-8px"
  },

  //trendingTitle: {
    //fontSize: "16px",
    //fontWeight: "600",
  //},

  
 

  btnLihat: {
    background: "#d86936",
    color: "#fff",
    border: "none",
    padding: "8px 35px",
    borderRadius: "20px",
    marginRight: "10px",   // geser dari kanan
    marginBottom: "5px", 
  },

  imageWrapper: {
  position: "relative",
},


trendingText: {
  position: "absolute",
  top: "-10px",
  left: "15px",

  color: " #000",
  fontSize: "24px",
  fontWeight: "900",
  lineHeight: "1",
  //textShadow: "0 2px 4px rgba(0,0,0,0.4)",
  WebkitTextStroke: "0.7px white",
},

rightMenu: {
  display: "flex",
  alignItems: "center",
  gap: "15px",
},

btnTambah: {
  border: "1.5px solid #e15b3c",
  color: "#e15b3c",
  background: "transparent",
  padding: "6px 15px",
  borderRadius: "20px",
  cursor: "pointer",
  fontWeight: "600",
},

profileImg: {
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  objectFit: "cover",
},

profileCircle: {
  width: "35px",
  height: "35px",
  borderRadius: "50%",
  background: "#f4b8a3",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
},

bookmarkBtn: {
  position: "absolute",
  top: "10px",
  right: "15px",
  background: "#fff",
  border: "none",
  borderRadius: "50%",
  width: "35px",
  height: "35px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
},

bookmark: {
  color: "#555",
},

bookmarkActive: {
  color: "#e15b3c",
},

feedbackBtn: {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  width: "55px",
  height: "55px",
  borderRadius: "50%",
  background: "#e15b3c",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontSize: "24px",
  cursor: "pointer",
  boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
},

  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",

    border: "2px solid #C51313",
    borderRadius: "30px",

    padding: "8px 15px",
    width: "100%",
    margin: "30px 0",//jarak 
    marginLeft: "-15px",
    marginBottom: "10px", //jarak dgn kategori

    background: "#fff",
    //transition: "0.3s",
  },

  searchIcon: {
    fontSize: "18px",
    color: "#F28C28",
  },

  searchInput: {
    border: "none",
    outline: "none",

    fontSize: "14px",
    color: "#F28C28",

    width: "100%",
    //fontWeight: "500",
  },

  sidebar: {
    width: "260px",

    position: "sticky",
    top: "20px",

    alignSelf: "flex-start",

    height: "fit-content",
  },

  title: {
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "-5px",
  },

  sectionTitle: {
    color: "#e15b3c",
    fontWeight: "700",
    marginBottom: "10px",
    borderBottom: "3px solid #e15b3c",
    display: "inline-block",
    paddingBottom: "5px",
    fontSize: "19px",
  },

  optionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
    fontSize: "16px",
  },

  radio: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    border: "2px solid #e15b3c",
    boxSizing: "border-box",
  },

  radioActive: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    border: "2px solid #e15b3c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },

  radioInner: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#e15b3c",
  },

  divider: {
    height: "4px",
    background: "#e15b3c",
    margin: "10px 0",
    marginTop: "30px",
    marginBottom: "10px",
    width: "100%",
  },

  label: {
    color: "#ff7a00",
    fontWeight: "bold",
  },

  checked: {
    color: "#ff7a00",
    fontWeight: "bold",
  },
  
 content: {
    display: "flex",
    gap: "110px", // jarak sidebar & grid
    padding: "20px 50px",
    alignItems: "flex-start",
  },

 grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 320px))",
    gap: "25px",
    justifyContent: "start",
  },

cardContainer: {
    flex: 1,
    height: "640px",
    overflowY: "auto",
    overflowX: "hidden",
    paddingRight: "10px",
    marginTop: "50px",
  },

  card: {
  background: "#fff",
  borderRadius: "18px",
  overflow: "hidden",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  width: "100%",
  maxWidth: "320px",
  marginTop: "20px",
},

  cardImg: {
  width: "100%",
  height: "150px",
  objectFit: "cover",
},

cardImgWrapper: {
  position: "relative",
},

  cardBody: {
  padding: "0px 10px 8px 15px",  // ⬅️ lebih pendek
  display: "flex",
  flexDirection: "column",
  gap: "0px", // ⬅️ ini kunci (bukan space-between)
  marginTop: "-8px", 
},

cardTitle: {
  fontSize: "16px",
  margin: "0", // ⬅️ hapus semua margin
  lineHeight: "1.1", // ⬅️ penting biar rapat
  marginTop: "0px", 

},

infoRow: {
  display: "flex",
  gap: "8px",
  fontSize: "11px",
  color: "#555",
  margin: "0",
  marginTop: "-10px",
},

bottomRow: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "0",
},

iconText: {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "12px",
  color: "#555",
},

materialIcon: {
  fontSize: "20px",
},

rating: {
  display: "flex",
  alignItems: "center",
  gap: "2px",
  fontSize: "14px",
},

star: {
  fontSize: "20px",
  color: "#FFC107", // kuning
  //fontVariationSettings: "'OPSZ' 14",
},

starEmpty: {
  fontSize: "22px",
  color: "#ddd", // abu
 // fontVariationSettings: "'OPSZ' 14",
},

  emptyResult: {
    width: "100%",
    height: "640px", // samakan dengan tinggi cardContainer
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyResultText: {
    color: "#a4a4a4",
    fontSize: "28px",
    fontWeight: "700",
    textAlign: "center",
    marginTop: "-10px",
    marginLeft: "-10px",
  },

  clearFilterBtn: {
    width: "100%",
    padding: "10px",
    border: "2px solid #d86936",
    background: "#fff",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "15px",
  },

};

export default DashboardAfterLogin;