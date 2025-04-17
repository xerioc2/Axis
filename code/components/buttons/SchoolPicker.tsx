import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import { fileMap } from '../../utils/fileMap';
/**
 * SchoolPicker Component
 * ----------------------
 * Dynamically displays a dropdown (Picker) of schools based on the selected U.S. state and school type.
 * 
 * 🏗 Requirements:
 * - Props:
 *   - `selectedValue` (string): The currently selected school name.
 *   - `onValueChange` (function): Callback triggered when a new school is selected.
 *   - `selectedState` (string): The 2-letter state code (e.g., "FL", "TX").
 *   - `selectedSchoolType` (string): The school type label (e.g., "College", "High School", "Middle School").
 *     Must match what's expected by `normalizeType()` inside the component.
 *
 * ⚙️ How It Works:
 * 1. On mount or whenever `selectedState` or `selectedSchoolType` changes:
 *    - It normalizes the type into the expected folder name.
 *    - It builds a key in the format `STATE_TYPE`, like `TX_College`.
 *    - It looks up this key in the auto-generated `fileMap` (see `fileMap.ts`).
 * 
 * 2. If a matching `.txt` file exists:
 *    - The component uses `expo-asset` to resolve the asset and download it.
 *    - The file is then read using `expo-file-system`.
 *    - `papaparse` parses the text into rows with headers.
 *    - It extracts all valid `NAME` fields and alphabetizes them.
 *    - The options are then displayed in a Picker dropdown.
 *
 * 🚫 On Web:
 * - `expo-file-system.readAsStringAsync()` does not work on web platforms.
 * - If you're running this in a web browser, you'll need an alternate data loading strategy.
 *
 * ✅ Notes:
 * - `fileMap.ts` must be kept in sync using `generateFileMap.js`.
 * - School files must be named like `TX_College.txt` and placed in `assets/schoolData/{Type}`.
 */



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
  const [schoolOptions, setSchoolOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  console.log("📦 Props received:", { selectedState, selectedSchoolType });

  useEffect(() => {
    console.log("🚀 Triggering useEffect with:", selectedState, selectedSchoolType);

    const normalizeType = (type: string): string => {
      if (type === "High School") return "HS";
      if (type === "Middle School") return "Middle";
      if (type === "College") return "College";
      return "";
    };

    const loadSchools = async () => {
      const key = `${selectedState}_${normalizeType(selectedSchoolType)}`;
      const filePath = fileMap[key];

      console.log("🔑 fileMap key:", key);
      console.log("📄 filePath:", filePath);

      if (!filePath) {
        console.warn(`🚫 No file found for key ${key}`);
        setSchoolOptions([]);
        return;
      }

      try {
        setLoading(true);
        setSchoolOptions([]);

        const asset = Asset.fromModule(filePath);
        await asset.downloadAsync();
        console.log("✅ Asset downloaded:", asset.localUri ?? asset.uri);

        let text: string;
        if (Platform.OS === 'web') {
          const response = await fetch(asset.uri);
          text = await response.text();
        } else {
          text = await FileSystem.readAsStringAsync(asset.localUri!);
        }

        console.log("📦 First 100 chars of file content:\n", text.substring(0, 100));

        const parsed = Papa.parse(text, { header: true });
        console.log("🧠 Parsed sample row:", parsed.data[0]);

        const names = parsed.data
        .map((row: any) => row.NAME)
        .filter(Boolean)
        .sort((a: string, b: string) => a.localeCompare(b));
      
        console.log("✅ Total school names parsed:", names.length);

        setSchoolOptions(names);
      } catch (err) {
        console.error('💥 Error loading school data:', err);
        setSchoolOptions([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedState && selectedSchoolType) {
      loadSchools();
    }
  }, [selectedState, selectedSchoolType]);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <View>
      <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
        <Picker.Item label="Select a School" value="" />
        {schoolOptions.map((school, index) => (
          <Picker.Item key={index} label={school} value={school} />
        ))}
      </Picker>
    </View>
  );
};

export default SchoolPicker;
