import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import { fileMap } from '../../utils/fileMap';

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

  useEffect(() => {
    const loadSchools = async () => {
      const key = `${selectedState}_${selectedSchoolType}`;
      const filePath = fileMap[key];

      if (!filePath) {
        console.warn(`No file found for key ${key}`);
        setSchoolOptions([]);
        return;
      }

      try {
        setLoading(true);
        const asset = Asset.fromModule(fileMap[key]); 
        await asset.downloadAsync();
        const text = await FileSystem.readAsStringAsync(asset.localUri!);
        const parsed = Papa.parse(text, { header: true });

        const names = parsed.data.map((row: any) => row.NAME).filter(Boolean);
        setSchoolOptions(names);
      } catch (err) {
        console.error('Error loading school data:', err);
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
