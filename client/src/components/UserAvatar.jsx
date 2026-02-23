const UserAvatar = ({ user, onlineUsers, size = 'md' }) => {
  const isOnline = onlineUsers?.includes(user._id);
  
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
  };

  return (
    <div className="relative">
      {user.profilePic ? (
        <img
          src={user.profilePic}
          alt={user.username}
          className={`${sizes[size]} rounded-full object-cover`}
        />
      ) : (
        <div className={`${sizes[size]} rounded-full bg-teal-400 flex items-center justify-center font-bold text-gray-950`}>
          {user.username?.charAt(0).toUpperCase()}
        </div>
      )}
      {isOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900" />
      )}
    </div>
  );
};

export default UserAvatar;