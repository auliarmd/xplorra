import { useNavigate } from "react-router-dom";
import { useState } from "react";
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

  const handleRegister = async (e) => {

    if(e){
      e.preventDefault();
    }

      if(!nama || !email || !password){
        return alert("Isi semua form terlebih dahulu");
      }

      try {

        //Mengirim data
        const response = await api.post('/register',{

          nama,
          email,
          password

        });

        const data = response.data;

        console.log(data);

        if(data.status){

          alert("Register berhasil");

          navigate('/Masuk');

        }else{

          alert(data.message);

        }

      } 
      catch(error){

        console.log(error.response.data);

        if(error.response.data.errors){

          alert(
            error.response.data.errors[0].msg
          );

        }else{

          alert(error.response.data.message);

        }

      }

    };

  return (
    <div style={styles.container}>
      
      {/* LEFT SIDE */}
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

          <span>
            KEMBALI KE DASHBOARD
          </span>
        </div>

        <div style={styles.logoWrapper}>
          <img src="/logo_X.png" alt="logo" style={styles.logo} />
          <h1 style={styles.brand}>XpLorra</h1>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        <form
            style={styles.formWrapper}
            onSubmit={handleRegister}
          >

          {/* ICON */}
          <span className="material-symbols-outlined" style={styles.icon}>
            notifications
          </span>

          {/* TITLE */}
          <h2 style={styles.title}>Buat akun anda</h2>

          {/* INPUT */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Masukkan email anda"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div style={styles.inputGroup}>
            <label style={styles.label}>Kata Sandi</label>
            <div style={styles.passwordWrapper}>
              <input
                type={show ? "text" : "password"}
                minLength={6}
                maxLength={6}
                placeholder="Password harus tepat 6 karakter"
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
            Daftar
          </button>

          <p style={styles.text}>
            Sudah memiliki akun?{" "}
            <span
              style={styles.link}
              onClick={() => navigate("/Masuk")}
            >
              Masuk
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
  overflow: "hidden",
  backgroundColor: "#ffffff",
  },

left: {
  width: "55%",
  background: "linear-gradient(180deg, #F6E1C7, #C17854)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  },

logoWrapper: {
  textAlign: "center",
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
  width: "45%",
  background: "#ffffff",

  borderTopLeftRadius: "50px",
  borderBottomLeftRadius: "50px",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  marginLeft: "-40px",

  boxShadow: "-10px 0 30px rgba(0,0,0,0.08)",
  zIndex: 1,
},

formWrapper: {
  width: "380px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
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
  marginBottom: "8px",
},

label: {
  fontSize: "13px",
  color: "#555",
  fontWeight: "700",
  marginBottom: "4px",
  marginTop: "0px",
},

input: {
  padding: "14px",
  borderRadius: "8px",
  border: "2px solid #b9b6b6",
  fontSize: "14px",
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
  transition: "all 0.25s ease",
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
  outline: "none",
  },

button: {
  marginTop: "35px",
  padding: "16px",
  borderRadius: "40px",
  border: "2px solid #d86936",
  background: "transparent",
  color: "#d86936",
  fontWeight: "700",
  fontSize: "16px",
  cursor: "pointer",
  width: "100%",
  transition: "all 0.25s ease",
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
};

export default Register;