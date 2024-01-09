"use client";
import { Button, Input, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Searchbar({
  color,
  isLoading,
  isClearable,
  searchCrime,
  placeholder,
  filtersUsed,
}) {
  /*this is created to search for a rime and return and get the state of the input field using props */
  const [query, setQuery] = useState("");

  const [tableControl, setTableControl] = useState(null);

  useEffect(() => {
    setTableControl(document.getElementById("tableControl"));
  }, [tableControl]);
  return (
    <Flex
      align="center"
      gap="10px"
      w="100%"
    >
      <Input
        placeholder={placeholder}
        size="lg"
        color={color ?? "white"}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button
        colorScheme="blue"
        type="button"
        onClick={() => searchCrime(query)}
        isLoading={isLoading}
        isDisabled={!query}
        loadingText="Searching"
      >
        Search
      </Button>
      {isClearable &&
        tableControl &&
        createPortal(
          <Button
            colorScheme="red"
            type="button"
            onClick={() => {
              setQuery("");
              searchCrime("");
            }}
            isDisabled={!query && !filtersUsed}
          >
            Clear
          </Button>,
          tableControl
        )}
    </Flex>
  );
}
