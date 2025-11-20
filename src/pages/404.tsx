import { Center, Text, Link as ChakraLink, VStack } from "@chakra-ui/react";
import NextLink from "next/link";

const Custom404 = () => {
  return (
    <Center h="100vh" p={4}>
      <VStack spacing={6} textAlign="center">
        <Text fontSize="4xl" fontWeight="bold">
          404 Not Found
        </Text>
        <Text fontSize="lg">
          The page you’re looking for cannot be found. Start again from{" "}
          <ChakraLink
            as={NextLink}
            href="/login"
            color="blue.400"
            fontWeight="bold"
          >
            AirsoftKalendar.com
          </ChakraLink>
        </Text>
      </VStack>
    </Center>
  );
};

export default Custom404;
