import React, { useState, useEffect } from 'react';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { updateAsset } from 'services/assetServices';
import { toast } from 'react-toastify';
import { Asset } from 'types';
import { useSyncedGenericAtom, genericAtom } from 'store/genericStore';
import { AssetCondition } from '../../enums';

const ConfirmModal = ({
  linkedAsset,
  selectedAsset,
  assetUUID,
  open,
  setOpen,
}) => {
  const {
    asset_type: assetTypeSelected,
    location_name: locationNameSelected,
    placement_name: placementNameSelected,
    section_name: sectionNameSelected,
    images_array: imagesArraySelected,
    next_asset_check_date: nextAssetCheckDateSelected,
    ...updatedAsset
  } = selectedAsset;

  let toBeUnlinkedAsset = null;

  if (linkedAsset) {
    const {
      asset_type: assetTypeLinked,
      location_name: locationNameLinked,
      placement_name: placementNameLinked,
      section_name: sectionNameLinked,
      images_array: imagesArrayLinked,
      next_asset_check_date: nextAssetCheckDateLinked,
      ...rest
    } = linkedAsset;

    toBeUnlinkedAsset = rest;
  }

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [authTokenObj] = useSyncedGenericAtom(genericAtom, 'authToken');
  const [linkedMessage, setLinkedMessage] = useState(false);

  const handleSubmitForm = async event => {
    event.preventDefault();
    updatedAsset.asset_condition =
      AssetCondition[selectedAsset.asset_condition];

    updatedAsset.asset_uuid = assetUUID;

    if (toBeUnlinkedAsset) {
      toBeUnlinkedAsset.asset_condition =
        AssetCondition[linkedAsset.asset_condition];

      toBeUnlinkedAsset.asset_uuid = null;

      assetUpdateMutation.mutateAsync(toBeUnlinkedAsset);
    }

    assetUpdateMutation.mutateAsync(updatedAsset);
  };

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
      queryClient.invalidateQueries(['query-assetScan']);
    },
    onError: () => {
      toast.error("Failed to Update Asset's QR Code");
    },
  });

  return (
    <>
      <div>
        <input
          type="checkbox"
          id="my_modal_6"
          className="modal-toggle"
          checked={open}
        />
        <div className="modal">
          <div className="modal-box flex flex-col gap-5">
            <h3 className="font-bold text-lg">Confirm</h3>
            {selectedAsset.asset_uuid === null ? (
              <p>
                Do you want to link the asset,{' '}
                <strong>{selectedAsset.asset_name}</strong> to this unassigned
                QR Code?
              </p>
            ) : (
              <p>
                Do you want to <strong>UPDATE</strong> the asset,{' '}
                <strong>{selectedAsset.asset_name}</strong>'s existing QR Code
                with this one?
              </p>
            )}
            <div className="flex flex-row justify-center w-full gap-5">
              <button
                type="submit"
                className="btn btn-sm bg-blue-900 hover:bg-blue-900 border-none"
                onClick={e => {
                  setOpen();
                  setLinkedMessage(true);
                  handleSubmitForm(e);
                }}
              >
                Yes
              </button>
              <button
                className="btn btn-sm bg-blue-900 hover:bg-blue-900 border-none"
                onClick={setOpen}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <input
          type="checkbox"
          id="my_modal_7"
          className="modal-toggle"
          checked={linkedMessage}
        />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Asset Linked</h3>
            <div className=" flex flex-col w-full justify-center items-center">
              <IoCheckmarkDoneCircleOutline className="text-8xl text-green-500" />
              {/* <img src={done} alt="success" className="w-8 h-8 text-green-500" /> */}
              <p className="py-4">
                {selectedAsset.asset_name} has been linked to the QR
              </p>
            </div>
            <div className="flex flex-row justify-center w-full gap-5">
              <button
                className="btn bg-blue-900 hover:bg-blue-900"
                onClick={() => {
                  setLinkedMessage(false);
                  navigate('/home');
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
