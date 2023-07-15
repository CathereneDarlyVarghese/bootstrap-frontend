import { StatusTypes } from "enums";

const useStatusTypeNames = () => {
  return {
    [StatusTypes.WORKING]: "Working",
    [StatusTypes.DOWN]: "Not Working",
    [StatusTypes.MAINTENANCE]: "Needs Maintenance",
  };
};

export default useStatusTypeNames;
