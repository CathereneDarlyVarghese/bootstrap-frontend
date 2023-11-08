import React, { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { genericAtom, useSyncedGenericAtom } from 'store/genericStore';
import { getAssets } from 'services/assetServices';
import { getAssetSections } from 'services/assetSectionServices';
import { useQuery } from '@tanstack/react-query';
import AssetCard from 'components/LandingPage/AssetCard';
import { useNavigate } from 'react-router';
import { searchTermAtom } from 'components/LandingPage/ListsLayout';
import { AssetPlacement, AssetSection, IncomingAsset } from 'types';
import { getAssetPlacements } from 'services/assetPlacementServices';
import { TfiClose } from 'react-icons/tfi';
import { BsFilter } from 'react-icons/bs';
import { toast } from 'react-toastify';
import {
  FilterOptions,
  selectedStatusIds,
  // selectedSectionNames,
  selectedPlacementNames,
} from '../LandingPage/FilterOptions';

import SearchIcon from '../../icons/circle2017.png';
import { locationAtom, useSyncedAtom } from '../../store/locationStore';
import ConfirmModal from './ConfirmModal';

const QrLinkingPage = () => {
  const selectRef = useRef<HTMLSelectElement>(null); // For resetting the section selector
  const [incomingAssets, setIncomingAssets] = useState<IncomingAsset[]>([]);
  // Location states
  const [location] = useSyncedAtom(locationAtom);
  // Authentication
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, 'authToken');
  // Miscellaneous states
  const [, setGetResult] = useState<string | null>(null);
  const [, setDetailsTab] = useState(0); // Active tabs in asset details card
  const [message, setMessage] = useState(true);
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const [, setShowOptions] = useState(true);

  const [selectedAsset, setSelectedAsset] = useState<IncomingAsset>();
  const [linkedAsset, setLinkedAsset] = useState<IncomingAsset>();

  // filter states

  const defaultAssetSections = [
    { section_id: '', section_name: '', location_id: '' },
  ];
  const defaultAssetPlacements = [
    {
      placement_id: '',
      placement_name: '',
      section_id: '',
      location_id: '',
    },
  ];
  const [assetPlacements, setAssetPlacements] = useState<AssetPlacement[]>(
    defaultAssetPlacements,
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedSectionNames, setSelectedSectionNames] = useState<string[]>(
    [],
  );
  const [assetSections, setAssetSections] =
    useState<AssetSection[]>(defaultAssetSections);

  // Buttons and filters
  const [selectedButtonsStatus, setSelectedButtonsStatus] = useState([]);
  const [selectedButtonsPlacement, setSelectedButtonsPlacement] = useState([]);
  const [selectedAssetSection] = useState<AssetSection>(
    defaultAssetSections[0],
  );
  const [selectedAssetPlacementName] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const formatResponse = (res: any) => JSON.stringify(res, null, 2); // eslint-disable-line

  // Fetching assets data and handlers
  const fetchAllFilteredAssets = async () => {
    try {
      if (location.locationId !== '') {
        const res = await getAssets(
          authTokenObj.authToken,
          location.locationId,
        );

        setIncomingAssets(res);

        const linkedAssetId = new URLSearchParams(window.location.search).get(
          'linked_asset_id',
        );
        const matchedAsset = res.find(
          asset => asset.asset_id === linkedAssetId,
        );
        if (matchedAsset) {
          setLinkedAsset(matchedAsset);
          setMessage(false);
        } else {
          setLinkedAsset(null);
        }
      }
    } catch (err) {
      setGetResult(formatResponse(err.response?.data || err));
    }
  };

  useQuery({
    queryKey: ['query-asset', location, authTokenObj.authToken],
    queryFn: fetchAllFilteredAssets,
    enabled: !!authTokenObj.authToken,
  });
  const detailsTabIndexRefresh = () => {
    setDetailsTab(0);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('search', encodeURIComponent(newSearchTerm));
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState({}, '', newUrl);
  };
  const clearQueryParams = () => {
    const urlWithoutParams = window.location.origin + window.location.pathname;
    window.history.pushState(null, '', urlWithoutParams);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const scannedSearchTerm = urlParams.get('search');
    setSearchTerm(
      scannedSearchTerm ? decodeURIComponent(scannedSearchTerm) : '',
    );
  }, [setSearchTerm]);

  const handleSectionSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedValue = event.target.value;
    setSelectedSectionNames(selectedValue === '' ? [] : [selectedValue]);
  };

  const handleSectionReset = () => {
    if (selectRef.current) {
      selectRef.current.value = '';
      setSelectedSectionNames([]);
    }
  };
  const fetchAssetSections = async () => {
    try {
      const res = await getAssetSections(authTokenObj.authToken);
      const filtered = res.filter(
        (section: AssetSection) => section.location_id === location.locationId,
      );
      setAssetSections(filtered);
    } catch (err) {
      setGetResult(formatResponse(err.response?.data || err));
    }
  };
  const fetchAssetPlacements = async () => {
    try {
      const res = await getAssetPlacements(authTokenObj.authToken);
      const filtered = res.filter(
        (placement: AssetPlacement) =>
          placement.location_id === location.locationId,
      );
      setAssetPlacements(filtered);
    } catch (err) {
      setGetResult(formatResponse(err.response?.data || err));
    }
  };

  useQuery({
    queryKey: ['query-assetSections', location],
    queryFn: fetchAssetSections,
    enabled: !!authTokenObj.authToken,
  });
  useQuery({
    queryKey: [
      'query-assetPlacement',
      location,
      selectedAssetSection.section_id,
      selectedAssetPlacementName,
    ],
    queryFn: fetchAssetPlacements,
    enabled: !!authTokenObj.authToken,
  });

  return (
    <div className="p-2 mb-16">
      {!linkedAsset && (
        <div className="flex flex-col items-center">
          <h1 className="font-sans font-semibold my-5 text-black text-2xl">
            Link QR
          </h1>
          {message && (
            <div className="border rounded-2xl w-1/2 lg:w-2/3 md:w-fit border-slate-400 p-8">
              <div>
                <div className="flex flex-row justify-center">
                  <h1 className="font-sans">
                    This QR is not linked with any asset
                  </h1>
                </div>
                <div className="flex flex-row gap-5 mt-5 justify-center">
                  <button
                    className="btn btn-sm bg-blue-900 hover:bg-blue-900"
                    onClick={() => {
                      setMessage(false);
                    }}
                  >
                    Link Now
                  </button>
                  <button
                    className="btn btn-sm bg-blue-900 hover:bg-blue-900"
                    onClick={() => navigate('/scan')}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {!message && (
        <div>
          <div className="flex flex-col items-center">
            <h1 className="font-sans">Click on the asset to link to the QR</h1>
          </div>
          <div className="flex flex-col items-center w-3/4 sm:w-full justify-center mx-auto">
            <div className="flex flex-row items-center mx-auto bg-gray-100 dark:bg-gray-700 rounded-xl w-full sm:w-full  mt-5 h-12">
              <button>
                <img
                  src={SearchIcon}
                  alt="search"
                  className="h-fit justify-center items-center ml-3"
                />
              </button>

              <input
                type="text"
                placeholder={`Search ${location.locationName}`}
                value={searchTerm}
                className="w-4/5 h-12 p-5 bg-gray-100 dark:bg-gray-700 placeholder-blue-700 dark:placeholder-white text-blue-700 dark:text-white text-sm border-none font-sans"
                onChange={e => {
                  handleSearchInputChange(e);
                  setShowOptions(true);
                }}
              />
              {searchTerm !== '' && (
                <button
                  className="ml-auto mr-5"
                  onClick={() => {
                    setSearchTerm('');
                    clearQueryParams();
                  }}
                >
                  <TfiClose className="text-blue-600 dark:text-white ml-auto" />
                </button>
              )}
            </div>
            <div
              className={`flex flex-row gap-5 w-3/4 justify-center mt-5 ${
                filtersOpen ? 'hidden' : ''
              }`}
            >
              <select
                name=""
                id=""
                ref={selectRef}
                onChange={handleSectionSelectChange}
                className="select select-sm bg-white dark:bg-gray-700 text-black dark:text-white border border-slate-300 dark:border-slate-600 w-full"
              >
                <option value="">All Sections</option>

                {assetSections &&
                  assetSections
                    .sort((a, b) =>
                      a.section_name.localeCompare(b.section_name),
                    )
                    .map((section: AssetSection, index: number) => (
                      <option key={index} value={section.section_name}>
                        {section.section_name}
                      </option>
                    ))}
              </select>
              <button
                className="btn btn-sm bg-blue-900 hover:bg-blue-900 text-white border-gray-400 hover:border-gray-400 dark:border-gray-600 rounded-3xl font-sans font-semibold capitalize text-black"
                onClick={() => setFiltersOpen(true)}
              >
                <div className="flex flex-row">
                  Filters
                  <BsFilter />
                </div>
              </button>
            </div>
          </div>

          {filtersOpen ? (
            <div>
              <FilterOptions
                filterClose={() => setFiltersOpen(false)}
                placements={assetPlacements}
                selectedButtonsPlacement={selectedButtonsPlacement}
                setSelectedButtonsPlacement={setSelectedButtonsPlacement}
                selectedButtonsStatus={selectedButtonsStatus}
                setSelectedButtonsStatus={setSelectedButtonsStatus}
                handleSectionReset={handleSectionReset}
              />
            </div>
          ) : (
            <div> </div>
          )}
          <div className={`flex flex-wrap ${filtersOpen ? 'hidden' : ''}`}>
            {/* Render asset cards */}
            {incomingAssets &&
              (() => {
                const assetsArray = Array.isArray(incomingAssets)
                  ? incomingAssets
                  : incomingAssets
                  ? [incomingAssets]
                  : [];
                const activeAssets = assetsArray.filter(
                  item => item.asset_condition === 'ACTIVE',
                );

                const inactiveAssets = assetsArray.filter(
                  item => item.asset_condition === 'INACTIVE',
                );

                return [...activeAssets, ...inactiveAssets].filter(asset => {
                  const searchTermMatch =
                    searchTerm === '' ||
                    asset.asset_name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    asset.asset_type
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());

                  const statusFilterMatch =
                    selectedStatusIds.length === 0 ||
                    selectedStatusIds.includes(asset.asset_status);

                  const sectionFilterMatch =
                    selectedSectionNames.length === 0 ||
                    selectedSectionNames.includes(asset.section_name);

                  const placementFilterMatch =
                    selectedPlacementNames.length === 0 ||
                    selectedPlacementNames.includes(asset.placement_name);

                  /* sectionFilterMatch AND placementFilterMatch */
                  const intersectionFilterMatch =
                    sectionFilterMatch && placementFilterMatch;
                  return (
                    searchTermMatch &&
                    statusFilterMatch &&
                    (selectedSectionNames.length === 0 ||
                    selectedPlacementNames.length === 0
                      ? intersectionFilterMatch
                      : intersectionFilterMatch)
                  );
                });
              })().map(asset => (
                <div
                  className="w-1/3 lg:w-1/2 md:w-full"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (asset === linkedAsset) {
                      setSelectedAsset(null);
                      toast.warn(
                        'This QR Code is already linked to this Asset!',
                      );
                    } else {
                      setSelectedAsset(asset);
                    }
                    setModalOpen(true);
                    // setAssetId(asset.asset_id);
                    // setAddAssetOpen(false);
                    // setAssetDetailsOpen(true);
                  }}
                >
                  <AssetCard
                    asset={asset}
                    imagePlaceholder="img"
                    updatedDetailsTabIndex={detailsTabIndexRefresh}
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Modal for asking confirmation */}
      {selectedAsset && selectedAsset.asset_name && (
        <ConfirmModal
          linkedAsset={linkedAsset}
          selectedAsset={selectedAsset}
          assetUUID={new URLSearchParams(window.location.search).get(
            'asset_uuid',
          )}
          open={modalOpen}
          setOpen={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default QrLinkingPage;
