import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import type { SectionPreviewDto, User } from "../../../App";
import SectionCard from "./SectionCard";

type SemesterSectionListProps = {
  semesterTitle: string;
  sections: SectionPreviewDto[];
  teacher: User;
};

const SemesterSectionList: React.FC<SemesterSectionListProps> = ({
  semesterTitle,
  sections,
  teacher,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.semesterTitle}>{semesterTitle}</Text>
      <FlatList
        data={sections}
        horizontal={false}
        numColumns={3}
        key={"grid"}
        keyExtractor={(item) => item.section_id.toString()}
        renderItem={({ item }) => <SectionCard section={item} teacher={teacher} />}
        contentContainerStyle={styles.sectionCardContainer}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: "100%",
  },
  semesterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#005824",
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  sectionCardContainer: {
    paddingHorizontal: 5,
  },
  columnWrapper: {
    justifyContent: "flex-start",
    gap: 15,
    marginBottom: 15,
  },
});

export default SemesterSectionList;