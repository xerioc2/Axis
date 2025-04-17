import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { styles } from "../components/StudentDashboard/StudentDashboardStyle"; 
import { getstudentData } from "../service/supabaseService"; 
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type {
    User,
    Course,
    studentDataDto,
    SectionPreviewDto,
} from "../../App";
import {
    useRoute,
    useNavigation,
    RouteProp,
} from "@react-navigation/native";
import type { RootStackParamList } from "../utils/navigation.types";
import ErrorMessage from "../components/ErrorMessage"; 
import SectionCardList from "../components/StudentDashboard/SectionCardList";
import CourseCardList from "../components/StudentDashboard/CourseCardList";

type StudentDashboardRouteProp = RouteProp<
    RootStackParamList,
    "StudentDashboard"
>;
type NavigationProps = NativeStackNavigationProp<
    RootStackParamList,
    "StudentDashboard"
>;

const StudentDashboard: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<StudentDashboardRouteProp>();
    const Student = route.params;

    const [sectionPreviews, setSectionPreviews] = useState<SectionPreviewDto[]>([]);
    const [coursesCreated, setCoursesCreated] = useState<Course[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [selectedMenuOption, setSelectedMenuOption] = useState<"sections" | "courses">("sections");

    useEffect(() => {
        const fetchStudentData = async (Student: User) => {
            try {
                let StudentData: studentDataDto = await getstudentData(Student.user_id);
                if (!StudentData || (!StudentData.sections?.length && !StudentData.courses_created?.length)) {
                    setErrorMessage(
                        "You are not enrolled in any courses or sections yet. Ask your teacher to invite you!"
                    );
                    setSectionPreviews([]);
                    setCoursesCreated([]);
                } else {
                    setSectionPreviews(StudentData.sections || []);
                    setCoursesCreated(StudentData.courses_created || []);
                    setErrorMessage("");
                    console.log("Student data loaded successfully");
                }
            } catch (error) {
                console.error("Failed to fetch student data:", error);
                setErrorMessage("Failed to load dashboard data. Please try again.");
                setSectionPreviews([]);
                setCoursesCreated([]);
            }
        };
        fetchStudentData(Student);
    }, [Student]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    Welcome, {Student.first_name}
                </Text>

                {selectedMenuOption === "sections" && (
                    <SectionCardList sectionPreviews={sectionPreviews} />
                )}

                {selectedMenuOption === "courses" && (
                    <CourseCardList courses={coursesCreated} />
                )}

                {errorMessage !== "" && !sectionPreviews.length && !coursesCreated.length && (
                    <ErrorMessage message={errorMessage} />
                )}
            </View>

            <View style={styles.footer}>
                <View style={styles.footerButtonContainer}>
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
            </View>
        </View>
    );
};

const inlineStyles = StyleSheet.create({
    selectedFooterButton: {
        borderBottomWidth: 3,
        borderBottomColor: '#005824' 
    },
    selectedFooterButtonText: {
        color: '#005824',
        fontWeight: 'bold',
    }
});

export default StudentDashboard;
