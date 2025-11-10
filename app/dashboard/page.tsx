import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardClient from "./DashboardClient";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";
import DashboardSkeleton from "@/components/pageComponents/DashboardSkeleton";
import EditProfileButton from "./EditProfileButton";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return <div className="p-4">Please log in to view your dashboard.</div>;
  }

  const userId = session.user.id;

  // Fetch jobs posted by the current user
  const userJobs = await prisma.job.findMany({
  where: { postedById: userId },
  select: {
    id: true,
    title: true,
    company: true,
    location: true,
    type: true,
    description: true,
    salary: true,
    createdAt: true,
    lastViewedApplications: true,
    _count: { select: { applications: true } }, // ✅ moved inside select
    applications: { // Include applications data
      select: {
        userId: true,
        createdAt: true,
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
});


  // Fetch jobs the user has applied for
  const appliedJobsData = await prisma.application.findMany({
    where: {
      userId: userId,
    },
    include: {
      job: true,
    },
              orderBy: {
                createdAt: "desc",    },
  });

  const appliedJobs = appliedJobsData.map(app => ({...app.job, status: app.status, appliedAt: app.appliedAt}));

  // Map Prisma Job objects to ClientJob objects for client-side serialization
  const serializedJobs = userJobs.map(job => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.type,
    description: job.description,
    salary: job.salary,
    createdAt: job.createdAt.toISOString(), // Convert Date to ISO string
    applicationsCount: job._count.applications, // Include applications count
    lastViewedApplications: job.lastViewedApplications?.toISOString() || null, // Include lastViewedApplications
    applications: job.applications.map(app => ({
      userId: app.userId,
      appliedAt: app.createdAt ? app.createdAt.toISOString() : null,
    })),
  }));

  const serializedAppliedJobs = appliedJobs.map(app => ({
    id: app.id,
    title: app.title,
    company: app.company,
    location: app.location,
    type: app.type,
    description: app.description,
    salary: app.salary,
    createdAt: app.createdAt.toISOString(), // Convert Date to ISO string
    status: app.status,
    appliedAt: app.appliedAt ? app.appliedAt.toISOString() : null,
  }));

  // Server Action for deleting a job
  async function deleteJob(formData: FormData) {
    "use server";
    const jobId = formData.get("jobId") as string;

    if (!jobId) {
      console.error("Job ID is missing for deletion.");
      return;
    }

    if (!session?.user?.id || session.user.id !== userId) {
      console.error("Unauthorized attempt to delete job.");
      return;
    }

    try {
      await prisma.job.delete({
        where: {
          id: jobId,
          postedById: userId, // Ensure only the owner can delete
        },
      });
      revalidatePath("/dashboard"); // Revalidate to refresh the list
    } catch (error) {
      console.error("Error deleting job:", error);
      // Optionally, handle error more gracefully, e.g., return a message to the user
    }
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <div className="p-4">
        <div className="flex justify-end mb-4">
          <EditProfileButton />
        </div>
        <DashboardClient jobs={serializedJobs} appliedJobs={serializedAppliedJobs} />
      </div>
    </Suspense>
  );
}
