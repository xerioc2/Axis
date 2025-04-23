import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import type { SectionPreviewDto, User } from "../../../App";
import { useFonts } from "expo-font";
import { styles } from "./TeacherDashboardStyle";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/code/utils/navigation.types";

type TeacherSectionCardListProps = {
  sectionPreviews: SectionPreviewDto[];
  teacher: User;
};

const TeacherSectionCardList: React.FC<TeacherSectionCardListProps> = ({
  sectionPreviews,
  teacher,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [fontsLoaded] = useFonts({
    "SF Pro": require("../../assets/fonts/sf_pro.ttf"),
  });

  return (
    <>
      <FlatList
        data={sectionPreviews}
        keyExtractor={(section) => section.section_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("TeacherSectionDetails", {
                user: teacher,
                sectionPreview: item,
              })
            }
          >
            <View style={styles.card}>
              <Image
                source={require("../../assets/images/filler_card_img.png")}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.courseTitle}>
                  {item.course_subject} {item.course_identifier}-
                  {item.section_identifier} {item.course_name}
                </Text>
                <Text style={styles.courseCode}>
                  {item.season} {item.year}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </>
  );
};
export default TeacherSectionCardList;
