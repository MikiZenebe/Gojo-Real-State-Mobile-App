import { CustomAlert } from "@/components/CustomAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAuth, useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    message: "",
    title: "Error",
  });

  const isLoading = fetchStatus === "fetching";

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  const onSignUpPress = async () => {
    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });

    if (error) {
      setAlertConfig({
        visible: true,
        message: error.message,
        title: "Registration Failed",
      });
      return;
    }

    if (!error) await signUp.verifications.sendEmailCode();
  };

  const onVerifyPress = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  // OTP verification screen
  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-background px-6">
        <Image
          source={require("../../assets/images/icon.png")}
          className="w-32 h-16 mb-8 dark:hidden"
          resizeMode="contain"
        />
        <Image
          source={require("../../assets/images/dark-logo.png")}
          className="w-32 h-16 mb-8 hidden dark:flex"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-gray-800 mb-2 dark:text-foreground">
          Verify your account
        </Text>
        <Text className="text-gray-500 mb-8 text-center dark:text-muted-foreground">
          We sent a code to {email}
        </Text>

        <Input
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 dark:border-border dark:bg-card dark:text-foreground"
          placeholder="Enter verification code"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />

        <Button
          onPress={onVerifyPress}
          disabled={isLoading}
          className="w-full bg-blue-600 rounded-xl items-center mb-4 dark:bg-blue-500"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Verify</Text>
          )}
        </Button>

        <TouchableOpacity onPress={() => signUp.verifications.sendEmailCode()}>
          <Text className="text-blue-600 text-center">I need a new code</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => signUp.reset()} className="py-2">
          <Text className="text-blue-600">Start over</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        className="bg-white dark:bg-background"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-12">
          <Image
            source={require("@/assets/images/icon.png")}
            className="w-32 h-16 mb-8 dark:hidden"
            resizeMode="contain"
          />
          <Image
            source={require("@/assets/images/dark-logo.png")}
            className="w-32 h-16 mb-8 hidden dark:flex"
            resizeMode="contain"
          />
          <Text
            variant={"h3"}
            className="font-bold text-gray-800 mb-2 dark:text-foreground"
          >
            Create Account
          </Text>
          <Text className="text-gray-500 mb-8 dark:text-muted-foreground">
            Find your dream home today
          </Text>

          <View className="flex-row gap-3 mb-4">
            <Input
              className="flex-1 border border-gray-300 bg-white rounded-xl px-4 py-3 text-black dark:border-border dark:bg-card dark:text-foreground"
              autoCapitalize="words"
              placeholder="First Name"
              placeholderTextColor="#9ca3af"
              value={firstName}
              onChangeText={setFirstName}
            />

            <Input
              className="flex-1 border border-gray-300 bg-white rounded-xl px-4 py-3 text-black dark:border-border dark:bg-card dark:text-foreground"
              autoCapitalize="words"
              placeholder="Last Name"
              placeholderTextColor="#9ca3af"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <Input
            className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3 text-black dark:border-border dark:bg-card dark:text-foreground mb-4"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email Address"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
          />

          <Input
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 dark:border-border dark:bg-card dark:text-foreground"
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            disabled={isLoading}
            className="w-full bg-blue-600 rounded-xl items-center mb-4 dark:bg-blue-500"
            onPress={onSignUpPress}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">Sign Up</Text>
            )}
          </Button>

          <View className="flex-row justify-center">
            <Text className="text-gray-500 dark:text-muted-foreground">Already have an account? </Text>
            <Link href="/sign-in">
              <Text className="text-blue-600 font-semibold">Sign In</Text>
            </Link>
          </View>

          <View nativeID="clerk-captcha" />
        </View>
      </ScrollView>

      <CustomAlert
        visible={alertConfig.visible}
        message={alertConfig.message}
        title={alertConfig.title}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
    </KeyboardAvoidingView>
  );
}
