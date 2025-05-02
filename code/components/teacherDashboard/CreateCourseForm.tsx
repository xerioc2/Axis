// Import statements
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Calendar, DateData } from "react-native-calendars";
import type { 
  SectionInsertDto, 
  Course, 
  SectionTeacherInsertDto,
  Semester
} from "../../../App";
import { 
  createSection, 
  createSectionTeacher, 
  getCoursesByCreatorId, 
  getCoursesByIds,
  getSemesters
} from "../../service/supabaseService";

const CreateCourseForm: React.FC<{
  userId?: string;
  schoolId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}> = ({ userId, schoolId, onSuccess, onCancel }) => {
  // Section state
  const [sectionIdentifier, setSectionIdentifier] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Dynamic data
  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Load courses and semesters
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses created by this user
        if (userId) {
          const coursesData = await getCoursesByCreatorId(userId);
          setCourses(coursesData || []);
        } else {
          // If no userId, fetch all courses
          const coursesData = await getCoursesByIds([]);
          setCourses(coursesData || []);
        }
        
        // Fetch semesters using the service method
        const semestersData = await getSemesters();
        setSemesters(semestersData || []);
        
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError("Failed to load necessary data");
      }
    };
    
    fetchData();
  }, [userId]);

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  // Format date for calendar marking
  const getMarkedDates = () => {
    const formattedDate = formatDate(startDate);
    return {
      [formattedDate]: { selected: true, selectedColor: '#005824' }
    };
  };

  // Get selected course name
  const getSelectedCourseName = () => {
    if (!selectedCourseId) return "Select a course";
    const course = courses.find(c => c.course_id === selectedCourseId);
    if (!course) return "Select a course";
    
    const identifier = course.course_identifier ? `${course.course_identifier} - ` : "";
    return `${identifier}${course.course_name}`;
  };

  // Get selected semester name
  const getSelectedSemesterName = () => {
    if (!selectedSemesterId) return "Select a semester";
    const semester = semesters.find(s => s.semester_id === selectedSemesterId);
    if (!semester) return "Select a semester";
    return `${semester.season} ${semester.year}`;
  };

  // Validate the form
  const validateForm = () => {
    if (!sectionIdentifier.trim()) {
      setError("Section identifier is required");
      return false;
    }
    
    if (!selectedCourseId) {
      setError("Please select a course");
      return false;
    }
    
    if (!selectedSemesterId) {
      setError("Please select a semester");
      return false;
    }
    
    setError("");
    return true;
  };

  // Submit form data
  const handleSubmit = async () => {
    if (!validateForm() || !userId) return;

    setIsLoading(true);
    try {
      // 1. Create Section using the imported function
      const sectionData: SectionInsertDto = {
        section_identifier: sectionIdentifier,
        semester_id: selectedSemesterId!,
        course_id: selectedCourseId!,
        date_created: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
        start_date: formatDate(startDate)
      };

      const sectionResult = await createSection(sectionData);
      if (!sectionResult) {
        throw new Error("Failed to create section");
      }
      
      // 2. Create Section Teacher association using the imported function
      const sectionTeacherData: SectionTeacherInsertDto = {
        teacher_id: userId,
        section_id: sectionResult.section_id
      };

      const sectionTeacherResult = await createSectionTeacher(sectionTeacherData);
      if (!sectionTeacherResult) {
        throw new Error("Failed to create section teacher association");
      }

      Alert.alert(
        "Success", 
        "Section created successfully!"
      );
      
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Error creating section:", err);
      setError(err.message || "Failed to create section");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Create New Section</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Section Details</Text>
          <Text style={styles.sectionSubtitle}>
            A section is an instance of a course for a specific semester
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Section Identifier*</Text>
            <TextInput
              style={styles.input}
              value={sectionIdentifier}
              onChangeText={setSectionIdentifier}
              placeholder="e.g., 03, W1, Period 3, etc..."
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Course*</Text>
            <TouchableOpacity 
              style={styles.pickerButton}
              onPress={() => setShowCourseModal(true)}
            >
              <Text style={styles.pickerButtonText}>
                {getSelectedCourseName()}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Semester*</Text>
            <TouchableOpacity 
              style={styles.pickerButton}
              onPress={() => setShowSemesterModal(true)}
            >
              <Text style={styles.pickerButtonText}>
                {getSelectedSemesterName()}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity 
              style={styles.pickerButton}
              onPress={() => setShowCalendar(!showCalendar)}
            >
              <Text style={styles.pickerButtonText}>
                {formatDate(startDate)}
              </Text>
              <Ionicons name={showCalendar ? "chevron-up" : "calendar"} size={20} color="#666" />
            </TouchableOpacity>
            
            {/* Inline Calendar */}
            {showCalendar && (
              <View style={styles.calendarContainer}>
                <Calendar
                  onDayPress={(day: DateData) => {
                    setStartDate(new Date(day.timestamp));
                    setShowCalendar(false);
                  }}
                  markedDates={getMarkedDates()}
                  theme={{
                    selectedDayBackgroundColor: '#005824',
                    todayTextColor: '#005824',
                    arrowColor: '#005824',
                    textMonthFontWeight: 'bold',
                    textDayFontSize: 14,
                    textMonthFontSize: 16,
                  }}
                />
              </View>
            )}
          </View>
        </View>

        <View style={styles.noteContainer}>
          <Ionicons name="information-circle" size={20} color="#0066cc" />
          <Text style={styles.noteText}>
            Students will be able to join this section with the enrollment code that will be generated.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Section</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Course Selection Modal - New Implementation */}
      <Modal
        visible={showCourseModal}
        transparent={true}
        animationType={Platform.OS === 'ios' ? 'slide' : 'fade'}
        onRequestClose={() => setShowCourseModal(false)}
        statusBarTranslucent={true}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}
          activeOpacity={1}
          onPress={() => setShowCourseModal(false)}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              style={{
                backgroundColor: 'white',
                width: '85%',
                maxHeight: Platform.OS === 'ios' ? '70%' : '80%',
                borderRadius: 10,
                padding: 15,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}
            >
              <Text style={styles.modalTitle}>Select a Course</Text>
              
              <FlatList
                data={courses}
                style={{ maxHeight: 300 }}
                keyExtractor={(item) => item.course_id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      selectedCourseId === item.course_id && styles.selectedModalItem
                    ]}
                    onPress={() => {
                      setSelectedCourseId(item.course_id);
                      setShowCourseModal(false);
                    }}
                  >
                    <Text style={styles.courseItemText}>{item.course_name}</Text>
                    {item.course_identifier && (
                      <Text style={styles.courseIdentifierText}>
                        {item.course_identifier}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.noItemsText}>
                    No courses available. Create a course first.
                  </Text>
                }
              />

              <TouchableOpacity
                style={{
                  backgroundColor: '#eee',
                  padding: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  marginTop: 15
                }}
                onPress={() => setShowCourseModal(false)}
              >
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
      
      {/* Semester Selection Modal - New Implementation */}
      <Modal
        visible={showSemesterModal}
        transparent={true}
        animationType={Platform.OS === 'ios' ? 'slide' : 'fade'}
        onRequestClose={() => setShowSemesterModal(false)}
        statusBarTranslucent={true}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}
          activeOpacity={1}
          onPress={() => setShowSemesterModal(false)}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              style={{
                backgroundColor: 'white',
                width: '85%',
                maxHeight: Platform.OS === 'ios' ? '70%' : '80%',
                borderRadius: 10,
                padding: 15,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}
            >
              <Text style={styles.modalTitle}>Select a Semester</Text>
              
              <FlatList
                data={semesters}
                style={{ maxHeight: 300 }}
                keyExtractor={(item) => item.semester_id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      selectedSemesterId === item.semester_id && styles.selectedModalItem
                    ]}
                    onPress={() => {
                      setSelectedSemesterId(item.semester_id);
                      setShowSemesterModal(false);
                    }}
                  >
                    <Text style={styles.semesterItemText}>
                      {item.season} {item.year}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.noItemsText}>
                    No semesters available.
                  </Text>
                }
              />

              <TouchableOpacity
                style={{
                  backgroundColor: '#eee',
                  padding: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  marginTop: 15
                }}
                onPress={() => setShowSemesterModal(false)}
              >
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fafafa",
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#333",
  },
  calendarContainer: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: "#ddd",
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#005824",
    textAlign: "center",
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedModalItem: {
    backgroundColor: "#e6f7ef",
  },
  courseItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  courseIdentifierText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  semesterItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
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