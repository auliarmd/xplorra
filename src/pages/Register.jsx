import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleRegister = async () => {

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
        <div style={styles.logoWrapper}>
          <img src="/logo_X.png" alt="logo" style={styles.logo} />
          <h1 style={styles.brand}>XpLorra</h1>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        <div style={styles.formWrapper}>

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
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Nama</label>
            <input
              placeholder="Masukkan nama anda"
              style={styles.input}
              value={nama}
              onChange={(e) => setNama(e.target.value)}
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
              />
              <span
                className="material-symbols-outlined"
                style={styles.eye}
                onClick={() => setShow(!show)}
              >
                {show ? "visibility" : "visibility_off"}
              </span>
            </div>
          </div>

          {/* LINK */}
          <p style={styles.text}>
            Apakah Anda sudah memiliki Akun?{" "}
            <span style={styles.link} onClick={() => navigate("/Masuk")}>
              Masuk
            </span>
          </p>

          {/* BUTTON */}
          <button
            style={styles.button}
            onClick={handleRegister}
          >
            Daftar
          </button>

        </div>
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
  },

  /* LEFT */
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

  logoWrapper: {
  display: "flex",
  flexDirection: "column", // ⬅️ INI KUNCI
  alignItems: "center",    // ⬅️ biar center
},

  brand: {
    marginTop: "10px",
    color: "#F28C28",
    fontSize: "32px",
    fontWeight: "700",
  },

  /* RIGHT */
  right: {
    width: "60%",
    background: "#f6f6f6",

    borderTopLeftRadius: "45px",
    borderBottomLeftRadius: "45px",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    
    marginLeft: "-40px", // ⬅️ INI KUNCI (overlap)
    zIndex: 2,
    boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
},

  formWrapper: {
    width: "380px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  icon: {
    fontSize: "50px",
    color: "#d86936",
    textAlign: "center",
  },

  title: {
    textAlign: "center",
    fontSize: "26px",
    fontWeight: "800",
    marginBottom: "20px",
    marginTop: "-10px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  label: {
    fontSize: "13px",
    color: "#9b9b9b",
    marginBottom: "5px",
    //padding: "50px",
  },

  input: {
    padding: "12px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "14px",
    width: "100%",
    marginBottom: "5px"
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
    marginTop: "0px",
  },

  link: {
    color: "#51504f",
    fontWeight: "600",
    cursor: "pointer",
  },

  button: {
    marginTop: "50px",
    padding: "17px",
    borderRadius: "40px",
    border: "2px solid #d86936",
    background: "transparent",
    color: "#d86936",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    marginLeft: "20px",
  },
};

export default Register;