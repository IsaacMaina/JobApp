"use client";

import { useRouter } from "next/navigation";
import Search from "@/components/pageComponents/search";

export default function LandingPageClient({
  searchParams,
  randomQuote,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  randomQuote: { quote: string; author: string };
}) {
  const router = useRouter();

  const handleSearch = (queryString: string) => {
    router.push(`/landing?${queryString}`);
  };

  return (
    <div className="relative bg-gradient-to-r from-red-900 to-red-700 text-white py-20 px-8 rounded-lg shadow-xl mb-12 animate-fade-in-down">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold mb-4 leading-tight">
          Find Your Dream Job Today
        </h1>
        <p className="text-xl mb-2 opacity-90">"{randomQuote.quote}"</p>
        <p className="text-lg font-semibold opacity-80">
          - {randomQuote.author}
        </p>
        <div className="max-w-xl mx-auto bg-gradient-to-l from-red-900 to-red-700 rounded-2xl">
          <Search
            initialSearchParams={searchParams}
            title="Search Job"
            onSearch={handleSearch}
          />
        </div>
      </div>
    </div>
  );
}
