import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { locationAtom, useSyncedAtom } from "../../store/locationStore";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";
import { getAllAssets } from "services/assetServices";
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
        const res = await getAllAssets(authTokenObj.authToken);
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
          countResults += 1;
          lastResult = decodedText;

          // Check if the scanned asset_uuid exists in the assets data
          const scannedAsset = assets.find(
            (asset) => asset.asset_uuid === decodedText
          );

          if (scannedAsset) {
            // Redirect to /home if it's a match
            window.location.href = `/home?asset_uuid=${decodedText}&location_id=${scannedAsset.asset_location}&linked_asset_id=${scannedAsset.asset_id}`;
          } else {
            // Redirect to /linkqr if it's not a match
            window.location.href = `/linkqr?asset_uuid=${decodedText}`;
          }
        }
      },
      (errorMessage) => {
        // TODO: Handle scanning errors in the future
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
