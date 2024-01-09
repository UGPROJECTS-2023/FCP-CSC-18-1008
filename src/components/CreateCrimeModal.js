"use client";
import {
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Textarea,
  FormControl,
  FormLabel,
  Center,
  Flex,
  VisuallyHidden,
  Text,
  Stack,
  Icon,
  Box,
  Progress,
  Grid,
  GridItem,
  AspectRatio,
  CloseButton,
  Img,
} from "@chakra-ui/react";
import { useEffect, useState, useRef, useCallback } from "react";
import { natureOfCrime } from "@/data.js";
import supabase from "@/supabase";
import { VoiceRecorder } from "react-voice-recorder-player";
import { nanoid } from "nanoid";

export default function ModalComponent({ classes, openModal, closeModal }) {
  const isFirstRun = useRef(true);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [voiceRecord, setVoiceRecord] = useState(null);
  const [voiceRecordLoading, setVoiceRecordLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    caseId: "",
    reporter: "",
    phone: "",
    natureOfCrime: "",
    crimeDescription: "",
    address: "",
    severity: "",
    voiceNote: "",
    images: [],
    video: "",
  });
  const [uploadsLabel, setUploadsLabel] = useState("");

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false; // toggle flag after first run
      return; // skip the effect
    }

    setFormData((inputs) => ({ ...inputs, caseId: nanoid(5) }));
  }, []);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false; // toggle flag after first run
      return; // skip the effect
    }
    // Use createObjectURL to generate a URL for the selected image
    for (let a = 0; a < selectedImages.length; a++) {
      const imageUrl = URL.createObjectURL(selectedImages[a]);

      setImagePreviews((prevFiles) => [...prevFiles, imageUrl]);
    }
  }, [selectedImages]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false; // toggle flag after first run
      return; // skip the effect
    }
    const url = selectedVideo ? URL.createObjectURL(selectedVideo) : null;
    setVideoPreview(url);
  }, [selectedVideo]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false; // toggle flag after first run
      return; // skip the effect
    }
    setUploadsLabel(
      `${formData.reporter.toLowerCase()}-${formData.natureOfCrime.toLowerCase()}-${
        formData.caseId
      }`
    );
  }, [formData.reporter, formData.natureOfCrime, formData.caseId]);

  const handleImageChange = (event) => {
    const images = event.target.files;

    if (images.length + selectedImages.length > 4) {
      alert(`You can only upload up maximum of 4 files.`);
      return;
    }

    setSelectedImages((prevFiles) => [...prevFiles, ...images]);
  };

  const deleteImage = (i) => {
    const updatedArray = [...selectedImages];

    updatedArray.splice(i, 1);

    setSelectedImages(updatedArray);
  };

  const handleVideoChange = (event) => {
    const video = event.target.files[0];
    setSelectedVideo(video);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((inputs) => ({
      ...inputs,
      [name]: value,
    }));
  };

  const uploadFile = async (field, path, file, labelNum) => {
    if (!file) return;
    const {
      data: { fullPath },
      error,
    } = await supabase.storage
      .from(path)
      .upload(`${uploadsLabel}${labelNum ?? ""}`, file);
    if (error) {
      console.error(`Error uploading file (${path}):`, error.message);
    } else {
      const uploadedFile = `https://tkpuwnotngxomooeyuii.supabase.co/storage/v1/object/public/${fullPath}`;
      setFormData((inputs) => ({
        ...inputs,
        [field]:
          field == "images" ? [...inputs.images, uploadedFile] : uploadedFile,
      }));
      console.log(`File uploaded successfully (${path}):`, fullPath);
    }
  };

  const submitReport = async () => {
    // Upload voice note
    setVoiceRecordLoading(true);
    await uploadFile("voiceNote", "voicenotes", voiceRecord);
    setVoiceRecordLoading(false);

    // Upload video
    setVideoLoading(true);
    await uploadFile("video", "videos", selectedVideo);
    setVideoLoading(false);

    // Upload images
    setImageLoading(true);
    for (let i = 0; i < selectedImages.length; i++) {
      const selectedImage = selectedImages[i];
      await uploadFile("images", "images", selectedImage, i + 1);
    }
    setImageLoading(false);

    // Insert form data
    setSubmitting(true);
  };

  const finalizeSubmit = useCallback(async () => {
    const { data, error } = await supabase
      .from("crimes")
      .insert({ ...formData, severity: parseInt(formData.severity) })
      .select();
    if (error) {
      console.error("Error submitting form data:", error.message);
    } else {
      console.log("Form data submitted successfully:", data);
      alert(`Kindly copy your case ID : ${data[0].caseId}`);
    }
    setSubmitting(false);

    closeModal();
  }, [formData, closeModal]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false; // toggle flag after first run
      return; // skip the effect
    }
    if (submitting) {
      finalizeSubmit();
    }
  }, [finalizeSubmit, submitting]);

  return (
    <div className={classes}>
      <Modal
        closeOnOverlayClick={false}
        isOpen={openModal}
        onClose={closeModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="blue.400" color="white">
            Report a Crime
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className={classes}>
            <FormControl id="name" mb="4">
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your name"
                name="reporter"
                value={formData.reporter}
                onChange={handleFormChange}
              />
            </FormControl>
            <FormControl id="phone" mb="4">
              <FormLabel>Phone</FormLabel>
              <Input
                type="tel"
                placeholder="Phone number"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
              />
            </FormControl>

            <FormControl id="address" mb="4">
              <FormLabel>Enter incident location</FormLabel>
              <Input
                type="text"
                name="address"
                placeholder="Enter incident location"
                value={formData.address}
                onChange={handleFormChange}
              />
            </FormControl>
            <Center fontSize="2xl" mb="4">
              Crime details
            </Center>

            <FormControl id="natureOfCrime" mb="4">
              <FormLabel>Nature of Crime</FormLabel>

              <Select
                placeholder="Select nature of crime"
                name="natureOfCrime"
                value={formData.natureOfCrime}
                onChange={handleFormChange}
              >
                {natureOfCrime.map((v, i) => (
                  <option key={i} value={v}>
                    {v}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="crimeDescription" mb="4">
              <FormLabel>Crime description</FormLabel>
              <Textarea
                placeholder="Enter your report"
                name="crimeDescription"
                value={formData.crimeDescription}
                onChange={handleFormChange}
              />
            </FormControl>
            <FormControl id="severity" mb="4">
              <FormLabel>Severity</FormLabel>

              <Select
                placeholder="Select severity"
                name="severity"
                value={formData.severity}
                onChange={handleFormChange}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="voiceNote" mb="4">
              <FormLabel>Voice note</FormLabel>
              <Text>Press the ⏹ button to stop recording</Text>
              <VoiceRecorder
                mainContainerStyle={{ margin: 0 }}
                downloadable={false}
                onAudioDownload={setVoiceRecord}
                onRecordingStart={() => setVoiceRecord(null)}
              />
              <Progress size="xs" isIndeterminate={voiceRecordLoading} />
            </FormControl>
            {/* TODO make this space hidden if no file is available */}
            <FormControl id="evidence">
              <FormLabel>Upload Evidence</FormLabel>
              <Box my={3}>
                {!!selectedImages.length && (
                  <Grid templateColumns="repeat(4, 1fr)" h="12" mb={2}>
                    {imagePreviews.map((image, i) => (
                      <GridItem
                        colSpan={1}
                        key={i}
                        overflow="hidden"
                        borderRadius="5px"
                        justifyContent="center"
                        alignItems="center"
                        position="relative"
                        display="flex"
                      >
                        <Img
                          objectFit="cover"
                          objectPosition="center"
                          src={image}
                          alt="Dan Abramov"
                          w="100%"
                          h="100%"
                          onMouseEnter={() => setHoveredImage(i)}
                          onMouseOut={() => setHoveredImage(null)}
                        />
                        {hoveredImage == i && (
                          <CloseButton
                            position="absolute"
                            size="sm"
                            bg="red"
                            color="white"
                            borderRadius="full"
                            onMouseEnter={() => setHoveredImage(i)}
                            onClick={() => deleteImage(i)}
                          />
                        )}
                      </GridItem>
                    ))}
                  </Grid>
                  // </Box>
                )}
                {selectedImages.length < 4 && (
                  <Flex
                    justify="center"
                    px={4}
                    pt={3}
                    pb={4}
                    borderWidth={2}
                    borderStyle="dashed"
                    borderColor="black"
                    rounded="md"
                  >
                    <Stack spacing={1} textAlign="center">
                      <Icon
                        mx="auto"
                        boxSize={12}
                        color="gray.400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Icon>
                      <Flex
                        fontSize="sm"
                        color="gray.600"
                        alignItems="baseline"
                      >
                        <FormLabel
                          color="blue.400"
                          htmlFor="image-upload"
                          cursor="pointer"
                          rounded="md"
                          fontSize="md"
                          pos="relative"
                          _hover={{
                            color: "blue",
                          }}
                        >
                          <span> Upload Images</span>

                          <VisuallyHidden>
                            <Input
                              id="image-upload"
                              name="image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              multiple
                            />
                          </VisuallyHidden>
                        </FormLabel>
                        <Text>or drag and drop</Text>
                      </Flex>
                      <Text fontSize="xs" color="gray.500">
                        (Maximum of 4)
                      </Text>
                    </Stack>
                  </Flex>
                )}

                <Progress size="xs" isIndeterminate={imageLoading} />
              </Box>

              {selectedVideo && ( // This video will have equal sides
                <Box position="relative">
                  <AspectRatio
                    my={2}
                    // maxW="560px"
                    ratio={3 / 2}
                    display={selectedVideo ? "block" : "none"}
                  >
                    <iframe src={videoPreview} allowFullScreen />
                  </AspectRatio>
                  <CloseButton
                    top="10px"
                    right="10px"
                    position="absolute"
                    size="sm"
                    bg="red"
                    color="white"
                    borderRadius="full"
                    // onMouseEnter={() => setHoveredImage(i)}
                    onClick={() => setSelectedVideo(null)}
                  />
                </Box>
              )}
              {!selectedVideo && (
                <Flex
                  mt={1}
                  justify="center"
                  px={4}
                  pt={3}
                  pb={4}
                  borderWidth={2}
                  borderStyle="dashed"
                  borderColor="black"
                  rounded="md"
                >
                  <Stack spacing={1} textAlign="center">
                    <Icon
                      mx="auto"
                      boxSize={12}
                      color="gray.400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Icon>
                    <Flex fontSize="sm" color="gray.600" alignItems="baseline">
                      <FormLabel
                        color="blue.400"
                        htmlFor="video-upload"
                        cursor="pointer"
                        rounded="md"
                        fontSize="md"
                        pos="relative"
                        _hover={{
                          color: "blue",
                        }}
                      >
                        <span>Upload video</span>
                        <VisuallyHidden>
                          <Input
                            id="video-upload"
                            name="video-upload"
                            type="file"
                            onChange={handleVideoChange}
                            accept="video/*"
                          />
                        </VisuallyHidden>
                      </FormLabel>
                      <Text>or drag and drop</Text>
                    </Flex>
                  </Stack>
                </Flex>
              )}

              <Progress size="xs" isIndeterminate={videoLoading} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              isDisabled={
                submitting || voiceRecordLoading || imageLoading || videoLoading
              }
              colorScheme="red"
              mr={3}
              onClick={closeModal}
            >
              Close
            </Button>
            <Button
              type="button"
              colorScheme="blue"
              isDisabled={voiceRecordLoading || imageLoading || videoLoading}
              isLoading={submitting}
              loadingText="Submitting"
              onClick={submitReport}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
