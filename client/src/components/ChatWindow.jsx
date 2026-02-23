import { useState, useEffect, useRef } from 'react';
import useChatStore from '../store/useChatStore.js';
import useAuthStore from '../store/useAuthStore.js';
import { getSocket } from '../lib/socket.js';
import MessageBubble from './MessageBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import UserAvatar from './UserAvatar.jsx';
import { Send } from 'lucide-react';

const ChatWindow = () => {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { selectedUser, messages, getMessages, sendMessage, listenForMessages } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      listenForMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.off('typing_start');
    socket.off('typing_stop');

    socket.on('typing_start', () => {
      console.log('typing started!');
      setIsTyping(true);
    });
    socket.on('typing_stop', () => {
      console.log('typing stopped!');
      setIsTyping(false);
    });

    return () => {
      socket.off('typing_start');
      socket.off('typing_stop');
    };
  }, [selectedUser]);

  const handleTyping = (e) => {
    setText(e.target.value);
    const socket = getSocket();
    if (!socket) return;
    socket.emit('typing', { receiverId: selectedUser._id });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { receiverId: selectedUser._id });
    }, 1500);
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessage(selectedUser._id, { text });
    setText('');
    const socket = getSocket();
    if (socket) {
      socket.emit('stop_typing', { receiverId: selectedUser._id });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="text-6xl mb-4">🌊</div>
          <h2 className="text-white text-xl font-bold mb-2">Welcome to ChatWave</h2>
          <p className="text-gray-500 text-sm">Select a user to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-950">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3 bg-gray-900">
        <UserAvatar user={selectedUser} onlineUsers={onlineUsers} size="md" />
        <div>
          <p className="text-white font-semibold">{selectedUser.username}</p>
          <p className="text-xs">
            {onlineUsers?.includes(selectedUser._id) ? (
              <span className="text-green-400">Online</span>
            ) : (
              <span className="text-gray-500">Offline</span>
            )}
          </p>
        </div>
      </div>

      {/* Messages */}
    <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">No messages yet. Say hi! 👋</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message._id} message={message} />
          ))
        )}
       
        <div ref={messagesEndRef} />
      </div>
          {isTyping && <TypingIndicator />}

      {/* Input */}
      <div className="p-4 border-t border-gray-800 bg-gray-900"></div>
      {/* Input */}
      <div className="p-4 border-t border-gray-800 bg-gray-900">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={text}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="bg-teal-400 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-950 p-3 rounded-xl transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;