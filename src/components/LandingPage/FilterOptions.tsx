import { TfiClose } from 'react-icons/tfi';

export let selectedStatusIds: string[] = []; // eslint-disable-line
export let selectedPlacementNames: string[] = []; // eslint-disable-line

export const resetFilterOptions = () => {
  selectedStatusIds = [];
  selectedPlacementNames = [];
};

export const FilterOptions = ({
  filterClose,
  placements,
  selectedButtonsPlacement,
  setSelectedButtonsPlacement,
  selectedButtonsStatus,
  setSelectedButtonsStatus,
  handleSectionReset,
}) => {
  const statuses = [
    {
      status_name: 'Working',
      status_id: 'ca879fb3-2f94-41b0-afb2-dea1448aaed3',
    },
    { status_name: 'Down', status_id: '1b3fff6a-aeda-4115-b3c1-b9a5654a629e' },
    {
      status_name: 'Maintenance',
      status_id: '24bbffe7-4d1d-4b9c-b959-4957033e29b6',
    },
  ];

  const handleReset = () => {
    setSelectedButtonsStatus([]);
    setSelectedButtonsPlacement([]);

    selectedPlacementNames = [];
    selectedStatusIds = [];

    handleSectionReset();
  };

  const handleStatusClick = buttonIndex => {
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
        selectedStatusIds = statuses.map(status => status.status_id);
      }
    } else if (selectedButtonsStatus.includes(buttonIndex)) {
      setSelectedButtonsStatus(
        selectedButtonsStatus.filter(index => index !== buttonIndex),
      );
      selectedStatusIds = selectedStatusIds.filter(
        statusId => statusId !== statuses[buttonIndex].status_id,
      );
    } else {
      setSelectedButtonsStatus([...selectedButtonsStatus, buttonIndex]);
      selectedStatusIds = [
        ...selectedStatusIds,
        statuses[buttonIndex].status_id,
      ];
    }
  };

  const handlePlacementClick = buttonIndex => {
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
          placement => placement.placement_name,
        );
      }
    } else if (selectedButtonsPlacement.includes(buttonIndex)) {
      setSelectedButtonsPlacement(
        selectedButtonsPlacement.filter(index => index !== buttonIndex),
      );
      selectedPlacementNames = selectedPlacementNames.filter(
        placementName =>
          placementName !== placements[buttonIndex].placement_name,
      );
    } else {
      setSelectedButtonsPlacement([...selectedButtonsPlacement, buttonIndex]);
      selectedPlacementNames = [
        ...selectedPlacementNames,
        placements[buttonIndex].placement_name,
      ];
    }
  };

  return (
    <div className="p-2">
      <div className="flex flex-row mt-10">
        <h1 className="font-sans font-semibold text-white dark:text-white">
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
              ? 'bg-blue-200 hover:bg-blue-200'
              : 'bg-white hover:bg-white'
          } border-blue-500 hover:border-blue-500 rounded-full m-1`}
          onClick={() => handleStatusClick(-1)}
        >
          All
        </button>
        {statuses.map((status, index) => (
          <button
            className={`btn btn-sm text-blue-700 font-normal capitalize font-sans ${
              selectedButtonsStatus.includes(index)
                ? 'bg-blue-200 hover:bg-blue-200'
                : 'bg-white hover:bg-white'
            } border-blue-500 hover:border-blue-500 rounded-full m-1`}
            onClick={() => handleStatusClick(index)}
          >
            {status.status_name}
          </button>
        ))}
      </div>
      <div>
        <h1 className="font-sans">Placement</h1>
        <button
          className={`btn btn-sm text-blue-700 font-normal capitalize font-sans ${
            selectedButtonsPlacement.includes(-1)
              ? 'bg-blue-200 hover:bg-blue-200'
              : 'bg-white hover:bg-white'
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
                  ? 'bg-blue-200 hover:bg-blue-200'
                  : 'bg-white hover:bg-white'
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
