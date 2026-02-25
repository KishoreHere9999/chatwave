import cloudinary from '../utils/cloudinary.js';
// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;

    if (!profilePic) {
      return res.status(400).json({ message: 'Profile pic is required' });
    }

    // Upload to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: 'chatwave/profiles',
    });

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};