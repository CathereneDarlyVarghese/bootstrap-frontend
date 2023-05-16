import React, { useState } from "react";
import "./cardstyles.css";
// import CardRight from "./CardRight";
import CardLeft from "./CardLeft";
import AssetDetails from "../AssetDetails";

import WorkorderForm from "../WorkorderForm";
import AddAssetForm from "../AddAssetForm";

import image from "./image.jpg";
import image2 from "./Images/image2.jpg";
import image3 from "./Images/image.jpg";

const dummyText1 =
  "Lorem ipsum dolor sit amet consectetur. Sed convallis lorem purus imperdiet etiam. Sed pellentesque convallis diam sodales odio eget nec nibh dolor.";

const dummyText2 =
  "Lorem ipsum dolor sit amet consectetur. Sed convallis lorem purus imperdiet etiam. Sed pellentesque convallis diam sodales odio eget nec nibh dolor. rem ipsum dolor sit amet consectetur. Sed convallis";

const dummyText3 =
  "Lorem ipsum dolor sit amet consectetur. Sed convallis lorem purus imperdiet etiam. Sed pellentesque convallis diam sodales odio eget nec nibh dolor. rem ipsum dolor sit amet consectetur. Sed convallis em ipsum dolor sit amet cons em ipsum dolor sit amet cons lor sit amet consectetur. Sed convallis lo";

const AssetDetailsObject1 = {
  cardImage: image,
  cardTitle: "Test Appliance One",
  badgeText: "Appliance",
  DescriptionText: dummyText1,
};
const AssetDetailsObject2 = {
  cardImage: image2,
  cardTitle: "Test Appliance Two",
  badgeText: "Appliance",
  DescriptionText: dummyText2,
};
const AssetDetailsObject3 = {
  cardImage: image3,
  cardTitle: "Test Appliance Three",
  badgeText: "Appliance",
  DescriptionText: dummyText3,
};

const CardLayout = () => {
  const [modalOpen, setModalopen] = useState(false);
  const [formOpen, setFormopen] = useState(false);

  // state from AddAssetForm.tsx
  const [addAssetOpen, setAddAssetOpen] = useState(false);

  // To change right side card content
  const [details, setDetails] = useState(AssetDetailsObject1);

  const handleModalopen = () => {
    setModalopen(true);
  };

  const handleFormopen = () => {
    setFormopen(true);
  };

  const handleAddAssetOpen = () => {
    setAddAssetOpen(true);
  };

  return (
    <div
      className="bg-primary-content"
      style={{
        display: "flex",
        flexDirection: "row",
        // height: "90vh",
      }}
    >
      <div
        className="w-1/3 rounded-xl p-2 overflow-y-auto bg-slate-300"
        id="style-7"
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <input
            type="text"
            placeholder="Search Appliance"
            className="input input-bordered w-4/5 ml-10 p-5 bg-neutral-content placeholder-blue-900 text-black border-blue-900"
          ></input>
          <button
            className="btn w-1/5 mr-10 ml-5 text-sm text-lowercase bg-blue-900 hover:bg-gradient-to-r from-blue-600 to-blue-400 border-none"
            onClick={handleAddAssetOpen}
          >
            +Add
          </button>
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setDetails(AssetDetailsObject1);
          }}
        >
          <CardLeft />
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setDetails(AssetDetailsObject2);
          }}
        >
          <CardLeft />
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setDetails(AssetDetailsObject3);
          }}
        >
          <CardLeft />
        </div>
        <div style={{ cursor: "pointer" }} onClick={handleModalopen}>
          <CardLeft />
        </div>
        <div style={{ cursor: "pointer" }} onClick={handleModalopen}>
          <CardLeft />
        </div>
      </div>
      <div className="w-2/3 mx-10">
        {/* <CardRight /> */}
        <AssetDetails
          openWorkorderForm={handleFormopen}
          cardImage={details.cardImage}
          cardTitle={details.cardTitle}
          badgeText={details.badgeText}
          DescriptionText={details.DescriptionText}
        />
      </div>

      <WorkorderForm
        formOpen={formOpen}
        setFormopen={setFormopen}
        notific={() => {
          console.log("button clicked");
        }}
      />
      <AddAssetForm
        // notific={() => {
        //   console.log("button clicked");
        // }}
        addAssetOpen={addAssetOpen}
        setAddAssetOpen={setAddAssetOpen}
      />
    </div>
  );
};

export default CardLayout;
