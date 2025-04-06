import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, ImageBackground } from 'react-native';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import supabase from '../utils/supabase';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../utils/navigation.types';
import type { User } from "@/App";
import ErrorMessage from '../components/ErrorMessage';
import { login } from '../utils/supabaseService';
import { useFonts } from 'expo-font';
import { Colors } from '../theme';



type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [buttonEnabled, setButtonEnabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [fontsLoaded] = useFonts({
        'Rexton Bold': require('../assets/fonts/rexton_bold.otf'),
        'Inter': require('../assets/fonts/antonio_semibold.ttf'),
        'SF Pro': require('../assets/fonts/sf_pro.ttf'),
    });

    useEffect(() => {
        setButtonEnabled(formData.email !== "" && formData.password !== "");
    }, [formData]);

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleLoginSubmission = async () => {
        
                const user: User | null = await login(formData.email, formData.password);
                
                if (!user){
                    setErrorMessage("Unable to login with those credentials. Double check your info and try again, or sign up instead if you don't have an account.");
                    return;
                }

                //user_types = {1: 'Student', 2: 'Teacher'}
                if (user.user_type_id === 1){
                    navigation.navigate("StudentDashboard", user);
                }
                else if (user.user_type_id === 2){
                    navigation.navigate("TeacherDashboard", user);
                }
                
    }

    return (
    <>
        <View style={styles.container}>
            <ImageBackground source={require('../assets/images/axis-bg.png')} style={styles.backgroundImage} resizeMode="cover">
            <View style={styles.loginForm}>
                <Text style={styles.title}>Login</Text>
                <View style={styles.inputContainer}>
                <TextInput style={styles.input}  placeholder='Email' value={formData.email} onChangeText={(text) => handleChange("email", text)} />
                <TextInput style={styles.input}   placeholder='Password' value={formData.password} onChangeText={(text) => handleChange("password", text)}  secureTextEntry />
                </View>
                {/* Login Button */}
                <TouchableOpacity 
                    style={buttonEnabled ? styles.button : styles.disabledButton}
                    onPress={() => handleLoginSubmission()}    
                >
                    <Text>Login</Text>
                </TouchableOpacity>
                {errorMessage !== "" && <ErrorMessage message={errorMessage} />}
                {/* Sign Up Screen Button */}
                    <TouchableOpacity 
                        style={styles.signUpButton}
                        onPress={() => navigation.navigate("SignUp")} 
                    >
                        <Text style={styles.signUpText}>Sign Up</Text>
                    </TouchableOpacity>
  
            </View>
            </ImageBackground>
            

        </View>
    </>
    );      
};
export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
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
    loginForm: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
    },
    inputContainer: {
        width: "80%",
    },
    input: {
        width: "100%",
        padding: 10,
    },
    emailInput: {
        marginTop: 65,
        marginHorizontal: 40,
        marginBottom: 10,
    },
    passwordInput: {
        marginTop: 20,
        marginHorizontal: 40,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 5,
        backgroundColor: Colors.white,
    },
    title: {
        fontSize: 30,
    },
    textInput: {
        color: '#000',
        borderBottomColor: '#358F4B',
        fontFamily: 'Inter',
        fontSize: 16,
        borderBottomWidth: 1,
        paddingVertical: 10,
    },
    graphLine: {
      position: 'absolute',
      left: -45,
      top: 395,
      width: 485,
      height: 485,
      alignSelf: 'center',
      resizeMode: 'contain',
    },
    text: {
      color: '#808080',
      textAlign: 'center',
      fontFamily: 'SF Pro',
      lineHeight: 22,
    },
    button: {
        backgroundColor: Colors.secondary,
        padding: 15,
        borderRadius: 25,
        width: '80%',
        alignItems: 'center',
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: 15
    },
    disabledButton: {
        backgroundColor: Colors.grey,
        padding: 15,
        borderRadius: 25,
        width: '80%',
        alignItems: 'center',
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: 15
    },
    signUpButton: {
        marginTop: 10,
        padding: 10,
        alignItems: "center",
        width: "100%",
    },
    signUpText: {
        color: Colors.secondary,
        fontSize: 16,
        fontWeight: "bold",
    },
    errorText: {
        color: 'red'
    }
});

