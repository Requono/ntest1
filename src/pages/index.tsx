import styled from "@emotion/styled";
import { Link } from "@chakra-ui/next-js";

const Container = styled.div`
  background-color: red;
`;

export default function Home() {
  return (
    <>
      <Link href="/register" color="blue.400" _hover={{ color: "blue.500" }}>
        Register
      </Link>
      <Container>asdadsasdasd</Container>
    </>
  );
}
