import type { SectionPreviewDto, User } from "../../App";

/**
 * Type definitions for the React Navigation stack
 * Each screen is defined with its route parameters
 */
export type RootStackParamList = {
  // Authentication screens
  SignUp: undefined; // SignUp screen takes no parameters
  Login: undefined; // Login screen takes no parameters
  ResetPassword: { token: string }; // For password reset flow
  
  // Dashboard screens
  TeacherDashboard: User;
  StudentDashboard: User;
  
  // Profile screen
  Profile: { user: User };
  
  // Section details screens
  TeacherSectionDetails: {
    user: User;
    sectionPreview: SectionPreviewDto;
  };
  StudentSectionDetails: {
    user: User;
    sectionPreview: SectionPreviewDto;
  };
  
  // Grade view screens
  TeacherGradeView: {
    user: User;
    sectionPreview: SectionPreviewDto;
    student: User;
  };
  StudentGradeView: {
    user: User;
    sectionPreview: SectionPreviewDto;
  };
};