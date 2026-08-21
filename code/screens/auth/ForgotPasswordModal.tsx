import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import supabase from "../../utils/supabase";
import { Colors } from "../../theme";

type ForgotPasswordModalProps = {
  visible: boolean;
  onClose: () => void;
};

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendResetLink = async () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: "myapp://reset-password",
      });

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Success", "Password reset link sent to your email.");
        setEmail("");
        onClose();
      }
    } catch {
      Alert.alert("Error", "Could not send the reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Reset Password</Text>

          <TextInput
            style={[
              styles.input,
            ]}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            placeholderTextColor={Colors.textInput}
          />

          <TouchableOpacity
            style={[styles.button, (!email.trim() || isSubmitting) && styles.disabledButton]}
            onPress={handleSendResetLink}
            disabled={!email.trim() || isSubmitting}
          >
            {isSubmitting ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.buttonText}>Send Reset Link</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: Colors.white,
    padding: 30,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    alignItems: "center",
  },
  title: {
    fontFamily: "Inter",
    fontSize: 18,
    color: Colors.secondary,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: Colors.bottomBorder,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: "Inter",
    fontSize: 14,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  button: {
    backgroundColor: Colors.secondary,
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.grey,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ForgotPasswordModal;
