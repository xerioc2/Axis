import { View, Text, StyleSheet, Image } from 'react-native';
import type { SectionPreviewDto } from '../../../App';
import { Colors } from '../../theme'; 
import { useFonts } from 'expo-font';

type SectionCardProps = {
    section: SectionPreviewDto
}

const SectionCard: React.FC<SectionCardProps> = ({ section }) => {
    const [fontsLoaded] = useFonts({
        'SF Pro': require('../../assets/fonts/sf_pro.ttf'),
    });


    return (
        <>
            <View style={styles.container}>
                <Image source={require('../../assets/images/filler_card_img.png')}style={styles.cardImage}></Image>
               <Text style={styles.cardText}>{section.course_subject} {section.course_identifier}-{section.section_identifier} {section.course_name}</Text> 
            </View>
        </>
    )
};
export default SectionCard;

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
        alignItems: "center",
        width: 299,
        height: 152,
        backgroundColor: Colors.white,
        borderRadius: 15,
        margin: 15,

        // Drop shadow
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5.3,

        elevation: 4, // Needed for android
    },
    cardText: {
        color: Colors.black,
        fontFamily: "SF Pro",
        fontSize: 13,
        fontWeight: "600",
        lineHeight: 16.25,
        letterSpacing: 0.26,
    },
    cardImage: {
        width: 262,
        height: 95,
        margin: 16,
        borderRadius: 15,
    }
});

