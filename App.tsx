import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from './code/screens/SignUpScreen';
import LoginScreen from './code/screens/LoginScreen';
import TeacherDashboard from './code/screens/TeacherDashboard';
import StudentDashboard from './code/screens/StudentDashboard';
import type { RootStackParamList } from './code/utils/navigation.types';

/*
{} are used to import NAMED exports. the name inside brackets must match the name of export variable
 No {} are used when importing a DEFAULT export, so it can be named whatever you want.
*/

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />       
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} options={{ headerShown: false}} />
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} options={{ headerShown: false}} />
        

      </Stack.Navigator>
    </NavigationContainer>
  );
}


/* Entity/DTO type definitions */
export type User = {
  user_id: string,
  first_name: string,
  last_name: string,
  email: string,
  school_id: number,
  user_type_id: number
}
export type Course = {
  course_id: number,
  course_subject: string | null,
  course_code: number | null,
  course_name: string | null,
  creator_id: string,
  school_id: number,
  date_created: string
}
export type CourseInsertDto = {
  course_subject: string | null,
  course_code: number | null,
  course_name: string | null,
  creator_id: string,
  school_id: number
}

export type Section = {
  section_id: number,
  section_number: number,
  enrollment_code: string,
  semester_id: number,
  course_id: number,
  date_created: string,
  start_date: string
}
export type SectionInsertDto = {
  section_number: number,
  enrollment_code: string,
  semester_id: number,
  course_id: number,
  start_date: string
  //insert start date as '2024-01-01'
}

