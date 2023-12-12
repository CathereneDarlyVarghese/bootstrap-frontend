import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { createUser, deleteUser, getUsers } from 'services/userServices';
import { genericAtom, useSyncedGenericAtom } from 'store/genericStore';
import { Organization, User } from 'types';
import { getOrganizations } from 'services/organizationServices';

const InviteUser = () => {
  const queryClient = useQueryClient();
  const [inviteEmailSent, setinviteEmailSent] = useState<boolean>(false);
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const [newUser, setNewUser] = useState<Partial<User>>({});
  const [authTokenObj] = useSyncedGenericAtom(genericAtom, 'authToken');
  const [data, setData] = useState<User[]>(null); // later use this to get a list of invited users
  const [orgData, setOrgData] = useState<Organization[]>(null);
  const queryLocations = queryClient.getQueryData<User[]>(['query-locations']);

  useQuery({
    queryKey: ['query-UsersAdmin'],
    queryFn: async () => {
      const UserData = await getUsers(authTokenObj.authToken);
      setData(UserData);
    },
    enabled: !!authTokenObj.authToken,
  });

  useQuery({
    queryKey: ['query-OrganizationsAdmin'],
    queryFn: async () => {
      const OrganizationData = await getOrganizations(authTokenObj.authToken);
      setOrgData(OrganizationData);
    },
    enabled: !!authTokenObj.authToken,
  });

  const UserAddMutation = useMutation(
    (UserObj: Partial<User>) => createUser(authTokenObj.authToken, UserObj),
    {
      onSuccess: async () => {
        toast.success('User Added Successfully');
        queryClient.invalidateQueries(['query-UsersAdmin']);
      },
      onError: () => {
        toast.error('Failed to Add User');
      },
    },
  );
  return (
    // First check if that the current user is a super admin or admin
    // if super admin, call the list orgs service
    // allow super admin to select orgs from drop down
    // allow super admin to enter the email of the invited user
    // save this data to the db
    <div className="flex flex-col items-center mt-10 ">
      <div className="2xl:w-1/2 md:w-3/4 p-5 border border-slate-200 rounded-lg">
        <h3 className="font-bold text-lg">Invite User </h3>
        {/* Select and Delete Organization */}
        {orgData && orgData.length > 0 && (
          <div>
            <select
              value={selectedOrganization}
              onChange={e => setSelectedOrganization(e.target.value)}
              className="input input-sm w-full border border-slate-300 my-5"
            >
              <option value="" disabled>
                Select a Organization
              </option>
              {orgData?.map(OrganizationObj => (
                <option
                  key={OrganizationObj.org_id}
                  value={OrganizationObj.org_id}
                >
                  {OrganizationObj.org_name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="mt-1">
          <input
            type="text"
            placeholder="Enter email of user to invite"
            className="input input-sm w-full border border-slate-300 my-5"
            value={newUser.email}
            onChange={e => {
              setNewUser({
                org_id: selectedOrganization,
                email: e.target.value,
                role: 1,
              });
            }}
          />
        </div>

        <button
          className="btn btn-sm bg-blue-500 hover:bg-blue-700"
          onClick={() => {
            if (newUser.org_id && newUser.email && newUser.role) {
              UserAddMutation.mutate(newUser);
              setNewUser({});
            }
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default InviteUser;
