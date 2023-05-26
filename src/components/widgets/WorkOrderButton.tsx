import React from "react";

interface ButtonProps {
  title: string;
  primary: boolean;
  onClick: () => void;
}

const WorkOrderButton = ({
  title,
  workPending,
  onClick,
  buttonColor,
  hoverColor,
}) => {
  return (
    <button
      onClick={onClick}
      className={`btn ${buttonColor} gap-5 ${hoverColor}  capitalize`}
    >
      {title}
      <div className={`${workPending ? "badge badge-error" : "hidden"}`}>
        {workPending ? "pending" : ""}
      </div>
    </button>
  );
};

export default WorkOrderButton;
