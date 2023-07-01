import React, { useState } from "react";
import PropTypes from "prop-types";

import MapIcon from "../../icons/mapIcon.svg";
import { AiFillExclamationCircle } from "react-icons/ai";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { BsFillXCircleFill } from "react-icons/bs";
import { BsQrCode } from "react-icons/bs";
import { BsCircleFill } from "react-icons/bs";
import DisplayQR from "./DisplayQR";
import { AssetCondition, StatusTypes } from "enums";

let status = "expire_soon";

type AssetCardProps = {
  assetName: string;
  assetType: string;
  assetAddress: string;
  imageLocation: string;
  status: string;
  assetCondition: string;
  imagePlaceholder: string;
  updatedDetailsTabIndex: any;
};

const AssetCard: React.FC<AssetCardProps> = (props) => {
  const [showQr, setShowQr] = useState(false);
  const getStatusText = (status: string | null) => {
    switch (status) {
      case StatusTypes.WORKING:
        return "WORKING";
      case StatusTypes.DOWN:
        return "DOWN";
      case StatusTypes.MAINTENANCE:
        return "Maintenance";
      default:
        return "";
    }
  };

  const redirectURL = process.env.REACT_APP_REDIRECT_URL;
  const QRLink = `${redirectURL}/home?search=${encodeURIComponent(
    props.assetName
  )}`;

  const handleClick = () => {
    props.updatedDetailsTabIndex(0);
  };

  // Dark mode colors
  const assetCarBgColor = "bg-gray-700";
  const badgeBgColor = "bg-gray-800";
  const textColor = "text-white";
  const locationColor = "bg-gray-100";

  const assetCardStyle = {
    backgroundColor: props.assetCondition === "INACTIVE" ? "gray" : "",
    color: props.assetCondition === "INACTIVE" ? "#a3a8a5" : ""
  };

  return (
    <div
      className={`flex flex-row justify-between card card-side w-auto my-3 p-5 bg-gray-100 dark:bg-gray-700 ${props.assetCondition === "INACTIVE" ? "bg-gray-500 dark:bg-gray-500" : "bg-gray-100 dark:bg-gray-700"} max-h-40 overflow-hidden hover:border hover:border-blue-900 hover:dark:border-white hide-scrollbar`}
      // style={{ backgroundColor: assetCardStyle.backgroundColor }}
      onClick={handleClick}
    >
      <figure className="rounded-xl">
        <img
          src={props.imageLocation}
          alt={props.imagePlaceholder}
          className="h-32 w-32"
        />
      </figure>
      <div
        className="card-body overflow-auto px-0 py-0 ml-2 w-11/12"
        id="style-7"
      >
        <div className="flex flex-row">
          <button
            className={`badge w-fit bg-gray-200 dark:${badgeBgColor} text-blue-700 dark:text-blue-500 font-semibold font-sans capitalize border-white border-none mr-auto ml-1 p-4 text-md xl:text-xs`}
          >
            {props.assetType}
          </button>
          {props.status === StatusTypes.WORKING ? (
            <BsCircleFill className="text-2xl text-green-600" />
          ) : props.status === StatusTypes.MAINTENANCE ? (
            <BsCircleFill className="text-2xl text-yellow-600" />
          ) : (
            <BsCircleFill className="text-2xl text-red-700" />
          )}
        </div>
        <h1
          className={`flex ml-2 ${props.assetCondition === "INACTIVE" ? "text-gray-400 dark:text-gray-400" : "text-gray-800 dark:text-white"} ${props.assetName.length > 10 ? "text-md" : "text-lg"}  font-semibold font-sans tracking-wide xl:text-sm`}
          style={{ wordSpacing: 3 }}
        >
          {props.assetName}
        </h1>
        <div className="flex flex-row items-center">
          <img src={MapIcon} className="h-6 mr-3 ml-2" />
          {/* <PinIcon /> */}
          <p
            className={`text-sm text-start text-gray-500 dark:text-gray-300 font-sans font-light tracking-wider xl:text-xs /*truncate*/`}
          >
            {props.assetAddress === "tsd"
              ? "The Spiffy Dapper"
              : props.assetAddress === "mdb"
                ? "MadDog Bistro & Bar"
                : props.assetAddress}
          </p>
          <button
            onClick={(e) => {
              setShowQr(true);
              e.stopPropagation();
            }}
          >
            <BsQrCode className="text-xl text-black dark:text-white" />
          </button>

          <DisplayQR
            assetName={props.assetName}
            link={QRLink}
            closeQr={() => {
              setShowQr(false)

            }}
            showQr={showQr}
          />
        </div>

        {/* <div className="flex items-center">
          {props.assetCondition === "INACTIVE" ? (
            <span className="text-sm text-red-500 mr-2">Inactive</span>
          ) : (
            <span className="text-sm text-green-500 mr-2">Active</span>
          )}
        </div> */}
      </div>
    </div>
  );
};

AssetCard.propTypes = {
  assetName: PropTypes.string,
  assetType: PropTypes.string,
  assetAddress: PropTypes.string,
  imageLocation: PropTypes.string,
  assetCondition: PropTypes.string,
  imagePlaceholder: PropTypes.string,
};

AssetCard.defaultProps = {
  assetName: "assetName",
  assetType: "assetType",
  assetAddress: "assetAddress",
  imagePlaceholder: "imagePlaceholder",
};

export default AssetCard;
