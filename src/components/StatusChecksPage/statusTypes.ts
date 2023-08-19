import { StatusTypes } from "enums";

export const StatusColors = {
  [StatusTypes.WORKING]: "bg-green-400",
  [StatusTypes.DOWN]: "bg-red-400",
  [StatusTypes.MAINTENANCE]: "bg-yellow-400",
  DEFAULT: "bg-gray-400",
};

export const StatusTexts = {
  [StatusTypes.WORKING]: "WORKING",
  [StatusTypes.DOWN]: "DOWN",
  [StatusTypes.MAINTENANCE]: "Maintenance",
  DEFAULT: "",
};
