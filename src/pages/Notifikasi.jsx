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

  const navigate = useNavigate();

  useEffect(()=>{

    api.get('/notifications')

    .then((res)=>{

      setNotifications(res.data);

    })

    .catch((err)=>{

      console.log(err);

    });

  },[]);

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
          <span onClick={() => navigate("/profil")}>Profil</span>
          <span style={styles.active}>Notifikasi</span>
        </div>

        <div style={styles.rightMenu}>
          <div
            style={styles.profileCircle}
            onClick={() => navigate("/profil")}
          >
            <span className="material-symbols-outlined">person</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={styles.content}>

        {/* TITLE */}
        <div style={styles.titleRow}>

          <div style={styles.bellWrapper}>

            <span
              className="material-symbols-outlined"
              style={styles.bellIcon}
            >
              notifications
            </span>

          </div>

          <h2 style={styles.title}>
            Notifikasi
          </h2>

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

        {
          notifications.map((notif)=>(

            <div
              key={notif.id}
              style={styles.notifItem}
            >

              <div style={styles.leftNotif}>

                {
                  notif.foto ? (

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

                  )
                }

                <div>

                  <div style={styles.textNotif}>
                    {notif.message}
                  </div>

                  <div style={styles.time}>
                    Baru saja
                  </div>

                </div>

              </div>

              {!notif.is_read && (
                <div style={styles.blueDot}></div>
              )}

            </div>

          ))
        }

      </div>

    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f5f5",
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

  profileCircle: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    background: "#f4b8a3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    marginRight: "15px"
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
  tabContainer: {
    display: "flex",
    width: "100%",
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
    marginTop: "-10px",
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
    width: "80px",
    height: "65px",
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