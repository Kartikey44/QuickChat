import { server } from "./config/socketio.js";
import connecttodb from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

connecttodb().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
  });
});