import { CustomAlert } from "@/components/CustomAlert";
import { useSavedProperty } from "@/hooks/useSavedProperty";
import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/userStore";
import { Property } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import ImageViewing from "react-native-image-viewing";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

const { width } = Dimensions.get("window");
const ADMIN_PHONE = "919999999999"; // replace with your WhatsApp number

const PropertyDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const router = useRouter();
  const isAdmin = useUserStore((state) => state.isAdmin);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [soldModalVisible, setSoldModalVisible] = useState(false);

  const { isSaved, saveLoading, toggleSave } = useSavedProperty(id ?? "");
  const authSupabase = useSupabase();

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();
    setProperty(data);
    setLoading(false);
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const handleConfirmSold = () => {
    setSoldModalVisible(true);
  };

  const confirmDelete = async () => {
    setDeleteModalVisible(false);
    await authSupabase.from("properties").delete().eq("id", id);
    router.replace("/(root)/(tabs)");
  };

  const confirmSold = async () => {
    setSoldModalVisible(false);
    await authSupabase
      .from("properties")
      .update({ is_sold: true })
      .eq("id", id);
    setProperty((prev) => (prev ? { ...prev, is_sold: true } : prev));
  };

  const handleContact = () => {
    const message = `Hi! I'm interested in the property: ${property?.title}`;
    const url = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(
      message,
    )}`;
    Linking.openURL(url);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-background">
        <ActivityIndicator size="large" color={isDark ? "#60A5FA" : "#2563EB"} />
      </View>
    );
  }

  if (!property) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-background">
        <Text className="text-gray-500 dark:text-muted-foreground">Property not found</Text>
      </View>
    );
  }

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    property.longitude - 0.003
  }%2C${property.latitude - 0.003}%2C${property.longitude + 0.003}%2C${
    property.latitude + 0.003
  }&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`;

  const isLongDesc = (property.description?.length ?? 0) > 150;
  const displayDesc =
    expanded || !isLongDesc
      ? property.description
      : property.description?.slice(0, 150) + "...";

  return (
    <View className="flex-1 bg-white dark:bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View className="relative">
          <View style={{ opacity: property.is_sold ? 0.5 : 1 }}>
            <FlatList
              data={property.images}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setImageViewerVisible(true)}>
                  <Image
                    source={{ uri: item }}
                    style={{ width, height: 300 }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onScroll}
              scrollEventThrottle={16}
            />
          </View>

          {/* Image count badge */}
          <View className="absolute bottom-3 left-0 right-0 bg-black/50 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-medium">
              {activeIndex + 1}/{property.images.length}
            </Text>
          </View>

          {/* Dot indicators */}
          {property.images.length > 1 && (
            <View className="absolute bottom-3 left-0 right-0 flex-row justify-center gap-1">
              {property.images.map((_, i) => (
                <View
                  key={i}
                  className={`h-1.5 rounded-full ${
                    i === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </View>
          )}

          {/* Back + Save buttons */}
          <SafeAreaView className="absolute top-0 left-0 right-0">
            <View className="flex-row items-center justify-between px-4 pt-2">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 bg-white dark:bg-card rounded-full items-center justify-center"
                style={{
                  elevation: 3,
                  ...(isDark ? {
                    shadowColor: "#3B82F6",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                  } : {}),
                }}
              >
                <Ionicons name="arrow-back" size={20} color={isDark ? "#E2E8F0" : "#111827"} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleSave}
                disabled={saveLoading}
                className="w-10 h-10 bg-white dark:bg-card rounded-full items-center justify-center"
                style={{
                  elevation: 3,
                  ...(isDark ? {
                    shadowColor: "#3B82F6",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                  } : {}),
                }}
              >
                <Ionicons
                  name={isSaved ? "heart" : "heart-outline"}
                  size={20}
                  color={isSaved ? "#EF4444" : isDark ? "#E2E8F0" : "#111827"}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Content */}
        <View
          className="px-5 pt-5 pb-8"
          style={{ opacity: property.is_sold ? 0.6 : 1 }}
        >
          {/* Badges */}
          <View className="flex-row gap-2 mb-3 flex-wrap">
            <View className="bg-blue-50 px-3 py-1 rounded-full dark:bg-blue-500/10 dark:border dark:border-blue-500/30">
              <Text className="text-blue-600 text-xs font-semibold capitalize dark:text-blue-400">
                {property.type}
              </Text>
            </View>

            {property.is_featured && (
              <View className="bg-amber-50 px-3 py-1 rounded-full dark:bg-amber-500/10 dark:border dark:border-amber-500/30">
                <Text className="text-amber-600 text-xs font-semibold dark:text-amber-400">
                  ⭐ Featured
                </Text>
              </View>
            )}

            {property.is_sold && (
              <View className="bg-red-50 px-3 py-1 rounded-full dark:bg-red-500/10 dark:border dark:border-red-500/30">
                <Text className="text-red-500 text-xs font-semibold dark:text-red-400">Sold</Text>
              </View>
            )}
          </View>

          {/* Title + Price */}
          <Text className="text-2xl font-bold text-gray-900 mb-1 dark:text-foreground">
            {property.title}
          </Text>
          <Text className="text-blue-600 text-xl font-bold mb-4 dark:text-blue-400">
            {formatPrice(property.price)}
          </Text>

          {/* Specs Row */}
          <View
            className="flex-row justify-between bg-gray-50 rounded-2xl p-4 mb-5 dark:bg-card dark:border dark:border-border"
            style={isDark ? {
              shadowColor: "#3B82F6",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.04,
              shadowRadius: 12,
            } : undefined}
          >
            <SpecItem
              icon="bed-outline"
              label="Beds"
              value={`${property.bedrooms}`}
              isDark={isDark}
            />
            <SpecItem
              icon="water-outline"
              label="Baths"
              value={`${property.bathrooms}`}
              isDark={isDark}
            />
            <SpecItem
              icon="expand-outline"
              label="Area"
              value={`${property.area_sqft} ft²`}
              isDark={isDark}
            />
            <SpecItem icon="home-outline" label="Type" value={property.type} isDark={isDark} />
          </View>

          {/* Description */}
          <Text className="text-base font-bold text-gray-900 mb-2 dark:text-foreground">
            Description
          </Text>
          <Text className="text-gray-500 text-sm leading-6 mb-1 dark:text-muted-foreground">
            {displayDesc}
          </Text>
          {isLongDesc && (
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
              <Text className="text-blue-600 text-sm font-medium mb-5 dark:text-blue-400">
                {expanded ? "Show less" : "Read more"}
              </Text>
            </TouchableOpacity>
          )}

          <View className="mb-5" />

          {/* Location */}
          <Text className="text-base font-bold text-gray-900 mb-2 dark:text-foreground">
            Location
          </Text>
          <View className="flex-row items-center gap-2 mb-4">
            <Ionicons name="location-outline" size={16} color={isDark ? "#64748B" : "#6B7280"} />
            <Text className="text-gray-500 text-sm flex-1 dark:text-muted-foreground">
              {property.address}, {property.city}
            </Text>
          </View>

          {/* Map Preview */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(root)/property/map",
                params: {
                  latitude: property.latitude,
                  longitude: property.longitude,
                  title: property.title,
                  address: `${property.address}, ${property.city}`,
                },
              })
            }
            activeOpacity={0.9}
            className="rounded-2xl overflow-hidden mb-6 dark:border dark:border-border"
            style={{ height: 200 }}
          >
            <WebView
              source={{ uri: mapUrl }}
              style={{ flex: 1 }}
              scrollEnabled={false}
              pointerEvents="none"
            />
            <View className="absolute bottom-3 right-3 bg-white/90 dark:bg-card/90 px-3 py-1 rounded-full flex-row items-center gap-1 dark:border dark:border-border">
              <Ionicons name="expand-outline" size={12} color={isDark ? "#94A3B8" : "#374151"} />
              <Text className="text-gray-600 text-xs font-medium dark:text-secondary-foreground">
                Tap to expand
              </Text>
            </View>
          </TouchableOpacity>

          {/* Contact Button */}
          <TouchableOpacity
            onPress={handleContact}
            className="flex-row items-center justify-center gap-2 bg-blue-600 py-4 rounded-2xl mb-4 dark:bg-blue-500"
            style={isDark ? {
              shadowColor: "#3B82F6",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
            } : undefined}
          >
            <Ionicons name="logo-whatsapp" size={20} color="white" />
            <Text className="text-white font-bold text-base">
              Contact Agent
            </Text>
          </TouchableOpacity>

          {/* Admin Actions */}
          {isAdmin && (
            <View className="flex-row gap-3">
              {!property.is_sold && (
                <TouchableOpacity
                  onPress={handleConfirmSold}
                  className="flex-1 flex-row items-center justify-center gap-2 bg-amber-50 py-4 rounded-2xl border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30"
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color={isDark ? "#FBBF24" : "#D97706"}
                  />
                  <Text className="text-amber-600 font-semibold dark:text-amber-400">
                    Mark Sold
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleDelete}
                className="flex-1 flex-row items-center justify-center gap-2 bg-red-50 py-4 rounded-2xl border border-red-100 dark:bg-red-500/10 dark:border-red-500/30"
              >
                <Ionicons name="trash-outline" size={18} color={isDark ? "#F87171" : "#EF4444"} />
                <Text className="text-red-500 font-semibold dark:text-red-400">Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Image Viewer */}
      <ImageViewing
        images={property.images.map((uri) => ({ uri }))}
        imageIndex={activeIndex}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
      />

      <CustomAlert
        visible={deleteModalVisible}
        title="Delete Property"
        message="Are you sure you want to delete this property? This action cannot be undone."
        type="error"
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={confirmDelete}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />

      <CustomAlert
        visible={soldModalVisible}
        title="Sold Property"
        message="Are you sure you want to mark this property as sold? This action cannot be undone."
        type="success"
        onClose={() => setSoldModalVisible(false)}
        onConfirm={confirmSold}
        confirmLabel="Mark as Sold"
        cancelLabel="Cancel"
      />
    </View>
  );
};

export default PropertyDetailScreen;

function SpecItem({
  icon,
  label,
  value,
  isDark,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  isDark: boolean;
}) {
  return (
    <View className="items-center gap-1">
      <Ionicons name={icon} size={20} color={isDark ? "#60A5FA" : "#2563EB"} />
      <Text className="text-gray-900 font-bold text-sm dark:text-foreground">{value}</Text>
      <Text className="text-gray-400 text-xs dark:text-muted-foreground">{label}</Text>
    </View>
  );
}
