"use client";
import { Box, VStack, Text } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { useSelectedLayoutSegment } from "next/navigation";

export default function Sidebar() {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const links = [
    {
      href: "/admin",
      label: "Home",
      slug: null,
    },
    {
      href: "/admin/complains",
      label: "Complains",
      slug: "complains",
    },
    {
      href: "/admin/chats",
      label: "Chats",
      slug: "chats",
    },
  ];

  return (
    <VStack align="stretch">
      {links.map((link) => (
        <Box
          key={link.label}
          bg={link.slug == selectedLayoutSegment ? "rgba(66,153,225,0.2)" : ""}
        >
          <Link
            href={link.href}
            color="blue.400"
            _hover={{ color: "blue.500" }}
          >
            <Text
              p={2}
              fontSize="lg"
            >
              {link.label}
            </Text>
          </Link>
        </Box>
      ))}
    </VStack>
  );
}
