import { Server } from 'socket.io';

const onlineUsers = {};

export const initSocket = (server) => {
  const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

  io.on('connection', (socket) => {
    console.log(`⚡ User connected: ${socket.id}`);

    // Get userId from client
    const userId = socket.handshake.query.userId;
    if (userId) {
      onlineUsers[userId] = socket.id;
      console.log('🟢 Online users:', onlineUsers);
    }

    // Broadcast online users to everyone
    io.emit('getOnlineUsers', Object.keys(onlineUsers));

    // Send direct message
    socket.on('sendMessage', ({ message, receiverId }) => {
      const receiverSocketId = onlineUsers[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessage', message);
      }
    });

    // Join a room
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`👥 User joined room: ${roomId}`);
    });

    // Send room message
    socket.on('sendRoomMessage', ({ message, roomId }) => {
      io.to(roomId).emit('newRoomMessage', message);
    });

    // Typing indicators
    socket.on('typing', ({ receiverId, roomId }) => {
      if (receiverId) {
        const receiverSocketId = onlineUsers[receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('typing_start', socket.id);
        }
      }
      if (roomId) {
        socket.to(roomId).emit('typing_start', socket.id);
      }
    });

    socket.on('stop_typing', ({ receiverId, roomId }) => {
      if (receiverId) {
        const receiverSocketId = onlineUsers[receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('typing_stop', socket.id);
        }
      }
      if (roomId) {
        socket.to(roomId).emit('typing_stop', socket.id);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.id}`);
      // Remove user from online users
      for (const [key, value] of Object.entries(onlineUsers)) {
        if (value === socket.id) {
          delete onlineUsers[key];
          break;
        }
      }
      // Broadcast updated online users
      io.emit('getOnlineUsers', Object.keys(onlineUsers));
    });
  });

  return io;
};

export const getOnlineUsers = () => onlineUsers;