import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { SectionPreviewDto, User } from "../../../App";
import type { RootStackParamList } from "../../utils/navigation.types";

type SectionCardProps = {
  section: SectionPreviewDto;
  teacher: User;
};

const SectionCard: React.FC<SectionCardProps> = ({ section, teacher }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate("TeacherSectionDetails", {
      user: teacher,
      sectionPreview: section,
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image
        source={require("../../assets/images/filler_card_img.png")}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.courseIdentifier}>
          {section.course_subject} {section.course_identifier}-{section.section_identifier}
        </Text>
        <Text style={styles.courseName} numberOfLines={2}>
          {section.course_name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    width: 280,
    height: 180,
    elevation: 3,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 2,
    shadowRadius: 5.3,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardContent: {
    padding: 10,
  },
  courseIdentifier: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  courseName: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
    color: "#005824",
  },
});

export default SectionCard;