const express = require("express");
const dbConnect = require("./db/connect");
const allApiRoutes = require("./api/routes");
const chatNamespace = require("./socket/namespaces/chat");
const { getRandomSentence, getResponseInterval } = require("./utils");

dbConnect();
const PORT = process.env.PORT || 5000;
const app = express();
const server = app.listen(PORT, () => console.log("Server running..."));

app.use(express.static("public"));
app.use("/", allApiRoutes);
const io = require("socket.io")(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("fetch_response", (data) => {
    const { userId } = data;
    const responseInterval = getResponseInterval(1000, 4000);

    setTimeout(() => {
      socket.emit("start_typing", { userId });

      setTimeout(() => {
        socket.emit("stop_typing", { userId });
        socket.emit("fetch_response", {
          response: getRandomSentence(),
          userId,
        });
      }, responseInterval);
    }, 1500);
  });
});

const chatNS = io.of("/chat");
chatNS.on("connection", (socket) => chatNamespace(io, chatNS, socket));
