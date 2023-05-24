import React from "react";
import PropTypes from "prop-types";

import PinIcon from "components/widgets/PinIcon";
import MapIcon from "../../icons/XMLID_214_.svg";

const AssetCard = (props: any) => {
  return (
    <div
      className="flex flex-row justify-between card card-side w-auto my-3 p-5 bg-gray-100 max-h-40 overflow-hidden hover:border hover:border-blue-900 hide-scrollbar"
      // id="style-7"
    >
      <figure className="rounded-xl">
        <img
          src={props.imageLocation}
          alt={props.imagePlaceholder}
          className="h-32"
        />
      </figure>
      <div
        className="card-body overflow-auto px-0 py-0 ml-2 w-11/12"
        id="style-7"
      >
        <div className="flex flex-row-reverse">
          <button className="badge w-20 bg-gray-200 text-blue-700 font-bold capitalize border-white border-none p-3 mr-auto ml-1">
            {props.assetType}
          </button>
        </div>
        <h1 className="flex ml-2 text-gray-800 text-lg font-bold font-sans">
          {props.assetName}
        </h1>
        <div className="flex flex-row items-center">
          <img src={MapIcon} className="h-6 mr-3 ml-2" />
          {/* <PinIcon /> */}
          <p className="text-sm text-start text-gray-500 /*truncate*/">
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
