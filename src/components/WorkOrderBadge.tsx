import { Badge } from "@ui5/webcomponents-react";
import { WorkOrderStatuses } from "enums";
import useWorkOrderStatusNames from "hooks/useWorkOrderStatusNames";
import React from "react";
import { WorkOrder } from "types";

interface WorkOrderBadgeProps {
  workOrder: WorkOrder;
}

function WorkOrderBadge({ workOrder }: WorkOrderBadgeProps) {
  const woStatusNames = useWorkOrderStatusNames();

  return (
    <Badge
      colorScheme={workOrder.status === WorkOrderStatuses.Closed ? "10" : "6"}
      style={{ marginLeft: 8 }}
    >
      {woStatusNames[workOrder.status]}
    </Badge>
  );
}

export default WorkOrderBadge;
