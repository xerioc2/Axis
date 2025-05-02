import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  StyleSheet,
  Platform,
  BackHandler,
  LogBox,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../components/teacherDashboard/TeacherDashboardStyle";
import { getTeacherData } from "../../service/supabaseService";
import type {
  User,
  Course,
  TeacherDataDto,
  SectionPreviewDto,
} from "../../../App";
import { useRoute, RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../utils/navigation.types";
import ErrorMessage from "../../components/ErrorMessage";
import TeacherDashboardMenu from "../../components/teacherDashboard/TeacherDashboardMenu";
import TeacherSectionCardList from "../../components/teacherDashboard/TeacherSectionCardList";
import CourseCardList from "../../components/teacherDashboard/CourseCardList";
import CreateSectionForm from "../../components/teacherDashboard/CreateSectionForm";
import CreateCourseForm from "../../components/teacherDashboard/CreateCourseForm";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Temporarily ignore the warning during development
// Remove this in production once the root cause is fixed
LogBox.ignoreLogs([
  'Warning: useInsertionEffect must not schedule updates'
]);

type TeacherDashboardRouteProp = RouteProp<
  RootStackParamList,
  "TeacherDashboard"
>;
type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TeacherDashboard"
>;

const TeacherDashboard: React.FC = () => {
  const route = useRoute<TeacherDashboardRouteProp>();
  const teacher = route.params;
  const navigation = useNavigation<NavigationProps>();

  // Animation reference
  const slideAnim = useRef(new Animated.Value(500)).current;

  // State for teacher data
  const [sectionPreviews, setSectionPreviews] = useState<SectionPreviewDto[]>([]);
  const [coursesCreated, setCoursesCreated] = useState<Course[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Default to sections view
  const [selectedMenuOption, setSelectedMenuOption] = useState<"sections" | "courses">("sections");
  
  // Modal states - using separate states for clarity
  const [menuVisible, setMenuVisible] = useState(false);
  const [sectionFormVisible, setSectionFormVisible] = useState(false);
  const [courseFormVisible, setCourseFormVisible] = useState(false);
  
  // Mounted ref to prevent state updates after unmounting
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      // Set mounted flag to false when component unmounts
      isMounted.current = false;
    };
  }, []);

  // Load initial data
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        let teacherData: TeacherDataDto = await getTeacherData(teacher.user_id);
        
        // Check if component is still mounted before updating state
        if (!isMounted.current) return;
        
        if (
          !teacherData ||
          (!teacherData.sections?.length &&
            !teacherData.courses_created?.length)
        ) {
          setErrorMessage(
            "Get started by creating a course or section using the menu!"
          );
          setSectionPreviews([]);
          setCoursesCreated([]);
        } else {
          setSectionPreviews(teacherData.sections || []);
          setCoursesCreated(teacherData.courses_created || []);
          setErrorMessage(""); 
          console.log("Teacher data loaded successfully");
        }
      } catch (error) {
        // Check if component is still mounted before updating state
        if (!isMounted.current) return;
        
        console.error("Failed to fetch teacher data:", error);
        setErrorMessage("Failed to load dashboard data. Please try again.");
        setSectionPreviews([]);
        setCoursesCreated([]);
      }
    };
    
    fetchTeacherData();
  }, [teacher]); // Re-fetch if teacher prop changes

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (menuVisible || sectionFormVisible || courseFormVisible) {
        // Close any open modal
        if (menuVisible) {
          closeMenu();
        } else if (sectionFormVisible) {
          setSectionFormVisible(false);
        } else if (courseFormVisible) {
          setCourseFormVisible(false);
        }
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [menuVisible, sectionFormVisible, courseFormVisible]);

  // Function to refresh data after creating a new course or section
  const refreshData = async () => {
    try {
      const teacherData: TeacherDataDto = await getTeacherData(teacher.user_id);
      
      // Check if component is still mounted before updating state
      if (!isMounted.current) return;
      
      if (teacherData) {
        setSectionPreviews(teacherData.sections || []);
        setCoursesCreated(teacherData.courses_created || []);
        setErrorMessage("");
      }
    } catch (error) {
      // Check if component is still mounted before updating state
      if (!isMounted.current) return;
      
      console.error("Failed to refresh teacher data:", error);
      setErrorMessage(
        "Failed to load updated dashboard data. Please try again."
      );
    }
  };

  // Modal handlers with proper event handler context
  const openMenu = () => {
    // Reset the animation before showing the modal
    slideAnim.setValue(500);
    
    // Make sure other modals are closed first
    setSectionFormVisible(false);
    setCourseFormVisible(false);
    
    // Use a timeout to ensure the state updates don't conflict with rendering
    setTimeout(() => {
      // Check if component is still mounted before updating state
      if (!isMounted.current) return;
      
      setMenuVisible(true);
      
      // Use requestAnimationFrame to ensure the modal is rendered before animation
      requestAnimationFrame(() => {
        if (!isMounted.current) return;
        
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 0);
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Check if component is still mounted before updating state
      if (!isMounted.current) return;
      
      // Only update state after animation completes
      setMenuVisible(false);
    });
  };

  const handleCreateSection = () => {
    // Close menu with animation
    closeMenu();
    
    // Use timeout to ensure animations don't overlap and state changes occur sequentially
    setTimeout(() => {
      // Check if component is still mounted before updating state
      if (!isMounted.current) return;
      
      setSectionFormVisible(true);
    }, 350);
  };

  const handleCreateCourse = () => {
    // Close menu with animation
    closeMenu();
    
    // Use timeout to ensure animations don't overlap and state changes occur sequentially
    setTimeout(() => {
      // Check if component is still mounted before updating state
      if (!isMounted.current) return;
      
      setCourseFormVisible(true);
    }, 350);
  };

  // Handle successful form submission with explicit createdType parameter
  // instead of relying on stale state values
  const handleFormSuccess = async (createdType: "course" | "section") => {
    // Set both form states to false to ensure proper cleanup
    setSectionFormVisible(false);
    setCourseFormVisible(false);
    
    // Refresh data with slight delay to avoid concurrent state updates
    setTimeout(async () => {
      // Check if component is still mounted before continuing
      if (!isMounted.current) return;
      
      await refreshData();
      
      // Check again after async operation
      if (!isMounted.current) return;
      
      // Use the parameter instead of checking potentially stale state
      setSelectedMenuOption(createdType === "course" ? "courses" : "sections");
    }, 100);
  };

  // Handler functions for modal closing
  const handleCancelSection = () => {
    setSectionFormVisible(false);
  };

  const handleCancelCourse = () => {
    setCourseFormVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Profile Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile", { user: teacher })}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 10,
          padding: 10,
        }}
      >
        <Ionicons name="person-circle-outline" size={28} color="#005824" />
      </TouchableOpacity>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Welcome, {teacher.first_name}</Text>

        {selectedMenuOption === "sections" && (
          <TeacherSectionCardList
            sectionPreviews={sectionPreviews}
            teacher={teacher}
          />
        )}

        {selectedMenuOption === "courses" && (
          <CourseCardList courses={coursesCreated} />
        )}

        {/* Show error message within content if applicable */}
        {errorMessage !== "" &&
          !sectionPreviews.length &&
          !coursesCreated.length && <ErrorMessage message={errorMessage} />}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerButtonContainer}>
          {/* Courses Button */}
          <TouchableOpacity
            style={[
              styles.footerButton,
              selectedMenuOption === "courses" &&
                inlineStyles.selectedFooterButton,
            ]}
            onPress={() => setSelectedMenuOption("courses")}
          >
            <Text
              style={[
                styles.footerButtonText,
                selectedMenuOption === "courses" &&
                  inlineStyles.selectedFooterButtonText,
              ]}
            >
              Courses
            </Text>
          </TouchableOpacity>

          {/* Sections Button */}
          <TouchableOpacity
            style={[
              styles.footerButton,
              selectedMenuOption === "sections" &&
                inlineStyles.selectedFooterButton,
            ]}
            onPress={() => setSelectedMenuOption("sections")}
          >
            <Text
              style={[
                styles.footerButtonText,
                selectedMenuOption === "sections" &&
                  inlineStyles.selectedFooterButtonText,
              ]}
            >
              Sections
            </Text>
          </TouchableOpacity>
        </View>

        {/* Add Button */}
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={openMenu}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* Menu Modal - conditionally rendered */}
      {menuVisible ? (
        <Modal 
          transparent
          animationType="none"
          onRequestClose={closeMenu}
        >
          <TeacherDashboardMenu
            closeModal={closeMenu}
            slideAnim={slideAnim}
            setCreatingSection={handleCreateSection}
            setCreatingCourse={handleCreateCourse}
          />
        </Modal>
      ) : null}

      {/* Create Section Modal - conditionally rendered */}
      {sectionFormVisible ? (
        <Modal
          animationType="slide"
          transparent={false}
          onRequestClose={handleCancelSection}
        >
          <CreateSectionForm
            userId={teacher.user_id}
            onSuccess={() => handleFormSuccess("section")}
            onCancel={handleCancelSection}
          />
        </Modal>
      ) : null}

      {/* Create Course Modal - conditionally rendered */}
      {courseFormVisible ? (
        <Modal 
          animationType="slide"
          transparent={false}
          onRequestClose={handleCancelCourse}
        >
          <CreateCourseForm
            userId={teacher.user_id}
            schoolId={teacher.school_id}
            onSuccess={() => handleFormSuccess("course")}
            onCancel={handleCancelCourse}
          />
        </Modal>
      ) : null}
    </View>
  );
};

// Inline styles for selected
const inlineStyles = StyleSheet.create({
  selectedFooterButton: {
    borderBottomWidth: 3,
    borderBottomColor: "#005824",
  },
  selectedFooterButtonText: {
    color: "#005824", // Highlight color for selected text
    fontWeight: "bold",
  },
});

export default TeacherDashboard;