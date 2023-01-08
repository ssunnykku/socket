import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

// http, webSocket 둘 다 작동시키는 것. http 서버 위에 ws 서버를 만들기 http://~ ws://~ 요청을 둘 다 처리 할 수 있다.
// ws 서버만 만들어도 됨. views , static 처리를 위해 둘 다 만듦
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

// socket : 연결된 어떤 사람,브라우저. 서버와 브라우저 간의 연결,  on : "" 이벤트를 기다림
wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("Connected to Browser ✅");
  // 서버가 오프라인이 되면 브라우저에게 알려줌
  socket.on("close", () => {
    console.log("Disconnected from the Browser ❌");
  });

  // 브라우저가 서버에게 메세지를 보냈을 때 받기
  socket.on("message", (message) => {
    const parsedMsg = JSON.parse(message.toString("utf8"));
    switch (parsedMsg.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${parsedMsg.payload}`)
        );
        break;
      case "nickname":
        socket["nickname"] = parsedMsg.payload;
        break;
    }
  });
});

server.listen(3000, handleListen);
