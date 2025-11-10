import prisma from "@/lib/prisma";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { formatDistanceToNowStrict } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, BriefcaseIcon, Building2Icon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import Search from "@/components/pageComponents/search";
import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import {
  getDistinctJobTypes,
  getDistinctJobCompanies,
  getDistinctJobLocations,
  getDistinctJobTitles,
} from "@/lib/actions/jobActions";
import { Suspense } from "react";
import JobsSkeleton from "@/components/pageComponents/JobsSkeleton";
import { formatSalary } from "@/lib/utils";

// ✅ FIX: Await searchParams — it's a Promise in Next.js 14+ App Router
export default async function JobsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const where: Prisma.JobWhereInput = {};

  const careerParam = searchParams.career;
  if (careerParam && typeof careerParam === "string") {
    where.title = { contains: careerParam, mode: "insensitive" };
  }

  const companyParam = searchParams.company;
  if (companyParam && typeof companyParam === "string") {
    where.company = { contains: companyParam, mode: "insensitive" };
  }

  const locationParam = searchParams.location;
  if (locationParam && typeof locationParam === "string") {
    where.location = { contains: locationParam, mode: "insensitive" };
  }

  const jobTypeParam = searchParams.jobType;
  if (jobTypeParam && typeof jobTypeParam === "string") {
    where.type = { contains: jobTypeParam, mode: "insensitive" };
  }

  const jobs = await prisma.job.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      postedBy: {
        select: {
          email: true,
        },
      },
    },
  });

  const [
    distinctJobTitles,
    distinctJobCompanies,
    distinctJobLocations,
    distinctJobTypes,
  ] = await Promise.all([
    getDistinctJobTitles(),
    getDistinctJobCompanies(),
    getDistinctJobLocations(),
    getDistinctJobTypes(),
  ]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-red-900 mb-8 text-center">
        All Job Listings
      </h1>

      <div className="mb-8">
        <Search
          initialSearchParams={searchParams}
          title="Search Job"
          titleColor="text-red-900"
          titleSize="text-2xl"
        />
      </div>

      <Suspense fallback={<JobsSkeleton />}>
        {jobs.length === 0 ? (
          <div className="text-center text-gray-600 text-lg mt-10">
            No jobs found at the moment. Check back later!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className="relative flex flex-col shadow-md rounded-xl hover:shadow-lg transition-shadow duration-200"
              >
                <Badge className="absolute bg-green-500/20 top-2 left-2">
                  <span className="text-xs">
                    {formatDistanceToNowStrict(new Date(job.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </Badge>
                <CardTitle className="mt-10 p-4 flex flex-col gap-2 text-left w-full">
                  <h2 className="font-bold text-xl text-red-900">{job.title}</h2>
                  <span className="flex items-center justify-start text-gray-700">
                    <Building2Icon className="w-4 h-4 mr-2" />
                    <p className="font-medium">{job.company}</p>
                  </span>
                  <span className="flex items-center justify-start text-gray-700">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    <p className="font-medium">{job.location}</p>
                  </span>
                  <span className="flex items-center justify-start text-gray-700">
                    <BriefcaseIcon className="w-4 h-4 mr-2" />
                    <p className="font-medium">{job.type}</p>
                  </span>
                </CardTitle>
                <CardContent className="p-4 pt-0 flex flex-col justify-between flex-grow">
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {job.description}
                  </p>
                  {job.salary && (
                    <p className="text-gray-800 font-semibold mb-4">
                      Salary: {formatSalary(job.salary)}
                    </p>
                  )}
                  <Link href={`/jobs/${job.id}`}>
                    <Button className="w-full bg-red-900 text-amber-50 hover:bg-red-800 flex items-center justify-center gap-2">
                      View Details <ArrowRightIcon className="w-4 h-4" />
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-500 self-end mt-2">Posted by: {job.postedBy.email}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Suspense>
    </div>
  );
}
