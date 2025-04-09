import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';


type TeacherDashboardNavProps = {
    setSelectedMenuOption: React.Dispatch<React.SetStateAction<string>>;
};

const TeacherDashboardNav: React.FC<TeacherDashboardNavProps> = ({setSelectedMenuOption}) => {

    return <>
        <View>
            <TouchableOpacity onPress={() => setSelectedMenuOption("courses")}>
                <Text>Courses</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedMenuOption("sections")}>
                <Text>Sections</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedMenuOption("semesters")}>
                <Text>Semesters</Text>
            </TouchableOpacity>
        </View>
    </>

}
export default TeacherDashboardNav;