import axios from "axios";
import { useState } from "react"; // only need this

import { useNavigate } from "react-router-dom";
function Login() {
  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");
  const [response, setres] = useState(null);

  const navigate = useNavigate();

  //login request this will recieve a access key
  //storing that access key to loacl storeage of browser
  const handleclik = async () => {
    try {
      let res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password: pass,
        },
      );

      localStorage.setItem("token", res.data.token);
      setres(res.data);

      navigate("/chat");
    } catch (error) {
      setres(null);

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
    </div>
  );
}

export default Login;
