import FilterModalDemo from '@/components/FilterModalDemo';
import React, { useState } from 'react';
import { Button, SafeAreaView, Text, View } from 'react-native';

const TestFilterDemoPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-xl font-rubik-bold text-black-300 mb-4">
          FilterModal Demo Test Page
        </Text>

        <Text className="text-base font-rubik-medium text-black-300 mb-6">
          This page uses a standalone demo version with hardcoded data to verify the UI works independently of any data flow issues.
        </Text>

        <Button
          title={showModal ? "Hide Demo Filter Modal" : "Show Demo Filter Modal"}
          onPress={() => setShowModal(!showModal)}
          color="#0066FF"
        />

        <FilterModalDemo
          visible={showModal}
          onClose={() => setShowModal(false)}
        />
      </View>
    </SafeAreaView>
  );
};

export default TestFilterDemoPage;