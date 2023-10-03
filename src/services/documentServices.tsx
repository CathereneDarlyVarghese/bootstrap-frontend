import axios from "axios";
import { Document, IncomingDocument } from "../types"; // Import the Document interface

// type Props = {
//   accessToken: string;
//   data?: IncomingDocument;
// };

export async function createDocument(
  accessToken: string,
  documentData: Document,
): Promise<Document> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.post<Document>(
    `${process.env.REACT_APP_BASE_URL}/protected/document/`,
    JSON.stringify(documentData),
    config,
  );
  return response.data;
}

export async function getDocumentsByLocationIdOnly(
  accessToken: string,
  id: string,
): Promise<IncomingDocument[]> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.get<IncomingDocument[]>(
    `${process.env.REACT_APP_BASE_URL}/protected/document/location/${id}`,
    config,
  );
  return response.data;
}

export async function getDocumentsByAssetId(
  accessToken: string,
  id: string,
): Promise<IncomingDocument[]> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.get<IncomingDocument[]>(
    `${process.env.REACT_APP_BASE_URL}/protected/document/asset/${id}`,
    config,
  );
  return response.data;
}

export async function getAllDocuments(
  accessToken: string,
): Promise<IncomingDocument[]> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.get<IncomingDocument[]>(
    `${process.env.REACT_APP_BASE_URL}/protected/document/`,
    config,
  );
  return response.data;
}

export async function updateDocument(
  accessToken: string,
  id: string,
  updatedData: Document,
): Promise<Document> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.put<Document>(
    `${process.env.REACT_APP_BASE_URL}/protected/document/${id}`,
    JSON.stringify(updatedData),
    config,
  );
  return response.data;
}

export async function deleteDocument(
  accessToken: string,
  id: string,
): Promise<void> {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  await axios.delete(
    `${process.env.REACT_APP_BASE_URL}/protected/document/${id}`,
    config,
  );
}
