import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { useRef, useState, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateAsset } from "services/assetServices";
import { toast } from "react-toastify";
import { AssetCondition } from "../../enums";
import { useNavigate } from "react-router";

const DisplayQR = ({ showQr, closeQr, asset, link }) => {
  const qrCodeRef = useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [token, setToken] = useState<string>("");

  const handleDownload = () => {
    const qrCodeElement = qrCodeRef.current;

    html2canvas(qrCodeElement).then((canvas) => {
      const imageURL = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = imageURL;
      link.download = `QR_Code_${asset.asset_name}.png`;
      link.click();
    });
  };

  useEffect(() => {
    const data = window.localStorage.getItem("sessionToken");
    setToken(data);
  }, []);

  var {
    asset_type,
    location_name,
    placement_name,
    section_name,
    images_array,
    next_asset_check_date,
    ...updatedAsset
  } = asset;

  const assetUpdateMutation = useMutation({
    mutationFn: (updatedAsset: any) =>
      updateAsset(token, updatedAsset.asset_id, updatedAsset),
    onSettled: () => {},
    onSuccess: () => {
      toast.success("Asset's QR Code Unlinked Successfully!");
      queryClient.invalidateQueries(["query-asset"]);
    },
    onError: (err: any) => {
      toast.error("Failed to Unlink QR Code from Asset");
    },
  });

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    try {
      updatedAsset.asset_condition = AssetCondition[asset.asset_condition];

      updatedAsset.asset_uuid = null;

      console.log("Submitting Asset ==>> ", updatedAsset);
      assetUpdateMutation.mutateAsync(updatedAsset);
    } catch (error) {
      console.error("Failed to update asset:", error);
    }
  };

  return (
    <div>
      <input
        type="checkbox"
        checked={showQr}
        id="my_modal_6"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box">
          {link ? (
            <div className="flex flex-col gap-5 mx-auto p-8" ref={qrCodeRef}>
              <h3 className="font-bold text-lg place-self-center p-2">
                QR Code: {asset.asset_name}
              </h3>
              <QRCode value={link} level="H" className="place-self-center" />
            </div>
          ) : (
            <div className="flex flex-col gap-5 text-center p-8 text-xl text-slate-400">
              <p>No QR code has been linked to this Asset</p>
            </div>
          )}
          <div className="flex flex-row justify-center gap-3">
            {link && (
              <>
                <button
                  className="btn btn-sm bg-blue-900 hover:bg-blue-900 border-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                >
                  Download
                </button>
                <button
                  className="btn btn-sm bg-blue-900 hover:bg-blue-900 border-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeQr();
                    navigate("/scan");
                  }}
                >
                  Update QR
                </button>
                <button
                  type="submit"
                  className="btn btn-sm bg-red-700 hover:bg-red-700 border-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    const confirmed = window.confirm(
                      "Are you sure you want to unlink the QR from this asset?"
                    );
                    if (confirmed) {
                      handleSubmitForm(e);
                      closeQr();
                    }
                  }}
                >
                  Unlink QR
                </button>
              </>
            )}
            {!asset.asset_uuid && (
              <button
                className="btn btn-sm bg-blue-900 hover:bg-blue-900 border-none"
                onClick={(e) => {
                  e.stopPropagation();
                  closeQr();
                  navigate("/scan");
                }}
              >
                Link QR
              </button>
            )}
            <button
              className="btn btn-sm bg-blue-900 hover:bg-blue-900 border-none"
              onClick={(e) => {
                e.stopPropagation();
                closeQr();
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayQR;
