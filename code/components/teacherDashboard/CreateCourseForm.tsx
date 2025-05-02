import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { 
  CourseInsertDto,
  Semester
} from "../../../App";
import { 
  createCourse,
  getSemesters
} from "../../service/supabaseService";

// Modal type enum - using string values to ensure proper TypeScript comparison
enum ModalType {
  None = 'None',
  Course = 'Course',
  Semester = 'Semester', 
  Topic = 'Topic'
}

const CreateCourseForm: React.FC<{
  userId?: string;
  schoolId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}> = ({ userId, schoolId, onSuccess, onCancel }) => {
  // Course state
  const [courseName, setCourseName] = useState("");
  const [courseSubject, setCourseSubject] = useState("");
  const [courseIdentifier, setCourseIdentifier] = useState("");
  
  // Dynamic data
  const [semesters, setSemesters] = useState<Semester[]>([]);
  
  // Single modal state
  const [activeModal, setActiveModal] = useState<ModalType>(ModalType.None);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

  // Load semesters
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch semesters
        const semestersData = await getSemesters();
        setSemesters(semestersData || []);
      } catch (err: any) {
        console.error("Error fetching semesters:", err);
        setError("Failed to load necessary data");
      }
    };
    
    fetchData();
  }, []);

  // Validate the form
  const validateForm = () => {
    if (!courseName.trim()) {
      setError("Course name is required");
      return false;
    }
    
    setError("");
    return true;
  };

  // Submit form data with debounce
  const handleSubmit = useCallback(async () => {
    if (isSubmitButtonDisabled) return;
    if (!validateForm() || !userId) return;

    setIsSubmitButtonDisabled(true);
    setIsLoading(true);
    
    try {
      // Create Course using the imported function
      const courseData: CourseInsertDto = {
        course_name: courseName,
        course_subject: courseSubject || null,
        course_identifier: courseIdentifier || null,
        creator_id: userId,
        school_id: schoolId
      };

      const result = await createCourse(courseData);
      if (!result) {
        throw new Error("Failed to create course");
      }

      Alert.alert(
        "Success", 
        "Course created successfully!"
      );
      
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Error creating course:", err);
      setError(err.message || "Failed to create course");
      setIsSubmitButtonDisabled(false);
    } finally {
      setIsLoading(false);
      // Reset the button disable after a short delay
      setTimeout(() => {
        setIsSubmitButtonDisabled(false);
      }, 500);
    }
  }, [userId, schoolId, courseName, courseSubject, courseIdentifier, isSubmitButtonDisabled, onSuccess]);

  // Main content render
  const renderContent = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView 
        style={styles.scrollView} 
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Create New Course</Text>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onCancel}
            accessibilityLabel="Close form"
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Course Details</Text>
          <Text style={styles.sectionSubtitle}>
            A course contains the overall subject matter and topics
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Course Name*</Text>
            <TextInput
              style={styles.input}
              value={courseName}
              onChangeText={setCourseName}
              placeholder="e.g., Introduction to Computer Science"
              returnKeyType="next"
              accessibilityLabel="Course name input"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Course Subject (optional)</Text>
            <TextInput
              style={styles.input}
              value={courseSubject}
              onChangeText={setCourseSubject}
              placeholder="e.g., CS, MATH, ENG"
              returnKeyType="next"
              accessibilityLabel="Course subject input"
            />
            <Text style={styles.helperText}>
              A short subject code for your course
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Course Identifier (optional)</Text>
            <TextInput
              style={styles.input}
              value={courseIdentifier}
              onChangeText={setCourseIdentifier}
              placeholder="e.g., 101, 2A, IX"
              returnKeyType="done"
              accessibilityLabel="Course identifier input"
            />
            <Text style={styles.helperText}>
              A number or code that identifies this course
            </Text>
          </View>
        </View>

        <View style={styles.noteContainer}>
          <Ionicons name="information-circle" size={20} color="#0066cc" />
          <Text style={styles.noteText}>
            After creating a course, you can add topics and concepts, then create sections for specific classes.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
            disabled={isLoading}
            accessibilityLabel="Cancel button"
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button, 
              styles.submitButton,
              (isLoading || isSubmitButtonDisabled) && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={isLoading || isSubmitButtonDisabled}
            accessibilityLabel="Create course button"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Course</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  // For iOS, wrap in SafeAreaView
  if (Platform.OS === 'ios') {
    return (
      <SafeAreaView style={styles.safeArea}>
        {renderContent()}
      </SafeAreaView>
    );
  }

  // For other platforms, return content directly
  return renderContent();
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32, // Extra padding at bottom
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: Platform.OS === 'android' ? 8 : 0,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#005824",
  },
  closeButton: {
    padding: 8,
  },
  errorText: {
    color: "#ff4d4d",
    marginBottom: 10,
    fontSize: 16,
  },
  formSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  helperText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f2ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  noteText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: "#005824",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: "#7fad97", // Lighter green when disabled
    opacity: 0.8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#005824",
    textAlign: "center",
  },
  modalScrollView: {
    flexGrow: 1, // Use flexGrow instead of maxHeight
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedModalItem: {
    backgroundColor: "#e6f7ef",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  itemSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  noItemsText: {
    padding: 16,
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
  },
  modalCloseButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default CreateCourseForm;