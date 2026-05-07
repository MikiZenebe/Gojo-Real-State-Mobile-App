import { useSavedProperty } from "@/hooks/useSavedProperty";
import { Property } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { Card } from "../ui/card";

export default function PropertyCard({
  property,
  onUnsave,
  showSave = false,
}: {
  property: Property;
  onUnsave?: () => void;
  showSave?: boolean;
}) {
  const router = useRouter();
  const { isSaved, saveLoading, toggleSave } = useSavedProperty(
    property.id,
    onUnsave,
  );
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(root)/property/${property.id}`)}
      className="flex-row bg-white rounded-2xl mb-4 overflow-hidden dark:bg-card"
      style={{
        opacity: property.is_sold ? 0.5 : 1,
        ...(isDark ? {
          shadowColor: "#3B82F6",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.04,
          shadowRadius: 12,
        } : {}),
      }}
    >
      <Card className="p-0 w-full overflow-hidden dark:bg-card border-none dark:border dark:border-border">
        <View className="flex-row">
          <Image
            source={{ uri: property.images[0] }}
            className="w-28 h-28"
            resizeMode="cover"
          />

          {/* Info */}
          <View className="flex-1 p-3 justify-between">
            <View className="flex-row justify-between items-start">
              <View className="flex-1 pr-2">
                <Text
                  className="text-sm font-bold text-gray-800 mb-1 dark:text-foreground"
                  numberOfLines={1}
                >
                  {property.title}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="location-outline" size={11} color={isDark ? "#64748B" : "#6B7280"} />
                  <Text className="text-xs text-gray-500 dark:text-muted-foreground" numberOfLines={1}>
                    {property.city}
                  </Text>
                </View>
              </View>

              {/* Save Button */}
              {showSave && (
                <TouchableOpacity
                  onPress={toggleSave}
                  disabled={saveLoading}
                  className="p-1 -mt-1 -mr-1"
                >
                  <Ionicons
                    name={isSaved ? "heart" : "heart-outline"}
                    size={20}
                    color={isSaved ? "#EF4444" : isDark ? "#64748B" : "#9CA3AF"}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-blue-600 font-bold text-sm dark:text-blue-400">
                {formatPrice(property.price)}
              </Text>
              {property.is_sold && (
                <View className="bg-red-50 px-2 py-0.5 rounded-full dark:bg-red-500/10">
                  <Text className="text-red-500 text-xs font-semibold dark:text-red-400">
                    Sold
                  </Text>
                </View>
              )}
              <View className="flex-row gap-3">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="bed-outline" size={11} color={isDark ? "#64748B" : "#6B7280"} />
                  <Text className="text-xs text-gray-500 dark:text-muted-foreground">
                    {property.bedrooms} bd
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="expand-outline" size={11} color={isDark ? "#64748B" : "#6B7280"} />
                  <Text className="text-xs text-gray-500 dark:text-muted-foreground">
                    {property.area_sqft} ft²
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export function PropertyCardSkeleton() {
  return (
    <View className="flex-row bg-white rounded-2xl mb-4 overflow-hidden dark:bg-card border-none dark:border dark:border-border">
      <Card className="p-0 w-full overflow-hidden dark:bg-card border-none">
        <View className="flex-row">
          {/* Image Skeleton */}
          <View className="w-28 h-28 bg-gray-200 dark:bg-secondary animate-pulse" />

          {/* Info Skeleton */}
          <View className="flex-1 p-3 justify-between">
            <View className="flex-row justify-between items-start">
              <View className="flex-1 pr-2">
                <View className="h-4 bg-gray-200 dark:bg-secondary rounded w-3/4 mb-2 animate-pulse" />
                <View className="flex-row items-center gap-1">
                  <View className="w-3 h-3 bg-gray-200 dark:bg-secondary rounded-full animate-pulse" />
                  <View className="h-3 bg-gray-200 dark:bg-secondary rounded w-1/2 animate-pulse" />
                </View>
              </View>
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <View className="h-4 bg-gray-200 dark:bg-secondary rounded w-1/4 animate-pulse" />
              <View className="flex-row gap-3">
                <View className="flex-row items-center gap-1">
                  <View className="w-3 h-3 bg-gray-200 dark:bg-secondary rounded-full animate-pulse" />
                  <View className="h-3 bg-gray-200 dark:bg-secondary rounded w-8 animate-pulse" />
                </View>
                <View className="flex-row items-center gap-1">
                  <View className="w-3 h-3 bg-gray-200 dark:bg-secondary rounded-full animate-pulse" />
                  <View className="h-3 bg-gray-200 dark:bg-secondary rounded w-8 animate-pulse" />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
}
