import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

// Allowed formats
const allowedFormats = ["jpg", "jpeg", "png", "webp", "mp4"];

// 1 MB = 1 * 1024 * 1024 = 1048576 bytes
const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1 MB
const MAX_VIDEO_SIZE = 4 * 1024 * 1024; // 4 MB

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "glitzzera_jewelry",
    allowed_formats: allowedFormats,
    public_id: `${Date.now()}-${file.originalname}`,
    resource_type: file.mimetype.startsWith("video") ? "video" : "image",
    transformation: file.mimetype.startsWith("video")
      ? [] // No transformation for videos
      : [{ width: 800, height: 800, crop: "limit" }],
  }),
});

// 👇 fileFilter for size limit
const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith("image");
  const isVideo = file.mimetype.startsWith("video");

  const limit = isImage ? MAX_IMAGE_SIZE : isVideo ? MAX_VIDEO_SIZE : 0;

  // If file size is available (Note: not always available with CloudinaryStorage!)
  if (file.size && file.size > limit) {
    return cb(
      new Error(
        `File too large. Max allowed: ${
          isImage ? "1MB for images" : "4MB for videos"
        }`
      ),
      false
    );
  }

  // Fallback (size not available) — allow file (Cloudinary will reject if needed)
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;
