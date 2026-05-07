import { View, Text, SafeAreaView } from "react-native";
import React from "react";

const Favorites = () => {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-background">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-primary dark:text-foreground">Saved Properties</Text>
        <Text className="text-muted-foreground mt-2">Your favorite listings</Text>
      </View>
    </SafeAreaView>
  );
};

export default Favorites;
