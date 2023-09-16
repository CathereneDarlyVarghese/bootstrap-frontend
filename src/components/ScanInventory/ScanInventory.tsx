import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { locationAtom, useSyncedAtom } from "../../store/locationStore";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";
import { getAssets } from "services/assetServices";
import { IncomingAsset } from "types";

const QRCodeReader = () => {
  const resultRef = useRef(null);
  const qrRef = useRef(null);
  let html5QrcodeScanner = null; // Declare scanner variable

  // Authentication
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, "authToken");
  // Location states
  const [location] = useSyncedAtom(locationAtom);
  // Assets management
  const [incomingAssets, setIncomingAssets] = useState<IncomingAsset[]>([]);
  // Miscellaneous states
  const [getResult, setGetResult] = useState<string | null>(null);

  const formatResponse = (res: any) => {
    return JSON.stringify(res, null, 2);
  };

  const fetchAllAssets = async () => {
    try {
      if (location.locationId !== "") {
        const res = await getAssets(
          authTokenObj.authToken,
          location.locationId
        );
        return Array.isArray(res) ? res : res ? [res] : [];
      }
    } catch (err) {
      throw new Error(formatResponse(err.response?.data || err));
    }
  };

  const { data: assets } = useQuery<IncomingAsset[], Error>(
    ["query-asset", location, authTokenObj.authToken],
    fetchAllAssets,
    {
      enabled: !!authTokenObj.authToken,
    }
  );

  useEffect(() => {
    let lastResult;
    let countResults = 0;

    html5QrcodeScanner = new Html5QrcodeScanner(
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
          countResults = countResults + 1;
          lastResult = decodedText;
          console.log(`Scan result ${decodedText}`, decodedResult);

          // Check if the scanned asset_uuid exists in the assets data
          const scannedAsset = assets.find(
            (asset) => asset.asset_uuid === decodedText
          );

          if (scannedAsset) {
            // Redirect to the scanned asset's URL
            if (
              scannedAsset.asset_uuid.startsWith("http://") ||
              scannedAsset.asset_uuid.startsWith("https://")
            ) {
              window.location.href = scannedAsset.asset_uuid;
            }
          } else {
            // Redirect to /linkqr with the asset_uuid as a parameter
            window.location.href = `/linkqr?asset_uuid=${decodedText}`;
          }
        }
      },
      (errorMessage) => {
        // This will be called in case of errors
        console.log(`Error scanning: ${errorMessage}`);
      }
    );

    return () => {
      // Cleanup when the component unmounts
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear();
        html5QrcodeScanner = null; // Clear the scanner instance
      }
    };
  }, [assets]);

  return (
    <div className="flex flex-col items-center mt-5">
      <div id="qr-reader" ref={qrRef} className="w-1/2 md:w-10/12" />
      <div id="qr-reader-results" ref={resultRef} />
    </div>
  );
};

export default QRCodeReader;
