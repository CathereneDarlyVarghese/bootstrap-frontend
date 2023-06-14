import axios from "axios";
import { Asset, IncomingAsset } from "types"; // ensure the Asset type is defined

type Props = {
  accessToken: string;
  data?: Asset;
};

export async function getAllAssets(
  accessToken: string
): Promise<IncomingAsset[]> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const url = `${process.env.REACT_APP_BASE_URL}/protected/asset/`;
    const response = await axios.get<IncomingAsset[]>(url, config);
    return response.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getAssets(
  accessToken: string,
  id: string
): Promise<IncomingAsset[] | null> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const url = `${process.env.REACT_APP_BASE_URL}/protected/asset/${id}`;
    const response = await axios.get<IncomingAsset[]>(url, config);
    console.log(response);
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function createAsset(
  accessToken: string,
  assetData: Asset
): Promise<Asset> {
  const config = {
    headers: {
      method: "POST",
      maxBodyLength: Infinity,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const url = `${process.env.REACT_APP_BASE_URL}/protected/asset/`;
    const response = await axios.post<Asset>(
      url,
      JSON.stringify(assetData),
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function updateAsset(
  accessToken: string,
  id: string,
  assetData: Asset
): Promise<Asset> {
  const config = {
    headers: {
      method: "PUT",
      maxBodyLength: Infinity,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const url = `${process.env.REACT_APP_BASE_URL}/protected/asset/${id}`;
    const response = await axios.put<Asset>(
      url,
      JSON.stringify(assetData),
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function deleteAsset(
  accessToken: string,
  id: string
): Promise<void> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const url = `${process.env.REACT_APP_BASE_URL}/protected/asset/${id}`;
    await axios.delete(url, config);
    console.log(`Deleted asset with id: ${id}`);
  } catch (err) {
    console.log(err);
    throw err;
  }
}
