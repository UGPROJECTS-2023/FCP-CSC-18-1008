"use client";
import { Flex, Text, Box } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useCookies } from "next-client-cookies";

import supabase from "@/supabase";
import ChatBody from "@/components/chat/ChatBody";
import ChatFooter from "@/components/chat/ChatFooter";
import { useParams } from "next/navigation";

export default function Chat() {
  const { caseId } = useParams();
  const cookies = useCookies();

  const isFirstRun1 = useRef(true);
  const isFirstRun2 = useRef(true);
  const isFirstRun3 = useRef(true);
  const [user, setUser] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isFirstRun1.current) {
      isFirstRun1.current = false; // toggle flag after first run
      return; // skip the effect
    }

    setUser(cookies.get("loggedInStation") ? "station" : "reporter");
  }, []);

  useEffect(() => {
    if (isFirstRun2.current) {
      isFirstRun2.current = false; // toggle flag after first run
      return; // skip the effect
    }
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("crimes")
        .select("chats")
        .eq("caseId", caseId);
      setMessages(data[0].chats ?? []);
      setLoadingMessages(false);
    };
    fetchMessages();
  }, [caseId]);

  useEffect(() => {
    if (isFirstRun3.current) {
      isFirstRun3.current = false; // toggle flag after first run
      return; // skip the effect
    }
    if (!message) return;
    const newMessages = [...messages, { from: user, text: message }];
    setMessages(newMessages);

    const sendMessage = async () => {
      await supabase
        .from("crimes")
        .update({
          chats: newMessages,
        })
        .eq("caseId", caseId);
    };
    sendMessage();
  }, [message]);

  supabase
    .channel("custom-update-channel")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "crimes",
        filter: `caseId=eq.${caseId}`,
      },
      (payload) => {
        setMessages(payload.new.chats);
      }
    )
    .subscribe();

  return (
    <Flex
      h="100%"
      px={1}
      flexDirection="column"
      justify="space-between"
    >
      <Box h="calc(100% - 50px)">
        {loadingMessages ? (
          <Flex
            h="100%"
            justify="center"
            align="center"
          >
            <Text>Loading Chat...</Text>
          </Flex>
        ) : (
          <Box
            h="100%"
            overflow="auto"
          >
            <ChatBody
              messages={messages}
              user={user}
              avatar={user}
            />
          </Box>
        )}
      </Box>

      <ChatFooter sendMessage={(inputMessage) => setMessage(inputMessage)} />
    </Flex>
  );
}
