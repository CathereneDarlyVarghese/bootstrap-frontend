import { uploadFile } from "react-s3";
import { Buffer } from "buffer";

Buffer.from("anything", "base64");
window.Buffer = window.Buffer || require("buffer").Buffer;

// type Props = {
//   file: File;
//   dir: string;
// };

export async function uploadFiletoS3(file, dir) {
  const timestamp = Date.now();
  const originalFileName = file.name;
  const fileNameWithTimestamp = `${timestamp}_${originalFileName}`;
  file.name = fileNameWithTimestamp;

  const formData = new FormData();
  formData.append("file", file, fileNameWithTimestamp);

  const config = {
    bucketName: `${process.env.REACT_APP_S3_BUCKET_NAME}`,
    dirName: dir,
    region: "ap-southeast-1",
    accessKeyId: `${process.env.REACT_APP_S3_KEY}`,
    secretAccessKey: `${process.env.REACT_APP_S3_SECRET_KEY}`,
  };

  const result = uploadFile(formData, config)
    .then((data) => data)
    .catch((err) => console.error(err));

  return result;
}
