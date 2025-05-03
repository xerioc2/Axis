import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/code/utils/navigation.types';
import { useEffect, useState } from 'react';
import type { GradeViewDto, StudentPointDto } from '../../../App';
import { compileGradeViewData } from '../../service/dataConverterService';
import { updateStudentPoint } from '../../service/supabaseService';
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import supabase from '../../utils/supabase';

type TeacherGradeViewRouteProp = RouteProp<RootStackParamList, 'TeacherGradeView'>;

const TeacherGradeView: React.FC = () => {
    const route = useRoute<TeacherGradeViewRouteProp>();
    const navigation = useNavigation();
    const { user, sectionPreview, student } = route.params;

    const [gradeViewData, setGradeViewData] = useState<GradeViewDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedPointId, setSelectedPointId] = useState<number | null>(null);
    const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    
    // Colors for different point statuses
    const statusColors: { [key: number]: string } = {
        1: '#808080', // Not Attempted - Gray
        2: '#FF6B6B', // Attempted: Failed - Red
        3: '#FFD700', // Attempted: Needs Revisions - Yellow
        4: '#4CAF50'  // Attempted: Passed - Green
    };

    useEffect(() => {
        // Load the grade view data
        const loadGradeViewData = async () => {
            setLoading(true);
            const data: GradeViewDto | null = await compileGradeViewData(user, sectionPreview, student);
            if (!data) {
                console.log("Error loading gradeViewData");
            } else {
                setGradeViewData(data);
            }
            setLoading(false);
        };
        
        loadGradeViewData();
    }, []);
    useEffect(() => {
        const channel = supabase
          .channel('teacher-grade-refresh')
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'student_points',
            filter: `student_id=eq.${student.user_id}`,
          }, async (payload: any) => {
            console.log("📡 Real-time update received:", payload.new);
            const updatedData = await compileGradeViewData(user, sectionPreview, student);
            setGradeViewData(updatedData);
          })
          .subscribe();
      
        return () => {
          supabase.removeChannel(channel);
        };
      }, [student.user_id]);
      
      
    const countStatuses = (): Record<number, number> => {
        const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
      
        if (!gradeViewData) return counts;
      
        for (const concept of gradeViewData.conceptsToPoints) {
          for (const point of concept.points) {
            counts[point.point_status_id] = (counts[point.point_status_id] || 0) + 1;
          }
        }
      
        return counts;
      };
      
      const statusCounts = countStatuses();
      

    // Find points for a given concept
    const getPointsForConcept = (conceptId: number) => {
        if (!gradeViewData) return { checkPoints: [], testPoints: [] };
        
        const conceptPoints = gradeViewData.conceptsToPoints.find(
            item => item.concept.concept_id === conceptId
        );
        
        if (!conceptPoints) return { checkPoints: [], testPoints: [] };
        
        // Separate points into check points and test points
        const checkPoints = conceptPoints.points.filter(point => !point.is_test_point);
        const testPoints = conceptPoints.points.filter(point => point.is_test_point);
        
        return { checkPoints, testPoints };
    };

    // Handle updating a student point status
    const handleStatusChange = async (pointDto: StudentPointDto, newStatusId: number) => {
        // Update locally first for immediate feedback
        if (gradeViewData) {
            const updatedGradeViewData = { ...gradeViewData };
            
            updatedGradeViewData.conceptsToPoints = updatedGradeViewData.conceptsToPoints.map(cp => {
                if (cp.concept.concept_id === pointDto.concept_id) {
                    return {
                        ...cp,
                        points: cp.points.map(p => {
                            if (p.point_id === pointDto.point_id) {
                                // Get status name using switch statement
                                let statusName = "";
                                switch (newStatusId) {
                                    case 1:
                                        statusName = "Not Attempted";
                                        break;
                                    case 2:
                                        statusName = "Attempted: Failed";
                                        break;
                                    case 3:
                                        statusName = "Attempted: Needs Revisions";
                                        break;
                                    case 4:
                                        statusName = "Attempted: Passed";
                                        break;
                                    default:
                                        statusName = "Unknown";
                                }
                                
                                return {
                                    ...p,
                                    point_status_id: newStatusId,
                                    point_status_name: statusName,
                                    date_status_last_updated: new Date().toISOString()
                                };
                            }
                            return p;
                        })
                    };
                }
                return cp;
            });
            
            setGradeViewData(updatedGradeViewData);
        }
        
        // Update in the database
        try {
            await updateStudentPoint(pointDto.student_point_id, newStatusId);
        } catch (error) {
            console.log("Error updating student point:", error);
            // Handle error - maybe show a toast or revert the local change
        }
        
        // Close the picker
        setIsPickerVisible(false);
        setSelectedPointId(null);
    };

    // Render a point box with the appropriate color based on status
    const renderPointBox = (pointDto: StudentPointDto) => {
        let statusColorKey = 0;
        switch (pointDto.point_status_id){
            case 1:
                statusColorKey = 1;
                break;
            case 2:
                statusColorKey = 2;
                break;
            case 3:
                statusColorKey = 3;
                break;
            case 4:
                statusColorKey = 4;
                break;
        }
        const backgroundColor = statusColors[statusColorKey] || '#FFFFFF';

          
        return (
            <TouchableOpacity
                key={pointDto.point_id}
                style={[styles.pointBox, { backgroundColor }]}
                onPress={(event) => {
                    // Get the coordinates of the touch
                    const { pageY, pageX } = event.nativeEvent;
                    setModalPosition({ top: pageY - 120, left: pageX - 100 });
                    setSelectedPointId(pointDto.point_id);
                    setIsPickerVisible(true);
                }}
            />
        );
    };

    // Render the status picker when a point is selected
    const renderStatusPicker = () => {
        if (!isPickerVisible || selectedPointId === null) return null;
        
        // Find the selected point
        let selectedPoint: StudentPointDto | undefined;
        for (const conceptPoint of gradeViewData?.conceptsToPoints || []) {
            selectedPoint = conceptPoint.points.find(p => p.point_id === selectedPointId);
            if (selectedPoint) break;
        }
        
        if (!selectedPoint) return null;
        
        return (
            <Modal
                transparent={true}
                visible={isPickerVisible}
                animationType="fade"
                onRequestClose={() => setIsPickerVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsPickerVisible(false)}
                >
                    <View 
                        style={[
                            styles.modalContent,
                            { top: modalPosition.top, left: modalPosition.left }
                        ]}
                    >
                        <View style={styles.pickerHeader}>
                            <Text style={styles.pickerTitle}>Select Status</Text>
                            <TouchableOpacity 
                                onPress={() => setIsPickerVisible(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.statusOptions}>
                            <TouchableOpacity 
                                style={[styles.statusOption, { backgroundColor: statusColors[1] }]}
                                onPress={() => handleStatusChange(selectedPoint!, 1)}
                            >
                                <Text style={styles.statusText}>Not Attempted</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.statusOption, { backgroundColor: statusColors[2] }]}
                                onPress={() => handleStatusChange(selectedPoint!, 2)}
                            >
                                <Text style={styles.statusText}>Failed</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.statusOption, { backgroundColor: statusColors[3] }]}
                                onPress={() => handleStatusChange(selectedPoint!, 3)}
                            >
                                <Text style={styles.statusText}>Needs Revisions</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.statusOption, { backgroundColor: statusColors[4] }]}
                                onPress={() => handleStatusChange(selectedPoint!, 4)}
                            >
                                <Text style={styles.statusText}>Passed</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#005824" />
                <Text style={styles.loadingText}>Loading grade data...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content}>
                {/* Back button */}
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#005824" />
                    <Text style={styles.backButtonText}>Back to Section</Text>
                </TouchableOpacity>

                <View style={styles.headerContainer}>
                    <View style={styles.sectionInfo}>
                        <Text style={styles.courseTitle}>{sectionPreview.course_name}</Text>
                        <Text style={styles.courseDetails}>
                            {sectionPreview.course_subject} {sectionPreview.course_identifier}-{sectionPreview.section_identifier}
                        </Text>
                        <Text style={styles.semesterInfo}>{sectionPreview.season} {sectionPreview.year}</Text>
                    </View>
                    <View style={styles.studentInfo}>
                        <View style={styles.studentAvatar}>
                            <Text style={styles.avatarText}>
                                {`${student.first_name.charAt(0)}${student.last_name.charAt(0)}`}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.studentName}>
                                {student.first_name} {student.last_name}
                            </Text>
                            <Text style={styles.studentEmail}>{student.email}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.gradesContainer}>
                    <Text style={styles.gradesHeader}>Assessment Points</Text>
                    
                    <View style={styles.columnLabels}>
                        <Text style={styles.conceptLabel}>Concept</Text>
                        <Text style={styles.checkPointsLabel}>Check Points</Text>
                        <Text style={styles.testPointsLabel}>Test Points</Text>
                    </View>
                    
                    {gradeViewData?.topicsToConcepts.map((topicToConcepts, topicIndex) => (
                        <View key={topicIndex} style={styles.topicContainer}>
                            <Text style={styles.topicTitle}>{topicToConcepts.topic.topic_title}</Text>
                            
                            {topicToConcepts.concepts.map((concept) => {
                                const { checkPoints, testPoints } = getPointsForConcept(concept.concept_id);
                                
                                return (
                                    <View key={concept.concept_id} style={styles.conceptRow}>
                                        <Text style={styles.conceptTitle} numberOfLines={2} ellipsizeMode="tail">
                                            {concept.concept_title}
                                        </Text>
                                        
                                        <View style={styles.pointsContainer}>
                                            {/* Check Points */}
                                            <View style={styles.checkPointsContainer}>
                                                {checkPoints.length > 0 ? (
                                                    <View style={styles.pointBoxRow}>
                                                        {checkPoints.map(point => renderPointBox(point))}
                                                    </View>
                                                ) : (
                                                    <Text style={styles.noPointsText}>None</Text>
                                                )}
                                            </View>
                                            
                                            {/* Test Points */}
                                            <View style={styles.testPointsContainer}>
                                                {testPoints.length > 0 ? (
                                                    <View style={styles.pointBoxRow}>
                                                        {testPoints.map(point => renderPointBox(point))}
                                                    </View>
                                                ) : (
                                                    <Text style={styles.noPointsText}>None</Text>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    ))}
                </View>
            </ScrollView>


<View style={styles.summaryContainer}>
  <Text style={styles.summaryText}>✅ Passed: {statusCounts[4]}</Text>
  <Text style={styles.summaryText}>🟡 Needs Revision: {statusCounts[3]}</Text>
  <Text style={styles.summaryText}>❌ Failed: {statusCounts[2]}</Text>
  <Text style={styles.summaryText}>⬜ Not Attempted: {statusCounts[1]}</Text>
</View>

{renderStatusPicker()}

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerTitle}>Student Grades</Text>
            </View>
            </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1,
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
    headerContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    sectionInfo: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        paddingBottom: 15,
    },
    courseTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#005824",
        marginBottom: 5,
    },
    courseDetails: {
        fontSize: 16,
        color: "#555555",
        marginBottom: 3,
    },
    semesterInfo: {
        fontSize: 14,
        color: "#777777",
    },
    studentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
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
    avatarText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '500',
    },
    studentEmail: {
        fontSize: 14,
        color: '#666',
    },
    gradesContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    gradesHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#005824',
        marginBottom: 15,
    },
    columnLabels: {
        flexDirection: 'row',
        paddingBottom: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    conceptLabel: {
        flex: 3,
        fontWeight: 'bold',
        color: '#555',
    },
    checkPointsLabel: {
        flex: 2,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#555',
    },
    testPointsLabel: {
        flex: 2,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#555',
    },
    topicContainer: {
        marginBottom: 20,
    },
    topicTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        backgroundColor: '#EEEEEE',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        color: '#005824',
    },
    conceptRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        alignItems: 'center',
    },
    conceptTitle: {
        flex: 3,
        paddingRight: 8,
        fontSize: 14,
        color: '#333',
    },
    pointsContainer: {
        flex: 4,
        flexDirection: 'row',
    },
    checkPointsContainer: {
        flex: 2,
        justifyContent: 'center',
        paddingRight: 4,
    },
    testPointsContainer: {
        flex: 2,
        justifyContent: 'center',
        paddingLeft: 4,
    },
    pointBoxRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pointBox: {
        width: 18,
        height: 18,
        margin: 2,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#DDDDDD',
    },
    noPointsText: {
        fontSize: 12,
        color: '#AAAAAA',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        position: 'absolute',
        zIndex: 9999,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxHeight: '80%',
        elevation: 10, // Android
      },
      
    modalContent: {
        position: 'absolute',
        width: 200,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    pickerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#005824',
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 18,
        color: '#555555',
        fontWeight: 'bold',
    },
    statusOptions: {
        padding: 8,
    },
    statusOption: {
        padding: 8,
        marginVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
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
    summaryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginVertical: 12,
        gap: 12,
      },
      summaryText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
      },
      
});

export default TeacherGradeView;