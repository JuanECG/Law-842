const path = require('path');
const multer = require('multer');
const md5 = require('md5');
// Multer definition
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, '../../public/media')),
  filename: (req, file, cb) =>
    cb(
      null,
      md5(new Date() + file.originalname) +
        '.' +
        file.originalname.split('.').pop()
    )
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
    cb(null, true);
  else cb(new Error('Bad file extension'));
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter: fileFilter
});

module.exports = (req, res, next) => {
  upload.single('media')(req, res, (err) => {
    console.log(req.file);
    if (err instanceof multer.MulterError) {
      return res
        .status(500)
        .json({ error: 'Error uploading the file', message: err });
    } else if (err) return res.status(500).json({ error: err.toString() });
    next();
  });
};
