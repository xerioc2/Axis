import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '../components/headers/StudentHeader';
import Footer from '../components/footer/StudentFooter';

const StudentDashboard: React.FC = () => {


    return<>      
     <View style={styles.container}>
                    <ImageBackground source={require('../assets/images/axis-bg.png')} style={styles.backgroundImage} resizeMode="cover">
            <Text>Student Dashboard</Text>
            
            <TouchableOpacity style={styles.backButton}>
                <Text style={{color: 'white'}}>Back</Text>
            </TouchableOpacity>
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
    },
    backButton: {
        backgroundColor: '#2E7D32',
        padding: 10,
        borderRadius: 25,
        width: "20%",
        alignItems: "center",
    }
});

export default StudentDashboard;