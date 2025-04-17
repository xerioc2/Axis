import React, { SetStateAction } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { styles } from "./StudentDashboardStyle";

type StudentDashboardMenuProps = {
  closeModal: () => void;
  slideAnim: Animated.Value;
  setCreatingSection: React.Dispatch<SetStateAction<boolean>>;
};

const StudentDashboardMenu: React.FC<StudentDashboardMenuProps> = ({
  closeModal,
  slideAnim,
  setCreatingSection
}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={{ paddingBottom: 100 }}
              keyboardShouldPersistTaps="handled"
            >
              <TouchableOpacity 
                onPress={() => setCreatingSection(true)}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Add Section</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Add Course</Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={closeModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <View style={{ height: 200 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default StudentDashboardMenu;
