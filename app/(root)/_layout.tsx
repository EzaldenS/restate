import { useGlobalContext } from "@/lib/global-provider";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AppLayout = () => {
    const {loading, isLogged, error} = useGlobalContext();
    console.log('🟡 AppLayout - loading:', loading, 'isLogged:', isLogged, 'error:', error);

    if (loading) {
        console.log('🟡 AppLayout - showing loading indicator');
     return (
        <SafeAreaView className="bg-blue-700 h-full flex justify-center items-center">
            <ActivityIndicator size="large" color="#0000ff" />
            <Text className="mt-4 text-lg">Loading...</Text>
        </SafeAreaView>
    )
}

if (error) {
    console.log('🟡 AppLayout - error occurred:', error);
    return (
        <SafeAreaView className="bg-white h-full flex justify-center items-center">
            <Text className="text-lg text-red-500">Error: {error}</Text>
            <Text className="text-base mt-2">Please check your internet connection</Text>
        </SafeAreaView>
    );
}
if (!isLogged) {
    console.log('🟡 AppLayout - user not logged in, redirecting to /signIn');
    return <Redirect href="/signIn" />;
}
    console.log('🟡 AppLayout - user logged in, showing app content');
    return (
      <SafeAreaView className="bg-blue-100 h-full">
        <Text className="text-red-500 text-center p-4">DEBUG: AppLayout rendering Slot</Text>
        <Slot />
      </SafeAreaView>
    );
};

export default AppLayout;