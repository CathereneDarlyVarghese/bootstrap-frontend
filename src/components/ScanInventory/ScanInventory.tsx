import React, { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";
import { getAllAssets } from "services/assetServices";
import { IncomingAsset } from "types";
import { locationAtom, useSyncedAtom } from "../../store/locationStore";

const QRCodeReader = () => {
  const resultRef = useRef(null);
  const qrRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);

  // Authentication
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, "authToken");
  // Location states
  const [location] = useSyncedAtom(locationAtom);

  const formatResponse = (res: any) => JSON.stringify(res, null, 2); // eslint-disable-line

  const fetchAllAssets = async () => {
    if (location.locationId !== "") {
      const res = await getAllAssets(authTokenObj.authToken);
      return Array.isArray(res) ? res : res ? [res] : [];
    }
    return [];
  };

  const { data: assets } = useQuery<IncomingAsset[], Error>(
    ["query-asset", location, authTokenObj.authToken],
    fetchAllAssets,
    {
      enabled: !!authTokenObj.authToken,
    },
  );

  useEffect(() => {
    let lastResult;
    let countResults = 0; // eslint-disable-line

    html5QrcodeScannerRef.current = new Html5QrcodeScanner(
      qrRef.current.id,
      {
        fps: 10,
        qrbox: 250,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      },
      false,
    );

    html5QrcodeScannerRef.current.render(
      (decodedText, decodedResult) => {
        // This will be called when a QR code is successfully scanned
        if (decodedText !== lastResult) {
          countResults += 1;
          lastResult = decodedText;

          // Check if the scanned asset_uuid exists in the assets data
          const scannedAsset = assets.find(
            (asset) => asset.asset_uuid === decodedText,
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
      },
    );

    return () => {
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.clear();
        html5QrcodeScannerRef.current = null;
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
