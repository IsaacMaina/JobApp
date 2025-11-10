"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema } from "@/lib/schemas/applicationSchema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { countries } from "@/lib/countries";
import { Combobox } from "@/components/ui/Combobox";
import { getExampleNumber } from "libphonenumber-js";
import { PlusCircleIcon, Trash2Icon, FileIcon, EyeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ICountryStateCityState {
  name: string;
  isoCode: string;
  countryCode: string;
}

interface IState {
  name: string;
  code: string;
}

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function ApplicationForm({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(false);
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mobileExamples, setMobileExamples] = useState<any>(null);

  useEffect(() => {
    import("libphonenumber-js/examples.mobile.json").then((mod) => {
      setMobileExamples(mod.default || mod);
    });
  }, []);

  const [CountryStateCityState, setCountryStateCityState] = useState<any>(null);

  useEffect(() => {
    import("country-state-city").then((mod) => {
      setCountryStateCityState(mod.State);
    });
  }, []);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      title: "",
      firstName: "",
      lastName: "",
      region: "",
      levelOfEducation: "",
      idNumber: "",
      phoneNumber: "",
      residenceAddress: "",
      coverLetter: "",
      documents: [], // Keep this as an empty array for Zod validation
    },
  });

  const region = form.watch("region");
  const coverLetter = form.watch("coverLetter");

  const states = useMemo(() => {
    if (!region || !CountryStateCityState) return [];
    return CountryStateCityState.getStatesOfCountry(region).map(
      (state: ICountryStateCityState) => ({
        name: state.name,
        code: state.isoCode,
      })
    );
  }, [region, CountryStateCityState]);

  const phoneNumberPlaceholder = useMemo(() => {
    try {
      if (!region || !mobileExamples) return "+1234567890";
      const example = getExampleNumber(region as any, mobileExamples);
      return example ? example.formatInternational() : "+1234567890";
    } catch {
      return "+1234567890";
    }
  }, [region, mobileExamples]);



  const onSubmit = async (values: ApplicationFormValues) => {
    if (rawFiles.length === 0) {
      form.setError("documents", {
        type: "manual",
        message: "At least one document must be uploaded",
      });
      return;
    }

    setLoading(true);
    try {
      const uploadedDocuments: { name: string; url: string }[] = [];

      for (const file of rawFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          toast.error(errorData.message || "File upload failed");
          setLoading(false);
          return;
        }

        const { name, url } = await uploadRes.json();
        uploadedDocuments.push({ name, url });
      }

      // Now submit the full application with proper documents array
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, documents: uploadedDocuments }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Application submission failed");
        return;
      }

      toast.success("Application submitted successfully!");
      form.reset();
      setRawFiles([]);
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* --- Personal Info --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="hover:bg-gray-100 backdrop-blur-sm transition">
                      <SelectValue placeholder="Select a title" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="backdrop-blur-sm">
                    {["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."].map((t) => (
                      <SelectItem key={t} value={t} className="hover:bg-red-100">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-yellow-500" />
              </FormItem>
            )}
          />

          {/* First Name */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John"
                    {...field}
                    className={fieldState.error ? "border-yellow-500" : ""}
                  />
                </FormControl>
                <FormMessage className="text-yellow-500" />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Doe"
                    {...field}
                    className={fieldState.error ? "border-yellow-500" : ""}
                  />
                </FormControl>
                <FormMessage className="text-yellow-500" />
              </FormItem>
            )}
          />

          {/* Education */}
          <FormField
            control={form.control}
            name="levelOfEducation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level of Education</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="hover:bg-gray-100 backdrop-blur-sm transition">
                      <SelectValue placeholder="Select level of education" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="backdrop-blur-sm">
                    {["High School", "Bachelors", "Masters", "PhD"].map(
                      (level) => (
                        <SelectItem key={level} value={level} className="hover:bg-red-100">
                          {level}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage className="text-yellow-500" />
              </FormItem>
            )}
          />

          {/* Region */}
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <Combobox
                  options={countries.map((c) => ({
                    value: c.code,
                    label: c.name,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select a country"
                />
                <FormMessage className="text-yellow-500" />
              </FormItem>
            )}
          />

          {/* State */}
          <FormField
            control={form.control}
            name="residenceAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/County</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!region}
                >
                  <FormControl>
                    <SelectTrigger className="hover:bg-gray-100 backdrop-blur-sm transition">
                      <SelectValue placeholder="Select a state/county" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="backdrop-blur-sm">
                    {states.map((state: IState) => (
                      <SelectItem key={state.code} value={state.name} className="hover:bg-red-100">
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-yellow-500" />
              </FormItem>
            )}
          />

          {/* ID */}
          <FormField
            control={form.control}
            name="idNumber"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{region ? `${region} ID` : "ID Number"}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123456789"
                    {...field}
                    className={fieldState.error ? "border-yellow-500" : ""}
                  />
                </FormControl>
                <FormMessage className="text-yellow-500" />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder={phoneNumberPlaceholder}
                    {...field}
                    className={fieldState.error ? "border-yellow-500" : ""}
                  />
                </FormControl>
                <FormMessage className="text-yellow-500" />
              </FormItem>
            )}
          />
        </div>

        {/* --- Cover Letter --- */}
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself..."
                  className={cn(
                    "resize-none",
                    fieldState.error ? "border-yellow-500" : ""
                  )}
                  rows={10}
                  {...field}
                />
              </FormControl>
              <div className="text-xs text-gray-500 text-right">
                {coverLetter.length} / 1500
              </div>
              <FormMessage className="text-yellow-500" />
            </FormItem>
          )}
        />

        {/* --- Documents Section --- */}
        <div>
          <h3 className="text-lg font-medium mb-4">Documents</h3>

          {rawFiles.map((file, index) => (
            <div key={index} className="mb-6 p-4 border rounded-md bg-gray-50 flex items-center gap-4">
              <div className="w-20 h-20 flex items-center justify-center border rounded-md p-2 text-xs text-gray-600">
                {file.name.split(".").pop()?.toUpperCase() || "FILE"}
              </div>

              <span className="flex-1 text-gray-800">{file.name}</span>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const url = URL.createObjectURL(file);
                  window.open(url, "_blank");
                }}
              >
                <EyeIcon className="w-4 h-4 mr-1" /> Preview
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  const newFiles = [...rawFiles];
                  newFiles.splice(index, 1);
                  setRawFiles(newFiles);
                }}
              >
                <Trash2Icon className="w-4 h-4 mr-1" /> Remove
              </Button>
            </div>
          ))}

          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setRawFiles([...rawFiles, file]);
            }}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" /> Add Document
          </Button>

          {/* Show error from Zod */}
          {form.formState.errors.documents && (
            <p className="text-yellow-500 mt-2">
              {form.formState.errors.documents.message as string}
            </p>
          )}
        </div>

        {/* --- General Form Error Message --- */}
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="text-yellow-500 text-center mt-4">
            Please correct the errors above.
          </div>
        )}

        {/* --- Submit Button --- */}
        <Button
          type="submit"
          className="w-full bg-red-900 hover:bg-red-950 text-white py-3 rounded-lg font-semibold transition cursor-pointer"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </Form>
  );
}