import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Animated,
    StyleSheet, 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../components/teacherDashboard/TeacherDashboardStyle"; 
import { getTeacherData } from "../service/supabaseService"; 
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type {
    User,
    Course,
    TeacherDataDto,
    SectionPreviewDto,
} from "../../App";
import {
    useRoute,
    useNavigation,
    RouteProp,
} from "@react-navigation/native";
import type { RootStackParamList } from "../utils/navigation.types";
import ErrorMessage from "../components/ErrorMessage"; 
import TeacherDashboardMenu from "../components/teacherDashboard/TeacherDashboardMenu"; 
import { useFonts } from "expo-font";
import SectionCardList from "../components/teacherDashboard/SectionCardList"; 
import CourseCardList from "../components/teacherDashboard/CourseCardList"; 
import CreateSectionForm from "../components/teacherDashboard/CreateSectionForm";

type TeacherDashboardRouteProp = RouteProp<
    RootStackParamList,
    "TeacherDashboard"
>;
type NavigationProps = NativeStackNavigationProp<
    RootStackParamList,
    "TeacherDashboard"
>;

const TeacherDashboard: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<TeacherDashboardRouteProp>();
    const teacher = route.params;

    const slideAnim = useRef(new Animated.Value(500)).current;

    const [sectionPreviews, setSectionPreviews] = useState<SectionPreviewDto[]>([]);
    const [coursesCreated, setCoursesCreated] = useState<Course[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    // Default to sections view
    const [selectedMenuOption, setSelectedMenuOption] = useState<"sections" | "courses">("sections");
    const [modalVisible, setModalVisible] = useState(false);
    const [creatingSection, setCreatingSection] = useState(false);
    

    useEffect(() => {
        const fetchTeacherData = async (teacher: User) => {
            try { // Add error handling for API calls
                let teacherData: TeacherDataDto = await getTeacherData(teacher.user_id);
                if (!teacherData || (!teacherData.sections?.length && !teacherData.courses_created?.length)) {
                    setErrorMessage(
                        "Get started by creating a course or section using the menu!"
                    );
                    setSectionPreviews([]);
                    setCoursesCreated([]);
                } else {
                    setSectionPreviews(teacherData.sections || []);
                    setCoursesCreated(teacherData.courses_created || []);
                    setErrorMessage(""); // Clear error message on success
                    console.log("Teacher data loaded successfully");
                }
            } catch (error) {
                console.error("Failed to fetch teacher data:", error);
                setErrorMessage("Failed to load dashboard data. Please try again.");
                setSectionPreviews([]);
                setCoursesCreated([]);
            }
        };
        fetchTeacherData(teacher);
    }, [teacher]); // Re-fetch if teacher prop changes

    const openModal = () => {
        setModalVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        Animated.timing(slideAnim, {
            toValue: 300, 
            duration: 300,
            useNativeDriver: true,
        }).start(() => setModalVisible(false));
        setCreatingSection(false);
    };




    return (
        <View style={styles.container}>
            {/* Content Area */}
            <View style={styles.content}>
                <Text style={styles.title}>
                    Welcome, {teacher.first_name}
                </Text>

                {selectedMenuOption === "sections" && (
                    <SectionCardList sectionPreviews={sectionPreviews} />
                )}

                {selectedMenuOption === "courses" && (
                    <CourseCardList courses={coursesCreated} />
                )}

                {/* Show error message within content if applicable */}
                {errorMessage !== "" && !sectionPreviews.length && !coursesCreated.length && (
                    <ErrorMessage message={errorMessage} />
                )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.footerButtonContainer}>
                    {/* Courses Button */}
                    <TouchableOpacity 
                        style={[
                            styles.footerButton, 
                            selectedMenuOption === 'courses' && inlineStyles.selectedFooterButton 
                        ]} 
                        onPress={() => setSelectedMenuOption('courses')}
                    >
                        <Text style={[
                            styles.footerButtonText,
                            selectedMenuOption === 'courses' && inlineStyles.selectedFooterButtonText
                        ]}>
                            Courses
                        </Text>
                    </TouchableOpacity>

                    {/* Sections Button */}
                    <TouchableOpacity 
                        style={[
                            styles.footerButton,
                            selectedMenuOption === 'sections' && inlineStyles.selectedFooterButton
                        ]} 
                        onPress={() => setSelectedMenuOption('sections')}
                    >
                        <Text style={[
                            styles.footerButtonText,
                            selectedMenuOption === 'sections' && inlineStyles.selectedFooterButtonText
                        ]}>
                            Sections
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Absolutely Positioned Edit Button - Renders on top */}
                <TouchableOpacity style={styles.editButton} onPress={openModal}>
                    <Ionicons name="add" size={32} color="white" /> 
                </TouchableOpacity>
            </View>

            {/* Modal for adding sections or courses */}
            {modalVisible && (
                <Modal transparent animationType="none" visible={modalVisible}>
                    {/* Ensure TeacherDashboardMenu receives necessary props */}
                    <TeacherDashboardMenu closeModal={closeModal} slideAnim={slideAnim} setCreatingSection={setCreatingSection} />
                </Modal>
            )}

            {creatingSection && (
                <CreateSectionForm />
            )}

        </View>
    );
};

// Inline styles for selected
const inlineStyles = StyleSheet.create({
    selectedFooterButton: {
        borderBottomWidth: 3,
        borderBottomColor: '#005824' 
    },
    selectedFooterButtonText: {
        color: '#005824', // Highlight color for selected text
        fontWeight: 'bold',
    }
});

export default TeacherDashboard;