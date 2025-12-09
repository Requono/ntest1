import { Center, Text, Link as ChakraLink, VStack } from "@chakra-ui/react";
import NextLink from "next/link";

const Custom404 = () => {
  return (
    <Center h="100vh" p={4}>
      <VStack spacing={6} textAlign="center">
        <Text fontSize="4xl" fontWeight="bold">
          404 Nem található
        </Text>
        <Text fontSize="lg">
          Keresett oldal nem található. Kezdd előlről{" "}
          <ChakraLink
            as={NextLink}
            href="/Login"
            color="blue.400"
            fontWeight="bold"
          >
            AirsoftKalendár
          </ChakraLink>
        </Text>
      </VStack>
    </Center>
  );
};

export default Custom404;
