import type { User } from "@/App";

export type RootStackParamList = {
    SignUp: undefined; // SignUp screen takes NO parameters
    Login: undefined; // Login screen takes NO parameters
    TeacherDashboard: User;
    StudentDashboard: User;
  };