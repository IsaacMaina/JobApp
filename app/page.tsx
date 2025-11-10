// This is the main page of our application.
// It's the first thing users see when they visit our site.
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  MapPinIcon,
  BriefcaseIcon,
  Building2Icon,
  ArrowRight,
} from "lucide-react";
import prisma from "@/lib/prisma"; // Import prisma
import { formatSalary } from "@/lib/utils"; // Import formatSalary
import { formatDistanceToNowStrict } from "date-fns"; // Import date-fns

interface Job {
  id: string;
  title: string;
  company: string;
  location: string | null;
  type: string;
  salary: number | null;
  createdAt: Date;
  postedByEmail: string;
}

const quotes = [
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    quote:
      "Choose a job you love, and you will never have to work a day in your life.",
    author: "Confucius",
  },
  {
    quote:
      "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
    author: "Steve Jobs",
  },
  {
    quote:
      "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
];

export default async function Main() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/landing");
  }

  // Data fetching functions
  const getPopularJobs = async (): Promise<Job[]> => {
    const jobs = await prisma.job.findMany({
      take: 5,
      orderBy: { applications: { _count: "desc" } }, // Order by application count for popularity
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        type: true,
        salary: true,
        createdAt: true,
        postedBy: {
          select: {
            email: true,
          },
        },
      },
    });
    return jobs.map(job => ({
      ...job,
      postedByEmail: job.postedBy.email,
    }));
  };

  const getMostPayingJobs = async (): Promise<Job[]> => {
    const jobs = await prisma.job.findMany({
      take: 5,
      where: { salary: { not: null } },
      orderBy: { salary: "desc" },
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        type: true,
        salary: true,
        createdAt: true,
        postedBy: {
          select: {
            email: true,
          },
        },
      },
    });
    return jobs.map(job => ({
      ...job,
      postedByEmail: job.postedBy.email,
    }));
  };

  const getNewJobs = async (): Promise<Job[]> => {
    const jobs = await prisma.job.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        type: true,
        salary: true,
        createdAt: true,
        postedBy: {
          select: {
            email: true,
          },
        },
      },
    });
    return jobs.map(job => ({
      ...job,
      postedByEmail: job.postedBy.email,
    }));
  };

  const popularJobs = await getPopularJobs();
  const mostPayingJobs = await getMostPayingJobs();
  const newJobs = await getNewJobs();

  const renderJobCarousel = (title: string, jobs: Job[]) => (
    <section className="py-8 px-4 md:px-8 bg-gray-50">
      <h2 className="text-3xl font-bold text-red-900 mb-6 text-center">
        {title}
      </h2>
      <div className="w-full flex justify-center items-center my-4">
        <Carousel className="relative w-full max-w-4xl sm:w-[90%] md:w-[80%]">
          <CarouselContent className="items-center">
            {jobs.map((item) => (
              <CarouselItem
                key={item.id}
                className="basis-full lg:basis-1/2 p-4 flex justify-center items-center"
              >
                <Card className="relative mx-1 w-full sm:w-1/2 md:w-3/4 p-4 flex flex-col border-none shadow-md rounded-xl">
                  <Badge className="absolute bg-green-500/20 top-2 left-2">
                    <span className="text-xs">
                      {formatDistanceToNowStrict(item.createdAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </Badge>

                  <CardTitle className="mt-6 flex flex-col gap-2 text-left w-full">
                    <span className="flex items-center justify-start">
                      <BriefcaseIcon className="w-4 h-4 mr-2" />
                      <h1 className="font-bold">{item.title}</h1>
                    </span>
                    <span className="flex items-center justify-start">
                      <Building2Icon className="w-4 h-4 mr-2" />
                      <h2 className="font-medium">{item.company}</h2>
                    </span>
                    <span className="flex items-center justify-start">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      <h2 className="font-medium">{item.location}</h2>
                    </span>
                  </CardTitle>

                  <CardContent className="sm:mt-4 flex flex-col justify-center items-center gap-3 text-[10px] sm:text-sm">
                    {item.salary && (
                      <p className="text-gray-700 font-semibold">
                        Salary: {formatSalary(item.salary)}
                      </p>
                    )}
                    <Link href={`/jobs/${item.id}`}>
                      <Button className="cursor-pointer w-full sm:w-auto m-4 bg-red-900 text-amber-50">
                        View Details
                      </Button>
                    </Link>
                    <p className="text-xs text-gray-500 self-end mt-2">Posted by: {item.postedByEmail}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1 sm:left-2 md:-left-8 bg-white/90 shadow-md hover:scale-105 transition z-10 rounded-full" />
          <CarouselNext className="right-1 sm:right-2 md:-right-8 bg-white/90 shadow-md hover:scale-105 transition z-10 rounded-full" />
        </Carousel>
      </div>
    </section>
  );

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative flex items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-red-900 to-red-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
        <div className="relative z-10 text-center p-4 max-w-3xl mx-auto animate-fade-in-up flex flex-col justify-between h-full items-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Find Your Dream Job, Effortlessly.
          </h1>
          <div>
            {" "}
            <p className="text-xl italic mb-4">"{randomQuote.quote}"</p>
            <p className="text-lg font-semibold mb-8">- {randomQuote.author}</p>
          </div>
          <Link href="/jobs">
            <Button className="px-8 py-4 text-lg bg-amber-50 text-red-900 rounded-full shadow-lg hover:bg-amber-100 transition-all duration-300 ease-in-out transform hover:scale-105">
              Explore Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Popular Jobs Section */}
      {renderJobCarousel("Popular Jobs", popularJobs)}

      {/* Most Paying Jobs Section */}
      {renderJobCarousel("Most Paying Jobs", mostPayingJobs)}

      {/* New Jobs Section */}
      {renderJobCarousel("New Jobs", newJobs)}

      {/* Choose Your Category Options Section (Placeholder) */}
      <section className="py-12 px-4 md:px-8 bg-white text-center">
        <h2 className="text-3xl font-bold text-red-900 mb-6">
          Choose Your Category
        </h2>
        <p className="text-gray-700 mb-8">
          Explore jobs by industry, experience level, or location.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="outline"
            className="border-red-900 text-red-900 hover:bg-red-50"
          >
            Tech
          </Button>
          <Button
            variant="outline"
            className="border-red-900 text-red-900 hover:bg-red-50"
          >
            Healthcare
          </Button>
          <Button
            variant="outline"
            className="border-red-900 text-red-900 hover:bg-red-50"
          >
            Finance
          </Button>
          <Button
            variant="outline"
            className="border-red-900 text-red-900 hover:bg-red-50"
          >
            Marketing
          </Button>
          <Button
            variant="outline"
            className="border-red-900 text-red-900 hover:bg-red-50"
          >
            Entry Level
          </Button>
          <Button
            variant="outline"
            className="border-red-900 text-red-900 hover:bg-red-50"
          >
            Senior Level
          </Button>
        </div>
      </section>
    </div>
  );
}
