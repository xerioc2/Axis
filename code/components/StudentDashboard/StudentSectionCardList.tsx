import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import type { SectionPreviewDto, User } from '../../../App';
import { useFonts } from 'expo-font';
import { styles } from "./StudentDashboardStyle";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/code/utils/navigation.types';

type SectionCardListProps = {
    sectionPreviews: SectionPreviewDto[];
    student: User;
}


const StudentSectionCardList: React.FC<SectionCardListProps> = ({ sectionPreviews, student }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [fontsLoaded] = useFonts({
        'SF Pro': require('../../assets/fonts/sf_pro.ttf'),
    });

    return (
        <FlatList
            data={sectionPreviews}
            keyExtractor={(section) => section.section_id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => navigation.navigate("StudentSectionDetails", {user: student, sectionPreview: item})}
                >
                    <View style={styles.card}>
                        <Image
                            source={require('../../assets/images/filler_card_img.png')}
                            style={styles.cardImage}
                        />
                        <Text style={styles.courseTitle}>{item.course_name}</Text>
                        <Text style={styles.courseCode}>
                            {item.course_subject} {item.course_identifier} - {item.section_identifier}
                        </Text>
                    </View>
                </TouchableOpacity>
            )}
        />
    );
};

export default StudentSectionCardList;
