// assetPlacementService.ts
import axios from 'axios';
import { AssetPlacement } from '../types';

// type Props = {
//   accessToken: string;
//   data?: AssetPlacement;
// };

export const getAssetPlacements = async (
  accessToken: string,
): Promise<AssetPlacement[]> => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/protected/asset-placement/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const getAssetPlacementById = async (
  accessToken: string,
  id: string,
): Promise<AssetPlacement> => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/protected/asset-placement/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const createAssetPlacement = async (
  accessToken: string,
  assetPlacement: AssetPlacement,
): Promise<AssetPlacement> => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/protected/asset-placement/`,
    assetPlacement,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const updateAssetPlacement = async (
  accessToken: string,
  id: string,
  assetPlacement: AssetPlacement,
): Promise<AssetPlacement> => {
  const response = await axios.put(
    `${process.env.REACT_APP_BASE_URL}/protected/asset-placement/${id}`,
    assetPlacement,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const deleteAssetPlacement = async (
  accessToken: string,
  id: string,
): Promise<void> => {
  await axios.delete(
    `${process.env.REACT_APP_BASE_URL}/protected/asset-placement/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
};
