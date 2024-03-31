const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.mimetype === 'application/json') {
            cb(null, true);
        } else {
            cb(new Error('Only CSV and JSON files are allowed!'));
        }
    }
});

module.exports = upload;
