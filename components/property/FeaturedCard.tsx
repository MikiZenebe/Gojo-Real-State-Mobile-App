import { Property } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

export default function FeaturedCard({ property }: { property: Property }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      //   onPress={() => router.push(`/(root)/property/${property.id}`)}
      className=" mr-4 overflow-hidden bg-white dark:bg-gray-900 border-none"
    >
      <Card className="p-0 overflow-hidden dark:bg-gray-900 border-none">
        <Image
          source={{ uri: property.images[0] }}
          className="w-72 h-44"
          resizeMode="cover"
        />
        {/* Badge */}

        <View className="absolute top-3 left-3">
          <Badge
            variant={"secondary"}
            className="rounded-full bg-white px-2 py-1"
          >
            <Text className="text-xs font-semibold text-blue-600 capitalize">
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
            className="text-base font-bold text-gray-800 mb-1 dark:text-white/80"
            numberOfLines={1}
          >
            {property.title}
          </Text>

          <View className="flex-row items-center gap-1 mb-3">
            <Ionicons name="location-outline" size={13} color="#6B7280" />
            <Text className="text-xs text-gray-500">
              {property.address}, {property.city}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-blue-600 font-bold text-base">
              {formatPrice(property.price)}
            </Text>
            <View className="flex-row items-center gap-3">
              <View className="flex-row items-center gap-1">
                <Ionicons name="bed-outline" size={13} color="#6B7280" />
                <Text className="text-xs text-gray-500">
                  {property.bedrooms}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Ionicons name="water-outline" size={13} color="#6B7280" />
                <Text className="text-xs text-gray-500">
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
