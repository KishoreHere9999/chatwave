import { useState } from 'react';
import useChatStore from '../store/useChatStore.js';
import useAuthStore from '../store/useAuthStore.js';
import axiosInstance from '../lib/axios.js';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateRoomModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { users, getRooms } = useChatStore();
  const { authUser } = useAuthStore();

  const toggleMember = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Room name is required!');
      return;
    }
    if (selectedMembers.length === 0) {
      toast.error('Select at least one member!');
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post('/rooms', {
        name,
        description,
        members: selectedMembers,
      });
      toast.success('Room created! 🎉');
      getRooms();
      onClose();
    } catch (error) {
      toast.error('Failed to create room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-white font-bold text-lg">Create Group Room</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Room Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. General Chat"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition text-sm"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this room about?"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition text-sm"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Add Members</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => toggleMember(user._id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                    selectedMembers.includes(user._id)
                      ? 'bg-teal-400/10 border border-teal-400/20'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-teal-400 flex items-center justify-center text-gray-950 font-bold text-sm">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white text-sm">{user.username}</span>
                  {selectedMembers.includes(user._id) && (
                    <span className="ml-auto text-teal-400 text-xs font-bold">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl transition text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isLoading}
            className="flex-1 bg-teal-400 hover:bg-teal-500 text-gray-950 py-3 rounded-xl transition text-sm font-bold disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Room'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomModal;