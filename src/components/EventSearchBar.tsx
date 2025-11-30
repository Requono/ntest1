import { useRef } from "react";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Text,
  useOutsideClick,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

interface EventSearchBarProps {
  query: string;
  setQuery: (value: string) => void;
  results: { id: string; title: string; location: string; gameType: string }[];
  isDropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  handleSelectEvent: (id: string) => void;
}

const EventSearchBar: React.FC<EventSearchBarProps> = ({
  query,
  setQuery,
  results,
  isDropdownOpen,
  setDropdownOpen,
  handleSelectEvent,
}) => {
  const searchRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick({
    ref: searchRef,
    handler: () => setDropdownOpen(false),
  });

  return (
    <Box position="relative" ref={searchRef} w={{ base: "100%", md: "750px" }}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.200" />
        </InputLeftElement>
        <Input
          placeholder="Search events..."
          bg="white"
          color="black"
          value={query}
          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);
            setDropdownOpen(value.trim().length > 0);
          }}
          borderRadius="md"
        />
      </InputGroup>

      {isDropdownOpen && results.length > 0 && (
        <Box
          position="absolute"
          top="45px"
          left={0}
          right={0}
          bg="white"
          color="black"
          borderRadius="md"
          boxShadow="lg"
          maxH="300px"
          overflowY="auto"
          zIndex={3000}
        >
          <VStack align="stretch" spacing={0}>
            {results.map((event) => (
              <Box
                key={event.id}
                px={4}
                py={2}
                borderBottom="1px solid #eee"
                _hover={{ bg: "gray.100", cursor: "pointer" }}
                onClick={() => handleSelectEvent(event.id)}
              >
                <Text fontWeight="bold">{event.title}</Text>
                <Text fontSize="sm" color="gray.600">
                  {event.location} • {event.gameType}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default EventSearchBar;
