import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Feedback() {
  const navigate = useNavigate();

  const [kepuasan, setKepuasan] =
    useState("");

  const [kategori, setKategori] =
    useState("Saran");

  const [pesan, setPesan] =
    useState("");

  const kirimFeedback = async ()=>{

    if(!kepuasan || !kategori || !pesan){

      return alert(
        "Isi semua form feedback"
      );

    }

    try{

      await api.post("/feedback",{

        kepuasan,
        kategori,
        pesan

      });

      alert(
        "Feedback berhasil dikirim"
      );

      setKepuasan("");

      setKategori("Saran");

      setPesan("");

    }catch(err){

      console.log(err);

      alert(
        "Gagal mengirim feedback"
      );

    }

  };

  return (

    <div style={styles.page}>

      <div style={styles.popup}>

        {/* HEADER */}
        <div style={styles.header}>

          <span
            style={styles.close}

            onClick={()=>
              navigate("/dashboardafterlogin")
            }
          >
            ×
          </span>
        </div>

        {/* CONTENT */}
        <div style={styles.content}>

          <h2 style={styles.title}>
            Seberapa puas anda
          </h2>

          {/* EMOJI */}
          <div style={styles.emojiRow}>

            <span
              style={{
                ...styles.emoji,
                ...(kepuasan === "Sangat Buruk"
                  ? styles.activeEmoji
                  : {})
              }}

              onClick={()=>
                setKepuasan("Sangat Buruk")
              }
            >
              😡
            </span>

            <span
              style={{
                ...styles.emoji,
                ...(kepuasan === "Buruk"
                  ? styles.activeEmoji
                  : {})
              }}

              onClick={()=>
                setKepuasan("Buruk")
              }
            >
              🙁
            </span>

            <span
              style={{
                ...styles.emoji,
                ...(kepuasan === "Netral"
                  ? styles.activeEmoji
                  : {})
              }}

              onClick={()=>
                setKepuasan("Netral")
              }
            >
              😐
            </span>

            <span
              style={{
                ...styles.emoji,
                ...(kepuasan === "Puas"
                  ? styles.activeEmoji
                  : {})
              }}

              onClick={()=>
                setKepuasan("Puas")
              }
            >
              😊
            </span>

            <span
              style={{
                ...styles.emoji,
                ...(kepuasan === "Sangat Puas"
                  ? styles.activeEmoji
                  : {})
              }}

              onClick={()=>
                setKepuasan("Sangat Puas")
              }
            >
              😁
            </span>

          </div>

          {/* KATEGORI */}
          <div style={styles.label}>
            Kategori
          </div>

          <select
            style={styles.select}

            value={kategori}

            onChange={(e)=>
              setKategori(e.target.value)
            }
          >
            <option>Saran</option>
            <option>Kritik</option>
            <option>Pertanyaan</option>
          </select>

          {/* TEXTAREA */}
          <textarea
            placeholder="Tulis pesan atau masukan anda disini"

            style={styles.textarea}

            value={pesan}

            onChange={(e)=>
              setPesan(e.target.value)
            }
          ></textarea>

          {/* BUTTON */}
          <button
            style={styles.button}

            onClick={kirimFeedback}
          >
            Kirim masukan
          </button>

        </div>

      </div>

    </div>

  );

}

const styles = {

  page: {
    minHeight: "100vh",

    background: "#e9e9e9",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    fontFamily: "Poppins, sans-serif",
  },

  popup: {
    width: "360px",

    background: "#f5f5f5",

    borderRadius: "22px",

    overflow: "hidden",

    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  },

  header: {
    height: "45px",

    background: "#d8b3a2",

    display: "flex",

    justifyContent: "flex-end",

    alignItems: "center",

    paddingRight: "15px",
  },

  close: {
    fontSize: "32px",

    color: "#555",

    cursor: "pointer",

    lineHeight: "0",
  },

  content: {
    padding: "18px 18px 25px 18px",
  },

  title: {
    fontSize: "20px",

    fontWeight: "700",

    marginBottom: "18px",

    color: "#000",
  },

  emojiRow: {
    display: "flex",

    justifyContent: "space-between",

    marginBottom: "20px",
  },

  emoji: {
    fontSize: "42px",

    cursor: "pointer",

    transition: "0.2s",
  },

  activeEmoji: {
    transform: "scale(1.2)",

    filter:
      "drop-shadow(0 0 8px #f5b041)",
  },

  label: {
    fontSize: "18px",

    fontWeight: "700",

    marginBottom: "10px",
  },

  select: {
    width: "100%",

    height: "38px",

    borderRadius: "8px",

    border: "2px solid #333",

    paddingLeft: "12px",

    fontSize: "16px",

    marginBottom: "18px",

    outline: "none",

    cursor: "pointer",
  },

  textarea: {
    width: "90%",

    height: "110px",

    borderRadius: "8px",

    border: "2px solid #d0d0d0",

    padding: "15px",

    fontSize: "16px",

    resize: "none",

    outline: "none",

    marginBottom: "30px",

    fontFamily: "Poppins, sans-serif",

    color: "#555",
  },

  button: {
    width: "100%",

    height: "42px",

    border: "none",

    borderRadius: "20px",

    background: "#d8b3a2",

    fontSize: "18px",

    cursor: "pointer",

    color: "#000",
  },

};

export default Feedback;

