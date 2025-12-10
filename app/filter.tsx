import { FilterShape } from '@/components/types';
import { useGlobalContext } from '@/lib/global-provider';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Subcomponents (same as FilterModal but simplified for page)
const BackButton = () => (
  <TouchableOpacity
    onPress={() => router.back()}
    className="w-11 h-11 bg-primary-100 rounded-full items-center justify-center"
    accessibilityRole="button"
    accessibilityLabel="Go back"
  >
    <Text className="text-primary-200 text-xl">←</Text>
  </TouchableOpacity>
);

const ResetButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} accessibilityRole="button" accessibilityLabel="Reset all filters">
    <Text className="text-primary-200 font-rubik-medium text-sm">Reset</Text>
  </TouchableOpacity>
);

const SectionTitle = ({ title }: { title: string }) => (
  <Text className="text-black-300 font-rubik-medium text-base mb-4">{title}</Text>
);

const Pill = ({
  label,
  isSelected,
  onPress,
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-4 py-2 rounded-full mr-2 mb-2 ${
      isSelected
        ? 'bg-primary-200'
        : 'bg-white border border-slate-200'
    }`}
    accessibilityRole="button"
    accessibilityLabel={`${label} filter ${isSelected ? 'selected' : 'not selected'}`}
    accessibilityHint="Tap to toggle selection"
  >
    <Text className={`text-sm ${isSelected ? 'text-white font-rubik-medium' : 'text-black-300 font-rubik'}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

const Counter = ({
  label,
  value,
  onIncrement,
  onDecrement,
}: {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}) => (
  <View className="flex-row items-center justify-between mb-4">
    <Text className="text-black-300 font-rubik text-sm">{label}</Text>
    <View className="flex-row items-center">
      <TouchableOpacity
        onPress={onDecrement}
        disabled={value <= 0}
        className={`w-8 h-8 rounded-full border border-primary-200 items-center justify-center mr-2 ${
          value <= 0 ? 'opacity-50' : ''
        }`}
        accessibilityRole="button"
        accessibilityLabel={`Decrease ${label}`}
      >
        <Text className="text-primary-200 text-lg">−</Text>
      </TouchableOpacity>
      <Text className="text-black-300 font-rubik-medium text-base w-8 text-center">{value}</Text>
      <TouchableOpacity
        onPress={onIncrement}
        disabled={value >= 10}
        className={`w-8 h-8 rounded-full border border-primary-200 items-center justify-center ml-2 ${
          value >= 10 ? 'opacity-50' : ''
        }`}
        accessibilityRole="button"
        accessibilityLabel={`Increase ${label}`}
      >
        <Text className="text-primary-200 text-lg">+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const Histogram = () => (
  <View className="flex-row items-end justify-between h-16 mb-4">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((bar, index) => (
      <View
        key={index}
        className="bg-slate-100 rounded-t"
        style={{
          height: `${Math.random() * 40 + 20}%`,
          width: 4,
        }}
      />
    ))}
  </View>
);

const RangeSlider = ({
  min,
  max,
  values,
  onValuesChange,
  formatValue,
  showLabels = true,
}: {
  min: number;
  max: number;
  values: [number, number];
  onValuesChange: (values: [number, number]) => void;
  formatValue?: (value: number) => string;
  showLabels?: boolean;
}) => {
  const [isSliding, setIsSliding] = useState(false);

  const handleSlide = (newValues: [number, number]) => {
    onValuesChange(newValues);
  };

  return (
    <View className="mb-6">
      <Histogram />
      <View className="relative">
        {/* Track */}
        <View className="h-1 bg-slate-100 rounded-full relative">
          <View
            className="absolute h-1 bg-primary-200 rounded-full"
            style={{
              left: `${((values[0] - min) / (max - min)) * 100}%`,
              right: `${100 - ((values[1] - min) / (max - min)) * 100}%`,
            }}
          />
        </View>

        {/* Thumbs - Original design */}
        {[0, 1].map((index) => {
          const position = ((values[index] - min) / (max - min)) * 100;
          return (
            <View
              key={index}
              className="absolute -top-2.5"
              style={{ left: `${position}%` }}
            >
              <View className="w-5 h-5 bg-primary-200 rounded-full border-2 border-white" />
              {showLabels && (
                <View className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                  <Text className="text-primary-200 text-xs font-rubik-medium">
                    {formatValue ? formatValue(values[index]) : values[index]}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const propertyTypes = [
  'House',
  'Apartment',
  'Condo',
  'Townhouse',
  'Villa',
  'Land',
  'Commercial',
];

const FilterPage = () => {
  const insets = useSafeAreaInsets();
  const { filters, setFilters } = useGlobalContext();
  const [localFilters, setLocalFilters] = useState<FilterShape>(filters);

  const handleReset = () => {
    const defaultFilters = {
      priceRange: [100, 500] as [number, number],
      sizeRange: [1000, 3000] as [number, number],
      types: [] as string[],
      bedrooms: 0,
      bathrooms: 0,
    };
    setLocalFilters(defaultFilters);
  };

  const handleApply = () => {
    setFilters(localFilters);
    console.log('Filters applied:', localFilters);

    // Always go to explore page to show filtered results
    // This ensures users see their filtered results regardless of where they came from
    console.log('Redirecting to explore page to show filtered results');
    router.replace('/explore');
  };

  const togglePropertyType = (type: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 mb-6">
          <BackButton />
          <Text className="text-black-300 font-rubik-extra-bold text-xl">Filter</Text>
          <ResetButton onPress={handleReset} />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Price Range */}
          <View className="mb-6">
            <SectionTitle title="Price Range" />
            <RangeSlider
              min={50}
              max={1000}
              values={localFilters.priceRange}
              onValuesChange={(values) => setLocalFilters({ ...localFilters, priceRange: values })}
              formatValue={(value) => `$${value}`}
            />
          </View>

          {/* Property Type */}
          <View className="mb-6">
            <SectionTitle title="Property Type" />
            <View className="flex-row flex-wrap">
              {propertyTypes.map((type) => (
                <Pill
                  key={type}
                  label={type}
                  isSelected={localFilters.types.includes(type)}
                  onPress={() => togglePropertyType(type)}
                />
              ))}
            </View>
          </View>

          {/* Home Details */}
          <View className="mb-6">
            <SectionTitle title="Home Details" />
            <Counter
              label="Bedrooms"
              value={localFilters.bedrooms}
              onIncrement={() =>
                setLocalFilters({ ...localFilters, bedrooms: Math.min(localFilters.bedrooms + 1, 10) })
              }
              onDecrement={() =>
                setLocalFilters({ ...localFilters, bedrooms: Math.max(localFilters.bedrooms - 1, 0) })
              }
            />
            <Counter
              label="Bathrooms"
              value={localFilters.bathrooms}
              onIncrement={() =>
                setLocalFilters({ ...localFilters, bathrooms: Math.min(localFilters.bathrooms + 1, 10) })
              }
              onDecrement={() =>
                setLocalFilters({ ...localFilters, bathrooms: Math.max(localFilters.bathrooms - 1, 0) })
              }
            />
          </View>

          {/* Building Size */}
          <View className="mb-6">
            <SectionTitle title="Building Size (sq ft)" />
            <RangeSlider
              min={500}
              max={5000}
              values={localFilters.sizeRange}
              onValuesChange={(values) => setLocalFilters({ ...localFilters, sizeRange: values })}
              formatValue={(value) => `${value}`}
            />
          </View>
        </ScrollView>

        {/* Sticky Bottom Button */}
        <View className="px-6 pb-4" style={{ paddingBottom: insets.bottom }}>
          <TouchableOpacity
            onPress={handleApply}
            className="bg-primary-200 rounded-full py-4 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Apply filters"
          >
            <Text className="text-white font-rubik-extra-bold text-base">Set Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FilterPage;