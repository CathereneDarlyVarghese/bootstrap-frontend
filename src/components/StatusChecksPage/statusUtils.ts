import { StatusColors, StatusTexts } from "./statusTypes";

export const getStatusText = (status: string | null): string => {
  return StatusTexts[status] || StatusTexts.DEFAULT;
};

export const getStatusColor = (status: string | undefined): string => {
  console.log("status: ", status);
  return StatusColors[status] || StatusColors.DEFAULT;
};
