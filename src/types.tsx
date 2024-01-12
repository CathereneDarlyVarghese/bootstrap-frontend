import { AssetTypes, WorkOrderStatuses, WorkOrderTypes } from './enums';
import { FormBuilder } from '@react-form-builder/designer';

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

export interface Member {
  id: string;
  name: string;
  orgId: string;
  cognitoId: string;
}

export interface Organization {
  org_id: string;
  org_name: string;
  org_contact: string;
  org_status: boolean;
  modified_date: string;
  modified_by: string;
}

export interface Audit {
  createdAt: string;
  createdBy: string;
}

export interface WorkOrder {
  Id: string;
  name: string;
  image: string;
  description: string;
  type: WorkOrderTypes;
  status: WorkOrderStatuses;
}

export interface Asset {
  asset_id: string;
  asset_name?: string;
  asset_type_id?: string;
  asset_notes?: string;
  asset_location?: string;
  asset_placement?: string;
  asset_section?: string;
  asset_status?: string;
  asset_finance_purchase?: number;
  asset_finance_current_value?: number;
  modified_date?: Date;
  modified_by?: string;
  org_id?: string;
  status_check_enabled?: boolean;
  images_id?: string;
  status_check_interval: number | null;
  asset_condition: string;
  asset_uuid?: string | null;
}

export interface IncomingAsset {
  asset_id: string;
  asset_name: string;
  asset_type: string;
  asset_notes: string;
  location_name: string;
  placement_name: string;
  section_name: string;
  asset_status: string;
  asset_finance_purchase: string;
  asset_finance_current_value: string;
  modified_date: string;
  modified_by: string;
  images_array: string;
  next_asset_check_date: Date;
  asset_condition: string;
  asset_type_id: string;
  status_check_enabled: boolean;
  status_check_interval: number;
  asset_location?: string;
  asset_placement?: string;
  asset_section?: string;
  asset_uuid?: string | null;
}

export interface Document {
  document_id: string;
  document_name: string;
  document_description: string;
  document_type_id: string;
  start_date: string;
  end_date: string;
  file_id: string;
  document_notes: string;
  modified_by: string;
  modified_date: string;
  org_id: string;
  asset_id: string;
  location_id: string;
  document_type: string;
}

export interface IncomingDocument {
  document_id: string;
  document_name: string;
  document_description: string;
  document_type_id: string;
  start_date: string;
  end_date: string;
  file_id: string;
  document_notes: string;
  modified_by: string;
  modified_date: string;
  org_id: string;
  asset_id: string;
  location_id: string;
  document_type: string;
}

export interface AssetCheck {
  asset_id: string;
  status_check?: string;
  file_id?: string;
  uptime_notes?: string;
  modified_by?: string;
  modified_date?: Date;
  status_check_data: JSON;
}

export interface IncomingAssetCheck {
  uptime_check_id: string;
  asset_id: string;
  status_check?: string;
  file_id?: string;
  uptime_notes?: string;
  modified_by?: string;
  modified_date?: string;
  images_array?: string[][];
  status_check_data: JSON;
}

export interface AssetLocation {
  location_id: string;
  location_name: string;
  org_id?: string;
}

export interface AssetPlacement {
  placement_id: string;
  placement_name: string;
  section_id: string;
  location_id: string;
}

export interface AssetSection {
  section_id: string;
  section_name: string;
  location_id: string;
}

export interface dubeFile {
  file_id: string;
  file_array: string[];
  modified_by_array: string[];
  modified_date_array: string[];
}

export interface AssetType {
  asset_type_id: string;
  asset_type: string;
}

export interface DocType {
  document_type_id: string;
  document_type: string;
}

export interface AssetCheckForm {
  form_id?: string;
  asset_type_id: string;
  form_json: object;
}

export interface IncomingAssetCheckForm
  extends Omit<AssetCheckForm, 'form_json'> {
  form_json: JSON;
}

export interface User {
  id: number;
  email: string; //currently this is the sub
  role: number;
  org_id: string;
}

// Arbitary Types
