"use client";

import { useState, useEffect } from "react"; // Added useEffect
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNowStrict } from "date-fns";
import {
  MapPinIcon,
  BriefcaseIcon,
  Building2Icon,
  ArrowRightIcon,
  EditIcon,
  Trash2Icon,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import EditJobForm from "@/components/pageComponents/EditJobForm";
import { toast } from "sonner";
import { formatSalary } from "@/lib/utils";
import { deleteJob, markApplicationsAsViewed } from "@/lib/actions/jobActions";
import { useSession } from "next-auth/react"; // Added useSession

// Define a client-safe Job type that matches the data passed from the server
interface ClientJob {
  id: string;
  title: string;
  company: string;
  location: string | null;
  type: string;
  description: string;
  salary: number | null;
  createdAt: string; // Add createdAt as a string for serialization
  status?: string;
  appliedAt?: string; // Add appliedAt as a string for serialization
  applicationsCount?: number; // New: Total count of applications for this job
  lastViewedApplications?: string | null; // New: Timestamp of last view
  applications?: { userId: string; appliedAt: string }[]; // New: To calculate new applications
}

interface DashboardClientProps {
  jobs: ClientJob[];
  appliedJobs: ClientJob[];
}

const INITIAL_DISPLAY_LIMIT = 3;

export default function DashboardClient({
  jobs,
  appliedJobs,
}: DashboardClientProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAllPostedJobs, setShowAllPostedJobs] = useState(false);
  const [showAllAppliedJobs, setShowAllAppliedJobs] = useState(false);

  const { data: session, update } = useSession(); // Use useSession hook

  useEffect(() => {
    if (session?.user?.isNewUser) {
      toast.success("New user added successfully!");
      update({ isNewUser: false }); // Clear the flag
    }
  }, [session, update]);

  const displayedPostedJobs = showAllPostedJobs
    ? jobs
    : jobs.slice(0, INITIAL_DISPLAY_LIMIT);
  const displayedAppliedJobs = showAllAppliedJobs
    ? appliedJobs
    : appliedJobs.slice(0, INITIAL_DISPLAY_LIMIT);

  const handleDelete = async (jobId: string) => {
    setDeletingId(jobId);
    try {
      const result = await deleteJob(jobId);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Posted Jobs Section */}
      <h2 className="text-2xl font-bold text-red-900 mb-6">
        Jobs That You Posted({jobs.length})
      </h2>
      {jobs.length === 0 ? (
        <p>You haven't posted any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPostedJobs.map((job) => {
            // Calculate new applications since last view
            const newApplicationsCount =
              job.lastViewedApplications === null
                ? job.applicationsCount
                : job.applications
                ? job.applications.filter(
                    (app) =>
                      new Date(app.appliedAt) >
                      new Date(job.lastViewedApplications!)
                  ).length
                : 0;

            return (
              <Card
                key={job.id}
                className="relative flex flex-col shadow-md rounded-xl hover:shadow-lg transition-shadow duration-200"
              >
                <Badge className="absolute bg-green-500/20 top-2 left-2">
                  <span className="text-xs">
                    Posted:{" "}
                    {formatDistanceToNowStrict(new Date(job.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </Badge>
                {newApplicationsCount !== undefined &&
                  newApplicationsCount > 0 && (
                    <Badge className="absolute bg-blue-500/20 top-2 right-2 flex items-center gap-1 animate-pulse">
                      <span className="text-xs font-bold">
                        New: {newApplicationsCount}
                      </span>
                    </Badge>
                  )}
                <CardTitle className="mt-10 p-4 flex flex-col gap-2 text-left w-full">
                  <h2 className="font-bold text-xl text-red-900">
                    {job.title}
                  </h2>
                  <span className="flex items-center text-gray-700">
                    <Building2Icon className="w-4 h-4 mr-2" /> {job.company}
                  </span>
                  <span className="flex items-center text-gray-700">
                    <MapPinIcon className="w-4 h-4 mr-2" /> {job.location}
                  </span>
                  <span className="flex items-center text-gray-700">
                    <BriefcaseIcon className="w-4 h-4 mr-2" /> {job.type}
                  </span>
                </CardTitle>

                <CardContent className="p-4 pt-0 flex flex-col justify-between ">
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {job.description}
                  </p>
                  {job.salary && (
                    <p className="text-gray-800 font-semibold mb-4">
                      Salary: {formatSalary(job.salary)}
                    </p>
                  )}

                  <div className="mt-4 flex flex-col space-y-2">
                    <Link href={`/jobs/${job.id}`} className="flex-1">
                      <Button
                        className="w-full bg-red-900 text-amber-50 hover:bg-red-800 flex items-center justify-center gap-2"
                        onClick={async () => {
                          await markApplicationsAsViewed(job.id);
                        }}
                      >
                        View Details <ArrowRightIcon className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      {jobs.length > INITIAL_DISPLAY_LIMIT && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAllPostedJobs(!showAllPostedJobs)}
            className="border-red-900 text-red-900 hover:bg-red-50"
          >
            {showAllPostedJobs ? "Show Less" : "View More Posted Jobs"}
          </Button>
        </div>
      )}

      {/* Applied Jobs Section */}
      <h2 className="text-2xl font-bold text-red-900 mb-6 mt-12">
        Jobs That You Applied ({appliedJobs.length})
      </h2>
      {appliedJobs.length === 0 ? (
        <p>You haven't applied for any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedAppliedJobs.map((job) => (
            <Card
              key={job.id}
              className="relative flex flex-col shadow-md rounded-xl hover:shadow-lg transition-shadow duration-200"
            >
              <Badge className="absolute bg-green-500/20 top-2 left-2">
                <span className="text-xs">
                  Posted:{" "}
                  {formatDistanceToNowStrict(new Date(job.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </Badge>
              {job.appliedAt && (
                <Badge className="absolute bg-blue-500/20 top-2 left-2 mt-6">
                  <span className="text-xs">
                    Applied:{" "}
                    {formatDistanceToNowStrict(new Date(job.appliedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </Badge>
              )}
              {job.status && (
                <Badge
                  className={`absolute top-2 right-2 ${
                    {
                      PENDING: "bg-yellow-500/20 text-yellow-700",
                      REVIEWED: "bg-blue-500/20 text-blue-700",
                      ACCEPTED: "bg-green-500/20 text-green-700",
                      REJECTED: "bg-red-500/20 text-red-700",
                    }[job.status] || "bg-gray-500/20 text-gray-700"
                  }`}
                >
                  {job.status}
                </Badge>
              )}

              <CardTitle className="mt-10 p-4 flex flex-col gap-2 text-left w-full">
                <h2 className="font-bold text-xl text-red-900">{job.title}</h2>
                <span className="flex items-center text-gray-700">
                  <Building2Icon className="w-4 h-4 mr-2" /> {job.company}
                </span>
                <span className="flex items-center text-gray-700">
                  <MapPinIcon className="w-4 h-4 mr-2" /> {job.location}
                </span>
                <span className="flex items-center text-gray-700">
                  <BriefcaseIcon className="w-4 h-4 mr-2" /> {job.type}
                </span>
              </CardTitle>

              <CardContent className="p-4 pt-0 flex flex-col justify-between flex-grow">
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {job.description}
                </p>
                {job.salary && (
                  <p className="text-gray-800 font-semibold mb-4">
                    Salary: {formatSalary(job.salary)}
                  </p>
                )}
                <div className="mt-4">
                  <Link href={`/jobs/${job.id}`}>
                    <Button className="w-full bg-red-900 text-amber-50 hover:bg-red-800 flex items-center justify-center gap-2">
                      View Details <ArrowRightIcon className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {appliedJobs.length > INITIAL_DISPLAY_LIMIT && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAllAppliedJobs(!showAllAppliedJobs)}
            className="border-red-900 text-red-900 hover:bg-red-50"
          >
            {showAllAppliedJobs ? "Show Less" : "View More Applied Jobs"}
          </Button>
        </div>
      )}
    </div>
  );
}
