"use client";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

export default function ChatBody({ messages, user, avatar }) {
  const messagesContainer = useRef();
  useEffect(() => {
    messagesContainer.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <>
      {messages?.map((item, index) => {
        if (item.from === user) {
          return (
            <Flex
              ref={messagesContainer}
              key={`my-${index}`}
              w="100%"
              justify="flex-end"
              my={3}
              gap={2}
            >
              <Box
                bg="black"
                color="white"
                minW="100px"
                maxW="350px"
                rounded={5}
                p="3"
              >
                <Text>{item.text}</Text>
              </Box>
              <Avatar
                src={
                  avatar == "reporter"
                    ? "https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
                    : "/ngPolice.jpg"
                }
                bg="blue.300"
              ></Avatar>
            </Flex>
          );
        } else {
          return (
            <Flex
              key={`other-${index}`}
              w="100%"
              my={3}
              gap={2}
            >
              <Avatar
                src={
                  avatar == "station"
                    ? "https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
                    : "/ngPolice.jpg"
                }
                bg="blue.300"
              ></Avatar>
              <Box
                bg="gray.100"
                color="black"
                minW="100px"
                maxW="350px"
                rounded={5}
                p="3"
              >
                <Text>{item.text}</Text>
              </Box>
            </Flex>
          );
        }
      })}
    </>
  );
}
