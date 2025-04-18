import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import type { SectionPreviewDto } from '../../../App';
import { useFonts } from 'expo-font';
import { styles } from "./TeacherDashboardStyle";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/code/utils/navigation.types';


type SectionCardListProps = {
    sectionPreviews: SectionPreviewDto[]
}

const SectionCardList: React.FC<SectionCardListProps> = ({ sectionPreviews }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [fontsLoaded] = useFonts({
        'SF Pro': require('../../assets/fonts/sf_pro.ttf'),
    });


    return (
        <>
        <FlatList
                  data={sectionPreviews}
                  keyExtractor={(section) => section.section_id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate("TeacherSectionDetails", item)}
                    >
                        <View style={styles.card}>
                            {/* Need stock image here */}
                            <Image source={require('../../assets/images/filler_card_img.png')} style={styles.cardImage}></Image>
                            <Text style={styles.courseTitle}>{item.course_name}</Text>
                            <Text style={styles.courseCode}>
                                {item.course_subject} {item.course_identifier}{"-"}
                                {item.section_identifier}
                            </Text>
                            <Text style={styles.courseCode}>
                                {item.season} {item.year}
                            </Text>
                        </View>
                    </TouchableOpacity>
                  )}
                />
        </>
    )
};
export default SectionCardList;

