"use client";

import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { deleteJob } from "@/lib/actions/jobActions";
import { toast } from "sonner";
import { useState } from "react";
import { useFormStatus } from "react-dom";

interface DeleteJobButtonProps {
  jobId: string;
}

export default function DeleteJobButton({ jobId }: DeleteJobButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await deleteJob(jobId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the job");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button" // Changed to button since it's handled by client
      variant="destructive"
      className="w-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center gap-2"
      onClick={handleDelete}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Deleting...
        </>
      ) : (
        <>
          <Trash2Icon className="w-4 h-4" /> Delete Job
        </>
      )}
    </Button>
  );
}