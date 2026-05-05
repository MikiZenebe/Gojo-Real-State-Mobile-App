import { View, Text, SafeAreaView } from "react-native";
import React from "react";

const Profile = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-primary">Profile</Text>
        <Text className="text-muted-foreground mt-2">Manage your account</Text>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
