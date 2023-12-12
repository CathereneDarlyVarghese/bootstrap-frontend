import React, { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { genericAtom, useSyncedGenericAtom } from 'store/genericStore';
import { getAssets, updateAsset } from 'services/assetServices';
import { IncomingAsset, Asset } from 'types';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { locationAtom, useSyncedAtom } from '../../store/locationStore';
import { AssetCondition } from '../../enums';

const QRCodeReader = () => {
  const resultRef = useRef(null);
  const qrRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);
  const navigate = useNavigate();

  // Authentication
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, 'authToken');
  const [location] = useSyncedAtom(locationAtom);
  const queryClient = useQueryClient();

  const { data: assets } = useQuery({
    queryKey: ['query-assetScan', location, authTokenObj.authToken],
    queryFn: async () => {
      if (location.locationId !== '') {
        const res = await getAssets(
          authTokenObj.authToken,
          location.locationId,
        );
        return res;
      }
      return [];
    },
    enabled: !!authTokenObj.authToken && !!location.locationId,
  });

  const assetUpdateMutation = useMutation({
    mutationFn: (updatedAssetObj: Asset) =>
      updateAsset(
        authTokenObj.authToken,
        updatedAssetObj.asset_id,
        updatedAssetObj,
      ),
    onSuccess: () => {
      toast.success("Asset's QR Updated Successfully");
      queryClient.invalidateQueries(['query-asset']);
    },
    onError: () => {
      toast.error("Failed to Update Asset's QR Code");
    },
  });

  const closeScanner = () => {
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear();
      html5QrcodeScannerRef.current = null;
    }
  };

  useEffect(() => {
    closeScanner();
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
      async (decodedText, decodedResult) => {
        // This will be called when a QR code is successfully scanned
        if (decodedText !== lastResult) {
          countResults += 1;
          lastResult = decodedText;

          // Check if the scanned asset_uuid exists in the assets data
          const scannedQRAsset = assets.find(
            asset => asset.asset_uuid === decodedText,
          );

          // Extract asset_id and location_id from the URL query string
          const urlSearchParams = new URLSearchParams(window.location.search);
          const assetID = urlSearchParams.get('asset_id');
          // const assetUUID = urlSearchParams.get("asset_uuid");

          const toBeLinkedAsset = assets.find(
            asset => asset.asset_id === assetID,
          );

          if (!assetID) {
            if (scannedQRAsset) {
              // Redirect to /home if it's a match
              closeScanner();
              navigate(
                `/home?asset_uuid=${decodedText}&location_id=${scannedQRAsset.asset_location}&linked_asset_id=${scannedQRAsset.asset_id}`,
              );
            } else {
              // Redirect to /linkqr if it's not a match
              closeScanner();
              navigate(`/linkqr?asset_uuid=${decodedText}`);
            }
          } else {
            let formattedScannedQRAsset: Asset | undefined;
            if (scannedQRAsset) {
              delete scannedQRAsset.asset_type;
              delete scannedQRAsset.location_name;
              delete scannedQRAsset.placement_name;
              delete scannedQRAsset.section_name;
              delete scannedQRAsset.images_array;
              formattedScannedQRAsset = {
                ...scannedQRAsset,
                asset_finance_purchase: parseFloat(
                  scannedQRAsset.asset_finance_purchase,
                ),
                asset_finance_current_value: parseFloat(
                  scannedQRAsset.asset_finance_current_value,
                ),
                modified_date: new Date(scannedQRAsset.modified_date),
                asset_condition:
                  scannedQRAsset.asset_condition === 'ACTIVE'
                    ? AssetCondition.ACTIVE
                    : AssetCondition.INACTIVE,
              };

              formattedScannedQRAsset.asset_uuid = null;

              await assetUpdateMutation.mutateAsync(formattedScannedQRAsset);
            }

            delete toBeLinkedAsset.asset_type;
            delete toBeLinkedAsset.location_name;
            delete toBeLinkedAsset.placement_name;
            delete toBeLinkedAsset.section_name;
            delete toBeLinkedAsset.images_array;
            const formattedToBeLinkedAsset: Asset = {
              ...toBeLinkedAsset,
              asset_finance_purchase: parseFloat(
                toBeLinkedAsset.asset_finance_purchase,
              ),
              asset_finance_current_value: parseFloat(
                toBeLinkedAsset.asset_finance_current_value,
              ),
              modified_date: new Date(toBeLinkedAsset.modified_date),
              asset_condition:
                toBeLinkedAsset.asset_condition === 'ACTIVE'
                  ? AssetCondition.ACTIVE
                  : AssetCondition.INACTIVE,
            };

            formattedToBeLinkedAsset.asset_uuid = decodedText;
            await assetUpdateMutation.mutateAsync(formattedToBeLinkedAsset);

            closeScanner();
            navigate('/home');
          }
        }
      },
      errorMessage => {
        // TODO: Handle scanning errors in the future
      },
    );

    return () => {
      closeScanner();
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
