import { useState, useEffect, useRef } from 'react';
import useChatStore from '../store/useChatStore.js';
import useAuthStore from '../store/useAuthStore.js';
import { getSocket } from '../lib/socket.js';
import MessageBubble from './MessageBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import { Send, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios.js';

const RoomWindow = () => {
    const [text, setText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const { selectedRoom, messages, getRoomMessages } = useChatStore();
    const { authUser } = useAuthStore();

    useEffect(() => {
    if (!selectedRoom) return;

    getRoomMessages(selectedRoom._id);
    
    const socket = getSocket();
    if (!socket) return;

    socket.emit('join_room', selectedRoom._id);

    // Remove ALL listeners first
    socket.off('newRoomMessage');
    socket.off('typing_start');
    socket.off('typing_stop');

    socket.on('newRoomMessage', (message) => {
      if (message.roomId?.toString() === selectedRoom._id?.toString()) {
        useChatStore.setState((state) => {
          // Prevent duplicate messages
          const exists = state.messages.find(m => m._id === message._id);
          if (exists) return state;
          return { messages: [...state.messages, message] };
        });
      }
    });

    socket.on('typing_start', () => setIsTyping(true));
    socket.on('typing_stop', () => setIsTyping(false));

    return () => {
      socket.off('newRoomMessage');
      socket.off('typing_start');
      socket.off('typing_stop');
    };
  }, [selectedRoom]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleTyping = (e) => {
        setText(e.target.value);
        const socket = getSocket();
        if (!socket) return;
        socket.emit('typing', { roomId: selectedRoom._id });
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', { roomId: selectedRoom._id });
        }, 1500);
    };

    const handleSend = async () => {
        if (!text.trim()) return;
        try {
            const res = await axiosInstance.post(`/rooms/${selectedRoom._id}/messages`, {
                text,
            });
            const socket = getSocket();
            if (socket) {
                socket.emit('sendRoomMessage', {
                    message: res.data,
                    roomId: selectedRoom._id,
                });
                socket.emit('stop_typing', { roomId: selectedRoom._id });
            }
            useChatStore.setState((state) => ({
                messages: [...state.messages, res.data],
            }));
            setText('');
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!selectedRoom) return null;

    return (
        <div className="flex-1 flex flex-col bg-gray-950">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center gap-3 bg-gray-900">
                <div className="w-10 h-10 rounded-full bg-accent2/20 flex items-center justify-center">
                    <Users size={20} className="text-teal-400" />
                </div>
                <div>
                    <p className="text-white font-semibold">{selectedRoom.name}</p>
                    <p className="text-gray-500 text-xs">
                        {selectedRoom.members?.length} members
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-sm">
                            No messages yet. Start the conversation! 👋
                        </p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <MessageBubble key={message._id} message={message} />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Typing Indicator */}
            {isTyping && <TypingIndicator />}

            {/* Input */}
            <div className="p-4 border-t border-gray-800 bg-gray-900">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={text}
                        onChange={handleTyping}
                        onKeyPress={handleKeyPress}
                        placeholder={`Message #${selectedRoom.name}`}
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

export default RoomWindow;