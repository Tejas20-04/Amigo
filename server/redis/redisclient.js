const { createClient } = require("redis");
require("dotenv").config();

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => console.log("Redis error:", err));
client.on("connect", () => console.log("Redis connected ✅"));

const connectRedis = async () => {
  await client.connect();
};

connectRedis();

module.exports = client;
