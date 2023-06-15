import axios from "axios";
import { DocumentType } from "../types"; // Import the DocumentType interface

const BASE_URL = process.env.REACT_APP_BASE_URL || "";

export async function getAllDocumentTypes(
    accessToken: string
  ): Promise<DocumentType[]> {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };
  
    const response = await axios.get<DocumentType[]>(
      `${BASE_URL}/protected/document-type/`,
      config
    );
    return response.data;
  }