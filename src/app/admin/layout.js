"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Flex, Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCookies } from "next-client-cookies";

export default function DashLayout({ children }) {
  const router = useRouter();
  const isFirstRun = useRef(true);
  const cookies = useCookies();

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false; // toggle flag after first run
      return; // skip the effect
    }
    if (!cookies.get("loggedInStation")) {
      router.replace("/login");
    }
  }, []);
  return (
    <Box overflow="hidden">
      <Navbar />
      <Box h="calc(100vh - 80px)">
        <Flex h="100%">
          <Box w="180px">
            <Sidebar />
          </Box>
          <Box
            flex={1}
            bg="rgba(66,153,225,0.1)"
            h="100%"
          >
            {children}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
