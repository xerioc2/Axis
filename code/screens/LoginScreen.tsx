import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import supabase from '../utils/supabase';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../utils/navigation.types';


type LoginScreenProps = {

};

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Login'>;


const LoginScreen: React.FC<LoginScreenProps> = () => {
    const navigation = useNavigation<NavigationProps>();
    const [formData, setFormData] = useState({email: "", password: ""});
    const [buttonEnabled, setButtonEnabled] = useState(false);

    useEffect(() => {
            if (formData.email !== "" && formData.password !== ""){
                setButtonEnabled(true);
            }
        }, [formData]);


    const handleChange = (key: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {

    }

    return <>
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
                    onPress={() => handleSubmit()}    
                >
                    <Text>Login</Text>
                </TouchableOpacity>
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
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 30,
    },
    button: {
        backgroundColor: '#2E7D32',
        padding: 15,
        borderRadius: 25,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
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
        backgroundColor: '#BBB',
        padding: 15,
        borderRadius: 25,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
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
        color: "#2E7D32",
        fontSize: 16,
        fontWeight: "bold",
    }
});

export default LoginScreen;