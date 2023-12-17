import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Platform,
  Pressable,
  Image,
} from "react-native";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const interestsData = [
  { name: "Meditating", image: require("../../assets/icons/meditation.png") },
  { name: "Running", image: require("../../assets/icons/running.png") },
  { name: "Reading", image: require("../../assets/icons/reading.png") },
  { name: "Swimming", image: require("../../assets/icons/swimming.png") },
  {
    name: "Healthy Eating",
    image: require("../../assets/icons/healthyeating.png"),
  },
  { name: "Studying", image: require("../../assets/icons/studying.png") },
  {
    name: "Entrepreneing",
    image: require("../../assets/icons/entrepreneuring.png"),
  },
  {
    name: "Exercising",
    image: require("../../assets/icons/exercising.png"),
  },
  {
    name: "Home Tasking",
    image: require("../../assets/icons/hometasking.png"),
  },
  {
    name: "Playing Music",
    image: require("../../assets/icons/playingmusic.png"),
  },
];

const InterestContainer = () => {
  const navigation = useNavigation();

  const [selectedCards, setSelectedCards] = useState([]);

  const [loaded] = useFonts({
    TitilliumWeb: require("../../assets/fonts/TitilliumWeb-Light.ttf"),
    TitilliumWebSemiBold: require("../../assets/fonts/TitilliumWeb-SemiBold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const renderInterestCard = ({ item, index }) => {
    const isSelected = selectedCards.includes(index);

    const handleCardPress = () => {
      if (isSelected) {
        setSelectedCards(
          selectedCards.filter((cardIndex) => cardIndex !== index)
        );
      } else {
        setSelectedCards([...selectedCards, index]);
      }
    };

    let itemName;
    if (typeof item === "string") {
      itemName = item;
    } else if (typeof item === "object" && item.name) {
      itemName = item.name;
    }

    return (
      <Pressable
        style={[
          styles.card,
          { borderColor: isSelected ? "#CC4747" : "transparent" },
        ]}
        onPress={handleCardPress}
      >
        <Image source={item.image} style={styles.cardImage} />
        <Text style={styles.cardText}>{itemName}</Text>
      </Pressable>
    );
  };

  const prepareInterestsData = () => {
    const selectedInterests = selectedCards.map((index) => ({
      name: interestsData[index].name,
    }));
    return selectedInterests;
  };
  const handleBeginJourney = async () => {
    const interestsData = prepareInterestsData(); // Make sure interestsData is an array of strings
    console.log(interestsData);

    try {
      const response = await axios.post(
        "http://10.100.102.88:8000/add-interest",
        { interests: interestsData }, // Send interests as an array
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        await AsyncStorage.setItem("journeyStarted", "true");
        navigation.navigate("HomeScreen");
      } else {
        console.error(
          "Failed to save interests. Server responded with: ",
          response.data
        );
      }
    } catch (error) {
      console.error("Error saving interests:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Text
            style={[
              styles.headerText,
              { fontSize: 27, fontFamily: "TitilliumWeb" },
            ]}
          >
            Ready, set,{" "}
          </Text>
          <Text
            style={[
              styles.headerText,
              {
                fontSize: 27,
                color: "#CC4747",
                fontFamily: "TitilliumWebSemiBold",
              },
            ]}
          >
            Goal
          </Text>
        </View>

        <Text
          style={[styles.headerDescription, { fontFamily: "TitilliumWeb" }]}
        >
          Choose the area of life you want to fulfill more
        </Text>
      </View>
      <FlatList
        data={interestsData}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()} // Change keyExtractor
        renderItem={renderInterestCard}
        contentContainerStyle={styles.flatListContainer}
      />
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleBeginJourney}
          style={[
            styles.button,
            {
              backgroundColor: "#CC4747",
              borderRadius: 40,
              width: 360,
              height: 60,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: "white" }]}>
            Begin your journey
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    padding: 10,
    backgroundColor: "#F2EFE6",
  },
  headerTitle: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    justifyContent: "center",
    alignItems: "center",
  },
  headerDescription: {
    fontFamily: "TitilliumWeb",
    marginBottom: 20, // Add margin bottom to create space between description and cards
  },
  header: {
    justifyContent: "space-between",
    justifyContent: "center",
    alignItems: "center",
  },
  flatListContainer: {
    flexGrow: 1,
    width: "100%",
  },
  card: {
    flex: 1,
    margin: 8,
    height: 100,
    backgroundColor: "#FFFAFA",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    
  },
  cardImage: {
    width: 30, // Adjust the width as needed
    height: 30, // Adjust the height as needed
    resizeMode: "contain", // Adjust the resizeMode as needed
    tintColor: "#CC4747",
  },
  cardText: {
    textAlign: "center",
    fontFamily: "TitilliumWebSemiBold",
    fontSize: 12,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    justifyContent: "space-between",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "TitilliumWebSemiBold",
  },
});

export default InterestContainer;
