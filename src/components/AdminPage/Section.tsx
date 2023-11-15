import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  createAssetSection,
  deleteAssetSection,
  getAssetSections,
} from 'services/assetSectionServices';
import { genericAtom, useSyncedGenericAtom } from 'store/genericStore';
import { AssetLocation, AssetSection } from 'types';

const Sections = () => {
  const queryClient = useQueryClient();
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [newSectionName, setNewSectionName] = useState('');
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, 'authToken');
  const [data, setData] = useState<AssetSection[]>(null);

  const queryLocations = queryClient.getQueryData<AssetLocation[]>([
    'query-locations',
  ]);

  useQuery({
    queryKey: ['query-SectionsAdmin'],
    queryFn: async () => {
      const SectionData = await getAssetSections(authTokenObj.authToken);
      setData(SectionData);
    },
    enabled: !!authTokenObj.authToken,
  });

  const SectionAddMutation = useMutation(
    (assetSectionObj: AssetSection) =>
      createAssetSection(authTokenObj.authToken, assetSectionObj),
    {
      onSuccess: async () => {
        toast.success('Asset Added Successfully');
        queryClient.invalidateQueries(['query-SectionsAdmin']);
      },
      onError: () => {
        toast.error('Failed to Add Asset');
      },
    },
  );

  const SectionDeleteMutation = useMutation(
    (id: string) => deleteAssetSection(authTokenObj.authToken, id),
    {
      onSuccess: () => {
        toast.success('Section deleted successfully');
        setSelectedSection('');
        queryClient.invalidateQueries(['query-SectionsAdmin']);
      },
      onError: () => {
        toast.error('Failed to delete Section');
      },
    },
  );

  return (
    <div className="flex flex-col items-center mt-10 ">
      <div className="2xl:w-1/2 md:w-3/4 p-5 border border-slate-200 rounded-lg">
        <h3 className="font-bold text-lg">Manage Sections</h3>

        {queryLocations && queryLocations.length > 0 && (
          <div>
            <select
              required
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="input input-sm w-full border border-slate-300 my-5"
            >
              <option value="" disabled>
                Select a Location
              </option>
              {queryLocations.map(Location => (
                <option key={Location.location_id} value={Location.location_id}>
                  {Location.location_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Add New Section */}
        <div className="mt-5">
          <input
            type="text"
            placeholder="Add new Section"
            value={newSectionName}
            onChange={e => setNewSectionName(e.target.value)}
            className="input input-sm w-full border border-slate-300 my-5"
          />
          <button
            onClick={() => {
              if (!selectedLocation) {
                toast.error('Please select a location first!');
                return;
              }
              SectionAddMutation.mutate({
                section_id: '',
                section_name: newSectionName,
                location_id: selectedLocation,
              });
              setNewSectionName('');
            }}
            className="btn btn-sm bg-blue-900 hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Select and Delete Section */}
        {data && data.length > 0 && (
          <div>
            <select
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
              className="input input-sm w-full border border-slate-300 my-5"
            >
              <option value="" disabled>
                Select a Section
              </option>
              {data
                .filter(Section => Section.location_id === selectedLocation)
                .map(Section => (
                  <option key={Section.section_id} value={Section.section_id}>
                    {Section.section_name}
                  </option>
                ))}
            </select>
            <button
              onClick={() => {
                SectionDeleteMutation.mutate(selectedSection);
              }}
              className="btn btn-sm bg-red-600 border-0 hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sections;
