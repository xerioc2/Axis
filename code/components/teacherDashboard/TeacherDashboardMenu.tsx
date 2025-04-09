import React, { SetStateAction, useRef } from 'react';
import { styles } from "./TeacherDashboardStyle";
import { View, Text, TouchableOpacity, Modal, Animated,
  KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard} from "react-native";


type TeacherDashboardMenuProps = {
  closeModal: () => void;
}

const TeacherDashboardMenu: React.FC<TeacherDashboardMenuProps> = ({closeModal}) => {
    
  const slideAnim = useRef(new Animated.Value(500)).current;

    return <>
        <View>
            <Modal transparent visible={true} animationType="none">
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
                        
                      <>
                          <TouchableOpacity
                              style={styles.modalButton}
                              
                          >
                              <Text style={styles.modalButtonText}>Add Section</Text>
                          </TouchableOpacity>
      
                          <TouchableOpacity
                              style={styles.modalButton}
                          
                          >
                              <Text style={styles.modalButtonText}>Add Course</Text>
                          </TouchableOpacity>
      
                          <TouchableOpacity 
                              style={styles.modalButton}
      
                          >
                              <Text style={styles.modalButtonText}> Delete Course</Text>
                          </TouchableOpacity>
      
                          <TouchableOpacity
                          style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                          onPress={() => closeModal()}
                          >
                          <Text style={styles.modalButtonText}>Cancel</Text>
                          </TouchableOpacity>
                      </>
                        <View style={{ height: 200 }} />
                      </ScrollView>
                    </KeyboardAvoidingView>
                  </Animated.View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
      </>

}
export default TeacherDashboardMenu;