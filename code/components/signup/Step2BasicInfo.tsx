import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { BasicInfo } from '../signup/StepManager';
import StepTitle from './StepTitle';
import BasicInfoForm from './BasicInfoForm';


/*
Step2BasicInfo is responsible for collecting the users basic info
and using it to update the state of StepManager
*/

type Step2Props = {
    setBasicInfo: (basicInfo: BasicInfo) => void;
    setCurrentStep: (currentStep: number) => void;
}


const Step2BasicInfo: React.FC<Step2Props> = ({ setBasicInfo, setCurrentStep }) => {

    const basicInfoBase: BasicInfo = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        schoolType: 'College',
        schoolName: ''
    }

    const [userBasicInfo, setUserBasicInfo] = useState(basicInfoBase);


    return (
        <View>
            <StepTitle title="Basic Information" />
            <BasicInfoForm basicInfo={basicInfoBase} setBasicInfo={setBasicInfo} />
        </View>
    )
}

const styles = StyleSheet.create({
    
})



export default Step2BasicInfo;