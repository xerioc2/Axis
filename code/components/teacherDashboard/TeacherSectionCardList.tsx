import React, { useCallback } from "react";
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  Platform,
  ListRenderItem 
} from "react-native";
import type { SectionPreviewDto, User } from "../../../App";
import { styles } from "./TeacherDashboardStyle";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/navigation.types";

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
  
  // Handle section card press with useCallback to prevent rerenders
  const handleSectionPress = useCallback((section: SectionPreviewDto) => {
    navigation.navigate("TeacherSectionDetails", {
      user: teacher,
      sectionPreview: section,
    });
  }, [navigation, teacher]);

  // Handle empty state
  if (!sectionPreviews || sectionPreviews.length === 0) {
    return (
      <View style={styles.emptyStateContainer} accessibilityRole="text">
        <Text style={styles.emptyStateText}>
          No sections found. Create a section using the menu button below.
        </Text>
      </View>
    );
  }

  const renderSectionItem: ListRenderItem<SectionPreviewDto> = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleSectionPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`Section ${item.course_name} ${item.section_identifier}`}
    >
      <View style={styles.card}>
        <Image
          source={require("../../assets/images/filler_card_img.png")}
          style={styles.cardImage}
          accessibilityRole="image"
          accessibilityLabel="Section thumbnail"
        />
        <View style={styles.cardContent}>
          <Text style={styles.courseTitle} numberOfLines={2}>
            {item.course_subject} {item.course_identifier}-
            {item.section_identifier} {item.course_name}
          </Text>
          <Text style={styles.courseCode}>
            {item.season} {item.year}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={sectionPreviews}
      keyExtractor={(section) => section.section_id.toString()}
      renderItem={renderSectionItem}
      initialNumToRender={10}
      removeClippedSubviews={Platform.OS !== 'web'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ 
        paddingBottom: 20,
        flexGrow: sectionPreviews.length === 0 ? 1 : undefined
      }}
    />
  );
};

export default TeacherSectionCardList;