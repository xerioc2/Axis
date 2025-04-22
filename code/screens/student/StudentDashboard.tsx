import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Modal
} from "react-native";
import { styles } from "../../components/StudentDashboard/StudentDashboardStyle"; 
import { getStudentData, enrollInSection } from "../../service/supabaseService"; 
import type {
    User,
    StudentDataDto,
    SectionPreviewDto,
} from "../../../App";
import {
    useRoute,
    RouteProp,
    useNavigation
} from "@react-navigation/native";
import ErrorMessage from "../../components/ErrorMessage"; 
import StudentSectionCardList from "../../components/StudentDashboard/StudentSectionCardList";
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../utils/navigation.types';



type StudentDashboardRouteProp = RouteProp<
    RootStackParamList,
    "StudentDashboard"
>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'StudentDashboard'>;
const StudentDashboard: React.FC = () => {
    const route = useRoute<StudentDashboardRouteProp>();
    const navigation = useNavigation<NavigationProps>();
    const student = route.params;

    const [sectionPreviews, setSectionPreviews] = useState<SectionPreviewDto[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinCode, setJoinCode] = useState('');

    const joinSectionByCode = async (code: string) => {
        const potentialSectionPreview: SectionPreviewDto | null | undefined = await enrollInSection(code.trim().toUpperCase(), student.user_id);
        if (potentialSectionPreview === undefined) {
            setErrorMessage("That enrollment code is not associated with any sections... please double check the code and try again.");
            return;
        } else if (!potentialSectionPreview) {
            setErrorMessage("There was an error enrolling you in that course. Please try again.");
            return;
        }
        setSectionPreviews(prev => [...prev, potentialSectionPreview]);
    };

    useEffect(() => {
        const fetchStudentData = async (student: User) => {
            setErrorMessage("");
            try {
                const potentialStudentData: StudentDataDto | null = await getStudentData(student.user_id);
                if (!potentialStudentData) {
                    setErrorMessage("There was an error fetching your data. Please try again.");
                    setSectionPreviews([]);
                    return;
                }
                setSectionPreviews(potentialStudentData.sections);
            } catch (error) {
                setErrorMessage("Failed to load dashboard data. Please try again.");
                setSectionPreviews([]);
            }
        };
        fetchStudentData(student);
    }, [student]);

    return (
        <View style={styles.container}>
{!showJoinModal && (
  <TouchableOpacity
    onPress={() => navigation.navigate('Profile', { user: student })}
    style={{
      position: 'absolute',
      top: 20,
      right: 20,
      zIndex: 10,
      padding: 10,
    }}
  >
    <Ionicons name="person-circle-outline" size={28} color="#005824" />
  </TouchableOpacity>
)}


            <View style={styles.content}>
                <Text style={styles.title}>Welcome, {student.first_name}</Text>
                <StudentSectionCardList sectionPreviews={sectionPreviews} student={student} />
                {errorMessage !== "" && !sectionPreviews.length && (
                    <ErrorMessage message={errorMessage} />
                )}
            </View>

            <TouchableOpacity
                style={styles.floatingJoinButton}
                onPress={() => setShowJoinModal(true)}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>

            <Modal transparent animationType="fade" visible={showJoinModal}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.formTitle}>Join Section by Code</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter enrollment code"
                            value={joinCode}
                            onChangeText={setJoinCode}
                        />
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={async () => {
                                await joinSectionByCode(joinCode);
                                setShowJoinModal(false);
                            }}
                        >
                            <Text style={styles.modalButtonText}>Join</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                            onPress={() => setShowJoinModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.footer} />
        </View>
    );
};

export default StudentDashboard;