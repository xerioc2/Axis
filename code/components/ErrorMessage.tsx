import React from "react";
import { View, Text, StyleSheet } from "react-native";

type ErrorMessageProps = {
  message: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 40,
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#F8D7DA",
    borderColor: "#F5C2C7",
    borderWidth: 1,
  },
  text: {
    color: "#842029",
    fontSize: 14,
    fontFamily: "Inter",
    textAlign: "center",
  },
});

export default ErrorMessage;
