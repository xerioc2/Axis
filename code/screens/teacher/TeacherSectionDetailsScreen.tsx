import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../utils/navigation.types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { User } from '../../../App';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Modal, Animated } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import ErrorMessage from '../../components/ErrorMessage';
import { getStudentsBySectionId, getTeachersBySectionId } from '../../service/supabaseService';
import { Ionicons } from "@expo/vector-icons";

type SectionDetailsRouteProp = RouteProp<RootStackParamList, 'TeacherSectionDetails'>;

const TeacherSectionDetailsScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<SectionDetailsRouteProp>();
    const { user, sectionPreview } = route.params;
    
    const [students, setStudents] = useState<User[]>([]);
    const [teachers, setTeachers] = useState<User[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    
    const slideAnim = useRef(new Animated.Value(500)).current;

    // Modal animation functions
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
            toValue: 500,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setModalVisible(false));
    };

    // onMount, pull the teachers and students of this section
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [potentialStudents, potentialTeachers] = await Promise.all([
                    getStudentsBySectionId(sectionPreview.section_id),
                    getTeachersBySectionId(sectionPreview.section_id)
                ]);

                if (!potentialStudents) {
                    console.log("Error fetching students for section id ", sectionPreview.section_id);
                    setErrorMessage("Error fetching the students for this section, please try again.");
                } else {
                    setStudents(potentialStudents);
                }

                if (!potentialTeachers) {
                    console.log("Error fetching teachers for section id ", sectionPreview.section_id);
                    setErrorMessage("Error fetching the teachers for this section, please try again.");
                } else {
                    setTeachers(potentialTeachers);
                }
            } catch (error) {
                console.error("Error fetching section details:", error);
                setErrorMessage("An error occurred while loading section details.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Section details modal
    const renderSectionDetailsModal = () => {
        if (!modalVisible) return null;
        
        return (
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="none"
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <Animated.View 
                        style={[
                            styles.modalContainer,
                            { transform: [{ translateY: slideAnim }] }
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Section Details</Text>
                            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color="#555" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.enrollmentCodeContainer}>
                            <Text style={styles.enrollmentCodeLabel}>Enrollment Code:</Text>
                            <Text style={styles.enrollmentCode}>{sectionPreview.enrollment_code}</Text>
                            <Text style={styles.enrollmentCodeHelper}>
                                Share this code with students to join this section
                            </Text>
                        </View>

                        <View style={styles.modalSectionInfo}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Course Name:</Text>
                                <Text style={styles.detailValue}>{sectionPreview.course_name}</Text>
                            </View>
                            
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Course ID:</Text>
                                <Text style={styles.detailValue}>
                                    {sectionPreview.course_subject} {sectionPreview.course_identifier}
                                </Text>
                            </View>
                            
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Section:</Text>
                                <Text style={styles.detailValue}>{sectionPreview.section_identifier}</Text>
                            </View>
                            
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Semester:</Text>
                                <Text style={styles.detailValue}>{sectionPreview.season} {sectionPreview.year}</Text>
                            </View>
                            
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Enrolled Students:</Text>
                                <Text style={styles.detailValue}>{students.length}</Text>
                            </View>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#005824" />
                <Text style={styles.loadingText}>Loading section details...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Content Area */}
            <ScrollView style={styles.content}>
                {/* Back button */}
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#005824" />
                    <Text style={styles.backButtonText}>Back to Dashboard</Text>
                </TouchableOpacity>

                {/* Section Header */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        {sectionPreview.course_name}
                    </Text>
                    <Text style={styles.sectionSubtitle}>
                        {sectionPreview.course_subject} {sectionPreview.course_identifier} - Section {sectionPreview.section_identifier}
                    </Text>
                    <Text style={styles.sectionSemester}>
                        {sectionPreview.season} {sectionPreview.year}
                    </Text>
                </View>

                {/* Teachers Section */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        {teachers.length === 1 ? "Section Teacher" : "Section Teachers"}
                    </Text>
                    
                    {teachers.length === 0 ? (
                        <Text style={styles.emptyMessage}>No teachers found for this section...</Text>
                    ) : (
                        <View style={styles.teachersList}>
                            {teachers.map(teacher => (
                                <View key={teacher.user_id} style={styles.teacherItem}>
                                    <View style={styles.teacherAvatar}>
                                        <Text style={styles.avatarText}>
                                            {`${teacher.first_name.charAt(0)}${teacher.last_name.charAt(0)}`}
                                        </Text>
                                    </View>
                                    <View style={styles.teacherInfo}>
                                        <Text style={styles.teacherName}>
                                            {teacher.first_name} {teacher.last_name}
                                        </Text>
                                        <Text style={styles.teacherEmail}>{teacher.email}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Students Section */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Enrolled Students</Text>
                    
                    {students.length === 0 ? (
                        <Text style={styles.emptyMessage}>No students are enrolled in this section yet...</Text>
                    ) : (
                        <View style={styles.studentsList}>
                            {students.map(student => (
                                <TouchableOpacity
                                    key={student.user_id}
                                    style={styles.studentItem}
                                    onPress={() => navigation.navigate("TeacherGradeView", {
                                        user: user, 
                                        sectionPreview: sectionPreview, 
                                        student: student
                                    })}
                                >
                                    <View style={styles.studentAvatar}>
                                        <Text style={styles.avatarText}>
                                            {`${student.first_name.charAt(0)}${student.last_name.charAt(0)}`}
                                        </Text>
                                    </View>
                                    <View style={styles.studentInfo}>
                                        <Text style={styles.studentName}>
                                            {student.first_name} {student.last_name}
                                        </Text>
                                        <Text style={styles.studentEmail}>{student.email}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#005824" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {errorMessage !== "" && <ErrorMessage message={errorMessage} />}
            </ScrollView>
            
            {/* Section Details Modal */}
            {renderSectionDetailsModal()}

            {/* Footer */}
            <TouchableOpacity style={styles.footer} onPress={openModal}>
                <Text style={styles.footerTitle}>Section Details</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: "#F2FFED",
    },
    content: {
        flex: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#F2FFED",
    },
    loadingText: {
        marginTop: 10,
        color: "#005824",
        fontSize: 16,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    backButtonText: {
        fontSize: 16,
        color: "#005824",
        marginLeft: 5,
    },
    sectionHeader: {
        marginBottom: 20,
    },
    sectionTitle: { 
        fontSize: 24, 
        fontWeight: "bold", 
        color: "#005824", 
        marginBottom: 5,
    },
    sectionSubtitle: {
        fontSize: 16,
        color: "#333",
        marginBottom: 3,
    },
    sectionSemester: {
        fontSize: 14,
        color: "#666",
    },
    card: { 
        backgroundColor: "white", 
        borderRadius: 10, 
        padding: 15, 
        marginBottom: 20, 
        elevation: 3, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    cardTitle: { 
        fontSize: 18, 
        fontWeight: "bold", 
        color: "#005824",
        marginBottom: 15,
    },
    teachersList: {
        marginTop: 5,
    },
    teacherItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    teacherAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#005824',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    teacherInfo: {
        flex: 1,
    },
    teacherName: {
        fontSize: 16,
        fontWeight: '500',
    },
    teacherEmail: {
        fontSize: 14,
        color: '#666',
    },
    studentsList: {
        marginTop: 5,
    },
    studentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    studentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '500',
    },
    studentEmail: {
        fontSize: 14,
        color: '#666',
    },
    emptyMessage: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 10,
    },
    footer: {
        width: '100%',
        height: 60,
        backgroundColor: 'white',
        position: 'relative',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#005824',
    },
    // Modal styles
    modalOverlay: { 
        flex: 1, 
        justifyContent: "flex-end", 
        backgroundColor: "rgba(0,0,0,0.5)" 
    },
    modalContainer: {
        backgroundColor: "white",
        height: "60%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#005824',
    },
    closeButton: {
        padding: 5,
    },
    enrollmentCodeContainer: {
        backgroundColor: '#eef7ea',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    enrollmentCodeLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    enrollmentCode: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#005824',
        letterSpacing: 2,
        marginBottom: 10,
    },
    enrollmentCodeHelper: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    modalSectionInfo: {
        marginTop: 10,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    detailLabel: {
        width: 120,
        fontSize: 15,
        fontWeight: '500',
        color: '#555',
    },
    detailValue: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },
});

export default TeacherSectionDetailsScreen;