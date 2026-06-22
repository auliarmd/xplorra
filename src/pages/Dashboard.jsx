import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:5000";

function Dashboard() {
  const navigate = useNavigate();
  const [notFound, setNotFound] = useState(false);
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("");
  const [daerah, setDaerah] = useState("");
  const [trendingFoods, setTrendingFoods] = useState([]);

  const goToRegister = () => {
    navigate("/Register");
  };

  const goToMasuk = () => {
    navigate("/Masuk");
  };

  useEffect(() => {

    fetch(`${BASE_URL}/foods/trending`)
      .then((res) => res.json())
      .then((data) => {

        setTrendingFoods(
          Array.isArray(data)
            ? data
            : []
        );

      })
      .catch((err) => {

        console.log(err);

      });

  }, []);

  useEffect(()=>{

    fetch(
      `${BASE_URL}/foods?kategori=${kategori}&daerah=${daerah}&search=${search}`
    )

    .then((res)=>res.json())

    .then((data)=>{

      console.log(data);

      setFoods(data);

      setNotFound(
        data.length === 0
      );

    })

    .catch((err)=>{
      console.log(err);
    });

  },[kategori, daerah, search]);
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

          <span
            onClick={goToRegister}
            style={{ cursor:"pointer" }}
          >
            Profil
          </span>
        </div>

        <div>
          <button
            style={styles.btnPrimary}
            onClick={goToRegister}
          >
            Daftar
          </button>

          <button
            style={styles.btnSecondary}
            onClick={goToMasuk}
          >
            Masuk
          </button>
        </div>
      </div>

      {/* TOP BACKGROUND */}
      <div style={styles.topBg}></div>

      {/* TRENDING */}
      <div style={styles.wrapper}>
        <div style={styles.trending}>
            {trendingFoods.map((item) => (
            <div key={item.id} style={styles.trendingCard} onClick={goToRegister}>
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
                      onClick={goToRegister}
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
            <span className="material-symbols-outlined" style={styles.searchIcon}>
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

            <div
              style={
                kategori === "Makanan utama"
                  ? styles.radioActive
                  : styles.radio
              }
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

            <div
              style={
                kategori === "Minuman"
                  ? styles.radioActive
                  : styles.radio
              }
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

          <div
            style={
              kategori === "Dessert"
                ? styles.radioActive
                : styles.radio
            }
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

        {
          notFound && (
            <h2
              style={{
                color:'#d86936',
                textAlign:'center',
                width:'100%',
                marginTop:'200px',
                fontSize:'20px'
              }}
            >
              Resep tidak ditemukan
            </h2>
          )
        }

        {/* GRID */}
        <div style={styles.cardContainer}>

        <div style={styles.grid}>

          {foods.map((item) => (

            <div
              key={item.id}
              style={styles.card}
              onClick={goToRegister}
            >

  {/* WRAPPER GAMBAR */}
  <div style={styles.cardImgWrapper}>
        {console.log(item.gambar)}
        {console.log(`${BASE_URL}/uploads/${item.gambar}`)}
        <img
          src={`${BASE_URL}/uploads/${item.gambar}`}
          style={styles.cardImg}
          alt=""
        />

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
                      goToRegister();
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

  btnPrimary: {
    background: "#F28C28",
    color: "#ffffff",
    border: "none",
    padding: "8px 30px",
    borderRadius: "20px",
    marginRight: "10px",
  },

  btnSecondary: {
    background: "#fbdfd1",
    color: "#F28C28",
    border: "none",
    padding: "8px 30px",
    borderRadius: "20px",
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
    //width: "580px", // lebih kecil & proporsional
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

  cardContainer: {
    flex: 1,
    height: "640px",
    overflowY: "auto",
    overflowX: "hidden",
    paddingRight: "10px",
    marginTop: "50px",
  },

  //trendingTitle: {
    //fontSize: "16px",
    //fontWeight: "600",
  //},

  infoRow: {
    display: "flex",
    gap: "15px",
    fontSize: "12px",
  },

  bottomRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },

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

    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",

    gap: "25px",

    alignContent: "start",
  },

  card: {
  background: "#fff",
  borderRadius: "18px",
  overflow: "hidden",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  width: "100%",
  maxWidth: "320px",
  marginTop: "20px",
  cursor: "pointer",
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

};

export default Dashboard;





