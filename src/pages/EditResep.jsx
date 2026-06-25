import React, { useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function EditResep() {
const navigate = useNavigate();
const { id } = useParams();
const [nama, setNama] = useState("");
const [deskripsi, setDeskripsi] = useState("");
const [daerah, setDaerah] = useState("");
const [kategori, setKategori] = useState("");
const [gambar, setGambar] = useState(null);
const [preview, setPreview] = useState("");
const [bahan, setBahan] = useState([""]);
const [langkah, setLangkah] = useState([""]);
const [user, setUser] = useState(null);
const [hoverSave, setHoverSave] = useState(false);
const [hoverCancel, setHoverCancel] = useState(false);
const [showSuccessPopup, setShowSuccessPopup] = useState(false);
const isMobile = window.innerWidth <= 768;
console.log("Width:", window.innerWidth);
console.log("isMobile:", isMobile);
const [showMobileMenu, setShowMobileMenu] = useState(false);

useEffect(() => {

  const getResep = async () => {

    try {

      const response = await api.get(
        `/foods/${id}`
      );

      const data = response.data;

      setNama(data.nama);
      setDeskripsi(data.deskripsi);
      setDaerah(data.daerah);
      setKategori(data.kategori);

      setBahan(JSON.parse(data.bahan));
      setLangkah(JSON.parse(data.langkah));

      setPreview(
        `https://xplorra-production.up.railway.app/uploads/${data.gambar}`
      );

    } catch(err) {

      console.log(err);

    }

  };

  getResep();

  api.get("/profile")
    .then((res) => {

      if(res.data.status){
        setUser(res.data.user);
      }

    })
    .catch((err) => {
      console.log(err);
    });

}, [id]);

const handleUpdate = async () => {

  const bahanKosong = bahan.some(
    item => item.trim() === ""
  );

  const langkahKosong = langkah.some(
    item => item.trim() === ""
  );

  if(
    !nama ||
    !kategori ||
    !deskripsi ||
    !daerah ||
    bahanKosong ||
    langkahKosong
  ){
    return alert("Isi semua form");
  }

  try{

    const formData = new FormData();

    formData.append("nama", nama);
    formData.append("deskripsi", deskripsi);
    formData.append("daerah", daerah);
    formData.append("kategori", kategori);

    formData.append(
      "bahan",
      JSON.stringify(bahan)
    );

    formData.append(
      "langkah",
      JSON.stringify(langkah)
    );

    if(gambar){
      formData.append(
        "gambar",
        gambar
      );
    }

    await api.put(
  `/edit-food/${id}`,
  formData,
  {
    headers:{
      "Content-Type":"multipart/form-data"
    }
  }
);

// tampilkan popup
setShowSuccessPopup(true);

// pindah halaman setelah 2 detik
setTimeout(() => {
  navigate("/dashboardafterlogin");
}, 2000);

  } catch(err){

    console.log(err);

    alert("Gagal update resep");

  }

};

const tambahBahan = () => {

  setBahan([...bahan,""]);

};

const hapusBahan = (index) => {

  const data = bahan.filter(
    (_,i)=>i !== index
  );

  setBahan(data);

};

const ubahBahan = (index,value) => {

  const data = [...bahan];

  data[index] = value;

  setBahan(data);

};

const tambahLangkah = () => {

  setLangkah([...langkah,""]);

};

const hapusLangkah = (index) => {

  const data = langkah.filter(
    (_,i)=>i !== index
  );

  setLangkah(data);

};

const ubahLangkah = (index,value) => {

  const data = [...langkah];

  data[index] = value;

  setLangkah(data);

};

console.log(user);
  return (
    <div style={styles.page}>
    <div style={styles.mapBackground}></div>

      {/* NAVBAR */}
<div
  style={{
    ...styles.navbar,
    ...(isMobile ? mobileStyles.navbar : {})
  }}
>

  {/* MOBILE */}
  {isMobile ? (
    <>
      <span
        className="material-symbols-outlined"
        style={styles.mobileMenuIcon}
        onClick={() => setShowMobileMenu(true)}
      >
        menu
      </span>

      <div style={styles.mobileHeaderTitle}>
        Edit Resep
      </div>

      <div
        style={styles.profileCircle}
        onClick={() => navigate("/profil")}
      >
        {user?.foto ? (
          <img
            src={`https://xplorra-production.up.railway.app/uploads/${user.foto}`}
            alt="profile"
            style={styles.profileImage}
          />
        ) : (
          <span className="material-symbols-outlined">
            person
          </span>
        )}
      </div>
    </>
  ) : (
    <>
      <div style={styles.logoContainer}>
        <img
          src="/logo_X.png"
          alt="logo"
          style={styles.logoImg}
        />
        <span style={styles.logoText}>
          pLorra
        </span>
      </div>

      <div style={styles.headerCenter}>
        <div style={styles.headerTitle}>
          Edit Resep
        </div>
      </div>

      <div style={styles.menu}>
        <span onClick={() => navigate("/dashboardafterlogin")}>
          Home
        </span>

        <span onClick={() => navigate("/profil")}>
          Profil
        </span>

        <span onClick={() => navigate("/Notifikasi")}>
          Notifikasi
        </span>
      </div>

      <div
        style={styles.profileCircle}
        onClick={() => navigate("/profil")}
      >
        {user?.foto ? (
          <img
            src={`https://xplorra-production.up.railway.app/uploads/${user.foto}`}
            alt="profile"
            style={styles.profileImage}
          />
        ) : (
          <span className="material-symbols-outlined">
            person
          </span>
        )}
      </div>
    </>
  )}

</div>

{isMobile && showMobileMenu && (

  <div style={styles.mobileMenu}>

    <div style={styles.mobileMenuHeader}>

      <div
        style={styles.mobileLogoContainer}
      >
        <img
          src="/logo_X.png"
          alt="logo"
          style={styles.mobileLogo}
        />

        <span style={styles.mobileLogoText}>
          pLorra
        </span>
      </div>

      <span
        className="material-symbols-outlined"
        style={styles.mobileMenuIcon}
        onClick={() =>
          setShowMobileMenu(false)
        }
      >
        menu
      </span>

    </div>

    <div
      style={styles.mobileMenuItem}
      onClick={() =>
        navigate("/dashboardafterlogin")
      }
    >
      <span className="material-symbols-outlined">
        home
      </span>

      Home
    </div>

    <div
      style={styles.mobileMenuItem}
      onClick={() =>
        navigate("/profil")
      }
    >
      <span className="material-symbols-outlined">
        person
      </span>

      Profil
    </div>

    <div
      style={styles.mobileMenuItem}
      onClick={() =>
        navigate("/Notifikasi")
      }
    >
      <span className="material-symbols-outlined">
        notifications
      </span>

      Notifikasi
    </div>

  </div>

)}

      {/* CONTENT */}
    <div
  style={{
    ...styles.content,
    ...(isMobile ? mobileStyles.content : {})
  }}
>
        {/* FORM */}
       <div
  style={{
    ...styles.formContainer,
    ...(isMobile ? mobileStyles.formContainer : {})
  }}
>

          {/* UPLOAD */}
          <div style={styles.sectionHeader}>
            Media
          </div>
        <div style={styles.formWrapper}>
<div
  style={{
    ...styles.uploadBox,
    ...(isMobile ? mobileStyles.uploadBox : {})
  }}
>

  {preview ? (

    <>
      <img
        src={preview}
        alt="upload"
        style={styles.uploadImage}
      />

      <label style={styles.changeImageBtn}>

        <span
          className="material-symbols-outlined"
          style={{ fontSize: "18px" }}
        >
          photo_camera
        </span>

        Ganti Gambar

        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files[0];
            setGambar(file);

            if (file) {
              setPreview(URL.createObjectURL(file));
            }
          }}
        />

      </label>

    </>

  ) : (



                <>
                  <div style={styles.uploadPlaceholder}>
                    Tambahkan gambar
                  </div>

                  <label style={styles.uploadButton}>

                    Pilih Gambar

                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e)=>{

                        const file = e.target.files[0];

                        setGambar(file);

                        if(file){

                          setPreview(URL.createObjectURL(file));

                        }

                      }}
                    />

                  </label>
                </>

              )}
          

          </div>   
          </div>
              <div style={styles.sectionHeader}>
          Informasi Dasar
        </div>

        <label style={styles.label}>
          Judul Resep
        </label>
          <input
            type="text"
            placeholder="Tambah Judul"
            style={styles.input}
            value={nama}
            onChange={(e)=>setNama(e.target.value)}
          />

          <select
            style={styles.select}
            value={kategori}
            onChange={(e)=>setKategori(e.target.value)}
          >
            <option value="">Pilih Kategori</option>
            <option value="Makanan utama">Makanan utama</option>
            <option value="Minuman">Minuman</option>
            <option value="Dessert">Dessert</option>
          </select>
          
          <select
            style={styles.select}
            value={daerah}
            onChange={(e)=>setDaerah(e.target.value)}
          >
            <option value="">Pilih Daerah</option>
            <option value="Sumatera">Sumatera</option>
            <option value="Kalimantan">Kalimantan</option>
            <option value="Sulawesi">Sulawesi</option>
            <option value="Maluku ">Maluku</option>
            <option value="Irian Jaya">Irian Jaya</option>
            <option value="Nusa tenggara">Nusa Tenggara</option>
            <option value="Jawa">Jawa</option>
          </select>

          <textarea
            placeholder="Tambah Deskripsi"
            style={styles.input}
            value={deskripsi}
            onChange={(e)=>setDeskripsi(e.target.value)}
          ></textarea>

          <div style={styles.sectionHeader}>
            Detail Resep
          </div>
         <label style={styles.label}>
            Bahan
          </label>

          {bahan.map((item,index)=>(

            <div
              key={index}
              style={{
  ...styles.dynamicRow,
  ...(isMobile ? mobileStyles.dynamicRow : {})
}}
            >

              <input
                type="text"
                placeholder={`Bahan ${index+1}`}
                style={styles.input}
                value={item}
                onChange={(e)=>ubahBahan(index,e.target.value)}
              />

              <button
                style={styles.deleteBtn}
                onClick={()=>hapusBahan(index)}
              >
                ✕
              </button>

            </div>

          ))}

          <button
            type="button"
            style={styles.addBtn}
            onClick={tambahBahan}
          >
            + Tambah Bahan
          </button>

          <label style={styles.label}>
            Langkah Memasak
          </label>

         {langkah.map((item,index)=>(

  <div
    key={index}
    style={styles.dynamicRow}
  >

    <textarea
      placeholder={`Langkah ${index+1}`}
      style={styles.smallTextarea}
      value={item}
      onChange={(e)=>ubahLangkah(index,e.target.value)}
    />

    <button
      type="button"
      style={styles.deleteBtn}
      onClick={()=>hapusLangkah(index)}
    >
      ✕
    </button>

  </div>

))}

<button
  type="button"
  style={styles.addBtn}
  onClick={tambahLangkah}
>
  + Tambah Langkah
</button>
    <div
  style={{
    ...styles.footerButtons,
    ...(isMobile ? mobileStyles.footerButtons : {})
  }}
>

  <button
  type="button"
  style={{
    ...styles.cancelBtn,
    background: hoverCancel
      ? "#E46B5C"
      : "transparent",
    color: hoverCancel
      ? "#fff"
      : "#b87944",
    border: hoverCancel
      ? "1px solid #E46B5C"
      : "1px solid #b87944",
    boxShadow: hoverCancel
      ? "0 10px 20px rgba(228,107,92,0.45)"
      : "none",
    transform: hoverCancel
      ? "translateY(-2px)"
      : "translateY(0)"
  }}
  onMouseEnter={() => setHoverCancel(true)}
  onMouseLeave={() => setHoverCancel(false)}
  onClick={() => navigate("/profil")}
>
  Batal
</button>

  <button
    type="button"
    style={{
      ...styles.saveBtn,
      transform: hoverSave
        ? "translateY(-2px)"
        : "translateY(0)",
      boxShadow: hoverSave
        ? "0 10px 20px rgba(228,107,92,0.45)"
        : "0 6px 15px rgba(228,107,92,0.35)"
    }}
    onMouseEnter={() => setHoverSave(true)}
    onMouseLeave={() => setHoverSave(false)}
    onClick={handleUpdate}
  >
    Simpan Perubahan
  </button>

</div>

{showSuccessPopup && (
  <div style={styles.popupOverlay}>

    <div style={styles.popupBox}>

      <span
        className="material-symbols-outlined"
        style={styles.popupIcon}
      >
        check_circle
      </span>

      <h2 style={styles.popupTitle}>
        Berhasil!
      </h2>

      <p style={styles.popupText}>
        Resep berhasil diperbaharui.
      </p>

    </div>

  </div>
)}

        </div>
      </div>
    </div>

  );

}



  const mobileStyles = {

 navbar:{
    height:"65px",
    padding:"0 16px",

    display:"flex",
    alignItems:"center",
    justifyContent:"space-between",

    background:"#fff",

    borderBottom:"1px solid #ECECEC",

    boxShadow:"0 2px 8px rgba(0,0,0,0.05)"
},
  logoContainer:{
    display:"none"
  },

  headerTitle:{
    fontSize:"18px"
  },

mobileHeaderTitle:{
    flex:1,
    textAlign:"center",
    fontSize:"20px",
    fontWeight:"700",
    color:"#8B5A2B",
},

  menu:{
    display:"none"
  },

 profileCircle:{
  width:"40px",
  height:"40px",
  borderRadius:"50%",
  overflow:"hidden",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  cursor:"pointer",
},

  content:{
    padding:"20px 10px 40px"
  },

  formContainer:{
    padding:"20px"
  },

  uploadBox:{
    height:"250px",
    borderRadius:"15px"
  },

  sectionHeader:{
    fontSize:"20px"
  },

  dynamicRow:{
    flexDirection:"column",
    alignItems:"stretch"
  },

  deleteBtn:{
    width:"100%",
    height:"42px"
  },

  smallTextarea:{
    minHeight:"90px"
  },

  footerButtons:{
    flexDirection:"column"
  },

  cancelBtn:{
    width:"100%"
  },

  saveBtn:{
    width:"100%"
  }

};

const styles = {
  container:{
    minHeight:'100vh',
    background:'#D9B29B',
    display:'flex',
    justifyContent:'center',
    padding:'40px 20px'
  },

  page: {
    minHeight: "100vh",
    background: `
      linear-gradient(
        to bottom,
        #F4E9DC 0%,
        #D49A75 100%
      )
    `,
    position: "relative",
    overflow: "hidden",
    fontFamily: "Poppins, sans-serif",
    paddingTop: "70px",
  },

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

  headerCenter:{
  flex:1,
  textAlign:"center"
},

headerTitle:{
  fontSize:"22px",
  fontWeight:"700",
  color:"#8B5A2B"
},

headerSubtitle:{
  fontSize:"12px",
  color:"#666",
  marginTop:"2px"
},

sectionHeader:{
  fontSize:"24px",
  fontWeight:"500",
  color:"#3D2A20",
  borderBottom:"1px solid #c9a48b",
  paddingBottom:"10px",
  marginTop:"10px",
  marginBottom:"10px"
},

label:{
  fontSize:"14px",
  color:"#444"
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

 menu:{
  display:"flex",
  alignItems:"center",
  gap:"30px",
  fontSize:"15px",
  fontWeight:"600",

  marginRight:"25px"
},
  active: {
    color: "#F28C28",
    fontWeight: "bold",
  },

  content: {
    display: "flex",

    justifyContent: "center",

    padding: "50px 20px 80px",

    position: "relative",

    zIndex: 2,
  },

 formContainer: {
  width: "100%",
  maxWidth: "1100px",
  background:"rgba(232,210,194,0.92)",
  borderRadius:"10px",
  padding:"35px",
  display:"flex",
  flexDirection:"column",
  gap:"15px"
},

  uploadBox:{
    width:'100%',
    height:'450px',
    background:'#ECECEC',
    border:'2px dashed #E15B3C',
    borderRadius:'25px',
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    overflow:'hidden',
    position:'relative',
    gap:'15px',
  },

  uploadPlaceholder:{
    color:'#666',
    fontSize:'20px',
    fontWeight:'600',
  },

  uploadImage:{
    width:'100%',
    height:'100%',

    objectFit:'cover',

    display:'block',

    borderRadius:'20px',
  },

  uploadIcon: {
    width: "250px",
    height: "250px",
    objectFit: "contain",
    position: "absolute",
    top: "10px",
  },

  uploadText: {
    color: "#666",
    fontSize: "20px",
    position: "absolute",
    bottom: "40px",
  },

  uploadButton:{
    background:'#E15B3C',
    color:'#fff',
    padding:'10px 18px',
    borderRadius:'12px',
    cursor:'pointer',
    fontWeight:'bold'
  },

  rightSection:{
  display:"flex",
  alignItems:"center",
  gap:"18px"
},

profileCircle:{
  width:"42px",
  height:"42px",
  borderRadius:"50%",
  overflow:"hidden",
  cursor:"pointer",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  marginRight: "10px"
},

profileImage:{
  width:"100%",
  height:"100%",
  objectFit:"cover",
  borderRadius:"50%"
},

  changeImageBtn:{
  position:'absolute',

  bottom:'20px',
  left:'50%',

  transform:'translateX(-50%)',

  display:'flex',
  alignItems:'center',
  gap:'8px',

  background:'#FFFFFF',

  color:'#8B5A2B',

  border:'2px solid #E7A27A',

  padding:'10px 22px',

  borderRadius:'8px',

  fontSize:'14px',
  fontWeight:'600',

  cursor:'pointer',

  boxShadow:'0 2px 8px rgba(0,0,0,0.12)',

  zIndex:10
},

  input:{
    width:'100%',

    padding:'16px',

    border:'2px solid #E15B3C',

    borderRadius:'14px',

    outline:'none',

    fontSize:'16px',

    background:'#fff',

    boxSizing:'border-box',
  },

  select: {
    width: "100%",

    height: "55px",

    border: "2px solid #ef6d4d",

    borderRadius: "14px",

    outline: "none",

    padding: "0 15px",

    fontSize: "16px",

    background: "#fff",

    cursor: "pointer",

    boxSizing: "border-box",
  },

  buttonRow: {
    display: "flex",
    gap: "15px",
  },

  smallBtn: {
    width: "175px",
    height: "40px",
    border: "2px solid #ef6d4d",
    borderRadius: "5px",
    background: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },

saveBtn:{
  background:"#E46B5C",
  color:"#fff",
  border:"none",
  padding:"12px 24px",
  borderRadius:"8px",
  cursor:"pointer",
  fontSize:"15px",
  fontWeight:"600",
  boxShadow:"0 6px 15px rgba(228,107,92,0.35)",
  transition:"all 0.2s ease"
},
  addBtn:{
  background:"transparent",
  border:"none",
  color:"#9B5A2B",


  cursor:"pointer",

  fontSize:"15px",

  fontWeight:"600",

  padding:"0"
},

  sectionTitle:{
    fontWeight:'700',

    fontSize:'22px',

    color:'#E15B3C',

    marginTop:'10px',

    alignSelf:'flex-start',
  },

  dynamicRow:{
    display:'flex',
    alignItems:'center',

    gap:'12px',

    width:'100%',
  },

  deleteBtn:{
    background:'#FF5A5A',
    color:'#fff',
    border:'none',
    width:'38px',
    height:'38px',
    borderRadius:'12px',
    cursor:'pointer',
    fontWeight:'bold',
    fontSize:'18px',
    flexShrink:0
  },

  smallTextarea:{
    flex:1,

    minHeight:'120px',

    padding:'15px',

    border:'2px solid #E15B3C',

    borderRadius:'14px',

    resize:'vertical',

    outline:'none',

    fontSize:'15px',

    background:'#fff',
  },

  formWrapper:{
    width:'100%',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'column',
  },

  mapBackground:{
    position:'absolute',

    inset:'0',

    backgroundImage:"url('/map.png')",

    backgroundRepeat:'no-repeat',

    backgroundPosition:'center top 90px',

    backgroundSize:'100%',

    opacity:'0.80',

    pointerEvents:'none',
    
    zIndex:0,
  },

  footerButtons:{
  display:"flex",
  justifyContent:"flex-end",
  gap:"12px",

  marginTop:"25px",

  paddingTop:"20px",

  borderTop:"1px solid #c9a48b"
},

cancelBtn:{
  background:"transparent",
  border:"1px solid #b87944",
  color:"#b87944",
  padding:"12px 24px",
  borderRadius:"8px",
  cursor:"pointer",
  fontSize:"15px",
  fontWeight:"600",
  transition:"all 0.2s ease"
},

hamburgerBtn:{
  width:"40px",
  height:"40px",

  display:"flex",
  alignItems:"center",
  justifyContent:"center",

  cursor:"pointer"
},

mobileMenu:{
  position:"fixed",

  top:"0",
  left:"0",

  width:"270px",
  height:"100vh",

  background:"#fff",

  boxShadow:"3px 0 15px rgba(0,0,0,0.2)",

  zIndex:10000
},

mobileMenuHeader:{
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",

  padding:"18px",

  borderBottom:"1px solid #eee"
},

mobileLogoContainer:{
  display:"flex",
  alignItems:"center",
  gap:"8px"
},

mobileLogo:{
  width:"38px"
},

mobileLogoText:{
  fontWeight:"700",
  color:"#F28C28",
  fontSize:"22px"
},

mobileMenuIcon:{
    fontSize:"30px",
    color:"#8B5A2B",
    cursor:"pointer",
},

mobileMenuItem:{
  display:"flex",
  alignItems:"center",

  gap:"12px",

  padding:"18px",

  borderBottom:"1px solid #eee",

  cursor:"pointer",

  fontWeight:"600"
},

popupOverlay:{
  position:"fixed",
  top:0,
  left:0,
  right:0,
  bottom:0,

  background:"rgba(0,0,0,0.35)",

  display:"flex",
  justifyContent:"center",
  alignItems:"center",

  zIndex:99999
},

popupBox:{
  width:"340px",

  background:"#fff",

  borderRadius:"18px",

  padding:"35px 25px",

  textAlign:"center",

  boxShadow:"0 15px 40px rgba(0,0,0,.18)"
},

popupIcon:{
  fontSize:"70px",
  color:"#4CAF50",
  marginBottom:"10px"
},

popupTitle:{
  margin:0,
  color:"#333",
  fontSize:"28px"
},

popupText:{
  marginTop:"12px",
  color:"#666",
  fontSize:"16px",
  lineHeight:"24px"
},
  
};

export default EditResep;

