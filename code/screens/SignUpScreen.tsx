import React, { useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity,  StyleSheet } from 'react-native';
import  SignUpManager from '../components/signup/SignUpManager';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../utils/navigation.types";
import supabase from '../utils/supabase';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, "SignUp">;

type SignUpScreenProps = {
    navigation: SignUpScreenNavigationProp;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {



    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/axis-bg.png')} style={styles.backgroundImage} resizeMode="cover">
   
                <SignUpManager />
                <View style={styles.loginContainer}>
    <TouchableOpacity 
        style={styles.loginButton} 
        onPress={() => navigation.navigate("Login")}
    >
        <Text style={styles.loginText}>Already have an account?</Text>
        <Text style={styles.link}>Login instead</Text>
    </TouchableOpacity>
</View>
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
        marginTop: 0,
        paddingVertical: 0
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
      },
      link: {
        textDecorationLine: 'underline'
      },
      loginContainer: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        alignItems: 'center',
    },
    loginButton: {
        alignItems: 'center',
        padding: 10,
    },
    loginText: {
        fontSize: 16,
        marginBottom: 5,
    } 

})

export default SignUpScreen;