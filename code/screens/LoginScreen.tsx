import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import supabase from '../utils/supabase';




const LoginScreen: React.FC = () => {
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
                <TextInput  placeholder='Email' value={formData.email} onChangeText={(text) => handleChange("email", text)} />
                <TextInput  placeholder='Password' value={formData.password} onChangeText={(text) => handleChange("password", text)} />
                <TouchableOpacity 
                    style={buttonEnabled ? styles.button : styles.disabledButton}
                    onPress={() => handleSubmit()}    
                >
                    <Text>Login</Text>
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
    }
});

export default LoginScreen;