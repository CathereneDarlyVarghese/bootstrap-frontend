import React from "react";

const WorkorderButton = ({ title, workPending }) => {
  return (
    <button className="btn btn-primary gap-5 ml-auto">
      {title}
      <div className={`${workPending ? "badge badge-error" : ""}`}>
        {workPending ? "pending" : ""}
      </div>
    </button>
  );
};

export default WorkorderButton;
