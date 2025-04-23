import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Modal,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "../../theme";

type CustomPickerProps = {
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: { label: string; value: string }[];
  placeholder?: string;
  placeholderTextColor?: string;
};

const CustomPicker: React.FC<CustomPickerProps> = ({
  selectedValue,
  onValueChange,
  items,
  placeholder = "Select an option",
  placeholderTextColor = "#4F4F4F",
}) => {
  const [isPickerVisible, setPickerVisible] = useState(false);

  const selectedLabel = items.find((i) => i.value === selectedValue)?.label;

  if (Platform.OS === "ios") {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => setPickerVisible(true)}>
          <View style={styles.pickerButton}>
            <Text
              style={{
                color: selectedValue ? "#000" : placeholderTextColor,
                fontSize: 16,
                fontFamily: "Inter",
              }}
            >
              {selectedLabel || placeholder}
            </Text>
          </View>
        </TouchableWithoutFeedback>

        <Modal visible={isPickerVisible} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={() => setPickerVisible(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Picker
              selectedValue={selectedValue}
              onValueChange={(value) => {
                onValueChange(value);
                setPickerVisible(false);
              }}
            >
              {items.map((item) => (
                <Picker.Item
                  key={item.value}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>
        </Modal>
      </View>
    );
  }

  // Android fallback
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        {!selectedValue && <Picker.Item label={placeholder} value="" />}
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: 280,
    margin: 5,
  },
  pickerButton: {
    borderBottomColor: Colors.secondary,
    fontFamily: "Inter",
    fontSize: 16,
    borderBottomWidth: 1,
    width: 280,
    margin: 10,
    bottom: 2,
    alignSelf: "center",
  },
  picker: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
    fontSize: 16,
    fontFamily: "Inter",
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
  },
});

export default CustomPicker;
