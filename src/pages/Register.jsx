import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [backHover, setBackHover] = useState(false);

  // State untuk Pop Up
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleRegister = async (e) => {
    if (e) e.preventDefault();

    // 1. Validasi jika SEMUA form kosong
    if (!email.trim() && !nama.trim() && !password.trim()) {
      setPopupMessage("Semua form pendaftaran harus diisi!");
      setShowPopup(true);
      return;
    }

    // 2. Validasi spesifik field
    if (!email.trim()) {
      setPopupMessage("Email tidak boleh kosong!");
      setShowPopup(true);
      return;
    }
    if (!nama.trim()) {
      setPopupMessage("Nama tidak boleh kosong!");
      setShowPopup(true);
      return;
    }
    if (!password.trim()) {
      setPopupMessage("Kata sandi tidak boleh kosong!");
      setShowPopup(true);
      return;
    }

    // 3. Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setPopupMessage("Format email tidak valid!");
      setShowPopup(true);
      return;
    }

    // 4. Validasi panjang karakter password
    if (password.length !== 6) {
      setPopupMessage("Kata sandi harus tepat 6 karakter");
      setShowPopup(true);
      return;
    }

    try {
      const response = await api.post('/register', { nama, email, password });
      
      if (response.data.status) {
        setPopupMessage("Register berhasil! Silahkan masuk.");
        setShowPopup(true);
      } else {
        setPopupMessage(response.data.message);
        setShowPopup(true);
      }
    } catch (error) {
      const errMsg = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || "Gagal melakukan registrasi";
      setPopupMessage(errMsg);
      setShowPopup(true);
    }
  };

  return (
    <div style={styles.container}>
      {/* LEFT SIDE */}
      <div style={styles.left}>
        <div style={{ ...styles.backButton, color: backHover ? "#d86936" : "#e46b3c", transform: backHover ? "translateX(5px)" : "translateX(0)", background: backHover ? "rgba(255,255,255,0.15)" : "transparent" }} onMouseEnter={() => setBackHover(true)} onMouseLeave={() => setBackHover(false)} onClick={() => navigate("/dashboard")}>
          <span className="material-symbols-outlined" style={{ ...styles.backIcon, transform: backHover ? "translateX(-4px)" : "translateX(0)" }}>arrow_back</span>
          <span>KEMBALI KE DASHBOARD</span>
        </div>
        <div style={styles.logoWrapper}>
          <img src="/logo_X.png" alt="logo" style={styles.logo} />
          <h1 style={styles.brand}>XpLorra</h1>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        <form style={styles.formWrapper} onSubmit={handleRegister}>
          <span className="material-symbols-outlined" style={styles.icon}>notifications</span>
          <h2 style={styles.title}>Buat akun anda</h2>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input type="email" placeholder="Masukkan email anda" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} onFocus={(e) => { e.target.style.border = "2px solid #d86936"; e.target.style.boxShadow = "0 0 5px rgba(216, 105, 54, 0.3)"; }} onBlur={(e) => { e.target.style.border = "2px solid #b9b6b6"; e.target.style.boxShadow = "none"; }} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Nama</label>
            <input placeholder="Masukkan nama anda" style={styles.input} value={nama} onChange={(e) => setNama(e.target.value)} onFocus={(e) => { e.target.style.border = "2px solid #d86936"; e.target.style.boxShadow = "0 0 5px rgba(216, 105, 54, 0.3)"; }} onBlur={(e) => { e.target.style.border = "2px solid #b9b6b6"; e.target.style.boxShadow = "none"; }} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Kata Sandi</label>
            <div style={styles.passwordWrapper}>
              <input type={show ? "text" : "password"} minLength={6} maxLength={6} placeholder="Password harus tepat 6 karakter" style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} onFocus={(e) => { e.target.style.border = "2px solid #d86936"; e.target.style.boxShadow = "0 0 5px rgba(216, 105, 54, 0.3)"; }} onBlur={(e) => { e.target.style.border = "2px solid #b9b6b6"; e.target.style.boxShadow = "none"; }} />
              <div style={styles.eye} onClick={() => setShow(!show)}>{show ? <FaEyeSlash /> : <FaEye />}</div>
            </div>
          </div>

          <button type="submit" style={{ ...styles.button, background: hover ? "#d86936" : "transparent", color: hover ? "#fff" : "#d86936", boxShadow: hover ? "0 8px 20px rgba(216,105,54,0.35)" : "0 4px 12px rgba(216,105,54,0.15)", transform: pressed ? "scale(0.97)" : "scale(1)" }} onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setPressed(false); }} onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)}>Daftar</button>

          <p style={styles.text}>Sudah memiliki akun? <span style={styles.link} onClick={() => navigate("/Masuk")}>Masuk</span></p>
        </form>
      </div>

      {/* POP UP */}
      {showPopup && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <span className="material-symbols-outlined" style={popupMessage.includes("berhasil") ? styles.successIcon : styles.modalIcon}>
              {popupMessage.includes("berhasil") ? "check_circle" : "error"}
            </span>
            <h3 style={styles.modalTitle}>Pemberitahuan</h3>
            <p style={styles.modalText}>{popupMessage}</p>
           <button
  autoFocus
  style={styles.btnConfirm}
  onClick={() => {
    setShowPopup(false);

    if (popupMessage.includes("berhasil")) {
      navigate("/Masuk");
    }
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
  container: { display: "flex", width: "100vw", height: "100vh", fontFamily: "sans-serif", position: "relative", overflow: "hidden", backgroundColor: "#ffffff" },
  left: { width: "55%", background: "linear-gradient(180deg, #F6E1C7, #C17854)", display: "flex", justifyContent: "center", alignItems: "center", position: "relative" },
  logo: { width: "170px" },
  brand: { marginTop: "10px", color: "#d86936", fontSize: "40px", fontWeight: "700" },
  right: { width: "45%", background: "#ffffff", borderTopLeftRadius: "50px", borderBottomLeftRadius: "50px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "-40px", boxShadow: "-10px 0 30px rgba(0,0,0,0.08)", zIndex: 1 },
  formWrapper: { width: "380px", display: "flex", flexDirection: "column", gap: "8px" },
  icon: { fontSize: "45px", color: "#d86936", textAlign: "center" },
  title: { textAlign: "center", fontSize: "24px", fontWeight: "800", marginBottom: "10px", marginTop: "-10px", color: "#111" },
  inputGroup: { display: "flex", flexDirection: "column", marginBottom: "8px" },
  label: { fontSize: "13px", color: "#555", fontWeight: "700", marginBottom: "4px", marginTop: "0px" },
  input: { padding: "14px", borderRadius: "8px", border: "2px solid #b9b6b6", fontSize: "14px", width: "100%", boxSizing: "border-box", outline: "none", transition: "0.3s" },
  passwordWrapper: { position: "relative", width: "100%" },
  eye: { position: "absolute", right: "14px", top: "55%", transform: "translateY(-50%)", fontSize: "18px", color: "#999", cursor: "pointer" },
  button: { marginTop: "35px", padding: "16px", borderRadius: "40px", border: "2px solid #d86936", background: "transparent", color: "#d86936", fontWeight: "700", fontSize: "16px", cursor: "pointer", width: "100%", transition: "all 0.25s ease" },
  text: { fontSize: "14px", color: "#666", marginTop: "15px", textAlign: "center" },
  link: { color: "#333", fontWeight: "700", cursor: "pointer" },
  backButton: { position: "absolute", top: "20px", left: "20px", display: "flex", alignItems: "center", gap: "8px", color: "#e46b3c", fontWeight: "700", fontSize: "15px", cursor: "pointer", padding: "10px 14px", borderRadius: "12px", transition: "all 0.25s ease" },
  backIcon: { fontSize: "24px", transition: "all 0.25s ease" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10000 },
  modalBox: { backgroundColor: "#fff", padding: "30px", borderRadius: "20px", width: "320px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", alignItems: "center" },
  modalIcon: { fontSize: "50px", color: "#d86936", marginBottom: "10px" },
  successIcon: { fontSize: "50px", color: "#4CAF50", marginBottom: "10px" },
  modalTitle: { margin: "0 0 10px 0", color: "#111", fontSize: "22px", fontWeight: "bold" },
  modalText: { color: "#666", marginBottom: "25px", fontSize: "15px", lineHeight: "1.5" },
  btnConfirm: { padding: "12px 30px", border: "none", backgroundColor: "#d86936", color: "#fff", borderRadius: "25px", cursor: "pointer", fontWeight: "bold", fontSize: "15px", width: "100%", boxShadow: "0 4px 10px rgba(216,105,54,0.3)" }
};

export default Register;