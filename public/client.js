const socket = io();
let newUserName;
do {
  newUserName = prompt("Please enter your userName: ");
} while (!newUserName || /\s/.test(newUserName) || newUserName.length == 0);
socket.emit("newUser", newUserName);

socket.on("joinsChat", (newUser) => {
  let mainDiv = document.createElement("div");
  let className = "join";
  mainDiv.classList.add(className, "message");
  let markup =
    "<b><h4>" +
    newUser +
    "    " +
    currentdateTime() +
    "</h4></b><b>joins the chat</b>";
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
  scrollToBottom();
});

socket.on("leftChat", (oldUser) => {
  let mainDiv = document.createElement("div");
  let className = "left";
  mainDiv.classList.add(className, "message");
  let markup =
    "<b><h4>" +
    oldUser +
    "    " +
    currentdateTime() +
    "</h4></b><b>left the chat</b>";
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
  scrollToBottom();
});

const textarea = document.getElementById("textarea");
textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
  }
});

const sendButton = document.getElementById("sendit");
sendButton.addEventListener("click", () => {
  sendMessage(textarea.value);
});

const sendMessage = (vmessage) => {
  let userTypedMessage = {
    user: newUserName,
    message: vmessage.trim(),
  };
  appendMessage(userTypedMessage, "outgoing");
  textarea.value = "";
  scrollToBottom();
  socket.emit("messageToServer", userTypedMessage);
};

socket.on("messageToAllClients", (userTypedMessage) => {
  audioRecieved.play();
  appendMessage(userTypedMessage, "incoming");
  scrollToBottom();
});

const messageArea = document.querySelector(".messageArea");
const appendMessage = (userTypedMessage, type) => {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");
  let markup =
    "<h4>" +
    userTypedMessage.user +
    "    " +
    currentdateTime() +
    "</h4>" +
    `<p>${userTypedMessage.message}</p>`;
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
};

const audioRecieved = new Audio("./audio/recieved.mp3");
const audioSend = new Audio("./audio/sent.mp3");
const scrollToBottom = () => {
  messageArea.scrollTop = messageArea.scrollHeight;
};

const currentdateTime = () => {
  date = new Date();
  newDate = date.toJSON().slice(8, 10) + "" + date.toJSON().slice(4, 7);
  time = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return newDate + "---" + time;
};
