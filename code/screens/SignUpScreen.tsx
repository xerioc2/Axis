import React, { useState } from 'react';
import { View,Text, ImageBackground, StyleSheet } from 'react-native';
import Step1RoleSelection from '../components/signup/Step1RoleSelection';



const SignUpScreen: React.FC = () => {
    const [userRole, setUserRole] = useState<'Student' | 'Teacher' | null>(null);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/images/background.jpg')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.logoContainer}>

                </View>
                <Step1RoleSelection setUserRole={setUserRole} />
                {userRole && <Text>Selected User Type: {userRole}</Text>}
            </ImageBackground>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F5E9',
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
      },
    logoContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 30, 
    },
    stepContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingTop: 120,
    }

})

export default SignUpScreen;