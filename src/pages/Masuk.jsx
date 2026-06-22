import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Masuk() {
  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleLogin = async (e) => {

    if(e){
      e.preventDefault();
    }

    if(!nama || !password){
      return alert("Isi semua form terlebih dahulu");
    }

    try {

      const response = await api.post('/login',{

        nama,
        password

      });

      const data = response.data;

      console.log(data);

      if(data.status){

        localStorage.setItem("token", data.token);

        alert("Login berhasil");

        setTimeout(()=>{

          navigate('/dashboardAfterLogin');

        },300);

      }else{

        alert(data.message);

      }

    } catch(err){

      console.log(err);

      alert("Gagal connect ke server");

    }

  };
  
  return (
    <div style={styles.container}>
      
      {/* LEFT */}
      <div style={styles.left}>
        <div
          style={styles.backButton}
          onClick={() => navigate("/dashboard")}
        >
          <span
            className="material-symbols-outlined"
            style={styles.backIcon}
          >
            arrow_back
          </span>

          <span>
            KEMBALI KE DASHBOARD
          </span>
        </div>

        <div style={{ textAlign: "center" }}>
          <img src="/logo_X.png" alt="logo" style={styles.logo} />
          <h1 style={styles.brand}>XpLorra</h1>
        </div>
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <form
            style={styles.formWrapper}
            onSubmit={handleLogin}
          >

          {/* ICON */}
          <span className="material-symbols-outlined" style={styles.icon}>
            notifications
          </span>

          {/* TITLE */}
          <h2 style={styles.title}>Masuk ke akun anda</h2>

          {/* INPUT NAMA */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nama Anda</label>
            <input
              placeholder="Masukkan nama anda"
              style={styles.input}
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </div>

          {/* INPUT PASSWORD */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Kata Sandi</label>
            <div style={styles.passwordWrapper}>
              <input
                type={show ? "text" : "password"}
                minLength={6}
                maxLength={6}
                placeholder="Masukkan kata sandi anda (6 Karakter)"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                style={styles.eye}
                onClick={() => setShow(!show)}
              >
                {show ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
          </div>

          {/* LINK */}
          <p style={styles.text}>
            Apakah Anda belum mendaftar?{" "}
            <span style={styles.link} onClick={() => navigate("/Register")}>
              Daftar
            </span>
          </p>

          <p
            style={styles.forgotPassword}
            onClick={() => navigate("/lupa-password")}
          >
            Lupa Password?
          </p>

          {/* BUTTON */}
          <button
            type="submit"
            style={styles.button}
          >
            Masuk
          </button>

        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    fontFamily: "sans-serif",
    position: "relative",
  },

  left: {
    width: "63%",
    background: "linear-gradient(180deg, #F6E1C7, #C17854)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: "140px",
  },

  brand: {
    marginTop: "10px",
    color: "#F28C28",
    fontSize: "32px",
    fontWeight: "700",
  },

  right: {
    width: "60%",
    background: "#f6f6f6",
    borderTopLeftRadius: "50px",
    borderBottomLeftRadius: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "-40px",
    boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
  },

  formWrapper: {
    width: "380px",
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },

  icon: {
    fontSize: "45px",
    color: "#d86936",
    textAlign: "center",
  },

  title: {
    textAlign: "center",
    fontSize: "26px",
    fontWeight: "800",
    marginBottom: "20px",
    marginTop: "-20px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    fontSize: "13px",
    color: "#a0a0a0",
    marginBottom: "6px",
    marginTop: "10px",
  },

  input: {
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #e5e5e5",
    fontSize: "14px",
    width: "100%",
  },

  passwordWrapper: {
    position: "relative",
  },

  eye: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "18px",
    color: "#999",
    cursor: "pointer",
  },

  text: {
    fontSize: "13px",
    color: "#666",
  },

  link: {
    color: "#51504f",
    fontWeight: "600",
    cursor: "pointer",
  },

  button: {
    marginTop: "40px",
    padding: "16px",
    borderRadius: "40px",
    border: "2px solid #d86936",
    background: "transparent",
    color: "#d86936",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    width: "90%",
    alignSelf: "center",
  },

  forgotPassword: {
    fontSize: "13px",
    color: "#d86936",
    cursor: "pointer",
    textAlign: "right",
    marginTop: "-10px",
  },

  backButton: {
    position: "absolute",
    top: "50px",
    left: "50px",

    display: "flex",
    alignItems: "center",
    gap: "11px",

    color: "#e46b3c",
    fontWeight: "700",
    cursor: "pointer",

    fontSize: "18px",
  },

  backIcon: {
    fontSize: "30px",
  },
};

export default Masuk;