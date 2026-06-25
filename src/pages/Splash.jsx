import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Splash() {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/Dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (isMobile) {
    return (
      <div style={styles.mobileContainer}>
        <img
          src="/logo_Xplorra.png"
          alt="logo"
          style={styles.mobileLogo}
        />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <img
        src="/logo_Xplorra.png"
        alt="logo"
        style={styles.logo}
      />
    </div>
  );
}

const styles = {
  /* ================= DESKTOP ================= */

  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to bottom, #f3e7d3, #c07a5a)",
  },

  logo: {
    width: "700px",
    animation: "fadeIn 1.5s ease-in-out",
  },

  /* ================= MOBILE ================= */

  mobileContainer: {
    width: "100%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to bottom, #f3e7d3, #c07a5a)",
    overflow: "hidden",
  },

 mobileLogo: {
    width: "92%",
    maxWidth: "420px",
    animation: "fadeIn 1.5s ease-in-out",
  },
};

export default Splash;