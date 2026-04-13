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

  const handlesend = async () => {
    if (!selectedUser || !message) return;
    const data = {
      sender_id: localStorage.getItem("user_id"),
      rec_id: selectedUser._id,
      message,
    };
    socket.emit("send_message", data);
    setMessages((prev) => [...prev, data]);
    setmsg("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar */}
      <div className="w-20 md:w-72 bg-gray-900 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-white text-xl font-bold hidden md:block">
            Amigo 💬
          </h2>
          <h2 className="text-white text-xl font-bold md:hidden text-center">
            💬
          </h2>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
          {users.map((user) => {
            const isOnline = onusers.includes(user._id);
            const isSelected = selectedUser?._id === user._id;
            return (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition
                  ${isSelected ? "bg-blue-600" : "hover:bg-gray-800"}`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                  {/* online dot */}
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900
                    ${isOnline ? "bg-green-400" : "bg-gray-500"}`}
                  />
                </div>

                {/* Username - hidden on small screens */}
                <div className="hidden md:block overflow-hidden">
                  <p className="text-white text-sm font-medium truncate">
                    {user.username}
                  </p>
                  <p
                    className={`text-xs ${
                      isOnline ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    {isOnline ? "online" : "offline"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-gray-900 px-6 py-4 border-b border-gray-800 flex items-center gap-3">
          {selectedUser ? (
            <>
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  {selectedUser.username[0].toUpperCase()}
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-gray-900
                  ${
                    onusers.includes(selectedUser._id)
                      ? "bg-green-400"
                      : "bg-gray-500"
                  }`}
                />
              </div>
              <div>
                <p className="text-white font-semibold">
                  {selectedUser.username}
                </p>
                <p
                  className={`text-xs ${
                    onusers.includes(selectedUser._id)
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  {onusers.includes(selectedUser._id) ? "online" : "offline"}
                </p>
              </div>
            </>
          ) : (
            <p className="text-gray-400 font-medium">
              Select a user to start chatting
            </p>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {messages.length === 0 && selectedUser && (
            <p className="text-gray-500 text-sm text-center mt-4">
              No messages yet — say hi! 👋
            </p>
          )}
          {messages.map((msg, index) => {
            const isMine =
              msg.sender_id === localStorage.getItem("user_id") ||
              msg.sender_id?.toString() === localStorage.getItem("user_id");
            return (
              <div
                key={index}
                className={`px-4 py-2 rounded-2xl max-w-xs text-white text-sm break-words
                  ${
                    isMine
                      ? "bg-blue-600 self-end rounded-br-sm"
                      : "bg-gray-800 self-start rounded-bl-sm"
                  }`}
              >
                {msg.message}
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-900 border-t border-gray-800 flex gap-3">
          <input
            value={message}
            className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
            placeholder={
              selectedUser
                ? `Message ${selectedUser.username}...`
                : "Select a user first..."
            }
            onChange={(e) => setmsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlesend()}
          />
          <button
            className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 cursor-pointer transition font-medium text-sm"
            onClick={handlesend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
