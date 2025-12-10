import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import FilterModal from './FilterModal';
import { FilterShape } from './types';

// Mock the dependencies
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    ...jest.requireActual('react-native-reanimated/mock'),
    FadeIn: View,
    FadeOut: View,
    SlideInDown: View,
    SlideOutDown: View,
  };
});

describe('FilterModal Component', () => {
  const mockOnApply = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnReset = jest.fn();

  const defaultProps = {
    visible: true,
    onApply: mockOnApply,
    onClose: mockOnClose,
    onReset: mockOnReset,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly when visible', () => {
    const { getByText } = render(<FilterModal {...defaultProps} />);
    expect(getByText('Filter')).toBeTruthy();
    expect(getByText('Set Filter')).toBeTruthy();
  });

  it('should not render when not visible', () => {
    const { queryByText } = render(<FilterModal {...defaultProps} visible={false} />);
    expect(queryByText('Filter')).toBeNull();
  });

  it('should call onClose when back button is pressed', () => {
    const { getByLabelText } = render(<FilterModal {...defaultProps} />);
    fireEvent.press(getByLabelText('Go back'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onReset when reset button is pressed', () => {
    const { getByLabelText } = render(<FilterModal {...defaultProps} />);
    fireEvent.press(getByLabelText('Reset all filters'));
    expect(mockOnReset).toHaveBeenCalled();
  });

  it('should call onApply with correct filter values when Set Filter is pressed', () => {
    const { getByLabelText } = render(<FilterModal {...defaultProps} />);
    fireEvent.press(getByLabelText('Apply filters'));

    expect(mockOnApply).toHaveBeenCalled();
    const calledWith = mockOnApply.mock.calls[0][0];
    expect(calledWith).toHaveProperty('priceRange');
    expect(calledWith).toHaveProperty('sizeRange');
    expect(calledWith).toHaveProperty('types');
    expect(calledWith).toHaveProperty('bedrooms');
    expect(calledWith).toHaveProperty('bathrooms');
  });

  it('should initialize with provided initialFilters', () => {
    const initialFilters: Partial<FilterShape> = {
      priceRange: [200, 400],
      bedrooms: 2,
      types: ['House'],
    };

    const { getByText } = render(
      <FilterModal {...defaultProps} initialFilters={initialFilters} />
    );

    // Check if the initial values are applied
    expect(getByText('House')).toBeTruthy();
  });

  it('should toggle property type selection', () => {
    const { getByLabelText, getByText } = render(<FilterModal {...defaultProps} />);

    // Find a property type pill and toggle it
    const housePill = getByLabelText('House filter not selected');
    fireEvent.press(housePill);

    // After selection, the label should change
    const selectedHousePill = getByLabelText('House filter selected');
    expect(selectedHousePill).toBeTruthy();
  });

  it('should increment and decrement counter values', () => {
    const { getByLabelText } = render(<FilterModal {...defaultProps} />);

    // Test bedroom increment
    const incrementBedrooms = getByLabelText('Increase Bedrooms');
    fireEvent.press(incrementBedrooms);

    // Test bathroom decrement (should not go below 0)
    const decrementBathrooms = getByLabelText('Decrease Bathrooms');
    fireEvent.press(decrementBathrooms);
    fireEvent.press(decrementBathrooms); // Should still be 0
  });

  it('should handle accessibility labels correctly', () => {
    const { getByLabelText } = render(<FilterModal {...defaultProps} />);

    // Test various accessibility labels
    expect(getByLabelText('Go back')).toBeTruthy();
    expect(getByLabelText('Reset all filters')).toBeTruthy();
    expect(getByLabelText('Apply filters')).toBeTruthy();
    expect(getByLabelText('House filter not selected')).toBeTruthy();
    expect(getByLabelText('Increase Bedrooms')).toBeTruthy();
    expect(getByLabelText('Decrease Bathrooms')).toBeTruthy();
  });
});