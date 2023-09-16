import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

AWS.config.update({
  accessKeyId: 'YOUR_ACCESS_KEY',
  secretAccessKey: 'YOUR_SECRET_KEY',
  region: 'YOUR_REGION',
});

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'your-s3-bucket',
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
});

export default upload;
