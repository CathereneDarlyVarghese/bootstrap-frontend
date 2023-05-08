import React from "react";
import './cardstyles.css';
import CardRight from "./CardRight";
import CardLeft from "./CardLeft";

const CardLayout = () => {
  return (
    <div
      className="bg-primary-content"
      style={{
        display: "flex",
        flexDirection: "row",
        height: "90vh",
      }}
    >
      <div className="w-1/3 h-full rounded-xl p-2 overflow-y-auto bg-slate-300" id="style-7">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <input
            type="text"
            placeholder="Search Appliance"
            className="input input-bordered w-4/5 ml-10 p-5 bg-neutral-content placeholder-blue-900 text-black border-blue-900"
          ></input>
          <button className="btn w-1/5 mr-10 ml-5 text-sm text-lowercase bg-blue-900 hover:bg-gradient-to-r from-blue-600 to-blue-400 border-none">
            +Add
          </button>
        </div>

        <CardLeft/>
        <CardLeft/>
        <CardLeft/>
        <CardLeft/>
        <CardLeft/>
      </div>
      <div className="w-2/3 mx-10">
        <CardRight/>
      </div>
    </div>
  );
};

export default CardLayout;
