import React from 'react';
import { View, Text, FlatList, ListRenderItem } from 'react-native';
import type { Course } from '../../../App';
import { Platform } from 'react-native';
import { styles } from "./TeacherDashboardStyle";

type CourseCardListProps = {
  courses: Course[];
}

const CourseCardList: React.FC<CourseCardListProps> = ({ courses }) => {
  // Handle empty state
  if (!courses || courses.length === 0) {
    return (
      <View style={styles.emptyStateContainer} accessibilityRole="text">
        <Text style={styles.emptyStateText}>
          No courses found. Create a course using the menu button below.
        </Text>
      </View>
    );
  }

  const renderCourseItem: ListRenderItem<Course> = ({ item }) => (
    <View 
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`Course ${item.course_name}`}
    >
      <Text style={styles.courseTitle}>{item.course_name}</Text>
      <Text style={styles.courseCode}>
        {item.course_subject} {item.course_identifier}
      </Text>
      <Text>Date Created: {item.date_created}</Text>
    </View>
  );

  return (
    <FlatList
      data={courses}
      keyExtractor={(course) => course.course_id.toString()}
      renderItem={renderCourseItem}
      initialNumToRender={10}
      removeClippedSubviews={Platform.OS !== 'web'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ 
        paddingBottom: 20,
        flexGrow: courses.length === 0 ? 1 : undefined
      }}
    />
  );
};

export default CourseCardList;