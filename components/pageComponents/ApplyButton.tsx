"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SendIcon, MailIcon } from "lucide-react";
import { useState } from "react";
import LoadingButton from "../ui/loading-button";

export default function ApplyButton({
  jobId,
  hasApplied,
  jobPosterEmail,
}: {
  jobId: string;
  hasApplied: boolean;
  jobPosterEmail: string;
}) {
  const router = useRouter();
  const [emailLoading, setEmailLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);

  const handleApplyClick = () => {
    setApplyLoading(true);
    // Add a small delay to show loading state before navigation
    setTimeout(() => {
      router.push(`/jobs/${jobId}/apply`);
      setApplyLoading(false);
    }, 300);
  };

  const handleEmailClick = () => {
    setEmailLoading(true);
    // A rough check to see if an email client is likely available
    // This is a heuristic and might not be 100% accurate for all platforms/configurations
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const hasEmailClient =
      isMobile || (navigator && navigator.platform !== "Win32");

    setTimeout(() => {
      if (hasEmailClient) {
        window.location.href = `mailto:${jobPosterEmail}`;
      } else {
        // Fallback to Gmail web link for desktops without a configured mail client
        window.open(
          `https://mail.google.com/mail/?view=cm&to=${jobPosterEmail}`,
          "_blank"
        );
      }
      setEmailLoading(false);
    }, 500); // Small delay to show loading state
  };

  return (
    <div className="flex flex-col gap-4">
      <LoadingButton
        onClick={handleApplyClick}
        disabled={hasApplied}
        loading={applyLoading}
        loadingText="Redirecting..."
        className="w-full bg-red-900 text-amber-50 hover:bg-red-800 px-8 py-3 text-lg disabled:bg-gray-400 flex items-center justify-center gap-2"
      >
        {hasApplied ? (
          "Applied via My Job App"
        ) : (
          <>
            <SendIcon className="w-5 h-5" /> Apply via My Job App
          </>
        )}
      </LoadingButton>
      <div className="flex flex-col items-center flex-1">
        <LoadingButton
          onClick={handleEmailClick}
          loading={emailLoading}
          loadingText="Opening email..."
          className="w-full bg-blue-900 text-amber-50 px-8 py-3 text-lg flex items-center justify-center gap-2 rounded-md hover:bg-blue-800"
        >
          <MailIcon className="w-5 h-5" />
          Apply via Email (Recommended)
        </LoadingButton>
        <p className=" text-red-500 font-semibold mb-1 text-xs">
          if applied by email, confirm your application status from this company
        </p>
      </div>
    </div>
  );
}
