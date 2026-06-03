import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

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
  const [showPassword, setShowPassword] =
   useState(false);

  const [fotoPreview, setFotoPreview] =
    useState(null);


  useEffect(()=>{

    const token = localStorage.getItem("token");

    if(!token){
      navigate('/Masuk');
      return;
    }

    api.get('/profile')
      .then((res)=>{

        console.log(res.data);

        if(res.data.status){

          setUser(res.data.user);

        }
    
        api.get('/my-recipes')
          .then((res)=>{

            setMyRecipes(
              Array.isArray(res.data)
              ? res.data
              : []
            );

          })
          .catch((err)=>console.log(err));
        api.get('/my-bookmarks')
          .then((res)=>{

            setMyBookmarks(res.data);

          })
          .catch((err)=>console.log(err));
          
      })
      .catch((err)=>{

        console.log(err);

        localStorage.removeItem("token");

        navigate('/Masuk');

      });

  },[]);

  if(!user){
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
          <span onClick={() => navigate("/dashboardafterlogin")}>Home</span>
          <span style={styles.active}>Profil</span>
          <span onClick={() => navigate("/Notifikasi")}>Notifikasi</span>
        </div>

        <div style={styles.rightMenu}>

          
        </div>
      </div>

      {/* CONTENT */}
      <div style={styles.container}>

        {/* SIDEBAR */}
        <div style={styles.sidebar}>

          {/* Profil */}
          <div
            style={
              activeTab === "profil"
              ? {...styles.sidebarMenu, ...styles.activeMenu}
              : styles.sidebarMenu
            }

            onClick={()=>setActiveTab("profil")}
          >
            <span>Profil</span>

            <span
              className="material-symbols-outlined"
              style={styles.arrowIcon}
            >
              chevron_right
            </span>
          </div>

          <div style={styles.line}></div>

          {/* Resep Saya */}
          <div
            style={
              activeTab === "resep"
              ? {...styles.sidebarMenu, ...styles.activeMenu}
              : styles.sidebarMenu
            }
            onClick={()=>setActiveTab("resep")}
          >
            <span>Resep Saya</span>

            <span
            className="material-symbols-outlined"
            style={styles.arrowIcon}
          >
            chevron_right
          </span>
          </div>

          <div style={styles.line}></div>

          {/* Favorit */}
          <div
            style={
              activeTab === "favorit"
              ? {...styles.sidebarMenu, ...styles.activeMenu}
              : styles.sidebarMenu
            }
            onClick={()=>setActiveTab("favorit")}
          >
            <span>Favorit Saya</span>

            <span
              className="material-symbols-outlined"
              style={styles.arrowIcon}
            >
              chevron_right
            </span>
          </div>

          <div style={styles.line}></div>

          <div
            style={
              activeTab === "tambah"
              ? {...styles.sidebarMenu, ...styles.activeMenu}
              : styles.sidebarMenu
            }
            onClick={() => navigate("/tambah")}
          >
            <span>Tambah Resep</span>

            <span
              className="material-symbols-outlined"
              style={styles.arrowIcon}
            >
              chevron_right
            </span>
          </div>

        </div>

        {/* MAIN CONTENT */}

        {activeTab === "profil" && (

          <div style={styles.profileCard}>

            <div style={styles.profileHeader}>

              {/* AVATAR */}
              <div style={styles.avatar}>

                {
                  user?.foto ? (

                    <img
                      src={`http://localhost:5000/uploads/${user.foto}`}

                      alt="profile"

                      style={styles.avatarImg}
                    />

                  ) : (

                    <span
                      className="material-symbols-outlined"
                      style={styles.avatarPlaceholder}
                    >
                      person
                    </span>

                  )
                }

                <label style={styles.editIcon}>

                  ✎

                  <input
                    type="file"

                    hidden

                    accept="image/*"

                    onChange={async (e)=>{

                      const file = e.target.files[0];

                      if(!file) return;

                      const formData = new FormData();

                      formData.append(
                        'foto',
                        file
                      );

                      try{

                        const res = await api.post(

                          '/upload-profile',

                          formData,

                          {
                            headers:{
                              'Content-Type':
                              'multipart/form-data'
                            }
                          }

                        );

                        setUser((prev)=>({

                          ...prev,

                          foto:res.data.foto

                        }));

                        alert(
                          'Foto profile berhasil diubah'
                        );

                      }catch(err){

                        console.log(err);

                        alert(
                          'Gagal upload foto'
                        );

                      }

                    }}
                  />

                </label>

              </div>

              {/* INFO */}
              <div>
                <div>
                  <b>{user?.nama}</b>
                </div>

                <small style={styles.smallText}>
                  {user?.email}
                </small>
              </div>

            </div>

            {/* DATA */}
            <div style={styles.profileField}>
              <span>Nama</span>
              <span>{user?.nama}</span>
            </div>

            <div style={styles.profileField}>
              <span>Email account</span>
              <span>{user?.email}</span>
            </div>

            <div style={styles.profileField}>

              <span>Kata sandi</span>

              <div style={styles.passwordBox}>

                <span>
                  {showPassword ? "mypassword123" : "********"}
                </span>

                <span
                  className="material-symbols-outlined"
                  style={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "visibility" : "visibility_off"}
                </span>

              </div>

            </div>

            <button style={styles.logoutBtn}
              onClick={() => {

                const confirmLogout = window.confirm(
                  "Apakah Anda yakin ingin logout?"
                );

                if(confirmLogout){

                  localStorage.removeItem("token");

                  alert("Logout berhasil");

                  navigate('/Masuk');

                }

              }}
                          >
              Keluar
            </button>

            

          </div>

          )}


          {/* RECIPE SECTION */}
          {activeTab === "resep" && (

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

                    {myRecipes.map((item)=>(

                      <div key={item.id} style={styles.recipeCard}>

                        <img
                          src={`http://localhost:5000/uploads/${item.gambar}`}
                          alt=""
                          style={styles.recipeImg}
                        />

                        <div style={styles.recipeBody}>

                          <div style={styles.recipeTitle}>
                            {item.nama}
                          </div>

                          <div style={styles.rating}>
                            ⭐ {item.rating}
                          </div>

                          <div style={styles.btnRow}>

  <button
    style={styles.editBtn}
    onClick={()=>navigate(`/edit/${item.id}`)}
  >
    Edit
  </button>

  <button
      style={styles.deleteBtn}

      onClick={async ()=>{

        const confirmDelete = window.confirm(
          'Yakin ingin menghapus resep ini?'
        );

        if(!confirmDelete) return;

        try{

          await api.delete(
            `/delete-food/${item.id}`
          );

          alert('Resep berhasil dihapus');

          setMyRecipes(
            myRecipes.filter(
              resep => resep.id !== item.id
            )
          );

        }catch(err){

          console.log(err);

          alert('Gagal menghapus resep');

        }

      }}
    >
      Hapus
    </button>

  </div>

                        </div>

                      </div>

                    ))}

                  </div>

                )
              }

            </div>

          )}
          {activeTab === "favorit" && (

            <div style={styles.recipeContainer}>

              {
                myBookmarks.length === 0 ? (

                  <div style={styles.emptyContainer}>

                    <span
                      className="material-symbols-outlined"
                      style={styles.emptyIcon}
                    >
                      favorite
                    </span>

                    <p>Belum ada resep favorit</p>

                  </div>

                ) : (

                  <div style={styles.recipeGrid}>

                    {myBookmarks.map((item)=>(

                      <div key={item.id} style={styles.recipeCard}>

                        <img
                          src={`http://localhost:5000/uploads/${item.gambar}`}
                          alt=""
                          style={styles.recipeImg}
                        />

                        <div style={styles.recipeBody}>

                          <div style={styles.recipeTitle}>
                            {item.nama}
                          </div>

                          <div style={styles.rating}>
                            ⭐ {item.rating}
                          </div>

                        </div>

                      </div>

                    ))}

                  </div>

                )
              }

            </div>

          )}
        </div>
        

      </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #e8d9c5, #c8845e)",
    fontFamily: "Segoe UI, sans-serif",
  },

  /* NAVBAR */
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 15px",
    background: "#fff",
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
    display: "flex",
    alignItems: "flex-start",

    gap: "50px",

    paddingTop: "90px",
    paddingLeft: "260px",
    paddingRight: "200px",
  },

  /* SIDEBAR */
  sidebar: {
  width: "300px",
  background: "#f5f2ef",
  borderRadius: "22px",
  padding: "28px 24px",
  boxShadow: "0 6px 12px rgba(0,0,0,0.25)",
  marginTop: "100px",
},

  sidebarMenu: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    fontSize: "18px",
    fontWeight: "700",
    color: "#111",

    padding: "10px 0",

    cursor: "pointer",
  },

  menu: {
    display: "flex",
    gap: "30px",
    fontSize: "18px",
    fontWeight: "500",
    fontWeight: "bold",
  },

  activeMenu: {
    color: "#e46b3c",
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
    width: "650px", // tambahkan ini

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

    overflow:'hidden',

    display:'flex',

    justifyContent:'center',

    alignItems:'center',
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
  recipeContainer: {
    width: "850px",

    minHeight: "auto",

    background: "#f4ebe2",

    borderRadius: "28px",

    padding: "40px",

    border: "2px solid #e46b3c",

    boxShadow: `
      0 8px 20px rgba(0,0,0,0.12),
      0 0 15px rgba(228,107,60,0.15)
    `,

    display: "flex",

    justifyContent: "flex-start",

    alignItems: "flex-start",
  },

  recipeSection: {
    marginTop: "60px",

    background: "#f4ebe2",

    borderRadius: "20px",

    padding: "20px",

    boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
  },

  recipeCard: {
    width: "250px",

    background: "#fff",

    borderRadius: "22px",

    overflow: "hidden",

    boxShadow: `
      0 8px 18px rgba(0,0,0,0.12),
      0 0 12px rgba(228,107,60,0.12)
    `,

    transition: "0.3s",

    display: "flex",

    flexDirection: "column",

    justifyContent: "space-between",

    minHeight: "330px",
  },

  recipeGrid: {
    display: "flex",
    flexWrap: "wrap",

    gap: "25px",

    alignItems: "flex-start",
  },

  recipeImg: {
    width: "100%",

    height: "180px",

    objectFit: "cover",

    display: "block",
  },

  recipeBody: {
    padding: "18px",

    display: "flex",

    flexDirection: "column",

    gap: "10px",
},

  recipeTitle: {
    fontWeight: "700",

    fontSize: "20px",

    color: "#222",

    lineHeight: "1.3",
  },

  rating: {
    fontSize: "15px",

    color: "#555",

    display: "flex",

    alignItems: "center",

    gap: "5px",
  },

  editBtn:{
    flex:1,

    background:'#e46b3c',

    border:'none',

    color:'#fff',

    padding:'10px',

    borderRadius:'12px',

    cursor:'pointer',

    fontSize:'14px',

    fontWeight:'600',
  },

  btnRow:{
    display:'flex',

    gap:'12px',

    marginTop:'10px',

    width:'100%',
  },

  deleteBtn:{
    flex:1,

    background:'#c0392b',

    border:'none',

    color:'#fff',

    padding:'10px',

    borderRadius:'12px',

    cursor:'pointer',

    fontSize:'14px',

    fontWeight:'600',
  },

  avatarImg:{
    width:'100%',

    height:'100%',

    borderRadius:'50%',

    objectFit:'cover',
  },

  avatarPlaceholder:{
    fontSize:'42px',

    color:'#666',
  },
};

export default Profil;