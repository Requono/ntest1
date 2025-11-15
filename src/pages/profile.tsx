import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useUserStore } from "@/store/userStore";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const Profile = () => {
  const toast = useToast();
  const { username, email, fetchUser, updateUser } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);

  const profileSchema = Yup.object().shape({
    email: Yup.string().email("Please enter a valid e-mail"),
    newPassword: Yup.string()
      .min(8, "Not long enough!")
      .matches(/[a-z]/, "Password must contain at least a small letter!")
      .matches(/[A-Z]/, "Password must contain at least a capital letter!")
      .matches(/[0-9]/, "Password must contain at least a number!"),
    confirmPassword: Yup.string().test({
      name: "is-the-same",
      message: "Password does not match!",
      test: (value, context) => {
        return value === context.parent.newPassword;
      },
    }),
  });

  useEffect(() => {
    if (!username || !email) fetchUser();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: profileSchema,
    initialValues: {
      username: username || "",
      email: email || "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      try {
        await updateUser({
          username: values.username,
          email: values.email,
          newPassword: values.newPassword || undefined,
        });
        toast({
          title: "Profile updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        formik.resetForm({
          values: { ...values, newPassword: "", confirmPassword: "" },
        });
      } catch (error) {
        toast({
          title: "Failed to update profile",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
  });

  return (
    <>
      <Header />
      <Box minH="1150px">
        <Box
          maxW="600px"
          mx="auto"
          mt={10}
          p={6}
          borderWidth={1}
          borderRadius="md"
        >
          <Heading mb={6}>Profile Settings</Heading>
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl
                isInvalid={
                  !!formik.errors.username && !!formik.touched.username
                }
              >
                <FormLabel>Username</FormLabel>
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
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={
                  !!formik.errors.newPassword && !!formik.touched.newPassword
                }
              >
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Leave empty to keep current password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      style={{
                        fontVariant: "small-caps",
                        fontSize: "12px",
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{formik.errors.newPassword}</FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={
                  !!formik.errors.confirmPassword &&
                  !!formik.touched.confirmPassword
                }
              >
                <FormLabel>Confirm New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Repeat new password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      style={{
                        fontVariant: "small-caps",
                        fontSize: "12px",
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {formik.errors.confirmPassword}
                </FormErrorMessage>
              </FormControl>
              <Box
                className="button-container"
                style={{
                  marginTop:
                    !!formik.errors.confirmPassword &&
                    !!formik.touched.confirmPassword
                      ? "20px"
                      : "48px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Button type="submit" colorScheme="blue">
                  Save Changes
                </Button>
              </Box>
            </VStack>
          </form>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Profile;
