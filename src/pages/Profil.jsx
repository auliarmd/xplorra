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
            console.log(res.data);

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
        <div style={styles.leftSection}>

        <div style={styles.sidebar}>

          <h2 style={styles.sidebarTitle}>
            CHEF NUSANTARA
          </h2>

          {/* Profil */}
          <div
            style={
              activeTab === "profil"
              ? {...styles.sidebarMenu, ...styles.activeMenu}
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
              ? {...styles.sidebarMenu, ...styles.activeMenu}
              : styles.sidebarMenu
            }
            onClick={()=>setActiveTab("resep")}
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
              ? {...styles.sidebarMenu, ...styles.activeMenu}
              : styles.sidebarMenu
            }
            onClick={()=>setActiveTab("favorit")}
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

          {
            user?.foto ? (

              <img
                src={`http://localhost:5000/uploads/${user.foto}`}
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

            )
          }

          <label style={styles.cameraBtn}>

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
            />

          </label>

        </div>

        {/* CONTENT */}
        <div style={styles.profileContent}>

          <div style={styles.inputRow}>

            <div style={styles.inputGroupModern}>
              <label style={styles.labelModern}>
                FULL NAME
              </label>

              <div style={styles.inputModern}>
                {user.nama}

                <span
                  className="material-symbols-outlined"
                  style={styles.editPencil}
                >
                  edit
                </span>

              </div>

            </div>

            <div style={styles.inputGroupModern}>
              <label style={styles.labelModern}>
                EMAIL ADDRESS
              </label>

              <div style={styles.inputModern}>
                {user.email}
              </div>

            </div>

          </div>

          <div style={styles.securityTitle}>
            ACCOUNT SECURITY
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
                  Account Password
                </div>

                <div style={styles.passwordDots}>
                  ••••••••••••
                </div>

              </div>

            </div>

            <button style={styles.changeBtn}>
              Change
            </button>

          </div>

          <div style={styles.separator}></div>

          <div style={styles.logoutWrapper}>

            <button
              style={styles.logoutModern}
              onClick={() => {

                const confirmLogout =
                  window.confirm(
                    "Apakah Anda yakin ingin logout?"
                  );

                if(confirmLogout){

                  localStorage.removeItem("token");

                  navigate("/Masuk");

                }

              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize:"18px",
                  marginRight:"5px"
                }}
              >
                logout
              </span>

              Log Out

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
                        style={styles.card}
                      >

                        <div style={styles.cardImgWrapper}>

                          <img
                            src={`http://localhost:5000/uploads/${item.gambar}`}
                            style={styles.cardImg}
                            alt=""
                          />

                          {/* HAPUS menggantikan bookmark */}
                          <button
                            style={styles.deleteFloatingBtn}
                            onClick={async (e) => {

                              e.stopPropagation();

                              const confirmDelete =
                                window.confirm(
                                  "Yakin ingin menghapus resep ini?"
                                );

                              if(!confirmDelete) return;

                              try{

                                await api.delete(
                                  `/delete-food/${item.id}`
                                );

                                setMyRecipes(
                                  myRecipes.filter(
                                    resep => resep.id !== item.id
                                  )
                                );

                              }catch(err){

                                console.log(err);

                              }

                            }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={styles.bookmark}
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

                          <div style={styles.bottomRow}>

                            <div style={styles.rating}>
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
                            </div>

                            <button
                              style={styles.btnLihat}
                              onClick={() =>
                                navigate(`/edit/${item.id}`)
                              }
                            >
                              Edit
                            </button>

                          </div>

                        </div>

                      </div>
                      

                    ))}

                  </div>
                  

                )
              }

            </div>
            </div> 

          )}
          {activeTab === "favorit" && (

            <div style={styles.rightSection}>

              <h1 style={styles.pageTitle}>
                Resep Tersimpan
              </h1>

            <div style={styles.recipeContainer}>

              {
                myBookmarks.length === 0 ? (

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

                    {myBookmarks.map((item)=>(

                      <div
                        key={item.id}
                        style={styles.card}
                      >

                        <div style={styles.cardImgWrapper}>

                          <img
                            src={`http://localhost:5000/uploads/${item.gambar}`}
                            style={styles.cardImg}
                            alt=""
                          />

                          <button
                            style={styles.bookmarkBtn}
                            onClick={async (e)=>{

                              e.stopPropagation();

                              try{

                                await api.post(
                                  `/bookmark/${item.id}`
                                );

                                setMyBookmarks(

                                  myBookmarks.filter(
                                    resep => resep.id !== item.id
                                  )

                                );

                              }catch(err){

                                console.log(err);

                              }

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
                              onClick={() =>
                                navigate(`/detail/${item.id}`)
                              }
                            >
                              Lihat
                            </button>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>

                )
              }

            </div>

            </div>   

          )}
        </div>
        

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
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",

    backgroundSize:"100%",

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

  menu: {
    display: "flex",
    gap: "30px",
    fontSize: "18px",
    fontWeight: "500",
    fontWeight: "bold",
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

  editBtn:{
    border:"none",
    background:"#df6d4f",
    color:"#fff",
    padding:"10px 25px",
    borderRadius:"999px",
    cursor:"pointer",
    fontWeight:"700",
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

  deleteFloatingBtn:{
    position:"absolute",
    top:"12px",
    right:"12px",

    width:"32px",
    height:"32px",

    border:"none",
    borderRadius:"50%",

    background:"#fff",

    cursor:"pointer",

    fontSize:"18px",

    boxShadow:"0 2px 8px rgba(0,0,0,0.2)",
  },

  bottomRow:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    marginTop:"10px",
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
    color: "#FFC107", // kuning
    //fontVariationSettings: "'OPSZ' 14",
  },

  starEmpty: {
    fontSize: "22px",
    color: "#ddd", // abu
  // fontVariationSettings: "'OPSZ' 14",
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

  bookmarkActive: {
    fontSize: "24px",
    color: "#E46B3C",

    fontVariationSettings:
      "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",

    WebkitTextStroke: "1px #000",
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
  },

  profileBanner:{
    height:"95px",
    background:
    "linear-gradient(90deg,#B26D00,#E2856E)",
  },

  profilePhotoWrapper:{
    position:"relative",
    marginTop:"-45px",
    marginLeft:"25px",
    width:"90px",
  },

  profilePhoto:{
    width:"95px",
    height:"95px",
    borderRadius:"50%",
    objectFit:"cover",
    border:"4px solid #fff",
  },

  profilePlaceholder:{
    width:"90px",
    height:"90px",
    borderRadius:"50%",
    background:"#ddd",
    fontSize:"60px",
  },

  cameraBtn:{
    position:"absolute",
    right:"0",
    bottom:"5px",

    width:"30px",
    height:"30px",

    borderRadius:"50%",

    background:"#a66b09",

    display:"flex",
    alignItems:"center",
    justifyContent:"center",

    cursor:"pointer",
  },

  profileContent:{
    padding:"15px 30px 30px",
  },

  inputRow:{
    display:"flex",
    gap:"15px",
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
    width:"90%",
    height:"38px",
    border:"1px solid #ead3c3",
    borderRadius:"8px",
    padding:"0 14px",
    fontSize:"14px",
    background:"#fffaf8",
  },

  editPencil:{
    color:"#d4b6a4",
    fontSize:"20px",
    right:"50px",
    top:"50%",
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
    width:"80px",
    height:"80px",

    borderRadius:"50%",

    background:"#f2e5dd",

    display:"flex",
    justifyContent:"center",
    alignItems:"center",

    color:"#9d8878",

    marginBottom:"20px",
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
  
};

export default Profil;