import axios from "axios";
import { dubeFile } from "../types"; // Import the File interface

const BASE_URL = process.env.REACT_APP_BASE_URL || "";

// type Props = {
//   accessToken: string;
//   data?: File;
// };

export async function createFile(
  accessToken: string,
  fileData: dubeFile
): Promise<dubeFile> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.post<dubeFile>(
    `${BASE_URL}/protected/file/`,
    JSON.stringify(fileData),
    config
  );
  return response.data;
}

export async function getFileById(
  accessToken: string,
  id: string
): Promise<dubeFile> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.get<dubeFile>(
    `${BASE_URL}/protected/file/${id}`,
    config
  );
  return response.data;
}

export async function getAllFiles(accessToken: string): Promise<dubeFile[]> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.get<dubeFile[]>(
    `${BASE_URL}/protected/file/`,
    config
  );
  return response.data;
}

export async function updateFile(
  accessToken: string,
  id: string,
  updatedData: dubeFile
): Promise<dubeFile> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.put<dubeFile>(
    `${BASE_URL}/protected/file/${id}`,
    JSON.stringify(updatedData),
    config
  );
  return response.data;
}

export async function deleteFile(
  accessToken: string,
  id: string
): Promise<void> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  await axios.delete(`${BASE_URL}/protected/file/${id}`, config);
}

export async function appendToFileArray(
  accessToken: string,
  file_id: string,
  new_file_array_entry: string,
  new_modified_by_array_entry: string,
  new_modified_date_array_entry: string
): Promise<void> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const requestObject = {
    file_id,
    new_file_array_entry,
    new_modified_by_array_entry,
    new_modified_date_array_entry,
  };

  const response = await axios.post(
    `${BASE_URL}/protected/file/${file_id}/append`,
    requestObject,
    config
  );
  return response.data;
}

export async function replaceLatestInFileArray(
  accessToken: string,
  file_id: string,
  new_file_array_entry: string,
  new_modified_by_array_entry: string,
  new_modified_date_array_entry: string
): Promise<void> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const requestObject = {
    file_id,
    new_file_array_entry,
    new_modified_by_array_entry,
    new_modified_date_array_entry,
  };

  const response = await axios.put(
    `${BASE_URL}/protected/file/${file_id}/replace-latest`,
    requestObject,
    config
  );
  return response.data;
}
