"use client";
import { Grid, GridItem, Card } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import { badge } from "@/data.js";
import { useState } from "react";
import supabase from "@/supabase";

export default function StatusGrid({ caseStats }) {
  const [stats, setStats] = useState(caseStats);

  const channels = supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "crimes" },
      (payload) => {
        // TODO: Implement UPDATE; for when status changes
        if (["INSERT", "DELETE"].includes(payload.eventType)) {
          const isAdd = payload.eventType === "INSERT";
          setStats(
            stats.map((s) => {
              if (["all", "open"].includes(s.status))
                return { ...s, count: s.count + (isAdd ? 1 : -1) };

              return { ...s, count: s.count };
            })
          );
        }
      }
    )
    .subscribe();

  return (
    <Grid
      gap={2}
      p={2}
      h="100%"
      templateColumns="repeat(2, 1fr)"
      templateRows="repeat(2, 1fr)"
    >
      {stats?.map((caseStat, i) => (
        <GridItem
          key={caseStat.status}
          rowSpan={1}
          colSpan={1}
        >
          <Card
            bg={badge[caseStat.status].colorVariant}
            color="#fff"
            fontWeight="bold"
            fontSize="5xl"
            p={2}
            h="100%"
          >
            <Link
              href={`/admin/complains?status=${caseStat.status}`}
              style={{ textDecoration: "none", height: "100%" }}
            >
              <Grid
                templateColumns="repeat(2, 1fr)"
                templateRows="repeat(2, 1fr)"
                align="center"
                alignItems="center"
                h="100%"
              >
                <GridItem
                  rowSpan={1}
                  colSpan={1}
                >
                  {badge[caseStat.status].label}
                </GridItem>

                <GridItem
                  rowSpan={2}
                  colSpan={1}
                >
                  {/* <Icon as={ArrowForwardIcon} color="yellow.500" /> */}
                  <ArrowForwardIcon />
                </GridItem>
                <GridItem
                  rowSpan={1}
                  colSpan={1}
                  fontSize="7xl"
                >
                  {caseStat.count}
                </GridItem>
              </Grid>
            </Link>
          </Card>
        </GridItem>
      ))}
    </Grid>
  );
}
