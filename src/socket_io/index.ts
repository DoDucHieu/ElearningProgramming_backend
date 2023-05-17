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

const getUser = (socketId: string) => {
  return users.find((user: UserType) => user.socketId === socketId);
};

const handleConnect = (io: any) => {
  io.on("connection", (socket: any) => {
    //when connect
    console.log("Người dùng vừa kết nối: ", socket.id);

    //when disconnect
    socket.on("disconnect", () => {
      console.log("Người dùng vừa ngắt kết nối:", getUser(socket.id));
      const userId = getUser(socket.id)?.userId;
      if (userId) {
        io.sockets.emit(`userDisconnect${userId}`, userId);
      }
      removeUser(socket.id);
    });

    handleAddUser(io, socket);
    handleSendMessage(io, socket);
    handleMakeVideoCall(io, socket);
    makeAcceptVideoCall(io, socket);
    makeDeclineVideoCall(io, socket);
    makeEndCall(io, socket);
    makeShowHideCamera(io, socket);
  });
};

const handleAddUser = (io: any, socket: any) => {
  //take userId and socketId from user
  socket.on("addUser", (userId: string) => {
    addUser(userId, socket.id);
    console.log("Danh sách user: ", users);
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

const handleMakeVideoCall = (io: any, socket: any) => {
  socket.on("makeVideoCall", ({ sender_id, receiver_id }: any) => {
    console.log(
      `Người dùng ${sender_id} đang gọi video cho người dùng ${receiver_id}`
    );
    io.sockets.emit(`getVideoCall${receiver_id}`, sender_id);
  });
};

const makeAcceptVideoCall = (io: any, socket: any) => {
  socket.on("makeAcceptVideoCall", ({ user_id, peer }: any) => {
    console.log(
      `Người dùng ${user_id} có peerID là ${peer} vừa chấp nhận cuộc gọi video`
    );
    io.sockets.emit(`getAcceptVideoCall${user_id}`, peer);
  });
};

const makeDeclineVideoCall = (io: any, socket: any) => {
  socket.on("makeDeclineVideoCall", (user_id: string) => {
    console.log("Người dùng từ chối call video: ", user_id);
    io.sockets.emit(`getDeclineVideoCall${user_id}`, user_id);
  });
};

const makeEndCall = (io: any, socket: any) => {
  socket.on("makeEndCall", (user_id: string) => {
    console.log("Người dùng kết thúc call video: ", user_id);
    io.sockets.emit(`getEndCall${user_id}`, user_id);
  });
};

const makeShowHideCamera = (io: any, socket: any) => {
  socket.on("makeShowHideCamera", ({ user_id, value }: any) => {
    console.log(`Người dùng điều chỉnh camera thành ${value} : `, user_id);
    io.sockets.emit(`getShowHideCamera${user_id}`, { user_id, value });
  });
};

const socketService = {
  connect,
};

export default socketService;
