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
import { styles } from "./TeacherDashboardStyle";

type TeacherDashboardMenuProps = {
  closeModal: () => void;
  slideAnim: Animated.Value;
  setCreatingSection: React.Dispatch<SetStateAction<boolean>>;
  setCreatingCourse: React.Dispatch<SetStateAction<boolean>>;
};

const TeacherDashboardMenu: React.FC<TeacherDashboardMenuProps> = ({
  closeModal,
  slideAnim,
  setCreatingSection,
  setCreatingCourse
}) => {
  const handleAddSection = () => {
    // First set the state to show the section form
    setCreatingSection(true);
    // Then close the modal
    closeModal();
  };

  const handleAddCourse = () => {
    // First set the state to show the course form
    setCreatingCourse(true);
    // Then close the modal
    closeModal();
  };

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
                onPress={handleAddSection}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Add Section</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleAddCourse}
                style={styles.modalButton}
              >
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

export default TeacherDashboardMenu;