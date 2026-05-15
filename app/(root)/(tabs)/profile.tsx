import { CustomAlert } from "@/components/CustomAlert";
import { Text } from "@/components/ui/text";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function MenuItem({
  icon,
  label,
  onPress,
  rightElement,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center gap-4 bg-gray-50 dark:bg-card px-4 h-[60px] rounded-2xl"
    >
      <Ionicons name={icon} size={22} color="#6B7280" />
      <Text className="flex-1 text-gray-700 dark:text-foreground font-medium text-base">
        {label}
      </Text>
      {rightElement !== undefined ? (
        rightElement
      ) : (
        <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
      )}
    </TouchableOpacity>
  );
}

const Profile = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "error" as "error" | "success",
  });

  const showAlert = (
    title: string,
    message: string,
    type: "error" | "success" = "error",
  ) => {
    setAlertConfig({ visible: true, title, message, type });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleUpdateProfileImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        showAlert(
          "Permission Required",
          "Please allow access to your photo library to update your profile picture.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) return;

      setIsUpdating(true);

      const base64Image = result.assets[0].base64;
      const uri = result.assets[0].uri;
      const filename = uri.split("/").pop() || "profile.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const mimeType = match ? `image/${match[1]}` : "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64Image}`;

      await user?.setProfileImage({ file: dataUrl });

      showAlert("Success", "Profile picture updated successfully!", "success");
    } catch (error) {
      console.error("Error updating profile image:", error);
      showAlert(
        "Error",
        "Failed to update profile picture. Please try again.",
        "error",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-background ">
      {/* Avatar + Name */}
      <View className="items-center py-8">
        <View className="relative">
          <Image
            source={{ uri: user.imageUrl }}
            className="w-24 h-24 rounded-full mb-4"
          />
          <TouchableOpacity
            onPress={handleUpdateProfileImage}
            disabled={isUpdating}
            className="absolute bottom-3 right-0 bg-blue-600 dark:bg-blue-500 rounded-full p-2"
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="camera" size={16} color="white" />
            )}
          </TouchableOpacity>
        </View>
        <Text className="text-xl font-bold text-gray-800 dark:text-foreground">
          {user.firstName} {user.lastName}
        </Text>
        <Text className="text-gray-500 mt-1 dark:text-muted-foreground">
          {user.emailAddresses[0].emailAddress}
        </Text>
      </View>

      {/* Menu Items */}
      <View className="px-6 gap-2">
        <MenuItem
          icon="heart-outline"
          label="Saved Properties"
          onPress={() => router.push("/(root)/(tabs)/favorites")}
        />
        {/* <MenuItem
          icon="notifications-outline"
          label="Notifications"
          onPress={() =>
            showAlert("Coming Soon", "Notifications coming soon!", "success")
          }
        /> */}
        <MenuItem
          icon="settings-outline"
          label="Settings"
          onPress={() =>
            showAlert("Coming Soon", "Settings coming soon!", "success")
          }
        />
        <MenuItem
          icon={colorScheme === "dark" ? "moon" : "sunny"}
          label="Dark Mode"
          rightElement={
            <Switch
              value={colorScheme === "dark"}
              onValueChange={toggleColorScheme}
              trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
              thumbColor={"#FFFFFF"}
              style={{ transform: [{ scale: 0.9 }] }}
            />
          }
        />
        <MenuItem
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() =>
            Linking.openURL(
              "mailto:[EMAIL_ADDRESS]?subject=Help%20%26%20Support%20-%20Gojo%20App",
            )
          }
        />
      </View>

      {/* Sign Out */}
      <View className="px-6 mt-auto mb-24">
        <TouchableOpacity
          onPress={handleSignOut}
          className="flex-row items-center justify-center gap-2 bg-red-50 dark:bg-red-500/10 py-4 rounded-2xl border border-red-100 dark:border-red-500/20"
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text className="text-red-500 font-semibold text-base">Sign Out</Text>
        </TouchableOpacity>
      </View>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
};

export default Profile;
