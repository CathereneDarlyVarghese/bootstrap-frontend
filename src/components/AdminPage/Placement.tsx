import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  createAssetPlacement,
  deleteAssetPlacement,
  getAssetPlacements,
} from "services/assetPlacementServices";
import { AssetPlacement, AssetSection, AssetLocation } from "types";
import { genericAtom, useSyncedGenericAtom } from "store/genericStore";
import { getAssetSections } from "services/assetSectionServices";

const Placements = () => {
  const queryClient = useQueryClient();

  const [selectedPlacement, setSelectedPlacement] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [newPlacementName, setNewPlacementName] = useState("");
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, "authToken");

  // Fetching sections and placements using react-query
  const { data: AssetSections } = useQuery(["query-assetSectionsAdmin"], () =>
    getAssetSections(authTokenObj.authToken)
  );
  const { data: Placements } = useQuery(["query-PlacementsAdmin"], () =>
    getAssetPlacements(authTokenObj.authToken)
  );

  // Local cached data for locations
  const queryLocations = queryClient.getQueryData<AssetLocation[]>([
    "query-locations",
  ]);

  // Mutations for adding and deleting placements
  const PlacementAddMutation = useMutation(
    (assetPlacementObj: AssetPlacement) =>
      createAssetPlacement(authTokenObj.authToken, assetPlacementObj),
    {
      onSuccess: () => {
        toast.success("Placement Added Successfully");
        queryClient.invalidateQueries(["query-PlacementsAdmin"]);
      },
      onError: () => {
        toast.error("Failed to Add Placement");
      },
    }
  );

  const PlacementDeleteMutation = useMutation(
    (id: string) => deleteAssetPlacement(authTokenObj.authToken, id),
    {
      onSuccess: () => {
        toast.success("Placement deleted successfully");
        setSelectedPlacement("");
        queryClient.invalidateQueries(["query-PlacementsAdmin"]);
      },
      onError: () => {
        toast.error("Failed to delete Placement");
      },
    }
  );

  return (
    <div className="flex flex-col items-center mt-10 ">
      <div className="w-1/2 p-5 border border-slate-200 rounded-lg">
        <h3 className="font-bold text-lg">Manage Placements</h3>

        {/* Location Selector */}
        {queryLocations?.length && (
          <div>
            <select
              required
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="input input-sm w-full border border-slate-300 my-5"
            >
              <option value="" disabled>
                Select a Location
              </option>
              {queryLocations.map((Location) => (
                <option key={Location.location_id} value={Location.location_id}>
                  {Location.location_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Section Selector */}
        {AssetSections?.length > 0 && selectedLocation && (
          <div>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="input input-sm w-full border border-slate-300 my-5"
            >
              <option value="" disabled>
                Select a Section
              </option>
              {AssetSections.filter(
                (Section) => Section.location_id === selectedLocation
              ).map((Section) => (
                <option key={Section.section_id} value={Section.section_id}>
                  {Section.section_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Add New Placement Input */}
        <div className="mt-5">
          <input
            type="text"
            placeholder="Add new Placement"
            value={newPlacementName}
            onChange={(e) => setNewPlacementName(e.target.value)}
            className="input input-sm w-full border border-slate-300 my-5"
          />
          <button
            onClick={() => {
              if (!selectedSection) {
                toast.error("Please select a section first!");
                return;
              }
              PlacementAddMutation.mutate({
                placement_id: "",
                placement_name: newPlacementName,
                section_id: selectedSection,
                location_id: selectedLocation,
              });
              setNewPlacementName("");
            }}
            className="btn btn-sm bg-blue-500 hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Placement Selector for Deletion */}
        {Placements?.length > 0 && (
          <div>
            <select
              value={selectedPlacement}
              onChange={(e) => setSelectedPlacement(e.target.value)}
              className="input input-sm w-full border border-slate-300 my-5"
            >
              <option value="" disabled>
                Select a Placement
              </option>
              {Placements.filter(
                (Placement) => Placement.section_id === selectedSection
              ).map((Placement) => (
                <option
                  key={Placement.placement_id}
                  value={Placement.placement_id}
                >
                  {Placement.placement_name}
                </option>
              ))}
            </select>
            <button
              onClick={() => PlacementDeleteMutation.mutate(selectedPlacement)}
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

export default Placements;
