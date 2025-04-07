import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardTypeOptions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../components/teacherdashboard/TeacherDashboardStyle";
import {
  openModal as openModalHandler,
  closeModal as closeModalHandler,
  handleAddCourse as handleAddCourseHandler,
  handlePickImage,
  Course,
} from "../components/teacherdashboard/TeacherDashboardHandlers";

const TeacherDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 123,
      name: "Math 101",
      season: "Spring",
      year: 2025,
      code: 1234,
      image: "https://via.placeholder.com/100",
      section: 3,
      subject: "Mathematics",
    },
    {
      id: 124,
      name: "Science 201",
      season: "Spring",
      year: 2025,
      code: 5678,
      image: "https://via.placeholder.com/100",
      section: 3,
      subject: "Science",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState<Course>({
    id: 0,
    name: "",
    season: "",
    year: new Date().getFullYear(),
    code: 0,
    image: "",
    section: 0,
    subject: "",
  });
  const [imageUri, setImageUri] = useState<string | null>(null);

  const slideAnim = useState(new Animated.Value(500))[0];

  // Handlers imported from TeacherDashboardHandlers.ts
  const openModal = () => openModalHandler(setModalVisible, slideAnim);
  const closeModal = () => closeModalHandler(setModalVisible, slideAnim);
  const handleAddCourse = () =>
    handleAddCourseHandler(
      courses,
      newCourse,
      setCourses,
      setNewCourse,
      setIsAddingCourse,
      closeModal
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teacher Dashboard</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.courseTitle}>{item.name}</Text>
            <Text style={styles.courseCode}>{item.code}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.editButton} onPress={openModal}>
        <Ionicons name="ellipsis-vertical" size={32} color="white" />
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} animationType="none">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContainer,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
              >
                <ScrollView
                  contentContainerStyle={{ paddingBottom: 100 }}
                  keyboardShouldPersistTaps="handled"
                >
                  {!isAddingCourse ? (
                    <>
                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => setIsAddingCourse(true)}
                      >
                        <Text style={styles.modalButtonText}>Add Course</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.modalButton}>
                        <Text style={styles.modalButtonText}>
                          Delete Course
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.modalButton}>
                        <Text style={styles.modalButtonText}>
                          Modify Course
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                        onPress={closeModal}
                      >
                        <Text style={styles.modalButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={styles.formContainer}>
                      <Text style={styles.formTitle}>Add New Course</Text>
                      {[
                        { label: "ID", key: "id", type: "numeric" },
                        { label: "Name", key: "name", type: "default" },
                        { label: "Season", key: "season", type: "default" },
                        { label: "Year", key: "year", type: "numeric" },
                        { label: "Code", key: "code", type: "numeric" },
                        // The image field is now handled via the image picker button
                        { label: "Section", key: "section", type: "numeric" },
                        { label: "Subject", key: "subject", type: "default" },
                      ].map((field) => (
                        <TextInput
                          key={field.key}
                          placeholder={field.label}
                          keyboardType={field.type as KeyboardTypeOptions}
                          style={styles.input}
                          onChangeText={(text) =>
                            setNewCourse((prev) => ({
                              ...prev,
                              [field.key]:
                                field.type === "numeric"
                                  ? Number(text)
                                  : text,
                            }))
                          }
                        />
                      ))}
                      <TouchableOpacity
                        style={styles.imagePickerButton}
                        onPress={() =>
                          handlePickImage(setImageUri, setNewCourse)
                        }
                      >
                        <Text style={styles.modalButtonText}>
                          {imageUri ? "Change Image" : "Pick an Image"}
                        </Text>
                      </TouchableOpacity>
                      {imageUri && (
                        <Image
                          source={{ uri: imageUri }}
                          style={{
                            width: "100%",
                            height: 200,
                            resizeMode: "cover",
                            borderRadius: 10,
                            marginVertical: 10,
                          }}
                        />
                      )}
                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={handleAddCourse}
                      >
                        <Text style={styles.modalButtonText}>Submit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                        onPress={() => {
                          setIsAddingCourse(false);
                          closeModal();
                        }}
                      >
                        <Text style={styles.modalButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  <View style={{ height: 120 }} />
                </ScrollView>
              </KeyboardAvoidingView>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default TeacherDashboard;