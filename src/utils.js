import { badge as statuses } from "@/data.js";
export const getProcessedData = (data) => {
  return data.map(({ createdAt, resolvedAt, status, ...rest }) => {
    return {
      ...rest,
      createdAt: new Date(createdAt).toLocaleDateString(),
      resolvedAt: resolvedAt ? new Date(resolvedAt).toLocaleDateString() : null,
      createdAtLong: new Date(createdAt).toLocaleString(),
      resolvedAtLong: resolvedAt ? new Date(resolvedAt).toLocaleString() : null,
      status: { key: status, ...statuses[status] },
    };
  });
};
