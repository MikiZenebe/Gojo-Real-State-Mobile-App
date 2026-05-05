import React from "react";
import { SafeAreaView, Text, View } from "react-native";

const Home = () => {
  return (
    <SafeAreaView className="flex-1 bg-white ">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-primary">Home</Text>
        <Text className="text-muted-foreground mt-2">
          Welcome to Gojo Real Estate
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Home;
