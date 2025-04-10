const multer = require("multer");
const path = require("path");

// Set up storage for voice notes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/voiceNotes/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to accept only audio files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["audio/mpeg", "audio/wav", "audio/ogg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only MP3, WAV, and OGG are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
});

module.exports = upload;
