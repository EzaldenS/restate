import React, { useEffect, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FilterShape, defaultFilters } from '../components/types';

// Subcomponents
const BackButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
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
  const [activeThumb, setActiveThumb] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const handleThumbPress = (thumbIndex: number) => {
    setActiveThumb(thumbIndex);
  };

  const handleContainerLayout = (event: any) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const handleTouchMove = (event: any) => {
    if (activeThumb === null) return;

    const { locationX } = event.nativeEvent;
    const percentage = Math.min(Math.max(locationX / containerWidth, 0), 1);
    const newValue = min + percentage * (max - min);

    const newValues = [...values] as [number, number];
    newValues[activeThumb] = newValue;

    // Ensure min thumb doesn't exceed max thumb
    if (activeThumb === 0 && newValue > values[1]) {
      newValues[0] = values[1];
    } else if (activeThumb === 1 && newValue < values[0]) {
      newValues[1] = values[0];
    }

    onValuesChange(newValues);
  };

  const handleTouchEnd = () => {
    setActiveThumb(null);
  };

  return (
    <View className="mb-6">
      <Histogram />
      <View
        className="relative"
        onLayout={handleContainerLayout}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderMove={handleTouchMove}
        onResponderRelease={handleTouchEnd}
      >
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

        {/* Thumbs */}
        {[0, 1].map((index) => {
          const position = ((values[index] - min) / (max - min)) * 100;
          return (
            <View
              key={index}
              className="absolute -top-2.5"
              style={{ left: `${position}%` }}
            >
              <TouchableOpacity
                onPressIn={() => handleThumbPress(index)}
                activeOpacity={0.8}
                className="w-5 h-5 bg-primary-200 rounded-full border-2 border-white"
              />
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

interface FilterModalProps {
  visible: boolean;
  initialFilters?: Partial<FilterShape>;
  onApply: (filters: FilterShape) => void;
  onReset?: () => void;
  onClose: () => void;
}

export const FilterModal = ({
  visible,
  initialFilters,
  onApply,
  onReset,
  onClose,
}: FilterModalProps) => {
  console.log('FilterModal: Received props:', {
    visible,
    initialFilters,
    onApply: typeof onApply,
    onReset: typeof onReset,
    onClose: typeof onClose,
  });

  const insets = useSafeAreaInsets();
  const [filters, setFilters] = useState<FilterShape>(() => {
    const initial = { ...defaultFilters, ...initialFilters };
    console.log('FilterModal: Initial filters state:', initial);
    return initial;
  });

  useEffect(() => {
    if (initialFilters) {
      setFilters({ ...defaultFilters, ...initialFilters });
    }
  }, [initialFilters]);

  const handleReset = () => {
    setFilters(defaultFilters);
    onReset?.();
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const togglePropertyType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <Animated.View
        entering={SlideInDown.duration(300)}
        exiting={SlideOutDown.duration(300)}
        className="flex-1 justify-end bg-black/50"
      >
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          className="bg-white rounded-t-3xl border border-slate-100"
          style={{
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom,
            maxHeight: '92%',
          }}
        >
          <SafeAreaView className="flex-1">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 mb-6">
              <BackButton onPress={onClose} />
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
                  values={filters.priceRange}
                  onValuesChange={(values) => setFilters({ ...filters, priceRange: values })}
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
                      isSelected={filters.types.includes(type)}
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
                  value={filters.bedrooms}
                  onIncrement={() =>
                    setFilters({ ...filters, bedrooms: Math.min(filters.bedrooms + 1, 10) })
                  }
                  onDecrement={() =>
                    setFilters({ ...filters, bedrooms: Math.max(filters.bedrooms - 1, 0) })
                  }
                />
                <Counter
                  label="Bathrooms"
                  value={filters.bathrooms}
                  onIncrement={() =>
                    setFilters({ ...filters, bathrooms: Math.min(filters.bathrooms + 1, 10) })
                  }
                  onDecrement={() =>
                    setFilters({ ...filters, bathrooms: Math.max(filters.bathrooms - 1, 0) })
                  }
                />
              </View>

              {/* Building Size */}
              <View className="mb-6">
                <SectionTitle title="Building Size (sq ft)" />
                <RangeSlider
                  min={500}
                  max={5000}
                  values={filters.sizeRange}
                  onValuesChange={(values) => setFilters({ ...filters, sizeRange: values })}
                  formatValue={(value) => `${value}`}
                />
              </View>
            </ScrollView>

            {/* Sticky Bottom Button */}
            <View className="px-6 pb-4">
              <TouchableOpacity
                onPress={handleApply}
                className="bg-primary-200 rounded-full py-4 items-center justify-center"
                accessibilityRole="button"
                accessibilityLabel="Apply filters"
              >
                <Text className="text-white font-rubik-extra-bold text-base">Set Filter</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default FilterModal;