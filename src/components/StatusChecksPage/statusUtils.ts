import { StatusColors, StatusTexts } from './statusTypes';

export const getStatusText = (status: string | null): string =>
  StatusTexts[status] || StatusTexts.DEFAULT;

export const getStatusColor = (status: string | undefined): string =>
  StatusColors[status] || StatusColors.DEFAULT;
