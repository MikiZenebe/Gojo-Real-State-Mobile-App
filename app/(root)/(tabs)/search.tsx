import FilterModal from "@/components/property/FilterModal";
import PropertyCard, {
  PropertyCardSkeleton,
} from "@/components/property/PropertyCard";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase";
import { useFilterStore } from "@/store/filterStore";
import { Property } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchSceen = () => {
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { openFilters } = useLocalSearchParams<{ openFilters?: string }>();

  useEffect(() => {
    if (openFilters === "true") {
      setShowFilters(true);
    }
  }, [openFilters]);

  const {
    search,
    type,
    bedrooms,
    minPrice,
    maxPrice,
    setSearch,
    setType,
    setBedrooms,
    setMinPrice,
    setMaxPrice,
  } = useFilterStore();

  const activeFilterCount = [
    type !== null,
    bedrooms !== null,
    minPrice !== null,
    maxPrice !== null,
  ].filter(Boolean).length;

  useEffect(() => {
    fetchResults();
  }, [search, type, bedrooms, minPrice, maxPrice]);

  const fetchResults = async () => {
    setLoading(true);

    let query = supabase.from("properties").select("*");

    if (search) {
      query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%`);
    }

    if (type) {
      query = query.eq("type", type);
    }

    if (bedrooms) {
      query = query.eq("bedrooms", bedrooms);
    }

    if (minPrice) {
      query = query.gte("price", minPrice);
    }

    if (maxPrice) {
      query = query.lte("price", maxPrice);
    }

    const { data } = await query.order("created_at", { ascending: false });

    setResults(data ?? []);
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-background">
      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <Text className="text-2xl font-bold text-gray-900 mb-4 dark:text-foreground">
          Find Property
        </Text>

        {/* Search Bar + Filter Button */}
        <View className="flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center bg-white rounded-2xl px-4 gap-3 dark:bg-card dark:border dark:border-border">
            <Ionicons
              name="search-outline"
              size={18}
              color={isDark ? "#64748B" : "#9CA3AF"}
            />
            <Input
              className="flex-1 py-3 text-gray-800 dark:text-foreground"
              placeholder="Search by title or city..."
              placeholderTextColor={isDark ? "#475569" : "#9CA3AF"}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={isDark ? "#64748B" : "#9CA3AF"}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Button */}
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className={`w-12 h-11 rounded-2xl items-center justify-center border ${
              activeFilterCount > 0
                ? "bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500"
                : "bg-white border-gray-300 dark:bg-card dark:border-border"
            }`}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={
                activeFilterCount > 0 ? "#fff" : isDark ? "#94A3B8" : "#374151"
              }
            />
            {activeFilterCount > 0 && (
              <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
                <Text className="text-white text-[9px] font-bold">
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-3">
            {type && (
              <View className="flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1 dark:bg-blue-500/10 dark:border-blue-500/30">
                <Text className="text-blue-700 text-xs font-semibold capitalize dark:text-blue-400">
                  {type}
                </Text>
                <TouchableOpacity onPress={() => setType(null)}>
                  <Ionicons
                    name="close"
                    size={12}
                    color={isDark ? "#60A5FA" : "#1D4ED8"}
                  />
                </TouchableOpacity>
              </View>
            )}

            {bedrooms !== null && (
              <View className="flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1 dark:bg-blue-500/10 dark:border-blue-500/30">
                <Ionicons
                  name="bed-outline"
                  size={11}
                  color={isDark ? "#60A5FA" : "#1D4ED8"}
                />
                <Text className="text-blue-700 text-xs font-semibold dark:text-blue-400">
                  {bedrooms === 4
                    ? "4+ beds"
                    : `${bedrooms} bed${bedrooms > 1 ? "s" : ""}`}
                </Text>
                <TouchableOpacity onPress={() => setBedrooms(null)}>
                  <Ionicons
                    name="close"
                    size={12}
                    color={isDark ? "#60A5FA" : "#1D4ED8"}
                  />
                </TouchableOpacity>
              </View>
            )}

            {(minPrice !== null || maxPrice !== null) && (
              <View className="flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1 dark:bg-blue-500/10 dark:border-blue-500/30">
                <Text className="text-blue-700 text-xs font-semibold dark:text-blue-400">
                  {minPrice && maxPrice
                    ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
                    : minPrice
                      ? `From ${formatPrice(minPrice)}`
                      : `Up to ${formatPrice(maxPrice!)}`}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setMinPrice(null);
                    setMaxPrice(null);
                  }}
                >
                  <Ionicons
                    name="close"
                    size={12}
                    color={isDark ? "#60A5FA" : "#1D4ED8"}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PropertyCard property={item} />}
        ListHeaderComponent={
          <Text className="text-sm text-gray-400 mb-4 dark:text-muted-foreground">
            {loading ? "Searching..." : `${results.length} properties found`}
          </Text>
        }
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-20">
              <Ionicons
                name="search-outline"
                size={48}
                color={isDark ? "#334155" : "#D1D5DB"}
              />
              <Text className="text-gray-400 mt-4 text-base dark:text-muted-foreground">
                No properties found
              </Text>
              <Text className="text-gray-300 text-sm mt-1 dark:text-muted-foreground/60">
                Try a different search or adjust filters
              </Text>
            </View>
          ) : (
            <View className="mt-2">
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
            </View>
          )
        }
      />

      {/* Filter Modal */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </SafeAreaView>
  );
};

export default SearchSceen;
