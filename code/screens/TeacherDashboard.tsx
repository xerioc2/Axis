import React, { useState, useRef } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, Modal, Animated,
    KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../components/teacherDashboard/TeacherDashboardStyle";
import { getTeacherData } from "../service/supabaseService";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { User, Course, TeacherDataDto, SectionPreviewDto } from '../../App';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from "../utils/navigation.types";
import ErrorMessage from "../components/ErrorMessage";
import TeacherDashboardMenu from "../components/teacherDashboard/TeacherDashboardMenu";


type TeacherDashboardRouteProp = RouteProp<RootStackParamList, 'TeacherDashboard'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'TeacherDashboard'>;

const TeacherDashboard: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<TeacherDashboardRouteProp>();
    const teacher = route.params;

    const slideAnim = useRef(new Animated.Value(500)).current;
  
    
    const [modalVisible, setModalVisible] = useState(false);


    const openModal = () => {
        setModalVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }
    const closeModal = () => {
        Animated.timing(slideAnim, {
            toValue: 500,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setModalVisible(false));
    }



  return (
    <View  style={styles.container}>
      <Text style={styles.title}>Welcome to your dashboard, {teacher.first_name}</Text>

      {/* This will have sectionPreviewDtos not courses */}
      <FlatList
        data={courses} 
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.courseTitle}>{item.name}</Text>
            <Text style={styles.courseCode}>{item.code}</Text>
          </View>
        )}
      />


      {/*Footer*/}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.editButton} onPress={openModal}>
          <Ionicons name="ellipsis-vertical" size={32} color="white" />
        </TouchableOpacity>
      </View>

        {modalVisible && <TeacherDashboardMenu closeModal={closeModal} />}

      
    </View>
  );
};

export default TeacherDashboard;