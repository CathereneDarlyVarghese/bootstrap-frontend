import React, { useState, useEffect } from "react";
import { TfiClose } from "react-icons/tfi";
import { Auth } from "aws-amplify";
import { getAssetPlacements } from "services/assetPlacementServices";
import { useLocation } from "react-router-dom";

const FilterOptions = ({ filterClose, sections, placements }) => {
  const [selectedButtonsStatus, setSelectedButtonsStatus] = useState([]);
  const [selectedButtonsSection, setSelectedButtonsSection] = useState([]);
  const [selectedButtonsPlacement, setSelectedButtonsPlacement] = useState([]);

  const [selectedSectionNames, setSelectedSectionNames] = useState([]);
  const [selectedPlacementNames, setSelectedPlacementNames] = useState([]);

  const filterButtonsStatus = [
    { title: "Working", info: "" },
    { title: "Down", info: "" },
    { title: "Maintenance", info: "" },
  ];

  const handleReset = () => {
    setSelectedButtonsStatus([]);
    setSelectedButtonsPlacement([]);
    setSelectedButtonsSection([]);

    setSelectedSectionNames([]);
    setSelectedPlacementNames([]);

    clearQueryParams();
  };

  const handleStatusClick = (buttonIndex) => {
    if (selectedButtonsStatus.includes(buttonIndex)) {
      setSelectedButtonsStatus(
        selectedButtonsStatus.filter((index) => index !== buttonIndex)
      );
    } else {
      setSelectedButtonsStatus([...selectedButtonsStatus, buttonIndex]);
    }
  };

  const clearQueryParams = () => {
    const urlWithoutParams = window.location.origin + window.location.pathname;
    window.history.pushState(null, "", urlWithoutParams);
  };

  const updateURL = () => {
    const sectionNamesParam = selectedSectionNames.join(",");
    const placementNamesParam = selectedPlacementNames.join(",");
    const queryString = `?sectionNames=${encodeURIComponent(sectionNamesParam)}&placementNames=${encodeURIComponent(placementNamesParam)}`;
    window.history.pushState(null, "", queryString);
  };

  useEffect(() => {
    updateURL();

    if (selectedSectionNames.length === 0 && selectedPlacementNames.length === 0) {
      clearQueryParams();
    }
  }, [selectedSectionNames, selectedPlacementNames]);

  const handleSectionClick = (buttonIndex) => {
    if (buttonIndex === -1) {
      if (selectedButtonsSection.includes(-1)) {
        // If "All" button is already selected, unselect it and all other buttons
        setSelectedButtonsSection([]);
        setSelectedSectionNames([]);
      } else {
        // If "All" button is not selected, select it and all other buttons
        const allIndices = [];
        for (let i = 0; i < sections.length; i++) {
          allIndices.push(i);
        }
        setSelectedButtonsSection([-1, ...allIndices]);
        setSelectedSectionNames(sections.map((section) => section.section_name));
      }
    } else {
      if (selectedButtonsSection.includes(buttonIndex)) {
        setSelectedButtonsSection(
          selectedButtonsSection.filter((index) => index !== buttonIndex)
        );
        setSelectedSectionNames(
          selectedSectionNames.filter(
            (sectionName) => sectionName !== sections[buttonIndex].section_name
          )
        );
      } else {
        setSelectedButtonsSection([...selectedButtonsSection, buttonIndex]);
        setSelectedSectionNames([
          ...selectedSectionNames,
          sections[buttonIndex].section_name,
        ]);
      }
    }
  };

  const handlePlacementClick = (buttonIndex) => {
    if (buttonIndex === -1) {
      if (selectedButtonsPlacement.includes(-1)) {
        // If "All" button is already selected, unselect it and all other buttons
        setSelectedButtonsPlacement([]);
        setSelectedPlacementNames([]);
      } else {
        // If "All" button is not selected, select it and all other buttons
        const allIndices = [];
        for (let i = 0; i < placements.length; i++) {
          allIndices.push(i);
        }
        setSelectedButtonsPlacement([-1, ...allIndices]);
        setSelectedPlacementNames(
          placements.map((placement) => placement.placement_name)
        );
      }
    } else {
      if (selectedButtonsPlacement.includes(buttonIndex)) {
        setSelectedButtonsPlacement(
          selectedButtonsPlacement.filter((index) => index !== buttonIndex)
        );
        setSelectedPlacementNames(
          selectedPlacementNames.filter(
            (placementName) =>
              placementName !== placements[buttonIndex].placement_name
          )
        );
      } else {
        setSelectedButtonsPlacement([...selectedButtonsPlacement, buttonIndex]);
        setSelectedPlacementNames([
          ...selectedPlacementNames,
          placements[buttonIndex].placement_name,
        ]);
      }
    }
  };

  useEffect(() => {
    const getPlacements = async () => {
      try {
        if (selectedButtonsPlacement.length === 0) {
          const userData = await Auth.currentAuthenticatedUser();

          const fetchedPlacements = await getAssetPlacements(
            userData.signInUserSession.accessToken.jwtToken
          );

          console.log("Fetched Placements", fetchedPlacements, placements);

          if (placements.length === 0) {
            placements = fetchedPlacements;
          }
        }
      } catch (error) {}
    };
    getPlacements();
  }, []);

  return (
    <div className="p-2">
      <div className="flex flex-row">
        <h1 className="font-sans font-semibold">Fitler and Sort</h1>
        <div className="flex flex-row gap-2 ml-auto">
          <button className="btn btn-sm bg-blue-900 hover:bg-blue-900 font-normal px-4 font-sans rounded-full capitalize ml-auto">
            Done
          </button>
          <button
            className="btn btn-sm bg-blue-900 hover:bg-blue-900 font-normal px-4 font-sans rounded-full capitalize ml-auto"
            onClick={handleReset}
          >
            Reset
          </button>
          <button onClick={filterClose}>
            <TfiClose className="text-blue-700 ml-2" />
          </button>
        </div>
      </div>
      <div className="my-3">
        <h1 className="font-sans">Status</h1>
        <button
          className={`btn btn-sm text-blue-700 font-normal capitalize font-sans ${
            selectedButtonsStatus.includes(-1)
              ? "bg-blue-200 hover:bg-blue-200"
              : "bg-white hover:bg-white"
          } border-blue-500 hover:border-blue-500 rounded-full m-1`}
          onClick={() => handleStatusClick(-1)}
        >
          All
        </button>
        {filterButtonsStatus.map((button, index) => (
          <button
            className={`btn btn-sm text-blue-700 font-normal capitalize font-sans ${
              selectedButtonsStatus.includes(index)
                ? "bg-blue-200 hover:bg-blue-200"
                : "bg-white hover:bg-white"
            } border-blue-500 hover:border-blue-500 rounded-full m-1`}
            onClick={() => handleStatusClick(index)}
          >
            {button.title}
          </button>
        ))}
      </div>
      <div className="my-3">
        <h1 className="font-sans">Section</h1>
        <button
          className={`btn btn-sm text-blue-700 font-normal capitalize font-sans ${
            selectedButtonsSection.includes(-1)
              ? "bg-blue-200 hover:bg-blue-200"
              : "bg-white hover:bg-white"
          } border-blue-500 hover:border-blue-500 rounded-full m-1`}
          onClick={() => handleSectionClick(-1)}
        >
          All
        </button>
        {sections
          .sort((a, b) => a.section_name.localeCompare(b.section_name))
          .map((section, index) => (
            <button
              key={index}
              className={`btn btn-sm text-blue-700 font-normal capitalize font-sans ${
                selectedButtonsSection.includes(index)
                  ? "bg-blue-200 hover:bg-blue-200"
                  : "bg-white hover:bg-white"
              } border-blue-500 hover:border-blue-500 rounded-full m-1`}
              onClick={() => handleSectionClick(index)}
            >
              {section.section_name}
            </button>
          ))}
      </div>
      <div>
        <h1 className="font-sans">Placement</h1>
        <button
          className={`btn btn-sm text-blue-700 font-normal capitalize font-sans ${
            selectedButtonsPlacement.includes(-1)
              ? "bg-blue-200 hover:bg-blue-200"
              : "bg-white hover:bg-white"
          } border-blue-500 hover:border-blue-500 rounded-full m-1`}
          onClick={() => handlePlacementClick(-1)}
        >
          All
        </button>
        {placements
          .sort((a, b) => a.placement_name.localeCompare(b.placement_name))
          .map((placement, index) => (
            <button
              key={index}
              className={`btn btn-sm text-blue-700 font-normal capitalize font-sans ${
                selectedButtonsPlacement.includes(index)
                  ? "bg-blue-200 hover:bg-blue-200"
                  : "bg-white hover:bg-white"
              } border-blue-500 hover:border-blue-500 rounded-full m-1`}
              onClick={() => handlePlacementClick(index)}
            >
              {placement.placement_name}
            </button>
          ))}
      </div>
    </div>
  );
};

export default FilterOptions;
