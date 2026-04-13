const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
require("./redis/redisclient");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://amigo-nu-eight.vercel.app",
  "https://amigo-git-main-tejas20-04s-projects.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());

// routes
const authRoutes = require("./routes/auth");
app.use("/api/auth/", authRoutes);
const msgRoutes = require("./routes/messages");
app.use("/api/msg", msgRoutes);

// mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// http + socket setup
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// socket events
const initsocket = require("./sockets/socket");
initsocket(io);

httpServer.listen(process.env.PORT, () => {
  console.log(`Amigo running on port ${process.env.PORT}`);
});
