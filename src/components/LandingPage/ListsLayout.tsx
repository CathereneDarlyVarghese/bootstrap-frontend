import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import "./cardstyles.css";
import CardRight from "./CardRight";
import AssetCard from "./AssetCard";
import AssetDetails from "./AssetDetails";

import WorkorderForm from "./WorkorderForm";
import AddAssetForm from "./AddAssetForm";
import { locationAtom, useSyncedAtom } from "../../store/locationStore";
import image from "./image.jpg";
import image2 from "./Images/image2.jpg";
import image3 from "./Images/image.jpg";
import { Asset } from "types";
import { Auth } from "aws-amplify";
import { getInventory } from "services/apiServices";
import { useSearchParams } from "react-router-dom";
import { useAtom } from "jotai";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [location, setLocation] = useSyncedAtom(locationAtom);
  const [formOpen, setFormopen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetId, setAssetId] = useState<Asset["id"]>(null);

  // state from AddAssetForm.tsx
  const [addAssetOpen, setAddAssetOpen] = useState(false);

  // To change right side card content
  const [details, setDetails] = useState(AssetDetailsObject1);

  //Show submit notification
  const showNotification = () => {
    toast.success("Submitted", { theme: "dark" });
    setFormopen(false);
  };

  const handleModalopen = () => {
    setModalopen(true);
  };

  const handleFormopen = () => {
    setFormopen(true);
  };

  const handleAddAssetOpen = () => {
    setAddAssetOpen(true);
  };
  console.log(location.locationId);
  useEffect(() => {
    const init = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        console.log(userData);
        const assetsData = await getInventory(
          userData.signInUserSession.accessToken.jwtToken
        );
        console.log(assetsData);
        setAssets(assetsData);
      } catch {
        console.log("Not signed in");
      }
    };
    init();
  }, [location]);

  const filteredAssets = useMemo(
    //() => documents.filter((a) => a.location === location),
    () => assets.filter((a) => a.location === location.locationId),
    [assets, location]
  );

  const asset = useMemo(
    () => assets.find((a) => a.id === assetId),
    [assetId, location]
  );

  return (
    <div
      className="bg-primary-content"
      style={{
        display: "flex",
        flexDirection: "row",
        // height: "90vh",
      }}
    >
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
      />
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
        {filteredAssets.map((a) => (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              setAssetId(a.id);
            }}
          >
            <AssetCard
              assetName={a.name}
              assetType={a.type}
              assetAddress={a.location}
              imageLocation={a.imageS3}
            />
          </div>
        ))}
      </div>
      <div className="w-2/3 mx-10">
        {/* <CardRight /> */}
        {asset ? (
          <AssetDetails
            openWorkorderForm={handleFormopen}
            cardImage={asset.imageS3}
            cardTitle={asset.name}
            badgeText={asset.type}
            DescriptionText={asset.name}
          />
        ) : (
          "choose an asset"
        )}
      </div>

      <WorkorderForm
        formOpen={formOpen}
        setFormopen={setFormopen}
        notific={showNotification}
      />
      <AddAssetForm
        notific={showNotification}
        addAssetOpen={addAssetOpen}
        setAddAssetOpen={setAddAssetOpen}
      />
    </div>
  );
};

ListsLayout.propTypes = {
  searchType: PropTypes.string,
};

ListsLayout.defaultProps = {
  searchType: "Item",
};

export default ListsLayout;
