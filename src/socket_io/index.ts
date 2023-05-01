const connect = (app: any) => {
  const io = require("socket.io")(8000, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  handleConnect(io);
};

export type UserType = {
  userId: string;
  socketId: string;
};

let users: UserType[] = [];

const addUser = (userId: string, socketId: string) => {
  !users.some((user: UserType) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId: string) => {
  users = users.filter((user: UserType) => user.socketId !== socketId);
};

const getUser = (userId: string) => {
  return users.find((user: UserType) => user.userId === userId);
};

const handleConnect = (io: any) => {
  io.on("connection", (socket: any) => {
    //when connect
    console.log("Người dùng vừa kết nối: ", socket.id);

    //when disconnect
    socket.on("disconnect", () => {
      console.log("Người dùng vừa ngắt kết nối:", socket.id);
      removeUser(socket.id);
    });

    handleAddUser(io, socket);
    handleSendMessage(io, socket);
  });
};

const handleAddUser = (io: any, socket: any) => {
  //take userId and socketId from user
  socket.on("addUser", (userId: string) => {
    addUser(userId, socket.id);
    console.log("list user: ", users);
    io.emit("getUsers", users);
  });
};

const handleSendMessage = (io: any, socket: any) => {
  //send and get message
  socket.on("sendMessage", ({ senderId, conversationId, text }: any) => {
    console.log("data message: ", senderId, conversationId, text);

    io.sockets.emit(`getMessage${conversationId}`, {
      conversationId,
      senderId,
      text,
    });
  });
};

const socketService = {
  connect,
};

export default socketService;
