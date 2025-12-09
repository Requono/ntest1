import {
  Input,
  Button,
  InputGroup,
  InputRightElement,
  Spinner,
  useToast,
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { deriveLoginHash } from "@/utils/crypto";
import { useUserStore } from "@/store/userStore";

interface RegisterProps {
  iterations?: string;
}

const Register: React.FC<RegisterProps> = ({ iterations }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { createUser } = useUserStore();

  const registerSchema = Yup.object().shape({
    username: Yup.string().required("Felhasználónév megadása kötelező!"),
    email: Yup.string()
      .required("E-mail megadása kötelező!")
      .email("Érvényes e-mail címet adj meg!"),
    password: Yup.string()
      .required("Jelszó megadása kötelező!")
      .min(8, "Nem elég hosszú!")
      .matches(/[a-z]/, "A jelszónak tartalmaznia kell legalább 1 kisbetűt")
      .matches(/[A-Z]/, "A jelszónak tartalmaznia kell legalább 1 nagybetűt")
      .matches(/[0-9]/, "A jelszónak tartalmaznia kell legalább 1 számot"),
    repassword: Yup.string()
      .required("Jelszó ellenőrzése kötelező!")
      .test({
        name: "is-the-same",
        message: "Jelszavak nem egyeznek!",
        test: (value, context) => {
          return value === context.parent.password;
        },
      }),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      repassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      if (loading) return;
      setLoading(true);

      const loginHash = await deriveLoginHash(
        values.password,
        values.email,
        600000
      );

      try {
        await createUser(values.username, values.email, loginHash);

        toast({
          title: "Sikeres regisztráció!",
          isClosable: true,
          duration: 4000,
          status: "success",
        });

        router.push("/Login");
      } catch (error: any) {
        toast({
          title: error.response.data.username,
          isClosable: true,
          duration: 4000,
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={4}
    >
      <Box w="400px" p={6} borderWidth={1} borderRadius="md">
        <Heading size="md" mb={6} textAlign="center">
          Regisztráció
        </Heading>
        <form onSubmit={formik.handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl
              isInvalid={!!formik.errors.username && !!formik.touched.username}
            >
              <FormLabel>Felhasználónév</FormLabel>
              <Input
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={!!formik.errors.email && !!formik.touched.email}
            >
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={!!formik.errors.password && !!formik.touched.password}
            >
              <FormLabel>Jelszó</FormLabel>
              <InputGroup>
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Elrejt" : "Mutat"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={
                !!formik.errors.repassword && !!formik.touched.repassword
              }
            >
              <FormLabel>Jelszó mégegyszer</FormLabel>
              <InputGroup>
                <Input
                  name="repassword"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.repassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Elrejt" : "Mutat"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{formik.errors.repassword}</FormErrorMessage>
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full" mt={4}>
              {loading ? <Spinner /> : "Regisztráció"}
            </Button>
            <Flex align="center" justify="center" mt={3} mb={2}>
              <Box>Ha már van felhasználód:</Box>
            </Flex>
            <Button
              variant="outline"
              colorScheme="telegram"
              width="full"
              mt={2}
              onClick={() => router.push("/Login")}
            >
              Bejelentkezés
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default Register;

export async function getServerSideProps() {
  try {
    const response = await axios.post("/api/user/iterations");
    return {
      props: {
        iterations: response.data.iterations,
      },
    };
  } catch (error) {
    console.error("Error fetching iterations:", error);
  }
  return {
    props: {
      iterations: [],
    },
  };
}
