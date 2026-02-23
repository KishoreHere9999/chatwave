import useAuthStore from '../store/useAuthStore.js';

const MessageBubble = ({ message }) => {
  const { authUser } = useAuthStore();
  const isMyMessage = message.senderId === authUser?._id;

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-xs lg:max-w-md ${isMyMessage ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Image */}
        {message.image && (
          <img
            src={message.image}
            alt="message"
            className="rounded-2xl max-w-xs mb-1 cursor-pointer hover:opacity-90 transition"
          />
        )}

        {/* Text */}
        {message.text && (
          <div className={`px-4 py-2 rounded-2xl ${
            isMyMessage
              ? 'bg-teal-400 text-gray-950'
              : 'bg-gray-800 text-white'
          }`}>
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {/* Time */}
        <span className="text-gray-500 text-xs mt-1 px-1">
          {formatTime(message.createdAt)}
        </span>

        {/* Reactions */}
        {message.reactions?.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {message.reactions.map((reaction, index) => (
              <span
                key={index}
                className="bg-gray-800 rounded-full px-2 py-0.5 text-xs"
              >
                {reaction.emoji}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;