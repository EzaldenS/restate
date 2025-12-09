import React from 'react'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'

const Explore = () => {
  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-5 pb-32"
      >
        <View className="flex-1">
          <Text className="text-xl font-rubik-bold mb-4">Explore Properties</Text>
          <Text className="text-base text-black-200 mb-8">
            Browse our comprehensive list of available properties
          </Text>

          {/* Add sample property cards */}
          {[...Array(6)].map((_, i) => (
            <View key={i} className="bg-white p-4 rounded-lg mb-4 border border-primary-100">
              <Text className="font-rubik-medium text-lg">Luxury Villa {i + 1}</Text>
              <Text className="text-black-200">3 Bedrooms, 2 Bathrooms</Text>
              <Text className="text-primary-300 font-rubik-medium">$950,000</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Explore