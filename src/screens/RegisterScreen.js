// ios: 847129469910-prgobng5jvjq8ljb0g774046coejqett.apps.googleusercontent.com
//android: 847129469910-mtqi5dfahjendn1s1dipovl7fd7h682i.apps.googleusercontent.com
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import * as WebBrawser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrawser.maybeCompleteAuthSession();

export default function RegisterScreen() {
  const [accessToken, setAccessToken] = useState(null);
  const [user, serUser] = useState(null);
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

  const ShowUserInfo = () => {
    if (user) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 35, fontWeight: "bold", marginBottom: 20 }}>
            Welcome
          </Text>
          <Image
            source={{ uri: user.picture }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{user.name}</Text>
        </View>
      );
    }
  };

  return (
    <View>
      {user && <ShowUserInfo />}
      {user === null && (
        <>
          <Text style={{ fontSize: 35, fontWeight: "bold" }}>Welcome</Text>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              marginBottom: 20,
              color: "grey",
            }}
          >
            Please login
          </Text>
          <TouchableOpacity
            disabled={!request}
            onPress={() => {
              promptAsync();
            }}
          >
            <Image
              source={require("../../assets/icons/dojo_icon.png")}
              style={{ width: 300, height: 40 }}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
