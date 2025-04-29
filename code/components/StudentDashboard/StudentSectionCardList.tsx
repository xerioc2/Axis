import { View, Text, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import type { SectionPreviewDto, User } from '../../../App';
import { useFonts } from 'expo-font';
import { styles } from "./StudentDashboardStyle";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/code/utils/navigation.types';
import { disenrollStudent } from '../../service/supabaseService'; // ✅ NEW import

type SectionCardListProps = {
    sectionPreviews: SectionPreviewDto[];
    student: User;
    setSectionPreviews: React.Dispatch<React.SetStateAction<SectionPreviewDto[]>>; // ✅ Add this
};

const StudentSectionCardList: React.FC<SectionCardListProps> = ({ sectionPreviews, student, setSectionPreviews }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [fontsLoaded] = useFonts({
        'SF Pro': require('../../assets/fonts/sf_pro.ttf'),
    });

    const handleDisenroll = async (sectionId: number) => {
        try {
          const success = await disenroll(student.user_id, sectionId); // 👈 call the service
          if (success) {
            setSectionPreviews(prev => prev.filter(section => section.section_id !== sectionId));
            alert('You have been disenrolled successfully.');
          } else {
            alert('Failed to disenroll. Please try again.');
          }
        } catch (error) {
          console.error('Error during disenroll:', error);
          alert('An unexpected error occurred.');
        }
      };
      
        };

        if (!confirmed) return;

        const success = await disenrollStudent(student.user_id, sectionId);
        if (success) {
            setSectionPreviews(prev => prev.filter(section => section.section_id !== sectionId));
            Alert.alert('Success', 'You have been disenrolled.');
        } else {
            Alert.alert('Error', 'Failed to disenroll. Please try again.');
        }
    };

    return (
        <FlatList
            data={sectionPreviews}
            keyExtractor={(section) => section.section_id.toString()}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("StudentSectionDetails", { user: student, sectionPreview: item })}
                    >
                        <Image
                            source={require('../../assets/images/filler_card_img.png')}
                            style={styles.cardImage}
                        />
                        <Text style={styles.courseTitle}>{item.course_name}</Text>
                        <Text style={styles.courseCode}>
                            {item.course_subject} {item.course_identifier} - {item.section_identifier}
                        </Text>
                    </TouchableOpacity>

                    {/* ✅ Disenroll button */}
                    <TouchableOpacity
                        onPress={() => handleDisenroll(item.section_id)}
                        style={{ marginTop: 10 }}
                    >
                        <Text style={{ color: 'red', textAlign: 'center' }}>Disenroll</Text>
                    </TouchableOpacity>
                </View>
            )}
        />
    );
};

export default StudentSectionCardList;
