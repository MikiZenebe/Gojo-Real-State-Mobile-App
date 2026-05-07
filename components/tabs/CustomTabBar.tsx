import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { Dimensions, Pressable, StyleSheet, useColorScheme, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const TAB_BAR_MARGIN = 20;
const TAB_BAR_WIDTH = width - TAB_BAR_MARGIN * 2;

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const numTabs = state.routes.length;
  const tabWidth = TAB_BAR_WIDTH / numTabs;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(state.index * tabWidth, {
      damping: 15,
      stiffness: 120,
    });
  }, [state.index, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: tabWidth,
  }));

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.tabBar,
          isDark ? styles.tabBarDark : styles.tabBarLight,
        ]}
        className="bg-white dark:bg-card"
      >
        <Animated.View style={[styles.indicator, indicatorStyle]}>
          <View
            style={[
              styles.indicatorInner,
              isDark ? styles.indicatorInnerDark : styles.indicatorInnerLight,
            ]}
          />
        </Animated.View>

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable key={route.key} onPress={onPress} style={styles.tabItem}>
              {options.tabBarIcon ? (
                options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused
                    ? isDark ? "#1E293B" : "white"
                    : isDark ? "#64748B" : "#666876",
                  size: 24,
                })
              ) : (
                <Ionicons
                  name="help-outline"
                  size={24}
                  color={isFocused
                    ? isDark ? "#1E293B" : "white"
                    : isDark ? "#64748B" : "#666876"}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    width: TAB_BAR_WIDTH,
    height: 64,
    borderRadius: 32,
  },
  tabBarLight: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  tabBarDark: {
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.15)",
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    position: "absolute",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  indicatorInnerLight: {
    backgroundColor: "#000",
  },
  indicatorInnerDark: {
    backgroundColor: "#E2E8F0",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default CustomTabBar;
