import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function LupaPassword() {

  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [passwordBaru, setPasswordBaru] =
    useState("");

  const handleReset = async () => {

    if(!nama || !passwordBaru){
      return alert("Lengkapi data");
    }

    try{

      const res = await api.put(
        "/reset-password",
        {
          nama,
          passwordBaru
        }
      );

      alert(res.data.message);

      navigate("/Masuk");

    }catch(err){

      console.log(err);

      alert("Gagal reset password");

    }

  };

  return (

    <div>

      <h2>Lupa Password</h2>

      <input
        placeholder="Masukkan Username"
        value={nama}
        onChange={(e)=>
          setNama(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password Baru"
        value={passwordBaru}
        onChange={(e)=>
          setPasswordBaru(e.target.value)
        }
      />

      <button onClick={handleReset}>
        Simpan Password Baru
      </button>

    </div>

  );

}

export default LupaPassword;