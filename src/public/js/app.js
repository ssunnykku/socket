// socket.io를 front-end와 연결
const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("#roomname");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = welcome.querySelector("#name input");
  socket.emit("nickname", input.value);
}

function showRoom() {
  room.hidden = false;
  welcome.hidden = true;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");

  msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();

  const input = form.querySelector("input");
  // socket.send()로 메세지를 보내는게 아니라 "room" event로 emit해줌. 어떤 event든지 만들 수 있음(여기선 "enter_room"), object로 전송할 수 있음(ws와의 차이점)
  // socket.emit -> 서버의 socket.on과 연결
  // emit의 인수로 함수가 가장 마지막에 나와야 함
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;

  input.value = "";
}
const nameForm = welcome.querySelector("#name");
nameForm.addEventListener("submit", handleNicknameSubmit);
form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
  addMessage(`${user} arrived!`);
});

socket.on("bye", (left) => {
  addMessage(`${left} left`);
});

socket.on("new_message", addMessage);
