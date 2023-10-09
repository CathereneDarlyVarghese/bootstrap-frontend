import axios from "axios";
import { DocType } from "../types";

const BASE_URL = process.env.REACT_APP_BASE_URL || "";

export async function createDocumentType(
  accessToken: string,
  documentType: DocType,
): Promise<DocType> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.post<DocType>(
    `${BASE_URL}/protected/document-type/`,
    JSON.stringify(documentType),
    config,
  );
  return response.data;
}

export async function getAllDocumentTypes(
  accessToken: string,
): Promise<DocType[]> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.get<DocType[]>(
    `${BASE_URL}/protected/document-type/`,
    config,
  );
  return response.data;
}

export async function getDocumentTypeById(
  accessToken: string,
  id: string,
): Promise<DocType> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.get<DocType>(
    `${process.env.REACT_APP_BASE_URL}/protected/document-type/${id}`,
    config,
  );
  return response.data;
}

export async function updateDocumentType(
  accessToken: string,
  id: string,
  updatedDocumentType: DocType,
): Promise<DocType> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.put<DocType>(
    `${BASE_URL}/protected/document-type/${id}`,
    JSON.stringify(updatedDocumentType),
    config,
  );
  return response.data;
}

export async function deleteDocumentType(
  accessToken: string,
  id: string,
): Promise<void> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  await axios.delete(`${BASE_URL}/protected/document-type/${id}`, config);
}
