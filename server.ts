import express, { Express } from "express";
import http, { Server } from "http";
import { Server as socketIOServer, Socket } from "socket.io";
import path from "path";

const app: Express = express();
const server: Server = http.createServer(app);
const io: socketIOServer = new socketIOServer(server);

const PORT: number = parseInt(process.env.PORT || "8000", 10);
const PUBLIC_DIR: string = path.join(__dirname, "public");
const INDEX_FILE: string = path.join(__dirname, "index.html");

app.use(express.static(PUBLIC_DIR));

app.get("/", (req, res) => {
  res.sendFile(INDEX_FILE);
});

interface User {
  id: string;
  name: string;
}

const users: { [key: string]: User } = {};

io.on("connection", (socket: Socket) => {
  console.log("Connected...");

  socket.on("newUser", (newUser: User) => {
    socket.broadcast.emit("joinsChat", newUser);
    console.log("User joined: ", newUser);
    users[socket.id] = newUser;
  });

  socket.on("messageToServer", (userTypedMessage: string) => {
    socket.broadcast.emit("messageToAllClients", userTypedMessage);
  });

  socket.on("disconnect", (reason: string) => {
    const user: User = users[socket.id];
    if (user) {
      socket.broadcast.emit("leftChat", user);
      console.log("User left: ", user);
      delete users[socket.id];
    }
  });
});

server.listen(PORT, () => {
  console.log(
    `Server started at on port ${PORT}, visit--> http://localhost:${PORT}/`
  );
});
