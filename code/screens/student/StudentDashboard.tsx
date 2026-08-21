import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Modal
, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
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
    const [isJoining, setIsJoining] = useState(false);

    const joinSectionByCode = async (code: string) => {
        if (!code.trim() || isJoining) return;
        setIsJoining(true);
        setErrorMessage("");
        const potentialSectionPreview: SectionPreviewDto | null | undefined = await enrollInSection(code.trim().toUpperCase(), student.user_id);
        if (potentialSectionPreview === undefined) {
            setErrorMessage("That enrollment code is not associated with any sections... please double check the code and try again.");
            setIsJoining(false);
            return;
        } else if (!potentialSectionPreview) {
            setErrorMessage("There was an error enrolling you in that course. Please try again.");
            setIsJoining(false);
            return;
        }
        setSectionPreviews(prev => prev.some(section => section.section_id === potentialSectionPreview.section_id)
          ? prev
          : [...prev, potentialSectionPreview]);
        setJoinCode('');
        setShowJoinModal(false);
        setIsJoining(false);
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
            } catch {
                setErrorMessage("Failed to load dashboard data. Please try again.");
                setSectionPreviews([]);
            }
        };
        fetchStudentData(student);
    }, [student]);


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F2FFED' }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={styles.container}>
                {errorMessage !== "" && <ErrorMessage message={errorMessage} />}
                
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
      
                  <StudentSectionCardList 
                    sectionPreviews={sectionPreviews} 
                    student={student} 
                    setSectionPreviews={setSectionPreviews}
                  />
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
                        autoCapitalize="characters"
                        onSubmitEditing={() => joinSectionByCode(joinCode)}
                      />
                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => joinSectionByCode(joinCode)}
                        disabled={!joinCode.trim() || isJoining}
                      >
                        {isJoining ? <ActivityIndicator color="white" /> : <Text style={styles.modalButtonText}>Join</Text>}
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
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
    }
export default StudentDashboard;
