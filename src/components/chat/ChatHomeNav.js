"use client";
import {
  Flex,
  MenuButton,
  Button,
  Menu,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  CloseButton,
} from "@chakra-ui/react";
import Link from "next/link";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useCookies } from "next-client-cookies";

export default function ChatHomeNav({ cases, stationId }) {
  const router = useRouter();
  const pathname = usePathname();
  const cookies = useCookies();
  const { caseId } = useParams();

  const isFirstRun1 = useRef(true);
  const isFirstRun2 = useRef(true);

  const [selectedCase, setSelectedCase] = useState(caseId || "");
  const [selectedCaseLabel, setSelectedCaseLabel] = useState("");

  useEffect(() => {
    if (isFirstRun1.current) {
      isFirstRun1.current = false; // toggle flag after first run
      return; // skip the effect
    }
    if (caseId && selectedCase) return;
    const nextPath = `/admin/chats/${stationId}/${selectedCase}`;
    if (pathname !== nextPath) {
      router.push(nextPath);
    }
  }, [router, selectedCase]);

  useEffect(() => {
    if (isFirstRun2.current) {
      isFirstRun2.current = false; // toggle flag after first run
      return; // skip the effect
    }
    if (!caseId) return;
    setSelectedCase(caseId);
    const currCase = cases.find((currCase) => currCase.caseId === caseId);

    setSelectedCaseLabel(
      `${currCase.reporter}-${currCase.natureOfCrime}-${currCase.caseId}`
    );
  }, [caseId, cases]);

  return (
    <Flex
      justify="flex-end"
      align="center"
      p={1}
    >
      {cookies.get("loggedInStation") ? (
        <Menu isLazy>
          <MenuButton
            as={Button}
            colorScheme="blue"
          >
            {selectedCaseLabel || "Select case"}
          </MenuButton>
          <MenuList
            overflow="auto"
            maxH="60vh"
          >
            <MenuOptionGroup
              type="radio"
              value={selectedCase}
              onChange={setSelectedCase}
            >
              <MenuItemOption
                key="selectCase"
                onClick={() => {
                  setSelectedCaseLabel("Select case");
                }}
                value=""
              >
                Select case
              </MenuItemOption>
              {cases?.map((currCase) => (
                <MenuItemOption
                  key={currCase.caseId}
                  onClick={() => {
                    setSelectedCaseLabel(
                      `${currCase.reporter}-${currCase.natureOfCrime}-${currCase.caseId}`
                    );
                  }}
                  value={currCase.caseId}
                >
                  {`${currCase.reporter}-${currCase.natureOfCrime}-${currCase.caseId}`}
                </MenuItemOption>
              ))}
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      ) : (
        <Link href="/">
          <CloseButton
            size="sm"
            bg="red"
            color="white"
            borderRadius="full"
          />
        </Link>
      )}
    </Flex>
  );
}
