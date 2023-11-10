import { uploadFile } from 'react-s3';
import { Buffer } from 'buffer';

Buffer.from('anything', 'base64');

window.Buffer = window.Buffer || require('buffer').Buffer; // eslint-disable-line

// type Props = {
//   file: File;
//   dir: string;
// };

export async function uploadFiletoS3(file, dir) {
  const currentDate = new Date();
  const formattedDate = currentDate
    .toISOString()
    .slice(0, 19)
    .replace(/[-T:/]/g, '');
  const originalFileName = file.name;
  const newFileName = `${formattedDate}_${originalFileName}`;

  const renamedFile = new File([file], newFileName, { type: file.type });

  const config = {
    bucketName: `${process.env.REACT_APP_S3_BUCKET_NAME}`,
    dirName: dir,
    region: 'ap-southeast-1',
    accessKeyId: `${process.env.REACT_APP_S3_KEY}`,
    secretAccessKey: `${process.env.REACT_APP_S3_SECRET_KEY}`,
  };

  const result = uploadFile(renamedFile, config).then(data => data);

  return result;
}
