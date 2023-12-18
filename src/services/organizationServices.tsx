// OrganizationService.ts
import axios from 'axios';
import { Organization } from 'types';

// type Props = {
//   accessToken: string;
//   data?: Organization;
// };

export const getOrganizations = async (
  accessToken: string,
): Promise<Organization[]> => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/protected/organization/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return Array.isArray(response.data) ? response.data : [response.data];
};

export const getOrganizationById = async (
  accessToken: string,
  id: string,
): Promise<Organization> => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/protected/organization/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const createOrganization = async (
  accessToken: string,
  organization: Partial<Organization>,
): Promise<Organization> => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/protected/organization/`,
    organization,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const updateOrganization = async (
  accessToken: string,
  id: string,
  organization: Organization,
): Promise<Organization> => {
  const response = await axios.put(
    `${process.env.REACT_APP_BASE_URL}/protected/organization/${id}`,
    organization,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const deleteOrganization = async (
  accessToken: string,
  id: string,
): Promise<void> => {
  await axios.delete(
    `${process.env.REACT_APP_BASE_URL}/protected/organization/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
};
