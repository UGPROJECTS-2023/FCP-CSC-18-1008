import { Button, Input, Flex } from "@chakra-ui/react";
import { useState } from "react";

export default function ChatFooter({ sendMessage }) {
  const [inputMessage, setInputMessage] = useState("");
  return (
    <Flex py={1} borderTop="2px solid" borderColor="gray.300">
      <Input
        placeholder="Type Something..."
        variant="unstyled"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <Button
        colorScheme="blue"
        rounded={3}
        h="auto"
        py={2}
        isDisabled={inputMessage.trim().length <= 0}
        onClick={() => {
          sendMessage(inputMessage);
          setInputMessage("");
        }}
      >
        Send
      </Button>
    </Flex>
  );
}
