import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function TambahResep() {
const navigate = useNavigate();
const [nama, setNama] = useState("");
const [deskripsi, setDeskripsi] = useState("");
const [daerah, setDaerah] = useState("");
const [kategori, setKategori] = useState("");
const [gambar, setGambar] = useState(null);
const [preview, setPreview] = useState("");
const [bahan, setBahan] = useState([""]);
const [langkah, setLangkah] = useState([""]);

const handleSave = async () => {

const bahanKosong = bahan.some(
  (item)=>item.trim() === ""
);

const langkahKosong = langkah.some(
  (item)=>item.trim() === ""
);

if(
  !nama ||
  !kategori ||
  !deskripsi ||
  !daerah ||
  !gambar ||
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
    formData.append("gambar", gambar);

    const response = await api.post(
      '/add-food',
      formData,
      {
        headers:{
          "Content-Type":"multipart/form-data"
        }
      }
    );

    alert("Resep berhasil ditambahkan");

    setTimeout(() => {

      navigate("/dashboardafterlogin");

    }, 1000);

  }catch(err){

    console.log(err);

    alert("Gagal tambah resep");

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
  return (
    <div style={styles.page}>
    <div style={styles.mapBackground}></div>

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
      <div style={styles.content}>

        {/* FORM */}
        <div style={styles.formContainer}>

          {/* UPLOAD */}
        <div style={styles.formWrapper}>

           <div style={styles.uploadBox}>

            {
              preview ? (

                <>

                  <img
                    src={preview}
                    alt="upload"
                    style={styles.uploadImage}
                  />

                  <label style={styles.changeImageBtn}>

                    Ganti Gambar

                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e)=>{

                        const file = e.target.files[0];

                        setGambar(file);

                        if(file){

                          setPreview(
                            URL.createObjectURL(file)
                          );

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

              )
            }

          </div>   
          </div>

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

          <div style={styles.sectionTitle}>
            Bahan
          </div>

          {bahan.map((item,index)=>(

            <div
              key={index}
              style={styles.dynamicRow}
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

          <div style={styles.sectionTitle}>
            Langkah
          </div>

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

          {/* SAVE */}
          <button
            style={styles.saveBtn}
            onClick={handleSave}
          >
            Simpan
          </button>

        </div>

      </div>

    </div>
  );
}

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

  content: {
    display: "flex",

    justifyContent: "center",

    padding: "50px 20px 80px",

    position: "relative",

    zIndex: 2,
  },

  formContainer: {
    width: "100%",
    maxWidth: "700px",

    background: "#f6efe8",

    borderRadius: "30px",

    padding: "40px",

    border: "2px solid #E15B3C",

    boxShadow: `
      0 10px 25px rgba(0,0,0,0.18),
      0 0 18px rgba(225,91,60,0.18)
    `,

    display: "flex",
    flexDirection: "column",

    gap: "22px",
  },

  uploadBox:{
    width:'100%',
    maxWidth:'500px',
    height:'320px',

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

  changeImageBtn:{
    position:'absolute',

    bottom:'15px',

    left:'50%',

    transform:'translateX(-50%)',

    background:'rgba(0,0,0,0.75)',

    color:'#fff',

    padding:'10px 18px',

    borderRadius:'14px',

    cursor:'pointer',

    fontWeight:'600',

    fontSize:'14px',

    backdropFilter:'blur(6px)',

    boxShadow:'0 4px 10px rgba(0,0,0,0.25)',
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
    marginTop:'25px',

    background:'#E15B3C',

    color:'#fff',

    border:'none',

    padding:'16px',

    borderRadius:'18px',

    cursor:'pointer',

    fontSize:'20px',

    fontWeight:'bold',

    width:'240px',

    alignSelf:'center',

    boxShadow:'0 6px 15px rgba(225,91,60,0.35)',
  },

  addBtn:{
    alignSelf:'flex-start',

    background:'#E15B3C',

    color:'#fff',

    border:'none',

    padding:'12px 22px',

    borderRadius:'14px',

    cursor:'pointer',

    fontWeight:'bold',

    fontSize:'15px',

    boxShadow:'0 4px 10px rgba(225,91,60,0.25)',
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

    gap:'18px',
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
};

export default TambahResep;

