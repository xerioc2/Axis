import { View, Text, StyleSheet } from 'react-native';
import type { Section } from '../../../App';
import { Colors } from '../../theme'; 

type SectionCardProps = {
    section: Section
}

const SectionCard: React.FC<SectionCardProps> = ({ section }) => {


    return (
        <>
            <View style={styles.sectionCardContainer}>
               <Text></Text> 
            </View>
        </>
    )
};
export default SectionCard;

const styles = StyleSheet.create({
    sectionCardContainer: {
        borderColor: Colors.grey
    }
})

