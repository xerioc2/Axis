import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import type { User, Course, TeacherDataDto, SectionPreviewDto } from '../../App';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../utils/navigation.types';
import { getTeacherData } from '../service/supabaseService';
import ErrorMessage from '../components/ErrorMessage';
import SectionCard from '../components/teacherDashboard/SectionCard';


type TeacherDashboardRouteProp = RouteProp<RootStackParamList, 'TeacherDashboard'>;

const TeacherDashboard: React.FC = () => {
    const route = useRoute<TeacherDashboardRouteProp>();
    const teacher = route.params;

    const [sections, setSections] = useState<SectionPreviewDto[]>([]);
    const [coursesCreated, setCoursesCreated] = useState<Course[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    //onMount hook to fetch data 
    useEffect(() => {
        const fetchTeacherData = async (teacher: User) => {
            let teacherData: TeacherDataDto = await getTeacherData(teacher.user_id);
            if (!teacherData){
                setErrorMessage("Uh oh... looks like you may not have taught any sections yet. When teaching a section, it will be displayed here.");
                return;
            }
            setSections(teacherData.sections);
            setCoursesCreated(teacherData.courses_created);
            console.log("Teacher data loaded successfully");
            
            //now we actually want to organize sections by semester, 
            //and show only the ones for the current semester at the top
        }
        setErrorMessage("");
        fetchTeacherData(teacher);
    }, []);


    return (
        <>
            <Text>TEACHER DASHBOARD</Text>
            {sections.length > 0 && (
                <View>
                    {sections.map((section) => (
                        <SectionCard key={section.section_id} section={section} />
                    ))}
                </View>
            )}
            {coursesCreated.length > 0 &&
                <View style={[{marginTop:20}]}>
                    {coursesCreated.length > 0 && (
                        <View>
                            <Text>Courses You've Created</Text>
                            {coursesCreated.map((course) => (
                                <Text key={course.course_id}>{course.course_subject} {course.course_identifier} {course.course_name}</Text>
                            ))}
                        </View>
                    )}
                </View>
            }
            {errorMessage !== "" && <ErrorMessage message={errorMessage}/>}
        </>
    )
}


export default TeacherDashboard;