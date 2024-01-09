import { Box } from "@chakra-ui/react";

import { StarIcon } from "@chakra-ui/icons";

export default function Stars({ count }) {
  return (
    <Box>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={`star-${i}`}
          color={i < count ? "red.500" : "transparent"}
          stroke={i < count ? "" : "red"}
        />
      ))}
    </Box>
  );
}
