import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create a stack navigator with shared element support
const Stack = createSharedElementStackNavigator();

export default function WelcomeScreen() {
  const ring1padding = useSharedValue(0);
  const ring2padding = useSharedValue(0);

  const navigation = useNavigation();

  useEffect(() => {
    ring1padding.value = 0;
    ring2padding.value = 0;
    setTimeout(() => (ring1padding.value = withSpring(ring1padding.value + hp(5))), 100);
    setTimeout(() => (ring2padding.value = withSpring(ring2padding.value + hp(5.5))), 300);

    // Check if journeyStarted is true in AsyncStorage
    AsyncStorage.getItem('journeyStarted').then((value) => {
      if (value === 'true') {
        // If journeyStarted is true, navigate to HomeScreen
        setTimeout(() => navigation.navigate('HomeScreen'), 2500);
      } else {
        // If journeyStarted is not true, navigate to onBoarding screen
        setTimeout(() => navigation.navigate('register'), 2500);
      }
    });
  }, []);
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        backgroundColor: "#ffffff",
      }}
    >
      <StatusBar style="light" />

      {/* logo image with rings */}
      <Animated.View
        style={{
          backgroundColor: "rgba(227, 47, 69, 0.5)",
          borderRadius: 300,
          padding: ring2padding,
        }}
      >
        <Animated.View
          style={{
            backgroundColor: "rgba(227, 47, 69, 0.7)",
            borderRadius: 300,
            padding: ring1padding,
          }}
        >
          <Image
            source={require("../../assets/images/dojoLogo.png")}
            style={{ width: hp(20), height: hp(20), tintColor: "#fff" }}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}
