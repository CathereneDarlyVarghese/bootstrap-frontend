import axios from "axios";
import { AssetLocation } from "../types"; // Import the Location interface

export async function createAssetLocation(
  accessToken: string,
  locationData: AssetLocation
): Promise<AssetLocation> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.post<AssetLocation>(
    `${process.env.REACT_APP_BASE_URL}/protected/location/`,
    JSON.stringify(locationData),
    config
  );
  return response.data;
}

export async function getAssetLocationById(
  accessToken: string,
  id: string
): Promise<AssetLocation> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.get<AssetLocation>(
    `${process.env.REACT_APP_BASE_URL}/protected/location/${id}`,
    config
  );
  return response.data;
}

export async function getAllAssetLocations(
  accessToken: string
): Promise<AssetLocation[]> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.get<AssetLocation[]>(
    `${process.env.REACT_APP_BASE_URL}/protected/location/`,
    config
  );
  return response.data;
}

export async function updateAssetLocation(
  accessToken: string,
  id: string,
  updatedData: AssetLocation
): Promise<AssetLocation> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.put<AssetLocation>(
    `${process.env.REACT_APP_BASE_URL}/protected/location/${id}`,
    JSON.stringify(updatedData),
    config
  );
  return response.data;
}

export async function deleteAssetLocation(
  accessToken: string,
  id: string
): Promise<void> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  await axios.delete(
    `${process.env.REACT_APP_BASE_URL}/protected/location/${id}`,
    config
  );
}
