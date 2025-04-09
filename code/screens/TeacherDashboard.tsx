import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import type { User, Course, TeacherDataDto, SectionPreviewDto } from '../../App';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../utils/navigation.types';
import { getTeacherData } from '../service/supabaseService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ErrorMessage from '../components/ErrorMessage';
import SectionCard from '../components/teacherDashboard/SectionCard';
import { useFonts } from 'expo-font';
import { Colors } from '../theme';


type TeacherDashboardRouteProp = RouteProp<RootStackParamList, 'TeacherDashboard'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'TeacherDashboard'>;
const TeacherDashboard: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<TeacherDashboardRouteProp>();
    const teacher = route.params;

    const [sectionPreviews, setSectionPreviews] = useState<SectionPreviewDto[]>([]);
    const [coursesCreated, setCoursesCreated] = useState<Course[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [selectedMenuOption, setSelectedMenuOption] = useState<string>("sections");
    const [fontsLoaded] = useFonts({
        'SF Pro': require('../assets/fonts/sf_pro.ttf'),
    });

    //onMount hook to fetch data 
    useEffect(() => {
        const fetchTeacherData = async (teacher: User) => {
            let teacherData: TeacherDataDto = await getTeacherData(teacher.user_id);
            if (!teacherData){
                setErrorMessage("Uh oh... looks like you may not have taught any sections yet. When teaching a section, it will be displayed here.");
                return;
            }
            setSectionPreviews(teacherData.sections);
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
            {selectedMenuOption === "sections" && sectionPreviews.length > 0 && (
        <SafeAreaView style={styles.container}>
        
            <Text style={styles.titleText}>Teacher Dashboard</Text>
            {sections.length > 0 && (
                <View>
                    {sections.map((section) => (
                        <SectionCard key={section.section_id} section={section} />
                    ))}
                    <Image source={require('../assets/images/icons/account_icon.png')} style={styles.accountIcon} />
                </View>
            )}
            {selectedMenuOption === "courses" && coursesCreated.length > 0 &&
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
        paddingBottom: 30,
    },
    accountIcon: {
        height: 29,
        width: 29,
        marginLeft: 325,
        marginTop: -784,
      },      
});

export default TeacherDashboard;