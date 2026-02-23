const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="flex items-center gap-1 bg-gray-800 rounded-2xl px-4 py-3">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-gray-500 text-xs">typing...</span>
    </div>
  );
};

export default TypingIndicator;