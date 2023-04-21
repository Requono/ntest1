import styled from "@emotion/styled";
import { Input, Stack, Button } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    axios.post("/api/create_user", {
      name: name,
      email: email,
      password: password,
    });
  };
  return (
    <>
      <Stack>
        <Input
          placeholder="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></Input>
        <Input
          placeholder="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        ></Input>
        <Input
          placeholder="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></Input>
      </Stack>
      <Button onClick={handleRegister}>Press me!</Button>
    </>
  );
}
