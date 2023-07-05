import axios from "axios";
import { File } from "../types"; // Import the File interface

const BASE_URL = process.env.REACT_APP_BASE_URL || "";

type Props = {
  accessToken: string;
  data?: File;
};

export async function createFile(
  accessToken: string,
  fileData: File
): Promise<File> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.post<File>(
    `${BASE_URL}/protected/file/`,
    JSON.stringify(fileData),
    config
  );
  return response.data;
}

export async function getFileById(
  accessToken: string,
  id: string
): Promise<File> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.get<File>(
    `${BASE_URL}/protected/file/${id}`,
    config
  );
  return response.data;
}

export async function getAllFiles(accessToken: string): Promise<File[]> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.get<File[]>(
    `${BASE_URL}/protected/file/`,
    config
  );
  return response.data;
}

export async function updateFile(
  accessToken: string,
  id: string,
  updatedData: File
): Promise<File> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.put<File>(
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
  fileId: string,
  newEntry: string
): Promise<void> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.post(
    `${BASE_URL}/protected/file/${fileId}/append`,
    newEntry,
    config
  );
  return response.data;
}

export async function replaceLatestInFileArray(
  accessToken: string,
  fileId: string,
  newEntry: string
): Promise<void> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.put(
    `${BASE_URL}/protected/file/${fileId}/replace-latest`,
    newEntry,
    config
  );
  return response.data;
}
