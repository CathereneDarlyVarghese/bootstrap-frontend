import { StatusTypes } from "enums";

const useStatusTypeNames = () => {
  return {
    [StatusTypes.ACTIVE]: "Active",
    [StatusTypes.INACTIVE]: "Inactive",
    [StatusTypes.MAINTENANCE]: "Maintenance",
  };
};

export default useStatusTypeNames;
