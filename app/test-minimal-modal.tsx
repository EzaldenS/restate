import React, { useState } from 'react';
import { Button, Modal, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

const MinimalModalTest = () => {
  const [showBasicModal, setShowBasicModal] = useState(false);
  const [showStyledModal, setShowStyledModal] = useState(false);

  console.log('MinimalModalTest: Rendering test page');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-xl font-rubik-bold text-black-300 mb-6">
          Minimal Modal Test
        </Text>

        <Text className="text-base font-rubik-medium text-black-300 mb-2">
          Test 1: Basic React Native Modal
        </Text>
        <Button
          title={showBasicModal ? "Hide Basic Modal" : "Show Basic Modal"}
          onPress={() => {
            console.log('Toggling basic modal:', !showBasicModal);
            setShowBasicModal(!showBasicModal);
          }}
        />

        <Text className="text-base font-rubik-medium text-black-300 mb-2 mt-4">
          Test 2: Styled Modal (Similar to FilterModal)
        </Text>
        <Button
          title={showStyledModal ? "Hide Styled Modal" : "Show Styled Modal"}
          onPress={() => {
            console.log('Toggling styled modal:', !showStyledModal);
            setShowStyledModal(!showStyledModal);
          }}
        />

        {/* Basic Modal Test */}
        <Modal
          visible={showBasicModal}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setShowBasicModal(false)}
        >
          <View className="flex-1 justify-center items-center bg-white">
            <Text className="text-2xl font-rubik-bold text-black-300 mb-4">
              Basic Modal Works!
            </Text>
            <Button
              title="Close Basic Modal"
              onPress={() => setShowBasicModal(false)}
            />
          </View>
        </Modal>

        {/* Styled Modal Test */}
        <Modal
          visible={showStyledModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowStyledModal(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl p-6" style={{ maxHeight: '90%' }}>
              <Text className="text-xl font-rubik-bold text-black-300 mb-4">
                Styled Modal Test
              </Text>
              <Text className="text-base font-rubik text-black-300 mb-4">
                This modal has similar styling to FilterModal but without complex components.
              </Text>
              <TouchableOpacity
                onPress={() => setShowStyledModal(false)}
                className="bg-primary-200 rounded-full py-3 items-center justify-center"
              >
                <Text className="text-white font-rubik-medium">Close Modal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default MinimalModalTest;