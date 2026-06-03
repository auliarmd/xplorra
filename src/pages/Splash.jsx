import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
   const timer = setTimeout(() => {
    navigate("/Dashboard"); // setelah 3 detik pindah ke dashboard
   }, 3000);

   return () => clearTimeout(timer);
 }, [navigate]);

  return (
    <div style={styles.container}>
      <img src="/logo_Xplorra.png" alt="logo" style={styles.logo} />
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to bottom, #f3e7d3, #c07a5a)",
  },

  logo: {
    width: "700px",
    marginBottom: "10px",
    animation: "fadeIn 1.5s ease-in-out",
  },

  text: {
    color: "#ff7a00",
    fontSize: "28px",
    fontWeight: "bold",
  },
};

export default Splash;