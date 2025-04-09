import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../utils/navigation.types';
import { User } from '../../App';
import { View, Text, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import { getStudentsBySectionId, getTeachersBySectionId } from '../service/supabaseService';

type SectionDetailsRouteProp = RouteProp<RootStackParamList, 'SectionDetails'>;

const SectionDetailsScreen: React.FC = () => {
    const route = useRoute<SectionDetailsRouteProp>();
    const sectionPreview = route.params;
    
    const [students, setStudents] = useState<User[]>([]);
    const [teachers, setTeachers] = useState<User[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    //onMount, pull the teachers and students of this section
    useEffect(() => {
        const fetchStudents = async () => {
            const potentialStudents: User[] | null = await getStudentsBySectionId(sectionPreview.section_id);
            if (!potentialStudents){
                console.log("Error fetching students for section id ", sectionPreview.section_id);
                setErrorMessage("Error fetching the students for this section, please try again. If the error persists, contact us.");
            }
            else{
                const actualStudents: User[] = potentialStudents;
                setStudents(actualStudents);
            }
        }
        const fetchTeachers = async () => {
            const potentialTeachers: User[] | null = await getTeachersBySectionId(sectionPreview.section_id);
            if (!potentialTeachers){
                console.log("Error fetching teachers for section id ", sectionPreview.section_id);
                setErrorMessage("Error fetching the teachers for this section, please try again. If the error persists, contact us.");
            }
            else{
                const actualTeachers: User[] = potentialTeachers;
                setTeachers(actualTeachers);
            }
        }
        fetchStudents();
        fetchTeachers();
    }, []);


    return <>
        <View>
            <View>
                <Text>{sectionPreview.course_subject} {sectionPreview.course_identifier} {sectionPreview.section_identifier} {sectionPreview.course_name}</Text>
            </View>
            <View>
                {teachers.length === 1 && <Text>Section Teacher</Text>}
                {teachers.length > 1 && <Text>Section Teachers</Text>}
                {teachers.length === 0 && <Text>No teachers found for this section...</Text>}
                {teachers.length > 1 && teachers.map(teacher => (
                    <Text>{teacher.first_name} {teacher.last_name}</Text>
                ))}
            </View>

            <View>
                <Text>Enrolled Students:</Text>
                {students.length === 0 && <Text>No students are enrolled in this section yet...</Text>}
                {students.length > 0 && students.map(student => (
                    <Text>{student.first_name} {student.last_name} - {student.email}</Text>
                ))}
            </View>
        {errorMessage !== "" && <ErrorMessage message={errorMessage}/>}
        </View>
    </>
}

export default SectionDetailsScreen;