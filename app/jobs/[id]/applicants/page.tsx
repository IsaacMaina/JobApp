import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import { ApplicationStatus } from "@prisma/client"; // Import ApplicationStatus directly
import ApplicationStatusUpdater from "@/components/pageComponents/ApplicationStatusUpdater";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: jobId } = await params;
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      title: true,
      company: true,
    },
  });

  if (!job) {
    return {
      title: "Applicants Not Found | jobApp",
      description: "The requested job or applicants could not be found.",
    };
  }

  return {
    title: `Applicants for ${job.title} at ${job.company} | jobApp`,
    description: `View applicants for the job "${job.title}" posted by ${job.company}.`,
  };
}

interface ApplicantsPageProps {
  params: { id: string };
}

export default async function ApplicantsPage({ params }: ApplicantsPageProps) {
  const session = await getServerSession(authOptions);
  const { id: jobId } = await params; // Await params here

  if (!session?.user) {
    return <div className="p-4">Please log in to view applicants.</div>;
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      applications: {
        select: {
          id: true, // Include application ID
          status: true, // Include application status
          createdAt: true, // Use createdAt instead of appliedAt
          user: {
            select: {
              name: true,
              email: true, // Optionally include email
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!job) {
    notFound();
  }

  // Ensure only the job poster can view the applicants
  if (job.postedById !== session.user.id) {
    return <div className="p-4">You are not authorized to view these applicants.</div>;
  }

  const statusOptions = Object.values(ApplicationStatus);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Link href={`/jobs/${job.id}`} className="mb-4 inline-flex items-center text-red-900 hover:text-red-700">
        <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Job Details
      </Link>
      <Card className="shadow-lg rounded-xl overflow-hidden mt-4">
        <CardHeader className="bg-red-900 text-amber-50">
          <CardTitle className="text-2xl font-bold">Applicants for {job.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {job.applications.length === 0 ? (
            <p>No applicants yet for this job.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {job.applications.map((application) => (
                <li key={application.id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{application.user.name}</p>
                    {application.user.email && (
                      <p className="text-sm text-gray-600">{application.user.email}</p>
                    )}
                    <p className="text-sm text-gray-500">Applied on: {new Date(application.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApplicationStatusUpdater
                      applicationId={application.id}
                      currentStatus={application.status}
                      jobId={jobId}
                      statusOptions={statusOptions}
                    />
                    <Link href={`/jobs/${jobId}/applicants/${application.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
