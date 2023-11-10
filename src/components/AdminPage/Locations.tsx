import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  createAssetLocation,
  deleteAssetLocation,
  getAllAssetLocations,
} from 'services/locationServices';
import { genericAtom, useSyncedGenericAtom } from 'store/genericStore';
import { AssetLocation } from 'types';

const Locations = () => {
  const queryClient = useQueryClient();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [newLocationName, setNewLocationName] = useState('');
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, 'authToken');
  const [data, setData] = useState<AssetLocation[]>(null);

  useQuery({
    queryKey: ['query-locationsAdmin'],
    queryFn: async () => {
      const locationData = await getAllAssetLocations(authTokenObj.authToken);
      setData(locationData);
    },
    enabled: !!authTokenObj.authToken,
  });

  const locationAddMutation = useMutation(
    (assetLocationObj: AssetLocation) =>
      createAssetLocation(authTokenObj.authToken, assetLocationObj),
    {
      onSuccess: async () => {
        toast.success('Location Added Successfully');
        queryClient.invalidateQueries(['query-locationsAdmin']);
        queryClient.invalidateQueries(['query-locations']);
      },
      onError: () => {
        toast.error('Failed to Add Asset');
      },
    },
  );

  const locationDeleteMutation = useMutation(
    (id: string) => deleteAssetLocation(authTokenObj.authToken, id),
    {
      onSuccess: () => {
        toast.success('Location deleted successfully');
        setSelectedLocation('');
        queryClient.invalidateQueries(['query-locationsAdmin']);
        queryClient.invalidateQueries(['query-locations']);
      },
      onError: () => {
        toast.error('Failed to delete location');
      },
    },
  );

  return (
    <div className="flex flex-col items-center mt-10 ">
      <div className="2xl:w-1/2 md:w-3/4 p-5 border border-slate-200 rounded-lg">
        <h3 className="font-bold text-lg">Manage Locations</h3>

        {/* Add New Location */}
        <div className="mt-5">
          <input
            type="text"
            placeholder="Add new location"
            value={newLocationName}
            onChange={e => setNewLocationName(e.target.value)}
            className="input input-sm w-full border border-slate-300 my-5"
          />
          <button
            onClick={() => {
              if (newLocationName.length !== 0) {
                locationAddMutation.mutate({
                  location_id: '',
                  location_name: newLocationName,
                });
                setNewLocationName('');
              } else {
                toast.error('Location field must not be empty');
              }
            }}
            className="btn btn-sm bg-blue-500 hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Select and Delete Location */}
        {data && data.length > 0 && (
          <div>
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="input input-sm w-full border border-slate-300 my-5"
            >
              <option value="" disabled>
                Select a location
              </option>
              {data.map(location => (
                <option key={location.location_id} value={location.location_id}>
                  {location.location_name}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                locationDeleteMutation.mutate(selectedLocation);
              }}
              className="btn btn-sm bg-red-500 hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Locations;
