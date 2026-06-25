import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Feedback() {
  const navigate = useNavigate();

  const [kepuasan, setKepuasan] = useState("");
  const [kategori, setKategori] = useState("Saran");
  const [pesan, setPesan] = useState("");
  
  // State untuk popup sukses dan efek hover tombol
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [hoverSuccessBtn, setHoverSuccessBtn] = useState(false);

  const kirimFeedback = async () => {
    if (!kepuasan || !kategori || !pesan) {
      return alert("Isi semua form feedback");
    }

    try {
      await api.post("/feedback", {
        kepuasan,
        kategori,
        pesan
      });

      setShowSuccessPopup(true);

      // Reset form input
      setKepuasan("");
      setKategori("Saran");
      setPesan("");
    } catch (err) {
      console.log(err);
      alert("Gagal mengirim feedback");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.popup}>
        {/* HEADER */}
        <div style={styles.header}>
          <span
            style={styles.close}
            onClick={() => navigate("/dashboardafterlogin")}
          >
            ×
          </span>
        </div>

        {/* CONTENT */}
        <div style={styles.content}>
          <h2 style={styles.title}>Seberapa puas anda</h2>

          {/* EMOJI */}
          <div style={styles.emojiRow}>
            <span
              style={{
                ...styles.emoji,
                ...(kepuasan === "Sangat Buruk" ? styles.activeEmoji : {})
              }}
              onClick={() => setKepuasan("Sangat Buruk")}
            >
              😡
            </span>

            <span
              style={{
                ...styles.emoji,
                ...(kepuasan === "Buruk" ? styles.activeEmoji : {})
              }}
              onClick={() => setKepuasan("Buruk")}
            >
              🙁
            </span>

            <span
              style={{
                ...styles.emoji,
                ...(kepuasan === "Netral" ? styles.activeEmoji : {})
              }}
              onClick={() => setKepuasan("Netral")}
            >
              😐
            </span>

            <span
              style={{
                ...styles.emoji,
                ...(kepuasan === "Puas" ? styles.activeEmoji : {})
              }}
              onClick={() => setKepuasan("Puas")}
            >
              😊
            </span>

            <span
              style={{
                ...styles.emoji,
                ...(kepuasan === "Sangat Puas" ? styles.activeEmoji : {})
              }}
              onClick={() => setKepuasan("Sangat Puas")}
            >
              😁
            </span>
          </div>

          {/* KATEGORI */}
          <div style={styles.label}>Kategori</div>

          <select
            style={styles.select}
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
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
            onChange={(e) => setPesan(e.target.value)}
          ></textarea>

          {/* BUTTON */}
          <button style={styles.button} onClick={kirimFeedback}>
            Kirim masukan
          </button>
        </div>
      </div>

      {/* POPUP BERHASIL MENGIRIM FEEDBACK */}
      {showSuccessPopup && (
        <div style={styles.modalOverlay} onClick={() => setShowSuccessPopup(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={styles.successIconCircle}>
              <span className="material-symbols-outlined" style={styles.successIcon}>check_circle</span>
            </div>
            <h3 style={styles.modalTitle}>Terima Kasih!</h3>
            <p style={styles.modalText}>
              Saran, kritik, atau pertanyaan Anda telah sukses terkirim dan tersimpan di sistem kami.
            </p>
            <button 
              style={{ 
                ...styles.btnConfirm, 
                backgroundColor: hoverSuccessBtn ? "#a63800" : "#c54500" 
              }} 
              onMouseEnter={() => setHoverSuccessBtn(true)}
              onMouseLeave={() => setHoverSuccessBtn(false)}
              onClick={() => {
                setShowSuccessPopup(false);
                navigate("/dashboardafterlogin");
              }}
            >
              Selesai
            </button>
          </div>
        </div>
      )}
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
    width: "330px", // Diperkecil dari 360px
    background: "#f5f5f5",
    borderRadius: "20px", // Disesuaikan agar lebih proporsional
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
  },
  header: {
    height: "40px", // Diperkecil dari 45px
    background: "#d8b3a2",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: "15px",
  },
  close: {
    fontSize: "26px", // Diperkecil dari 32px
    color: "#555",
    cursor: "pointer",
    lineHeight: "0",
  },
  content: {
    padding: "16px 16px 22px 16px", // Diperkecil sedikit margin dalamnya
  },
  title: {
    fontSize: "18px", // Diperkecil dari 20px
    fontWeight: "700",
    marginBottom: "14px",
    color: "#000",
  },
  emojiRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  emoji: {
    fontSize: "36px", // Diperkecil dari 42px
    cursor: "pointer",
    transition: "0.2s",
  },
  activeEmoji: {
    transform: "scale(1.15)",
    filter: "drop-shadow(0 0 6px #f5b041)",
  },
  label: {
    fontSize: "16px", // Diperkecil dari 18px
    fontWeight: "700",
    marginBottom: "8px",
  },
  select: {
    width: "100%",
    height: "36px", // Diperkecil dari 38px
    borderRadius: "8px",
    border: "2px solid #333",
    paddingLeft: "10px",
    fontSize: "14px", // Diperkecil dari 16px
    marginBottom: "14px",
    outline: "none",
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    height: "95px", // Diperkecil dari 110px
    borderRadius: "8px",
    border: "2px solid #d0d0d0",
    padding: "12px",
    fontSize: "14px", // Diperkecil dari 16px
    resize: "none",
    outline: "none",
    marginBottom: "20px", // Diperkecil dari 30px
    fontFamily: "Poppins, sans-serif",
    color: "#555",
    boxSizing: "border-box"
  },
  button: {
    width: "100%",
    height: "40px", // Diperkecil dari 42px
    border: "none",
    borderRadius: "20px",
    background: "#d8b3a2",
    fontSize: "16px", // Diperkecil dari 18px
    fontWeight: "600",
    cursor: "pointer",
    color: "#000",
  },

  /* MODAL POPUP BERHASIL */
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
  },
  modalBox: {
    background: "#fff",
    padding: "22px",
    borderRadius: "16px",
    width: "85%",
    maxWidth: "330px", // Disesuaikan agar sama dengan komponen utama
    textAlign: "center",
    boxShadow: "0 5px 25px rgba(0,0,0,0.2)",
    boxSizing: "border-box",
    fontFamily: "Poppins, sans-serif",
  },
  successIconCircle: {
    margin: "5px auto 12px auto",
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    background: "#FFF7F3",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  successIcon: {
    fontSize: "32px",
    color: "#c54500",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#c54500",
    margin: "0 0 6px 0",
  },
  modalText: {
    color: "#666",
    margin: "0 0 16px 0",
    fontSize: "13px",
    lineHeight: "1.5",
  },
  btnConfirm: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    width: "100%",
    fontWeight: "600",
    fontSize: "14px",
    transition: "background-color 0.2s ease",
  },
};

export default Feedback;