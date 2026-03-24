import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
//handleclick is suppposed to do it should send a request to our server where our user credentials are stored in mongobd
/// api/auth
function Register() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");
  const navigate = useNavigate();
  const handleclick = async () => {
    try {
      let res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          username: name,
          email,
          password: pass,
        },
      );

      navigate("/");
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <>
      <h1>Register Page</h1>

      <label htmlFor="1">Username: </label>
      <input
        type="text"
        placeholder="Enter name"
        id="1"
        onChange={(e) => setname(e.target.value)}
      ></input>
      <br></br>
      <label htmlFor="2">Email: </label>
      <input
        type="email"
        placeholder="Enter Mail"
        id="2"
        onChange={(e) => setemail(e.target.value)}
      ></input>
      <br></br>
      <label htmlFor="3">Password: </label>
      <input
        type="password"
        placeholder="Enter password"
        id="3"
        onChange={(e) => setpass(e.target.value)}
      ></input>
      <br></br>
      <button
        className="cursor-pointer py-1 px-2 bg-blue-500 rounded-2xl text-center"
        onClick={handleclick}
      >
        Register
      </button>
    </>
  );
}
export default Register;
//user = [user_name,email,password]
