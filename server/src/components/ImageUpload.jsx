import { useRef } from 'react';
import { Image } from 'lucide-react';
import toast from 'react-hot-toast';

const ImageUpload = ({ onImageSelect }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelect(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="text-gray-400 hover:text-teal-400 transition p-2 rounded-lg hover:bg-gray-800"
      >
        <Image size={20} />
      </button>
    </div>
  );
};

export default ImageUpload;