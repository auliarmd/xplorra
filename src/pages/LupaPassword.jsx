import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function LupaPassword() {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  
  // State untuk efek hover & popup kustom
  const [hover, setHover] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleReset = async (e) => {
    if (e) e.preventDefault();

    // 1. Validasi jika SEMUA form kosong
    if (!nama.trim() && !passwordBaru.trim()) {
      setPopupMessage("Username dan Password baru harus diisi!");
      setShowPopup(true);
      return;
    }

    // 2. Validasi spesifik field
    if (!nama.trim()) {
      setPopupMessage("Username tidak boleh kosong!");
      setShowPopup(true);
      return;
    }
    if (!passwordBaru.trim()) {
      setPopupMessage("Password baru tidak boleh kosong!");
      setShowPopup(true);
      return;
    }

    // 3. Validasi panjang karakter
    if (passwordBaru.length !== 6) {
      setPopupMessage("Password baru harus tepat 6 karakter");
      setShowPopup(true);
      return;
    }

    try {
      const res = await api.put("/reset-password", {
        nama,
        passwordBaru
      });
      
      // Jika berhasil, munculkan pesan sukses dan navigasi
      setPopupMessage(res.data.message);
      setShowPopup(true);
      
      // Kita tambahkan callback setelah klik "Mengerti" di popup
      // Agar bisa pindah halaman setelah user membaca pesan sukses
    } catch (err) {
      console.log(err);
      // Menangkap pesan error dari server (misal: "User tidak ditemukan")
      const message = err.response?.data?.message || "Gagal reset password, periksa kembali username Anda.";
      setPopupMessage(message);
      setShowPopup(true);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Lupa Password</h2>
        <p style={styles.subtitle}>Masukkan username dan password baru anda</p>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Username</label>
          <input
            placeholder="Masukkan Username"
            style={styles.input}
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            onFocus={(e) => { e.target.style.border = "2px solid #d86936"; e.target.style.boxShadow = "0 0 5px rgba(216, 105, 54, 0.3)"; }}
            onBlur={(e) => { e.target.style.border = "2px solid #b9b6b6"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password Baru</label>
          <input
            type="password"
            placeholder="Password baru (6 karakter)"
            style={styles.input}
            value={passwordBaru}
            maxLength={6}
            onChange={(e) => setPasswordBaru(e.target.value)}
            onFocus={(e) => { e.target.style.border = "2px solid #d86936"; e.target.style.boxShadow = "0 0 5px rgba(216, 105, 54, 0.3)"; }}
            onBlur={(e) => { e.target.style.border = "2px solid #b9b6b6"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        <button 
          style={{
            ...styles.button,
            background: hover ? "#d86936" : "transparent",
            color: hover ? "#fff" : "#d86936",
            boxShadow: hover ? "0 8px 20px rgba(216,105,54,0.35)" : "none",
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={handleReset}
        >
          Simpan Password Baru
        </button>
        
        <p style={styles.backLink} onClick={() => navigate("/Masuk")}>
          Kembali ke Login
        </p>
      </div>

      {/* POP UP VALIDASI / ERROR */}
      {showPopup && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <span className="material-symbols-outlined" style={styles.modalIcon}>error</span>
            <h3 style={styles.modalTitle}>Pemberitahuan</h3>
            <p style={styles.modalText}>{popupMessage}</p>
            <button 
              style={styles.btnConfirm} 
              onClick={() => {
                setShowPopup(false);
                if (popupMessage.toLowerCase().includes("berhasil")) navigate("/Masuk");
              }}
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f6f6f6", fontFamily: "Segoe UI, sans-serif" },
  card: { background: "#fff", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "350px", textAlign: "center" },
  title: { color: "#111", marginBottom: "10px" },
  subtitle: { color: "#666", fontSize: "14px", marginBottom: "25px" },
  inputGroup: { textAlign: "left", marginBottom: "15px" },
  label: { fontSize: "13px", color: "#555", fontWeight: "700", marginBottom: "5px", display: "block" },
  input: { padding: "12px", borderRadius: "8px", border: "2px solid #b9b6b6", fontSize: "14px", width: "100%", boxSizing: "border-box", outline: "none", transition: "0.3s" },
  button: { marginTop: "20px", padding: "12px", width: "100%", borderRadius: "40px", border: "2px solid #d86936", fontWeight: "700", fontSize: "16px", cursor: "pointer", transition: "0.3s" },
  backLink: { marginTop: "20px", fontSize: "14px", color: "#d86936", cursor: "pointer", fontWeight: "600" },
  /* MODAL STYLES */
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10000 },
  modalBox: { backgroundColor: "#fff", padding: "30px", borderRadius: "20px", width: "320px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", alignItems: "center" },
  modalIcon: { fontSize: "50px", color: "#d86936", marginBottom: "10px" },
  modalTitle: { margin: "0 0 10px 0", color: "#111", fontSize: "22px", fontWeight: "bold" },
  modalText: { color: "#666", marginBottom: "25px", fontSize: "15px", lineHeight: "1.5" },
  btnConfirm: { padding: "12px 30px", border: "none", backgroundColor: "#d86936", color: "#fff", borderRadius: "25px", cursor: "pointer", fontWeight: "bold", fontSize: "15px", width: "100%", boxShadow: "0 4px 10px rgba(216,105,54,0.3)" }
};

export default LupaPassword;