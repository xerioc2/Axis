import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../utils/navigation.types";
import type { User } from "@/App";
import ErrorMessage from "../../components/ErrorMessage";
import { login } from "../../service/supabaseService";
import { useFonts } from "expo-font";
import { Colors } from "../../theme";
import ForgotPasswordModal from "../auth/ForgotPasswordModal";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "Login">;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  useFonts({
    "Rexton Bold": require("../../assets/fonts/rexton_bold.otf"),
    Inter: require("../../assets/fonts/antonio_semibold.ttf"),
  });
  const [showResetModal, setShowResetModal] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const buttonEnabled = formData.email.trim() !== "" && formData.password !== "" && !isSubmitting;

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleLoginSubmission = async () => {
    if (!buttonEnabled) return;
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const user: User | null = await login(formData.email.trim(), formData.password);
      if (!user) {
        setErrorMessage("Login failed. Please check your email and password, then try again.");
        return;
      }

      if (user.user_type_id === 1) {
        navigation.replace("StudentDashboard", user);
      } else if (user.user_type_id === 2) {
        navigation.replace("TeacherDashboard", user);
      } else {
        setErrorMessage("This account does not have a supported student or teacher role.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.pageWrapper} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Image
          source={require("../../assets/images/axis_lettering.png")}
          style={styles.logo}
        />
        <Text style={styles.slogan}>WHERE LEARNING MEETS MASTERY</Text>

        <TextInput
          style={[
            styles.input,
            emailFocused && styles.inputFocused,
          ]}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
          placeholderTextColor={Colors.textInput}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
        />

        <TextInput
          style={[
            styles.input,
            passwordFocused && styles.inputFocused,
          ]}
          placeholder="Password"
          value={formData.password}
          onChangeText={(text) => handleChange("password", text)}
          placeholderTextColor={Colors.textInput}
          secureTextEntry
          autoComplete="current-password"
          onSubmitEditing={handleLoginSubmission}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
        />

        <TouchableOpacity
          style={[styles.button, !buttonEnabled && styles.buttonDisabled]}
          onPress={handleLoginSubmission}
          disabled={!buttonEnabled}
        >
          {isSubmitting ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.buttonText}>Sign In</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowResetModal(true)}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.footerTextWrapper}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {errorMessage !== "" && <ErrorMessage message={errorMessage} />}
      </View>

      <ForgotPasswordModal
        visible={showResetModal}
        onClose={() => setShowResetModal(false)}
      />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 30,
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: 125,
    resizeMode: "contain",
  },
  slogan: {
    color: Colors.secondary,
    fontFamily: "Rexton Bold",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: Colors.bottomBorder,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    fontFamily: "Inter",
    fontSize: 14,
    backgroundColor: "#fff",
  },
  inputFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  button: {
    backgroundColor: Colors.secondary,
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: Colors.grey,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    color: Colors.primary,
    fontSize: 12,
    marginTop: 10,
    fontWeight: "600",
  },
  footerTextWrapper: {
    flexDirection: "row",
    marginTop: 15,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: Colors.grey,
    marginRight: 5,
  },
  signUpText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
});
