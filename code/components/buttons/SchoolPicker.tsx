import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform } from "react-native";
import CustomPicker from "./CustomPicker";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import Papa from "papaparse";
import { fileMap } from "../../utils/fileMap";

type SchoolPickerProps = {
  selectedValue: string;
  onValueChange: (value: string) => void;
  selectedState: string;
  selectedSchoolType: string;
};

const SchoolPicker: React.FC<SchoolPickerProps> = ({
  selectedValue,
  onValueChange,
  selectedState,
  selectedSchoolType,
}) => {
  const [schoolOptions, setSchoolOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const normalizeType = (type: string): string => {
      if (type === "High School") return "HS";
      if (type === "Middle School") return "Middle";
      if (type === "College") return "College";
      return "";
    };

    const loadSchools = async () => {
      const key = `${selectedState}_${normalizeType(selectedSchoolType)}`;
      const filePath = fileMap[key];

      if (!filePath) {
        console.warn(`No file found for ${key}`);
        setSchoolOptions([]);
        return;
      }

      try {
        setLoading(true);
        setSchoolOptions([]);

        const asset = Asset.fromModule(filePath);
        await asset.downloadAsync();

        let text: string;
        if (Platform.OS === "web") {
          const response = await fetch(asset.uri);
          text = await response.text();
        } else {
          text = await FileSystem.readAsStringAsync(asset.localUri!);
        }

        const parsed = Papa.parse(text, { header: true });
        const names = (parsed.data || [])
          .map((row: any) => row?.NAME)
          .filter(
            (name): name is string =>
              typeof name === "string" && name.trim().length > 0
          )
          .sort((a, b) => a.localeCompare(b));

        setSchoolOptions([
          { label: "Select a School", value: "" },
          ...names.map((name) => ({ label: name, value: name })),
        ]);
      } catch (err) {
        console.error("Error loading schools:", err);
        setSchoolOptions([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedState && selectedSchoolType) {
      loadSchools();
    }
  }, [selectedState, selectedSchoolType]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <CustomPicker
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      items={schoolOptions}
      placeholder="Select a School"
      placeholderTextColor="#4F4F4F"
    />
  );
};

export default SchoolPicker;
