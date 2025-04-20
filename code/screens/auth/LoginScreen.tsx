import React, { useState, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../utils/navigation.types';
import type { User } from "@/App";
import ErrorMessage from '../../components/ErrorMessage';
import { login } from '../../service/supabaseService';
import { useFonts } from 'expo-font';
import { Colors } from '../../theme';
import ForgotPasswordModal from '../auth/ForgotPasswordModal';




type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [buttonEnabled, setButtonEnabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [fontsLoaded] = useFonts({
        'Rexton Bold': require('../../assets/fonts/rexton_bold.otf'),
        'Inter': require('../../assets/fonts/antonio_semibold.ttf'),
        'SF Pro': require('../../assets/fonts/sf_pro.ttf'),
    });
    const [resetEmail, setResetEmail] = useState('');
    const [showResetModal, setShowResetModal] = useState(false);



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
            <View>
                <Image 
                    source={require('../../assets/images/axis_lettering.png')}
                    style={styles.logo}
                />
                <Image
                    source={require('../../assets/images/graph_line.png')}
                    style={styles.graphLine}
                />
                <Text style={styles.slogan}>WHERE LEARNING{"\n"}MEETS MASTERY</Text>

                <View style={styles.emailInput}>
                    <TextInput 
                        style={styles.textInput}
                        placeholder='Email'
                        value={formData.email}
                        onChangeText={(text) => handleChange("email", text)}
                        placeholderTextColor={Colors.textInput}
                        autoCapitalize='none'
                    />
                </View>

                <View style={styles.passwordInput}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Password"
                        value={formData.password}
                        onChangeText={(text) => handleChange("password", text)}
                        secureTextEntry
                        placeholderTextColor={Colors.textInput}
                    />
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLoginSubmission}
                    disabled={!buttonEnabled}
                >
                    <Text style={styles.buttonText}>SIGN IN</Text>
                </TouchableOpacity>

                <Text style={[styles.text, {fontSize: 12, fontWeight: '600'}]}>DON'T HAVE AN ACCOUNT?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                    <Text
                        style={[styles.text, {marginTop: -1, color: Colors.primary, fontSize: 16, fontWeight: '600'}]}
                    >
                        Sign Up
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowResetModal(true)} style={{ alignSelf: 'center', marginBottom: 10 }}>
  <Text style={{ color: Colors.primary, fontWeight: '600' }}>Forgot Password?</Text>
</TouchableOpacity>

            </View>
            {errorMessage !== "" && <ErrorMessage message={errorMessage} />}
        </View>
        <ForgotPasswordModal
  visible={showResetModal}
  onClose={() => setShowResetModal(false)}
/>

    </>
    );      
};
export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    logo: {
        alignSelf: 'center',
        marginTop: 67
    },
    slogan: {
        color: Colors.primary,
        textAlign: 'center',
        fontFamily: 'Rexton Bold',
        fontSize: 12,
        lineHeight: 22,
        marginTop: -30
    },
    button: {
        backgroundColor: Colors.secondary,
        alignSelf: 'center',
        width: 255,
        height: 43,
        borderRadius: 30,
        marginTop: 5
    },
    buttonText: {
        color: Colors.white,
        fontFamily: 'Inter',
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 22,
        padding: 10
    },
    emailInput: {
        marginTop: 65,
        marginHorizontal: 40,
        marginBottom: 10,
    },
    passwordInput: {
        marginTop: 20,
        marginHorizontal: 40,
        marginBottom: 20
    },
    textInput: {
        color: Colors.black,
        borderBottomColor: Colors.bottomBorder,
        fontFamily: 'Inter',
        fontSize: 16,
        borderBottomWidth: 1,
        paddingVertical: 10
    },
    graphLine: {
        position: 'absolute',
        left: -45,
        top: 395,
        width: 485,
        height: 485,
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    text: {
        color: Colors.grey,
        textAlign: 'center',
        fontFamily: 'SF Pro',
        lineHeight: 22
    }
});

