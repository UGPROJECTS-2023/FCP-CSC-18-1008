import supabase from "@/supabase";
import StatusGrid from "@/components/StatusGrid";
export const revalidate = 10;
export default async function AdminLogin() {
  const { data } = await supabase.rpc("count_cases");

  const caseCounts = data.map(({ case_count, ...rest }) => ({
    ...rest,
    count: case_count,
  }));

  const totalCount = caseCounts.reduce((val, v) => val + v.count, 0);

  const caseStats = [
    { status: "all", count: totalCount },
    { status: "open", count: 0 },
    { status: "pending", count: 0 },
    { status: "resolved", count: 0 },
  ].map((stat) => {
    if (stat.status == "all") return stat;
    const count = caseCounts.find((c) => c.status == stat.status)?.count || 0;
    return { ...stat, count };
  });

  return <StatusGrid caseStats={caseStats} />;
}
