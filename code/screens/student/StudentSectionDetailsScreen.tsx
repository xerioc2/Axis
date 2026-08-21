import { useRoute , useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../utils/navigation.types';
import { View, Text, TouchableOpacity , SafeAreaView } from 'react-native';
import StudentGradeView from '../student/StudentGradeView';

import { Ionicons } from '@expo/vector-icons';




type SectionDetailsRouteProp = RouteProp<RootStackParamList, 'StudentSectionDetails'>;

const StudentSectionDetailsScreen: React.FC = () => {
    const route = useRoute<SectionDetailsRouteProp>();
    const navigation = useNavigation(); // <-- move it HERE
    const {user, sectionPreview} = route.params;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F2FFED' }}>
          <View style={{ padding: 16 }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#005824" />
              <Text style={{ fontSize: 16, color: "#005824", marginLeft: 5 }}>Back to Dashboard</Text>
            </TouchableOpacity>
      
            <Text>{sectionPreview.course_subject} {sectionPreview.course_identifier}-{sectionPreview.section_identifier} {sectionPreview.course_name}</Text>
            <Text>{user.first_name} {user.last_name}</Text>
            <Text style={{ fontWeight: 'bold', marginVertical: 10 }}>Your Grades</Text>
      
          </View>
          <StudentGradeView />
        </SafeAreaView>
      );
    }
export default StudentSectionDetailsScreen;
