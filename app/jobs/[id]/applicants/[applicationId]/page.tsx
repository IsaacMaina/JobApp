// C:\Users\isaac\Documents\NextJS\job-app\app\jobs\[id]\applicants\[applicationId]\page.tsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DocumentPreviewButton from "@/components/pageComponents/DocumentPreviewButton";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import { ApplicationStatus } from "@prisma/client";
import ApplicationStatusUpdater from "@/components/pageComponents/ApplicationStatusUpdater";

type Props = {
  params: { id: string; applicationId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params; // ✅ await the promise
  const { applicationId } = resolvedParams;
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      firstName: true,
      lastName: true,
      job: {
        select: {
          title: true,
          company: true,
        },
      },
    },
  });

  if (!application) {
    return {
      title: "Application Not Found | jobApp",
      description: "The requested application could not be found.",
    };
  }

  return {
    title: `${application.firstName} ${application.lastName}'s Application for ${application.job.title} | jobApp`,
    description: `Details for ${application.firstName} ${application.lastName}'s application to ${application.job.title} at ${application.job.company}.`,
  };
}

export default async function ApplicationDetailsPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const resolvedParams = await params; // ✅ await the promise
  const { id: jobId, applicationId } = resolvedParams;

  if (!applicationId) {
    notFound();
  }

  if (!session?.user) {
    return <div className="p-4">Please log in to view application details.</div>;
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          postedById: true, // Need this for authorization
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!application) {
    notFound();
  }

  // Authorization check: Only the job poster OR the applicant can view application details
  if (application.job.postedById !== session.user.id && application.userId !== session.user.id) {
    return <div className="p-4">You are not authorized to view these application details.</div>;
  }

  const statusOptions = Object.values(ApplicationStatus);

  // Safely parse documents, assuming it's an array of strings or objects with a 'url'
  let documents: any[] = [];
  try {
    if (application.documents) {
      documents = Array.isArray(application.documents) ? application.documents : JSON.parse(application.documents as string);
    }
  } catch (error) {
    console.error("Failed to parse documents JSON:", error);
    documents = []; // Fallback to empty array on error
  }
  documents.forEach((doc: any, index: number) => {
    console.log(`Document ${index} - Name: ${doc.name}, URL: ${doc.url}`);
  });
  console.log("Parsed documents:", documents);


  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Link href={`/jobs/${jobId}/applicants`} className="mb-6 inline-flex items-center text-red-900 hover:text-red-700">
        <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Applicants
      </Link>

      <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 lg:p-10">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Application from {application.firstName} {application.lastName}
          </h1>
          <p className="text-lg text-gray-600 mt-1">for {application.job.title} at {application.job.company}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Applicant Information</h2>
            <p className="text-gray-700 mb-1"><strong>Full Name:</strong> {application.firstName} {application.lastName}</p>
            <p className="text-gray-700 mb-1"><strong>Email:</strong> {application.user.email}</p>
            <p className="text-gray-700 mb-1"><strong>Phone Number:</strong> {application.phoneNumber}</p>
            <p className="text-gray-700 mb-1"><strong>Residence Address:</strong> {application.residenceAddress}</p>
            <p className="text-gray-700 mb-1"><strong>Level of Education:</strong> {application.levelOfEducation}</p>
            {application.idNumber && <p className="text-gray-700 mb-1"><strong>ID Number:</strong> {application.idNumber}</p>}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Application Details</h2>
            <p className="text-gray-700 mb-1"><strong>Applied On:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
            <div className="flex items-center space-x-2 mt-1">
              <strong className="text-gray-700">Status:</strong>
              <span className={`px-3 py-1 rounded-full text-sm font-medium
                ${application.status === 'PENDING' ? 'bg-yellow-200 text-yellow-800' : ''}
                ${application.status === 'REVIEWED' ? 'bg-blue-200 text-blue-800' : ''}
                ${application.status === 'ACCEPTED' ? 'bg-green-200 text-green-800' : ''}
                ${application.status === 'REJECTED' ? 'bg-red-200 text-red-800' : ''}
              `}>
                {application.status}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Cover Letter</h2>
          <div className="p-4 bg-gray-50 rounded-md border border-gray-200 whitespace-pre-wrap text-gray-800">
            {application.coverLetter}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Documents Uploaded</h2>
          {documents.length > 0 ? (
            <ul className="list-disc list-inside mt-2 text-gray-700">
              {documents.map((doc: any, index: number) => {
                const fileUrl = doc.url?.trim() || "";
                const fileName = doc.name || `Document ${index + 1}`;
                console.log(`Document ${index}: fileUrl=${fileUrl}, fileName=${fileName}`);
                return (
                  <li key={index} className="mb-2 flex items-center space-x-3">
                    <DocumentPreviewButton fileUrl={fileUrl} fileName={fileName} />
                    <span className="text-gray-800">{fileName}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-2 text-gray-600">No documents uploaded.</p>
          )}
        </div>
      </div>
    </div>
  );
}