import { Box, Flex, Link, Text, Spacer } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box
      color="black"
      paddingTop="1"
      borderTop="1px solid"
      borderColor="green.800"
      width="100%"
    >
      <Flex align="center" maxW="1200px" mx="auto" w="100%">
        <Text fontSize="sm">{new Date().getFullYear()} Szakdolgozat</Text>
        <Spacer />
        <Link
          href="https://github.com/Requono/ntest1"
          isExternal
          fontSize="sm"
          _hover={{ textDecoration: "underline", color: "green.400" }}
        >
          GitHub Repo
        </Link>
      </Flex>
    </Box>
  );
};

export default Footer;
