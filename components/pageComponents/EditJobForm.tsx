import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateJob } from "@/lib/actions/jobActions";
import { SendIcon, Loader2 } from "lucide-react";
import { useState } from "react";

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
}

type EditJobFormProps = {
  job: ClientJob;
  onClose: () => void;
};

export default function EditJobForm({ job, onClose }: EditJobFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | undefined> | undefined>(undefined);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrors(undefined);
    // Append job ID to form data for update action
    formData.append("id", job.id);

    try {
      const result = await updateJob(formData);

      if (result.success) {
        toast.success(result.message);
        onClose(); // Close the dialog on success
        router.refresh(); // Refresh the page to show updated data
      } else {
        if (result.errors) {
          setErrors(result.errors);
        }
        toast.error(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="id" value={job.id} />
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-amber-50">Job Title</label>
        <Input type="text" id="title" name="title" placeholder="e.g. Software Engineer" className="mt-1 block w-full" defaultValue={job.title} />
        {errors?.title && errors.title.map((msg, i) => (
          <p key={i} className="text-sm font-medium text-red-500 mt-1">{msg}</p>
        ))}
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-amber-50">Company</label>
        <Input type="text" id="company" name="company" placeholder="e.g. Google" className="mt-1 block w-full" defaultValue={job.company} />
        {errors?.company && errors.company.map((msg, i) => (
          <p key={i} className="text-sm font-medium text-red-500 mt-1">{msg}</p>
        ))}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-amber-50">Location</label>
        <Input type="text" id="location" name="location" placeholder="e.g. Nairobi, Kenya" className="mt-1 block w-full" defaultValue={job.location || ""} />
        {errors?.location && errors.location.map((msg, i) => (
          <p key={i} className="text-sm font-medium text-red-500 mt-1">{msg}</p>
        ))}
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-amber-50">Job Type</label>
        <Input type="text" id="type" name="type" placeholder="e.g. Full-time" className="mt-1 block w-full" defaultValue={job.type} />
        {errors?.type && errors.type.map((msg, i) => (
          <p key={i} className="text-sm font-medium text-red-500 mt-1">{msg}</p>
        ))}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-amber-50">Job Description</label>
        <Textarea id="description" name="description" placeholder="Describe the job responsibilities, requirements, etc." className="mt-1 block w-full" defaultValue={job.description} />
        {errors?.description && errors.description.map((msg, i) => (
          <p key={i} className="text-sm font-medium text-red-500 mt-1">{msg}</p>
        ))}
      </div>

      <div>
        <label htmlFor="salary" className="block text-sm font-medium text-amber-50">Salary (Optional)</label>
        <Input type="number" id="salary" name="salary" placeholder="e.g. 100000 Ksh." className="mt-1 block w-full" defaultValue={job.salary || ""} />
        {errors?.salary && errors.salary.map((msg, i) => (
          <p key={i} className="text-sm font-medium text-red-500 mt-1">{msg}</p>
        ))}
      </div>

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
        Update Job
      </Button>
    </form>
  );
}
