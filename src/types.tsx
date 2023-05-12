import { AssetTypes, WorkOrderStatuses, WorkOrderTypes } from "./enums";

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
  id: string;
  name: string;
  members: Member[];
}

export interface Audit {
  createdAt: string;
  createdBy: string;
}

export interface WorkOrder {
  id: string;
  name: string;
  image: string;
  description: string;
  type: WorkOrderTypes;
  status: WorkOrderStatuses;
}

export interface Asset {
  orgId: string;
  id: string;
  name: string;
  location: string;
  organization: Organization;
  audit: Audit;
  workOrders: WorkOrder[];
  type: AssetTypes;
  imageS3: string;
}

export interface Documentation {
  id: string;
  name: string;
  description: string;
  type: string;
  startdate: any;
  enddate: any;
  file: any;
  user: string;
  notes: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  notes: string;
}
