import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  StatusBar,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Facebook from "expo-auth-session/providers/facebook";
import { Video } from "expo-av";
import { useFonts } from "expo-font";

WebBrowser.maybeCompleteAuthSession();

export default function FacebookTesting() {
  const [accessToken, setAccessToken] = useState(null);
  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);
  const [user, setUser] = useState(null);
  const [req, res, promptAsyn] = Facebook.useAuthRequest({
    clientId: "7094664697244330",
  });
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId:
      "847129469910-jiib8t71n75vhccbl0u3d3q5g43cdfr9.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
      accessToken && fetchUserInfo();
    }
  }, [response, accessToken]);

  async function fetchUserInfo() {
    let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken} `,
      },
    });
    const userInfo = await response.json();
    setUser(userInfo);
  }

  useEffect(() => {
    const checkAvailable = async () => {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      setAppleAuthAvailable(isAvailable);
    };
    checkAvailable();
  }, []);

  useEffect(() => {
    if (res?.type === "success" && res?.authentication) {
      // Fetch user data from Facebook using the access token
      fetchFacebookUserData(res.authentication.accessToken);
    }
  }, [res]);

  // Function to fetch user data from Facebook
  const fetchFacebookUserData = async (accessToken) => {
    try {
      const userInfoResponse = await fetch(
        `https://graph.facebook.com/me?access_token=${accessToken}&fields=name,picture.type(large),email`
      );
      const userInfo = await userInfoResponse.json();
      setUser(userInfo);
    } catch (error) {
      console.log("Facebook User Data Error:", error);
    }
  };

  const handleFacebookLogin = async () => {
    const result = await promptAsyn();
    if (result.type !== "success") {
      alert("Oh oh, something went wrong");
    }
  };

  const onAppleButtonPress = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      setUser(credential.fullName); // Update the user state with full name
      console.log(credential);
    } catch (error) {
      console.log("Apple Sign In Error:", error);
    }
  };

  const [loaded] = useFonts({
    TitilliumWeb: require("../../assets/fonts/TitilliumWeb-Light.ttf"),
    TitilliumWebSemiBold: require("../../assets/fonts/TitilliumWeb-SemiBold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const ShowUserInfo = () => {
    if (user) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 35, fontWeight: "bold", marginBottom: 20 }}>
            Welcomeeee
          </Text>
          <Image
            source={{ uri: user.picture.data.url }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{user.name}</Text>
          <Text style={{ fontSize: 16, marginTop: 10 }}>{user.email}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {user && <ShowUserInfo />}
      {user === null && (
        <>
          <Image
            source={require("../../assets/images/logo_no_slogan.png")}
            style={{ width: 150, height: 150, marginTop: 50 }}
          />

          <Video
            source={require("../../assets/animations/FlowChartAnimate_bg.mp4")}
            style={{ width: 250, height: 250, marginBottom: 50 }}
            resizeMode="contain" // Adjust the resizeMode as needed (e.g., "contain", "cover")
            shouldPlay // Auto-play the video
          />
          <TouchableOpacity
            disabled={!request}
            onPress={() => {
              promptAsync();
            }}
            style={styles.googleButton}
          >
            <Image
              source={require("../../assets/images/google.png")}
              style={{ width: 40, height: 40 }}
            />
            <Text style={{ fontSize: 15, fontFamily: "TitilliumWeb" }}>
              Login with Google
            </Text>
          </TouchableOpacity>
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
            }
            buttonStyle={
              AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            }
            cornerRadius={50}
            style={{ width: 220, height: 50, marginTop: 10 }}
            onPress={() =>
              onAppleButtonPress().then(() =>
                console.log("Apple sign-in complete!")
              )
            }
          />
          <TouchableOpacity style={styles.googleButton} onPress={handleFacebookLogin}>
            <Image
              source={require("../../assets/images/facebook.png")}
              style={{ width: 40, height: 40 }}
            />
            <Text style={{ fontSize: 15, fontFamily: "TitilliumWeb" }}>
              Login with Facebook
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.googleButton}>
          <Image
              source={require("../../assets/images/gmail.png")}
              style={{ width: 40, height: 40 }}
            />
            <Text style={{ fontSize: 15, fontFamily: "TitilliumWeb" }}>
              Login with Email
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    padding: 4,
    backgroundColor: "#F2EFE6",
    alignItems: "center",
  },
  googleButton: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFFAFA",
    borderRadius: 50,
    width: 300,
    height: 45,
    marginBottom: 15,
    paddingLeft: 60, // Adjust the padding to align the content
  },
});
