import { useGlobalContext } from "@/lib/global-provider";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AppLayout = () => {
    const {loading, isLogged} = useGlobalContext();

    if (loading) {
     return (
        <SafeAreaView className="bg-white h-full flex justify-center items-center">
            <ActivityIndicator size="large" color="#0000ff" />
        </SafeAreaView>
    )
}

if (!isLogged) {
    return <Redirect href="/signIn" />;
}

    return <Slot />;
};

export default AppLayout;