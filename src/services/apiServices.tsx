import axios from 'axios';
import { Asset } from 'types';

type Props = {
  accessToken: string;
  data?: Asset;
};

export async function getInventory(accessToken: string): Promise<Asset[]> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  };

  try {
    const url = `${process.env.REACT_APP_BASE_URL}/inventory`;
    const response = await axios.get<Asset[]>(url, config);
    return response.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function addInventory(
  accessToken: string,
  assetData: Asset
): Promise<Asset[]> {
  const config = {
    headers: {
      method: 'POST',
      maxBodyLength: Infinity,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  };

  try {
    const url = `${process.env.REACT_APP_BASE_URL}/inventory`;
    const response = await axios.post<Asset[]>(
      url,
      JSON.stringify(assetData),
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}
