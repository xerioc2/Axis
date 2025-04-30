import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import CustomPicker from "../buttons/CustomPicker";
import StatePicker from "../buttons/StatePicker";
import SchoolPicker from "../buttons/SchoolPicker";
import { Colors } from "../../theme";

type Step2Props = {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    state: string;
    schoolType: string;
    schoolName: string;
  };
  setFormData: (data: any) => void;
};

const Step2: React.FC<Step2Props> = ({ formData, setFormData }) => {
  const [schoolTypeId, setSchoolTypeId] = useState(3);

  const handleChange = (key: string, value: string) => {
    const newFormData: any = { ...formData, [key]: value };
    if (key === "schoolType" || key === "state") {
      newFormData.schoolName = "";
    }
    setFormData(newFormData);

    if (key === "schoolType") {
      switch (value) {
        case "Middle School":
          setSchoolTypeId(1);
          break;
        case "High School":
          setSchoolTypeId(2);
          break;
        case "College":
          setSchoolTypeId(3);
          break;
        default:
          setSchoolTypeId(3);
      }
    }
  };

  const schoolTypeOptions = [
    { label: "Select School Type", value: "" },
    { label: "Middle School", value: "Middle School" },
    { label: "High School", value: "High School" },
    { label: "College", value: "College" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          style={styles.halfInput}
          placeholder="First Name"
          value={formData.firstName}
          onChangeText={(text) => handleChange("firstName", text)}
          placeholderTextColor={Colors.textInput}
        />
        <TextInput
          style={styles.halfInput}
          placeholder="Last Name"
          value={formData.lastName}
          onChangeText={(text) => handleChange("lastName", text)}
          placeholderTextColor={Colors.textInput}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        placeholderTextColor={Colors.textInput}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
        placeholderTextColor={Colors.textInput}
        secureTextEntry
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(text) => handleChange("confirmPassword", text)}
        placeholderTextColor={Colors.textInput}
        secureTextEntry
        autoCapitalize="none"
      />

      <StatePicker
        selectedValue={formData.state}
        onValueChange={(value) => handleChange("state", value)}
      />

      <CustomPicker
        selectedValue={formData.schoolType}
        onValueChange={(value) => handleChange("schoolType", value)}
        items={schoolTypeOptions}
        placeholder="Select School Type"
        placeholderTextColor={Colors.textInput}
      />

      <SchoolPicker
        selectedValue={formData.schoolName}
        onValueChange={(value) => handleChange("schoolName", value)}
        selectedState={formData.state}
        selectedSchoolType={formData.schoolType}
      />
    </View>
  );
};

export default Step2;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 10,
    bottom: 50
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  halfInput: {
    width: "48%",
    borderColor: Colors.bottomBorder,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: "Inter",
    fontSize: 14,
    backgroundColor: "#fff",
  },
  input: {
    width: "100%",
    borderColor: Colors.bottomBorder,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    fontFamily: "Inter",
    fontSize: 14,
    backgroundColor: "#fff",
  },
});
