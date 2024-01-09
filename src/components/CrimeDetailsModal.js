"use client";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Flex,
  Box,
  Badge,
  Text,
  Grid,
  GridItem,
  AspectRatio,
  Img,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MdChat, MdLocationPin, MdOutlineAddIcCall } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import Stars from "./Stars";

export default function CrimeDetailsModal({
  isOpen,
  closeModal,
  currentCase,
  updateStatus,
  updatingStatus,
  isClient,
  resolveLoading,
}) {
  const [currCase, setCurrCase] = useState(null);

  useEffect(() => {
    setCurrCase(currentCase);
  }, [
    currentCase,
    currentCase?.status,
    currentCase?.stationId,
    currentCase?.resolvedAt,
    currentCase?.chats,
  ]);

  return (
    <div>
      {isOpen && (
        <Modal
          closeOnOverlayClick={false}
          isOpen={isOpen}
          onClose={closeModal}
          size="full"
        >
          <ModalOverlay />
          <ModalContent
            pt={2}
            pb={10}
          >
            <ModalCloseButton
              bg="red"
              color="#fff"
              borderRadius="full"
              p={1}
              fontSize={12}
            />
            {currCase && (
              <ModalBody>
                <Box>
                  <Flex
                    justify="space-between"
                    align="center"
                  >
                    <Text
                      fontSize="48px"
                      fontWeight={700}
                      color="#171A1FFF"
                    >
                      {currCase.natureOfCrime}
                    </Text>

                    <Text
                      fontWeight={700}
                      fontSize="24px"
                      textTransform="capitalize"
                      color="#171A1FFF"
                    >
                      {currCase.reporter}
                    </Text>
                  </Flex>
                  <Flex
                    justify="space-between"
                    align="center"
                  >
                    <Flex
                      gap={4}
                      fontSize="14px"
                    >
                      <Box>
                        <Text
                          as="span"
                          color=" #9095A1FF"
                          mr={1}
                        >
                          CrimeID:
                        </Text>
                        <Text
                          as="span"
                          fontWeight={700}
                          color="#222730FF"
                        >
                          {currCase.caseId}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          as="span"
                          color=" #9095A1FF"
                          mr={1}
                        >
                          StationID:
                        </Text>
                        <Text
                          as="span"
                          fontWeight={700}
                          color="#222730FF"
                        >
                          {currCase.stationId}
                        </Text>
                      </Box>
                    </Flex>
                    <Stars count={currCase?.severity} />
                  </Flex>
                  <Grid
                    templateRows="repeat(2, 1fr)"
                    templateColumns="repeat(4, 1fr)"
                    gap={2}
                    my={3}
                    h="420px"
                    justifyItems="stretch"
                  >
                    <GridItem
                      rowSpan={2}
                      colSpan={2}
                    >
                      <AspectRatio
                        borderRadius={5}
                        h="100%"
                        overflow="hidden"
                      >
                        <iframe
                          title="naruto"
                          src={currCase?.video}
                          allowFullScreen
                        />
                      </AspectRatio>
                    </GridItem>
                    {currCase?.images.map((image, i) => (
                      <GridItem
                        key={`image-${i}`}
                        colSpan={1}
                        rowSpan={1}
                        overflow="hidden"
                      >
                        <Img
                          src={image}
                          alt=""
                          borderRadius={5}
                          objectFit="cover"
                          w="100%"
                          h="100%"
                        />
                      </GridItem>
                    ))}
                  </Grid>
                  <Flex
                    justify="space-between"
                    align="center"
                  >
                    <Badge
                      variant="subtle"
                      colorScheme={currCase?.status.color}
                      p={2}
                      borderRadius="lg"
                      my="4px"
                    >
                      {currCase?.status.label}
                    </Badge>
                    <Flex
                      gap={4}
                      fontSize="14px"
                    >
                      <Box>
                        <Text
                          as="span"
                          color=" #9095A1FF"
                          mr={1}
                        >
                          Open Date:
                        </Text>
                        <Text
                          as="span"
                          fontWeight={700}
                          color="#222730FF"
                        >
                          {currCase.createdAtLong}
                        </Text>
                      </Box>

                      <Box>
                        <Text
                          as="span"
                          color=" #9095A1FF"
                          mr={1}
                        >
                          Resolve Date:
                        </Text>
                        <Text
                          as="span"
                          fontWeight={700}
                          color="#222730FF"
                        >
                          {currCase.resolvedAtLong}
                        </Text>
                      </Box>
                    </Flex>
                  </Flex>
                  <Flex
                    justify="space-between"
                    mt={2}
                    gap={2}
                  >
                    <Box w="65%">
                      <Text
                        fontSize="24px"
                        fontWeight={700}
                        mb="12px"
                      >
                        Crime description
                      </Text>
                      <Text
                        fontSize="14px"
                        fontWeight={400}
                      >
                        {currCase.crimeDescription}
                      </Text>
                      <Box mt="20px">
                        <Link
                          href={`tel:${currCase.phone}`}
                          style={{
                            pointerEvents: isClient ? "none" : "auto",
                          }}
                          aria-disabled={isClient}
                          tabIndex={isClient ? -1 : undefined}
                        >
                          <Text
                            display="inline-flex"
                            align="center"
                            my="8px"
                          >
                            <Icon
                              as={MdOutlineAddIcCall}
                              w={6}
                              h={5}
                              mr={1}
                            />
                            <Text
                              as="span"
                              color="blue.400"
                            >
                              {currCase.phone}
                            </Text>
                          </Text>
                        </Link>
                        <br />
                        <Text
                          display="inline-flex"
                          align="center"
                          my="8px"
                        >
                          <Icon
                            as={CiLocationOn}
                            w={6}
                            h={5}
                            mr={1}
                          />
                          {currCase.address}
                        </Text>
                        {/* <Text
                        display="flex"
                        align="center"
                        my="8px"
                      >
                        <Icon
                          as={MdMyLocation}
                          w={6}
                          h={5}
                          mr={1}
                        />
                        {currCase.location}
                      </Text> */}
                      </Box>
                    </Box>
                    <Box w="35%">
                      <Text
                        fontSize="24px"
                        fontWeight={700}
                        lineHeight="36px"
                        mb="12px"
                      >
                        Audio recording
                      </Text>
                      <Flex
                        flexDirection="column"
                        gap={5}
                      >
                        <Box>
                          <audio
                            controls
                            style={{ width: "100%" }}
                          >
                            <source
                              src={currCase.voiceNote}
                              type="audio/wav"
                            />
                            Your browser does not support the audio element.
                          </audio>
                        </Box>
                        <Flex gap={10}>
                          <IconButton
                            flex={1}
                            bg="blue.500"
                            fontSize="32px"
                            color="white"
                            size="lg"
                            isDisabled
                            icon={<MdLocationPin />}
                          />
                          <Link
                            href={`${isClient ? "" : "/admin"}/chats/${
                              currCase.stationId
                            }/${currCase?.caseId}`}
                            style={{ flex: 1 }}
                          >
                            <IconButton
                              bg="blue.500"
                              aria-label="Call Sage"
                              fontSize="32px"
                              color="white"
                              size="lg"
                              w="100%"
                              isDisabled={currCase?.status.key == "open"}
                              icon={<MdChat />}
                            />
                          </Link>
                        </Flex>
                        {!isClient && (
                          <Flex gap={10}>
                            <Button
                              flex={1}
                              variant="outline"
                              isLoading={updatingStatus}
                              isDisabled={currCase?.status.key == "resolved"}
                              onClick={() =>
                                updateStatus(
                                  currCase?.stationId ? "unassign" : "assign"
                                )
                              }
                            >
                              {currCase?.stationId ? "Unassign" : "Assign"} Case
                            </Button>
                            <Button
                              flex={1}
                              variant="outline"
                              colorScheme="green"
                              isLoading={resolveLoading}
                              isDisabled={currCase?.status.key == "resolved"}
                              onClick={() => updateStatus("resolve")}
                            >
                              Resolve
                            </Button>
                          </Flex>
                        )}{" "}
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
                {/* <Box
                position="fixed"
                bottom="4"
                right="4"
                zIndex="100"
              >
                <IconButton
                  isRound
                  bg="transparent"
                  aria-label="Call Sage"
                  fontSize="80px"
                  size="lg"
                  onClick={() => setOpenChat(true)}
                  icon={<IoChatbubbleEllipses />}
                />
              </Box> */}
              </ModalBody>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
