import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { PropertyType, useFilterStore } from "@/store/filterStore";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const TYPES: { label: string; value: PropertyType }[] = [
  { label: "All", value: null },
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Villa", value: "villa" },
  { label: "Studio", value: "studio" },
];

const BEDS = [
  { label: "Any", value: null },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4+", value: 4 },
];

const PRICE_PRESETS = [
  { label: "Under $50k", min: null, max: 50000 },
  { label: "$50k – $100k", min: 50000, max: 100000 },
  { label: "$100k – $200k", min: 100000, max: 200000 },
  { label: "Above $200k", min: 200000, max: null },
];

export default function FilterModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const chip = (active: boolean) =>
    `px-4 py-2 rounded-full border ${
      active
        ? "bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500"
        : "bg-white border-gray-200 dark:bg-secondary dark:border-border"
    }`;

  const chipText = (active: boolean) =>
    `text-sm font-semibold ${
      active ? "text-white" : "text-gray-600 dark:text-secondary-foreground"
    }`;

  const {
    type,
    bedrooms,
    minPrice,
    maxPrice,
    setType,
    setBedrooms,
    setMinPrice,
    setMaxPrice,
    resetFilters,
  } = useFilterStore();

  const [localMin, setLocalMin] = useState(minPrice ? String(minPrice) : "");
  const [localMax, setLocalMax] = useState(maxPrice ? String(maxPrice) : "");

  const activeCount = [type, bedrooms, minPrice, maxPrice].filter(
    (v) => v !== null,
  ).length;

  const handleApply = () => {
    setMinPrice(localMin ? Number(localMin) : null);
    setMaxPrice(localMax ? Number(localMax) : null);
    onClose();
  };

  const handleReset = () => {
    setLocalMin("");
    setLocalMax("");
    resetFilters();
    onClose();
  };

  const shadow = isDark
    ? {
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 1,
      }
    : {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
      };

  return (
    <Dialog
      open={visible}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="w-72 bg-white rounded-xl dark:bg-card dark:border dark:border-border">
        <DialogHeader>
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-6 pb-3 bg-white border-b border-gray-300 dark:bg-card dark:border-border">
            <Text className="text-lg font-bold text-gray-900 dark:text-foreground">Filters</Text>
            <TouchableOpacity onPress={handleReset}>
              <Text className="text-blue-600 font-semibold text-sm dark:text-blue-400">Reset</Text>
            </TouchableOpacity>
          </View>
        </DialogHeader>

        <ScrollView>
          {/* Property Type */}
          <Text className="text-base font-bold text-gray-800 mb-3 dark:text-foreground">
            Property Type
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {TYPES.map((item) => (
              <TouchableOpacity
                key={String(item.value)}
                onPress={() => setType(item.value)}
                className={chip(type === item.value)}
                style={shadow}
              >
                <Text className={chipText(type === item.value)}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bedrooms */}
          <Text className="text-base font-bold text-gray-800 mb-3 dark:text-foreground">
            Bedrooms
          </Text>
          <View className="flex-row gap-2 mb-6">
            {BEDS.map((item) => (
              <TouchableOpacity
                key={String(item.value)}
                onPress={() => setBedrooms(item.value)}
                className={`flex-1 items-center py-3 rounded-2xl border ${
                  bedrooms === item.value
                    ? "bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500"
                    : "bg-white border-gray-200 dark:bg-secondary dark:border-border"
                }`}
                style={shadow}
              >
                <Text
                  className={`text-sm font-bold ${
                    bedrooms === item.value
                      ? "text-white"
                      : "text-gray-600 dark:text-secondary-foreground"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Range */}
          <Text className="text-base font-bold text-gray-800 mb-3 dark:text-foreground">
            Price Range ($)
          </Text>
          <View className="flex-row gap-3 mb-3">
            {[
              {
                label: "Min Price",
                value: localMin,
                onChange: setLocalMin,
                placeholder: "0",
              },
              {
                label: "Max Price",
                value: localMax,
                onChange: setLocalMax,
                placeholder: "Any",
              },
            ].map(({ label, value, onChange, placeholder }) => (
              <View key={label} className="flex-1">
                <Text className="text-xs text-gray-500 mb-1.5 font-medium dark:text-muted-foreground">
                  {label}
                </Text>
                <View className="flex-row items-center bg-white rounded-xl dark:bg-secondary">
                  <Text className="text-gray-400 text-sm mr-1 dark:text-muted-foreground">$</Text>
                  <Input
                    className="flex-1 py-3 text-gray-800 dark:text-foreground"
                    placeholder={placeholder}
                    placeholderTextColor={isDark ? "#475569" : "#9CA3AF"}
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Price Presets */}
          <View className="flex-row flex-wrap gap-2">
            {PRICE_PRESETS.map((p) => {
              const active = minPrice === p.min && maxPrice === p.max;
              return (
                <TouchableOpacity
                  key={p.label}
                  onPress={() => {
                    setLocalMin(p.min ? String(p.min) : "");
                    setLocalMax(p.max ? String(p.max) : "");
                    setMinPrice(p.min);
                    setMaxPrice(p.max);
                  }}
                  className={`px-3 py-1.5 rounded-full border ${
                    active
                      ? "bg-blue-50 border-blue-300 dark:bg-blue-500/15 dark:border-blue-500/40"
                      : "bg-white border-gray-200 dark:bg-secondary dark:border-border"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      active
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-muted-foreground"
                    }`}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View className="px-5 pb-8 pt-4 bg-white border-t border-gray-100 dark:bg-card dark:border-border">
          <Button
            onPress={handleApply}
            className="bg-blue-600 rounded-2xl w-full items-center dark:bg-blue-500"
            style={{
              shadowColor: "#2563EB",
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-white font-bold text-base">
              Apply Filters{activeCount > 0 ? ` (${activeCount})` : ""}
            </Text>
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  );
}
