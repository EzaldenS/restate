import { ScrollView, Text, View } from "react-native";

export default function Index() {
  console.log('🟢 Home Index - rendering home page content');
  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: '#f0f0f0'
        }}
      >
        <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: 'red'}}>DEBUG: Welcome to Real Scout</Text>
        <Text style={{fontSize: 16, textAlign: 'center', color: '#666'}}>
          Find your ideal home with our comprehensive property search
        </Text>
      </View>
    </ScrollView>
  );
}
