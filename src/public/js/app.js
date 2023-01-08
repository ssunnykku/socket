const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

// socket : 서버로의 연결
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

// socket.send()로 백엔드에서 보낸 내용 띄우기
socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  console.log("socket.send    :", message.data);
  messageList.append(li);
});

// 브라우저 연결이 끊기면 서버에게 알려줌
socket.addEventListener("close", () => {
  console.log("disconnected to Server ❌");
});

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  // 백엔드로 보내기
  socket.send(makeMessage("new_message", input.value));
  const li = document.createElement("li");
  li.innerText = `You: ${input.value}`;
  messageList.append(li);
  input.value = "";
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
