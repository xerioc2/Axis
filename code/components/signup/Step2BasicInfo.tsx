import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { BasicInfo } from '../signup/StepManager';
import StepTitle from './StepTitle';
import BasicInfoForm from './BasicInfoForm';


/*
Step2BasicInfo is responsible for collecting the users basic info
and using it to update the state of StepManager
*/

type Step2Props = {
    setBasicInfo: (basicInfo: BasicInfo) => void;
}


const Step2BasicInfo: React.FC<Step2Props> = ({ setBasicInfo }) => {

    const basicInfoBase: BasicInfo = {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    }

    const [userBasicInfo, setUserBasicInfo] = useState(basicInfoBase);


    return (
        <View>
            <StepTitle title="Basic Information" />
            <BasicInfoForm />
        </View>
    )
}



export default Step2BasicInfo;