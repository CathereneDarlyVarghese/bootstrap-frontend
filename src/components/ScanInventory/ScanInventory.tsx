import React, { useEffect, useRef } from "react";
// import { Html5QrcodeScanner } from "html5-qrcode";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";

const QRCodeReader = () => {
  const resultRef = useRef(null);
  const qrRef = useRef(null);

  useEffect(() => {
    let lastResult;
    let countResults = 0;

    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrRef.current.id,
      {
        fps: 10,
        qrbox: 250,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      },
      false
    );

    html5QrcodeScanner.render(
      (decodedText, decodedResult) => {
        // This will be called when a QR code is successfully scanned
        if (decodedText !== lastResult) {
          countResults += 1;
          lastResult = decodedText;

          // Redirect to the scanned URL
          if (
            decodedText.startsWith("http://") ||
            decodedText.startsWith("https://")
          ) {
            window.location.href = decodedText;
          }
        }
      },
      (errorMessage) => {
        return;
      }
    );

    return () => {
      html5QrcodeScanner.clear();
    };
  }, []);

  return (
    <div className="flex flex-col items-center mt-5">
      <div id="qr-reader" ref={qrRef} className="w-1/2 md:w-10/12" />
      <div id="qr-reader-results" ref={resultRef} />
    </div>
  );
};

export default QRCodeReader;
