import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from './code/screens/auth/SignUpScreen';
import LoginScreen from './code/screens/auth/LoginScreen';
import TeacherDashboard from './code/screens/teacher/TeacherDashboard';
import StudentDashboard from './code/screens/student/StudentDashboard';
import TeacherSectionDetailsScreen from './code/screens/teacher/TeacherSectionDetailsScreen';
import StudentSectionDetailsScreen from './code/screens/student/StudentSectionDetailsScreen';
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
        <Stack.Screen name="TeacherSectionDetails" component={TeacherSectionDetailsScreen} options={{ headerShown: false}} />
        <Stack.Screen name="StudentSectionDetails" component={StudentSectionDetailsScreen} options={{ headerShown: false}} />

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
export type StudentDto = {
  user_id: string,
  first_name: string,
  last_name: string,
  email: string,
  school_name: string,
}
export type TeacherDto = {
  user_id: string,
  first_name: string,
  last_name: string,
  email: string,
  school_name: string,
}

export type School = {
  school_id: number,
  school_name: string,
  city: string,
  state: string,
  school_type_id: number
}

export type Course = {
  course_id: number,
  course_subject: string | null,
  course_identifier: string | null,
  course_name: string,
  creator_id: string,
  school_id: number,
  date_created: string
}
export type CourseInsertDto = {
  course_subject: string | null,
  course_identifier: string | null,
  course_name: string,
  creator_id: string,
  school_id: number
}


export type Section = {
  section_id: number,
  section_identifier: string,
  enrollment_code: string,
  semester_id: number,
  course_id: number,
  date_created: string,
  start_date: string
}
export type SectionInsertDto = {
  section_identifier: string,
  semester_id: number,
  course_id: number,
  start_date: string
  //insert start date as '2024-01-01'
}

export type SectionTeacher = {
  section_teacher_id: number,
  teacher_id: string,
  section_id: number,
}
export type SectionTeacherInsertDto = {
  teacher_id: string,
  section_id: number
}

export type Topic = {
  topic_id: number,
  topic_title: string,
  topic_description: string | null,
  course_id: number
}
export type TopicInsertDto = {
  topic_title: string,
  topic_description: string | null,
  course_id: number
}

export type Concept = {
  concept_id: number,
  concept_title: string,
  concept_description: string | null,
  topic_id: number
}
export type ConceptInsertDto = {
  concept_title: string,
  concept_description: string | null,
  topic_id: number
}

export type Semester = {
  semester_id: number,
  season: string,
  year: number
}

export type Enrollment = {
  enrollment_id: number,
  date_enrolled: string,
  date_disenrolled: string,
  student_id: string,
  section_id: number
}

export type Point = {
  point_id: number,
  is_test_point: boolean,
  section_id: number,
  concept_id: number
}
export type StudentPoint = {
  student_point_id: number,
  date_status_last_updated: string | null,
  student_id: string,
  point_id: number,
  point_status_id: number
}
export type PointStatus = {
  point_status_id: number,
  point_status_name: string
}
export type StudentPointDto = {
  student_point_id: number,
  point_id: number,
  topic_id: number,
  concept_id: number,
  student_id: string,
  point_status_name: string, //use the status name instead of Id
  date_status_last_updated: string | null
}



/* Start of more complex DTO structures */
/*
TeacherData is used to collect all info
for a teacher when they login. 
*/
export type TeacherDataDto = {
  sections: SectionPreviewDto[], //all sections this teacher has taught
  courses_created: Course[], //all courses this teacher has created
}

export type StudentDataDto = {
  sections: SectionPreviewDto[]
}

/*
The SectionPreviewDto is used to pass data to
the SectionCard component in the TeacherDashboard screen
*/
export type SectionPreviewDto = {
  section_id: number,
  section_identifier: string,
  enrollment_code: string,
  season: string,
  year: number,
  course_name: string,
  course_identifier: string | null,
  course_subject: string | null
}

/*
The SectionDetailsDto is used to pass data to 
the SectionDetails screen
*/
export type SectionDetailsDto = {
  section_id: number,
  section_identifier: string,
  enrollment_code: string,
  course_id: number,
  course_subject: string | null,
  course_name: string,
  course_identifier: string | null,
  teachers: TeacherDto[],
  enrolled_students: StudentDto[]
}

export type StudentGradesDto = {
  student: StudentDto,
  section: SectionPreviewDto, //contains course_id, semester info
  topics: Topic[],
  concepts: Concept[],
  points: StudentPointDto[] //contains point_id, status_name
}


