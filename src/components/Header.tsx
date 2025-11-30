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
import { useUserStore } from "@/store/UserStore";
import { useEffect, useState } from "react";
import UserGroups from "../icons/user-groups-icon.svg";
import { useEventStore } from "@/store/EventStore";
import EventSearchBar from "./EventSearchBar";

const Header = () => {
  const router = useRouter();
  const username = useUserStore((state) => state.username);
  useEffect(() => {
    if (!username) return;
  }, [username]);
  const logoutUser = useUserStore((state) => state.logoutUser);
  const handleLogout = () => {
    logoutUser();
    router.push("/Login");
  };

  const { events } = useEventStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setDropdownOpen(false);
      return;
    }

    const q = query.toLowerCase();

    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(q) ||
        event.location.toLowerCase().includes(q) ||
        event.gameType.toLowerCase().includes(q)
    );

    setResults(filtered);
    setDropdownOpen(true);
  }, [query, events]);

  const handleSelectEvent = (id: string) => {
    setDropdownOpen(false);
    setQuery("");
    router.push(`/event/${id}`);
  };

  return (
    <Box
      bg="green.600"
      color="white"
      px={{ base: 4, md: 6 }}
      py={3}
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
        gap={{ base: 2, md: 4 }}
      >
        <Flex gap={2} wrap="wrap">
          <Button
            variant="outline"
            colorScheme="white"
            _hover={{ bg: "green.800" }}
            onClick={() => router.push("/Calendar")}
            leftIcon={<CalendarIcon />}
            size="md"
          >
            Calendar
          </Button>
          <Button
            variant="outline"
            colorScheme="white"
            _hover={{ bg: "green.800" }}
            onClick={() => router.push("/Group")}
            leftIcon={<UserGroups width="16px" height="16px" fill="white" />}
            size="md"
          >
            Group
          </Button>
          <Button
            variant="outline"
            colorScheme="white"
            _hover={{ bg: "green.800" }}
            onClick={() => router.push("/Profile")}
            leftIcon={<SettingsIcon />}
            size="md"
          >
            Profile
          </Button>
        </Flex>
        <Spacer />
        <EventSearchBar
          query={query}
          setQuery={setQuery}
          results={results}
          isDropdownOpen={isDropdownOpen}
          setDropdownOpen={setDropdownOpen}
          handleSelectEvent={handleSelectEvent}
        />
        <Spacer />
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="outline"
            colorScheme="white"
            size="md"
          >
            <Text fontWeight="bold" noOfLines={1}>
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
