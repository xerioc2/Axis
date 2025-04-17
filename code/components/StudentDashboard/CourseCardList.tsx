import { View, Text, Image, FlatList } from 'react-native';
import type { Course } from '../../../App';
import { useFonts } from 'expo-font';
import { styles } from "./StudentDashboardStyle";


type CourseCardListProps = {
    courses: Course[]
}

const CourseCardList: React.FC<CourseCardListProps> = ({ courses }) => {

    return (
        <>
        <FlatList
          data={courses}
          keyExtractor={(course) => course.course_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.courseTitle}>{item.course_name}</Text>
              <Text style={styles.courseCode}>
                {item.course_subject} {item.course_identifier}
              </Text>
              <Text>Date Created: {item.date_created}</Text>
            </View>
          )}
        />
        </>
    )
}
export default CourseCardList;