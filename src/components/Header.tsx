import {
  Box,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon, SettingsIcon, CalendarIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
import UserGroups from "../icons/user-groups-icon.svg";

const Header = () => {
  const router = useRouter();
  const username = useUserStore((state) => state.username);
  useEffect(() => {
    if (!username) return;
  }, [username]);
  const logoutUser = useUserStore((state) => state.logoutUser);

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  return (
    <Box
      bg="green.600"
      color="white"
      px={6}
      py={3}
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Flex align="center">
        <Flex gap={4}>
          <Button
            variant="outline"
            colorScheme="white"
            _hover={{ bg: "green.800" }}
            onClick={() => router.push("/calendar")}
            leftIcon={<CalendarIcon />}
          >
            Calendar
          </Button>
          <Button
            variant="outline"
            colorScheme="white"
            _hover={{ bg: "green.800" }}
            onClick={() => router.push("/group")}
            leftIcon={<UserGroups width="16px" height="16px" fill="white" />}
          >
            Group
          </Button>
          <Button
            variant="outline"
            colorScheme="white"
            _hover={{ bg: "green.800" }}
            onClick={() => router.push("/profile")}
            leftIcon={<SettingsIcon />}
          >
            Profile
          </Button>
        </Flex>
        <Spacer />
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="solid"
            colorScheme="white"
          >
            <Text fontWeight="bold">
              {username ? "Logged in as " + username : "Logged in as User"}
            </Text>
          </MenuButton>
          <MenuList bg="green.700" borderColor="green.800">
            <MenuItem
              onClick={handleLogout}
              bg="green.700"
              _hover={{ bg: "green.800" }}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};

export default Header;
