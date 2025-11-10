import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { applicationSchema } from "@/lib/schemas/applicationSchema";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // Keep the Promise unwrapping
) {
  try {
    const { id: jobId } = await context.params; // Correctly unwrap the Promise

    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Ensure user exists in the database
    let user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: session.user.name || 'Anonymous',
        },
      });
    }

    const userId = user.id;

    const body = await request.json();

    // Validate input
    const validation = applicationSchema.safeParse(body);
    if (!validation.success) {
      console.error("Validation errors:", validation.error.flatten()); // Add logging for validation errors
      return NextResponse.json(
        {
          message: 'Invalid input',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      title,
      firstName,
      lastName,
      levelOfEducation,
      idNumber,
      phoneNumber,
      residenceAddress,
      coverLetter,
      documents,
    } = validation.data;

    // The documents array from the client already contains name and url
    const documentsToSave = documents;

    // Check if the user already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_userId: {
          jobId,
          userId,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { message: 'You have already applied for this job' },
        { status: 409 }
      );
    }

    // Create the application
    const application = await prisma.application.create({
      data: {
        title,
        firstName,
        lastName,
        levelOfEducation,
        idNumber,
        phoneNumber,
        residenceAddress,
        coverLetter,
        documents: documentsToSave,
        jobId,
        userId,
      },
    });

    console.log("✅ Application created successfully:", application.id); // Add logging for success

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('❌ Application submission error:', error); // Add logging for error
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
