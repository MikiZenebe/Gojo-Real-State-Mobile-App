import { Property } from "@/types";
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
      className="w-72 mr-4 overflow-hidden bg-white"
    >
      <Card className="p-0 overflow-hidden">
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
      </Card>
    </TouchableOpacity>
  );
}
