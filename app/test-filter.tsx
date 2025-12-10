import FilterModal from '@/components/FilterModal';
import FilterModalDemo from '@/components/FilterModalDemo';
import { FilterShape, defaultFilters } from '@/components/types';
import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TestFilterPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [filters, setFilters] = useState<FilterShape>(defaultFilters);

  const handleApplyFilters = (appliedFilters: FilterShape) => {
    console.log('Filters applied:', appliedFilters);
    setFilters(appliedFilters);
  };

  const handleResetFilters = () => {
    console.log('Filters reset');
    setFilters(defaultFilters);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-xl font-rubik-bold text-black-300 mb-4">
          FilterModal Test Page
        </Text>

        <Text className="text-base font-rubik-medium text-black-300 mb-2">
          Current Filters:
        </Text>
        <Text className="text-sm font-rubik text-black-200 mb-1">
          Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </Text>
        <Text className="text-sm font-rubik text-black-200 mb-1">
          Size: {filters.sizeRange[0]} - {filters.sizeRange[1]} sq ft
        </Text>
        <Text className="text-sm font-rubik text-black-200 mb-1">
          Bedrooms: {filters.bedrooms}, Bathrooms: {filters.bathrooms}
        </Text>
        <Text className="text-sm font-rubik text-black-200 mb-4">
          Types: {filters.types.length > 0 ? filters.types.join(', ') : 'None'}
        </Text>

        <Text className="text-base font-rubik-medium text-black-300 mb-2">
          Original FilterModal (with Global State):
        </Text>
        <Button
          title={showModal ? "Hide Filter Modal" : "Show Filter Modal"}
          onPress={() => setShowModal(!showModal)}
          color="#0066FF"
        />

        <Text className="text-base font-rubik-medium text-black-300 mb-2 mt-4">
          Demo FilterModal (with Hardcoded Data):
        </Text>
        <Button
          title={showDemoModal ? "Hide Demo Filter Modal" : "Show Demo Filter Modal"}
          onPress={() => setShowDemoModal(!showDemoModal)}
          color="#0066FF"
        />

        <FilterModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          initialFilters={filters}
        />

        <FilterModalDemo
          visible={showDemoModal}
          onClose={() => setShowDemoModal(false)}
        />
      </View>
    </SafeAreaView>
  );
};

export default TestFilterPage;