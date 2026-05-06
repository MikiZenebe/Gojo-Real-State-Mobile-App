import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface TabIconProps {
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  size?: number;
}

const TabIcon = ({ focused, icon, color, size }: TabIconProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const scale = useSharedValue(1);

  useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.15, { damping: 12, stiffness: 150 });
    } else {
      scale.value = withSpring(1);
    }
  }, [focused, scale]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const activeColor = isDark ? "#2d3748" : "#fff";
  const inactiveColor = isDark ? "#fff" : "#2d3748";

  return (
    <Animated.View
      style={[animatedIconStyle]}
      className="items-center justify-center"
    >
      <Ionicons
        name={icon}
        size={size || 19}
        color={color || (focused ? activeColor : inactiveColor)}
      />
    </Animated.View>
  );
};

export default TabIcon;
