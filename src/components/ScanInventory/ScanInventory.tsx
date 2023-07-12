import { useEffect, useState } from "react";
import useLocalStorage from "hooks/useLocalStorage";
import { Html5Qrcode } from "html5-qrcode";

interface CameraDevice {
  id: string;
  label: string;
}

function ScanInventory() {
  const [cameraId, setCameraId] = useLocalStorage<string>(
    "last_used_camera_id",
    null
  );
  const [devices, setDevices] = useState<CameraDevice[]>(null);

  useEffect(() => {
    Html5Qrcode.getCameras().then((ds) => setDevices(ds));
  }, []);

  useEffect(() => {
    if (cameraId) {
      const scanner = new Html5Qrcode("reader");

      const startPromise = scanner.start(
        cameraId,
        { fps: 10 },
        console.log,
        () => {}
      );

      return () => {
        startPromise.then(() => {
          if (scanner.isScanning) {
            scanner.stop();
          }
        });
      };
    }
    return undefined;
  }, [cameraId]);

  return (
    <>
      <div id="reader" />
      {devices &&
        devices.map((d) => (
          <button key={d.id} onClick={() => setCameraId(d.id)}>
            {d.label}
          </button>
        ))}
    </>
  );
}

export default ScanInventory;
