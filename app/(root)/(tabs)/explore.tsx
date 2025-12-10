import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Query } from "react-native-appwrite";

import { Card } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { useGlobalContext } from "@/lib/global-provider";

import { getProperties } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { SafeAreaView } from "react-native-safe-area-context";

const Explore = () => {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const { filters } = useGlobalContext();

  // Convert global filters to Appwrite query format
  const buildAppwriteQuery = () => {
    const queries = [];

    // Add URL filter if present
    if (params.filter && params.filter !== "All") {
      queries.push(Query.equal("type", params.filter));
    }

    // Add global filter types
    if (filters.types.length > 0) {
      queries.push(Query.equal("type", filters.types[0])); // Simple version - handle multiple types
    }

    // Add price range filters
    if (filters.priceRange[0] > 100) {
      queries.push(Query.greaterThanEqual("price", filters.priceRange[0]));
    }
    if (filters.priceRange[1] < 500) {
      queries.push(Query.lessThanEqual("price", filters.priceRange[1]));
    }

    // Add size range filters
    if (filters.sizeRange[0] > 1000) {
      queries.push(Query.greaterThanEqual("area", filters.sizeRange[0]));
    }
    if (filters.sizeRange[1] < 3000) {
      queries.push(Query.lessThanEqual("area", filters.sizeRange[1]));
    }

    // Add bedroom filter
    if (filters.bedrooms > 0) {
      queries.push(Query.greaterThanEqual("bedrooms", filters.bedrooms));
    }

    // Add bathroom filter
    if (filters.bathrooms > 0) {
      queries.push(Query.greaterThanEqual("bathrooms", filters.bathrooms));
    }

    // Add search query
    if (params.query) {
      queries.push(
        Query.or([
          Query.contains("name", params.query),
          Query.contains("address", params.query),
          Query.contains("type", params.query),
        ])
      );
    }

    return queries.length > 0 ? queries : [Query.orderDesc("$createdAt")];
  };

  const {
    data: properties,
    refetch,
    loading,
  } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter || "All",
      query: params.query || "",
      limit: 20, // Add reasonable limit
    },
    skip: true,
  });

  useEffect(() => {
    refetch({
      filter: params.filter || "All",
      query: params.query || "",
      limit: 20,
    });
  }, [params.filter, params.query]);

  // Custom function to apply global filters to the fetched properties
  const applyGlobalFilters = (props: any[]) => {
    if (!props || props.length === 0) return props;

    let filtered = [...props];

    // Apply type filters
    if (filters.types.length > 0) {
      filtered = filtered.filter((prop) => filters.types.includes(prop.type));
    }

    // Apply price range filters
    if (filters.priceRange[0] > 100 || filters.priceRange[1] < 500) {
      filtered = filtered.filter(
        (prop) =>
          prop.price >= filters.priceRange[0] &&
          prop.price <= filters.priceRange[1]
      );
    }

    // Apply size range filters
    if (filters.sizeRange[0] > 1000 || filters.sizeRange[1] < 3000) {
      filtered = filtered.filter(
        (prop) =>
          prop.area >= filters.sizeRange[0] && prop.area <= filters.sizeRange[1]
      );
    }

    // Apply bedroom filter
    if (filters.bedrooms > 0) {
      filtered = filtered.filter((prop) => prop.bedrooms >= filters.bedrooms);
    }

    // Apply bathroom filter
    if (filters.bathrooms > 0) {
      filtered = filtered.filter((prop) => prop.bathrooms >= filters.bathrooms);
    }

    console.log(
      `Applied global filters: ${props.length} -> ${filtered.length} properties`
    );
    return filtered;
  };

  // Apply global filters whenever properties or filters change
  const filteredProperties = properties ? applyGlobalFilters(properties) : [];

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={filteredProperties}
        numColumns={2}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item.$id)} />
        )}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={() => (
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-blue-100 rounded-full size-11 items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>

              <Text className="text-base mr-2 text-center font-rubik-medium text-black-300">
                Search for Your Ideal Home
              </Text>
              <Image source={icons.bell} className="w-6 h-6" />
            </View>

            <Search />

            <View className="mt-5">
              <Filters />

              {/* Filter Results Display */}
              {filters.types.length > 0 ||
              filters.bedrooms > 0 ||
              filters.bathrooms > 0 ||
              filters.priceRange[0] > 100 ||
              filters.priceRange[1] < 500 ||
              filters.sizeRange[0] > 1000 ||
              filters.sizeRange[1] < 3000 ? (
                <View className="bg-primary-100 rounded-lg p-3 mt-3">
                  <Text className="text-sm font-rubik-medium text-primary-200 mb-2">
                    Active Filters:
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {filters.types.length > 0 && (
                      <View className="bg-white px-2 py-1 rounded-full">
                        <Text className="text-xs text-black-300">
                          Types: {filters.types.join(", ")}
                        </Text>
                      </View>
                    )}
                    {filters.bedrooms > 0 && (
                      <View className="bg-white px-2 py-1 rounded-full">
                        <Text className="text-xs text-black-300">
                          Bedrooms: {filters.bedrooms}+
                        </Text>
                      </View>
                    )}
                    {filters.bathrooms > 0 && (
                      <View className="bg-white px-2 py-1 rounded-full">
                        <Text className="text-xs text-black-300">
                          Bathrooms: {filters.bathrooms}+
                        </Text>
                      </View>
                    )}
                    {(filters.priceRange[0] > 0 ||
                      filters.priceRange[1] < 50000) && (
                      <View className="bg-white px-2 py-1 rounded-full">
                        <Text className="text-xs text-black-300">
                          Price: ${filters.priceRange[0].toFixed(0)} - $
                          {filters.priceRange[1].toFixed(0)}
                        </Text>{" "}
                      </View>
                    )}
                    {(filters.sizeRange[0] > 1000 ||
                      filters.sizeRange[1] < 3000) && (
                      <View className="bg-white px-2 py-1 rounded-full">
                        <Text className="text-xs text-black-300">
                          Size: {filters.sizeRange[0]} - {filters.sizeRange[1]}{" "}
                          sq ft
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ) : null}

              <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                Found {properties?.length} Properties
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Explore;
