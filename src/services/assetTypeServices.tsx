import axios from "axios";
import { AssetType } from "../types"; // Import the AssetType interface

const BASE_URL = process.env.REACT_APP_BASE_URL || "";

export async function createAssetType(
  accessToken: string,
  assetType: AssetType
): Promise<AssetType> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.post<AssetType>(
    `${BASE_URL}/protected/asset-type/`,
    JSON.stringify(assetType),
    config
  );
  return response.data;
}

export async function getAssetTypeById(
  accessToken: string,
  id: string
): Promise<AssetType> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.get<AssetType>(
    `${BASE_URL}/protected/asset-type/${id}`,
    config
  );
  return response.data;
}

export async function getAllAssetTypes(
  accessToken: string
): Promise<AssetType[]> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.get<AssetType[]>(
    `${BASE_URL}/protected/asset-type/`,
    config
  );
  return response.data;
}

export async function updateAssetType(
  accessToken: string,
  id: string,
  updatedAssetType: AssetType
): Promise<AssetType> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.put<AssetType>(
    `${BASE_URL}/protected/asset-type/${id}`,
    JSON.stringify(updatedAssetType),
    config
  );
  return response.data;
}

export async function deleteAssetType(
  accessToken: string,
  id: string
): Promise<void> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  await axios.delete(`${BASE_URL}/protected/asset-types/${id}`, config);
}
