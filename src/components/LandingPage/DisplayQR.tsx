import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { useRef } from "react";

const DisplayQR = ({
  showQr, closeQr, assetName, link,
}) => {
  const qrCodeRef = useRef(null);

  const handleDownload = () => {
    const qrCodeElement = qrCodeRef.current;

    html2canvas(qrCodeElement).then((canvas) => {
      const imageURL = canvas.toDataURL("image/png");

      const linkNW = document.createElement("a");
      linkNW.href = imageURL;
      linkNW.download = `QR_Code_${assetName}.png`;
      linkNW.click();
    });
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
          {/* display QR here */}
          <div className="flex flex-col gap-5 mx-auto p-8" ref={qrCodeRef}>
            <h3 className="font-bold text-lg place-self-center p-2">
              QR Code: {assetName}
            </h3>
            <QRCode value={link} level="H" className="place-self-center" />
          </div>
          <div className="flex flex-row justify-center gap-3">
            <button
              className="btn btn-sm bg-blue-900 hover:bg-blue-900"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
            >
              Download
            </button>
            <button
              className="btn btn-sm bg-blue-900 hover:bg-blue-900"
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
