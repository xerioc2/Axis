// StudentSectionCardList.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import type { SectionPreviewDto, User } from '../../../App';
import { useFonts } from 'expo-font';
import { styles } from "./StudentDashboardStyle";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/code/utils/navigation.types';
import { disenrollStudent } from '../../service/supabaseService';

type SectionCardListProps = {
  sectionPreviews: SectionPreviewDto[];
  student: User;
  setSectionPreviews: React.Dispatch<React.SetStateAction<SectionPreviewDto[]>>;
};

const StudentSectionCardList: React.FC<SectionCardListProps> = ({ sectionPreviews, student, setSectionPreviews }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [fontsLoaded] = useFonts({ 'SF Pro': require('../../assets/fonts/sf_pro.ttf') });
  const [disenrollModalVisible, setDisenrollModalVisible] = useState(false);
  const [pendingSectionId, setPendingSectionId] = useState<number | null>(null);

  const handleConfirmDisenroll = async () => {
    if (pendingSectionId === null) return;
    const success = await disenrollStudent(student.user_id, pendingSectionId);
    if (success) {
      setSectionPreviews(prev => prev.filter(section => section.section_id !== pendingSectionId));
      Alert.alert('Success', 'You have been disenrolled.');
    } else {
      Alert.alert('Error', 'Failed to disenroll. Please try again.');
    }
    setDisenrollModalVisible(false);
    setPendingSectionId(null);
  };

  return (
    <>
      <ScrollView>
        {sectionPreviews.map((item) => (
          <View key={item.section_id} style={styles.card}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("StudentSectionDetails", {
                  user: student,
                  sectionPreview: item,
                })
              }
            >
              <Image
                source={require("../../assets/images/filler_card_img.png")}
                style={styles.cardImage}
              />
              <Text style={styles.courseTitle}>{item.course_name}</Text>
              <Text style={styles.courseCode}>
                {item.course_subject} {item.course_identifier} - {item.section_identifier}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setPendingSectionId(item.section_id);
                setDisenrollModalVisible(true);
              }}
              style={{ marginTop: 10 }}
            >
              <Text style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>
                Disenroll
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal transparent visible={disenrollModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Disenrollment</Text>
            <Text style={styles.modalText}>Are you sure you want to disenroll?</Text>

            <TouchableOpacity style={styles.modalButton} onPress={handleConfirmDisenroll}>
              <Text style={styles.modalButtonText}>Yes, Disenroll</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "gray" }]}
              onPress={() => {
                setDisenrollModalVisible(false);
                setPendingSectionId(null);
              }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default StudentSectionCardList;
