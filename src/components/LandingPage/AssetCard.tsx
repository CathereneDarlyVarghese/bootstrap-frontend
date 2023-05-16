import React from "react";
import PropTypes from 'prop-types';

import PinIcon from "components/widgets/PinIcon";

const AssetCard = (props: any) => {
  return (
    <div className="flex flex-row justify-between card card-side border border-blue-900 w-auto my-2 mx-2 p-5 bg-slate-100 max-h-48 overflow-y-auto" id="style-7">
      <figure>
        <img src={props.imageLocation} alt={props.imagePlaceholder} className="rounded-xl h-32" />
      </figure>
      <div className="card-body overflow-auto px-0 py-0 ml-2 w-11/12" id="style-7">
        <div className="flex flex-row-reverse">
          <button className="btn btn-xs btn-primary w-20 bg-blue-900 border-white hover:bg-gradient-to-r from-blue-600 to-blue-400 border-none">{props.assetType}</button>
        </div>
        <h1 className="flex flex-row-reverse text-blue-900 text-lg font-bold">{props.assetName}</h1>
        <div className="flex flex-row items-start">
          <PinIcon />
          <p className="text-sm text-start /*truncate*/">
            {props.assetAddress}
          </p>
        </div>
      </div>
    </div>
  )
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
}

export default AssetCard;
