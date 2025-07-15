import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";
import path from "path";

const allowedFormats = ["jpg", "jpeg", "png", "webp", "mp4"];
const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1 MB
const MAX_VIDEO_SIZE = 4 * 1024 * 1024; // 4 MB

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const nameWithoutExt = path.parse(file.originalname).name; // 👈 removes extension
    return {
      folder: "glitzzera_jewelry",
      allowed_formats: allowedFormats,
      public_id: `${Date.now()}-${nameWithoutExt}`, // ✅ fixed here
      resource_type: file.mimetype.startsWith("video") ? "video" : "image",
      transformation: file.mimetype.startsWith("video")
        ? []
        : [{ width: 800, height: 800, crop: "limit" }]
    };
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image");
    const isVideo = file.mimetype.startsWith("video");

    if (!isImage && !isVideo) {
      return cb(new Error("Only images and videos are allowed"), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 4 * 1024 * 1024 // max 4MB for all (enforced per file-type elsewhere if needed)
  }
});

export default upload;
