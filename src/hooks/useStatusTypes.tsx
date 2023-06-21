import { StatusTypes } from "enums";

const useStatusTypeNames = () => {
  return {
    [StatusTypes.WORKING]: "WORKING",
    [StatusTypes.DOWN]: "DOWN",
    [StatusTypes.MAINTENANCE]: "Maintenance",
  };
};

export default useStatusTypeNames;
