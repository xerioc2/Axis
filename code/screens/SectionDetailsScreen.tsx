import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../utils/navigation.types';
import { User } from '../../App';
import { View, Text, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';

type SectionDetailsRouteProp = RouteProp<RootStackParamList, 'SectionDetails'>;

const SectionDetailsScreen: React.FC = () => {
    const route = useRoute<SectionDetailsRouteProp>();
    const sectionPreview = route.params;
    
    const [students, setStudents] = useState<User[]>([]);
    const [teachers, setTeachers] = useState<User[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    //onMount, pull the teachers and students of this section
    useEffect(() => {
        const fetchStudents = () => {
            const potentialStudents: User[] | null = getStudentsBySectionId(sectionPreview.section_id);
            if (!potentialStudents){
                console.log("Error fetching students for section id ", sectionPreview.section_id);
                setErrorMessage("Error fetching the students for this section, please try again. If the error persists, contact us.");
            }
            else{
                const actualStudents: User[] = potentialStudents;
                setStudents(potentialStudents);
            }
        }
        const fetchTeachers = () => {
            const potentialTeachers: User[] | null = getTeachersBySectionId(sectionPreview.section_id);
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
                <Text>Enrolled Students:</Text>

            </View>
        {errorMessage !== "" && <ErrorMessage message={errorMessage}/>}
        </View>
    </>
}

export default SectionDetailsScreen;