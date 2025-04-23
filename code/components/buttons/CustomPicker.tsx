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

type CustomPickerProps = {
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: { label: string; value: string }[];
  placeholder?: string;
};

const CustomPicker: React.FC<CustomPickerProps> = ({
  selectedValue,
  onValueChange,
  items,
  placeholder = "Select an option",
}) => {
  const [isPickerVisible, setPickerVisible] = useState(false);

  // For iOS, we'll use a modal approach
  if (Platform.OS === "ios") {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => setPickerVisible(true)}>
          <View style={styles.pickerButton}>
            <Picker
              selectedValue={selectedValue}
              enabled={false}
              style={{ opacity: 0, height: 1, position: "absolute" }}
            >
              {items.map((item) => (
                <Picker.Item
                  key={item.value}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
            <View style={styles.pickerTrigger}>
              <Text style={styles.pickerLabel}>
                {selectedValue
                  ? items.find((item) => item.value === selectedValue)?.label ||
                    placeholder
                  : placeholder}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>

        <Modal
          visible={isPickerVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableWithoutFeedback onPress={() => setPickerVisible(false)}>
                <View style={styles.modalOverlay} />
              </TouchableWithoutFeedback>

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedValue}
                  onValueChange={(value) => {
                    onValueChange(value.toString());
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
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // For Android, we'll use a simpler approach with an overlay
  return (
    <View style={styles.container}>
      {isPickerVisible && (
        <TouchableWithoutFeedback onPress={() => setPickerVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(value) => {
            onValueChange(value.toString());
            setPickerVisible(false);
          }}
          onFocus={() => setPickerVisible(true)}
          mode="dropdown"
          style={styles.picker}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    paddingBottom: 5,
    marginBottom: 1,
    zIndex: 10,
    elevation: 3,
  },
  picker: {
    width: "100%",
    height: 25,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 9,
    elevation: 2,
  },
  // iOS specific styles
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    height: "50%",
  },
  modalOverlay: {
    position: "absolute",
    top: -1000,
    left: 0,
    right: 0,
    bottom: "50%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 9,
  },
  pickerButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 12,
  },
  pickerTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerLabel: {
    fontSize: 16,
  },
});

export default CustomPicker;
