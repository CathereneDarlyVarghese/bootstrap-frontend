import React, { useState, useEffect } from "react";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateAsset } from "services/assetServices";
import { toast } from "react-toastify";
import { AssetCondition } from "../../enums";

const ConfirmModal = ({
  linkedAsset,
  selectedAsset,
  assetUUID,
  open,
  setOpen,
}) => {
  var {
    asset_type,
    location_name,
    placement_name,
    section_name,
    images_array,
    next_asset_check_date,
    ...updatedAsset
  } = selectedAsset;

  console.log("Selected Asset ==>> ", selectedAsset);
  console.log("Linked Asset ==>> ", linkedAsset);

  var toBeUnlinkedAsset = null;

  if (linkedAsset) {
    var {
      asset_type,
      location_name,
      placement_name,
      section_name,
      images_array,
      next_asset_check_date,
      ...rest
    } = linkedAsset;

    toBeUnlinkedAsset = rest;
  }

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [linkedMessage, setLinkedMessage] = useState(false);
  const [token, setToken] = useState<string>("");

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    try {
      updatedAsset.asset_condition =
        AssetCondition[selectedAsset.asset_condition];

      updatedAsset.asset_uuid = assetUUID;

      if (toBeUnlinkedAsset) {
        toBeUnlinkedAsset.asset_condition =
          AssetCondition[linkedAsset.asset_condition];

        toBeUnlinkedAsset.asset_uuid = null;

        console.log("Unlinked Asset ==>> ", toBeUnlinkedAsset);
        assetUpdateMutation.mutateAsync(toBeUnlinkedAsset);
      }

      console.log("Submitting Asset ==>> ", updatedAsset);
      assetUpdateMutation.mutateAsync(updatedAsset);
    } catch (error) {
      console.error("Failed to update asset:", error);
    }
  };

  const assetUpdateMutation = useMutation({
    mutationFn: (updatedAsset: any) =>
      updateAsset(token, updatedAsset.asset_id, updatedAsset),
    onSettled: () => {},
    onSuccess: () => {
      toast.success("Asset's QR Updated Successfully");
      queryClient.invalidateQueries(["query-asset"]);
    },
    onError: (err: any) => {
      toast.error("Failed to update asset");
    },
  });

  useEffect(() => {
    const data = window.localStorage.getItem("sessionToken");
    setToken(data);
  }, []);

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
                Do you want to link the asset,{" "}
                <strong>{selectedAsset.asset_name}</strong> to this unassigned
                QR Code?
              </p>
            ) : (
              <p>
                Do you want to <strong>UPDATE</strong> the asset,{" "}
                <strong>{selectedAsset.asset_name}</strong>'s existing QR Code
                with this one?
              </p>
            )}
            <div className="flex flex-row justify-center w-full gap-5">
              <button
                type="submit"
                className="btn btn-sm bg-blue-900 hover:bg-blue-900 border-none"
                onClick={(e) => {
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
                  navigate("/home");
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
