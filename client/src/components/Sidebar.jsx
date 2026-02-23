import useAuthStore from '../store/useAuthStore.js';
import useChatStore from '../store/useChatStore.js';
import UserAvatar from './UserAvatar.jsx';
import { useEffect } from 'react';
import { LogOut, Users } from 'lucide-react';

const Sidebar = () => {
  const { authUser, logout, onlineUsers } = useAuthStore();
  const { users, getUsers, selectedUser, setSelectedUser } = useChatStore();

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">
          Chat<span className="text-teal-400">Wave</span>
        </h1>
        <button
          onClick={logout}
          className="text-gray-400 hover:text-red-400 transition"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Current user */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <UserAvatar user={authUser} onlineUsers={onlineUsers} size="md" />
        <div>
          <p className="text-white font-medium text-sm">{authUser?.username}</p>
          <p className="text-green-400 text-xs">Online</p>
        </div>
      </div>

      {/* Users list */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 px-1">
          <Users size={14} />
          <span>Direct Messages</span>
        </div>

        {users.length === 0 ? (
          <p className="text-gray-500 text-sm text-center mt-8">
            No users found
          </p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition mb-1 ${
                selectedUser?._id === user._id
                  ? 'bg-teal-400/10 border border-teal-400/20'
                  : 'hover:bg-gray-800'
              }`}
            >
              <UserAvatar user={user} onlineUsers={onlineUsers} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user.username}
                </p>
                <p className="text-xs truncate">
                  {onlineUsers?.includes(user._id) ? (
                    <span className="text-green-400">Online</span>
                  ) : (
                    <span className="text-gray-500">Offline</span>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;