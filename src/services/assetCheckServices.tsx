// assetCheckService.ts
import axios from "axios";
import { AssetCheck, IncomingAssetCheck } from "../types";

// type Props = {
//   accessToken: string;
//   data?: AssetCheck;
// };

export const getAssetChecks = async (
  accessToken: string,
): Promise<IncomingAssetCheck[]> => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/protected/asset-check/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};

export const getAssetCheckById = async (
  accessToken: string,
  id: string,
): Promise<IncomingAssetCheck[]> => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/protected/asset-check/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};

export const createAssetCheck = async (
  accessToken: string,
  assetCheck: AssetCheck,
): Promise<AssetCheck> => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/protected/asset-check/`,
    assetCheck,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};

export const updateAssetCheck = async (
  accessToken: string,
  id: string,
  assetCheck: AssetCheck,
): Promise<AssetCheck> => {
  const response = await axios.put(
    `${process.env.REACT_APP_BASE_URL}/protected/asset-check/${id}`,
    assetCheck,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};

export const deleteAssetCheck = async (
  accessToken: string,
  id: string,
): Promise<void> => {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };
  await axios.delete(
    `${process.env.REACT_APP_BASE_URL}/protected/asset-check/${id}`,
    config,
  );
};
