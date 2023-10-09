import React, { useEffect, useRef } from "react";
import { TfiClose } from "react-icons/tfi";
import { getAssetPlacements } from "services/assetPlacementServices";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";

export let selectedStatusIds: string[] = []; // eslint-disable-line
// export var selectedSectionNames: string[] = [];
export let selectedPlacementNames: string[] = []; // eslint-disable-line

export const resetFilterOptions = () => {
  selectedStatusIds = [];
  selectedPlacementNames = [];
};

export const FilterOptions = ({
  filterClose,
  /* sections, */ placements,
  /* selectedButtonsSection, */ /* setSelectedButtonsSection, */ selectedButtonsPlacement,
  setSelectedButtonsPlacement,
  selectedButtonsStatus,
  setSelectedButtonsStatus,
  handleSectionReset,
}) => {
  // const statuses = ["Working", "DOWN", "Maintenance"];
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, "authToken");

  const statuses = [
    {
      status_name: "Working",
      status_id: "ca879fb3-2f94-41b0-afb2-dea1448aaed3",
    },
    { status_name: "Down", status_id: "1b3fff6a-aeda-4115-b3c1-b9a5654a629e" },
    {
      status_name: "Maintenance",
      status_id: "24bbffe7-4d1d-4b9c-b959-4957033e29b6",
    },
  ];

  const handleReset = () => {
    setSelectedButtonsStatus([]);
    setSelectedButtonsPlacement([]);
    // setSelectedButtonsSection([]);

    // selectedSectionNames = [];
    selectedPlacementNames = [];
    selectedStatusIds = [];

    handleSectionReset();
  };

  const handleStatusClick = (buttonIndex) => {
    if (buttonIndex === -1) {
      if (selectedButtonsStatus.includes(-1)) {
        // If "All" button is already selected, unselect it and all other buttons
        setSelectedButtonsStatus([]);
        selectedStatusIds = [];
      } else {
        // If "All" button is not selected, select it and all other buttons
        const allIndices = [];
        for (let i = 0; i < statuses.length; i += 1) {
          allIndices.push(i);
        }
        setSelectedButtonsStatus([-1, ...allIndices]);
        selectedStatusIds = statuses.map((status) => status.status_id);
      }
    } else if (selectedButtonsStatus.includes(buttonIndex)) {
      setSelectedButtonsStatus(
        selectedButtonsStatus.filter((index) => index !== buttonIndex)
      );
      selectedStatusIds = selectedStatusIds.filter(
        (statusId) => statusId !== statuses[buttonIndex].status_id
      );
    } else {
      setSelectedButtonsStatus([...selectedButtonsStatus, buttonIndex]);
      selectedStatusIds = [
        ...selectedStatusIds,
        statuses[buttonIndex].status_id,
      ];
    }
  };

  /* Section Select Moved to ListsLayout.tsx */
  /* const handleSectionClick = (buttonIndex) => {
    if (buttonIndex === -1) {
      if (selectedButtonsSection.includes(-1)) {
        // If "All" button is already selected, unselect it and all other buttons
        setSelectedButtonsSection([]);
        selectedSectionNames = [];
      } else {
        // If "All" button is not selected, select it and all other buttons
        const allIndices = [];
        for (let i = 0; i < sections.length; i++) {
          allIndices.push(i);
        }
        setSelectedButtonsSection([-1, ...allIndices]);
        selectedSectionNames = (sections.map((section) => section.section_name));
      }
    } else {
      if (selectedButtonsSection.includes(buttonIndex)) {
        setSelectedButtonsSection(
          selectedButtonsSection.filter((index) => index !== buttonIndex)
        );
        selectedSectionNames = (
          selectedSectionNames.filter(
            (sectionName) => sectionName !== sections[buttonIndex].section_name
          )
        );
      } else {
        setSelectedButtonsSection([...selectedButtonsSection, buttonIndex]);
        selectedSectionNames = ([
          ...selectedSectionNames,
          sections[buttonIndex].section_name,
        ]);
      }
    }
  }; */

  const handlePlacementClick = (buttonIndex) => {
    if (buttonIndex === -1) {
      if (selectedButtonsPlacement.includes(-1)) {
        // If "All" button is already selected, unselect it and all other buttons
        setSelectedButtonsPlacement([]);
        selectedPlacementNames = [];
      } else {
        // If "All" button is not selected, select it and all other buttons
        const allIndices = [];
        for (let i = 0; i < placements.length; i += 1) {
          allIndices.push(i);
        }
        setSelectedButtonsPlacement([-1, ...allIndices]);
        selectedPlacementNames = placements.map(
          (placement) => placement.placement_name
        );
      }
    } else if (selectedButtonsPlacement.includes(buttonIndex)) {
      setSelectedButtonsPlacement(
        selectedButtonsPlacement.filter((index) => index !== buttonIndex)
      );
      selectedPlacementNames = selectedPlacementNames.filter(
        (placementName) =>
          placementName !== placements[buttonIndex].placement_name
      );
    } else {
      setSelectedButtonsPlacement([...selectedButtonsPlacement, buttonIndex]);
      selectedPlacementNames = [
        ...selectedPlacementNames,
        placements[buttonIndex].placement_name,
      ];
    }
  };

  const placementsRef = useRef([]);

  useEffect(() => {
    const getPlacements = async () => {
      try {
        if (selectedButtonsPlacement.length === 0) {
          const fetchedPlacements = await getAssetPlacements(
            authTokenObj.authToken
          );

          if (placementsRef.current.length === 0) {
            placementsRef.current = fetchedPlacements;
          }
        }
      } catch (error) {}
    };
    getPlacements();
  }, []);

  return (
    <div className="p-2">
      <div className="flex flex-row mt-10">
        <h1 className="font-sans font-semibold text-black dark:text-white">
          Filters
        </h1>
        <div className="flex flex-row gap-2 ml-auto">
          <button
            onClick={filterClose}
            className="btn btn-sm bg-blue-900 hover:bg-blue-900 font-normal px-4 font-sans rounded-full capitalize ml-auto"
          >
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
        {statuses.map((status, index) => (
          <button
            className={`btn btn-sm text-blue-700 font-normal capitalize font-sans ${
              selectedButtonsStatus.includes(index)
                ? "bg-blue-200 hover:bg-blue-200"
                : "bg-white hover:bg-white"
            } border-blue-500 hover:border-blue-500 rounded-full m-1`}
            onClick={() => handleStatusClick(index)}
          >
            {status.status_name}
          </button>
        ))}
      </div>
      {/* <div className="my-3">
        <h1 className="font-sans">Section</h1>
        <button
          className={`btn btn-sm text-blue-700 font-normal
          capitalize font-sans ${selectedButtonsSection.includes(-1)
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
              className={`btn btn-sm text-blue-700 font-normal
              capitalize font-sans ${selectedButtonsSection.includes(index)
                ? "bg-blue-200 hover:bg-blue-200"
                : "bg-white hover:bg-white"
                } border-blue-500 hover:border-blue-500 rounded-full m-1`}
              onClick={() => handleSectionClick(index)}
            >
              {section.section_name}
            </button>
          ))}
      </div> */}
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
