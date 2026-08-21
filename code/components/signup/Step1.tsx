import RadioGroup from "../buttons/RadioGroup";
import React, { Dispatch, SetStateAction } from "react";
import { View, Text, StyleSheet } from "react-native";

type Step1Props = {
  setRole: Dispatch<SetStateAction<string>>;
  setIsRoleSelected: Dispatch<SetStateAction<boolean>>;
};

const Step1: React.FC<Step1Props> = ({ setRole, setIsRoleSelected }) => {
  const updateRole = (newRole: string) => {
    setRole(newRole);
    setIsRoleSelected(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Role</Text>
      <View style={styles.radioContainer}>
        <RadioGroup
          options={[
            { label: "Student", value: "Student" },
            { label: "Teacher", value: "Teacher" },
          ]}
          initialValue={null}
          onValueChange={(value) => updateRole(value)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 20,
  },
  title: {
    marginTop: -25,
    fontFamily: "Inter",
    fontWeight: "700",
    color: "#2F7D32",
    marginBottom: 30,
    fontSize: 28,
    bottom: 35
  },
  radioContainer: {
    width: "100%",
    paddingHorizontal: 10,
    bottom: 35
  },
});

export default Step1;
