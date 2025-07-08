import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "glitzzera_jewelry",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4"],
    public_id: `${Date.now()}-${file.originalname}`,
    resource_type: file.mimetype.startsWith("video") ? "video" : "image",
    transformation: file.mimetype.startsWith("video")
      ? [] // No transformation for videos
      : [{ width: 800, height: 800, crop: "limit" }]
  })
});

// ✅ 4MB limit (applies to all files)
const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  }
});

export default upload;
