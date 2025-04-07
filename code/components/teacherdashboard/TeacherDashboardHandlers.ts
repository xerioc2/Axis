import { Animated, Alert } from 'react-native';
import { Dispatch, SetStateAction } from 'react';
import * as ImagePicker from 'expo-image-picker';

// Define the Course interface (optional: can import this if shared)
export interface Course {
  id: number;
  name: string;
  season: string;
  year: number;
  code: number;
  image: string;
  section: number;
  subject: string;
}

// Function to open the modal with slide-up animation
export const openModal = (
  setModalVisible: Dispatch<SetStateAction<boolean>>,
  slideAnim: Animated.Value
) => {
  setModalVisible(true);
  Animated.timing(slideAnim, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  }).start();
};

// Function to close the modal with slide-down animation
export const closeModal = (
  setModalVisible: Dispatch<SetStateAction<boolean>>,
  slideAnim: Animated.Value
) => {
  Animated.timing(slideAnim, {
    toValue: 500,
    duration: 300,
    useNativeDriver: true,
  }).start(() => setModalVisible(false));
};

// Function to handle adding a new course
export const handleAddCourse = (
  courses: Course[],
  newCourse: Course,
  setCourses: Dispatch<SetStateAction<Course[]>>,
  setNewCourse: Dispatch<SetStateAction<Course>>,
  setIsAddingCourse: Dispatch<SetStateAction<boolean>>,
  closeModalCallback: () => void
) => {
  setCourses([...courses, newCourse]);
  setNewCourse({
    id: 0,
    name: '',
    season: '',
    year: new Date().getFullYear(),
    code: 0,
    image: '',
    section: 0,
    subject: '',
  });
  setIsAddingCourse(false);
  closeModalCallback();
};

const pickImage = async (): Promise<string | null> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission is required to access your photos.');
      return null;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],      
      quality: 1,
    });
  
    if (!result.canceled) {
      return result.assets[0].uri;
    }
    return null;
  };
  
  export const handlePickImage = async (
    setImageUri: Dispatch<SetStateAction<string | null>>,
    setNewCourse: Dispatch<SetStateAction<Course>>
  ): Promise<void> => {
    const uri = await pickImage();
    if (uri) {
      setImageUri(uri);
      setNewCourse((prev) => ({ ...prev, image: uri }));
    }
  };