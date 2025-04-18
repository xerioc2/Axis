import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../utils/navigation.types';
import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';

type SectionDetailsRouteProp = RouteProp<RootStackParamList, 'StudentSectionDetails'>;

const StudentSectionDetailsScreen: React.FC = () => {
    const route = useRoute<SectionDetailsRouteProp>();
    const {user, sectionPreview} = route.params;

    useEffect(() => {
        const fetchGrades = async () => {

        }
        fetchGrades();
    })

    return (
        <>
            <View>
                <View>
                    <Text>{sectionPreview.course_subject} {sectionPreview.course_identifier}-{sectionPreview.section_identifier} {sectionPreview.course_name}</Text>
                    <Text>{user.first_name} {user.last_name}</Text>
                    <Text>Your Grades</Text>
                </View>
            </View>
        </>
    )
}

export default StudentSectionDetailsScreen;