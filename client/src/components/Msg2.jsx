import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
  autoConnect: true, // connects immediately on import
});
function Msg2() {
  const [msg, setmsg] = useState("");
  const [msges, setmsges] = useState([]);

  useEffect(() => {
    socket.on("response", (data) => {
      setmsges((prev) => [...prev, { text: data, self: false }]);
    });
    return () => socket.off("response");
  }, []);
  const handleclick = () => {
    socket.emit("Send", msg);
    setmsges((prev) => [...prev, { text: msg, self: true }]);
    setmsg("");
  };

  return (
    <>
      <div>
        <ul>
          {msges.map(
            (
              m,
              i, // ✅ actually mapping
            ) => (
              <li key={i} style={{ textAlign: m.self ? "right" : "left" }}>
                {m.text}
              </li>
            ),
          )}
        </ul>
      </div>
      <div>
        <input
          value={msg}
          type="text "
          placeholder=" enter meassage"
          onChange={(e) => setmsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleclick()}
        ></input>
        <button
          className=" cursor-pointer bg-blue-700 rounded-2xl py-2 px-2 hover:bg-blue-950 text-xl"
          onClick={handleclick}
        >
          Send
        </button>
      </div>
    </>
  );
}
export default Msg2;
