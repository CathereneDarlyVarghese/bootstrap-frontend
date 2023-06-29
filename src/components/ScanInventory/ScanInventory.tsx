import React, { useEffect, useState } from "react";
import useLocalStorage from "hooks/useLocalStorage";
import { Html5Qrcode } from "html5-qrcode";
import { CameraDevice } from "html5-qrcode/esm/core";

function ScanInventory() {
  const [cameraId, setCameraId] = useLocalStorage("last_used_camera_id", null);
  const [devices, setDevices] = useState<CameraDevice[]>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState(true);

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((ds) => {
        setDevices(ds);
        if (ds.length === 0) {
          setCameraAvailable(false);
        }
      })
      .catch((error) => {
        console.error("Error retrieving cameras:", error);
        setCameraAvailable(false);
      });
  }, []);

  useEffect(() => {
    if (cameraId && scannerActive) {
      const scanner = new Html5Qrcode("reader");

      const startPromise = scanner.start(
        cameraId,
        { fps: 10 },
        (result) => {
          // Handle the scanned QR code result
          console.log("Scanned result:", result);
        },
        (error) => {
          // Handle any scanning errors
          console.error("Scanning error:", error);
        }
      );

      return () => {
        startPromise.then(() => {
          if (scanner.isScanning) {
            scanner.stop().catch((error) => {
              console.error("Scanner stop error:", error);
            });
          }
        });
      };
    }
    return undefined;
  }, [cameraId, scannerActive]);

  return (
    <>
      {scannerActive && <div id="reader" />}
      {!scannerActive && devices && devices.length > 0 ? (
        devices.map((d) => (
          <button key={d.id} onClick={() => setScannerActive(!scannerActive)}>
            {d.label}
          </button>
        ))
      ) : (
        <p>
          {cameraAvailable ? "No camera available" : "Error retrieving cameras"}
        </p>
      )}
    </>
  );
}

export default ScanInventory;
