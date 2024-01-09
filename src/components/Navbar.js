"use client";
import {
  Box,
  Flex,
  Spacer,
  Link,
  Avatar,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
export default function Navbar() {
  const router = useRouter();
  const cookies = useCookies();

  const logOut = () => {
    cookies.remove("loggedInStation");
    router.push("/login");
  };
  return (
    <Flex p={4} bg="blue.400" color="white" align={"center"}>
      <Box>
        <Link>Admin Dashboard</Link>
      </Box>
      <Spacer />
      <Menu>
        <MenuButton>
          <Flex>
            <Avatar src="/ngPolice.jpg" />
            <Box ml="3">
              <Text fontWeight="bold">Dutse Command</Text>
              <Text fontSize="sm" float="left">
                # 1001
              </Text>
            </Box>
          </Flex>
        </MenuButton>
        <MenuList>
          <MenuItem color="black" onClick={logOut}>
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
