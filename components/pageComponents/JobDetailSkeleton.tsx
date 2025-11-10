import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobDetailSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="shadow-lg rounded-xl overflow-hidden">
        <div className="p-6 bg-red-900 text-amber-50">
          <Skeleton className="h-8 w-3/4" />
          <div className="flex items-center mt-2">
            <Skeleton className="h-6 w-1/2" />
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 mr-4" />
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32 mt-2" />
              </div>
            </div>
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 mr-4" />
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32 mt-2" />
              </div>
            </div>
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 mr-4" />
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32 mt-2" />
              </div>
            </div>
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 mr-4" />
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32 mt-2" />
              </div>
            </div>
          </div>

          <div>
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </div>

          <div className="mt-8 text-center">
            <Skeleton className="h-12 w-48" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
