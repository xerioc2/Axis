import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
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
} from "@react-navigation/native";
import type { RootStackParamList } from "../../utils/navigation.types";
import ErrorMessage from "../../components/ErrorMessage"; 
import StudentSectionCardList from "../../components/StudentDashboard/StudentSectionCardList";
import { TextInput } from "react-native";


type StudentDashboardRouteProp = RouteProp<
    RootStackParamList,
    "StudentDashboard"
>;


const StudentDashboard: React.FC = () => {
    const route = useRoute<StudentDashboardRouteProp>();
    const student = route.params;

    const [sectionPreviews, setSectionPreviews] = useState<SectionPreviewDto[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    

    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinCode, setJoinCode] = useState('');

const joinSectionByCode = async (code: string) => {
    console.log(`Trying to join section with code: ${code}`);
    const potentialSectionPreview: SectionPreviewDto | null | undefined = await enrollInSection(code, student.user_id);
    if (potentialSectionPreview === undefined){
        setErrorMessage("That enrollment code is not associated with any sections... please double check the code and try again.");
        return;
    }
    else if (!potentialSectionPreview){
        setErrorMessage("There was an error enrolling you in that course. Please try again.");
        return;
    }
    //otherwise add the sectionPreview to sectionPreviews
    setSectionPreviews(prev => [...prev, potentialSectionPreview]);

};



    useEffect(() => {
        const fetchStudentData = async (student: User) => {
            setErrorMessage("");
            try {
                const potentialStudentData: StudentDataDto | null = await getStudentData(student.user_id);
                if (!potentialStudentData){
                    console.log("Error getting student data");
                    setErrorMessage("There was an error fetching your data. Please try again.");
                    setSectionPreviews([]);
                    return;
                }
                const studentData: StudentDataDto = potentialStudentData;
                setSectionPreviews(studentData.sections);

                

            } catch (error) {
                console.error("Failed to fetch student data:", error);
                setErrorMessage("Failed to load dashboard data. Please try again.");
                setSectionPreviews([]);
            }
        };
        fetchStudentData(student);
    }, [student]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    Welcome, {student.first_name}
                </Text>

                
                <StudentSectionCardList sectionPreviews={sectionPreviews} student={student} />
                
    
    
                {errorMessage !== "" && !sectionPreviews.length && (
                    <ErrorMessage message={errorMessage} />
                )}
            </View>
            {showJoinModal && (
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
                onPress={() => {
                    joinSectionByCode(joinCode);
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
)}


            <TouchableOpacity
                style={styles.floatingJoinButton}
                onPress={() => setShowJoinModal(true)}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
    
            <View style={styles.footer}>
                
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
