import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");
  const [response, setres] = useState(null);
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);

  const navigate = useNavigate();

  const handleclik = async () => {
    setloading(true);
    try {
      let res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password: pass,
        },
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user_id", res.data.user_id);
      setres(res.data);

      navigate("/chat");
    } catch (error) {
      setres(null);
      seterror("Invalid email or password");
      return;
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
          <p className="text-gray-400 mt-2 text-sm">Welcome back!</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-sm">Email</label>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="bg-gray-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={pass}
              onChange={(e) => setpass(e.target.value)}
              className="bg-gray-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          {/* Success */}
          {response && (
            <p className="text-green-400 text-sm text-center">
              {response.Message}
            </p>
          )}

          {/* Button */}
          <button
            onClick={handleclik}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold cursor-pointer transition mt-2"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          {/* Register link */}
          <p className="text-gray-400 text-sm text-center">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-400 hover:underline cursor-pointer"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
