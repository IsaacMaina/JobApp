import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  MapPinIcon,
  BriefcaseIcon,
  Building2Icon,
  CalendarIcon,
  DollarSignIcon,
  EditIcon,
  Trash2Icon,
} from "lucide-react";
import ApplyButton from "@/components/pageComponents/ApplyButton";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import JobDetailSkeleton from "@/components/pageComponents/JobDetailSkeleton";
import { formatSalary } from "@/lib/utils";
import { deleteJob } from "@/lib/actions/jobActions";
import type { Metadata } from "next";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params; // Await params here
  const job = await prisma.job.findUnique({
    where: { id },
    select: {
      title: true,
      company: true,
      description: true,
    },
  });

  if (!job) {
    return {
      title: "Job Not Found | jobApp",
      description: "The requested job could not be found.",
    };
  }

  return {
    title: `${job.title} at ${job.company} | jobApp`,
    description: job.description,
  };
}

async function JobDetailContent({ id }: { id: string }) {
  const session = await getServerSession(authOptions);

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      applications: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      postedBy: {
        // Include the user who posted the job
        select: {
          email: true, // Select the email of the user
        },
      },
    },
  });

  if (!job) {
    notFound();
  }

  // Check if the current user has already applied for this job.
  const application = session?.user
    ? await prisma.application.findUnique({
        where: { jobId_userId: { jobId: job.id, userId: session.user.id } },
      })
    : null;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="shadow-lg rounded-xl overflow-hidden">
        <div className="p-6 bg-red-900 text-amber-50">
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <div className="flex items-center mt-2">
            <Building2Icon className="w-5 h-5 mr-2" />
            <p className="text-xl">{job.company}</p>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center text-gray-700">
              <MapPinIcon className="w-5 h-5 mr-2 text-red-900" />
              <div>
                <p className="font-semibold">Location</p>
                <p>{job.location}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <BriefcaseIcon className="w-5 h-5 mr-2 text-red-900" />
              <div>
                <p className="font-semibold">Job Type</p>
                <p>{job.type}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <CalendarIcon className="w-5 h-5 mr-2 text-red-900" />
              <div>
                <p className="font-semibold">Posted On</p>
                <p>{job.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
            {application?.appliedAt && (
              <div className="flex items-center text-gray-700">
                <CalendarIcon className="w-5 h-5 mr-2 text-red-900" />
                <div>
                  <p className="font-semibold">Applied On</p>
                  <p>{new Date(application.appliedAt).toLocaleDateString()}</p>
                </div>
              </div>
            )}
            {job.salary && (
              <div className="flex items-center text-gray-700">
                <DollarSignIcon className="w-5 h-5 mr-2 text-red-900" />
                <div>
                  <p className="font-semibold">Salary</p>
                  <p>{formatSalary(job.salary)}</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-red-900 mb-4">
              Job Description
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          <div className="mt-8 text-center">
            {session?.user?.id === job.postedById ? (
              // User is the job poster, show edit/delete options and applicants
              <>
                <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 justify-center mb-6">
                  <Link href={`/jobs/post?jobId=${job.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center gap-2"
                    >
                      <EditIcon className="w-4 h-4" /> Edit Job
                    </Button>
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteJob(job.id);
                    }}
                    className="flex-1"
                  >
                    <input type="hidden" name="jobId" value={job.id} />
                    <Button
                      type="submit"
                      variant="destructive"
                      className="w-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center gap-2"
                    >
                      <Trash2Icon className="w-4 h-4" /> Delete Job
                    </Button>
                  </form>
                </div>
                {job.applications && job.applications.length > 0 && (
                  <div className="mt-8">
                    <Link href={`/jobs/${job.id}/applicants`}>
                      <Button className="w-full bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center gap-2">
                        View Applicants ({job.applications.length})
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            ) : session ? ( // User is authenticated but not the job poster
              application ? (
                <div className="flex flex-col items-center gap-4">
                  <Badge
                    className={`text-lg font-semibold ${
                      {
                        PENDING: "bg-yellow-500/20 text-yellow-700",
                        REVIEWED: "bg-blue-500/20 text-blue-700",
                        ACCEPTED: "bg-green-500/20 text-green-700",
                        REJECTED: "bg-red-500/20 text-red-700",
                      }[application.status] || "bg-gray-500/20 text-gray-700"
                    }`}
                  >
                    Status: {application.status}
                  </Badge>
                  <Link href={`/jobs/${job.id}/applicants/${application.id}`}>
                    <Button className="bg-red-900 hover:bg-red-950 text-white">
                      View My Application Details
                    </Button>
                  </Link>
                </div>
              ) : (
                // User is authenticated, not job poster, and hasn't applied
                <ApplyButton
                  jobId={job.id}
                  hasApplied={!!application}
                  jobPosterEmail={job.postedBy.email ?? ""}
                />
              )
            ) : // User is unauthenticated
            null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// This is a dynamic page that displays the details of a single job.
// The `params` object is a Promise, so we need to await it to get the ID.
export default async function JobDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = await paramsPromise;

  // It's good practice to check if the ID exists before making a database call.
  if (!params.id) {
    // If no ID is found, we can either show a generic error or a not found page.
    notFound();
  }

  return (
    <Suspense fallback={<JobDetailSkeleton />}>
      <JobDetailContent id={params.id} />
    </Suspense>
  );
}
