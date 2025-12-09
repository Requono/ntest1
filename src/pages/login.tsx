import { useUserStore } from "@/store/UserStore";
import { useRouter } from "next/router";
import { useState } from "react";
import * as Yup from "yup";
import {
  useToast,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  Spinner,
  Flex,
  Box,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import axios from "axios";
import {
  deriveEncryptionKeyFromMasterPassword,
  deriveLoginHash,
} from "@/utils/crypto";

const Login = () => {
  const router = useRouter();
  const initializeUser = useUserStore((state) => state.initializeUser);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("E-mail cím megadása kötelező!")
      .email("Egy helyes e-mail címet adj meg!"),
    password: Yup.string().required("Jelszó megadása kötelező!"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      if (loading) {
        return;
      }
      setLoading(true);

      const response = await axios.post("/api/user/iterations", {
        email: values.email,
      });

      const iterations = response.data.iterations;

      const loginHash = await deriveLoginHash(
        values.password,
        values.email,
        iterations
      );

      try {
        const loginResponse = await axios.post("/api/user/login_user", {
          email: values.email,
          hash: loginHash,
        });

        const encryptionKey = await deriveEncryptionKeyFromMasterPassword(
          values.password,
          values.email,
          iterations
        );

        const user = loginResponse.data;

        initializeUser(
          { userId: user.userId, email: user.email, username: user.username },
          encryptionKey
        );

        router.push("/Calendar");
      } catch (err: any) {
        toast({
          title: err.response.data.message,
          duration: 4000,
          isClosable: true,
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      textAlign="center"
    >
      <Box
        maxW="400px"
        w="full"
        p={6}
        borderWidth={1}
        borderRadius="md"
        boxShadow="md"
      >
        <Heading size="md" mb={6} textAlign="center">
          Üdv újra!
        </Heading>
        <form onSubmit={formik.handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl
              isInvalid={!!formik.errors.email && !!formik.touched.email}
            >
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="text"
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
                  type={show ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                    {show ? "Elrejt" : "Mutat"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full" mt={4}>
              {loading ? <Spinner /> : "Bejelentkezés"}
            </Button>
            <Flex align="center" justify="center" mt={3} mb={2}>
              <Box>Vagy ha még nincs felhasználód:</Box>
            </Flex>
            <Button
              variant="outline"
              colorScheme="telegram"
              onClick={() => router.push("/Register")}
            >
              Regisztráció
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;
