import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScanSuccess: (decodedText: string, result: any) => void;
  onScanError: (errorMessage: string) => void;
}

const ScanInventory: React.FC<QRScannerProps> = ({
  onScanSuccess,
  onScanError,
}) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5Qrcode(scannerRef.current as string);
    scanner
      .start(
        { facingMode: "environment" }, // Use the rear camera (if one is available)
        { fps: 10, qrbox: { width: 250, height: 250 } }, // Configuration options
        (decodedText: string, result: any) => {
          // This callback is called when a QR code is successfully scanned
          onScanSuccess(decodedText, result);
        },
        (errorMessage: string) => {
          // This callback is called in case of errors
          onScanError(errorMessage);
        }
      )
      .catch((err: any) => console.log(err));

    return () => {
      // Cleanup
      scanner.stop();
    };
  }, [onScanSuccess, onScanError]);

  return <div id="scanner" ref={scannerRef} />;
};

export default ScanInventory;
