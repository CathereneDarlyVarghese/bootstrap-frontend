import { uploadFile } from "react-s3";
import { Buffer } from "buffer";

Buffer.from("anything", "base64");
window.Buffer = window.Buffer || require("buffer").Buffer;

type Props = {
  file: File;
  dir: string;
};

export async function uploadFiletoS3(file, dir) {
  const config = {
    bucketName: "dube-filestorage",
    dirName: dir,
    region: "ap-southeast-1",
    accessKeyId: `${process.env.REACT_APP_S3_KEY}`,
    secretAccessKey: `${process.env.REACT_APP_S3_SECRET_KEY}`,
  };

  const result =  uploadFile(file, config)
    .then((data) => data)
    .catch((err) => console.error(err));

    return result
}
