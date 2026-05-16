import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="p-6 border-slate-200 shadow-sm bg-slate-50/50">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-xl bg-slate-200" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-20 bg-slate-200" />
              <Skeleton className="h-5 w-24 bg-slate-300" />
            </div>
          </div>
          <div className="mt-4">
            <Skeleton className="h-1 w-full bg-slate-200" />
          </div>
        </Card>
      ))}
      <div className="col-span-full mt-8">
        <Skeleton className="h-[400px] w-full rounded-2xl bg-slate-50 border border-slate-100" />
      </div>
    </div>
  );
}
