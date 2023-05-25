import axios from "axios";
import { Asset, WorkOrder } from "types";

type Props = {
  accessToken: string;
  data?: Asset;
};

export async function getInventory(accessToken: string): Promise<Asset[]> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
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

export async function getAsset(
  accessToken: string,
  id: string
): Promise<Asset | null> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const url = `${process.env.REACT_APP_BASE_URL}/inventory/${id}`;
    const response = await axios.get<Asset>(url, config);
    console.log(response);
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function addInventory(
  accessToken: string,
  assetData: Asset
): Promise<Asset[]> {
  const config = {
    headers: {
      method: "POST",
      maxBodyLength: Infinity,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
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

export async function addWorkOrder(
  accessToken: string,
  inventoryId: string, //Inventory Id is same as Asset Id
  workOrderData: WorkOrder
): Promise<WorkOrder> {
  const config = {
    headers: {
      method: "POST",
      maxBodyLength: Infinity,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const url = `${process.env.REACT_APP_BASE_URL}/${inventoryId}/workorder`;
    const response = await axios.post<WorkOrder>(
      url,
      JSON.stringify(workOrderData),
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function deleteInventory(
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
    const url = `${process.env.REACT_APP_BASE_URL}/inventory/${id}`;
    await axios.delete(url, config);
    console.log(`Deleted inventory with id: ${id}`);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function updateWorkOrderStatus(
  accessToken: string,
  inventoryId: string,
  workOrderId: string,
  status: string
): Promise<WorkOrder> {
  const config = {
    headers: {
      method: "PATCH",
      maxBodyLength: Infinity,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const url = `${process.env.REACT_APP_BASE_URL}/inventory/${inventoryId}/workorder/${workOrderId}`;
    const response = await axios.post<WorkOrder>(
      url,
      JSON.stringify({ status: status }),
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
