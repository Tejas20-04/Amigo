const Message = require("../models/Message");
const client = require("../redis/redisclient");

const initsocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("user_online", async (userId) => {
      await client.set(`online:${userId}`, socket.id);
      console.log(`Online users: ${userId}`);
    });
    socket.on("send_message", async (data) => {
      //data={senderid,recid,msg}
      const rec_sock_id = await client.get(`online:${data.rec_id}`);
      //save to mongodb
      const newMessage = new Message({
        sender_id: data.sender_id,
        rec_id: data.rec_id,
        message: data.message,
      });
      await newMessage.save();

      if (rec_sock_id) {
        io.to(rec_sock_id).emit("recieve_message", {
          sender_id: data.sender_id,
          message: data.message,
        });
      }
    });

    ///////////////////////////////////////////////////////////////////////////////////////
    socket.on("disconnect", async () => {
      const keys = await client.keys("online:*");
      for (const key of keys) {
        const value = await client.get(key);
        if (value == socket.id) {
          await client.del(key);
          break;
        }
      }
      console.log("User Disconnected");
    });
  });
};
module.exports = initsocket;
