import { useSavedProperty } from "@/hooks/useSavedProperty";
import { Property } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
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

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(root)/property/${property.id}`)}
      className="flex-row bg-white rounded-2xl mb-4 overflow-hidden dark:bg-gray-900S"
      style={{
        opacity: property.is_sold ? 0.5 : 1,
      }}
    >
      <Card className="p-0 w-full overflow-hidden dark:bg-gray-900 border-none">
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
                  className="text-sm font-bold text-gray-800 mb-1 dark:text-white/80"
                  numberOfLines={1}
                >
                  {property.title}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="location-outline" size={11} color="#6B7280" />
                  <Text className="text-xs text-gray-500" numberOfLines={1}>
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
                    color={isSaved ? "#EF4444" : "#9CA3AF"}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-blue-600 font-bold text-sm">
                {formatPrice(property.price)}
              </Text>
              {property.is_sold && (
                <View className="bg-red-50 px-2 py-0.5 rounded-full">
                  <Text className="text-red-500 text-xs font-semibold">
                    Sold
                  </Text>
                </View>
              )}
              <View className="flex-row gap-3">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="bed-outline" size={11} color="#6B7280" />
                  <Text className="text-xs text-gray-500">
                    {property.bedrooms} bd
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="expand-outline" size={11} color="#6B7280" />
                  <Text className="text-xs text-gray-500">
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
