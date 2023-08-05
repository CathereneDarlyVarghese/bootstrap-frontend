import axios from "axios";
import { AssetCondition } from "enums";
// import useAssetCondition from "hooks/useAssetCondition";
import { Asset, IncomingAsset } from "types"; // ensure the Asset type is defined

// type Props = {
//   accessToken: string;
//   data?: Asset;
// };

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
  assetData: Partial<Asset>
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
    console.error("Error updating asset:", err);
    throw new Error("Failed to update asset. Please try again.");
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

export async function toggleAssetCondition(
  accessToken: string,
  id: string,
  changedCondition: string
): Promise<void> {
  const assetConditionMap: Record<string, string> = {
    [AssetCondition.ACTIVE]: "ACTIVE",
    [AssetCondition.INACTIVE]: "INACTIVE",
    // Add more condition mappings if needed
  };

  console.log("changed condition=>", changedCondition);

  const toggledConditionText =
    changedCondition === assetConditionMap[AssetCondition.ACTIVE]
      ? assetConditionMap[AssetCondition.ACTIVE]
      : assetConditionMap[AssetCondition.INACTIVE];

  const toggledConditionUUID = Object.keys(assetConditionMap).find(
    (key) => assetConditionMap[key] === toggledConditionText
  );

  if (!toggledConditionUUID) {
    throw new Error(`Invalid asset condition: ${toggledConditionText}`);
  }

  const assetData: Partial<Asset> = {
    asset_condition: toggledConditionUUID,
  };
  console.log("asset data ==>>", assetData);
  await updateAsset(accessToken, id, assetData);
}
