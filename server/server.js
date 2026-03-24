const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
require("./redis/redisclient");
const app = express();
app.use(cors());
app.use(express.json());

// routes
const authRoutes = require("./routes/auth");
app.use("/api/auth/", authRoutes);

// mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// http + socket setup
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// socket events will go here
const initsocket = require("./sockets/socket");
initsocket(io);
// use httpServer instead of app to listen
httpServer.listen(process.env.PORT, () => {
  console.log(`Amigo running on port ${process.env.PORT}`);
});
