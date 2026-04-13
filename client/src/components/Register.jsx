import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const handleclick = async () => {
    if (!name || !email || !pass) {
      seterror("All fields are required");
      return;
    }
    setloading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        username: name,
        email,
        password: pass,
      });
      navigate("/");
    } catch (err) {
      seterror(err.response?.data?.message || "Something went wrong");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8 shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Amigo 💬</h1>
          <p className="text-gray-400 mt-2 text-sm">Create your account</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-sm">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              onChange={(e) => setname(e.target.value)}
              className="bg-gray-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setemail(e.target.value)}
              className="bg-gray-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setpass(e.target.value)}
              className="bg-gray-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          {/* Button */}
          <button
            onClick={handleclick}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold cursor-pointer transition mt-2"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          {/* Login link */}
          <p className="text-gray-400 text-sm text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-blue-400 hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
