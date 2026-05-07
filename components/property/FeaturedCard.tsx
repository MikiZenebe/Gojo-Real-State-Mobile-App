import { Property } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

export default function FeaturedCard({ property }: { property: Property }) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <TouchableOpacity
      //   onPress={() => router.push(`/(root)/property/${property.id}`)}
      className=" mr-4 overflow-hidden bg-white dark:bg-card border-none"
    >
      <Card
        className="p-0 overflow-hidden dark:bg-card border-none dark:border dark:border-border"
        style={isDark ? {
          shadowColor: "#3B82F6",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
        } : undefined}
      >
        <Image
          source={{ uri: property.images[0] }}
          className="w-72 h-44"
          resizeMode="cover"
        />
        {/* Dark overlay gradient for better readability on images */}
        {isDark && (
          <View
            className="absolute top-0 left-0 w-72 h-44"
            style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
          />
        )}
        {/* Badge */}

        <View className="absolute top-3 left-3">
          <Badge
            variant={"secondary"}
            className="rounded-full bg-white px-2 py-1 dark:bg-card/90 dark:border dark:border-blue-500/30"
          >
            <Text className="text-xs font-semibold text-blue-600 capitalize dark:text-blue-400">
              {property.type}
            </Text>
          </Badge>
        </View>

        {property.is_sold && (
          <Badge
            variant={"destructive"}
            className="absolute top-3 right-3 px-3 py-1 rounded-full"
          >
            <Text className="text-xs font-semibold text-white">Sold</Text>
          </Badge>
        )}

        {/* Info */}
        <View className="p-4">
          <Text
            className="text-base font-bold text-gray-800 mb-1 dark:text-foreground"
            numberOfLines={1}
          >
            {property.title}
          </Text>

          <View className="flex-row items-center gap-1 mb-3">
            <Ionicons name="location-outline" size={13} color={isDark ? "#64748B" : "#6B7280"} />
            <Text className="text-xs text-gray-500 dark:text-muted-foreground">
              {property.address}, {property.city}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-blue-600 font-bold text-base dark:text-blue-400">
              {formatPrice(property.price)}
            </Text>
            <View className="flex-row items-center gap-3">
              <View className="flex-row items-center gap-1">
                <Ionicons name="bed-outline" size={13} color={isDark ? "#64748B" : "#6B7280"} />
                <Text className="text-xs text-gray-500 dark:text-muted-foreground">
                  {property.bedrooms}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Ionicons name="water-outline" size={13} color={isDark ? "#64748B" : "#6B7280"} />
                <Text className="text-xs text-gray-500 dark:text-muted-foreground">
                  {property.bathrooms}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export function FeaturedCardSkeleton() {
  return (
    <View className="mr-4 overflow-hidden bg-white dark:bg-card border-none rounded-xl dark:border dark:border-border">
      <Card className="p-0 overflow-hidden dark:bg-card border-none w-72">
        <View className="w-72 h-44 bg-gray-200 dark:bg-secondary animate-pulse" />
        <View className="absolute top-3 left-3">
          <View className="w-16 h-6 bg-gray-300 dark:bg-accent rounded-full animate-pulse" />
        </View>

        <View className="p-4">
          <View className="h-5 bg-gray-200 dark:bg-secondary rounded w-3/4 mb-2 animate-pulse" />

          <View className="flex-row items-center gap-1 mb-3">
            <View className="w-3 h-3 bg-gray-200 dark:bg-secondary rounded-full animate-pulse" />
            <View className="h-3 bg-gray-200 dark:bg-secondary rounded w-1/2 animate-pulse" />
          </View>

          <View className="flex-row items-center justify-between">
            <View className="h-5 bg-gray-200 dark:bg-secondary rounded w-1/3 animate-pulse" />
            <View className="flex-row items-center gap-3">
              <View className="h-4 bg-gray-200 dark:bg-secondary rounded w-8 animate-pulse" />
              <View className="h-4 bg-gray-200 dark:bg-secondary rounded w-8 animate-pulse" />
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
}
