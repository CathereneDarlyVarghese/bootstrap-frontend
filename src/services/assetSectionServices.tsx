// assetSectionService.ts
import axios from "axios";
import { AssetSection } from "../types";

type Props = {
  accessToken: string;
  data?: AssetSection;
};

export const getAssetSections = async (
  accessToken: string
): Promise<AssetSection[]> => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/protected/asset-section`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getAssetSectionById = async (
  accessToken: string,
  id: string
): Promise<AssetSection> => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/protected/asset-section/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const createAssetSection = async (
  accessToken: string,
  assetSection: AssetSection
): Promise<AssetSection> => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/protected/asset-section`,
    assetSection,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const updateAssetSection = async (
  accessToken: string,
  id: string,
  assetSection: AssetSection
): Promise<AssetSection> => {
  const response = await axios.put(
    `${process.env.REACT_APP_BASE_URL}/protected/asset-section/${id}`,
    assetSection,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const deleteAssetSection = async (
  accessToken: string,
  id: string
): Promise<void> => {
  await axios.delete(
    `${process.env.REACT_APP_BASE_URL}/protected/asset-section/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};
