import { useEffect, useState } from 'react';
import WorkOrderButton from 'components/widgets/WorkOrderButton';
import { useAtom } from 'jotai';
import { LogoClickedAtom } from 'components/NavBar';
import { Asset, AssetPlacement, AssetSection } from 'types';
import { uploadFiletoS3 } from 'utils';
import { toast } from 'react-toastify';
import {
  createAssetPlacement,
  getAssetPlacements,
} from 'services/assetPlacementServices';
import {
  createAssetSection,
  getAssetSections,
} from 'services/assetSectionServices';
import { createFile } from 'services/fileServices';
import { updateAsset } from 'services/assetServices';
import useStatusTypeNames from 'hooks/useStatusTypes';
import { AiOutlinePaperClip } from 'react-icons/ai';
import { TfiClose } from 'react-icons/tfi';
import { Auth } from 'aws-amplify';
import { AssetCondition } from 'enums';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { genericAtom, useSyncedGenericAtom } from 'store/genericStore';
import { locationAtom, useSyncedAtom } from 'store/locationStore';
import AddSectionModal from './AddSectionModal';

const EditAssetForm = ({
  closeAsset,
  editFormOpen,
  setEditFormOpen,
  asset,
  assetImage,
  assetTypes,
  assetLocations,
  assetLocation,
  assetSections,
}) => {
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, 'authToken');
  const [, setLogoClicked] = useAtom(LogoClickedAtom);
  const [file, setFile] = useState<File>();
  const queryClient = useQueryClient();
  const [selectedLocation, setSelectedLocation] = useState<string>(
    assetLocation.locationId,
  );
  const [selectedSection, setSelectedSection] = useState<string>(
    asset.asset_section,
  );
  const [selectedPlacement, setSelectedPlacement] = useState<string>(
    asset.asset_placement,
  );
  const [filteredSections, setFilteredSections] = useState<AssetSection[]>([]);
  const [filteredPlacements, setFilteredPlacements] = useState<
    AssetPlacement[]
  >([]);
  const [addSection, setAddSection] = useState(false);
  const [addPlacement, setAddPlacement] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [location] = useSyncedAtom(locationAtom);
  const [, setAssetSections] = useState<AssetSection[]>([]);
  const [assetPlacements, setAssetPlacements] = useState<AssetPlacement[]>([]);

  const assetConditionOptionsReverse = {
    ACTIVE: AssetCondition.ACTIVE,
    INACTIVE: AssetCondition.INACTIVE,
  };
  // Custom function to get the correct label ("ACTIVE" or "INACTIVE") based on the UUID
  const getAssetConditionLabel = (uuid: string) =>
    Object.keys(assetConditionOptionsReverse).find(
      key => assetConditionOptionsReverse[key] === uuid,
    ) || '';

  const defaultFormData: Asset = {
    asset_id: asset.asset_id,
    asset_name: asset.asset_name,
    asset_type_id: asset.asset_type_id,
    asset_notes: asset.asset_notes,
    asset_location: asset.asset_location,
    asset_placement: asset.asset_placement,
    asset_section: asset.asset_section,
    asset_status: asset.asset_status,
    asset_finance_purchase: asset.asset_finance_purchase,
    asset_finance_current_value: asset.asset_finance_current_value,
    modified_date: asset.modified_date,
    modified_by: asset.modified_by,
    org_id: null,
    status_check_enabled: asset.status_check_enabled,
    images_id: asset.images_id,
    status_check_interval: asset.status_check_interval,
    asset_condition:
      asset.asset_condition === 'ACTIVE'
        ? AssetCondition.ACTIVE
        : AssetCondition.INACTIVE,
    asset_uuid: asset.asset_uuid,
  };
  const [formData, setFormData] = useState<Asset>(defaultFormData);

  const statusTypeNames = useStatusTypeNames();

  useEffect(() => {
    const handleLocationChange = async () => {
      // formData has latest selected Asset Location ID, store it in selectedLocation state
      setSelectedLocation(formData.asset_location);

      // Filter all sections based on the selected location
      const Sections = assetSections.filter(
        section => section.location_id === formData.asset_location,
      );

      // Reset filtered sections
      setFilteredSections(Sections);

      if (formData.asset_location !== defaultFormData.asset_location) {
        setFormData(prevState => ({
          ...prevState,
          asset_section: null,
        }));
        setSelectedSection(formData.asset_section);
      } else {
        setFormData(prevState => ({
          ...prevState,
          asset_section: defaultFormData.asset_section,
        }));
        setSelectedSection(defaultFormData.asset_section);
      }
    };

    handleLocationChange();
  }, [formData.asset_location]);

  useEffect(() => {
    const handleSectionChange = async () => {
      setSelectedSection(formData.asset_section);

      // Filter placements based on the selected section
      const placements = assetPlacements.filter(
        placement => placement.section_id === formData.asset_section,
      );
      setFilteredPlacements(placements);

      if (formData.asset_section !== defaultFormData.asset_section) {
        setFormData(prevState => ({
          ...prevState,
          asset_placement: null,
        }));
        setSelectedPlacement(formData.asset_placement);
      } else {
        setFormData(prevState => ({
          ...prevState,
          asset_placement: defaultFormData.asset_placement,
        }));
        setSelectedPlacement(defaultFormData.asset_placement);
      }

      setSelectedPlacement(formData.asset_placement);
    };

    handleSectionChange();
  }, [formData.asset_section, assetPlacements]);

  const handleSubmitForm = async event => {
    handleUnfocus();
    toast.info('Editing Asset... Please wait');
    event.preventDefault();
    setDisableButton(true);

    const updatedFormData = { ...formData };

    if (file) {
      // Step 1: Upload the file to S3 bucket
      const imageLocation = await uploadFiletoS3(file, 'inventory');

      const userData = await Auth.currentAuthenticatedUser();
      const modifiedBy = userData.attributes.given_name;
      const modifiedDate = new Date().toISOString().substring(0, 10);

      // Step 2: Create a file in the backend
      const createdFile = await createFile(authTokenObj.authToken, {
        file_id: '',
        file_array: [imageLocation.location],
        modified_by_array: [modifiedBy],
        modified_date_array: [modifiedDate],
      });
      const fileId = String(createdFile);

      setFormData(prevState => ({
        ...prevState,
        images_id: fileId,
      }));

      updatedFormData.images_id = fileId;
    }

    // Step 3: Update the asset in the backend
    assetUpdateMutation.mutateAsync(updatedFormData);
    closeAsset();

    setTimeout(() => {
      setLogoClicked(true);
    }, 1000);
  };

  const assetUpdateMutation = useMutation({
    mutationFn: (updatedData: Asset) =>
      updateAsset(authTokenObj.authToken, asset.asset_id, updatedData),
    onSuccess: () => {
      toast.success('Asset Edited Successfully');
      setEditFormOpen(false);
      queryClient.invalidateQueries(['query-asset']);
      closeAsset();
    },
    onError: () => {
      toast.error('Failed to update asset');
    },
  });

  // Function to handle adding a section
  const handleAddSection = async e => {
    e.preventDefault();
    if (selectedLocation) {
      const newSection: AssetSection = {
        section_id: '',
        section_name: selectedSection,
        location_id: selectedLocation,
      };

      sectionAddMutation.mutateAsync(newSection);
    } else {
      alert('Please select a location first.'); // eslint-disable-line
    }
  };

  const sectionAddMutation = useMutation({
    mutationFn: (newSection: AssetSection) =>
      createAssetSection(authTokenObj.authToken, newSection),
    onSettled: () => {
      toast.success('Section Added Successfully');
    },
    onSuccess: data => {
      refetchSection();
      setSelectedSection(null);
    },
    onError: () => {
      toast.error('Failed to Add Section');
    },
  });

  const { refetch: refetchSection } = useQuery({
    queryKey: ['query-assetSectionsForm', location],
    queryFn: async () => {
      const res = await getAssetSections(authTokenObj.authToken);
      setAssetSections(res);
      const sections = res.filter(
        section => section.location_id === formData.asset_location,
      );
      setFilteredSections(sections);
    },
    enabled: !!authTokenObj.authToken,
  });

  const handleAddPlacement = async e => {
    e.preventDefault();
    if (location && selectedSection) {
      if (selectedPlacement) {
        const newPlacement: AssetPlacement = {
          placement_id: '',
          placement_name: selectedPlacement,
          section_id: selectedSection,
          location_id: selectedLocation,
        };

        placementAddMutation.mutate(newPlacement);
      }
    } else {
      alert('Please select a location and section first.'); // eslint-disable-line
    }
  };

  const placementAddMutation = useMutation({
    mutationFn: (newPlacement: AssetPlacement) =>
      createAssetPlacement(authTokenObj.authToken, newPlacement),
    onSuccess: async data => {
      toast.success('Placement Added Successfully');
      refetchPlacement();
    },
    onError: () => {
      toast.error('Failed to Add Placement');
    },
  });

  const { refetch: refetchPlacement } = useQuery({
    queryKey: ['query-assetPlacementsForm'],
    queryFn: async () => {
      const res = await getAssetPlacements(authTokenObj.authToken);
      if (!res || typeof res === 'undefined') {
        throw new Error('No data received from API');
      }
      const placements = res.filter(
        placement => placement.section_id === selectedSection,
      );
      await setFilteredPlacements(placements);
      setAssetPlacements(res);
    },
    enabled: !!selectedLocation && !!authTokenObj.authToken,
  });

  // Function to close the edit asset form
  const closeEditForm = () => {
    setEditFormOpen(false);
  };

  const handleFormDataChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setFormData(prevState => ({
      ...prevState,
      // "id" and "name" of <elements> in <form> has to be same for this to work
      [e.target.id]: e.target.value,
    }));
  };

  const handleUnfocus = () => {
    document.getElementById('asset_name').focus();
  };

  return (
    <>
      <input
        type="checkbox"
        checked={editFormOpen}
        id="my-modal-3"
        className="modal-toggle"
      />
      <div className="p-2 md:p-0 md:pl-0 md:pb-32 pb-32">
        <div className="p-0 sm:mx-2 bg-white dark:bg-gray-700 rounded-2xl">
          <form method="post" onSubmit={handleSubmitForm}>
            {/* Modal header */}
            <div className="p-5 bg-white dark:bg-gray-700 flex flex-row rounded-xl">
              <h3 className="font-sans font-bold dark:font-semibold text-lg text-blue-800 dark:text-white ">
                Edit Asset
              </h3>
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                strokeWidth="1.5"
                className="w-6 h-6 text-blue-800 dark:text-white ml-auto cursor-pointer"
                onClick={closeEditForm}
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="flex flex-col p-5">
              <div className="flex flex-row gap-3 md:gap-0 md:flex-col">
                {/* Input field for asset name */}
                <div className="w-1/2 md:w-auto">
                  <label className="font-sans font-semibold text-black dark:text-white text-sm">
                    Name of Asset
                  </label>
                  <input
                    type="text"
                    id="asset_name"
                    name="asset_name"
                    placeholder="Enter Asset Name"
                    value={formData.asset_name}
                    onChange={e => {
                      handleFormDataChange(e);
                    }}
                    className="input input-bordered input-sm text-sm text-black dark:text-white bg-transparent dark:border-gray-500 w-full my-3 font-sans"
                  />
                </div>

                {/* Dropdown for asset type */}
                <div className="w-1/2 md:w-auto">
                  <label className="font-sans font-semibold text-sm text-black dark:text-white">
                    Asset Type
                  </label>
                  <select
                    id="asset_type_id"
                    name="asset_type_id"
                    value={formData.asset_type_id}
                    onChange={e => handleFormDataChange(e)}
                    className="select select-sm font-normal my-3 text-black dark:text-white bg-transparent dark:border-gray-500 w-full border border-slate-300"
                  >
                    {/* Map through the asset types */}
                    {assetTypes.map(type => (
                      <option
                        key={type.asset_type_id}
                        value={type.asset_type_id}
                        className="text-black"
                      >
                        {type.asset_type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Input field for description */}
              <label className="font-sans font-semibold text-sm text-black dark:text-white">
                Description
              </label>
              <input
                type="text"
                id="asset_notes"
                name="asset_notes"
                placeholder="Enter Description"
                value={formData.asset_notes}
                onChange={e => {
                  handleFormDataChange(e);
                }}
                className="input input-bordered input-sm text-sm text-black dark:text-white bg-transparent dark:border-gray-500 w-full my-3 font-sans"
              />

              {/* File input for uploading an image */}
              <label
                htmlFor="file_input"
                className="font-sans font-semibold text-sm text-black dark:text-white"
              >
                Add Image
                <h1
                  className="text-xs text-blue-800 underline"
                  onClick={() => window.open(assetImage, '_blank')}
                >
                  {`(Latest File: ${
                    assetImage ? String(assetImage).substring(67) : ''
                  })`}
                </h1>
              </label>

              <div className="flex flex-row bg-transparent border border-gray-300 dark:border-gray-500 rounded-xl p-2 my-3">
                <input
                  type="file"
                  onChange={e => {
                    setFile(e.target.files[0]);
                  }}
                  className="block w-full text-md text-black border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-black focus:outline-none dark:bg-white dark:placeholder-white file:bg-blue-900 file:text-white file:font-sans my-3"
                  id="upload"
                />
                <input
                  type="text"
                  className={`bg-transparent text-sm font-sans dark:border-gray-500 w-4/5 md:w-1/2 ${
                    file && file
                      ? 'text-black dark:text-white'
                      : 'text-gray-400'
                  }`}
                  value={file && file.name ? file.name : 'No file chosen'}
                  disabled
                />
                <button
                  className="btn btn-xs bg-transparent hover:bg-transparent normal-case font-normal w-fit border text-blue-600 font-sans text-xs md:text-[9px] border-gray-400 p-0.5 rounded-xl ml-auto"
                  id="upload"
                  onClick={e => {
                    e.preventDefault();
                    const uploadButton = document.querySelector(
                      '#upload',
                    ) as HTMLElement;
                    uploadButton.click();
                  }}
                >
                  <div className="flex flex-row items-center gap-0.5 dark:text-white mx-1">
                    <AiOutlinePaperClip className="text-lg" />
                    Choose File
                  </div>
                </button>
              </div>

              {/* Dropdown for selecting asset status */}
              <div className="flex flex-row gap-3 md:flex-col">
                <div className="flex flex-col w-1/2 md:w-auto">
                  <label className="font-sans font-semibold text-sm text-black dark:text-white">
                    Asset Status
                  </label>
                  <select
                    required
                    id="asset_status"
                    name="asset_status"
                    className="select select-sm font-normal my-3 dark:text-white bg-transparent dark:border-gray-500 border border-slate-300 w-full"
                    value={formData.asset_status}
                    onChange={e => handleFormDataChange(e)}
                  >
                    <option value="" disabled hidden>
                      Select Asset Status
                    </option>
                    {Object.entries(statusTypeNames).map(
                      ([statusId, statusName]) => (
                        <option
                          key={statusId}
                          value={statusId}
                          className="text-black bg-white dark:text-white dark:bg-gray-800 uppercase"
                        >
                          {statusName}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <div className="flex flex-col w-1/2 md:w-auto">
                  {/* Dropdown for selecting location */}
                  <label className="font-sans font-semibold text-sm text-black dark:text-white">
                    Select Location
                  </label>
                  <select
                    required
                    id="asset_location"
                    name="asset_location"
                    value={formData.asset_location}
                    onChange={e => handleFormDataChange(e)}
                    className="select select-sm font-normal my-3 border border-slate-300 dark:text-white bg-transparent dark:border-gray-500 w-full"
                  >
                    <option value="" disabled hidden>
                      Select Location
                    </option>
                    {assetLocations.map(assetLocationObj => (
                      <option
                        key={assetLocationObj.location_id}
                        value={assetLocationObj.location_id}
                        className="text-black bg-white dark:text-white dark:bg-gray-800"
                      >
                        {assetLocationObj.location_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-3 md:gap-0">
                {/* Dropdown for selecting section */}
                <div className="dropdown flex flex-col w-1/2 md:w-auto">
                  <label className="font-sans font-semibold text-sm text-black dark:text-white">
                    Select Section
                  </label>
                  <div className="flex flex-row items-center">
                    <div className="w-11/12">
                      <select
                        required
                        id="asset_section"
                        name="asset_section"
                        value={formData.asset_section || null}
                        onChange={e => handleFormDataChange(e)}
                        className="select select-sm font-normal my-3 border border-slate-300 dark:text-white
                        bg-transparent dark:border-gray-500 w-full"
                      >
                        {/* Render "Select Section" if selected location is not fetched location OR if formData.asset_section === null */}
                        <option
                          value=""
                          hidden
                          selected={
                            formData.asset_section === null &&
                            formData.asset_location !==
                              defaultFormData.asset_location
                          }
                        >
                          Select Section
                        </option>
                        {filteredSections.map(assetSectionObj => (
                          <option
                            key={assetSectionObj.section_id}
                            value={assetSectionObj.section_id}
                            className="text-black bg-white dark:text-white dark:bg-gray-800"
                          >
                            {assetSectionObj.section_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-1/12 ml-3">
                      <button
                        className="btn btn-sm bg-blue-800 hover:bg-blue-800"
                        onClick={e => {
                          e.preventDefault();
                          if (selectedLocation) {
                            setAddSection(true);
                          } else {
                            // eslint-disable-next-line
                            alert('Please select a location first.');
                          }
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dropdown for selecting placement */}
                <div className="dropdown flex flex-col w-1/2 md:w-auto">
                  <label className="font-sans font-semibold text-sm text-black dark:text-white">
                    Select Placement
                  </label>
                  <div className="flex flex-row items-center">
                    <div className="w-11/12 ">
                      <select
                        required
                        id="asset_placement"
                        name="asset_placement"
                        value={formData.asset_placement}
                        onChange={e => handleFormDataChange(e)}
                        className="select select-sm font-normal my-3 border border-slate-300
                        dark:text-white bg-transparent dark:border-gray-500 w-full"
                      >
                        {/* Render "Select Placement" if selected section is not fetched
                        section OR if formData.asset_placement === null */}
                        <option
                          value=""
                          hidden
                          selected={
                            formData.asset_placement === null &&
                            formData.asset_section !==
                              defaultFormData.asset_section
                          }
                        >
                          Select Placement
                        </option>
                        {filteredPlacements.map(assetPlacementObj => (
                          <option
                            key={assetPlacementObj.placement_id}
                            value={assetPlacementObj.placement_id}
                            className="text-black bg-white dark:text-white dark:bg-gray-800"
                          >
                            {assetPlacementObj.placement_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-1/12 ml-3">
                      <button
                        className="btn btn-sm bg-blue-800 hover:bg-blue-800"
                        onClick={e => {
                          e.preventDefault();
                          if (selectedLocation && selectedSection) {
                            setAddPlacement(true);
                          } else {
                            // eslint-disable-next-line
                            alert(
                              'Please select a location and section first.',
                            );
                          }
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dropdown for selecting asset condition */}
              <div className="flex flex-col w-1/2 md:w-auto">
                <label className="font-sans font-semibold text-sm text-black dark:text-white">
                  Asset Condition
                </label>
                <select
                  required
                  id="asset_condition"
                  name="asset_condition"
                  value={formData.asset_condition}
                  onChange={e =>
                    setFormData(prevState => ({
                      ...prevState,
                      asset_condition: e.target.value,
                    }))
                  }
                  className="select select-sm font-normal my-3 border border-slate-300 dark:text-white bg-transparent dark:border-gray-500 w-full"
                >
                  <option value="" disabled hidden>
                    Select Asset Condition
                  </option>
                  <option
                    value={AssetCondition.ACTIVE}
                    className="text-black bg-white dark:text-white dark:bg-gray-800"
                  >
                    {getAssetConditionLabel(AssetCondition.ACTIVE)}
                  </option>
                  <option
                    value={AssetCondition.INACTIVE}
                    className="text-black bg-white dark:text-white dark:bg-gray-800"
                  >
                    {getAssetConditionLabel(AssetCondition.INACTIVE)}
                  </option>
                </select>
              </div>

              {/* Adding Section Modal */}
              <input
                type="checkbox"
                checked={addSection}
                id="my_modal_6"
                className="modal-toggle"
              />
              <div id="addSectionModal" className="modal ">
                <div className="modal-box bg-white dark:bg-gray-800">
                  {selectedLocation && (
                    <form>
                      <div className="flex flex-row mb-5">
                        <h3 className="text-blue-900 font-sans font-semibold dark:text-white">
                          Add Section
                        </h3>
                        <button
                          className="ml-auto"
                          type="button"
                          onClick={() => {
                            setAddSection(false);
                          }}
                        >
                          <TfiClose className="font-bold text-black dark:text-white" />
                        </button>
                      </div>

                      <div className="flex flex-col w-full">
                        <label className="font-sans font-semibold text-sm text-black dark:text-white">
                          New Section Name
                        </label>
                        <input
                          type="text"
                          name="section"
                          required
                          onChange={e => setSelectedSection(e.target.value)}
                          className="block input input-sm w-full text-md text-black dark:text-white bg-transparent border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none dark:placeholder-white file:bg-blue-900 file:text-white file:font-sans"
                        />
                      </div>

                      <div className="w-full mt-4 flex justify-center">
                        <button
                          onClick={e => {
                            handleAddSection(e);
                            setAddSection(false);
                          }}
                          type="button"
                          className="btn btn-sm bg-blue-900 hover:bg-blue-900 mx-auto"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* adding placement Modal */}
              <input
                type="checkbox"
                checked={addPlacement}
                id="my_modal_6"
                className="modal-toggle"
              />
              <div id="addPlacementModal" className="modal ">
                <div className="modal-box bg-white dark:bg-gray-800">
                  {selectedSection && (
                    <form>
                      <div className="flex flex-row mb-5">
                        <h3 className="text-blue-900 font-sans font-semibold dark:text-white">
                          Add Placement
                        </h3>
                        <button
                          className="ml-auto"
                          type="button"
                          onClick={() => {
                            setAddPlacement(false);
                          }}
                        >
                          <TfiClose className="font-bold text-black dark:text-white" />
                        </button>
                      </div>

                      <div className="flex flex-col w-full">
                        <label className="font-sans font-semibold text-sm text-black dark:text-white">
                          New Placement Name
                        </label>
                        <input
                          type="text"
                          name="placement"
                          required
                          onChange={e => setSelectedPlacement(e.target.value)}
                          className="block input input-sm w-full text-md text-black dark:text-white bg-transparent border border-gray-300 dark:border-gray-500 rounded-lg  focus:outline-none dark:placeholder-white file:bg-blue-900 file:text-white file:font-sans"
                        />
                      </div>

                      <div className="w-full mt-4 flex justify-center">
                        <button
                          onClick={e => {
                            handleAddPlacement(e);
                            setAddPlacement(false);
                          }}
                          type="button"
                          className="btn btn-sm bg-blue-900 hover:bg-blue-900 mx-auto"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* Toggle for status check enabled */}
              <div className="flex items-center my-1">
                <label
                  htmlFor="status_check_enabled"
                  className="font-sans font-semibold text-sm text-black dark:text-white mr-2"
                >
                  Enable Status Check
                </label>
                <input
                  type="checkbox"
                  id="status_check_enabled"
                  className="form-checkbox text-blue-600"
                  checked={formData.status_check_enabled}
                  onChange={e => {
                    const isChecked = e.target.checked;

                    setFormData(prevState => ({
                      ...prevState,
                      status_check_enabled: isChecked,
                      // status_check_interval: isChecked
                      //   ? prevState.status_check_interval
                      //   : null,
                      // asset_finance_purchase: isChecked
                      //   ? prevState.asset_finance_purchase
                      //   : null,
                      // asset_finance_current_value: isChecked
                      //   ? prevState.asset_finance_current_value
                      //   : null,
                    }));
                  }}
                />
              </div>

              {formData.status_check_enabled ? (
                <div>
                  {/* Input field for status check interval */}
                  <label className="font-sans font-semibold text-sm text-black dark:text-white mt-2">
                    Status Check Interval (in days)
                  </label>
                  <input
                    required
                    type="number"
                    id="status_check_interval"
                    name="status_check_interval"
                    placeholder="Enter Status Check Interval"
                    value={formData.status_check_interval}
                    onChange={e => {
                      handleFormDataChange(e);
                    }}
                    // min="1"
                    className="input input-bordered input-sm text-sm w-full dark:text-white bg-transparent dark:border-gray-500 my-2 font-sans"
                  />
                </div>
              ) : null}
              <div className="flex flex-row md:flex-col gap-3 md:gap-0">
                {/* Input field for finance purchase */}
                <div className="w-1/2 md:w-auto">
                  <label className="font-sans font-semibold text-sm text-black dark:text-white">
                    Finance Purchase
                  </label>
                  <input
                    required
                    type="number"
                    id="asset_finance_purchase"
                    name="asset_finance_purchase"
                    placeholder="Enter Finance Purchase"
                    value={Math.trunc(formData.asset_finance_purchase)}
                    onChange={e => {
                      handleFormDataChange(e);
                    }}
                    className="input input-bordered input-sm text-sm text-black dark:text-white bg-transparent dark:border-gray-500 w-full my-3 font-sans"
                  />
                </div>
                {/* Input field for finance current value */}
                <div className="w-1/2 md:w-auto">
                  <label className="font-sans font-semibold text-sm text-black dark:text-white">
                    Finance Current Value
                  </label>
                  <input
                    required
                    type="number"
                    id="asset_finance_current_value"
                    name="asset_finance_current_value"
                    placeholder="Enter Finance Current Value"
                    value={Math.trunc(formData.asset_finance_current_value)}
                    onChange={e => {
                      handleFormDataChange(e);
                    }}
                    className="input input-bordered input-sm text-sm text-black dark:text-white bg-transparent dark:border-gray-500 w-full my-3 font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Modal action */}
            <div className="modal-action m-0 p-5 flex justify-center">
              <div>
                {/* WorkOrderButton component */}
                <WorkOrderButton
                  title="Submit"
                  workPending={false}
                  disableButton={disableButton}
                  buttonColor={'bg-blue-900'}
                  hoverColor={'hover:bg-blue-900'}
                />
              </div>
            </div>
          </form>
          <div>
            <AddSectionModal />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditAssetForm;
