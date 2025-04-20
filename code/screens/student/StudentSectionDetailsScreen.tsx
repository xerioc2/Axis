import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../utils/navigation.types';
import { View, Text, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import StudentGradeView from '../student/StudentGradeView';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';




type SectionDetailsRouteProp = RouteProp<RootStackParamList, 'StudentSectionDetails'>;

const StudentSectionDetailsScreen: React.FC = () => {
    const route = useRoute<SectionDetailsRouteProp>();
    const navigation = useNavigation(); // <-- move it HERE
    const {user, sectionPreview} = route.params;


    useEffect(() => {
        const fetchGrades = async () => {

        }
        fetchGrades();
    })

    return (
        <>
            <View>
                <View>
                <TouchableOpacity 
  style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
  onPress={() => navigation.goBack()}
>
  <Ionicons name="arrow-back" size={24} color="#005824" />
  <Text style={{ fontSize: 16, color: "#005824", marginLeft: 5 }}>Back to Dashboard</Text>
</TouchableOpacity>

                    <Text>{sectionPreview.course_subject} {sectionPreview.course_identifier}-{sectionPreview.section_identifier} {sectionPreview.course_name}</Text>
                    <Text>{user.first_name} {user.last_name}</Text>
                    <Text>Your Grades</Text>
                    <StudentGradeView />

                </View>
            </View>
        </>
    )
}

export default StudentSectionDetailsScreen;