"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SendIcon, MailIcon } from "lucide-react";

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

  const handleEmailClick = () => {
    // A rough check to see if an email client is likely available
    // This is a heuristic and might not be 100% accurate for all platforms/configurations
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const hasEmailClient =
      isMobile || (navigator && navigator.platform !== "Win32");

    if (hasEmailClient) {
      window.location.href = `mailto:${jobPosterEmail}`;
    } else {
      // Fallback to Gmail web link for desktops without a configured mail client
      window.open(
        `https://mail.google.com/mail/?view=cm&to=${jobPosterEmail}`,
        "_blank"
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => router.push(`/jobs/${jobId}/apply`)}
        disabled={hasApplied}
        className="w-full bg-red-900 text-amber-50 hover:bg-red-800 px-8 py-3 text-lg disabled:bg-gray-400 flex items-center justify-center gap-2"
      >
        {hasApplied ? (
          "Applied via My Job App"
        ) : (
          <>
            <SendIcon className="w-5 h-5" /> Apply via My Job App
          </>
        )}
      </Button>
      <div className="flex flex-col items-center flex-1">
        <Button
          onClick={handleEmailClick}
          className="w-full bg-blue-900 text-amber-50 px-8 py-3 text-lg flex items-center justify-center gap-2 rounded-md hover:bg-blue-800"
        >
          <MailIcon className="w-5 h-5" />
          Apply via Email (Recommended)
        </Button>
        <p className=" text-red-500 font-semibold mb-1 text-xs">
          if applied by email, confirm your application status from this company
        </p>
      </div>
    </div>
  );
}
