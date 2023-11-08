import { WorkOrderStatuses } from 'enums';

const useWorkOrderStatusNames = () => ({
  [WorkOrderStatuses.Closed]: 'Closed',
  [WorkOrderStatuses.Open]: 'Open',
});

export default useWorkOrderStatusNames;
