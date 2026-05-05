import { View, Text, SafeAreaView } from "react-native";
import React from "react";

const Explore = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-primary">Explore</Text>
        <Text className="text-muted-foreground mt-2">Discover properties</Text>
      </View>
    </SafeAreaView>
  );
};

export default Explore;
