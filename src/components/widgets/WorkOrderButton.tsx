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
      className={`btn ${buttonColor} gap-5 ml-auto ${hoverColor} pr-1`}
    >
      {title}
      <div className={`${workPending ? "badge badge-error" : ""}`}>
        {workPending ? "pending" : ""}
      </div>
    </button>
  );
};

export default WorkOrderButton;
