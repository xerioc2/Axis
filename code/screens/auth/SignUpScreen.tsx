import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { StackNavigationProp } from "@react-navigation/stack";
import SignUpManager from "../../components/signup/SignUpManager";
import { RootStackParamList } from "../../utils/navigation.types";
import { Colors } from "../../theme";

type SignUpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SignUp"
>;

type SignUpScreenProps = {
  navigation: SignUpScreenNavigationProp;
};

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    "SF Pro": require("../../assets/fonts/sf_pro.ttf"),
    "Rexton Bold": require("../../assets/fonts/rexton_bold.otf"),
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.pageWrapper}>
      <View style={styles.card}>
        <Image
          source={require("../../assets/images/axis_lettering.png")}
          style={styles.logo}
        />

        <Text style={styles.slogan}>WHERE LEARNING MEETS MASTERY</Text>

        <SignUpManager />
      </View>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: 400,
    padding: 30,
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    alignItems: "center",
  },
  logo: {
    width: 400,
    height: 125,
    resizeMode: "contain",
    marginBottom: 10,
  },
  slogan: {
    color: Colors.secondary,
    fontFamily: "Rexton Bold",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 30,
  },
});
