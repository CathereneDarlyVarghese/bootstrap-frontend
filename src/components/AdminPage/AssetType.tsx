import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  createAssetType,
  deleteAssetType,
  getAllAssetTypes,
} from 'services/assetTypeServices';
import { genericAtom, useSyncedGenericAtom } from 'store/genericStore';
import { AssetType } from 'types';

const AddAssetType = () => {
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, 'authToken');
  const [selectedAssetType, setSelectedAssetType] = useState<string>('');
  const queryClient = useQueryClient();
  const [newAssetType, setNewAssetType] = useState<string>('');

  // Handler for adding asset type
  const handleAddAssetType = async e => {
    e.preventDefault();

    if (newAssetType.trim() === '') {
      toast.error('Asset Type type must not be empty');
      return;
    }

    await createAssetType(authTokenObj.authToken, {
      asset_type_id: '',
      asset_type: newAssetType,
    });
    queryClient.invalidateQueries(['query-assetTypesAdmin']);
    toast.success('Asset Type added successfully');
    setNewAssetType('');
  };

  const { data: assetTypesData } = useQuery({
    queryKey: ['query-assetTypesAdmin'],
    queryFn: async () => {
      const assetTypeData = await getAllAssetTypes(authTokenObj.authToken);
      return assetTypeData;
    },
    enabled: !!authTokenObj.authToken,
  });

  const assetTypeDeleteMutation = useMutation(
    (id: string) => deleteAssetType(authTokenObj.authToken, id),
    {
      onSuccess: () => {
        toast.info('Asset Type deleted successfully');
        setSelectedAssetType('');
        queryClient.invalidateQueries(['query-assetTypesAdmin']);
      },
      onError: () => {
        toast.error('Failed to delete AssetType');
      },
    },
  );

  return (
    <div className="flex flex-col items-center mt-10 ">
      <div className="2xl:w-1/2 md:w-3/4 p-5 border border-slate-200 rounded-lg">
        <div className="flex flex-row items-center">
          <h3 className="font-bold text-lg">Add Asset Type</h3>
        </div>
        <form>
          <input
            type="text"
            required
            placeholder="Enter Asset Type"
            className="input input-sm w-full border border-slate-300 my-5"
            value={newAssetType}
            onChange={e => setNewAssetType(e.target.value)}
          />
          <div className="flex flex-row justify-left">
            <button
              onClick={handleAddAssetType}
              className="btn btn-sm bg-blue-900 hover:bg-blue-900"
            >
              Submit
            </button>
          </div>
        </form>

        <br />
        {/* Select and Delete assetType */}
        {assetTypesData && assetTypesData.length > 0 && (
          <div>
            <div className="flex flex-row items-center">
              <h3 className="font-bold text-lg">Delete Asset Type</h3>
            </div>
            <select
              value={selectedAssetType}
              onChange={e => setSelectedAssetType(e.target.value)}
              className="input input-sm w-full border border-slate-300 my-5"
            >
              <option value="" disabled>
                Select a Asset Type
              </option>
              {assetTypesData.map(assetTypeObj => (
                <option
                  key={assetTypeObj.asset_type_id}
                  value={assetTypeObj.asset_type_id}
                >
                  {assetTypeObj.asset_type}
                </option>
              ))}
            </select>
            <div className="flex flex-row justify-left">
              <button
                onClick={() => {
                  assetTypeDeleteMutation.mutate(selectedAssetType);
                }}
                className="btn btn-sm bg-red-600 border-0 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAssetType;
