import React, { useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";
import { useDebouncedCallback } from "use-debounce";

import icons from "@/constants/icons";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { useGlobalContext } from "../lib/global-provider";

const Search = () => {
  const path = usePathname();
  const params = useLocalSearchParams<{ query?: string }>();
  const [search, setSearch] = useState(params.query);
  const { filters, setFilters } = useGlobalContext();

  console.log('Search Component: Global context values:', {
    filters,
    setFilters
  });

  const debouncedSearch = useDebouncedCallback((text: string) => {
    router.setParams({ query: text });
  }, 500);

  const handleSearch = (text: string) => {
    setSearch(text);
    debouncedSearch(text);
  };

  const handleFilterPress = () => {
    console.log('Filter button pressed - navigating to filter page');
    router.push('/filter');
  };

  // Note: Filter handling is now done in the dedicated filter page
  // This function is no longer needed in the Search component

  return (
    <>
      <View className="flex flex-row items-center justify-between w-full px-4 rounded-lg bg-accent-100 border border-primary-100 mt-5 py-2">
        <View className="flex-1 flex flex-row items-center justify-start z-50">
          <Image source={icons.search} className="size-5" />
          <TextInput
            value={search}
            onChangeText={handleSearch}
            placeholder="Search for anything"
            className="text-sm font-rubik text-black-300 ml-2 flex-1"
          />
        </View>

        <TouchableOpacity
          onPress={handleFilterPress}
          className="p-2 bg-primary-100 rounded-full"
          accessibilityLabel="Open filters"
          accessibilityHint="Tap to open filter options"
        >
          <Image source={icons.filter} className="size-5" />
        </TouchableOpacity>
      </View>

    </>
  );
};

export default Search;
