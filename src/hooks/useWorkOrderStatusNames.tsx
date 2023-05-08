import { WorkOrderStatuses } from "enums";

const useWorkOrderStatusNames = () => {
  return {
    [WorkOrderStatuses.Closed]: "Closed",
    [WorkOrderStatuses.Open]: "Open",
  };
};

export default useWorkOrderStatusNames;
