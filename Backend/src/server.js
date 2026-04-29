import app from "./app.js";
import http from "http";
import connecttodb from "./lib/db.js";

const server = http.createServer(app);
const port = process.env.PORT || 5000;

connecttodb().then(() => {
  console.log("✅ DB ready");

  server.listen(port, () => {
    console.log(`🚀 Server running at ${port}`);
  });
});