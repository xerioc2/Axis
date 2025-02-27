import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type StepTitleProps = {
    title: string
}

const StepTitle: React.FC<StepTitleProps> = ({ title }) => {

    return (
        <View>
            <Text style={styles.stepTitle}>{ title }</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    stepTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 20,
        textAlign: 'center',
    }
})
export default StepTitle;