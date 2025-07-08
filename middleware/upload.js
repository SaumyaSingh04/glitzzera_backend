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
      ? [] // no transformation for videos
      : [{ width: 800, height: 800, crop: "limit" }]
  })
});

const upload = multer({ storage });
export default upload;
