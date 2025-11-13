import { useUserStore } from "@/store/userStore";
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
} from "@chakra-ui/react";
import { useFormik } from "formik";
import axios from "axios";
import {
  deriveEncryptionKeyFromMasterPassword,
  deriveLoginHash,
} from "@/utils/crypto";
import classes from "../styles/login.module.css";

const Login = () => {
  const router = useRouter();
  const initializeUser = useUserStore((state) => state.initializeUser);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required field!")
      .email("Please enter a valid email address!"),
    password: Yup.string().required("Password is a required field!"),
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

      const response = await axios.post("/api/iterations", {
        email: values.email,
      });

      const iterations = response.data.iterations;

      const loginHash = await deriveLoginHash(
        values.password,
        values.email,
        iterations
      );

      try {
        const loginResponse = await axios.post("/api/login_user", {
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

        router.push("/playground");
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div className={classes.loginScreenContainer}>
        <div className="title-box">
          <span className={classes.subTitle}>
            Welcome back! In case you already have an account, log in below.
          </span>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div
            className="input-container"
            style={{
              display: "flex",
              flexDirection: "column",
              gap:
                !!formik.errors.email && !!formik.touched.email
                  ? "4px"
                  : "32px",
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
                pr="4.5rem"
                type="text"
                placeholder="e-mail"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                isInvalid={!!formik.errors.email && formik.touched.email}
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
                type={show ? "text" : "password"}
                placeholder="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                isInvalid={!!formik.errors.password && formik.touched.password}
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
                  onClick={() => setShow(!show)}
                >
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </div>
          <div
            className="button-container"
            style={{
              marginTop:
                !!formik.errors.password && !!formik.touched.password
                  ? "20px"
                  : "48px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              variant="solid"
              colorScheme="blue"
              style={{
                marginBottom: "72px",
                width: "100px",
                fontVariant: "small-caps",
              }}
              type="submit"
            >
              {loading ? <Spinner /> : "Log in"}
            </Button>
            <span className="or-sign">or</span>
            <Button
              variant="outline"
              colorScheme="telegram"
              onClick={() => router.push("/register")}
              style={{
                marginTop: "6px",
                width: "100px",
                fontVariant: "small-caps",
                borderColor: "#171923",
                color: "#171923",
              }}
            >
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
