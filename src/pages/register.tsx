import {
  Input,
  Button,
  Image,
  InputGroup,
  InputRightElement,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import classes from "./register.module.css";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { deriveLoginHash } from "@/utils/crypto";

interface RegisterProps {
  iterations: string;
}

const Register: React.FC<RegisterProps> = ({ iterations }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const registerSchema = Yup.object().shape({
    username: Yup.string().required("Username field is required!"),
    email: Yup.string()
      .required("E-mail field is required!")
      .email("Please enter a valid e-mail"),
    password: Yup.string()
      .required("Password is a required field!")
      .min(8, "Not long enough!")
      .matches(/[a-z]/, "Password must contain at least a small letter!")
      .matches(/[A-Z]/, "Password must contain at least a capital letter!")
      .matches(/[0-9]/, "Password must contain at least a number!"),
    repassword: Yup.string()
      .required("Password again is a required field!")
      .test({
        name: "is-the-same",
        message: "Password does not match!",
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
      console.log("values: ", values);
      if (loading) return;
      setLoading(true);

      const loginHash = await deriveLoginHash(
        values.password,
        values.email,
        600000
      );

      try {
        await axios.post("/api/create_user", {
          username: values.username,
          email: values.email,
          password: values.password,
          hash: loginHash,
        });

        toast({
          title: "Successful registration!",
          isClosable: true,
          duration: 4000,
          status: "success",
        });

        router.push("/login");
      } catch (error: any) {
        console.log(error);
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
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div className={classes.registerScreenContainer}>
          <div className="title-box">
            <Image
              width={500}
              height={150}
              alt="logo here "
              style={{
                marginBottom: "24px",
              }}
            />
            <span className={classes.subTitle}>
              Welcome! Since you are new here, please sign up below.
            </span>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div
              className="input-container"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <InputGroup
                size="md"
                style={{
                  width: "300px",
                  flexDirection: "column",
                }}
              >
                <Input
                  type="text"
                  placeholder="username"
                  name="username"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  isInvalid={
                    !!formik.errors.username && !!formik.touched.username
                  }
                  errorBorderColor="red.300"
                  focusBorderColor={
                    !!formik.errors.username && !!formik.touched.username
                      ? "crimson"
                      : "blue.500"
                  }
                />
                {formik.errors.username && formik.touched.username && (
                  <div className={classes.errorMessage}>
                    {formik.errors.username}
                  </div>
                )}
              </InputGroup>
              <InputGroup
                size="md"
                style={{
                  width: "300px",
                  flexDirection: "column",
                  marginTop:
                    !!formik.errors.username && !!formik.touched.username
                      ? "4px"
                      : "32px",
                  marginBottom:
                    !!formik.errors.password && !!formik.touched.password
                      ? "4px"
                      : "32px",
                }}
              >
                <Input
                  pr="4.5rem"
                  type="text"
                  placeholder="e-mail"
                  name="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  isInvalid={!!formik.errors.email && !!formik.touched.email}
                  errorBorderColor="red.300"
                  focusBorderColor={
                    !!formik.errors.email && !!formik.touched.email
                      ? "crimson"
                      : "blue.500"
                  }
                />
                {formik.errors.email && formik.touched.email && (
                  <div className={classes.errorMessage}>
                    {formik.errors.email}
                  </div>
                )}
              </InputGroup>
              <InputGroup
                size="md"
                style={{
                  width: "300px",
                  flexDirection: "column",
                }}
              >
                <Input
                  pr="4.5rem"
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  isInvalid={
                    !!formik.errors.password && !!formik.touched.password
                  }
                  errorBorderColor="red.300"
                  focusBorderColor={
                    !!formik.errors.password && !!formik.touched.password
                      ? "crimson"
                      : "blue.500"
                  }
                />
                {formik.errors.password && formik.touched.password && (
                  <div className={classes.errorMessage}>
                    {formik.errors.password}
                  </div>
                )}
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
              <InputGroup
                size="md"
                style={{
                  width: "300px",
                  flexDirection: "column",
                  marginTop:
                    !!formik.errors.username && !!formik.touched.username
                      ? "4px"
                      : "32px",
                }}
              >
                <Input
                  pr="4.5rem"
                  type={showPassword ? "text" : "password"}
                  placeholder="password again"
                  name="repassword"
                  onChange={formik.handleChange}
                  value={formik.values.repassword}
                  isInvalid={
                    !!formik.errors.repassword && !!formik.touched.repassword
                  }
                  errorBorderColor="red.300"
                  focusBorderColor={
                    !!formik.errors.repassword && !!formik.touched.repassword
                      ? "crimson"
                      : "blue.500"
                  }
                />
                {formik.errors.repassword && formik.touched.repassword && (
                  <div className={classes.errorMessage}>
                    {formik.errors.repassword}
                  </div>
                )}
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
            </div>
            <div
              className="button-container"
              style={{
                marginTop:
                  !!formik.errors.repassword && !!formik.touched.repassword
                    ? "20px"
                    : "48px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button
                variant="solid"
                colorScheme="telegram"
                type="submit"
                style={{
                  marginBottom: "72px",
                  width: "100px",
                  fontVariant: "small-caps",
                }}
              >
                {loading ? <Spinner /> : "Sign up"}
              </Button>
              <span className="or-sign">or if you haven't done yet</span>
              <Button
                variant="outline"
                colorScheme="telegram"
                onClick={() => router.push("/login")}
                style={{
                  marginTop: "6px",
                  width: "100px",
                  borderColor: "#171923",
                  color: "#171923",
                  fontVariant: "small-caps",
                }}
              >
                Log in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;

export async function getServerSideProps() {
  try {
    const response = await axios.post("/api/iterations");
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
