import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
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
      <View style={styles.tabBar} className="bg-white dark:bg-gray-800">
        <Animated.View style={[styles.indicator, indicatorStyle]}>
          <View
            style={styles.indicatorInner}
            className="bg-black dark:bg-white"
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
                  color: isFocused ? "white" : "#666876",
                  size: 24,
                })
              ) : (
                <Ionicons
                  name="help-outline"
                  size={24}
                  color={isFocused ? "white" : "#666876"}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
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
});

export default CustomTabBar;
