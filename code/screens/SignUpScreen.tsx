import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import  StepManager from '../components/signup/StepManager';
import type { UserRole, BasicInfo } from '../components/signup/StepManager';

/*
The SignUpScreen is responsible for filling in data about a NewUser.
It displays the BackgroundImage and uses a StepManager to gather the data in 3 steps.
It has the newUser as its state, and it passes the setNewUser function to the StepManager as a prop,
so that StepManager can update the SignUpScreen's state when the User completes a step.
When the 3 steps are complete, the newUser object has all the data it needs. 
Uses Supabase client to send the newUser object to Supabase,
Supabase sends an email to the user to confirm their email address,
when they click the link, they'll be redirected to their Dashboard
*/

//declaring the type of NewUser. UserRole, BasicInfo, and SchoolInfo are each defined
//  in the StepManager. We export this type because
//  the StepManager needs it to update the newUser state  
export type NewUser = {
    role: UserRole;
    basicInfo: BasicInfo;
}

//creating the SignUpScreen component. 
//This component takes no props
//This component has a newUser state
//This component has StepManager as a child component
const SignUpScreen: React.FC = () => {

    //setting the state of the component and initializing the value to newUserBase
    const [newUser, setNewUser] = useState<NewUser>({
        role: null,
        basicInfo: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            schoolType: 'College',
            schoolName: ''
        },
    });

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/axis-bg.png')} style={styles.backgroundImage} resizeMode="cover">
                <StepManager newUser={newUser} setNewUser={setNewUser} />
            </ImageBackground>
            <Text>TEST: The users role is: {newUser.role}</Text>
            <Text>TEST: The users first name is: {newUser.basicInfo.firstName}</Text>
            <Text>TEST: The users last name is: {newUser.basicInfo.lastName}</Text>
            <Text>TEST: The users email name is: {newUser.basicInfo.email}</Text>
            <Text>TEST: The users password name is: {newUser.basicInfo.password}</Text>
            <Text>TEST: The users schoolType name is: {newUser.basicInfo.schoolType}</Text>
            <Text>TEST: The users schoolName is: {newUser.basicInfo.schoolName}</Text>
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