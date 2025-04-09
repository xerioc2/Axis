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
  Alert,
  KeyboardTypeOptions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../components/teacherdashboard/TeacherDashboardStyle";
import {
  openModal as openModalHandler,
  closeModal as closeModalHandler,
  handleAddCourse as handleAddCourseHandler,
  handlePickImage,
  handleDeleteCourse as handleDeleteCourseHandler,
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
      image: "",
      section: 3,
      subject: "Mathematics",
    },
    {
      id: 124,
      name: "Science 201",
      season: "Spring",
      year: 2025,
      code: 5678,
      image: "",
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

  //deleting the courses using the course code (crn)
  const onDeleteCourse = () => {
    Alert.prompt(
      "Delete Course",
      "Enter the Course Code to delete:",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: (code) => {
            const courseCode = Number(code);
            if (isNaN(courseCode)) {
              Alert.alert("Invalid Code", "Please enter a valid numeric course code.");
            } else {
              handleDeleteCourseHandler(courses, setCourses, courseCode);
            }
          },
        },
      ],
      "plain-text"
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teacher Dashboard</Text>

      //list of cards
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

      //footer
      <View style={styles.footer}>

        //opens the modal (edit button)
        <TouchableOpacity style={styles.editButton} onPress={openModal}>
          //Ionicons: library for icons. 
          //name="ellipsis-vertical" is the icon on the button
          <Ionicons name="ellipsis-vertical" size={32} color="white" />
        </TouchableOpacity>
      </View>

      //Modal: slide up thing
      <Modal transparent visible={modalVisible} animationType="none">

      /*
      can move in the modal without it reacting
      the TouchableOpacity tag will be used for the things that need feedback
      /*
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 

          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContainer,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >

              //so that the keyboard doesn't obstruct the modal
              <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
              > 

                //so that you can scroll in the modal
                <ScrollView
                  contentContainerStyle={{ paddingBottom: 100 }}
                  keyboardShouldPersistTaps="handled"
                > 
                  {!isAddingCourse ? (
                    <>

                      //adds course 
                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => setIsAddingCourse(true)}
                      > 
                        <Text style={styles.modalButtonText}>Add Course</Text>
                      </TouchableOpacity>

                      //deletes course
                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={onDeleteCourse}
                      > 
                        <Text style={styles.modalButtonText}>Delete Course</Text>
                      </TouchableOpacity>

                      //modifies course. doesn't have functionality
                      <TouchableOpacity style={styles.modalButton}>
                        <Text style={styles.modalButtonText}>
                          Modify Course
                        </Text>
                      </TouchableOpacity>

                      //closes modal when cancel is pressed
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

                      //handles picking an image
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

                      //shows the image while in the modal
                      {imageUri && (
                        <Image 
                          source={{ uri: imageUri }}
                          style={{
                            width: "100%",
                            height: 100,
                            resizeMode: "cover",
                            borderRadius: 10,
                            marginVertical: 10,
                          }}
                        />
                      )}

                      //submits add course
                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={handleAddCourse}
                      > 
                        <Text style={styles.modalButtonText}>Submit</Text>
                      </TouchableOpacity>

                      //closes modal
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
                  <View style={{ height: 200 }} />

                //so that you can scroll in the modal
                </ScrollView> 

              //so that you can see the modal while typing in the keyboard
              </KeyboardAvoidingView> 
            </Animated.View>
          </View>
          //so that you can type without the modal closing
        </TouchableWithoutFeedback> 
      </Modal>
    </View>
  );
};

export default TeacherDashboard;