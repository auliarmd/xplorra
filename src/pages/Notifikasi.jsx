import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import api from "../api/axios";

function Notifikasi() {

  const [tabAktif, setTabAktif] = useState("semua");

  const [notifDibaca, setNotifDibaca] =
    useState(false);

  const [notifications, setNotifications] =
  useState([]);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const getTimeAgo = (dateString) => {

    const now = new Date();
    const date = new Date(dateString);

    const diff =
      Math.floor((now - date) / 1000);

    if (diff < 60)
      return "Baru saja";

    if (diff < 3600)
      return `${Math.floor(diff / 60)} menit lalu`;

    if (diff < 86400)
      return `${Math.floor(diff / 3600)} jam lalu`;

    if (diff < 2592000)
      return `${Math.floor(diff / 86400)} hari lalu`;

    return date.toLocaleDateString("id-ID");
  };

  useEffect(()=>{

      api.get('/profile')

      .then((res) => {

        setUser(res.data.user);

      })

      .catch((err) => {

        console.log(err);

      });

    api.get('/notifications')

    .then((res)=>{

      setNotifications(res.data);

    })

    .catch((err)=>{

      console.log(err);

    });

  },[]);

  const filteredNotifications =
  tabAktif === "belum"
    ? notifications.filter(
        notif => !notif.is_read
      )
    : notifications;

  return (
    <div style={styles.page}>

    <div style={styles.navbar}>

  {/* LOGO */}
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

  {/* JUDUL HEADER */}
  <div style={styles.headerCenter}>

    <div style={styles.headerTitleRow}>

      <span
        className="material-symbols-outlined"
        style={styles.headerBell}
      >
        notifications
      </span>

      <span style={styles.headerTitle}>
        Notifikasi
      </span>

    </div>

  </div>

  {/* MENU + FOTO PROFIL */}
  <div style={styles.rightSection}>

    <div style={styles.menu}>
      <span
        onClick={() =>
          navigate("/dashboardafterlogin")
        }
      >
        Home
      </span>

      <span
        onClick={() =>
          navigate("/profil")
        }
      >
        Profil
      </span>

      <span style={styles.active}>
        Notifikasi
      </span>
    </div>

    <div
      style={styles.profileCircle}
      onClick={() => navigate("/profil")}
    >
      {user?.foto ? (

        <img
          src={`http://localhost:5000/uploads/${user.foto}`}
          alt="Profile"
          style={{
            width:"100%",
            height:"100%",
            borderRadius:"50%",
            objectFit:"cover"
          }}
        />

      ) : (

        <span className="material-symbols-outlined">
          person
        </span>

      )}
    </div>

  </div>

</div>
      {/* TAB */}
      <div style={styles.tabContainer}>

        {/* TAB SEMUA */}
        <button
          onClick={() => setTabAktif("semua")}
          style={{
            ...styles.tabBtn,
            ...(tabAktif === "semua"
              ? styles.activeTab
              : {})
          }}
        >
          Semua
        </button>

        {/* TAB BELUM DIBACA */}
        <button
          onClick={() => setTabAktif("belum")}
          style={{
            ...styles.tabBtn,
            ...(tabAktif === "belum"
              ? styles.activeTab
              : {})
          }}
        >
          Belum Dibaca (
            {
              notifications.filter(
                notif => !notif.is_read
              ).length
            }
)
        </button>

      </div>

      {/* NOTIFIKASI */}
     <div style={styles.notifList}>

  {filteredNotifications.length === 0 ? (

    <div style={styles.emptyNotif}>
      Tidak ada notifikasi yang belum dibaca
    </div>

  ) : (

    filteredNotifications.map((notif) => (

      <div
        key={notif.id}
        style={{
          ...styles.notifItem,
          cursor: "pointer"
        }}
        onClick={async () => {

          try {

            await api.put(
              `/notifications/read/${notif.id}`
            );

            setNotifications(prev =>
              prev.map(item =>
                item.id === notif.id
                  ? {
                      ...item,
                      is_read: 1
                    }
                  : item
              )
            );

            navigate(`/detail/${notif.food_id}`);

          } catch(err) {

            console.log(err);

          }

        }}
      >

        <div style={styles.leftNotif}>

          {notif.foto ? (

            <img
              src={`http://localhost:5000/uploads/${notif.foto}`}
              alt="User"
              style={styles.userIcon}
            />

          ) : (

            <span
              className="material-symbols-outlined"
              style={styles.defaultNotifIcon}
            >
              account_circle
            </span>

          )}

          <div>

            <div style={styles.textNotif}>
              <b>{notif.from_user}</b>{" "}
              {notif.message}{" "}
              <b>{notif.recipe_name}</b>
            </div>

            <div style={styles.time}>
              {getTimeAgo(notif.created_at)}
            </div>

          </div>

        </div>

        {!notif.is_read && (
          <div style={styles.blueDot}></div>
        )}

      </div>

    ))

  )}

</div>

    </div>
  );
}

const styles = {
  page:{
  minHeight:"100vh",
  background:"#f5f5f5",
  fontFamily:"Segoe UI, sans-serif",
  paddingTop:"70px",
},

  /* NAVBAR */
  navbar: {
    display: "flex",
     alignItems: "center",
    justifyContent: "space-between",
    padding: "15px 15px",
    background: "#fff",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    borderBottom:"1px solid #ddd",
    zIndex: 9999,
  },

 headerCenter:{
  flex:1,
  display:"flex",
  justifyContent:"center",
  alignItems:"center"
},

headerTitleRow:{
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  gap:"10px"
},

headerBell:{
  fontSize:"30px",
  color:"#8B5A2B",

  fontVariationSettings:
    "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 48"
},

headerTitle:{
  fontSize:"24px",
  fontWeight:"700",
  color:"#8B5A2B"
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

    rightSection:{
  display:"flex",
  alignItems:"center",
  gap:"5px",
  height:"42px"
},

emptyNotif:{
  display:"flex",
  justifyContent:"center",
  alignItems:"center",

  height:"250px",

  color:"#888",

  fontSize:"18px",

  fontWeight:"500",

  background:"#fff"
},
  
menu:{
  display:"flex",
  alignItems:"center",

  gap:"35px",

  fontSize:"15px",

  fontWeight:"600",

  marginRight:"25px"
},

  active: {
    color: "#F28C28",
    fontWeight: "bold",
  },

profileCircle:{
  width:"42px",
  height:"42px",
  borderRadius:"50%",
  background:"#f4b8a3",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  color:"#fff",
  cursor:"pointer",
  flexShrink:0
},

  content: {
    padding: "15px 30px 10px",
  },

  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginTop: "-5px",
  },

  bellWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  bellIcon: {
    fontSize: "50px",
    marginRight: "15px",
    color: "#000",

    fontVariationSettings:
      "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 48",
  },

  title: {
    fontSize: "32px",
    fontWeight: "700",
    transform: "translateX(-30px)",
  },

  /* TAB */
 tabContainer:{
  position:"fixed",

  top:"70px",

  left:"0",
  right:"0",

  display:"flex",

  background:"#fff",

  zIndex:"9998",

  borderTop:"1px solid #ddd",
  borderBottom:"1px solid #ddd"
},

  tabBtn: {
    flex: 1,
    padding: "16px",

    border: "1px solid #ccc",

    background: "#fff",

    fontSize: "20px",

    cursor: "pointer",

    transition: "0.3s",
  },

  activeTab: {
    border: "1px solid #e46b3c",
    color: "#e46b3c",
    fontWeight: "700",
    background: "#fff7f2",
  },

  /* LIST */
  notifList: {
    marginTop: "80px",
  },

  notifItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    padding: "20px 30px",

    borderBottom: "1px solid #ddd",

    background: "#fff",
  },

  leftNotif: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  userIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #eee",
  },

  textNotif: {
    fontSize: "20px",
  },

  time: {
    color: "#888",
    marginTop: "5px",
  },

  blueDot: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: "#4c4cff",
  },

  defaultNotifIcon:{
    fontSize:'60px',
    color:'#777',
  },
};

export default Notifikasi;