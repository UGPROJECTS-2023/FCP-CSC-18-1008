"use client";
import React, { useState } from "react";
import { useCookies } from "next-client-cookies";

import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { station as stations } from "@/data";

export default function Login() {
  const router = useRouter();
  const cookies = useCookies();

  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = () => {
    setIsLoading(true);

    if (userName.length && password.length) {
      const userNameExist = stations.some(
        (station) => station.stationId == userName
      );
      if (password == "admin" && userNameExist) {
        setTimeout(() => {
          setIsLoading(false);
          cookies.set("loggedInStation", userName);
          router.push("/admin");
        }, 3000);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      height="100vh"
    >
      <Box
        width="md"
        p={8}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
      >
        <Heading
          mb={4}
          color="white"
        >
          Login
        </Heading>
        <form>
          <FormControl color="white">
            <FormLabel>Username</FormLabel>
            <Input
              type="input"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </FormControl>

          <FormControl
            mt={4}
            color="white"
          >
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
            mt={4}
            colorScheme="teal"
            type="button"
            onClick={login}
            isLoading={isLoading}
          >
            Login
          </Button>
        </form>
      </Box>
    </Flex>
  );
}
