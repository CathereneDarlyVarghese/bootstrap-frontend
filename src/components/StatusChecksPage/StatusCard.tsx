import React from "react";
import PropTypes from "prop-types";

import MapIcon from "../../icons/mapIcon.svg";
import { AiFillExclamationCircle } from "react-icons/ai";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { BsFillXCircleFill } from "react-icons/bs";

let status = "expire_soon";

type StatusCardProps = {
  assetName: string;
  assetType: string;
  assetAddress: string;
  imageLocation: string;
  status: string;
  imagePlaceholder: string;
};

const StatusCard: React.FC<StatusCardProps> = (props) => {
  return (
    <div className="flex flex-row justify-between card card-side w-auto my-3 p-5 bg-gray-100 max-h-40 hover:border hover:border-blue-900 hide-scrollbar overflow-y-hidden overflow-hidden">
      <div
        className="card-body overflow-auto px-0 py-0 w-11/12 overflow-hidden"
        id="style-7"
      >
        <div className="flex flex-row justify-between">
          <h1
            className="flex text-gray-800 text-lg font-semibold font-sans tracking-wide xl:text-sm"
            style={{ wordSpacing: 3 }}
          >
            {props.assetName}
          </h1>
          {props.status === "valid" ? (
            <div>
              <BsFillCheckCircleFill className="text-2xl text-green-600" />
            </div>
          ) : status === "expire_soon" ? (
            <AiFillExclamationCircle className="text-2xl text-yellow-600" />
          ) : (
            <BsFillXCircleFill className="text-2xl text-red-700" />
          )}
        </div>

        <div className="flex flex-row items-center">
          <p className="text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
            in nunc quis eros ultricies auctor ut non metus. In mollis iaculis
            justo. Maecenas convallis libero non purus euismod, quis malesuada
            elit posuere.
          </p>
        </div>
      </div>
    </div>
  );
};

StatusCard.propTypes = {
  assetName: PropTypes.string,
  assetType: PropTypes.string,
  assetAddress: PropTypes.string,
  imageLocation: PropTypes.string,
  imagePlaceholder: PropTypes.string,
};

StatusCard.defaultProps = {
  assetName: "assetName",
  assetType: "assetType",
  assetAddress: "assetAddress",
  imagePlaceholder: "imagePlaceholder",
};

export default StatusCard;
