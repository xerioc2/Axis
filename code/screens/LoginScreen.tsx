import React, { useState, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import supabase from '../utils/supabase';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../utils/navigation.types';
import { useFonts } from 'expo-font';
import { Colors } from 'react-native/Libraries/NewAppScreen';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [buttonEnabled, setButtonEnabled] = useState(false);
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

    const handleSubmit = () => {
    };

    return (
        <View style={styles.container}>
          <View>
            <Image
              source={require('../assets/images/axis_lettering.png')}
              style={styles.logo}
            />
            <Image
              source={require('../assets/images/graph_line.png')}
              style={styles.graphLine}
            />
            <Text style={styles.slogan}>WHERE LEARNING {"\n"}MEETS MASTERY</Text>
      
            <View style={styles.emailInput}>
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                placeholderTextColor="#4F4F4F"
                autoCapitalize="none"
              />
            </View>
      
            <View style={styles.passwordInput}>
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry
                placeholderTextColor="#4F4F4F"
              />
            </View>
      
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={!buttonEnabled}
            >
              <Text style={styles.buttonText}>SIGN IN</Text>
            </TouchableOpacity>

            <Text style={[styles.text, {marginTop: 285, fontSize: 12, fontWeight: '600'}]}>DONT HAVE AN ACCOUNT?</Text>
            
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text 
              style={[styles.text, {marginTop: -1, color: '#005824', fontSize: 16, fontWeight: '600'}]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      );      
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1FFED',
    },
    logo: {
        alignSelf: 'center',
        marginTop: 67,
    },
    slogan: {
        color: '#005824',
        textAlign: 'center',
        fontFamily: 'Rexton Bold',
        fontSize: 12,
        lineHeight: 22,
        marginTop: -30,
    },
    button: {
        backgroundColor: '#2F7D32',
        alignSelf: 'center',
        width: 255,
        height:43,
        borderRadius: 30,
        marginTop: 5
    },
    buttonText: {
        color: '#FFF',
        fontFamily: 'Inter',
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 22,
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
    }
});

export default LoginScreen;
