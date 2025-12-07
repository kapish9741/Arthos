import { AiDailyBriefCard } from "@/components/ai/AiDailyBriefCard";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import data from "@/app/dashboard/data.json";

const DashboardPage = () => {
  // TODO: Replace with actual user ID from auth context
  const userId = "user-123";

  return (
    <div className="@container/main flex w-full flex-col gap-4 bg-neutral-900 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      </div>

      {/* Portfolio Stats Cards */}
      <SectionCards />

      {/* AI Daily Brief - Integrated inline */}
      <div className="px-4 lg:px-6">
        <AiDailyBriefCard userId={userId} />
      </div>

      {/* Interactive Chart */}
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>

      {/* Portfolio & Transactions Table */}
      <DataTable data={data} />
    </div>
  );
};

export default DashboardPage;
