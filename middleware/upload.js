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
      ? [] // no transformation for video
      : [{ width: 800, height: 800, crop: "limit" }]
  })
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024 // 1 MB for image
  },
  fileFilter: (req, file, cb) => {
    const isVideo = file.mimetype.startsWith("video");
    const isImage = file.mimetype.startsWith("image");

    if (isVideo) {
      if (file.size > 4 * 1024 * 1024) {
        return cb(new Error("Video must be less than 4MB"));
      }
    }

    if (!isImage && !isVideo) {
      return cb(new Error("Only images and videos are allowed"));
    }

    cb(null, true);
  }
});

export default upload;
