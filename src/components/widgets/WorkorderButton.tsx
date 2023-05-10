import React from "react";

interface ButtonProps {
  title: string;
  primary: boolean;
  onClick: () => void;
}

const WorkorderButton = ({ title, workPending, onClick }) => {
  return (
    <button onClick={onClick} className="btn btn-primary gap-5 ml-auto">
      {title}
      <div className={`${workPending ? "badge badge-error" : ""}`}>
        {workPending ? "pending" : ""}
      </div>
    </button>
  );
};

export default WorkorderButton;
