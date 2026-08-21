import React, { SetStateAction } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
  TouchableWithoutFeedback,
  BackHandler,
  StyleSheet,
} from "react-native";

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
  setCreatingCourse,
}) => {
  // Use React's effects to manage hardware back button on Android
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        closeModal();
        return true;
      }
    );

    return () => backHandler.remove();
  }, [closeModal]);

  // Handle actions with proper cleanup
  const handleAddSection = () => {
    // First close the modal (animation)
    Animated.timing(slideAnim, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Then set the state to show the section form after animation completes
      setCreatingSection(true);
      closeModal();
    });
  };

  const handleAddCourse = () => {
    // First close the modal (animation)
    Animated.timing(slideAnim, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Then set the state to show the course form after animation completes
      setCreatingCourse(true);
      closeModal();
    });
  };

  const handleBackdropPress = () => {
    // Close modal when backdrop is pressed
    closeModal();
  };

  return (
    <TouchableWithoutFeedback onPress={handleBackdropPress}>
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.handle} />
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={handleAddSection}
              style={styles.menuButton}
              accessibilityLabel="Add section button"
            >
              <Text style={styles.menuButtonText}>Add Section</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAddCourse}
              style={styles.menuButton}
              accessibilityLabel="Add course button"
            >
              <Text style={styles.menuButtonText}>Add Course</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuButton, styles.cancelButton]}
              onPress={closeModal}
              accessibilityLabel="Cancel button"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    height: "auto", // Changed from fixed height to auto
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20, // Extra padding for iOS
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  buttonsContainer: {
    marginBottom: 20,
  },
  menuButton: {
    backgroundColor: "#005824",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  menuButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    marginTop: 12,
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TeacherDashboardMenu;