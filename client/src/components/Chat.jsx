import axiosInstance from "../utils/axios_interceptors";
import { useEffect, useState } from "react";
import socket from "../utils/socket";
function Chat() {
  const [users, setusers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setmsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [onusers, setonuser] = useState([]);
  useEffect(() => {
    const getonusers = async () => {
      try {
        const res = await axiosInstance.get("/api/msg/onusers");
        setonuser(res.data);
      } catch (error) {
        alert("error retrieving users's status");
      }
    };
    getonusers();
  }, []);
  useEffect(() => {
    if (!selectedUser) return;
    const premsg = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/msg/user_msg/${selectedUser._id}`,
        );
        setMessages(res.data);
      } catch (error) {
        alert("Backup failed");
      }
    };
    premsg();
  }, [selectedUser]);
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

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    socket.emit("user_online", userId);
  }, []);
  //data={senderid,recid,msg} message is sent
  const handlesend = async () => {
    if (!selectedUser || !message) return;
    const data = {
      sender_id: localStorage.getItem("user_id"),
      rec_id: selectedUser._id,
      message,
    };
    console.log("selectedUser:", selectedUser);
    console.log("my id:", localStorage.getItem("user_id"));
    socket.emit("send_message", data);
    setMessages((prev) => [...prev, data]);
    setmsg("");
  };
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => {
      socket.off("receive_message"); // cleanup when component unmounts
    };
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
                <p
                  className={`text-xs ${
                    onusers.includes(user._id)
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  {onusers.includes(user._id) ? "online" : "offline"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* top bar */}
          <div className="bg-gray-900 p-4 text-white font-bold">
            {selectedUser ? selectedUser.username : "Select a user"}
          </div>

          {/* messages area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl max-w-xs text-white ${
                    msg.sender_id === localStorage.getItem("user_id")
                      ? "bg-blue-600 self-end" // your message
                      : "bg-gray-800 self-start" // received message
                  }`}
                >
                  {msg.message}
                </div>
              ))}
            </div>
          </div>

          {/* input area */}
          <div className="p-4 bg-gray-900 flex gap-3">
            <input
              value={message}
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-xl outline-none"
              placeholder="Type a message..."
              onChange={(e) => setmsg(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 cursor-pointer"
              onClick={handlesend}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Chat;
