import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
import type { User, Course, TeacherDataDto, SectionDto } from '../../App';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../utils/navigation.types';
import { getTeacherData } from '../service/supabaseService';
{/*import ErrorMessage from '../components/ErrorMessage';*/}
import SectionCard from '../components/teacherDashboard/SectionCard';
import { useFonts } from 'expo-font';
import { Colors } from '../theme';


type TeacherDashboardRouteProp = RouteProp<RootStackParamList, 'TeacherDashboard'>;

const TeacherDashboard: React.FC = () => {
    const route = useRoute<TeacherDashboardRouteProp>();
    const teacher = route.params;

    const [sections, setSections] = useState<SectionDto[]>([]);
    const [coursesCreated, setCoursesCreated] = useState<Course[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
        const [fontsLoaded] = useFonts({
            'SF Pro': require('../assets/fonts/sf_pro.ttf'),
        });

    //onMount hook to fetch data 
    useEffect(() => {
        const fetchTeacherData = async (teacher: User) => {
            let teacherData: TeacherDataDto | null = await getTeacherData(teacher.user_id);
            if (!teacherData){
                setErrorMessage("Error fetching your data...");
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
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>Teacher Dashboard</Text>
            <Image source={require('../assets/images/icons/account_icon.png')} style={styles.accountIcon} />
            {sections.length > 0 && (
                <View>
                    {sections.map((section) => (
                        <SectionCard key={section.section_id} section={section} />
                    ))}
                </View>
            )}
    
            {/*{errorMessage !== "" && <ErrorMessage message={errorMessage} />}*/}
        </SafeAreaView>
        </>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    titleText: {
        color: Colors.primary,
        fontFamily: "SF Pro",
        textAlign: "center",
        fontSize: 20,
        fontWeight: "600",
        lineHeight: 25,
        letterSpacing: 0.4,
        paddingTop: 20,
        paddingBottom: 25,
    },
    accountIcon: {
        marginLeft: 340,
        marginTop: -52,
      },      
});

export default TeacherDashboard;