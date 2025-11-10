import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const documentSchema = z.object({
  name: z.string().min(1, "Document name is required"),
  url: z.string().url("Invalid URL format").min(1, "Document URL is required"),
});

export const applicationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  levelOfEducation: z.string().min(1, "Level of education is required"),
  region: z.string().min(1, "Region is required"),
  residenceAddress: z.string().min(1, "State/County is required"),
  idNumber: z.string().min(1, "ID number is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  coverLetter: z
    .string()
    .min(1, "Cover letter is required")
    .max(1500, "Cover letter cannot exceed 1500 characters"),
  documents: z
    .array(documentSchema)
    .optional(), // <-- make optional
}).refine(data => {
  const phone = parsePhoneNumberFromString(data.phoneNumber, data.region as any);
  return phone && phone.isValid();
}, {
  message: 'Invalid phone number for the selected region',
  path: ['phoneNumber'],
}).refine(data => {
  // TODO: Implement region-specific national ID validation
  // This is a placeholder. In a real application, you would have a mapping
  // of regions to validation rules (e.g., regex patterns) for national IDs.
  // For now, it always returns true.
  console.log(`Validating ID for region: ${data.region}, ID: ${data.idNumber}`);
  return true;
}, {
  message: 'Invalid ID number for the selected region',
  path: ['idNumber'],
});
