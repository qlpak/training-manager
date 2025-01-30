import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  withCredentials: true,
});

socket.on("updateRanking", (ranking) => {
  console.log("Received new ranking:", ranking);
});

export default socket;
