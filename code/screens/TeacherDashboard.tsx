import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../components/teacherDashboard/TeacherDashboardStyle";
import { getTeacherData } from "../service/supabaseService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type {
  User,
  Course,
  TeacherDataDto,
  SectionPreviewDto,
} from "../../App";
import {
  useRoute,
  useNavigation,
  RouteProp,
} from "@react-navigation/native";
import type { RootStackParamList } from "../utils/navigation.types";
import ErrorMessage from "../components/ErrorMessage";
import TeacherDashboardMenu from "../components/teacherDashboard/TeacherDashboardMenu";
import { useFonts } from "expo-font";

type TeacherDashboardRouteProp = RouteProp<
  RootStackParamList,
  "TeacherDashboard"
>;
type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TeacherDashboard"
>;

const TeacherDashboard: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<TeacherDashboardRouteProp>();
  const teacher = route.params;

  const slideAnim = useRef(new Animated.Value(500)).current;

  const [sectionPreviews, setSectionPreviews] = useState<SectionPreviewDto[]>(
    []
  );
  const [coursesCreated, setCoursesCreated] = useState<Course[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedMenuOption, setSelectedMenuOption] = useState<string>(
    "sections"
  );
  const [modalVisible, setModalVisible] = useState(false);

  const [fontsLoaded] = useFonts({
    "SF Pro": require("../assets/fonts/sf_pro.ttf"),
  });

  useEffect(() => {
    const fetchTeacherData = async (teacher: User) => {
      let teacherData: TeacherDataDto = await getTeacherData(teacher.user_id);
      if (!teacherData) {
        setErrorMessage(
          "Uh oh... looks like you may not have taught any sections yet. When teaching a section, it will be displayed here."
        );
        return;
      }
      setSectionPreviews(teacherData.sections);
      setCoursesCreated(teacherData.courses_created);
      console.log("Teacher data loaded successfully");
    };
    setErrorMessage("");
    fetchTeacherData(teacher);
  }, []);

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome to your dashboard, {teacher.first_name}
      </Text>

      {selectedMenuOption === "sections" && (
        <FlatList
          data={sectionPreviews}
          keyExtractor={(section) => section.section_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.courseTitle}>{item.course_name}</Text>
              <Text style={styles.courseCode}>
                {item.course_subject} {item.course_identifier}{" "}
                {item.section_identifier}
              </Text>
            </View>
          )}
        />
      )}

      {selectedMenuOption === "courses" && (
        <FlatList
          data={coursesCreated}
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
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.editButton} onPress={openModal}>
          <Ionicons name="ellipsis-vertical" size={32} color="white" />
        </TouchableOpacity>
        
      </View>

      {modalVisible && (
        <Modal transparent animationType="none" visible={modalVisible}>
          <TeacherDashboardMenu closeModal={closeModal} slideAnim={slideAnim} />
        </Modal>
      )}

      {errorMessage !== "" && <ErrorMessage message={errorMessage} />}
    </View>
  );
};

export default TeacherDashboard;
