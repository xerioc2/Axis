import React, { useState } from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import  StepManager from '../components/signup/StepManager';
import type { UserRole, BasicInfo, SchoolInfo } from '../components/signup/StepManager';


export type NewUser = {
    role: UserRole;
    basicInfo: BasicInfo;
    schoolInfo: SchoolInfo;
}


const SignUpScreen: React.FC = () => {
    let newUserBase: NewUser = {
        role: null,
        basicInfo: {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        },
        schoolInfo: {
            schoolType: 'College',
            schoolName: ''
        }
    }
    const [newUser, setNewUser] = useState<NewUser>(newUserBase);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/images/background.jpg')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <StepManager setNewUser={setNewUser} />
                
                
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

})

export default SignUpScreen;