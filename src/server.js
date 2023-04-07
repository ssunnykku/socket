import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

// done()을 실행하면 백엔드에서 실행되지 않음(보안상 문제), front-end의 함수를 실행시킨다
wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  // onAny : 미들웨어, 어느 이벤트에서든지 console.log를 할 수 있다.
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    // console.log(socket.rooms);
    // 방 만들어주기(join)
    socket.join(roomName);
    // console.log(socket.rooms);
    done();
    socket.to(roomName).emit("welcome", socket.nickname);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
  });
  socket.on("nickname", (nickname) => {
    socket["nickname"] = nickname;
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
});

httpServer.listen(3000, handleListen);
