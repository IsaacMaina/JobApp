import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // Import supabase client

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  try {
    const bucketName = "job-app-uploads"; // Placeholder bucket name
    const filePath = `${Date.now()}-${file.name.replace(/\s/g, "_")}`; // Unique file path in Supabase

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false, // Set to true if you want to overwrite existing files
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { message: "File upload failed", error: error.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      return NextResponse.json(
        { message: "Failed to get public URL for uploaded file" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: publicUrlData.publicUrl, name: file.name });
  } catch (error: any) {
    console.error("Error uploading file to Supabase:", error);
    return NextResponse.json(
      { message: "Failed to upload file", error: error.message },
      { status: 500 }
    );
  }
}
