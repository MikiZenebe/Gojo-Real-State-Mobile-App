import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

interface CustomAlertProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  title?: string;
  type?: "error" | "success";
}

export const CustomAlert = ({
  visible,
  message,
  onClose,
  title = "Error",
  type = "error",
}: CustomAlertProps) => {
  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={StyleSheet.absoluteFill}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.backdrop}
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View
          entering={ZoomIn.duration(300)}
          exiting={ZoomOut.duration(200)}
          className="w-[85%] rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-900"
        >
          <View className="items-center">
            <View
              className={`mb-4 h-16 w-16 items-center justify-center rounded-full ${
                type === "error" ? "bg-red-100" : "bg-green-100"
              }`}
            >
              <MaterialIcons
                name={
                  type === "error" ? "error-outline" : "check-circle-outline"
                }
                size={32}
                color={type === "error" ? "#dc2626" : "#16a34a"}
              />
            </View>

            <Text className="mb-2 text-center text-xl font-bold dark:text-white">
              {title}
            </Text>
            <Text className="mb-6 text-center text-gray-500 dark:text-gray-400">
              {message}
            </Text>

            <Button
              onPress={onClose}
              variant={type === "error" ? "destructive" : "default"}
              className="w-full rounded-xl"
            >
              <Text className="text-base font-bold text-white">Got it</Text>
            </Button>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
});
