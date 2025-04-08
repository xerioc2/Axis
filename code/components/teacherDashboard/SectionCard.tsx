import { View, Text, StyleSheet } from 'react-native';
import type { SectionPreviewDto } from '../../../App';
import { Colors } from '../../theme'; 

type SectionCardProps = {
    section: SectionPreviewDto
}

const SectionCard: React.FC<SectionCardProps> = ({ section }) => {


    return (
        <>
            <View style={styles.sectionCardContainer}>
               <Text>{section.course_subject} {section.course_identifier}-{section.section_identifier} {section.course_name}</Text> 
            </View>
        </>
    )
};
export default SectionCard;

const styles = StyleSheet.create({
    sectionCardContainer: {
        borderColor: Colors.grey,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },

})

