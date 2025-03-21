import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';

const StudentDashboard: React.FC = () => {


    return<>      
     <View style={styles.container}>
                    <ImageBackground source={require('../assets/images/axis-bg.png')} style={styles.backgroundImage} resizeMode="cover">
            <Text>Student Dashboard</Text>

            </ImageBackground>
            </View>
        </>
    
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F5E9',
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0,
        paddingVertical: 0
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    }
});

export default StudentDashboard;