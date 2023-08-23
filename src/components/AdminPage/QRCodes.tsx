import React, { useState } from "react";

type QRCodesProps = {
  someProp?: string;
  anotherProp?: number;
};

const QRCodes: React.FC<QRCodesProps> = (props) => {
  const [qrOptions, setQrOptions] = useState(0);

  return (
    <div>
      <div className="flex flex-col gap-5 items-center justify-center p-5">
        <button className="btn bg-blue-900 hover:bg-blue-900 w-64">
          Print All QR Codes
        </button>
        <button
          className="btn bg-blue-900 hover:bg-blue-900 w-64"
          onClick={() => {
            setQrOptions(1);
          }}
        >
          Select QR Codes to print
        </button>
      </div>
      <div>
        {qrOptions === 1 && (
          <div className="flex flex-col items-center">
            {/* Map asset names inside this */}
            <label className="label cursor-pointer w-3/12">
              <span className="label-text">Dishwasher</span>
              <input type="checkbox" className="checkbox" />
            </label>
            <label className="label cursor-pointer w-3/12">
              <span className="label-text">Automatic Espresso Machine</span>
              <input type="checkbox" className="checkbox" />
            </label>
            <label className="label cursor-pointer w-3/12">
              <span className="label-text">Oven</span>
              <input type="checkbox" className="checkbox " />
            </label>
            <label className="label cursor-pointer w-3/12">
              <span className="label-text">Oven</span>
              <input type="checkbox" className="checkbox " />
            </label>
            {/* Map asset names inside this */}
            <div className="flex flex-row gap-2">
              <button
                className="btn btn-sm capitalize bg-blue-900 hover:bg-blue-900 w-fit flex flex-row justify-start"
                onClick={() => {
                  setQrOptions(0);
                }}
              >
                Clear Selection
              </button>
              <button className="btn btn-sm capitalize bg-blue-900 hover:bg-blue-900 w-fit flex flex-row justify-start">
                Print
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodes;
