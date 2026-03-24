import axiosInstance from "../utils/axios_interceptors";
import { useEffect, useState } from "react";
function Chat() {
  const [users, setusers] = useState([]);
  useEffect(() => {
    const fetchuser = async () => {
      try {
        const res = await axiosInstance.get("/api/auth/users");
        setusers(res.data);
      } catch (error) {
        alert("Cant fetch users");
      }
    };
    fetchuser();
  }, []);

  return (
    <>
      <div className="flex h-screen bg-gray-950">
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-900 p-4 flex flex-col gap-3">
          <h2 className="text-white text-xl font-bold">Amigo 💬</h2>

          {/* each user in sidebar */}
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 cursor-pointer"
            >
              {/* avatar - first letter of username */}
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <p className="text-white">{user.username}</p>
                <p className="text-xs text-green-400">online</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* top bar */}
          <div className="bg-gray-900 p-4 text-white font-bold">username</div>

          {/* messages area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {/* received message */}
            <div className="bg-gray-800 text-white p-3 rounded-xl self-start max-w-xs">
              hey!
            </div>
            {/* sent message */}
            <div className="bg-blue-600 text-white p-3 rounded-xl self-end max-w-xs">
              hi!
            </div>
          </div>

          {/* input area */}
          <div className="p-4 bg-gray-900 flex gap-3">
            <input
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-xl outline-none"
              placeholder="Type a message..."
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 cursor-pointer">
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Chat;
