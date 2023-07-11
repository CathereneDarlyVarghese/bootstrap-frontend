import React from "react";
import PropTypes from "prop-types";
import { AiFillExclamationCircle } from "react-icons/ai";
import { BsFillCheckCircleFill, BsFillXCircleFill } from "react-icons/bs";

interface StatusCardProps {
  status: string;
  date: Date;
  uptime_notes: string;
  onClick: () => void;
}

const StatusCard: React.FC<StatusCardProps> = ({
  status,
  date,
  uptime_notes,
  onClick,
}) => {
  const formattedDate = date.toLocaleDateString();
  return (
    <div
      className="flex flex-row justify-between card card-side w-auto my-3 p-5 bg-gray-100 max-h-40 border hover:border hover:border-blue-900 dark:border-gray-600 hover:dark:border-gray-400 dark:bg-gray-800 hide-scrollbar overflow-y-hidden overflow-hidden"
      onClick={onClick}
    >
      <div className="card-body overflow-auto px-0 py-0 w-11/12 overflow-hidden">
        <div className="flex flex-row justify-between">
          <h1
            className="flex text-gray-800 dark:text-white text-lg font-semibold font-sans tracking-wide xl:text-sm"
            style={{ wordSpacing: 3 }}
          >
            {formattedDate}
          </h1>
          <div className="flex items-center">
            {status === "DOWN" && (
              <AiFillExclamationCircle className="text-red-500 text-xl mr-2" />
            )}
            {status === "WORKING" && (
              <BsFillCheckCircleFill className="text-green-500 text-xl mr-2" />
            )}
            {status === "UNDER MAINTENANCE" && (
              <BsFillXCircleFill className="text-gray-500 text-xl mr-2" />
            )}
          </div>
        </div>
        <div className="flex flex-row items-center">
          {/* <p className="text-gray-500 dark:text-gray-400">{uptime_notes}</p> */}
        </div>
      </div>
    </div>
  );
};

StatusCard.propTypes = {
  status: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default StatusCard;
