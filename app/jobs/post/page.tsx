'use client';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea"; // Added Textarea import
import { createJob } from "@/lib/actions/jobActions"; // Added createJob import
import { toast } from "sonner"; // Added toast import
import { useRouter } from "next/navigation"; // Added useRouter import
import { SendIcon, Loader2 } from "lucide-react"; // Added icons import
import { useState } from "react"; // Added useState import
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod"; // Import zodResolver
import { jobFormSchema } from "@/lib/schemas/jobSchema"; // Import jobFormSchema

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Temporary", "Volunteer"];

interface PostJobFormValues {
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: number;
  description: string; // Added description to interface
}

export default function Page() { // Renamed to Page
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  const form = useForm<PostJobFormValues>({
    resolver: zodResolver(jobFormSchema), // Add zodResolver
    defaultValues: {
      title: '',
      company: '',
      location: '',
      type: '',
      salary: undefined,
      description: '', // Added description default value
    },
  });

  const { handleSubmit, reset, watch, control, formState: { errors } } = form;

  const onSubmit = async (data: PostJobFormValues) => { // Made async
    setLoading(true);
    try {
      // Convert data to FormData for createJob action
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('company', data.company);
      formData.append('location', data.location);
      formData.append('type', data.type);
      formData.append('description', data.description);
      if (data.salary !== undefined) {
        formData.append('salary', data.salary.toString());
      }

      const result = await createJob(formData);
      if (result.success) {
        toast.success(result.message);
        reset(); // Reset form on success
        router.push("/jobs");
      } else {

        toast.error(result.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An unexpected error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-red-900 mb-6">Post a New Job</h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8"> {/* Changed action to onSubmit */}
        {/* Job Title */}
        <FormField
          control={control}
          name="title"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Software Engineer"
                  {...field}
                  className={fieldState.error ? "border-yellow-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Company */}
        <FormField
          control={control}
          name="company"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Google"
                  {...field}
                  className={fieldState.error ? "border-yellow-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={control}
          name="location"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Nairobi, Kenya"
                  {...field}
                  className={fieldState.error ? "border-yellow-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Job Type */}
        <FormField
            control={control}
            name="type"
            rules={{ required: 'Job type is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="hover:bg-gray-100 backdrop-blur-sm transition">
                      <SelectValue placeholder="Select a job type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="backdrop-blur-sm">
                    {jobTypes.map((type) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="hover:bg-red-900 hover:text-white"
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

        {/* Job Description */}
        <FormField
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the job responsibilities, requirements, etc."
                  {...field}
                  className={fieldState.error ? "border-yellow-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Salary */}
        <FormField
          control={control}
          name="salary"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Salary (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 100000 (USD, numbers only)"
                  {...field}
                  className={fieldState.error ? "border-yellow-500" : ""}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="bg-red-900 text-amber-50 hover:bg-red-800 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <SendIcon className="w-5 h-5" />
          )}
          Post Job
        </Button>
              </form>
            </Form>
          </div>  );
}
