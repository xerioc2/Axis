import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import type { User, Section } from '../../App';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../utils/navigation.types';
import { getSectionsByTeacherId } from '../utils/supabaseService';
import ErrorMessage from '../components/ErrorMessage';

type TeacherDashboardRouteProp = RouteProp<RootStackParamList, 'TeacherDashboard'>;

const TeacherDashboard: React.FC = () => {
    const route = useRoute<TeacherDashboardRouteProp>();
    const teacher = route.params;

    const [sections, setSections] = useState<Section[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    //onMount hook to fetch data 
    useEffect(() => {
        const fetchTeacherData = async (teacher: User) => {
            let sectionData: Section[] | null = await getSectionsByTeacherId(teacher.user_id);
            if (!sectionData){
                setErrorMessage("Unable to fetch your sections... try closing the app and trying again.");
                sectionData = [];
            }
            setSections(sectionData);

            //pull the rest of the teachers data
        }
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