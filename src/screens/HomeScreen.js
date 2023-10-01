import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  FlatList,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import Carousel, { Pagination } from "react-native-snap-carousel";

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

const InterestCard = ({ interest, icon }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Image source={icon} style={styles.cardIcon} />
        <Text style={styles.cardTitle}>{interest}</Text>
      </View>
      <View style={styles.activityContainer}>
        <Image
          source={require("../../assets/icons/last_activity_icon.png")}
          style={styles.activityImage}
        />
        <Text style={styles.lastActivity}>Last activity</Text>
        <Text style={styles.dotActivity}>...........</Text>
        <Text style={styles.timeActivity}>2h ago</Text>
      </View>
    </View>
  );
};

export default function Home() {
  const translateY = useRef(new Animated.Value(300)).current;
  const [interests, setInterests] = useState([]);
  const [interestCount, setInterestCount] = useState(0);
  const carouselRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleClearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage cleared successfully.");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  const getInterests = async () => {
    try {
      const response = await fetch("http://10.100.102.88:8000/interests");
      const data = await response.json();

      // Extracting names from the response
      const names = data[0].name; // Assuming the names are in the first item of the array
      setInterests(names);

      // Set the interest count based on the number of names
      setInterestCount(names.length);
    } catch (error) {
      console.error("Error fetching interests:", error);
    }
  };

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Call the function to fetch interests when component mounts
    getInterests();
  }, [translateY]);

  const [loaded] = useFonts({
    TitilliumWeb: require("../../assets/fonts/TitilliumWeb-Light.ttf"),
    TitilliumWebSemiBold: require("../../assets/fonts/TitilliumWeb-SemiBold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  // Get the screen width
  const screenWidth = Dimensions.get("window").width;

  // Helper function to chunk the data into 8 items per slide
  const chunkDataIntoSlides = (data, itemsPerSlide) => {
    const chunkedData = [];
    const totalItems = data.length;
    let currentIndex = 0;

    while (currentIndex < totalItems) {
      chunkedData.push(data.slice(currentIndex, currentIndex + itemsPerSlide));
      currentIndex += itemsPerSlide;
    }

    return chunkedData;
  };

  const handleSnapToItem = (index) => {
    setActiveSlide(index);
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      {/* Render 6 cards */}
      <View style={styles.topBar}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={require("../../assets/icons/dojo_icon.png")}
            style={{ width: 40, height: 40, tintColor: "#CC4747" }}
          />
          <Text
            style={{
              fontSize: 25,
              fontFamily: "TitilliumWebSemiBold",
              marginTop: 17,
              marginBottom: 2,
            }}
          >
            My Dojos
          </Text>
        </View>
        <View style={styles.notificationIcon}>
          <TouchableOpacity
            onPress={() => {
              // Handle notification icon press event here
              // You can navigate to a notification screen or display a notification panel
              // or any other action related to notifications.
            }}
          >
            <Image
              source={require("../../assets/icons/search.png")}
              style={styles.notificationImage}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // Handle notification icon press event here
              // You can navigate to a notification screen or display a notification panel
              // or any other action related to notifications.
            }}
          >
            <Image
              source={require("../../assets/icons/message.png")}
              style={styles.notificationImage}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // Handle notification icon press event here
              // You can navigate to a notification screen or display a notification panel
              // or any other action related to notifications.
            }}
          >
            <Image
              source={require("../../assets/icons/notification.png")}
              style={styles.notificationImage}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.wrap}>
        <Carousel
          ref={carouselRef}
          data={chunkDataIntoSlides(interests, 8)}
          renderItem={({ item }) => (
            <FlatList
              contentContainerStyle={styles.flatListContainer}
              data={item}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              renderItem={({ item }) => (
                <View style={styles.rowContainer}>
                  <InterestCard
                    key={item}
                    interest={item}
                    icon={
                      interestsData.find((data) => data.name === item)?.image
                    }
                  />
                </View>
              )}
            />
          )}
          sliderWidth={screenWidth}
          itemWidth={screenWidth}
          layout="default"
          loop={false}
          enableSnap={true} // Enable snap scrolling
          onSnapToItem={handleSnapToItem} // Added onSnapToItem callback
        />
        <View style={styles.paginationContainer}>
          <Pagination
            dotsLength={Math.ceil(interests.length / 8)}
            activeDotIndex={activeSlide}
            dotStyle={styles.paginationDot}
            inactiveDotOpacity={0.6}
            inactiveDotScale={0.8}
            containerStyle={styles.pagination}
          />
        </View>
        <View style={styles.mentor}>
          <Text style={styles.iam}>I'm a mentor,</Text>
          <Text style={styles.dojoOpen}>Open a new Dojo</Text>
        </View>
      </View>
      {/* <TouchableOpacity style={styles.button} onPress={handleClearAsyncStorage}>
        <Text style={styles.buttonText}>Clear AsyncStorage</Text>
      </TouchableOpacity> */}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    padding: 4,
    backgroundColor: "#F2EFE6",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  notificationIcon: {
    tintColor: "#CC4747",
    position: "absolute", // Add absolute positioning
    top: 10, // Adjust the  value to position the icon
    flexDirection: "row-reverse",
    marginRight: 10,
  },
  notificationImage: {
    tintColor: "#323234",
    resizeMode: "contain",
    width: 30,
    height: 30,
    marginLeft: 7,
  },
  contentText: {
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#3498db",
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
  },
  wrap: {
    flex: 1, // Take up full height
    justifyContent: "flex-end", // Align children at the bottom
  },
  card: {
    backgroundColor: "#FFFAFA",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    width: 180,
    height: 100,
  },
  cardContent: {
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "TitilliumWebSemiBold",
  },
  cardIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    tintColor: "#CC4747",
  },
  activityContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    fontSize: 16,
  },
  activityImage: {
    tintColor: "#CC4747",
    width: 12,
    height: 12,
  },
  rowContainer: {
    margin: 10, // Adjust this value to create more space between cards
  },
  paginationContainer: {
    position: "absolute",
    bottom: 140,
    alignSelf: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#CC4747",
    marginHorizontal: -5, // Adjust this value to reduce/increase the margin
  },
  lastActivity: {
    fontFamily: "TitilliumWeb",
    fontSize: 10,
    marginRight: 5,
    marginLeft: 3,
  },
  dotActivity: {
    fontFamily: "TitilliumWeb",
    fontSize: 14,
    color: "#CC4747",
    marginLeft: 3,
  },
  timeActivity: {
    fontFamily: "TitilliumWebSemiBold",
    fontSize: 10,
  },
  mentor: {
    backgroundColor: "#FFFAFA",
    borderRadius: 50,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center", // Center horizontally
    flexDirection: "row-reverse",
    height: 50,
    position: "absolute", // Position the mentor view at the bottom
    bottom: 110, // Adjust this value to position the mentor view at the bottom
  },
  iam: {
    marginLeft: 3,
  },
  dojoOpen: {
    fontFamily: "TitilliumWebSemiBold",
    color: "#CC4747",
  },
});
