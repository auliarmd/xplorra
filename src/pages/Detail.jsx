import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Detail() {
const { id } = useParams();
const navigate = useNavigate();
const [food, setFood] = useState(null);
const [komentar, setKomentar] = useState([]);
const [isiKomentar, setIsiKomentar] = useState("");
const [rating, setRating] = useState(0);
const [liked, setLiked] = useState(false);
const [bookmarked, setBookmarked] = useState(false);
const [likedFoods, setLikedFoods] = useState([]);
const [user, setUser] = useState({});
const [bookmarkedFoods, setBookmarkedFoods] = useState([]);

useEffect(()=>{

  api.get(`/my-rating/${id}`)
    .then((res)=>{

      if(res.data.status){

        setRating(res.data.star);

      }

    })
    .catch((err)=>console.log(err));

  api.get('/my-bookmarks')
    .then((res)=>{

      const ids = res.data.map(
        item => item.id
      );

      setBookmarked(
        ids.includes(Number(id))
      );

    })
    .catch((err)=>console.log(err));

  api.get('/my-likes')
  .then((res)=>{

    const likedIds = res.data.map(
      item => item.food_id
    );

    if(likedIds.includes(Number(id))){

      setLiked(true);

    }

  })
  .catch((err)=>console.log(err));

  api.get('/profile')
    .then((res)=>{

      setUser(res.data.user);

    })
    .catch((err)=>console.log(err));

  api.get(`/resep/${id}`)
  .then((res)=>{

    setFood(res.data.resep);
    
    setKomentar(res.data.komentar);   
    api.get('/my-bookmarks')
      .then((bookmarkRes)=>{

        const bookmarkIds = bookmarkRes.data.map(
          item => item.id
        );

        setBookmarkedFoods(bookmarkIds);

        if(bookmarkIds.includes(Number(id))){

          setBookmarked(true);

        }

      })
      .catch((err)=>console.log(err));

      })
  .catch((err)=>{

    console.log(err);

  });

},[id]);

if(!food){

  return <div>Loading...</div>;

}

const bahanArray = food?.bahan
                    ? JSON.parse(food.bahan)
                    : [];

const half = Math.ceil(bahanArray.length / 2);

const leftBahan = bahanArray.slice(0, half);

const rightBahan = bahanArray.slice(half);

const kirimKomentar = async () => {

  if(!isiKomentar){

    return alert("Tulis komentar dulu");

  }

  try{

    const response = await api.post(
      `/komentar/${id}`,
      {
        komentar:isiKomentar
      }
    );

    setKomentar([
      response.data.komentarBaru,
      ...komentar
    ]);

    setIsiKomentar("");

  }catch(err){

    console.log(err);

    alert("Gagal kirim komentar");

  }

};

const handleLike = async () => {

  try{

    const response = await api.post(`/like/${id}`);

    setLiked(response.data.liked);

    const resepBaru = await api.get(`/resep/${id}`);

    setFood(resepBaru.data.resep);

  }catch(err){

    console.log(err);

  }

};

const handleBookmark = async () => {

  try{

    const response = await api.post(
      `/bookmark/${id}`
    );

    // ubah state sesuai response backend
    setBookmarked(
      response.data.bookmarked
    );

  }catch(err){

    console.log(err);

  }

};

const handleRating = async (value) => {

  try{

    // update realtime frontend
    setRating(value);

    const response = await api.post(
      `/rating/${id}`,
      {
        star:value
      }
    );

    // update rating makanan realtime
    setFood({
      ...food,
      rating:response.data.rating
    });

  }catch(err){

    console.log(err);

  }

};

return (
    <div style={styles.page}>

      {/* NAVBAR */}
      <div style={styles.navbar}>

        <div style={styles.logoArea}>
          <img src="/logo_X.png" alt="logo" style={styles.logoImg} />
          <div style={styles.logoText}>pLorra</div>
        </div>

        <div style={styles.menu}>
          <span onClick={() => navigate("/dashboardafterlogin")}>Home</span>
          <span onClick={() => navigate("/profil")}>Profil</span>
          <span onClick={() => navigate("/notifikasi")}>Notifikasi</span>
        </div>

        <div style={styles.rightMenu}>
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

      {/* MIAN WRAPPER */}
      <div style={styles.mainWrapper}>
        <div style={styles.container}>

        {/* HERO */}
        <div style={styles.heroCard}>

          <img
            src={`http://localhost:5000/uploads/${food.gambar}`}
            alt="Rendang"
            style={styles.heroImg}
          />

          <div style={styles.heroContent}>

            <div style={styles.heroTitle}>
              <div>
                <div>{food.nama}</div>

                <div>Berasal dari</div>

                <div>{food.daerah}</div>
              </div>
            </div>

            <div style={styles.likeRow}>

              <span
                className="material-symbols-outlined"
                style={{
                  ...styles.iconBlack,
                  color: liked ? '#E15B3C' : '#111',
                  transform: liked ? 'scale(1.1)' : 'scale(1)'
                }}
                onClick={handleLike}
              >
                thumb_up
              </span>

              <span
                className="material-symbols-outlined"
                style={{
                  ...styles.iconBlack,
                  color: bookmarked ? '#E15B3C' : '#111',
                }}
                onClick={handleBookmark}
              >
                bookmark
              </span>

            </div>

          </div>

        </div>
      </div>

        {/* BAHAN */}
        <div style={styles.section}>

          <h2 style={styles.heading}>
            Bahan-bahan
          </h2>

          <div style={styles.ingredients}>

            {/* KOLOM KIRI */}
            <div style={styles.leftIngredient}>
              {
                leftBahan.map((item,index)=>(

                  <div key={index}>
                    {item}
                  </div>

                ))
              }
            </div>

            {/* KOLOM KANAN */}
            <div style={styles.rightIngredient}>
              {
                rightBahan.map((item,index)=>(

                  <div key={index}>
                    {item}
                  </div>

                ))
              }
            </div>

          </div>

        </div>

        {/* RESEP */}
        <div style={styles.section}>

          <h2 style={styles.heading}>Langkah-Langkah</h2>

          <div style={styles.recipeText}>
          {
            food?.langkah
          ? JSON.parse(food.langkah).map((item,index)=>(

              <div
                key={index}
                style={{marginBottom:'15px'}}
              >
                {index+1}. {item}
              </div>

            ))
          : null
          }
        </div>

        </div>

        {/* CREATOR */}
        <div style={styles.creatorCard}>

          <div style={styles.creatorTop}>

            <div style={styles.creatorAvatar}>

              {
                food.creator_foto ? (

                  <img
                    src={`http://localhost:5000/uploads/${food.creator_foto}`}
                    alt="creator"
                    style={styles.creatorImg}
                  />

                ) : (

                  <span
                    className="material-symbols-outlined"
                    style={styles.creatorPlaceholder}
                  >
                    person
                  </span>

                )
              }

            </div>

            <div style={styles.creatorName}>
              {food.creator}
            </div>

          </div>

          <p style={styles.creatorDesc}>
             {food.deskripsi}
          </p>

        </div>

        <div style={styles.topLine}></div>

        {/* KOMENTAR */}
        <div style={styles.commentBox}>

          <h2 style={styles.headingcomment}>
            Komentar
          </h2>

        {
          komentar.map((item,index)=>(

            <div
              key={index}
              style={styles.commentItem}
            >

              <div style={styles.commentHeader}>

                {
                  item.foto ? (

                    <img
                      src={`http://localhost:5000/uploads/${item.foto}`}
                      alt="user"
                      style={styles.commentAvatar}
                    />

                  ) : (

                    <span
                      className="material-symbols-outlined"
                      style={styles.commentIcon}
                    >
                      account_circle
                    </span>

                  )
                }

                <b>{item.nama}</b>

              </div>

              <p style={styles.commentText}>
                {item.komentar}
              </p>

            </div>

          ))
        }

        </div>

        {/* INPUT */}
        <div style={styles.inputSection}>

          <h2 style={styles.commentTitle}>
            Tulis Komentar
          </h2>

          <div style={styles.inputBox}>

            <textarea
              placeholder="Sangat bagus"
              style={styles.textarea}
              value={isiKomentar}
              onChange={(e)=>setIsiKomentar(e.target.value)}
            ></textarea>

            <button
              type="button"
              style={styles.sendBtn}
              onClick={kirimKomentar}
            >
              Kirim Komentar
            </button>

          </div>

        </div>

        {/* RATING */}
        <div style={styles.ratingSection}>

          <h3 style={styles.ratingTitle}>
            Seberapa suka anda terhadap resep ini
          </h3>

          <div style={styles.stars}>

            {[1,2,3,4,5].map((star)=>(

              <span
                key={star}
                onClick={()=>handleRating(star)}
                style={{
                  cursor:'pointer',
                  color: star <= rating
                    ? '#f0b323'
                    : '#ddd',

                  transition:'0.3s',

                  transform:
                    star <= rating
                    ? 'scale(1.1)'
                    : 'scale(1)'
                }}
              >
                ★
              </span>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

const styles = {
  page: {
    background: `
    linear-gradient(
    135deg,
    #f8ede3 0%,
    #dfb08c 45%,
    #b86b4b 100%
    )
    `,
    minHeight: "100vh",
    fontFamily: "Poppins, sans-serif",
    paddingBottom: "60px",
  },

   navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 15px",
    background: "#fff",
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

    logoArea: {
      display: "flex",
      alignItems: "center",
      gap: "5px",
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
    objectFit: 'cover',
    background: "#f4b8a3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },

  container: {
    padding: "15px",
  },

  iconBlack:{
    fontSize:'30px',

    color:'#111',

    cursor:'pointer',

    background:'rgba(255,255,255,0.65)',

    padding:'12px',

    borderRadius:'50%',

    boxShadow:'0 6px 18px rgba(0,0,0,0.12)',

    transition:'0.3s ease',
  },

  iconImg: {
  width: "28px",
  height: "28px",

  objectFit: "contain",

  cursor: "pointer",
},
  heroCard: {
    display: "flex",

    background: "rgba(255,255,255,0.18)",

    backdropFilter: "blur(14px)",

    borderRadius: "32px",

    overflow: "hidden",

    width: "95%",

    margin: "0 auto",

    minHeight: "340px",

    boxShadow: `
      0 20px 45px rgba(0,0,0,0.18),
      inset 0 1px 0 rgba(255,255,255,0.2)
    `,

    border: "1px solid rgba(255,255,255,0.15)",
  },

  heroImg: {
    width: "58%",
    height: "340px",
    objectFit: "cover",
  },

  heroContent: {
    flex: 1,

    padding: "40px 30px",

    display: "flex",
    flexDirection: "column",

    justifyContent: "space-between",

    background: "#f8f5f3",
  },

  heroTitle: {
    fontSize: "40px",

    fontWeight: "900",

    lineHeight: "1.7",

    color: "#111",

    textAlign: "center",

    letterSpacing: "1px",

  

    marginTop: "10px",

    textShadow: "0 3px 8px rgba(0,0,0,0.08)",
  },

  likeRow: {
    position: "absolute",
    bottom: "15px",
    right: "25px",

    display: "flex",
    gap: "10px",
    fontSize: "18px",
  },

  actionRow:{
    display:'flex',
    gap:'20px',
  },

  actionIcon:{
    fontSize:'38px',
    color:'#E15B3C',
    cursor:'pointer',

    transition:'0.3s',
  },

  section: {
    marginTop: "35px",

    paddingBottom: "35px",

    borderBottom: "2px solid rgba(255,255,255,0.35)",
  },

  heading: {
    fontSize: "35px",
    marginLeft: "40px",

    fontWeight: "790",

    marginBottom: "22px",

    color: "#111",

    letterSpacing: "1px",
  },

  recipeText: {
  fontSize: "22px", // ukuran tulisan resep
  lineHeight: "1.9",
  textAlign: "justify",
  width: "88%",
  marginLeft: "60px",
},

  ingredients: {
    display: "grid",
    marginLeft: "60px",
    
    gridTemplateColumns: "1fr 1fr",

    gap: "20px 60px",

    width: "90%",

    margin: "0 auto",

    fontSize: "22px",

    fontWeight: "548",

    lineHeight: "1.8",

    color: "#111",
  },

  leftIngredient: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  rightIngredient: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  creatorCard: {
    marginTop: "35px",

    background: "#ead8cf",

    borderRadius: "25px",

    padding: "30px",

    width: "90%",

    marginLeft: "auto",
    marginRight: "auto",

    textAlign: "center",
  },

  creatorTop: {
    display: "flex",
    alignItems: "center",
    gap: "10px",

    marginBottom: "10px",
  },

  creatorAvatar: {
    width: "50px",
    height: "50px",
    marginLeft: "25px",
    borderRadius: "50%",
    background: "#ddd",
    overflow:'hidden',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },

  creatorImg:{
    width:'100%',
    height:'100%',
    borderRadius:'50%',
    objectFit:'cover',
  },

  creatorPlaceholder:{
    fontSize:'32px',
    color:'#666',
  },

  commentAvatar:{
    width:'42px',
    height:'42px',
    minWidth:'42px',
    minHeight:'42px',
    borderRadius:'50%',
    objectFit:'cover',
    overflow:'hidden',
    imageRendering:'auto',
    border:'1px solid rgba(0,0,0,0,0.8)',
  },

  creatorName: {
    fontWeight: "700",
    fontSize: "25px",
  },

  creatorDesc: {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#444",
  },

  headingcomment: {
    fontSize: "35px",
    fontWeight: "700",
    marginLeft: "-5px",
    marginTop: "-10px",
    letterSpacing: "1px",
  },

  commentTitle: {
    fontSize: "30px",
    fontWeight: "700",

    marginBottom: "10px",
    marginLeft: "75px",
    letterSpacing: "1px",
  },

  topLine: {
    width: "99%",

    height: "1.5px",

    background: "rgba(255, 255, 255, 0.36)",

    margin: "10px auto 35px auto",
    marginTop: "40px",

    borderRadius: "10px",
  },

  commentBox: {
    marginTop: "35px",

    background: "#f5f5f5",

    padding: "30px 40px",

    borderRadius: "0px",

    width: "85%",

    marginLeft: "auto",
    marginRight: "auto",

    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    minHeight: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  commentItem: {
    padding: "0px 0",
    imageRendering:'auto',
    

    
  },

  commentHeader:{
    display:'flex',
    alignItems:'center',
    gap:'12px',
    fontSize:'18px',
    minHeight:'45px',
  },

  commentIcon:{
    fontSize:'38px',
    color:'#111',
  },

  commentText:{
    marginLeft:'48px',

    marginTop:'0px',

    fontSize:'17px',

    color:'#333',
  },

  inputBox: {
    background: "#ead8cf",

    padding: "18px",

    width: "89%",

    marginLeft: "auto",
    marginRight: "auto",

    position: "relative",
  },

  textarea: {
    width: "100%",
    height: "80px",

    border: "none",

    outline: "none",

    resize: "none",

    fontSize: "18px",

    background: "transparent",
  },

  sendBtn: {
    position: "absolute",

    right: "18px",

    bottom: "15px",

    border: "none",

    background: "linear-gradient(135deg,#E15B3C,#B84A2E)",

    color: "#fff",

    padding: "10px 22px",

    borderRadius: "25px",

    fontSize: "14px",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },

  ratingSection: {
    marginTop: "0px",

    textAlign: "center",

    paddingTop: "0px",

    paddingBottom: "10px",
  },

  ratingTitle: {
    marginTop: "50px",
    fontSize: "35px",

    fontWeight: "700",

    color: "#111",
    letterSpacing: "1px",
  },

  stars: {
    marginTop: "-25px",

    color: "#f0b323",

    fontSize: "38px",

    letterSpacing: "5px",

    lineHeight: "1",
  },

  mainWrapper: {
    width: "75%",
    maxWidth: "1300px",

    margin: "35px auto",

    background: "rgba(255,255,255,0.12)",

    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",

    borderRadius: "35px",

    padding: "45px",

    border: "1px solid rgba(255,255,255,0.18)",

    boxShadow: `
      0 8px 32px rgba(0,0,0,0.18)
    `,
    overflow: "hidden",
    position: "relative",
  },
};

export default Detail;