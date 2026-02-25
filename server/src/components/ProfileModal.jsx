import { useState } from 'react';
import useAuthStore from '../store/useAuthStore.js';
import axiosInstance from '../lib/axios.js';
import { X, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileModal = ({ onClose }) => {
  const { authUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    if (!previewImage) {
      toast.error('Please select an image first');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axiosInstance.put('/auth/profile', {
        profilePic: previewImage,
      });
      useAuthStore.setState({ authUser: res.data });
      toast.success('Profile updated! 🎉');
      onClose();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-white font-bold text-lg">Update Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col items-center gap-5">
          {/* Avatar preview */}
          <div className="relative">
            {previewImage || authUser?.profilePic ? (
              <img
                src={previewImage || authUser?.profilePic}
                alt="profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-teal-400 flex items-center justify-center text-gray-950 font-bold text-3xl">
                {authUser?.username?.charAt(0).toUpperCase()}
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-teal-400 rounded-full p-2 cursor-pointer hover:bg-teal-500 transition">
              <Camera size={14} className="text-gray-950" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="text-center">
            <p className="text-white font-semibold">{authUser?.username}</p>
            <p className="text-gray-500 text-sm">{authUser?.email}</p>
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
            onClick={handleUpdate}
            disabled={isLoading || !previewImage}
            className="flex-1 bg-teal-400 hover:bg-teal-500 text-gray-950 py-3 rounded-xl transition text-sm font-bold disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;