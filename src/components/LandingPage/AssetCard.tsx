import React from "react";
import PropTypes from "prop-types";

import MapIcon from "../../icons/mapIcon.svg";
import { AiFillExclamationCircle } from "react-icons/ai";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { BsFillXCircleFill } from "react-icons/bs";
import { StatusTypes } from "enums";

let status = "expire_soon";

type AssetCardProps = {
  assetName: string;
  assetType: string;
  assetAddress: string;
  imageLocation: string;
  status: string;
  imagePlaceholder: string;
};

const AssetCard: React.FC<AssetCardProps> = (props) => {
  const getStatusText = (status: string | null) => {
    switch (status) {
      case StatusTypes.ACTIVE:
        return "Active";
      case StatusTypes.INACTIVE:
        return "Inactive";
      case StatusTypes.MAINTENANCE:
        return "Maintenance";
      default:
        return "";
    }
  };
  return (
    <div className="flex flex-row justify-between card card-side w-auto my-3 p-5 bg-gray-100 max-h-40 overflow-hidden hover:border hover:border-blue-900 hide-scrollbar">
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
          <button className="badge w-fit bg-gray-200 text-blue-700 font-semibold font-sans capitalize border-white border-none mr-auto ml-1 p-4 text-md xl:text-xs">
            {props.assetType}
          </button>
          {props.status === StatusTypes.ACTIVE ? (
            <>
              <BsFillCheckCircleFill className="text-2xl text-green-600" />
            </>
          ) : props.status === StatusTypes.MAINTENANCE ? (
            <>
              <AiFillExclamationCircle className="text-2xl text-yellow-600" />
            </>
          ) : (
            <>
              <BsFillXCircleFill className="text-2xl text-red-700" />
            </>
          )}
        </div>

        <h1
          className="flex ml-2 text-gray-800 text-lg font-semibold font-sans tracking-wide xl:text-sm"
          style={{ wordSpacing: 3 }}
        >
          {props.assetName}
        </h1>
        <div className="flex flex-row items-center">
          <img src={MapIcon} className="h-6 mr-3 ml-2" />
          {/* <PinIcon /> */}
          <p className="text-sm text-start text-gray-500 font-sans font-light tracking-wider xl:text-xs /*truncate*/">
            {props.assetAddress === "tsd"
              ? "The Spiffy Dapper"
              : props.assetAddress === "mdb"
              ? "MadDog Bistro & Bar"
              : props.assetAddress}
          </p>
        </div>
      </div>
    </div>
  );
};

AssetCard.propTypes = {
  assetName: PropTypes.string,
  assetType: PropTypes.string,
  assetAddress: PropTypes.string,
  imageLocation: PropTypes.string,
  imagePlaceholder: PropTypes.string,
};

AssetCard.defaultProps = {
  assetName: "assetName",
  assetType: "assetType",
  assetAddress: "assetAddress",
  imagePlaceholder: "imagePlaceholder",
};

export default AssetCard;
