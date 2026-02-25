import cloudinary from '../utils/cloudinary.js';
// Send a DM
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { userId } = req.params;
    const senderId = req.user._id;

    let imageUrl = null;

    // Upload image to cloudinary if provided
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'chatwave/messages',
      });
      imageUrl = uploadResponse.secure_url;
    }

    const message = await Message.create({
      senderId,
      receiverId: userId,
      text,
      image: imageUrl,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};