import icons from "@/constants/icons";
import images from "@/constants/images";
import { login } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { Redirect, useRouter } from "expo-router";
import React from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const {refetch, isLogged, loading} = useGlobalContext();
  const router = useRouter();

  if(!loading && isLogged){
    return <Redirect href="/(root)/(tabs)" />;
  }

  const handleLogin = async () => {
    try {
      const result = await login();
      if (result) {
        // Refresh the global context to update authentication state
        await refetch();
        router.replace("/(root)/(tabs)");
      } else {
        Alert.alert("Error", "Login failed. Please try again.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      Alert.alert("Error", errorMessage);
    }
  };

  if (!loading && !isLogged) {
    return (
      <SafeAreaView className="bg-white h-full">
        <ScrollView
          showsVerticalScrollIndicator={false}
        contentContainerClassName="p-5 pb-2"
        >
          <Image
            source={images.onboarding}
            className="w-full h-[550px]"
            resizeMode="contain"
          />

          <View className="px-10">
            <Text className="text-base text-center uppercase font-rubik text-black-200">
              Welcome To Real Scout
            </Text>

            <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
              Let's Get You Closer To {"\n"}
              <Text className="text-primary-300">Your Ideal Home</Text>
            </Text>

            <Text className="text-lg font-rubik text-black-200 text-center mt-12">
              Login to Real Scout with Google
            </Text>

            <TouchableOpacity
              onPress={handleLogin}
              className="bg-white shadow-md shadow-zinc-500 rounded-full w-full py-4 my-5 mb-5"
            >
              <View className="flex flex-row items-center justify-center">
                <Image
                  source={icons.google}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <Text className="text-lg font-rubik-medium text-black-300 ml-2">
                  Continue with Google
                </Text>
              </View>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Fallback - should not reach here in normal flow
  console.log('🔴 SignIn - fallback case, showing loading');
  return (
    <SafeAreaView className="bg-white h-full flex justify-center items-center">
      <Text className="text-lg">Loading...</Text>
    </SafeAreaView>
  );
}
