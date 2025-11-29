"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingButton from "@/components/ui/loading-button";
import { toast } from "sonner";

interface ViewDetailsButtonProps {
  jobId: string;
}

export default function ViewDetailsButton({ jobId }: ViewDetailsButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    setIsLoading(true);

    if (status === "unauthenticated") {
      // Show toast notification and redirect to login
      toast.info("Please log in to view job details");
      setTimeout(() => {
        setIsLoading(false);
        router.push("/auth/login");
      }, 1000); // Brief delay to show loading state
    } else {
      // If authenticated, proceed to job details
      router.push(`/jobs/${jobId}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <Link href={`/jobs/${jobId}`} onClick={handleClick} className="block">
        <LoadingButton
          loading={isLoading}
          loadingText="Checking auth..."
          className="w-full bg-red-900 text-amber-50 hover:bg-red-800 flex items-center justify-center gap-2"
        >
          View Details <ArrowRightIcon className="w-4 h-4" />
        </LoadingButton>
      </Link>
    </div>
  );
}