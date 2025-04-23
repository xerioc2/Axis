import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function Header() {
  const [showCourses, setShowCourses] = useState(false);
  const [showCheckPoints, setShowCheckPoints] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showSemester, setShowSemester] = useState(false);
}

const StudentHeader: React.FC = () => {
  return (
    <>
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/images/axis-bg.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <Text>Student Header</Text>
        </ImageBackground>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    paddingVertical: 0,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
