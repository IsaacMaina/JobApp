"use client";

import * as React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getDistinctJobTitles,
  getDistinctJobCompanies,
  getDistinctJobLocations,
  getDistinctJobTypes,
} from "@/lib/actions/jobActions";

interface SearchProps {
  initialSearchParams: { [key: string]: string | string[] | undefined };
  title: string;
  titleColor?: string;
  titleSize?: string;
  onSearch?: (queryString: string) => void; // Added onSearch prop
}

// A reusable dropdown component for our search filters.
// It uses a Popover and Command from shadcn/ui to create a searchable dropdown.
function DropdownFilter({ label, items, onChange }: { label: string; items: string[]; onChange: (value: string | null) => void }) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null);

  React.useEffect(() => {
    onChange(selected);
  }, [selected, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="border-red-950/30 rounded-none w-full md:w-auto flex-1 justify-between font-semibold backdrop-blur-sm bg-red-950/10 hover:bg-red-900/50 hover:text-white duration-200 ease-in transition"
        >
          {selected || label}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 backdrop-blur-md bg-white/70 border-none shadow-lg">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item}
                  onSelect={() => {
                    setSelected(item);
                    setOpen(false);
                  }}
                  className="cursor-pointer font-semibold hover:text-red-900 transition-colors"
                >
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// The main search component. It combines several DropdownFilter components to create a search bar.
export default function Search({ initialSearchParams, title, titleColor = "text-amber-50", titleSize = "text-xl", onSearch }: SearchProps) {
  const router = useRouter();

  const [selectedCareer, setSelectedCareer] = React.useState<string | null>(
    (initialSearchParams.career as string) || null
  );
  const [selectedCompany, setSelectedCompany] = React.useState<string | null>(
    (initialSearchParams.company as string) || null
  );
  const [selectedLocation, setSelectedLocation] = React.useState<string | null>(
    (initialSearchParams.location as string) || null
  );
  const [selectedJobType, setSelectedJobType] = React.useState<string | null>(
    (initialSearchParams.jobType as string) || null
  );

  const [careerOptions, setCareerOptions] = React.useState<string[]>([]);
  const [companyOptions, setCompanyOptions] = React.useState<string[]>([]);
  const [locationOptions, setLocationOptions] = React.useState<string[]>([]);
  const [jobTypeOptions, setJobTypeOptions] = React.useState<string[]>([]);

  React.useEffect(() => {
    const fetchOptions = async () => {
      const filters: { [key: string]: string | undefined } = {};
      if (selectedCareer) filters.title = selectedCareer;
      if (selectedCompany) filters.company = selectedCompany;
      if (selectedLocation) filters.location = selectedLocation;
      if (selectedJobType) filters.type = selectedJobType;

      // Fetch career options
      const careers = await getDistinctJobTitles({ ...filters, title: undefined });
      setCareerOptions(careers);

      // Fetch company options
      const companies = await getDistinctJobCompanies({ ...filters, company: undefined });
      setCompanyOptions(companies);

      // Fetch location options
      const locations = await getDistinctJobLocations({ ...filters, location: undefined });
      setLocationOptions(locations);

      // Fetch job type options
      const jobTypes = await getDistinctJobTypes({ ...filters, type: undefined });
      setJobTypeOptions(jobTypes);
    };

    fetchOptions();
  }, [selectedCareer, selectedCompany, selectedLocation, selectedJobType]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCareer) params.set("career", selectedCareer);
    if (selectedCompany) params.set("company", selectedCompany);
    if (selectedLocation) params.set("location", selectedLocation);
    if (selectedJobType) params.set("jobType", selectedJobType);

    const queryString = params.toString();

    if (onSearch) {
      onSearch(queryString);
    } else {
      router.push(`/jobs?${queryString}`);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row flex-wrap gap-0 justify-center items-center p-4 pt-2 mt-2 backdrop-blur-md border-none shadow-lg rounded-2xl">
      <h1 className={`${titleColor} ${titleSize} font-bold px-4`}>{title}</h1>
      <DropdownFilter label="Career" items={careerOptions} onChange={setSelectedCareer} />
      <DropdownFilter label="Company" items={companyOptions} onChange={setSelectedCompany} />
      <DropdownFilter label="Location" items={locationOptions} onChange={setSelectedLocation} />
      <DropdownFilter label="Type of Job" items={jobTypeOptions} onChange={setSelectedJobType} />
      <Button
        onClick={handleSearch}
        className="hover:text-red-900 hover:bg-amber-50 hover:border-2 border-red-900 transition-colors duration-200 m-4 cursor-pointer w-fit px-4 py-2  bg-red-900 text-amber-50"
      >
        Search Job
      </Button>
    </div>
  );
}
