import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Dashboard from "./Dashboard";

import { useNavigate } from "react-router-dom";
function Login() {
  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");
  const [response, setres] = useState(null);
  const [status, setstate] = useState(false);
  const [error, seterror] = useState("");

  const navigate = useNavigate();
  let pt = {
    email,
    pass,
  };
  //login request this will recieve a access key
  //storing that access key to loacl storeage of browser
  const handleclik = async () => {
    try {
      let res = await axios.post("http://localhost:5000/api/login", pt);
      localStorage.setItem("token", res.data.access_key);
      setres(res.data);
      setstate(true);
    } catch (error) {
      setres(null);

      return;
    }
  };
  //autherization for protected route a " Dashboard"
  const handledash = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      seterror("Please login first");
      return;
    }
    if (status == false) {
      seterror("unauthorised for access");
      return;
    }
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`, // 🔑 attach token
        },
      });

      navigate("/dashboard");
    } catch (error) {
      seterror("Dashboard inaccessible");
      return;
    }
  };

  return (
    <div className="bg-black text-2xl text-white min-h-screen flex  flex-col gap-5 items-center justify-center">
      Sign in Form<br></br>
      <label>
        <input
          type="text"
          placeholder="Enter Your Mail"
          value={email}
          onChange={(e) => {
            setemail(e.target.value);
          }}
        />
      </label>
      <label>
        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => {
            setpass(e.target.value);
          }}
        />
      </label>
      <button
        className="cursor-pointer bg-blue-700   hover:bg-blue-800 rounded-full text-xl text-center px-3 py-3"
        onClick={handleclik}
      >
        Submit
      </button>
      {response && <div className="text-green-400">{response.message}</div>}
      {response && (
        <div className="text-green-400">
          User :{response.email} has logged in!!
        </div>
      )}
      {response && (
        <div className="text-green-400">
          Giving : {response.status} as staus
        </div>
      )}
      {!response && <>User doesnt exists</>}
      <button
        className="rounded-2xl bg-amber-400 text-xl py-2 px-2 cursor-pointer hover:bg-amber-700"
        onClick={handledash}
      >
        Dashboard
      </button>
    </div>
  );
}

export default Login;
