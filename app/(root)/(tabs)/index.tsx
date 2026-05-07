import FeaturedCard, {
  FeaturedCardSkeleton,
} from "@/components/property/FeaturedCard";
import PropertyCard, {
  PropertyCardSkeleton,
} from "@/components/property/PropertyCard";
import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, []),
  );

  const fetchProperties = async () => {
    setLoading(true);

    const { data: featuredData } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    const { data: recommendedData } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", false)
      .order("created_at", { ascending: false });

    setFeatured(featuredData ?? []);
    setRecommended(recommendedData ?? []);
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-background">
      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-4 pb-5">
              <Image
                source={require("@/assets/images/icon.png")}
                style={{ width: 90, height: 36 }}
                resizeMode="contain"
                className="dark:hidden flex"
              />
              <Image
                source={require("@/assets/images/dark-logo.png")}
                style={{ width: 90, height: 36 }}
                resizeMode="contain"
                className="dark:flex hidden"
              />

              <View className="items-end">
                <Text className="text-gray-500 text-xs dark:text-muted-foreground">
                  {getGreeting()} 👋
                </Text>
                <Text className="text-gray-900 text-base font-bold dark:text-foreground">
                  {user?.firstName ?? "User"}
                </Text>
              </View>
            </View>

            {/* Search Bar */}
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tabs)/search")}
              className="mx-5 mb-6 flex-row items-center bg-white rounded-2xl px-4 py-3 gap-3 dark:bg-card dark:border dark:border-border"
              style={{
                shadowColor: isDark ? "#3B82F6" : "#000",
                shadowOffset: { width: 0, height: isDark ? 0 : 1 },
                shadowOpacity: isDark ? 0.08 : 0.06,
                shadowRadius: isDark ? 12 : 6,
                elevation: 2,
              }}
            >
              <Ionicons name="search-outline" size={18} color={isDark ? "#64748B" : "#9ca3af"} />
              <Text className="text-gray-400 text-sm flex-1 dark:text-muted-foreground">
                Search properties, cities...
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push("/(root)/(tabs)/search?openFilters=true")
                }
                className="w-8 h-8 bg-blue-600 rounded-xl items-center justify-center dark:bg-blue-500"
              >
                <Ionicons name="options-outline" size={15} color="white" />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Featured Section */}
            <View className="mb-6">
              <Text className="text-gray-900 text-lg font-bold px-5 mb-4 dark:text-foreground">
                Featured
              </Text>

              {loading ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                  <FeaturedCardSkeleton />
                  <FeaturedCardSkeleton />
                  <FeaturedCardSkeleton />
                </ScrollView>
              ) : (
                <FlatList
                  data={featured}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <FeaturedCard property={item} />}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                />
              )}
            </View>

            {/* Recommended Header */}
            <Text className="text-gray-900 text-lg font-bold px-5 mb-4 dark:text-foreground">
              Recommended
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-5">
            <PropertyCard property={item} showSave={true} />
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-10">
              <Text className="text-gray-400 dark:text-muted-foreground">No properties found</Text>
            </View>
          ) : (
            <View className="px-5">
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}
