# FilterModal Component

A pixel-accurate, production-ready React Native Filter screen with modal style, rounded card, and sticky action at bottom.

## Features

- **Price Range**: Dual-thumb range slider with histogram background
- **Property Type**: Multi-select pill buttons
- **Home Details**: Bedroom and bathroom counters with plus/minus controls
- **Building Size**: Dual-thumb range slider for square footage
- **Sticky Bottom Action**: Fixed "Set Filter" button
- **Accessibility**: Full accessibility support with labels and hints
- **Animations**: Smooth entrance/exit animations using Reanimated
- **Safe Area**: Proper handling of device safe areas

## Installation

The component requires the following dependencies (already included in this Expo project):

```bash
# Required dependencies (already installed)
expo install react-native-safe-area-context
expo install react-native-reanimated
expo install react-native-gesture-handler
```

## Usage

```typescript
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import FilterModal, { FilterShape } from './components/FilterModal';

const ExampleScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterShape | null>(null);

  const handleApplyFilters = (appliedFilters: FilterShape) => {
    setFilters(appliedFilters);
    setModalVisible(false);
  };

  return (
    <View className="flex-1 p-4">
      <Button
        title="Open Filters"
        onPress={() => setModalVisible(true)}
      />

      <FilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onApply={handleApplyFilters}
        onReset={() => console.log('Filters reset')}
        initialFilters={filters}
      />
    </View>
  );
};

export default ExampleScreen;
```

## Props API

| Prop             | Type                             | Required | Description                       |
| ---------------- | -------------------------------- | -------- | --------------------------------- |
| `visible`        | `boolean`                        | ✅       | Controls modal visibility         |
| `onClose`        | `() => void`                     | ✅       | Called when user closes the modal |
| `onApply`        | `(filters: FilterShape) => void` | ✅       | Called when user applies filters  |
| `onReset`        | `() => void`                     | ❌       | Called when user resets filters   |
| `initialFilters` | `Partial<FilterShape>`           | ❌       | Initial filter values             |

## FilterShape Interface

```typescript
interface FilterShape {
  priceRange: [number, number]; // [min, max] in dollars
  sizeRange: [number, number]; // [min, max] in square feet
  types: string[]; // Array of selected property types
  bedrooms: number; // Number of bedrooms (0-10)
  bathrooms: number; // Number of bathrooms (0-10)
}
```

## Default Values

```typescript
const defaultFilters: FilterShape = {
  priceRange: [100, 500],
  sizeRange: [1000, 3000],
  types: [],
  bedrooms: 0,
  bathrooms: 0,
};
```

## Styling

The component uses NativeWind (Tailwind for React Native) with the following color palette:

- **Primary Blue**: `#0066FF` (used for filled pills, slider track, primary button)
- **Primary-100**: `#EAF3FF` (pill background, slider track background)
- **Text Dark**: `#191D31` (main text color)
- **Muted Text**: `#6B7280` or `#98A0B5` (secondary text)
- **Border**: `#E6EEF9` or `#EEF5FF` (subtle borders)

## Accessibility

All interactive elements include:

- `accessibilityRole` (button, etc.)
- `accessibilityLabel` (descriptive text)
- `accessibilityHint` (usage instructions)

## Animations

- Modal entrance: Slide up from bottom (300ms)
- Modal exit: Slide down (300ms)
- Content fade: Fade in/out (300ms)

## Responsive Design

- Width: 100% of device width
- Height: ~92% of screen height
- Content scrolls when needed
- Proper safe area insets for notch devices

## Browser Compatibility

This component is designed for React Native mobile apps and works with:

- iOS devices
- Android devices
- Expo Go and custom development builds

## License

MIT
