import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import type { User, Section, Course, Semester, TeacherDataDto } from '../../App';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../utils/navigation.types';
import { getTeacherData } from '../utils/supabaseService';
import ErrorMessage from '../components/ErrorMessage';

type TeacherDashboardRouteProp = RouteProp<RootStackParamList, 'TeacherDashboard'>;

const TeacherDashboard: React.FC = () => {
    const route = useRoute<TeacherDashboardRouteProp>();
    const teacher = route.params;

    const [sections, setSections] = useState<Section[]>([]);
    const [coursesTaught, setCoursesTaught] = useState<Course[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [coursesCreated, setCoursesCreated] = useState<Course[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    //onMount hook to fetch data 
    useEffect(() => {
        const fetchTeacherData = async (teacher: User) => {
            let teacherData: TeacherDataDto | null = await getTeacherData(teacher.user_id);
            if (!teacherData){
                setErrorMessage("Error fetching your data...");
                return;
            }
            setSections(teacherData.sections);
            setCoursesTaught(teacherData.courses_taught);
            setSemesters(teacherData.semesters);
            setCoursesCreated(teacherData.courses_created);
            console.log("Teacher data loaded successfully");
        }
        setErrorMessage("");
        fetchTeacherData(teacher);
    }, []);


    return (
        <>
            <Text>TEACHER DASHBOARD</Text>

            {errorMessage !== "" && <ErrorMessage message={errorMessage}/>}
        </>
    )
}


export default TeacherDashboard;