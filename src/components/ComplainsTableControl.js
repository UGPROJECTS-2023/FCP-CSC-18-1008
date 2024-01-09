"use client";
import {
  Box,
  Flex,
  MenuButton,
  Button,
  Menu,
  MenuItemOption,
  MenuList,
  MenuDivider,
  MenuOptionGroup,
  Checkbox,
  Progress,
} from "@chakra-ui/react";

import {
  natureOfCrime,
  badge as badgeData,
  station,
  tableHeaders as sortOptions,
} from "@/data.js";
import supabase from "@/supabase";
import Searchbar from "./Searchbar";
import React, { useEffect, useState } from "react";

export default function ComplainsTableControl({ setTableState, setTableData }) {
  const [filter, setFilter] = useState("");
  const [parsedFilter, setParsedFilter] = useState(null);

  const [sort, setSort] = useState("");
  const [sortLabel, setSortLabel] = useState("");
  const [descending, setDescending] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [sortLoading, setSortLoading] = useState(false);

  useEffect(() => {
    setTableLoading(searchLoading || filterLoading || sortLoading);
  }, [searchLoading, filterLoading, sortLoading]);

  const statuses = Object.entries(badgeData)
    .map(([key, val]) => ({
      label: val.label,
      val: key,
    }))
    .filter((v) => v.val != "all");

  const noc = natureOfCrime.map((v) => ({ label: v, val: v }));
  const stationData = station.map((v) => ({
    label: `#${v.stationId}`,
    val: v.stationId,
  }));

  const filters = [
    {
      group: { label: "Status", val: "status" },
      items: statuses,
    },
    {
      group: { label: "Nature of crime", val: "natureOfCrime" },
      items: noc,
    },
    {
      group: { label: "Station Id", val: "stationId" },
      items: stationData,
    },
  ];

  const supabaseQuery = supabase.from("crimes").select();

  // const { data, error } = await supabase
  // .from('countries')
  // .select('id', 'name')
  // .order('id', { ascending: false })

  const fetchCrime = async () => {
    setSearchLoading(true);

    const { data: searchResults } = await supabaseQuery;

    setTableData(searchResults);
    setSearchLoading(false);
  };

  const searchCrime = async (query) => {
    if (query) {
      setSearchLoading(true);
      const { data: searchResults } = await supabaseQuery.textSearch(
        "fts",
        query
      );
      setTableData(searchResults);

      setSearchLoading(false);
    } else {
      setDescending(false);
      setSort("");
      setSortLabel("");
      setFilter("");
      setParsedFilter(null);
      fetchCrime();
    }
  };
  const filterCrime = async () => {
    setFilterLoading(true);
    const { data } = await supabaseQuery.eq(
      parsedFilter.group.val,
      parsedFilter.item.val
    );
    setTableData(data);
    setFilterLoading(false);
  };

  useEffect(() => {
    if (filter) {
      filterCrime();
    }
  }, [filter]);

  const sortCrime = async (column) => {
    setSortLoading(true);
    const { data } = await supabase
      .from("crimes")
      .select()
      .order(column, { ascending: descending });

    setTableData(data);
    setSortLoading(false);
  };
  useEffect(() => {
    if (sort) {
      sortCrime(sort);

      setTimeout(() => {
        setSortLoading(false);
      }, 3000);
    }
  }, [sort, descending]);

  useEffect(() => {
    if (sortLoading || searchLoading || filterLoading) {
      setTableState(true);
    } else {
      setTableState(false);
    }
  }, [sortLoading, searchLoading, filterLoading, setTableState]);

  return (
    <Box>
      <Flex
        id="tableControl"
        justify="space-between"
        p={2}
        align="center"
      >
        <Box w="40%">
          <Searchbar
            isClearable
            color="black"
            isLoading={searchLoading}
            searchCrime={searchCrime}
            placeholder="Search a crime"
            filtersUsed={descending || filter || sort}
          />
        </Box>
        <Flex
          pr={1}
          gap="20px"
        >
          <Box>
            <Menu isLazy>
              <MenuButton
                as={Button}
                colorScheme="blue"
                isLoading={filterLoading}
              >
                Filter by
                {parsedFilter &&
                  `: ${parsedFilter.group.label} - ${parsedFilter.item.label}`}
              </MenuButton>
              <MenuList
                overflow="auto"
                maxH="60vh"
              >
                {filters.map((u, i) => (
                  <React.Fragment key={u.group.label}>
                    <MenuOptionGroup
                      type="radio"
                      value={filter}
                      onChange={(currFilter) => {
                        setFilter(currFilter);
                        setParsedFilter(JSON.parse(currFilter));
                      }}
                      title={u.group.label}
                    >
                      {u.items.map((v) => (
                        <MenuItemOption
                          key={v.label}
                          value={JSON.stringify({ group: u.group, item: v })}
                        >
                          {v.label}
                        </MenuItemOption>
                      ))}
                    </MenuOptionGroup>
                    {i !== filters.length - 1 && <MenuDivider />}
                  </React.Fragment>
                ))}
              </MenuList>
            </Menu>
          </Box>
          <Flex gap={2}>
            <Menu isLazy>
              <MenuButton
                as={Button}
                colorScheme="blue"
                isLoading={sortLoading}
              >
                Sort by{sortLabel && `: ${sortLabel}`}
              </MenuButton>
              <MenuList
                overflow="auto"
                maxH="60vh"
              >
                <MenuOptionGroup
                  type="radio"
                  value={sort}
                  onChange={setSort}
                  title="Sort"
                >
                  {sortOptions.map((sortOption, i) => (
                    <MenuItemOption
                      key={sortOption.title}
                      onClick={() => {
                        setSortLabel(sortOption.title);
                      }}
                      value={sortOption.value}
                    >
                      {sortOption.title}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>

            <Checkbox
              value={descending}
              onChange={() => setDescending(!descending)}
            >
              Z - A
            </Checkbox>
          </Flex>
        </Flex>
      </Flex>
      <Progress
        size="xs"
        isIndeterminate={tableLoading}
      />
    </Box>
  );
}
