"use client";
import {
  SimpleGrid,
  Button,
  Flex,
  Stack,
  Text,
  Box,
  Badge,
  Show,
} from "@chakra-ui/react";
import { badge as statuses, tableHeaders } from "@/data.js";
import { useState, useEffect, useRef } from "react";
import { useCookies } from "next-client-cookies";
import CrimeDetailsModal from "./CrimeDetailsModal";
import ComplainsTableControl from "./ComplainsTableControl";
import supabase from "@/supabase";

import { getProcessedData } from "@/utils";
import Stars from "./Stars";

export default function AdminTable({ data }) {
  const isFirstRun = useRef(true);
  const cookies = useCookies();

  const [crimeModal, setCrimeModal] = useState(false);
  const [currentCase, setCurrentCase] = useState(null);
  const [tableDisabled, setTableDisabled] = useState(false);
  const [tableData, setTableData] = useState(data);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [resolveLoading, setResolveLoading] = useState(false);
  const [stationId, setStationId] = useState(null);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      // toggle flag after first run
      return; // skip the effect
    }

    setStationId(cookies.get("loggedInStation"));
  }, []);

  const showCase = (item) => {
    setCurrentCase(item);
    setCrimeModal(true);
  };
  const updateStatus = async (updateAction) => {
    const updateFunc = async (status) => {
      const field = status != "resolved";
      field ? setUpdatingStatus(true) : setResolveLoading(true);
      const resolvedAt = new Date().toISOString();
      const { error } = await supabase
        .from("crimes")
        .update({
          status,
          [field ? "stationId" : "resolvedAt"]: field
            ? status == "open"
              ? null
              : stationId
            : resolvedAt,
        })
        .eq("id", currentCase.id);

      if (error) {
        alert("Error updating data:", error);
      } else {
        alert("Data updated successfully");
        setCurrentCase((prev) => ({
          ...prev,
          [field ? "stationId" : "resolvedAt"]: field
            ? status == "open"
              ? null
              : stationId
            : resolvedAt,
          status: { key: status, ...statuses[status] },
        }));
      }
      field ? setUpdatingStatus(false) : setResolveLoading(false);
    };
    if (updateAction == "assign") updateFunc("pending");
    else if (updateAction == "unassign") updateFunc("open");
    else updateFunc("resolved");
  };

  useEffect(() => {
    const handleInsert = (payload) =>
      setTableData((prev) => [...prev, getProcessedData([payload.new])[0]]);

    const handleUpdate = (payload) => {
      setTableData((prev) =>
        prev.map((item) =>
          item.id == payload.new.id ? getProcessedData([payload.new])[0] : item
        )
      );
      if (payload.new.id == currentCase?.id)
        setCurrentCase(getProcessedData([payload.new])[0]);
    };

    // Define your subscription here
    const myChannel = supabase
      .channel("crimes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "crimes" },
        handleInsert
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "crimes" },
        handleUpdate
      )
      .subscribe();

    // Cleanup function to unsubscribe
    return () => {
      supabase.removeChannel(myChannel);
    };
  }, [currentCase?.id]);

  return (
    <div>
      <ComplainsTableControl
        setTableState={setTableDisabled}
        setTableData={(data) => setTableData(getProcessedData(data))}
      />

      <Flex w="full" alignItems="center" justifyContent="center">
        <Stack
          direction={{
            base: "column",
          }}
          w="full"
          shadow="lg"
          overflowY="auto"
          maxH={`calc(100vh - 147px)`}
        >
          <Show above="lg">
            <SimpleGrid
              spacingY={3}
              columns={{
                base: 1,
                md: 9,
              }}
              w={{
                base: 150,
                md: "full",
              }}
              textTransform="uppercase"
              color={"gray.500"}
              py={{
                base: 1,
                md: 4,
              }}
              px={{
                base: 2,
                md: 4,
              }}
              fontSize="md"
            >
              {tableHeaders.map((header) => (
                <Text key={header.title} fontWeight={700} color="black">
                  {header.title}
                </Text>
              ))}
              <Text></Text>
            </SimpleGrid>
          </Show>
          {tableData?.map((item) => (
            <Flex
              key={item.caseId}
              direction={{
                base: "row",
                lg: "column",
              }}
            >
              <Show below="lg">
                <SimpleGrid
                  spacingY={3}
                  columns={{
                    base: 1,
                    lg: 9,
                  }}
                  w={{
                    base: 150,
                    lg: "full",
                  }}
                  textTransform="uppercase"
                  color={"gray.500"}
                  py={{
                    base: 1,
                    lg: 4,
                  }}
                  px={{
                    base: 2,
                    lg: 4,
                  }}
                  fontSize="md"
                >
                  {tableHeaders.map((header) => (
                    <Text key={header.title} fontWeight={700} color="black">
                      {header.title}
                    </Text>
                  ))}
                  <Text></Text>
                </SimpleGrid>
              </Show>
              <SimpleGrid
                spacingY={3}
                columns={{
                  base: 1,
                  lg: 9,
                }}
                w="full"
                py={2}
                px={4}
              >
                <Text>{item.caseId}</Text>
                <Text>{item.stationId}</Text>
                <Text textTransform="capitalize">{item.reporter}</Text>
                <Text>{item.address}</Text>
                <Text>{item.natureOfCrime}</Text>
                <Text>{item.createdAt}</Text>
                <Box>
                  <Badge
                    variant="subtle"
                    colorScheme={item.status.color}
                    textAlign="center"
                    borderRadius="lg"
                    p={2}
                  >
                    {item.status.label}
                  </Badge>
                </Box>
                <Stars count={item.severity} />
                <Flex
                  justify={{
                    base: "start",
                    lg: "space-around",
                  }}
                >
                  <Button
                    colorScheme="blue"
                    variant="link"
                    onClick={() => showCase(item)}
                    isDisabled={tableDisabled}
                  >
                    View
                  </Button>
                </Flex>
              </SimpleGrid>
            </Flex>
          ))}
        </Stack>
      </Flex>

      {crimeModal && (
        <CrimeDetailsModal
          isOpen={crimeModal}
          closeModal={() => setCrimeModal(false)}
          currentCase={currentCase}
          updateStatus={updateStatus}
          updatingStatus={updatingStatus}
          resolveLoading={resolveLoading}
          isClient={!stationId}
        />
      )}
    </div>
  );
}
