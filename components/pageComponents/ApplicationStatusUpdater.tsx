"use client";

import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateApplicationStatus } from "@/lib/actions/jobActions";

type ApplicationStatusType = "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED";

export default function ApplicationStatusUpdater({
  applicationId,
  currentStatus,
  jobId,
  statusOptions,
}: {
  applicationId: string;
  currentStatus: ApplicationStatusType;
  jobId: string;
  statusOptions: ApplicationStatusType[];
}) {
  const handleStatusChange = async (newStatus: string) => {
    const result = await updateApplicationStatus(
      applicationId,
      newStatus as ApplicationStatusType,
      jobId
    );

    if (result.success) toast.success(result.message);
    else toast.error(result.message);
  };

  return (
    <Select defaultValue={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Change Status" />
      </SelectTrigger>
      <SelectContent className="bg-white/80 backdrop-blur-sm">
        {statusOptions.map((status) => {
          const getStatusHoverClass = (s: ApplicationStatusType) => {
            switch (s) {
              case "PENDING":
                return "hover:bg-yellow-100 hover:text-yellow-700";
              case "REVIEWED":
                return "hover:bg-blue-100 hover:text-blue-700";
              case "ACCEPTED":
                return "hover:bg-green-100 hover:text-green-700";
              case "REJECTED":
                return "hover:bg-red-100 hover:text-red-700";
              default:
                return "";
            }
          };
          return (
            <SelectItem key={status} value={status} className={getStatusHoverClass(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
