import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  createAssetType,
  deleteAssetType,
  getAllAssetTypes,
} from "services/assetTypeServices";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";
import { AssetType } from "types";

interface AddAssetTypeProps {
  assetType: string;
  setAssetType: (value: string) => void;
}

const AddAssetType: React.FC<AddAssetTypeProps> = ({
  assetType,
  setAssetType,
}) => {
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, "authToken");
  const [data, setData] = useState<AssetType[]>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<string>("");
  const queryClient = useQueryClient();

  // Handler for adding asset type
  const handleAddAssetType = async (e) => {
    e.preventDefault();

    if (assetType.trim() === "") {
      toast.error("Asset Type type must not be empty");
      return;
    }

    try {
      const newAssetType = await createAssetType(authTokenObj.authToken, {
        asset_type_id: "",
        asset_type: assetType,
      });
      queryClient.invalidateQueries(["query-assetTypesAdmin"]);
      toast.success("Asset Type added successfully");
      setAssetType("");
    } catch (error) {
      console.error("Error creating asset type:", error);
    }
  };

  const fetchAssetTypes = async () => {
    try {
      const assetTypeData = await getAllAssetTypes(authTokenObj.authToken);
      setData(assetTypeData);
    } catch (error) {
      console.log(error);
    }
  };

  const { data: AssetType } = useQuery({
    queryKey: ["query-assetTypesAdmin"],
    queryFn: fetchAssetTypes,
  });

  const assetTypeDeleteMutation = useMutation(
    (id: string) => deleteAssetType(authTokenObj.authToken, id),
    {
      onSuccess: () => {
        toast.info("Asset Type deleted successfully");
        setSelectedAssetType("");
        queryClient.invalidateQueries(["query-assetTypesAdmin"]);
      },
      onError: (error: any) => {
        toast.error("Failed to delete AssetType");
      },
    }
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
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
          />
          <div className="flex flex-row justify-center">
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
        {data && data.length > 0 && (
          <div>
            <div className="flex flex-row items-center">
              <h3 className="font-bold text-lg">Delete Asset Type</h3>
            </div>
            <select
              value={selectedAssetType}
              onChange={(e) => setSelectedAssetType(e.target.value)}
              className="input input-sm w-full border border-slate-300 my-5"
            >
              <option value="" disabled>
                Select a Asset Type
              </option>
              {data.map((assetType) => (
                <option
                  key={assetType.asset_type_id}
                  value={assetType.asset_type_id}
                >
                  {assetType.asset_type}
                </option>
              ))}
            </select>
            <div className="flex flex-row justify-center">
              <button
                onClick={() => {
                  assetTypeDeleteMutation.mutate(selectedAssetType);
                }}
                className="btn btn-sm bg-red-500 hover:bg-red-700"
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
