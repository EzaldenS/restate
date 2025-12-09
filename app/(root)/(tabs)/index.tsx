import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  console.log('🟢 Home Index - rendering home page content');
  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-5 pb-32"
      >
        <View
          className="flex-1 justify-center items-center"
        >
        <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: 'red'}}>DEBUG: Welcome to Real Scout</Text>
        <Text style={{fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 40}}>
          Find your ideal home with our comprehensive property search
        </Text>

        {/* Add more content to test scrolling */}
        {[...Array(20)].map((_, i) => (
          <Text key={i} style={{fontSize: 16, marginBottom: 10, color: '#333'}}>
            Property Listing {i + 1}
          </Text>
        ))}

        <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 20, color: '#0061ff'}}>
          Featured Properties
        </Text>

        {[...Array(10)].map((_, i) => (
          <View key={i} style={{width: '100%', padding: 15, marginBottom: 10, backgroundColor: 'white', borderRadius: 8}}>
            <Text style={{fontSize: 16, fontWeight: '600'}}>Luxury Apartment {i + 1}</Text>
            <Text style={{fontSize: 14, color: '#666'}}>2 Bedrooms, 2 Bathrooms</Text>
            <Text style={{fontSize: 14, color: '#0061ff'}}>$1,200,000</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  </SafeAreaView>
);
}
