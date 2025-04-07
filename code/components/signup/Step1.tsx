import RadioGroup from '../buttons/RadioGroup';
import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, StyleSheet, Image} from 'react-native';
import { useFonts } from 'expo-font';

type Step1Props = {
  setRole: Dispatch<SetStateAction<string>>;
  setIsRoleSelected: Dispatch<SetStateAction<boolean>>;
}

const Step1: React.FC<Step1Props> = ({ setRole, setIsRoleSelected }) => {
  const updateRole = (newRole: string) => {
    setRole(newRole);
    setIsRoleSelected(true);
  };

  const [fontsLoaded] = useFonts({
    'SF Pro': require('../../assets/fonts/sf_pro.ttf'),
  });  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Role</Text>
      <View style={styles.radioContainer}>
        <RadioGroup 
          options={[
            {label: "Student", value: "Student"}, 
            {label: "Teacher", value: "Teacher"}
          ]}  
          initialValue={null} 
          onValueChange={(value) => updateRole(value)} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    marginTop: -25,
    fontFamily: 'SF Pro',
    fontWeight: '700',
    color: '#2F7D32',
    marginBottom: 30,
    fontSize: 28,
  },
  radioContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  
})

export default Step1;