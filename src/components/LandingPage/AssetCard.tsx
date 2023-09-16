import React, { useState } from "react";
import PropTypes from "prop-types";

import MapIcon from "../../icons/mapIcon.svg";
import { BsQrCode } from "react-icons/bs";
import { BsCircleFill } from "react-icons/bs";
import DisplayQR from "./DisplayQR";
import { StatusTypes } from "enums";
import {
  BsFillCheckCircleFill,
  BsFillXCircleFill,
  BsInfoCircleFill,
} from "react-icons/bs";
import { IncomingAsset } from "types";

type AssetCardProps = {
  asset: IncomingAsset;
  imagePlaceholder: string;
  updatedDetailsTabIndex: any;
};

const AssetCard: React.FC<AssetCardProps> = (props) => {
  const [showQr, setShowQr] = useState(false);

  const redirectURL = process.env.REACT_APP_REDIRECT_URL;
  const QRLink = props.asset.asset_uuid
    ? `${redirectURL}/home?asset_uuid=${encodeURIComponent(
        props.asset.asset_uuid
      )}`
    : null;

  const handleClick = () => {
    props.updatedDetailsTabIndex(0);
  };

  // Dark mode colors
  const badgeBgColor = "bg-gray-800";

  const assetCardStyle = {
    backgroundColor:
      props.asset.asset_condition === "INACTIVE" ? "#cdcfd1" : "",
    color: props.asset.asset_condition === "INACTIVE" ? "#a3a8a5" : "",
    opacity: props.asset.asset_condition === "INACTIVE" ? 0.3 : 1,
  };

  return (
    <div
      className={`flex flex-row justify-between card card-side w-auto my-3 mx-2 p-5 bg-gray-100 dark:bg-gray-700 
      ${
        props.asset.asset_condition === "INACTIVE"
          ? "bg-[#cdcfd1] dark:bg-[#1f2937] dark:border dark:border-gray-500"
          : "bg-gray-100 dark:bg-gray-700"
      } 
      max-h-40 overflow-hidden hover:border hover:border-blue-900 hover:dark:border-white hide-scrollbar`}
      // style={{ backgroundColor: assetCardStyle.backgroundColor }}
      onClick={handleClick}
    >
      <figure className="rounded-xl">
        <img
          src={props.asset.images_array[0]}
          alt={props.imagePlaceholder}
          className="h-32 w-32"
          style={{ opacity: assetCardStyle.opacity }}
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
            {props.asset.asset_type}
          </button>
          {props.asset.asset_status === StatusTypes.WORKING ? (
            <BsFillCheckCircleFill className="text-2xl text-green-600" />
          ) : props.asset.asset_status === StatusTypes.MAINTENANCE ? (
            <BsInfoCircleFill className="text-2xl text-yellow-600" />
          ) : (
            <BsFillXCircleFill className="text-2xl text-red-700" />
          )}
        </div>
        <h1
          className={`flex ml-2 ${
            props.asset.asset_condition === "INACTIVE"
              ? "text-gray-400 dark:text-gray-600"
              : "text-gray-800 dark:text-white"
          } ${
            props.asset.asset_name.length > 10 ? "text-md" : "text-lg"
          }  font-semibold font-sans tracking-wide xl:text-sm`}
          style={{ wordSpacing: 3 }}
        >
          {props.asset.asset_name}
        </h1>
        <div className="flex flex-row items-center">
          <img
            src={MapIcon}
            alt="Show Asset Inactive Status"
            className="h-6 mr-3 ml-2"
          />
          {/* <PinIcon /> */}
          <p
            className={`text-sm text-start ${
              props.asset.asset_condition === "INACTIVE"
                ? "text-gray-500 dark:text-gray-400"
                : "text-gray-500 dark:text-gray-300"
            }  font-sans font-light tracking-wider xl:text-xs /*truncate*/`}
          >
            {props.asset.location_name === "tsd"
              ? "The Spiffy Dapper"
              : props.asset.location_name === "mdb"
              ? "MadDog Bistro & Bar"
              : props.asset.location_name}
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
            assetName={props.asset.asset_name}
            link={QRLink}
            closeQr={() => {
              setShowQr(false);
            }}
            showQr={showQr}
          />
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
