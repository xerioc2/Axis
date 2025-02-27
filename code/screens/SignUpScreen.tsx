import React, { useState } from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import  StepManager from '../components/signup/StepManager';
import type { UserRole, BasicInfo, SchoolInfo } from '../components/signup/StepManager';

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
    schoolInfo: SchoolInfo;
}

//creating the SignUpScreen component. 
//This component takes no props
//This component has a newUser state
//This component has StepManager as a child component
const SignUpScreen: React.FC = () => {

    //initializing the base newUser object with no data.
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

    //setting the state of the component and initializing the value to newUserBase
    const [newUser, setNewUser] = useState<NewUser>(newUserBase);


    return (
        <View style={styles.container}>
            <ImageBackground 
                source={require('../assets/images/axis-bg.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <StepManager setNewUser={setNewUser} //passing the function that sets this components state
                                                    //down to the child component.
                />
                
                
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