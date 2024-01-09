import styles from "@/app/page.module.css";
import AdminTable from "@/components/AdminTable.js";
import supabase from "@/supabase";
import { badge as badgeData } from "@/data";
import { getProcessedData } from "@/utils";
export const revalidate = 10;
export default async function Complains({ searchParams }) {
  const allStatus = Object.entries(badgeData).map(([key]) => key);
  const queries =
    !searchParams.status || searchParams.status == "all"
      ? allStatus
      : [searchParams.status];
  const { data } = await supabase.from("crimes").select().in("status", queries);
  const processedData = getProcessedData(data);

  return (
    <main className={styles.main}>
      <div>
        <AdminTable data={processedData} />
      </div>
    </main>
  );
}
