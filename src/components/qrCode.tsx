import React, { useRef } from 'react';
import qr from 'qrcode-generator';
import { Button } from 'react-daisyui';

type QRCodeProps = {
  url: string;
};

const QRCode: React.FC<QRCodeProps> = ({ url }) => {
  const qrCodeRef = useRef<HTMLAnchorElement | null>(null);

  const downloadQRCode = () => {
    // Generate QR Code
    const qrCode = qr(0, 'L');
    qrCode.addData(url);
    qrCode.make();

    if (qrCodeRef.current) {
      const imgTag = qrCode.createImgTag(4);
      const imgUrl = imgTag.match(/src="([^"]*)/)?.[1];

      if (imgUrl) {
        qrCodeRef.current.href = imgUrl;
        qrCodeRef.current.download = 'qrcode.png';
        qrCodeRef.current.click();
      }
    }
  };

  return (
    <div>
      <Button className="btn mr-6 btn-sm" onClick={downloadQRCode}>
        Download QR
      </Button>
      <a ref={qrCodeRef} style={{ display: 'none' }} download></a>
    </div>
  );
};

export default QRCode;
