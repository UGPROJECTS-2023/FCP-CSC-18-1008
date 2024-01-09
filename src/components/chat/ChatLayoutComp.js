import { getCookies } from "next-client-cookies/server";
import ChatHomeNav from "@/components/chat/ChatHomeNav";
import { Box, Card } from "@chakra-ui/react";

import supabase from "@/supabase";
import { getProcessedData } from "@/utils";

export default async function ChatLayoutComp({ children, params }) {
  const cookies = getCookies();

  if (!params.stationId) throw new Error("No stationId");
  const { data } = await supabase
    .from("crimes")
    .select("caseId, reporter, natureOfCrime")
    .eq("stationId", parseInt(params.stationId));
  const processedData = getProcessedData(data);

  return (
    <Box
      overflow="hidden"
      h={cookies.get("loggedInStation") ? "100%" : "100vh"}
    >
      <Card
        h="50px"
        rounded="none"
        ml={cookies.get("loggedInStation") && "1px"}
        justify={!cookies.get("loggedInStation") && "center"}
      >
        <ChatHomeNav cases={processedData} stationId={params.stationId} />
      </Card>
      <Box h="calc(100% - 50px)" overflow="hidden">
        {children}
      </Box>
    </Box>
  );
}
