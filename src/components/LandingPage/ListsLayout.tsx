import React, { useState } from "react";
import PropTypes from 'prop-types'
import "./cardstyles.css";
import CardRight from "./CardRight";
import AssetCard from "./AssetCard";
import AssetDetails from "./AssetDetails";

import WorkorderForm from "./WorkorderForm";
import AddAssetForm from "./AddAssetForm";

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

const ListsLayout = (props: any) => {
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
            placeholder={"Search " + props.searchType}
            className="input input-bordered w-4/5 ml-10 p-5 bg-neutral-content placeholder-blue-900 text-black border-blue-900"
          ></input>
          <button
            className="btn w-20 h-fit mr-10 ml-5 text-sm text-lowercase bg-blue-900 hover:bg-gradient-to-r from-blue-600 to-blue-400 border-none"
            onClick={handleAddAssetOpen}
          >
            {"+ Add " + props.searchType}
          </button>
        </div>

        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setDetails(AssetDetailsObject1);
          }}
        >
          <AssetCard assetName="Dough Mixer" assetType="Appliance" assetAddress="Santacruz, Mumbai, Maharashtra, India - 400055" imageLocation="https://images.pexels.com/photos/1450903/pexels-photo-1450903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setDetails(AssetDetailsObject2);
          }}
        >
          <AssetCard assetName="Electric Iron" assetType="Appliance" assetAddress="Pollich Spur, West Gerardo, North Carolina, USA - 69209" imageLocation="https://images.pexels.com/photos/53422/ironing-iron-press-clothing-53422.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setDetails(AssetDetailsObject3);
          }}
        >
          <AssetCard assetName="Dishwasher" assetType="Appliance" assetAddress="Taylor Stream, Poppystad, Powellhaven, UK - 690" imageLocation="https://images.pexels.com/photos/3829549/pexels-photo-3829549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
        </div>
        <div style={{ cursor: "pointer" }} onClick={handleModalopen}>
          <AssetCard assetName="Electric Kettle" assetType="Appliance" assetAddress="Gernot-Geisler-Straße, Flörsheim am Main, Bayern, Germany - 36" imageLocation="https://images.pexels.com/photos/1921673/pexels-photo-1921673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
        </div>
        <div style={{ cursor: "pointer" }} onClick={handleModalopen}>
          <AssetCard assetName="Microwave Oven" assetType="Appliance" assetAddress="36608 - شرورة ,الخبر ,طريق عبد السميع المنيف" imageLocation="https://images.pexels.com/photos/8266851/pexels-photo-8266851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
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

      <WorkorderForm formOpen={formOpen} setFormopen={setFormopen} />
      <AddAssetForm
        addAssetOpen={addAssetOpen}
        setAddAssetOpen={setAddAssetOpen}
      />
    </div>
  );
};

ListsLayout.propTypes = {
  searchType: PropTypes.string
}

ListsLayout.defaultProps = {
  searchType: "Item"
}

export default ListsLayout;
