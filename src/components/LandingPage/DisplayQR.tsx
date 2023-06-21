import React from "react";

const DisplayQR = ({ showQr, closeQr, assetName }) => {



    return (
        <div>
            <input type="checkbox" checked={showQr} id="my_modal_6" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <div className="flex flex-col gap-5">
                        <h3 className="font-bold text-lg">QR Code : {assetName}</h3>
                        {/* display QR here */}
                        <div className="mx-auto">
                            <img src="https://randomqr.com/assets/images/randomqr-256.png" alt="qr code img" />
                        </div>
                        <div className="flex flex-row gap-3 mx-auto">
                            <button className="btn btn-sm bg-blue-900 hover:bg-blue-900">Download</button>
                            <button className="btn btn-sm bg-blue-900 hover:bg-blue-900" onClick={closeQr}>Close</button>
                        </div>

                    </div>


                </div>
            </div>
        </div>
    )
}

export default DisplayQR;