import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Masuk() {
  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [backHover, setBackHover] = useState(false);

  const handleLogin = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!nama || !password) {
      return alert("Isi semua form terlebih dahulu");
    }

    try {
      const response = await api.post('/login', {
        nama,
        password
      });

      const data = response.data;
      console.log(data);

      if (data.status) {
        localStorage.setItem("token", data.token);
        alert("Login berhasil");
        setTimeout(() => {
          navigate('/dashboardAfterLogin');
        }, 300);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Gagal connect ke server");
    }
  };

  return (
    <div style={styles.container}>
      
      {/* LEFT */}
      <div style={styles.left}>
        <div
          style={{
            ...styles.backButton,
            color: backHover ? "#d86936" : "#e46b3c",
            transform: backHover ? "translateX(5px)" : "translateX(0)",
            background: backHover ? "rgba(255,255,255,0.15)" : "transparent",
          }}
          onMouseEnter={() => setBackHover(true)}
          onMouseLeave={() => setBackHover(false)}
          onClick={() => navigate("/dashboard")}
        >
          <span
            className="material-symbols-outlined"
            style={{
              ...styles.backIcon,
              transform: backHover
                ? "translateX(-4px)"
                : "translateX(0)",
            }}
          >
            arrow_back
          </span>
          <span>KEMBALI KE DASHBOARD</span>
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
            <label style={styles.label}>Nama</label>
            <input
              placeholder="Masukkan nama anda"
              style={styles.input}
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              onFocus={(e) => {
                e.target.style.border = "2px solid #d86936";
                e.target.style.boxShadow = "0 0 0 3px rgba(216,105,54,0.15)";
              }}
              onBlur={(e) => {
                e.target.style.border = "2px solid #b9b6b6";
                e.target.style.boxShadow = "none";
              }}
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
                placeholder="Kata sandi harus 6 karakter"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => {
                  e.target.style.border = "2px solid #d86936";
                  e.target.style.boxShadow = "0 0 0 3px rgba(216,105,54,0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.border = "2px solid #b9b6b6";
                  e.target.style.boxShadow = "none";
                }}
              />
              <div
                style={styles.eye}
                onClick={() => setShow(!show)}
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>

          {/* LINK */}
          <div style={styles.forgotWrapper}>
            <p
              style={styles.forgotPassword}
              onMouseEnter={(e) => {
                e.target.style.color = "#b84f22";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#d86936";
              }}
              onClick={() => navigate("/lupa-password")}
            >
              Lupa Password?
            </p>
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              background: hover ? "#d86936" : "transparent",
              color: hover ? "#fff" : "#d86936",
              transform: pressed ? "scale(0.97)" : "scale(1)",
              boxShadow: hover
                ? "0 8px 20px rgba(216,105,54,0.35)"
                : "0 4px 12px rgba(216,105,54,0.15)",
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => {
              setHover(false);
              setPressed(false);
            }}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
          >
            Masuk
          </button>

          <p style={styles.text}>
            Apakah Anda sudah mendaftar?{" "}
            <span style={styles.link} onClick={() => navigate("/Register")}>
              Daftar
            </span>
          </p>
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
    overflow: "hidden", // Mencegah scroll horizontal akibat margin negatif
    backgroundColor: "#ffffff"
  },
  left: {
    width: "55%", // Disesuaikan agar proporsi mirip gambar asli
    background: "linear-gradient(180deg, #F6E1C7, #C17854)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // Agar tombol back absolute berada di dalam area ini
  },
  logo: {
    width: "170px",
  },
  brand: {
    marginTop: "10px",
    color: "#d86936",
    fontSize: "40px",
    fontWeight: "700",
  },
  right: {
    width: "45%", // Disesuaikan sisa layar
    background: "#ffffff",
    borderTopLeftRadius: "50px",
    borderBottomLeftRadius: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "-40px", // Membuat efek overlap menimpa background kiri
    boxShadow: "-10px 0 30px rgba(0,0,0,0.08)",
    zIndex: 1, // Memastikan panel kanan berada di atas panel kiri
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
    fontSize: "24px",
    fontWeight: "800",
    marginBottom: "10px",
    marginTop: "-10px",
    color: "#111",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "13px",
    color: "#555",
    fontWeight: "700",
    marginBottom: "8px",
    marginTop: "10px",
  },
  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "2px solid #b9b6b6",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
    transition: "0.3s",
    outline: "none"
  },
  passwordWrapper: {
    position: "relative",
    width: "100%",
  },
  eye: {
    position: "absolute",
    right: "14px",
    top: "55%",
    transform: "translateY(-50%)",
    fontSize: "18px",
    color: "#999",
    cursor: "pointer",
  },
  text: {
    fontSize: "14px",
    color: "#666",
    marginTop: "15px",
    textAlign: "center",
  },
  link: {
    color: "#333",
    fontWeight: "700",
    cursor: "pointer",
  },
 button: {
    marginTop: "10px",
    padding: "16px",
    width: "100%",
    borderRadius: "40px",
    border: "2px solid #d86936",
    background: "transparent",
    color: "#d86936",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 4px 12px rgba(216,105,54,0.15)",
  },
  backButton: {
    position: "absolute",
    top: "20px",
    left: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#e46b3c",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    padding: "10px 14px",
    borderRadius: "12px",
    transition: "all 0.25s ease",
  },
  backIcon: {
    fontSize: "24px",
    transition: "all 0.25s ease",
  },

forgotPassword: {
  color: "#d86936",
  cursor: "pointer",
  fontSize: "13px",
  margin: 0,
  fontWeight: "500",
  transition: "0.25s ease",
},

  forgotWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "-5px",
    marginBottom: "10px",
  },
};

export default Masuk;