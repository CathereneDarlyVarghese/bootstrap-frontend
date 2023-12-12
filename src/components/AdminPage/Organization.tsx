import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  createOrganization,
  deleteOrganization,
  getOrganizations,
} from 'services/organizationServices';
import { genericAtom, useSyncedGenericAtom } from 'store/genericStore';
import { Organization } from 'types';

const Organizations = () => {
  const queryClient = useQueryClient();
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [newOrganization, setNewOrganization] = useState<Partial<Organization>>(
    {},
  );
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, 'authToken');
  // const [data, setData] = useState<Organization[]>(null);

  const { data: OrganizationData } = useQuery({
    queryKey: ['query-OrganizationsAdmin'],
    queryFn: async () => {
      const Data = await getOrganizations(authTokenObj.authToken);
      return Data;
    },
    enabled: !!authTokenObj.authToken,
  });

  const OrganizationAddMutation = useMutation(
    (OrganizationObj: Partial<Organization>) =>
      createOrganization(authTokenObj.authToken, OrganizationObj),
    {
      onSuccess: async () => {
        toast.success('Organization Added Successfully');
        queryClient.invalidateQueries(['query-OrganizationsAdmin']);
      },
      onError: () => {
        toast.error('Failed to Add Organization');
      },
    },
  );

  const OrganizationDeleteMutation = useMutation(
    (id: string) => deleteOrganization(authTokenObj.authToken, id),
    {
      onSuccess: () => {
        toast.success('Organization deleted successfully');
        setSelectedOrganization('');
        queryClient.invalidateQueries(['query-OrganizationsAdmin']);
      },
      onError: () => {
        toast.error('Failed to delete Organization');
      },
    },
  );

  return (
    <div className="flex flex-col items-center mt-10 ">
      <div className="2xl:w-1/2 md:w-3/4 p-5 border border-slate-200 rounded-lg">
        <h3 className="font-bold text-lg">Manage Organizations </h3>
        <h2 className="font-semibold text-base">
          Current Organization:{' '}
          {OrganizationData &&
            OrganizationData.find(
              org => org.org_id === authTokenObj.attributes.org_id,
            ).org_name}{' '}
        </h2>
        {/* Add New Organization: TODO cleanup and set correct data */}
        <div className="mt-5">
          <input
            type="text"
            placeholder="Add new Organization"
            value={newOrganization.org_name}
            onChange={e => {
              console.log(e.target.value);
              setNewOrganization({
                ...newOrganization,
                org_name: e.target.value,
              });
            }}
            className="input input-sm w-full border border-slate-300 my-5"
          />
          <button
            onClick={() => {
              OrganizationAddMutation.mutate(newOrganization);
              // setNewOrganization({});
            }}
            className="btn btn-sm bg-blue-500 hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Select and Delete Organization */}
        {OrganizationData && OrganizationData.length > 0 && (
          <div>
            <select
              value={selectedOrganization}
              onChange={e => setSelectedOrganization(e.target.value)}
              className="input input-sm w-full border border-slate-300 my-5"
            >
              <option value="" disabled>
                Select a Organization
              </option>
              {OrganizationData.map(OrganizationObj => (
                <option
                  key={OrganizationObj.org_id}
                  value={OrganizationObj.org_id}
                >
                  {OrganizationObj.org_name}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                OrganizationDeleteMutation.mutate(selectedOrganization);
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

export default Organizations;
