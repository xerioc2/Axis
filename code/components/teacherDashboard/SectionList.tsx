import { View, StyleSheet } from 'react-native';
import type { Section } from '../../../App';
import { Colors } from 'react-native/Libraries/NewAppScreen';

type SectionListProps = {
    sections: Section[]
}

const SectionList: React.FC<SectionListProps> = ({ sections }) => {
    
    

    return (
        <>
            <View style={styles.sectionListContainer}>
                
            </View>
        </>
    )

};


const styles = StyleSheet.create({
    sectionListContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: 3,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        margin: 0,
        borderColor: Colors.grey,
        borderWidth: 2
    }
})