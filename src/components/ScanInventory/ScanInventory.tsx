import React, { useEffect, useRef } from "react";
// import { Html5QrcodeScanner } from "html5-qrcode";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";

const QRCodeReader = () => {
  const resultRef = useRef(null);
  const qrRef = useRef(null);

  useEffect(() => {
    let lastResult;
    let countResults = 0;

    const onScanSuccess = (decodedText, decodedResult) => {
      if (decodedText !== lastResult) {
        ++countResults;
        lastResult = decodedText;
        console.log(`Scan result ${decodedText}`, decodedResult);
      }
    };

    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrRef.current.id,
      { fps: 10, qrbox: 250, supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA], },
      false
    );

    html5QrcodeScanner.render(
      (decodedText, decodedResult) => {
        // This will be called when a QR code is successfully scanned
        if (decodedText !== lastResult) {
          ++countResults;
          lastResult = decodedText;
          console.log(`Scan result ${decodedText}`, decodedResult);
        }
      },
      (errorMessage) => {
        // This will be called in case of errors
        console.log(`Error scanning: ${errorMessage}`);
      }
    );

    return () => {
      html5QrcodeScanner.clear();
    };
  }, []);

  return (
    <div>
      <div id="qr-reader" ref={qrRef} style={{ width: "500px" }} />
      <div id="qr-reader-results" ref={resultRef} />
    </div>
  );
};

export default QRCodeReader;
