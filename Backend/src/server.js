import app from "./app.js";
import http from 'http';
const server = http.createServer(app);
const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log("PORT:", process.env.PORT);
    console.log(`server is running at ${port}`)
});