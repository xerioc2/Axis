export type User = {
  user_id: string,
  first_name: string,
  last_name: string,
  email: string,
  school_id: number,
  user_type_id: number
}

export type RootStackParamList = {
    SignUp: undefined; // SignUp screen takes NO parameters
    Login: undefined; // Login screen takes NO parameters
    TeacherDashboard: User;
    StudentDashboard: User;
  };