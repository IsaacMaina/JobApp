"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Prisma, ApplicationStatus } from "@prisma/client"; // Import ApplicationStatus directly
import { jobFormSchema } from "@/lib/schemas/jobSchema";

// Define form validation schema using Zod
const updateFormSchema = jobFormSchema.extend({
  id: z.string(), // Job ID is required for updates
});

// ========================
// Create Job Server Action
// ========================
export async function createJob(
  formData: FormData,
): Promise<{ success: boolean; message: string; errors?: Record<string, string[]> }> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { success: false, message: "You must be logged in to post a job." };
  }

  const data = Object.fromEntries(formData.entries());
  const parsed = jobFormSchema.safeParse(data);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { success: false, message: "Validation failed.", errors };
  }

  const { title, company, location, type, description, salary } =
    parsed.data;
  
  // Check for duplicate job
  const existingJob = await prisma.job.findFirst({
    where: {
      title,
      company,
      location,
      description,
      // You might also want to check if it's posted by the same user
      // postedById: session.user.id!,
    },
  });

  if (existingJob) {
    return { success: false, message: "A similar job posting already exists." };
  }

  try {
    await prisma.job.create({
      data: {
        title,
        company,
        location,
        type,
        description,
        salary,
        postedById: session.user.id!,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/jobs");

    return { success: true, message: "Job posted successfully!" };
  } catch (error) {
    console.error("Prisma Error:", error);
    return { success: false, message: "Database Error: Failed to Create Job." };
  }
}

// ========================
// Update Job Server Action
// ========================
export async function updateJob(
  formData: FormData,
): Promise<{ success: boolean; message: string; errors?: Record<string, string[]> }> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { success: false, message: "You must be logged in to update a job." };
  }

  const data = Object.fromEntries(formData.entries());
  const parsed = updateFormSchema.safeParse(data);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { success: false, message: "Validation failed.", errors };
  }

  const { id, title, company, location, type, description, salary } =
    parsed.data;

  try {
    const existingJob = await prisma.job.findUnique({
      where: { id: id },
    });

    if (!existingJob || existingJob.postedById !== session.user.id) {
      return { success: false, message: "Job not found or unauthorized." };
    }

    await prisma.job.update({
      where: { id: id },
      data: {
        title,
        company,
        location,
        type,
        description,
        salary,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/jobs/${id}`);

    return { success: true, message: "Job updated successfully!" };
  } catch (error) {
    console.error("Prisma Error:", error);
    return { success: false, message: "Database Error: Failed to Update Job." };
  }
}

// ========================
// Apply for Job Action
// ========================
export async function applyForJob(jobId: string): Promise<{ success: boolean; message: string }> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { success: false, message: "You must be logged in to apply for a job." };
  }

  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { title: true },
    });

    if (!job) {
      return { success: false, message: "Job not found." };
    }

    await prisma.application.create({
      data: {
        jobId: jobId,
        userId: session.user.id!,
      },
    });

    revalidatePath(`/jobs/${jobId}`);
    revalidatePath("/dashboard");

    return { success: true, message: `Successfully applied for ${job.title}!` };
  } catch (error) {
    console.error("Error applying for job:", error);
    return { success: false, message: "Database Error: Failed to apply for job." };
  }
}

// ========================
// Distinct Value Helpers
// ========================

// Helper to safely filter out null or empty strings
function filterValidStrings(values: (string | null)[]): string[] {
  return values.filter((v): v is string => !!v && v.trim().length > 0);
}

export async function getDistinctJobTitles(filters?: Prisma.JobWhereInput) {
  const titles = await prisma.job.findMany({
    distinct: ["title"],
    select: { title: true },
    where: filters,
  });
  return filterValidStrings(titles.map((job) => job.title));
}

export async function getDistinctJobCompanies(filters?: Prisma.JobWhereInput) {
  const companies = await prisma.job.findMany({
    distinct: ["company"],
    select: { company: true },
    where: filters,
  });
  return filterValidStrings(companies.map((job) => job.company));
}

export async function getDistinctJobLocations(filters?: Prisma.JobWhereInput) {
  const locations = await prisma.job.findMany({
    distinct: ["location"],
    select: { location: true },
    where: filters,
  });
  return filterValidStrings(locations.map((job) => job.location));
}

export async function getDistinctJobTypes(filters?: Prisma.JobWhereInput) {
  const types = await prisma.job.findMany({
    distinct: ["type"],
    select: { type: true },
    where: filters,
  });
  return filterValidStrings(types.map((job) => job.type));
}

// ========================
// Delete Job Server Action
// ========================
export async function deleteJob(jobId: string): Promise<{ success: boolean; message: string }> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { success: false, message: "You must be logged in to delete a job." };
  }

  try {
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob || existingJob.postedById !== session.user.id) {
      return { success: false, message: "Job not found or unauthorized." };
    }

    await prisma.job.delete({
      where: { id: jobId },
    });

    revalidatePath("/dashboard");

    return { success: true, message: "Job deleted successfully!" };
  } catch (error) {
    console.error("Prisma Error:", error);
    return { success: false, message: "Database Error: Failed to Delete Job." };
  }
}

// ========================
// Mark Applications as Viewed Server Action
// ========================
export async function markApplicationsAsViewed(jobId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    // Optionally, return an error or throw one if not logged in
    return;
  }

  try {
    await prisma.job.update({
      where: { id: jobId, postedById: session.user.id },
      data: {
        lastViewedApplications: new Date(),
      },
    });
    revalidatePath("/dashboard"); // Revalidate dashboard to update notification counts
  } catch (error) {
    console.error("Error marking applications as viewed:", error);
  }
}

// ========================
// Update Application Status Server Action
// ========================
export async function updateApplicationStatus(
  applicationId: string,
  newStatus: ApplicationStatus, // Use ApplicationStatus directly
  jobId: string // Need jobId to revalidate the correct path
): Promise<{ success: boolean; message: string }> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { success: false, message: "You must be logged in to update application status." };
  }

  try {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: {
        job: {
          select: {
            postedById: true,
          },
        },
      },
    });

    if (!application || application.job.postedById !== session.user.id) {
      return { success: false, message: "Unauthorized to update this application." };
    }

    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: newStatus,
      },
    });

    revalidatePath(`/jobs/${jobId}/applicants`);
    revalidatePath("/dashboard");

    return { success: true, message: "Application status updated successfully!" };
  } catch (error) {
    console.error("Error updating application status:", error);
    return { success: false, message: "Database Error: Failed to update application status." };
  }
}
