import { View, Text, Image, FlatList } from 'react-native';
import type { SectionPreviewDto } from '../../../App';
import { useFonts } from 'expo-font';
import { styles } from "./StudentDashboardStyle";

type SectionCardListProps = {
    sectionPreviews: SectionPreviewDto[]
}

const SectionCardList: React.FC<SectionCardListProps> = ({ sectionPreviews }) => {
    const [fontsLoaded] = useFonts({
        'SF Pro': require('../../assets/fonts/sf_pro.ttf'),
    });

    return (
        <FlatList
            data={sectionPreviews}
            keyExtractor={(section) => section.section_id.toString()}
            renderItem={({ item }) => (
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
            )}
        />
    );
};

export default SectionCardList;
