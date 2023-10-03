// assetCheckFormService.ts
import axios from "axios";
import { AssetCheckForm, IncomingAssetCheckForm } from "../types";

export const getAssetCheckForms = async (
  accessToken: string,
): Promise<IncomingAssetCheckForm[]> => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/protected/asset-check-form/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};

export const getAssetCheckFormById = async (
  accessToken: string,
  id: string,
): Promise<IncomingAssetCheckForm> => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/protected/asset-check-form/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};

export const createAssetCheckForm = async (
  accessToken: string,
  assetCheckForm: AssetCheckForm,
): Promise<AssetCheckForm> => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/protected/asset-check-form/`,
    assetCheckForm,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};

export const updateAssetCheckForm = async (
  accessToken: string,
  id: string,
  assetCheckForm: AssetCheckForm,
): Promise<AssetCheckForm> => {
  const response = await axios.put(
    `${process.env.REACT_APP_BASE_URL}/protected/asset-check-form/${id}`,
    assetCheckForm,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};

export const deleteAssetCheckForm = async (
  accessToken: string,
  id: string,
): Promise<void> => {
  await axios.delete(
    `${process.env.REACT_APP_BASE_URL}/protected/asset-check-form//${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
};
